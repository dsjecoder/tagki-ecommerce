// Tagki PostgreSQL REST API Backend Server
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Database connection pool setup (supports local PostgreSQL or Supabase PG)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tagki_db',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Self-healing database initialization helper
async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        name_en VARCHAR(100),
        icon VARCHAR(50),
        color VARCHAR(100)
      );

      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        category VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
        type VARCHAR(100),
        type_en VARCHAR(100),
        badge VARCHAR(50),
        image TEXT,
        original_price NUMERIC,
        price NUMERIC NOT NULL,
        rating NUMERIC DEFAULT 5.0,
        sold INTEGER DEFAULT 0,
        description TEXT,
        description_en TEXT,
        features TEXT[],
        variants JSONB,
        is_featured BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS orders (
        code VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        items TEXT NOT NULL,
        total_vnd NUMERIC NOT NULL,
        total_usd NUMERIC NOT NULL,
        method VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(50) PRIMARY KEY,
        value JSONB NOT NULL
      );
    `);

    // Ensure the is_featured column is present in case database already exists
    await pool.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
    `);

    // Ensure orders table has contact, notes, promo, referral, discount fields
    await pool.query(`
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS facebook VARCHAR(255) DEFAULT '';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS telegram VARCHAR(255) DEFAULT '';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS zalo VARCHAR(255) DEFAULT '';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS promo_code VARCHAR(100) DEFAULT '';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS referral_code VARCHAR(100) DEFAULT '';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_vnd NUMERIC DEFAULT 0;
    `);

    // Create promotions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS promotions (
        code VARCHAR(100) PRIMARY KEY,
        discount VARCHAR(50) NOT NULL,
        min_order NUMERIC DEFAULT 0,
        note VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create referrals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS referrals (
        code VARCHAR(100) PRIMARY KEY,
        referrer_name VARCHAR(255) NOT NULL,
        note VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create blogs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        summary TEXT,
        content TEXT,
        image TEXT,
        tags TEXT[],
        author VARCHAR(100) DEFAULT 'Admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✓ Database Tables initialized successfully!");
  } catch (err) {
    console.error("Error initializing database tables:", err);
  }
}

initDb();

// --- API ENDPOINTS ---

// 0. Healthcheck & Debug APIs
app.get('/api/health', (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
    }
  });
  res.json({
    status: "UP",
    timestamp: new Date(),
    version: "1.0.4",
    routes: routes
  });
});

// 1. Categories APIs
app.get('/api/categories', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM categories');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', async (req, res) => {
  const { id, name, name_en, icon, color } = req.body;
  try {
    await pool.query(
      'INSERT INTO categories (id, name, name_en, icon, color) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET name = $2, name_en = $3, icon = $4, color = $5',
      [id, name, name_en, icon, color]
    );
    res.json({ message: "Category saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.json({ message: "Category deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Products APIs
app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY sold DESC');
    res.json(rows.map(p => ({
      ...p,
      originalPrice: Number(p.original_price),
      price: Number(p.price),
      isFeatured: p.is_featured,
      original_price: undefined,
      is_featured: undefined
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { id, name, name_en, category, type, type_en, badge, image, originalPrice, price, rating, sold, description, description_en, features, variants, isFeatured } = req.body;
  try {
    await pool.query(
      `INSERT INTO products (id, name, name_en, category, type, type_en, badge, image, original_price, price, rating, sold, description, description_en, features, variants, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       ON CONFLICT (id) DO UPDATE SET name = $2, name_en = $3, category = $4, type = $5, type_en = $6, badge = $7, image = $8, original_price = $9, price = $10, rating = $11, sold = $12, description = $13, description_en = $14, features = $15, variants = $16, is_featured = $17`,
      [id, name, name_en, category, type, type_en, badge, image, originalPrice, price, rating || 5.0, sold || 0, description, description_en, features || [], JSON.stringify(variants || []), !!isFeatured]
    );
    res.json({ message: "Product saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: "Product deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Image Upload API
app.post('/api/upload', (req, res) => {
  try {
    const { image, name } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }
    // Return image payload
    res.json({ success: true, url: image, name: name || 'uploaded-image' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Orders APIs
app.get('/api/orders', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(rows.map(o => ({
      ...o,
      totalVnd: Number(o.total_vnd),
      totalUsd: Number(o.total_usd),
      discountVnd: Number(o.discount_vnd || 0),
      facebook: o.facebook || '',
      telegram: o.telegram || '',
      zalo: o.zalo || '',
      notes: o.notes || '',
      promoCode: o.promo_code || '',
      referralCode: o.referral_code || '',
      date: new Date(o.created_at).toLocaleString('vi-VN')
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const { code, email, items, totalVnd, totalUsd, method, status, facebook, telegram, zalo, notes, promoCode, referralCode, discountVnd } = req.body;
  try {
    await pool.query(
      `INSERT INTO orders (code, email, items, total_vnd, total_usd, method, status, facebook, telegram, zalo, notes, promo_code, referral_code, discount_vnd) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       ON CONFLICT (code) DO UPDATE SET email = $2, items = $3, total_vnd = $4, total_usd = $5, method = $6, status = $7, facebook = $8, telegram = $9, zalo = $10, notes = $11, promo_code = $12, referral_code = $13, discount_vnd = $14`,
      [code, email, items, totalVnd, totalUsd, method, status || 'pending', facebook || '', telegram || '', zalo || '', notes || '', promoCode || '', referralCode || '', discountVnd || 0]
    );
    res.json({ message: "Order placed successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:code/approve', async (req, res) => {
  try {
    await pool.query("UPDATE orders SET status = 'paid' WHERE code = $1", [req.params.code]);
    res.json({ message: "Order approved!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3a. Promotions APIs
app.get('/api/promotions', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM promotions ORDER BY created_at DESC');
    res.json(rows.map(r => ({
      code: r.code,
      discount: r.discount,
      minOrder: Number(r.min_order || 0),
      note: r.note || ''
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/promotions', async (req, res) => {
  const { code, discount, minOrder, note } = req.body;
  try {
    await pool.query(
      'INSERT INTO promotions (code, discount, min_order, note) VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO UPDATE SET discount = $2, min_order = $3, note = $4',
      [code.toUpperCase(), discount, minOrder || 0, note || '']
    );
    res.json({ message: "Promotion saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/promotions/:code', async (req, res) => {
  try {
    await pool.query('DELETE FROM promotions WHERE code = $1', [req.params.code.toUpperCase()]);
    res.json({ message: "Promotion deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3b. Referrals APIs
app.get('/api/referrals', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM referrals ORDER BY created_at DESC');
    res.json(rows.map(r => ({
      code: r.code,
      referrerName: r.referrer_name,
      note: r.note || ''
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/referrals', async (req, res) => {
  const { code, referrerName, note } = req.body;
  try {
    await pool.query(
      'INSERT INTO referrals (code, referrer_name, note) VALUES ($1, $2, $3) ON CONFLICT (code) DO UPDATE SET referrer_name = $2, note = $3',
      [code.toUpperCase(), referrerName, note || '']
    );
    res.json({ message: "Referral saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/referrals/:code', async (req, res) => {
  try {
    await pool.query('DELETE FROM referrals WHERE code = $1', [req.params.code.toUpperCase()]);
    res.json({ message: "Referral deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3c. Blogs APIs
app.get('/api/blogs', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(rows.map(r => ({
      id: r.id,
      title: r.title,
      summary: r.summary || '',
      content: r.content || '',
      image: r.image || '',
      tags: r.tags || [],
      author: r.author || 'Admin',
      date: new Date(r.created_at).toLocaleDateString('vi-VN')
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/blogs', async (req, res) => {
  const { id, title, summary, content, image, tags, author } = req.body;
  try {
    await pool.query(
      `INSERT INTO blogs (id, title, summary, content, image, tags, author)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET title = $2, summary = $3, content = $4, image = $5, tags = $6, author = $7`,
      [id, title, summary || '', content || '', image || '', tags || [], author || 'Admin']
    );
    res.json({ message: "Blog post saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM blogs WHERE id = $1', [req.params.id]);
    res.json({ message: "Blog post deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. System & Payment Settings APIs
app.get('/api/settings', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT value FROM settings WHERE key = 'branding'");
    if (rows.length > 0) {
      res.json(rows[0].value);
    } else {
      res.json({});
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT value FROM settings WHERE key = 'branding'");
    const current = (rows.length > 0 && rows[0].value) ? rows[0].value : {};
    const merged = { ...current, ...req.body };
    await pool.query(
      "INSERT INTO settings (key, value) VALUES ('branding', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
      [JSON.stringify(merged)]
    );
    res.json({ message: "Settings saved successfully!", settings: merged });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generic Settings key-value APIs
app.get('/api/settings/:key', async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT value FROM settings WHERE key = $1", [req.params.key]);
    if (rows.length > 0) {
      res.json(rows[0].value);
    } else {
      res.json(null);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/settings/:key', async (req, res) => {
  try {
    await pool.query(
      "INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2",
      [req.params.key, JSON.stringify(req.body)]
    );
    res.json({ message: "Settings saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Google OAuth Authentication API
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client();

app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || "429904534455-n7nkh8qe87b2piecusjfcig3hu8s0l2j.apps.googleusercontent.com"
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name || email.split('@')[0];
    const picture = payload.picture || '';

    const user = {
      id: "g_" + payload.sub,
      email: email,
      fullName: name,
      avatar: picture,
      role: email.includes('admin') || email.includes('support') ? 'admin' : 'customer'
    };

    // Ensure users table exists dynamically
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255),
        avatar TEXT,
        role VARCHAR(50) DEFAULT 'customer',
        ai_credits INTEGER DEFAULT 40,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_credits INTEGER DEFAULT 40;
    `);

    // Insert or update customer profile
    await pool.query(`
      INSERT INTO users (id, email, full_name, avatar, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET full_name = $3, avatar = $4
    `, [user.id, user.email, user.fullName, user.avatar, user.role]);

    res.json({ success: true, user });
  } catch (error) {
    console.error("Google Auth verification failed:", error);
    res.status(401).json({ success: false, message: error.message });
  }
});

// 5.1. Registered Users Management APIs
app.get('/api/users', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255),
        avatar TEXT,
        role VARCHAR(50) DEFAULT 'customer',
        status VARCHAR(50) DEFAULT 'active',
        ai_credits INTEGER DEFAULT 40,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // Ensure status column exists in case database table was created earlier
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
    `);
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_credits INTEGER DEFAULT 40;
    `);
    const { rows } = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json(rows.map(u => ({
      id: u.id,
      name: u.full_name || u.email.split('@')[0],
      email: u.email,
      auth: u.id && u.id.startsWith('g_') ? 'Google (Gmail)' : 'Standard Email',
      role: u.role || 'customer',
      status: u.status || 'active',
      ai_credits: u.ai_credits !== undefined && u.ai_credits !== null ? u.ai_credits : 40,
      date: new Date(u.created_at).toLocaleDateString('vi-VN')
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { id, name, email, role, status, password, ai_credits } = req.body;
  const userId = id || 'u_' + Date.now();
  const credits = ai_credits !== undefined && ai_credits !== null ? Number(ai_credits) : 40;
  try {
    // Ensure password column exists dynamically
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255) DEFAULT '';
    `);
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_credits INTEGER DEFAULT 40;
    `);
    await pool.query(`
      INSERT INTO users (id, email, full_name, role, status, password, ai_credits)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO UPDATE SET full_name = $3, role = $4, status = $5, password = COALESCE(NULLIF($6, ''), users.password), ai_credits = $7
    `, [userId, email, name, role || 'customer', status || 'active', password || '', credits]);
    res.json({ message: "User saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/users/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE users SET status = $1 WHERE id = $2', [status, req.params.id]);
    res.json({ message: "User status updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: "User deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. AI Copywriter API Route
app.post('/api/ai-copywriter', async (req, res) => {
  const { productName, features, tone, email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "EMAIL_REQUIRED" });
  }

  try {
    // 1. Check credits
    let userRes = await pool.query("SELECT ai_credits FROM users WHERE email = $1", [email]);
    if (userRes.rows.length === 0) {
      await pool.query(`
        INSERT INTO users (id, email, full_name, role, ai_credits)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO NOTHING
      `, ['admin_auto_' + Date.now(), email, 'Tagki Admin', 'admin', 1000]);
      
      userRes = await pool.query("SELECT ai_credits FROM users WHERE email = $1", [email]);
    }

    const currentCredits = userRes.rows[0].ai_credits !== null ? Number(userRes.rows[0].ai_credits) : 40;
    if (currentCredits <= 0) {
      return res.status(403).json({ error: "OUT_OF_CREDITS" });
    }

    // 2. Fetch AI configuration
    const configRes = await pool.query("SELECT value FROM settings WHERE key = $1", ['ai_copywriter_config']);
    let aiConfig = null;
    if (configRes.rows.length > 0) {
      const rawVal = configRes.rows[0].value;
      aiConfig = typeof rawVal === 'string' ? JSON.parse(rawVal) : rawVal;
    }

    if (!aiConfig) {
      aiConfig = {
        provider: process.env.GEMINI_API_KEY ? 'gemini' : 'openai',
        apiKey: process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || '',
        model: process.env.GEMINI_API_KEY ? 'gemini-1.5-flash' : 'gpt-4o-mini',
        systemPrompt: "Bạn là chuyên gia Copywriter E-commerce. Hãy tạo bài mô tả sản phẩm bằng định dạng HTML chuẩn (chứa <h2>, <h3>, <p>, <ul>, <li>, emoji/icon sinh động) theo công thức AIDA (Attention, Interest, Desire, Action) và tối ưu từ khóa SEO. Đầu ra chỉ trả về mã HTML sạch để chèn trực tiếp vào Editor, không bao gồm codeblock markdown (```html)."
      };
    }

    const { provider, apiKey, model, systemPrompt } = aiConfig;

    if (!apiKey) {
      return res.status(500).json({ error: "API_KEY_MISSING", message: "AI API Key is not configured." });
    }

    // Prepare user prompt with JSON structure instructions
    const jsonPromptInstructions = `
    
IMPORTANT: You MUST return a JSON object with exactly the following three keys:
{
  "name_en": "Dịch tên sản phẩm '${productName}' sang tiếng Anh ngắn gọn và chuyên nghiệp (ví dụ: 'ChatGPT Plus Account Upgrade')",
  "description_vi": "Bài viết mô tả sản phẩm bằng tiếng Việt dài khoảng 3-4 đoạn dựa trên ưu điểm/tính năng nổi bật theo định dạng HTML sạch (chứa <h2>, <h3>, <p>, <ul>, <li>, emoji/icon)",
  "description_en": "Bài viết mô tả sản phẩm bằng tiếng Anh khớp 100% về cấu trúc và định dạng HTML sạch của bài viết tiếng Việt ở trên"
}
Đầu ra chỉ chứa duy nhất khối JSON này, không chứa bất kỳ văn bản nào khác ngoài JSON, không bao gồm ký hiệu markdown \`\`\`json ở đầu và cuối.`;

    const userPrompt = `Tên sản phẩm: ${productName}\nƯu điểm/Tính năng nổi bật: ${features}\nTông giọng: ${tone || 'Thuyết phục bán hàng'}`;
    let htmlContent = "";

    // 3. Call AI service
    if (provider === 'gemini') {
      const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\n${jsonPromptInstructions}\n\nYêu cầu tạo bài viết cho:\n${userPrompt}` }]
            }
          ],
          generationConfig: { temperature: 0.7 }
        })
      });

      if (!apiResponse.ok) {
        let errMsg = "Gemini API error";
        try {
          const errorData = await apiResponse.json();
          errMsg = errorData.error?.message || JSON.stringify(errorData) || errMsg;
        } catch (e) {
          try {
            errMsg = await apiResponse.text() || errMsg;
          } catch (e2) {}
        }
        throw new Error(`${apiResponse.status}: ${errMsg}`);
      }

      const data = await apiResponse.json();
      htmlContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else {
      const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: `${systemPrompt}\n\n${jsonPromptInstructions}` },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7
        })
      });

      if (!apiResponse.ok) {
        let errMsg = "OpenAI API error";
        try {
          const errorData = await apiResponse.json();
          errMsg = errorData.error?.message || JSON.stringify(errorData) || errMsg;
        } catch (e) {
          try {
            errMsg = await apiResponse.text() || errMsg;
          } catch (e2) {}
        }
        throw new Error(`${apiResponse.status}: ${errMsg}`);
      }

      const data = await apiResponse.json();
      htmlContent = data.choices?.[0]?.message?.content || "";
    }

    // Clean JSON Markdown block formatting if generated by the LLM
    function cleanJsonOutput(text) {
      if (!text) return "";
      let cleaned = text.trim();
      cleaned = cleaned.replace(/^```json\s*/i, '');
      cleaned = cleaned.replace(/^```\s*/, '');
      cleaned = cleaned.replace(/\s*```$/, '');
      return cleaned.trim();
    }

    function cleanHtmlOutput(text) {
      if (!text) return "";
      let cleaned = text.trim();
      cleaned = cleaned.replace(/^```html\s*/i, '');
      cleaned = cleaned.replace(/^```\s*/, '');
      cleaned = cleaned.replace(/\s*```$/, '');
      return cleaned.trim();
    }

    let result = {
      name_en: productName,
      description_vi: "",
      description_en: ""
    };

    try {
      const parsed = JSON.parse(cleanJsonOutput(htmlContent));
      result.name_en = parsed.name_en || productName;
      result.description_vi = parsed.description_vi || "";
      result.description_en = parsed.description_en || "";
    } catch (e) {
      // Fallback
      const cleaned = cleanHtmlOutput(htmlContent);
      result.description_vi = cleaned;
      result.description_en = cleaned;
      result.name_en = productName;
    }

    // 4. Deduct credit
    const newCredits = currentCredits - 1;
    await pool.query("UPDATE users SET ai_credits = $1 WHERE email = $2", [newCredits, email]);

    res.json({
      success: true,
      content: result,
      remainingCredits: newCredits
    });

  } catch (error) {
    console.error("Express AI Copywriter error:", error);
    res.status(500).json({ error: "API_ERROR", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(`  Tagki PostgreSQL Server running on port ${PORT}`);
  console.log(`==========================================`);
});
