-- PostgreSQL Schema for Tagki Platform
-- Run this script in PostgreSQL to initialize tables & seed data

-- Drop tables if exists
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'customer', -- 'customer' or 'admin'
    balance_vnd NUMERIC(15, 2) DEFAULT 0,
    balance_usd NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE products (
    id VARCHAR(100) PRIMARY KEY,
    name_vi VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    type_vi VARCHAR(100) NOT NULL,
    type_en VARCHAR(100) NOT NULL,
    badge VARCHAR(50),
    image TEXT NOT NULL,
    original_price_vnd NUMERIC(15, 2),
    price_vnd NUMERIC(15, 2) NOT NULL,
    price_usd NUMERIC(10, 2) NOT NULL,
    rating NUMERIC(3, 1) DEFAULT 5.0,
    sold_count INT DEFAULT 0,
    description_vi TEXT,
    description_en TEXT,
    features_vi JSONB,
    features_en JSONB,
    variants JSONB,
    stock_status VARCHAR(50) DEFAULT 'in_stock',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    total_vnd NUMERIC(15, 2) NOT NULL,
    total_usd NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'vietqr' or 'crypto'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'delivered', 'cancelled'
    items JSONB NOT NULL,
    delivered_credentials TEXT, -- Account / Key delivery details
    facebook VARCHAR(255) DEFAULT '',
    telegram VARCHAR(255) DEFAULT '',
    zalo VARCHAR(255) DEFAULT '',
    notes TEXT DEFAULT '',
    promo_code VARCHAR(100) DEFAULT '',
    referral_code VARCHAR(100) DEFAULT '',
    discount_vnd NUMERIC DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Activity Logs (For Social Proof Notifications)
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- 'viewed', 'cart', 'purchased'
    product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    time_ago VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. System Settings Table
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL
);

-- 6. Promotions Table
CREATE TABLE promotions (
    code VARCHAR(100) PRIMARY KEY,
    discount VARCHAR(50) NOT NULL,
    min_order NUMERIC DEFAULT 0,
    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Referrals Table
CREATE TABLE referrals (
    code VARCHAR(100) PRIMARY KEY,
    referrer_name VARCHAR(255) NOT NULL,
    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Blogs Table
CREATE TABLE blogs (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content TEXT,
    image TEXT,
    tags TEXT[],
    author VARCHAR(100) DEFAULT 'Admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA

-- Seed Default Admin & Sample Users
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@tagki.vn', '$2b$10$e8Tq...adminhash', 'Tagki Admin', 'admin'),
('demo.user@gmail.com', NULL, 'Nguyễn Văn Nam', 'customer');

-- Seed Sample Products
INSERT INTO products (id, name_vi, name_en, category, type_vi, type_en, badge, image, original_price_vnd, price_vnd, price_usd, rating, sold_count, description_vi, description_en, features_vi, features_en, variants) VALUES
(
  'chatgpt-plus',
  'ChatGPT Plus (GPT-4o & Sora)',
  'ChatGPT Plus (GPT-4o & Sora)',
  'ai-tools',
  'Nâng cấp chính chủ',
  'Official Upgrade',
  'Bán Chạy',
  'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
  490000, 249000, 9.99, 4.9, 1420,
  'Tài khoản ChatGPT Plus chính chủ truy cập GPT-4o, DALL-E 3 và Voice Mode tốc độ cực nhanh.',
  'Official ChatGPT Plus personal upgrade with GPT-4o, DALL-E 3, and high speed priority access.',
  '["Mô hình GPT-4o mới nhất", "Tạo ảnh DALL-E 3", "Kích hoạt Email chính chủ", "Bảo hành trọn thời gian sử dụng"]'::jsonb,
  '["Latest GPT-4o model", "DALL-E 3 Image Generation", "Personal Email Activation", "Lifetime Warranty"]'::jsonb,
  '[{"label_vi": "1 Tháng", "label_en": "1 Month", "price_vnd": 249000, "price_usd": 9.99}, {"label_vi": "1 Năm", "label_en": "1 Year", "price_vnd": 2390000, "price_usd": 99.00}]'::jsonb
),
(
  'claude-pro',
  'Claude AI Pro (Claude 3.5 Sonnet)',
  'Claude AI Pro (Claude 3.5 Sonnet)',
  'ai-tools',
  'Nâng cấp chính chủ',
  'Official Upgrade',
  'Khuyên Dùng',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
  520000, 280000, 11.50, 5.0, 980,
  'Siêu AI hỗ trợ viết code, phân tích tài liệu PDF/Excel và văn bản chuyên sâu.',
  'Advanced AI assistant for coding, document analysis, and deep writing tasks.',
  '["Claude 3.5 Sonnet", "Cửa sổ ngữ cảnh 200K tokens", "Phân tích file lớn chính xác"]'::jsonb,
  '["Claude 3.5 Sonnet", "200K Context Window", "Large File Analysis"]'::jsonb,
  '[{"label_vi": "1 Tháng", "label_en": "1 Month", "price_vnd": 280000, "price_usd": 11.50}]'::jsonb
),
(
  'antigravity-pro',
  'Antigravity Pro - Nâng Cấp Chính Chủ',
  'Antigravity Pro - Official Personal Upgrade',
  'developer',
  'Nâng cấp chính chủ',
  'Official Upgrade',
  'Mới',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
  650000, 350000, 14.99, 5.0, 640,
  'Môi trường Agentic Coding đỉnh cao của Google DeepMind giúp tự động hóa lập trình.',
  'Google DeepMind Agentic Coding environment for automated software engineering.',
  '["Không giới hạn token quy trình Agentic", "Tích hợp Pro & Flash models", "Kích hoạt chính chủ 100%"]'::jsonb,
  '["Unlimited Agentic Tokens", "Pro & Flash Models Built-in", "100% Personal Activation"]'::jsonb,
  '[{"label_vi": "1 Tháng", "label_en": "1 Month", "price_vnd": 350000, "price_usd": 14.99}]'::jsonb
);

-- Seed System Settings (Banking VietQR & Crypto Config)
INSERT INTO system_settings (key, value) VALUES
('banking_config', '{
  "bank_name": "MB Bank",
  "account_number": "0839888823",
  "account_holder": "TAGKI DIGITAL SERVICES",
  "qr_template": "compact2"
}'::jsonb),
('crypto_config', '{
  "usdt_trc20_address": "TY4hP8...TagkiUSDTWalletAddress",
  "usd_to_vnd_rate": 25400
}'::jsonb);

-- Seed Social Proof Initial Logs
INSERT INTO activity_logs (user_name, location, action_type, product_id, product_name, time_ago) VALUES
('Anh Nam', 'Hà Nội', 'purchased', 'chatgpt-plus', 'ChatGPT Plus (GPT-4o & Sora)', '5 phút trước'),
('Nguyễn T.', 'TP. Hồ Chí Minh', 'cart', 'canva-pro', 'Canva Pro - Nâng Cấp Email', '2 phút trước'),
('Khách hàng', 'Đà Nẵng', 'viewed', 'cursor-pro', 'Cursor Pro - IDE AI Cho Lập Trình Viên', 'Vừa xong');
