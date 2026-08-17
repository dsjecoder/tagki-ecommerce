// Tagki Database API client wrapper (talks to PostgreSQL backend or falls back to LocalStorage)

const BACKEND_API_URL = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'http://localhost:3000/api'
  : 'https://tagki-backend.onrender.com/api';

async function dbFetch(endpoint) {
  try {
    const res = await fetch(`${BACKEND_API_URL}${endpoint}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn(`PostgreSQL backend server offline, falling back to local storage database for endpoint ${endpoint}`);
  }
  return null;
}

async function dbPost(endpoint, data) {
  try {
    const res = await fetch(`${BACKEND_API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (e) {
    console.error(`PostgreSQL backend offline, post request failed for endpoint ${endpoint}`);
    return false;
  }
}

async function dbDelete(endpoint) {
  try {
    const res = await fetch(`${BACKEND_API_URL}${endpoint}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (e) {
    console.error(`PostgreSQL backend offline, delete request failed for endpoint ${endpoint}`);
    return false;
  }
}

// Sync function to load catalog from PostgreSQL on Client load
async function syncDatabaseWithBackend() {
  // 1. Fetch Categories
  const categories = await dbFetch('/categories');
  if (categories && categories.length > 0) {
    const localCategories = (typeof getStoredCategories === 'function') ? getStoredCategories() : [];
    const merged = [...categories];
    localCategories.forEach(lc => {
      if (!merged.some(c => c.id === lc.id)) {
        merged.push(lc);
      }
    });
    saveStoredCategories(merged);
  }

  // 2. Fetch Products
  const products = await dbFetch('/products');
  if (products && products.length > 0) {
    const localProducts = (typeof getStoredProducts === 'function') ? getStoredProducts() : [];
    const merged = [...products];
    localProducts.forEach(lp => {
      if (!merged.some(p => p.id === lp.id)) {
        merged.push(lp);
      }
    });
    saveStoredProducts(merged);
  }

  // 3. Fetch Settings
  const settings = await dbFetch('/settings');
  if (settings && Object.keys(settings).length > 0) {
    saveStoredSettings(settings);
  }

  // 4. Fetch Promotions
  const promotions = await dbFetch('/promotions');
  if (promotions && promotions.length > 0) {
    localStorage.setItem('tagki_promotions', JSON.stringify(promotions));
  }

  // 5. Fetch Referrals
  const referrals = await dbFetch('/referrals');
  if (referrals && referrals.length > 0) {
    localStorage.setItem('tagki_referral_codes', JSON.stringify(referrals));
  }

  // 6. Fetch Blogs
  const blogs = await dbFetch('/blogs');
  if (blogs && blogs.length > 0) {
    localStorage.setItem('tagki_blogs', JSON.stringify(blogs));
  }

  // 7. Fetch Orders
  const orders = await dbFetch('/orders');
  if (orders && orders.length > 0) {
    localStorage.setItem('tagki_orders', JSON.stringify(orders));
  }

  // 8. Fetch Banners
  const banners = await dbFetch('/settings/banners');
  if (banners && banners.length > 0) {
    localStorage.setItem('tagki_banners', JSON.stringify(banners));
  }

  // 9. Fetch Users
  const users = await dbFetch('/users');
  if (users && users.length > 0) {
    localStorage.setItem('tagki_registered_users', JSON.stringify(users));
  }

  // 10. Fetch Admin Credentials Settings
  const adminCreds = await dbFetch('/settings/admin_creds');
  if (adminCreds) {
    localStorage.setItem('tagki_admin_creds', JSON.stringify(adminCreds));
  }
}

// Trigger initial sync on load if on index page
document.addEventListener('DOMContentLoaded', () => {
  syncDatabaseWithBackend().then(() => {
    if (typeof applySettingsToUI === 'function') applySettingsToUI();
    if (typeof renderProducts === 'function') renderProducts();
    if (typeof renderCategories === 'function') renderCategories();
    if (typeof renderFeaturedProducts === 'function') renderFeaturedProducts();
  });
});
