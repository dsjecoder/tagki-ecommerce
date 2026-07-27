// Tagki Multi-Language (i18n), Currency & Dynamic Branding Manager

const I18N_DATA = {
  vi: {
    top_guide: "Hướng dẫn mua hàng",
    top_promotions: "Ưu đãi khách hàng",
    top_2fa: "Công cụ 2FA",
    top_hotline: "Hotline: +84 908687510",
    search_placeholder: "Tìm kiếm tài khoản ChatGPT, Cursor, Canva, Key Office...",
    cart_btn: "Giỏ hàng",
    login_btn: "Đăng nhập",
    nav_home: "Trang chủ",
    nav_ai: "Công cụ AI",
    nav_dev: "Lập trình & Dev",
    nav_design: "Thiết kế & Đồ họa",
    nav_office: "Văn phòng",
    nav_services: "Dịch vụ Kỹ thuật",
    nav_2fa: "Công cụ 2FA",
    nav_profile: "Lịch sử mua hàng",
    nav_admin: "Quản trị Admin",
    hero_title: "Thế Giới Tài Khoản Số Cao Cấp",
    hero_subtitle: "Kích hoạt chính chủ 100%, bảo hành trọn đời & giao hàng tự động 24/7",
    category_title: "Danh mục nổi bật",
    product_title: "Sản phẩm & Dịch vụ Premium",
    buy_now: "Khám Phá Ngay",
    add_to_cart: "Thêm Vào Giỏ Hàng",
    view_details: "Xem chi tiết",
    sold: "Đã bán",
    rating: "Đánh giá",
    lifetime_warranty: "Bảo hành trọn đời",
    auto_delivery: "Giao hàng tự động 24/7",
    cart_title: "Giỏ Hàng Của Bạn",
    cart_empty: "Giỏ hàng của bạn đang trống",
    cart_empty_sub: "Hãy chọn các tài khoản Premium yêu thích để tiếp tục.",
    total_price: "Tổng cộng:",
    proceed_checkout: "Tiến Hành Thanh Toán",
    checkout_title: "Thanh Toán Đơn Hàng",
    checkout_sub: "Hệ thống tự động kích hoạt tài khoản/key ngay sau khi thanh toán thành công",
    tab_vietqr: "VIETQR NGÂN HÀNG",
    tab_oxapay: "OXAPAY CRYPTO",
    tab_binance: "BINANCE PAY",
    confirm_payment: "Xác Nhận Đã Thanh Toán",
    login_google: "Đăng nhập bằng Google (Gmail)",
    login_email: "Đăng nhập bằng Email",
    login_or: "HOẶC",
    email_label: "Địa chỉ Email",
    password_label: "Mật khẩu",
    name_label: "Họ và tên",
    login_submit: "Đăng nhập ngay",
    register_submit: "Tạo tài khoản mới",
    already_have_acc: "Đã có tài khoản? Đăng nhập",
    need_account: "Chưa có tài khoản? Đăng ký ngay",
    auth_subtitle: "Khám phá hệ sinh thái tài khoản số & dịch vụ công nghệ Tagki",
    auth_email_placeholder: "nhapemail@gmail.com",
    google_chooser_title: "Đăng nhập bằng Google",
    google_chooser_subtitle: "để tiếp tục đến Tagki",
    google_use_another: "Sử dụng một tài khoản khác",
    google_privacy_notice: "Để tiếp tục, Google sẽ chia sẻ tên, địa chỉ email, tùy chọn ngôn ngữ và ảnh hồ sơ của bạn với Tagki. Trước khi sử dụng ứng dụng này, bạn có thể xem lại chính sách bảo mật của ứng dụng.",
    twofa_title: "Xác Thực Bảo Mật 2FA",
    twofa_subtitle: "Tài khoản được bảo mật hai lớp Google Authenticator để bảo vệ số dư và đơn hàng.",
    twofa_secret_label: "🔑 Secret Key 2FA của bạn:",
    twofa_secret_help: "(Sao chép Secret Key dán vào **Công cụ 2FA** của shop hoặc Google Authenticator để lấy mã xác nhận 6 số)",
    twofa_input_label: "Nhập mã xác thực (6 số):",
    twofa_verify_btn: "Xác Minh & Đăng Nhập",
    currency_symbol: "đ",
    usd_currency_symbol: "$"
  },
  en: {
    top_guide: "Buying Guide",
    top_promotions: "Customer Offers",
    top_2fa: "2FA Tool",
    top_hotline: "Support: +84 908687510",
    search_placeholder: "Search ChatGPT, Cursor, Canva, Office Keys...",
    cart_btn: "Cart",
    login_btn: "Sign In",
    nav_home: "Home",
    nav_ai: "AI Tools",
    nav_dev: "Developer Tools",
    nav_design: "Design Suite",
    nav_office: "Office & Business",
    nav_services: "IT Services",
    nav_2fa: "2FA Generator",
    nav_profile: "Order History",
    nav_admin: "Admin Dashboard",
    hero_title: "Premium Digital Subscriptions Marketplace",
    hero_subtitle: "Official personal upgrades, lifetime warranty & 24/7 automated delivery",
    category_title: "Featured Categories",
    product_title: "Premium Products & Services",
    buy_now: "Explore Now",
    add_to_cart: "Add To Cart",
    view_details: "View Details",
    sold: "Sold",
    rating: "Rating",
    lifetime_warranty: "Lifetime Warranty",
    auto_delivery: "24/7 Auto Delivery",
    cart_title: "Your Shopping Cart",
    cart_empty: "Your cart is currently empty",
    cart_empty_sub: "Pick your favorite premium accounts to get started.",
    total_price: "Total Amount:",
    proceed_checkout: "Proceed To Checkout",
    checkout_title: "Order Checkout",
    checkout_sub: "Instant automated key/account delivery upon payment confirmation",
    tab_vietqr: "VIETQR BANKING",
    tab_oxapay: "OXAPAY CRYPTO",
    tab_binance: "BINANCE PAY",
    confirm_payment: "Confirm Payment Sent",
    login_google: "Sign in with Google (Gmail)",
    login_email: "Sign in with Email",
    login_or: "OR",
    email_label: "Email Address",
    password_label: "Password",
    name_label: "Full Name",
    login_submit: "Sign In Now",
    register_submit: "Create New Account",
    already_have_acc: "Already have an account? Sign in",
    need_account: "Need an account? Register now",
    auth_subtitle: "Discover the ecosystem of premium digital accounts & IT solutions by Tagki",
    auth_email_placeholder: "enteremail@gmail.com",
    google_chooser_title: "Sign in with Google",
    google_chooser_subtitle: "to continue to Tagki",
    google_use_another: "Use another account",
    google_privacy_notice: "To continue, Google will share your name, email address, language preference, and profile picture with Tagki. Before using this app, you can review its privacy policy.",
    twofa_title: "2FA Security Verification",
    twofa_subtitle: "Your account is protected with Google Authenticator two-factor security to safeguard your balance and orders.",
    twofa_secret_label: "🔑 Your 2FA Secret Key:",
    twofa_secret_help: "(Copy the Secret Key and paste it into the shop's **2FA Tool** or Google Authenticator to get the 6-digit confirmation code)",
    twofa_input_label: "Enter authentication code (6 digits):",
    twofa_verify_btn: "Verify & Sign In",
    currency_symbol: "$",
    usd_currency_symbol: "$"
  }
};

function detectBrowserLanguage() {
  const savedLang = localStorage.getItem('tagki_lang');
  if (savedLang) return savedLang;

  const browserLang = navigator.language || navigator.userLanguage || 'vi';
  return browserLang.toLowerCase().startsWith('vi') ? 'vi' : 'en';
}

let currentLang = detectBrowserLanguage();
const USD_TO_VND_RATE = 25400;

function applyLanguageClassToBody() {
  document.body.classList.remove('lang-vi', 'lang-en');
  document.body.classList.add(`lang-${currentLang}`);
}

function setLanguage(lang) {
  if (!I18N_DATA[lang]) return;
  currentLang = lang;
  localStorage.setItem('tagki_lang', lang);
  applyLanguageClassToBody();
  updateUIStrings();
  applySettingsToUI();
  if (typeof renderProducts === 'function') renderProducts();
  if (typeof renderFeaturedProducts === 'function') renderFeaturedProducts();
  if (typeof renderCategories === 'function') renderCategories();
  if (typeof renderCartDrawer === 'function') renderCartDrawer();
  if (typeof renderProfileOrders === 'function') renderProfileOrders();
  if (typeof renderFlashSale === 'function') renderFlashSale();
  if (typeof initCarousel === 'function') initCarousel();
  if (typeof renderBlogList === 'function') renderBlogList();
  if (typeof renderLatestBlogs === 'function') renderLatestBlogs();
  if (typeof renderBlogDetail === 'function') {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    if (blogId) renderBlogDetail(blogId);
  }
}

function t(key) {
  return I18N_DATA[currentLang]?.[key] || I18N_DATA['vi']?.[key] || key;
}

function formatCurrency(vndAmount, usdAmount = null) {
  if (currentLang === 'en') {
    const usd = usdAmount !== null ? usdAmount : (vndAmount / USD_TO_VND_RATE);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usd);
  } else {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(vndAmount);
  }
}

function updateUIStrings() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && t(key)) {
      if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
        el.placeholder = t(key);
      } else {
        el.textContent = t(key);
      }
    }
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    const lang = btn.getAttribute('data-lang');
    if (lang === currentLang) {
      btn.style.opacity = '1';
      btn.style.transform = 'scale(1.1)';
      btn.style.border = '2px solid white';
    } else {
      btn.style.opacity = '0.6';
      btn.style.transform = 'scale(1)';
      btn.style.border = 'none';
    }
  });
}

// Dynamically apply Admin Settings configurations (Logo, Hotline, Social links) to UI
function applySettingsToUI() {
  const s = STORE_DATA?.settings;
  if (!s) return;

  // 1. Logo text/image replacement
  document.querySelectorAll('.logo-area').forEach(el => {
    if (s.logoImage && s.logoImage.trim() !== '') {
      el.innerHTML = `<img src="${s.logoImage}" alt="${s.logoText || 'Logo'}" style="max-height: 40px; border-radius: 6px; object-fit: contain; vertical-align: middle;">`;
    } else {
      const text = s.logoText || 'TAGKI';
      el.innerHTML = `
        <div class="logo-icon" style="display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; background:white; color:var(--primary); font-weight:800; border-radius:var(--radius-md); box-shadow: 0 4px 10px rgba(0,0,0,0.15); margin-right:10px;">${text[0].toUpperCase()}</div>
        <span class="logo-text" style="font-size:1.4rem; font-weight:800; color:white; letter-spacing:-0.5px;">${text}</span>
      `;
    }
  });

  // 2. Hotline text/link replacement
  document.querySelectorAll('[data-i18n="top_hotline"]').forEach(el => {
    el.textContent = (currentLang === 'en' ? 'Support: ' : 'Hotline: ') + s.hotline;
  });
  
  const phoneBold = document.querySelector('.main-footer b');
  if (phoneBold) {
    phoneBold.textContent = s.hotline;
  }

  // 3. Floating Quick Contact links
  const floatZalo = document.querySelector('.float-zalo');
  if (floatZalo && s.zalo) floatZalo.href = s.zalo;
  
  const floatTelegram = document.querySelector('.float-telegram');
  if (floatTelegram && s.telegram) floatTelegram.href = s.telegram;

  const floatFb = document.querySelector('.float-fb');
  if (floatFb && s.facebook) floatFb.href = s.facebook;

  // 4. Footer Social links
  const footerLinks = document.querySelectorAll('.social-links a');
  footerLinks.forEach(el => {
    const title = el.getAttribute('title');
    if (title === 'Facebook Page' && s.facebook) el.href = s.facebook;
    if (title === 'Zalo Official' && s.zalo) el.href = s.zalo;
    if (title === 'Telegram Channel' && s.telegram) el.href = s.telegram;
    if (title === 'WhatsApp Business' && s.whatsapp) el.href = s.whatsapp;
    if (title === 'Twitter / X' && s.twitter) el.href = s.twitter;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyLanguageClassToBody();
  updateUIStrings();
  applySettingsToUI();
});
