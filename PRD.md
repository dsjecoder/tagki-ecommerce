# PRODUCT REQUIREMENT DOCUMENT (PRD)
## DỰ ÁN: TAGKI DIGITAL STORE (TAGKI E-COMMERCE)

* **Tên dự án:** Tagki E-Commerce (Tagki Digital Store)
* **Phiên bản:** 1.0 (Ready for Design & Engineering)
* **Trạng thái:** Approved / Ready for Sprint Planning
* **Chủ sở hữu:** Senior Product Manager & Solution Architect
* **Ngày tạo:** 16/08/2026

---

## 1. Executive Summary & Scope

### 1.1. Tầm nhìn sản phẩm (Product Vision)
**Tagki Digital Store** hướng đến vị thế là nền tảng thương mại điện tử chuyên biệt (Niche E-Commerce) hàng đầu cung cấp **tài khoản số, giấy phép phần mềm (software licenses), công cụ AI cao cấp (ChatGPT Plus, Claude Pro, Cursor, Antigravity...) và giải pháp công nghệ bản quyền**. 

Sản phẩm giải quyết triệt để bài toán:
* Khách hàng cá nhân & doanh nghiệp tiếp cận các công cụ SaaS/AI toàn cầu với chi phí tối ưu, phương thức thanh toán nội địa linh hoạt (VietQR, ví điện tử) và Crypto (USDT).
* Tự động hóa quy trình phân phối sản phẩm số (digital goods delivery), tra cứu mã 2FA trực tiếp, và bảo hành tài khoản minh bạch.

### 1.2. Mục tiêu kinh doanh & Chỉ số đo lường (OKRs & KPIs)
* **Business Goals:**
  * Đạt 10.000+ người dùng hoạt động hàng tháng (MAU) trong vòng 6 tháng đầu.
  * Tỷ lệ chuyển đổi đơn hàng (Conversion Rate) trên website đạt $\ge 4.5\%$.
  * Giảm thời gian xử lý và bàn giao thông tin đăng nhập/license xuống $< 5$ phút sau khi thanh toán thành công.
* **Key Metrics (KPIs):**
  * **GMV (Gross Merchandise Value):** Tổng giá trị giao dịch theo tháng (VND & USD).
  * **Cart Abandonment Rate:** Tỷ lệ bỏ giỏ hàng $< 35\%$.
  * **Average Order Value (AOV):** Giá trị đơn hàng trung bình.
  * **Customer Retention Rate:** Khách hàng quay lại mua gia hạn đạt $\ge 40\%$.

### 1.3. Phạm vi dự án (Scope of MVP & Future Phase)

#### In-Scope (Giai đoạn MVP / Hiện tại):
1. **Storefront & Catalog:** Danh mục sản phẩm công cụ AI, Developer, Đồ họa, Giải trí; Hỗ trợ biến thể (1 tháng, 1 năm, nâng cấp chính chủ / cấp sẵn); Bộ lọc, tìm kiếm, Flash Sale countdown.
2. **Cart & Checkout:** Giỏ hàng realtime, mã giảm giá (Promo Code), mã giới thiệu (Referral Code), thanh toán quét mã VietQR tự động và ví Crypto USDT TRC20.
3. **Utility Tools:** Trình giải mã và sinh mã xác thực 2FA (Two-Factor Authentication Tool) trực tiếp trên web cho khách hàng.
4. **Authentication & Profile:** Đăng nhập Google One-Tap / OAuth2, đăng nhập Email/Password, quản lý số dư (VND/USD), lịch sử đơn hàng, xem thông tin tài khoản được cấp.
5. **Growth & Social Proof:** Hệ thống popup thông báo đơn hàng và hoạt động realtime (Activity Logs).
6. **Localization & Currency:** Đa ngôn ngữ (Tiếng Việt / English), chuyển đổi tỷ giá động (VND / USD).
7. **Admin Management System:** Quản lý sản phẩm (CRUD), quản lý đơn hàng, bàn giao thông tin credentials, cài đặt cổng thanh toán, quản lý bài viết Blog, tích hợp AI Copywriter sinh nội dung tự động.

#### Out-of-Scope (Dành cho Phase 2 & Scale-up):
1. Tích hợp Webhook Webhooks/Banking Gateway tự động nhận diện biến động số dư ngân hàng 100% không qua xác nhận thủ công của admin (ví dụ: Casso / SePay API).
2. Hệ thống Affiliate / Hoa hồng đa cấp tự động rút tiền về tài khoản ngân hàng.
3. Ứng dụng di động Native (iOS / Android) - Hiện tập trung hoàn thiện Responsive Web & PWA.
4. Tự động gia hạn qua thẻ tín dụng quốc tế (Stripe / PayPal Subscription).

---

## 2. User Personas & User Journeys

### 2.1. User Personas

#### Persona 1: Nguyễn Văn Nam - AI Enthusiast & Software Engineer (End-User B2C)
* **Đặc điểm:** 26 tuổi, lập trình viên tại TP.HCM. Cần sử dụng ChatGPT Plus, Claude 3.5 Sonnet, Cursor Pro để tăng năng suất làm việc nhưng ngại thanh toán thẻ quốc tế vì phí chuyển đổi ngoại tệ cao hoặc bị chặn thẻ.
* **Nhu cầu cốt lõi:** Mua nhanh, thanh toán chuyển khoản quét QR hoặc Crypto, nhận tài khoản/nâng cấp email chính chủ ngay trong 5 phút, có bảo hành rõ ràng và công cụ lấy 2FA không cần cài app phụ.

#### Persona 2: Trần Thị Lan - Content Creator & Freelancer (End-User B2C)
* **Đặc điểm:** 23 tuổi, làm sáng tạo nội dung tại Hà Nội. Thường xuyên mua Canva Pro, Midjourney, Netflix.
* **Nhu cầu cốt lõi:** Giao diện trực quan trên điện thoại, giá cả rõ ràng, có khuyến mãi, hỗ trợ nhanh qua Zalo/Telegram nếu gặp sự cố đăng nhập.

#### Persona 3: Quản trị viên hệ thống - Admin / Store Operator (Internal Persona)
* **Đặc điểm:** Quản lý kho sản phẩm, theo dõi đơn hàng, cập nhật tài khoản và viết bài SEO marketing.
* **Nhu cầu cốt lõi:** Bảng điều khiển (Admin Dashboard) tổng hợp doanh thu trực quan, thao tác bàn giao đơn hàng nhanh chóng, công cụ AI hỗ trợ viết mô tả sản phẩm và blog nhanh gấp 10 lần.

---

### 2.2. User Journeys & Workflow

#### Luồng Người mua hàng (Buyer User Flow):
```
[Truy cập Trang chủ Tagki] 
       │
       ├─► Tìm kiếm / Chọn danh mục (AI Tools, Developer,...)
       │        │
       │        └─► Xem chi tiết sản phẩm, chọn gói/biến thể (1 tháng, 1 năm)
       │                 │
       │                 └─► [Thêm vào giỏ hàng] hoặc [Mua ngay]
       │                          │
       ├─► [Xem Giỏ hàng & Checkout]
       │        │
       │        ├─► Nhập thông tin liên hệ (Email, Tên, Zalo/Telegram/FB)
       │        ├─► Nhập mã Voucher / Referral (nếu có)
       │        └─► Chọn phương thức: [VietQR] hoặc [Crypto USDT]
       │                 │
       │                 └─► [Tạo đơn hàng & Quét mã thanh toán]
       │                          │
       └─► [Nhận thông báo & Xem Credentials / Key] ──► [Sử dụng công cụ 2FA nếu cần]
```

#### Luồng Quản trị viên (Admin Operator Flow):
```
[Admin Đăng nhập] ──► [Dashboard Thống kê Doanh thu & Đơn hàng mới]
                            │
                            ├─► [Quản lý Đơn hàng] ──► Xác nhận đã thanh toán ──► Điền Account/Key giao khách
                            ├─► [Quản lý Sản phẩm] ──► Thêm/Sửa giá, mô tả, biến thể, gắn badge Flash Sale
                            ├─► [AI Copywriter] ────► Nhập prompt ──► Sinh bài viết Blog / Mô tả SEO
                            └─► [Cấu hình Hệ thống] ──► Thay đổi STK Ngân hàng, Tỷ giá USDT, Mã Promo
```

---

## 3. Functional Requirements (FR)

Phân loại theo chuẩn **MoSCoW**:
* **Must Have (M):** Bắt buộc phải có để hệ thống vận hành.
* **Should Have (S):** Quan trọng, mang lại giá trị trải nghiệm lớn.
* **Could Have (C):** Tính năng nâng cao, có thể bổ sung khi có thời gian.
* **Won't Have (W):** Tạm thời chưa triển khai trong bản MVP.

| Mã FR | Tên tính năng | User Story | Tiêu chí nghiệm thu (Acceptance Criteria) | Priority |
| :--- | :--- | :--- | :--- | :---: |
| **FR-01** | **Hiển thị & Bộ lọc Sản phẩm** | *Là khách hàng, tôi muốn xem danh sách sản phẩm theo danh mục, giá, đánh giá và tìm kiếm theo từ khóa để nhanh chóng tìm thấy công cụ cần mua.* | 1. Hiển thị thumbnail, tên (VI/EN), giá gốc, giá bán, badge giảm giá.<br>2. Hỗ trợ lọc theo danh mục: AI Tools, Developer, Giải trí, Đồ họa.<br>3. Tìm kiếm tức thì (live search) theo tên và mô tả. | **Must** |
| **FR-02** | **Biến thể sản phẩm (Variants)** | *Là khách hàng, tôi muốn chọn các gói thời gian (1 tháng, 6 tháng, 1 năm, vĩnh viễn) và loại hình (chính chủ / cấp sẵn) để xem giá tương ứng.* | 1. Thay đổi giá tự động khi người dùng click chọn biến thể.<br>2. Giá hiển thị chuẩn xác cả VND và USD theo tỷ giá cấu hình. | **Must** |
| **FR-03** | **Quản lý Giỏ hàng (Cart)** | *Là khách hàng, tôi muốn thêm nhiều sản phẩm vào giỏ, cập nhật số lượng hoặc xóa sản phẩm để chuẩn bị thanh toán.* | 1. Lưu giỏ hàng vào `localStorage` để không bị mất khi reload trang.<br>2. Badge số lượng giỏ hàng trên Header cập nhật realtime.<br>3. Tự động tính tổng tiền VND và USD. | **Must** |
| **FR-04** | **Thanh toán VietQR** | *Là khách hàng, tôi muốn quét mã QR chuyển khoản ngân hàng có sẵn số tiền và nội dung đơn hàng để chuyển tiền nhanh không sai sót.* | 1. Sinh ảnh mã VietQR tự động dựa trên STK, Ngân hàng, Số tiền và Mã đơn hàng.<br>2. Có nút "Sao chép số tài khoản" và "Sao chép nội dung chuyển khoản". | **Must** |
| **FR-05** | **Thanh toán Crypto (USDT TRC20)** | *Là khách hàng quốc tế/web3, tôi muốn thanh toán bằng USDT TRC20 vào địa chỉ ví của shop.* | 1. Hiển thị địa chỉ ví và QR Code ví TRC20.<br>2. Quy đổi chính xác số USDT cần chuyển dựa theo tỷ giá USD/VND hiện hành. | **Should** |
| **FR-06** | **Xác thực Google & Email** | *Là người dùng, tôi muốn đăng nhập một chạm qua Google hoặc email để quản lý đơn hàng và số dư của mình.* | 1. Tích hợp Google One-Tap / Google GSI OAuth2.<br>2. Hỗ trợ đăng ký/đăng nhập truyền thống bằng email/mật khẩu.<br>3. Lưu phiên đăng nhập an toàn (JWT hoặc Session). | **Must** |
| **FR-07** | **Trang cá nhân & Lịch sử đơn hàng** | *Là người dùng, tôi muốn xem lại các đơn hàng đã mua và lấy thông tin tài khoản (credentials/license key).* | 1. Danh sách đơn hàng: Mã đơn, ngày tạo, tổng tiền, trạng thái (pending/paid/delivered).<br>2. Nếu đơn hàng trạng thái `delivered`, hiển thị khung thông tin tài khoản được cấp kèm nút Copy. | **Must** |
| **FR-08** | **Công cụ Lấy mã 2FA (2FA Tool)** | *Là khách hàng mua tài khoản dùng chung/chính chủ có 2FA, tôi muốn dán mã Secret Key 2FA để nhận mã OTP 6 số ngay trên web.* | 1. Modal 2FA sinh mã OTP 6 số theo chuẩn TOTP RFC 6238.<br>2. Có đồng hồ đếm ngược 30s và nút copy mã 1-click. | **Should** |
| **FR-09** | **Mã Khuyến mãi & Referral** | *Là khách hàng, tôi muốn áp dụng mã Coupon hoặc mã giới thiệu của bạn bè để được giảm giá.* | 1. Kiểm tra tính hợp lệ của mã promo (hạn dùng, giá trị đơn tối thiểu).<br>2. Áp dụng giảm theo % hoặc số tiền cố định, trừ trực tiếp vào tổng tiền thanh toán. | **Should** |
| **FR-10** | **Social Proof Notification** | *Là khách truy cập, tôi muốn thấy thông báo những khách hàng vừa mua hàng để tăng độ tin cậy.* | 1. Popup nhỏ góc màn hình xuất hiện ngẫu nhiên theo chu kỳ từ dữ liệu `activity_logs`.<br>2. Khách hàng có thể tắt nếu không muốn hiển thị. | **Could** |
| **FR-11** | **Flash Sale & Countdown Timer** | *Là người mua, tôi muốn thấy đồng hồ đếm ngược Flash Sale để nắm bắt thời điểm khuyến mãi tốt nhất.* | 1. Countdown timer đếm ngược giờ:phút:giây trên banner và card sản phẩm khuyến mãi. | **Could** |
| **FR-12** | **Đa ngôn ngữ & Chuyển đổi tiền tệ** | *Là khách hàng nước ngoài, tôi muốn chuyển giao diện sang tiếng Anh và giá tiền sang USD.* | 1. Nút toggle chuyển đổi VI/EN thay đổi toàn bộ nhãn tĩnh và mô tả sản phẩm.<br>2. Chuyển đổi định dạng `249.000 ₫` $\leftrightarrow$ `$9.99`. | **Must** |
| **FR-13** | **Admin: Quản lý Sản phẩm (CRUD)** | *Là Admin, tôi muốn thêm mới, sửa giá, ẩn/hiện, upload ảnh, quản lý tính năng và biến thể sản phẩm.* | 1. Form quản lý trực quan hỗ trợ cấu hình đa ngôn ngữ (name_vi, name_en, features, variants).<br>2. Hỗ trợ đánh dấu sản phẩm "Nổi bật / Bán chạy / Flash Sale". | **Must** |
| **FR-14** | **Admin: Quản lý Đơn hàng & Giao key** | *Là Admin, tôi muốn xem danh sách đơn mới, đổi trạng thái thanh toán và nhập credentials để gửi khách.* | 1. Danh sách lọc theo trạng thái: Chờ thanh toán, Đã thanh toán, Đã giao, Hủy.<br>2. Khung soạn thảo `delivered_credentials` để bàn giao user/pass/key. | **Must** |
| **FR-15** | **Admin: Cấu hình Hệ thống (Settings)** | *Là Admin, tôi muốn đổi số tài khoản nhận tiền VietQR, địa chỉ ví USDT và tỷ giá quy đổi mà không cần sửa code.* | 1. Lưu cấu hình dưới dạng JSONB trong bảng `system_settings`.<br>2. Thay đổi có hiệu lực ngay lập tức ngoài Storefront. | **Must** |
| **FR-16** | **Admin: AI Copywriter Assistant** | *Là Admin, tôi muốn dùng AI để tự động tạo bài viết Blog và nội dung mô tả sản phẩm chuẩn SEO.* | 1. Tích hợp AI Engine qua API endpoint `/app/api/ai-copywriter`.<br>2. Tạo tiêu đề, tóm tắt, nội dung HTML và thẻ tags tự động. | **Should** |

---

## 4. Data Model & Schema

Hệ thống sử dụng cơ sở dữ liệu quan hệ **PostgreSQL** (có thể lưu trữ trên Supabase hoặc Postgres độc lập).

```
                     ┌──────────────────┐
                     │      USERS       │
                     ├──────────────────┤
                     │ id (PK)          │
                     │ email            │
                     │ password_hash    │
                     │ role             │
                     │ balance_vnd      │
                     │ balance_usd      │
                     └────────┬─────────┘
                              │ 1
                              │
                              │ n
                     ┌────────┴─────────┐              ┌──────────────────┐
                     │      ORDERS      │              │     PRODUCTS     │
                     ├──────────────────┤              ├──────────────────┤
                     │ id (PK)          │              │ id (PK, slug)    │
                     │ order_code (UQ)  │              │ name_vi / name_en│
                     │ user_id (FK)     │              │ category         │
                     │ customer_email   │              │ price_vnd / usd  │
                     │ total_vnd / usd  │              │ variants (JSONB) │
                     │ payment_method   │              │ features (JSONB) │
                     │ status           │              │ badge, image     │
                     │ items (JSONB)    │              └────────┬─────────┘
                     │ credentials      │                       │ 1
                     └──────────────────┘                       │ n
                                                       ┌────────┴─────────┐
                                                       │  ACTIVITY_LOGS   │
                                                       ├──────────────────┤
                                                       │ id (PK)          │
                                                       │ user_name        │
                                                       │ action_type      │
                                                       │ product_id (FK)  │
                                                       └──────────────────┘
```

### 4.1. Chi tiết các bảng dữ liệu (Data Dictionaries)

#### 1. Bảng `users` (Người dùng & Phân quyền)
* `id` (SERIAL PRIMARY KEY)
* `email` (VARCHAR(255), UNIQUE, NOT NULL)
* `password_hash` (VARCHAR(255), NULLABLE cho Google Auth)
* `full_name` (VARCHAR(255), NOT NULL)
* `google_id` (VARCHAR(255), UNIQUE, NULLABLE)
* `avatar_url` (TEXT)
* `role` (VARCHAR(50), DEFAULT 'customer') — Enum: `'customer'`, `'admin'`, `'support'`
* `balance_vnd` (NUMERIC(15,2), DEFAULT 0)
* `balance_usd` (NUMERIC(10,2), DEFAULT 0)
* `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

#### 2. Bảng `products` (Kho sản phẩm & Dịch vụ)
* `id` (VARCHAR(100) PRIMARY KEY) — Mã định danh / Slug (VD: `chatgpt-plus`, `claude-pro`)
* `name_vi`, `name_en` (VARCHAR(255), NOT NULL)
* `category` (VARCHAR(100), NOT NULL) — VD: `ai-tools`, `developer`, `design`, `entertainment`
* `type_vi`, `type_en` (VARCHAR(100)) — VD: `Nâng cấp chính chủ`, `Tài khoản cấp sẵn`
* `badge` (VARCHAR(50)) — VD: `Bán Chạy`, `Hot`, `Flash Sale`
* `image` (TEXT, NOT NULL)
* `original_price_vnd`, `price_vnd` (NUMERIC(15,2), NOT NULL)
* `price_usd` (NUMERIC(10,2), NOT NULL)
* `rating` (NUMERIC(3,1), DEFAULT 5.0)
* `sold_count` (INT, DEFAULT 0)
* `description_vi`, `description_en` (TEXT)
* `features_vi`, `features_en` (JSONB) — Danh sách tính năng nổi bật
* `variants` (JSONB) — Cấu trúc: `[{"label_vi": "1 Tháng", "label_en": "1 Month", "price_vnd": 249000, "price_usd": 9.99}]`
* `stock_status` (VARCHAR(50), DEFAULT 'in_stock')
* `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

#### 3. Bảng `orders` (Đơn hàng & Giao dịch)
* `id` (SERIAL PRIMARY KEY)
* `order_code` (VARCHAR(50), UNIQUE, NOT NULL) — VD: `TGK-892147`
* `user_id` (INT REFERENCES users(id), NULLABLE cho khách vãng lai)
* `customer_email` (VARCHAR(255), NOT NULL)
* `customer_name` (VARCHAR(255), NOT NULL)
* `total_vnd` (NUMERIC(15,2), NOT NULL)
* `total_usd` (NUMERIC(10,2), NOT NULL)
* `payment_method` (VARCHAR(50), NOT NULL) — Enum: `'vietqr'`, `'crypto'`, `'balance'`
* `status` (VARCHAR(50), DEFAULT 'pending') — Enum: `'pending'`, `'paid'`, `'delivered'`, `'cancelled'`
* `items` (JSONB, NOT NULL) — Chi tiết các món hàng và biến thể đã chọn
* `delivered_credentials` (TEXT) — Thông tin tài khoản/key bảo mật giao cho khách
* `facebook`, `telegram`, `zalo` (VARCHAR(255)) — Kênh liên hệ bổ sung
* `notes` (TEXT)
* `promo_code`, `referral_code` (VARCHAR(100))
* `discount_vnd` (NUMERIC, DEFAULT 0)
* `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

#### 4. Bảng `system_settings` (Cấu hình hệ thống động)
* `key` (VARCHAR(100) PRIMARY KEY) — VD: `banking_config`, `crypto_config`, `general_config`
* `value` (JSONB NOT NULL) — Lưu trữ linh hoạt thông tin ngân hàng, ví USDT, tỷ giá USD/VND.

#### 5. Bảng `promotions` & `referrals` (Mã giảm giá & Giới thiệu)
* `code` (VARCHAR(100) PRIMARY KEY)
* `discount` (VARCHAR(50) NOT NULL) — VD: `10%` hoặc `50000`
* `min_order` (NUMERIC, DEFAULT 0)
* `note` / `referrer_name` (VARCHAR(255))
* `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

#### 6. Bảng `blogs` (Bài viết tin tức & Hướng dẫn SEO)
* `id` (VARCHAR(100) PRIMARY KEY, slug)
* `title` (VARCHAR(255), NOT NULL)
* `summary` (TEXT)
* `content` (TEXT, HTML Markdown)
* `image` (TEXT)
* `tags` (TEXT[])
* `author` (VARCHAR(100), DEFAULT 'Admin')
* `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

---

## 5. Non-Functional Requirements (NFR)

### 5.1. Hiệu năng & Khả năng chịu tải (Performance & Scalability)
* **Page Load Time:** Tốc độ tải trang đầu tiên (First Contentful Paint - FCP) $< 1.2\text{s}$; Time to Interactive (TTI) $< 2.0\text{s}$ trên đường truyền 4G tiêu chuẩn.
* **Tối ưu hình ảnh:** Hỗ trợ định dạng WebP/AVIF, lazy loading hình ảnh sản phẩm.
* **Database Query Performance:** Các trường tra cứu chính (`order_code`, `email`, `category`, `product_id`) đều có Database Indexing; thời gian phản hồi API trung bình $< 150\text{ms}$.

### 5.2. Bảo mật & An toàn dữ liệu (Security & Compliance)
* **Xác thực & Phân quyền:**
  * Mật khẩu mã hóa 1 chiều bằng thuật toán `bcrypt` (salt rounds $\ge 10$).
  * Phân quyền Role-Based Access Control (RBAC): Chỉ tài khoản `role = 'admin'` mới có quyền truy cập endpoint `/api/admin/*`.
* **Bảo mật giao dịch:**
  * Thông tin bàn giao tài khoản (`delivered_credentials`) chỉ hiển thị cho chính chủ sở hữu đơn hàng (qua email xác thực hoặc phiên đăng nhập).
  * Chống tấn công brute force và Rate Limiting trên các endpoint nhạy cảm (`/api/auth/*`, `/api/orders`).
  * Sử dụng HTTPS bắt buộc và Content Security Policy (CSP).

### 5.3. Trải nghiệm người dùng & Tương thích (UX & Compatibility)
* **Responsive Design:** Tương thích hoàn hảo trên các độ phân giải: Mobile (375px - 480px), Tablet (768px - 1024px), Desktop (1280px+).
* **Cross-Browser:** Hỗ trợ Chrome, Safari, Edge, Firefox trên cả iOS, Android, macOS và Windows.

### 5.4. Tối ưu hóa công cụ tìm kiếm (SEO)
* Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`).
* Thẻ Title, Meta Description chuẩn SEO trên từng trang.
* Cung cấp OpenGraph tags (OG Image, OG Title) để hiển thị đẹp khi chia sẻ link lên Facebook, Zalo, Telegram.

---

## 6. Technical & Third-Party Integrations

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TAGKI ECOSYSTEM STACK                          │
├────────────────────────────────────────────────────────────────────────┤
│  Frontend: HTML5, Modern CSS3 (Variables, Flex/Grid), Vanilla ES6 JS   │
│  Icons: Lucide Icons CDN                                               │
├────────────────────────────────────────────────────────────────────────┤
│  API Backend: Node.js + Express.js REST API                            │
│  AI Engine: Next.js Route Handler / Google Gemini & OpenAI API         │
├────────────────────────────────────────────────────────────────────────┤
│  Database & Auth: PostgreSQL / Supabase + Google GSI OAuth2            │
├────────────────────────────────────────────────────────────────────────┤
│  Third-Party Services:                                                 │
│  - VietQR API: Sinh mã QR chuyển khoản ngân hàng tự động               │
│  - TOTP Library: Sinh mã xác thực 2FA Client-side                     │
│  - Cloud Storage: Cloudinary / Supabase Storage (Lưu trữ ảnh sản phẩm) │
│  - Deployment: Vercel / Render / VPS Linux                             │
└────────────────────────────────────────────────────────────────────────┘
```

* **Cổng thanh toán VietQR:** Sử dụng chuẩn mã Quick Response của Napas 247 (`https://img.vietqr.io/image/...`) tự động gán số tiền và cú pháp `order_code`.
* **Google Identity Services (GSI):** Xác thực tài khoản Google tức thì với thư viện `google-auth-library` ở phía Backend để verify Google ID Token an toàn.
* **AI Copywriter:** Tích hợp API Gemini / Claude / GPT hỗ trợ đội ngũ biên tập nội dung marketing, mô tả sản phẩm và viết blog tự động.

---

## 7. Release Roadmap / Phân kỳ Triển khai (Sprint Plan)

### Giai đoạn 1: MVP Core Launch (Hoàn thành trong Sprint 1 & 2)
* [x] Xây dựng Database Schema chuẩn trên PostgreSQL & seed dữ liệu ban đầu.
* [x] Hoàn thiện giao diện Storefront, Giỏ hàng, Bộ lọc sản phẩm, Đa ngôn ngữ (VI/EN).
* [x] Tích hợp thanh toán quét mã VietQR và Crypto USDT.
* [x] Xây dựng công cụ lấy mã 2FA và hệ thống Social Proof.
* [x] Hoàn thiện Admin Dashboard: Quản lý sản phẩm, đơn hàng và cấu hình ngân hàng.

### Giai đoạn 2: User Engagement & Retention (Sprint 3 - 4)
* [ ] Tích hợp Webhook xác nhận thanh toán tự động (qua Casso / SePay API) để chuyển trạng thái `paid` trong 3 giây.
* [ ] Tích hợp hệ thống gửi Email thông báo tự động (kèm thông tin tài khoản/key) qua Resend / SendGrid / SMTP.
* [ ] Tự động hóa tính năng nạp tiền vào ví (`balance_vnd`, `balance_usd`) và trừ tiền trực tiếp khi mua.
* [ ] Bổ sung tính năng Khách hàng đánh giá (Reviews & Star Ratings) sau khi nhận đơn hàng.

### Giai đoạn 3: Scale-up & Automation (Sprint 5+)
* [ ] Tích hợp API kho Key tự động (Auto-delivery license keys qua hệ thống API của nhà cung cấp).
* [ ] Phát triển chương trình Tiếp thị liên kết (Affiliate Program) tạo link ref và tính hoa hồng tự động cho Publisher.
* [ ] Tối ưu hóa PWA (Progressive Web App) cho phép cài đặt app trực tiếp trên điện thoại không qua App Store.
