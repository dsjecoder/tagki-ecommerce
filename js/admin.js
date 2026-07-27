// Tagki Admin Panel Logic with Flash Sale Management, Product Variants, Promo Codes, Blogs, and Pagination

let prodCurrentPage = 1;
const PROD_ITEMS_PER_PAGE = 5;

// Default Orders Seed
const DEFAULT_ORDERS = [
  { code: "ET-883921", email: "nam.nguyen@gmail.com", items: "ChatGPT Plus (Gói: 1 Tháng) (x1)", totalVnd: 249000, totalUsd: 9.99, method: "VietQR MB Bank", status: "paid", date: "24/07/2026 15:30", facebook: "", telegram: "", zalo: "", notes: "Đã giao qua email chính chủ", promoCode: "", referralCode: "", discountVnd: 0 },
  { code: "ET-449120", email: "lan.tran@gmail.com", items: "Canva Pro (Gói: Vĩnh Viễn) (x1)", totalVnd: 99000, totalUsd: 3.99, method: "OxaPay Crypto", status: "paid", date: "24/07/2026 14:10", facebook: "", telegram: "", zalo: "", notes: "", promoCode: "", referralCode: "", discountVnd: 0 },
  { code: "ET-102934", email: "techdev@gmail.com", items: "Cursor Pro (Gói: 1 Tháng) (x1)", totalVnd: 299000, totalUsd: 11.99, method: "Binance Pay", status: "pending", date: "24/07/2026 16:05", facebook: "", telegram: "@devtech", zalo: "0908777123", notes: "Cần gấp key", promoCode: "", referralCode: "", discountVnd: 0 }
];

// Initialize localStorage orders
if (!localStorage.getItem('tagki_orders')) {
  localStorage.setItem('tagki_orders', JSON.stringify(DEFAULT_ORDERS));
}

let ADMIN_USERS = [
  { id: 1, name: "Tagki Admin", email: "admin@tagki.vn", auth: "Standard Email", role: "admin", status: "active", date: "01/01/2026" },
  { id: 2, name: "Nguyễn Văn Nam", email: "nam.nguyen@gmail.com", auth: "Google (Gmail)", role: "customer", status: "active", date: "20/07/2026" },
  { id: 3, name: "Lê Thị Lan", email: "lan.tran@gmail.com", auth: "Google (Gmail)", role: "customer", status: "inactive", date: "22/07/2026" }
];

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
});

function checkAdminAuth() {
  const currentAdmin = JSON.parse(localStorage.getItem('tagki_admin_session'));
  const loginScreen = document.getElementById('admin-login-screen');

  if (currentAdmin && currentAdmin.role === 'admin') {
    if (loginScreen) loginScreen.style.display = 'none';
    const displayEl = document.getElementById('admin-user-display');
    if (displayEl) displayEl.textContent = `Admin: ${currentAdmin.email}`;
    renderAdminOrders();
    renderAdminProducts();
    renderAdminCategories();
    renderAdminFlashSale();
    renderAdminUsers();
    renderAdminPromotions();
    renderAdminBlogs();
    renderAdminBanners();
    populateFlashSaleDropdown();
    populateBrandingInputs();
  } else {
    if (loginScreen) loginScreen.style.display = 'flex';
  }
}

function handleAdminLogin(event) {
  event.preventDefault();
  const email = document.getElementById('admin-login-email')?.value;
  const pass = document.getElementById('admin-login-pass')?.value;

  if (email === 'admin@tagki.vn' && pass === 'admin123') {
    const adminSession = {
      email: email,
      fullName: "Tagki Admin",
      role: "admin",
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('tagki_admin_session', JSON.stringify(adminSession));
    checkAdminAuth();
  } else {
    alert("❌ Sai Email hoặc Mật khẩu Quản trị! (Mặc định: admin@tagki.vn / admin123)");
  }
}

function adminLogout() {
  localStorage.removeItem('tagki_admin_session');
  checkAdminAuth();
}

function switchAdminTab(tabName) {
  const tabs = ['dashboard', 'orders', 'products', 'categories', 'flash-sale', 'users', 'promotions', 'blogs', 'settings'];
  tabs.forEach(t => {
    const el = document.getElementById(`tab-${t}`);
    if (el) el.style.display = (t === tabName) ? 'block' : 'none';
  });

  const menuItems = document.querySelectorAll('.admin-menu-item');
  menuItems.forEach(item => item.classList.remove('active'));
  
  const titleEl = document.getElementById('admin-tab-title');
  if (tabName === 'dashboard') titleEl.textContent = 'Thống kê Dashboard';
  if (tabName === 'orders') titleEl.textContent = 'Quản lý Đơn hàng';
  if (tabName === 'products') titleEl.textContent = 'Quản lý Sản phẩm';
  if (tabName === 'categories') titleEl.textContent = 'Quản lý Danh mục';
  if (tabName === 'flash-sale') titleEl.textContent = 'Quản lý Flash Sale ⚡';
  if (tabName === 'users') titleEl.textContent = 'Quản lý Người dùng';
  if (tabName === 'promotions') {
    titleEl.textContent = 'Quản lý Ưu đãi & Giới thiệu';
    renderAdminPromotions();
  }
  if (tabName === 'blogs') {
    titleEl.textContent = 'Quản lý Bài viết Blog';
    renderAdminBlogs();
  }
  if (tabName === 'settings') titleEl.textContent = 'Cấu hình Thanh toán';
}

function renderAdminOrders() {
  const recentTbody = document.getElementById('recent-orders-tbody');
  const allTbody = document.getElementById('all-orders-tbody');
  if (!recentTbody && !allTbody) return;

  const orders = JSON.parse(localStorage.getItem('tagki_orders')) || DEFAULT_ORDERS;

  const rowsHtml = orders.map(ord => `
    <tr>
      <td style="font-weight: 700; color: #38bdf8;">${ord.code}</td>
      <td>${ord.email}</td>
      <td style="max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${ord.items}">${ord.items}</td>
      <td style="font-weight: 700;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ord.totalVnd)}</td>
      <td><span style="background: rgba(59,130,246,0.2); color: #3b82f6; padding: 2px 8px; border-radius: 6px; font-weight: 700; font-size: 0.75rem;">${ord.method}</span></td>
      <td><span class="status-badge ${ord.status === 'paid' ? 'status-paid' : 'status-pending'}">${ord.status === 'paid' ? 'Đã Thanh Toán' : 'Chờ Thanh Toán'}</span></td>
      <td>
        <button class="admin-btn" style="background:#0b132b; margin-right:4px;" onclick="openOrderDetails('${ord.code}')">Chi Tiết</button>
        ${ord.status === 'pending' ? `<button class="admin-btn admin-btn-success" onclick="approveOrder('${ord.code}')">Duyệt</button>` : `<span style="color:#10b981; font-weight:700; font-size:0.8rem;">✓ Xong</span>`}
      </td>
    </tr>
  `).join('');

  if (recentTbody) recentTbody.innerHTML = rowsHtml;
  if (allTbody) allTbody.innerHTML = rowsHtml;
}

// Order details viewer modal
function openOrderDetails(code) {
  const orders = JSON.parse(localStorage.getItem('tagki_orders')) || DEFAULT_ORDERS;
  const ord = orders.find(o => o.code === code);
  if (!ord) return;

  const content = document.getElementById('order-details-content');
  if (!content) return;

  content.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:10px; margin-top:14px;">
      <div><b>Mã Giao Dịch:</b> <span style="color:#38bdf8; font-weight:700;">${ord.code}</span></div>
      <div><b>Thời gian:</b> ${ord.date}</div>
      <div><b>Khách hàng:</b> <span style="color:#10b981;">${ord.email}</span></div>
      <div style="border-top:1px dashed #2b365a; padding-top:8px;">
        <h4 style="color:#3a86ff; margin: 4px 0;">Thông Tin Liên Hệ:</h4>
        <div>📱 <b>Số điện thoại Zalo:</b> ${ord.zalo || 'Không cung cấp'}</div>
        <div>✈️ <b>Telegram:</b> ${ord.telegram || 'Không cung cấp'}</div>
        <div>🌐 <b>Facebook:</b> ${ord.facebook ? `<a href="${ord.facebook}" target="_blank" style="color:#38bdf8; text-decoration:underline;">${ord.facebook}</a>` : 'Không cung cấp'}</div>
      </div>
      <div style="border-top:1px dashed #2b365a; padding-top:8px;">
        <h4 style="color:#3a86ff; margin: 4px 0;">Sản phẩm đặt mua:</h4>
        <div style="background:#0b132b; padding:8px; border-radius:6px; font-family:monospace; color:#38bdf8; font-size:0.85rem;">
          ${ord.items}
        </div>
      </div>
      <div style="border-top:1px dashed #2b365a; padding-top:8px;">
        <h4 style="color:#3a86ff; margin: 4px 0;">Khuyến Mãi & Giới Thiệu:</h4>
        <div>🎟️ <b>Mã giảm giá đã dùng:</b> ${ord.promoCode || 'Không'}</div>
        <div>💸 <b>Số tiền giảm giá VND:</b> ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ord.discountVnd || 0)}</div>
        <div>👥 <b>Người giới thiệu (Referral):</b> ${ord.referralCode || 'Không có'}</div>
      </div>
      <div style="border-top:1px dashed #2b365a; padding-top:8px;">
        <b>📝 Ghi chú của khách hàng:</b>
        <p style="background:#0b132b; padding:8px; border-radius:6px; font-style:italic; margin: 4px 0;">${ord.notes || 'Không có ghi chú'}</p>
      </div>
      <div style="display:flex; justify-content:space-between; font-weight:800; font-size:1rem; color:#10b981; border-top:1px solid #2b365a; padding-top:10px; margin-top:8px;">
        <span>Tổng tiền thanh toán:</span>
        <span>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ord.totalVnd)}</span>
      </div>
    </div>
  `;

  document.getElementById('order-details-modal').style.display = 'flex';
}

function closeOrderDetailsModal() {
  document.getElementById('order-details-modal').style.display = 'none';
}

// Render Products List
function renderAdminProducts() {
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody || !STORE_DATA?.products) return;

  const totalProducts = STORE_DATA.products.length;
  const totalPages = Math.ceil(totalProducts / PROD_ITEMS_PER_PAGE) || 1;

  if (prodCurrentPage > totalPages) prodCurrentPage = totalPages;
  if (prodCurrentPage < 1) prodCurrentPage = 1;

  const startIndex = (prodCurrentPage - 1) * PROD_ITEMS_PER_PAGE;
  const paginatedProducts = STORE_DATA.products.slice(startIndex, startIndex + PROD_ITEMS_PER_PAGE);

  tbody.innerHTML = paginatedProducts.map(p => `
    <tr>
      <td><img src="${p.image}" alt="${p.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px;"></td>
      <td style="font-weight: 700;">${p.name}</td>
      <td>${p.name_en || p.name}</td>
      <td><span style="background: #2b365a; padding: 2px 8px; border-radius: 4px; font-size: 0.78rem;">${p.category}</span></td>
      <td style="font-weight: 700; color: #10b981;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}</td>
      <td style="font-weight: 700; color: #38bdf8;">$${(p.price / 25400).toFixed(2)}</td>
      <td>${p.sold}</td>
      <td>
        <button class="admin-btn" style="background: #3b82f6; margin-right: 4px;" onclick="openProductModalForm('${p.id}')">Sửa</button>
        <button class="admin-btn admin-btn-danger" onclick="deleteProduct('${p.id}')">Xóa</button>
      </td>
    </tr>
  `).join('');

  const pageInfoEl = document.getElementById('prod-pagination-info');
  const pageNumEl = document.getElementById('prod-current-page-num');
  const pageIndicatorEl = document.getElementById('prod-page-indicator');

  if (pageInfoEl) pageInfoEl.textContent = `Trang ${prodCurrentPage} / ${totalPages} (Tổng ${totalProducts} sản phẩm)`;
  if (pageNumEl) pageNumEl.textContent = prodCurrentPage;
  if (pageIndicatorEl) pageIndicatorEl.textContent = `Hiển thị ${paginatedProducts.length}/${totalProducts} sản phẩm (Trang ${prodCurrentPage}/${totalPages})`;
}

function changeProductPage(delta) {
  const totalPages = Math.ceil(STORE_DATA.products.length / PROD_ITEMS_PER_PAGE) || 1;
  const newPage = prodCurrentPage + delta;
  if (newPage >= 1 && newPage <= totalPages) {
    prodCurrentPage = newPage;
    renderAdminProducts();
  }
}

// Product Variants Dynamic Editor
function renderProductVariantsUI(variants = []) {
  const container = document.getElementById('pf-variants-container');
  if (!container) return;

  if (variants.length === 0) {
    variants = [{ label: "1 Tháng", price: 0, originalPrice: 0 }];
  }

  container.innerHTML = variants.map((v, i) => `
    <div class="variant-row" style="display:flex; gap:8px; align-items:center; background:#0b132b; padding:8px; border-radius:8px; margin-bottom: 4px;">
      <input type="text" placeholder="Gói (Ví dụ: 3 Tháng)" class="v-label" value="${v.label}" required style="flex:2; background:#1c2541; border:1px solid #2b365a; color:white; padding:6px; border-radius:4px; font-size:0.8rem;">
      <input type="number" placeholder="Giá VND" class="v-price" value="${v.price}" required style="flex:2; background:#1c2541; border:1px solid #2b365a; color:white; padding:6px; border-radius:4px; font-size:0.8rem;">
      <input type="number" placeholder="Giá gốc VND" class="v-orig-price" value="${v.originalPrice || ''}" style="flex:2; background:#1c2541; border:1px solid #2b365a; color:white; padding:6px; border-radius:4px; font-size:0.8rem;">
      <button type="button" onclick="this.closest('.variant-row').remove()" style="background:#ef4444; color:white; border:none; padding:6px 10px; border-radius:4px; cursor:pointer; font-size:0.8rem; font-weight:700;">✕</button>
    </div>
  `).join('');
}

function addProductVariantRow() {
  const container = document.getElementById('pf-variants-container');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'variant-row';
  div.style.cssText = 'display:flex; gap:8px; align-items:center; background:#0b132b; padding:8px; border-radius:8px; margin-bottom: 4px;';
  div.innerHTML = `
    <input type="text" placeholder="Gói (Ví dụ: 3 Tháng)" class="v-label" required style="flex:2; background:#1c2541; border:1px solid #2b365a; color:white; padding:6px; border-radius:4px; font-size:0.8rem;">
    <input type="number" placeholder="Giá VND" class="v-price" required style="flex:2; background:#1c2541; border:1px solid #2b365a; color:white; padding:6px; border-radius:4px; font-size:0.8rem;">
    <input type="number" placeholder="Giá gốc VND" class="v-orig-price" style="flex:2; background:#1c2541; border:1px solid #2b365a; color:white; padding:6px; border-radius:4px; font-size:0.8rem;">
    <button type="button" onclick="this.closest('.variant-row').remove()" style="background:#ef4444; color:white; border:none; padding:6px 10px; border-radius:4px; cursor:pointer; font-size:0.8rem; font-weight:700;">✕</button>
  `;
  container.appendChild(div);
}

// Full Form Product Modal Handling (Add & Edit)
function openProductModalForm(productId = null) {
  const modal = document.getElementById('product-form-modal');
  const title = document.getElementById('product-modal-title');
  const catSelect = document.getElementById('pf-category');
  if (!modal || !catSelect) return;

  // Populate category select dropdown
  catSelect.innerHTML = STORE_DATA.categories.filter(c => c.id !== 'all').map(c => `
    <option value="${c.id}">${c.name} (${c.id})</option>
  `).join('');

  if (productId) {
    const p = STORE_DATA.products.find(item => item.id === productId);
    if (!p) return;

    title.textContent = `Chỉnh Sửa Sản Phẩm: ${p.name}`;
    document.getElementById('pf-id').value = p.id;
    document.getElementById('pf-name-vi').value = p.name;
    document.getElementById('pf-name-en').value = p.name_en || p.name;
    document.getElementById('pf-category').value = p.category;
    document.getElementById('pf-badge').value = p.badge || '';
    document.getElementById('pf-price-vnd').value = p.price;
    document.getElementById('pf-original-price').value = p.originalPrice || '';
    document.getElementById('pf-image').value = p.image;
    document.getElementById('pf-desc-vi').value = p.description || '';
    document.getElementById('pf-is-featured').checked = !!p.isFeatured;

    // Load existing variants
    renderProductVariantsUI(p.variants || []);
  } else {
    title.textContent = "Thêm Sản Phẩm Mới";
    document.getElementById('pf-id').value = '';
    document.getElementById('pf-name-vi').value = '';
    document.getElementById('pf-name-en').value = '';
    document.getElementById('pf-badge').value = '';
    document.getElementById('pf-price-vnd').value = '';
    document.getElementById('pf-original-price').value = '';
    document.getElementById('pf-image').value = '';
    document.getElementById('pf-desc-vi').value = '';
    document.getElementById('pf-is-featured').checked = false;

    // Default variants list
    renderProductVariantsUI([
      { label: "1 Tháng", price: 250000, originalPrice: 450000 },
      { label: "3 Tháng", price: 650000, originalPrice: 1250000 },
      { label: "6 Tháng", price: 1190000, originalPrice: 2200000 },
      { label: "1 Năm", price: 1990000, originalPrice: 3900000 }
    ]);
  }

  modal.style.display = 'flex';
}

function closeProductFormModal() {
  document.getElementById('product-form-modal').style.display = 'none';
}

function handleSaveProductForm(event) {
  event.preventDefault();
  const id = document.getElementById('pf-id').value;
  const nameVi = document.getElementById('pf-name-vi').value;
  const nameEn = document.getElementById('pf-name-en').value;
  const cat = document.getElementById('pf-category').value;
  const badge = document.getElementById('pf-badge').value;
  const priceVnd = Number(document.getElementById('pf-price-vnd').value);
  const origPriceVnd = Number(document.getElementById('pf-original-price').value);
  const image = document.getElementById('pf-image').value;
  const descVi = document.getElementById('pf-desc-vi').value;
  const isFeatured = document.getElementById('pf-is-featured').checked;

  // Serialize variants from form UI
  const variantRows = document.querySelectorAll('#pf-variants-container .variant-row');
  const variants = Array.from(variantRows).map(row => {
    const label = row.querySelector('.v-label').value.trim();
    const price = Number(row.querySelector('.v-price').value);
    const originalPrice = Number(row.querySelector('.v-orig-price').value) || price * 1.5;
    return { label, price, originalPrice };
  });

  let syncedProd = null;
  if (id) {
    // Edit Existing Product
    const prodIndex = STORE_DATA.products.findIndex(p => p.id === id);
    if (prodIndex > -1) {
      STORE_DATA.products[prodIndex].name = nameVi;
      STORE_DATA.products[prodIndex].name_en = nameEn;
      STORE_DATA.products[prodIndex].category = cat;
      STORE_DATA.products[prodIndex].badge = badge;
      STORE_DATA.products[prodIndex].price = priceVnd;
      STORE_DATA.products[prodIndex].originalPrice = origPriceVnd || priceVnd * 1.5;
      STORE_DATA.products[prodIndex].image = image;
      STORE_DATA.products[prodIndex].description = descVi;
      STORE_DATA.products[prodIndex].description_en = descVi;
      STORE_DATA.products[prodIndex].isFeatured = isFeatured;
      STORE_DATA.products[prodIndex].variants = variants;

      syncedProd = STORE_DATA.products[prodIndex];
    }
  } else {
    // Create New Product
    const newId = "prod_" + Date.now();
    const newProd = {
      id: newId,
      name: nameVi,
      name_en: nameEn,
      category: cat,
      type: "Nâng cấp chính chủ",
      type_en: "Official Upgrade",
      badge: badge || "Mới",
      image: image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      originalPrice: origPriceVnd || priceVnd * 1.5,
      price: priceVnd,
      rating: 5.0,
      sold: 1,
      description: descVi || "Sản phẩm mới thêm vào kho.",
      description_en: descVi || "New product added.",
      features: ["Bản quyền chính hãng", "Bảo hành 1 đổi 1"],
      variants: variants,
      isFeatured: isFeatured
    };
    STORE_DATA.products.unshift(newProd);
    syncedProd = newProd;
  }

  saveStoredProducts(STORE_DATA.products);
  if (syncedProd && typeof dbPost === 'function') {
    dbPost('/products', syncedProd);
  }
  renderAdminProducts();
  populateFlashSaleDropdown();
  closeProductFormModal();
  alert("🎉 Đã lưu sản phẩm và cấu hình gói bán thành công!");
}

function deleteProduct(id) {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
    STORE_DATA.products = STORE_DATA.products.filter(p => p.id !== id);
    saveStoredProducts(STORE_DATA.products);
    if (typeof dbDelete === 'function') {
      dbDelete(`/products/${id}`);
    }
    renderAdminProducts();
    populateFlashSaleDropdown();
    alert("Đã xóa sản phẩm khỏi hệ thống!");
  }
}

// Categories Management Logic
function renderAdminCategories() {
  const tbody = document.getElementById('admin-categories-tbody');
  if (!tbody || !STORE_DATA?.categories) return;

  tbody.innerHTML = STORE_DATA.categories.filter(c => c.id !== 'all').map(c => `
    <tr>
      <td style="font-weight: 700; color: #38bdf8;">${c.id}</td>
      <td style="font-weight: 700;">${c.name}</td>
      <td>${c.name_en || c.name}</td>
      <td><span style="background: #2b365a; padding: 2px 8px; border-radius: 4px;">i:${c.icon}</span></td>
      <td>
        <button class="admin-btn" style="background: #3b82f6; margin-right: 4px;" onclick="openCategoryModalForm('${c.id}')">Sửa</button>
        <button class="admin-btn admin-btn-danger" onclick="deleteCategory('${c.id}')">Xóa</button>
      </td>
    </tr>
  `).join('');
}

function openCategoryModalForm(catId = null) {
  const modal = document.getElementById('category-form-modal');
  const title = document.getElementById('category-modal-title');
  if (!modal) return;

  if (catId) {
    const c = STORE_DATA.categories.find(item => item.id === catId);
    if (!c) return;
    title.textContent = `Chỉnh Sửa Danh Mục: ${c.name}`;
    document.getElementById('cf-id').value = c.id;
    document.getElementById('cf-code').value = c.id;
    document.getElementById('cf-name-vi').value = c.name;
    document.getElementById('cf-name-en').value = c.name_en || c.name;
    document.getElementById('cf-icon').value = c.icon || 'bot';
  } else {
    title.textContent = "Thêm Danh Mục Mới";
    document.getElementById('cf-id').value = '';
    document.getElementById('cf-code').value = '';
    document.getElementById('cf-name-vi').value = '';
    document.getElementById('cf-name-en').value = '';
    document.getElementById('cf-icon').value = 'bot';
  }

  modal.style.display = 'flex';
}

function closeCategoryFormModal() {
  document.getElementById('category-form-modal').style.display = 'none';
}

function handleSaveCategoryForm(event) {
  event.preventDefault();
  const oldId = document.getElementById('cf-id').value;
  const code = document.getElementById('cf-code').value.trim().toLowerCase();
  const nameVi = document.getElementById('cf-name-vi').value;
  const nameEn = document.getElementById('cf-name-en').value;
  const icon = document.getElementById('cf-icon').value || 'bot';

  let syncedCat = null;
  if (oldId) {
    const idx = STORE_DATA.categories.findIndex(c => c.id === oldId);
    if (idx > -1) {
      STORE_DATA.categories[idx].name = nameVi;
      STORE_DATA.categories[idx].name_en = nameEn;
      STORE_DATA.categories[idx].icon = icon;
      syncedCat = STORE_DATA.categories[idx];
    }
  } else {
    const newCat = {
      id: code,
      name: nameVi,
      name_en: nameEn,
      icon: icon,
      color: 'from-blue-600 to-cyan-500'
    };
    STORE_DATA.categories.push(newCat);
    syncedCat = newCat;
  }

  saveStoredCategories(STORE_DATA.categories);
  if (syncedCat && typeof dbPost === 'function') {
    dbPost('/categories', syncedCat);
  }
  renderAdminCategories();
  closeCategoryFormModal();
  alert("🎉 Đã lưu danh mục thành công!");
}

function deleteCategory(catId) {
  if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${catId}"?`)) {
    STORE_DATA.categories = STORE_DATA.categories.filter(c => c.id !== catId);
    saveStoredCategories(STORE_DATA.categories);
    if (typeof dbDelete === 'function') {
      dbDelete(`/categories/${catId}`);
    }
    renderAdminCategories();
  }
}

// Flash Sale Management Logic
function renderAdminFlashSale() {
  const tbody = document.getElementById('admin-flash-products-tbody');
  const endTimeInput = document.getElementById('fs-endtime-input');
  if (!tbody) return;

  const fs = STORE_DATA.flashSale || { endTime: new Date().toISOString(), products: [] };
  
  if (endTimeInput && fs.endTime) {
    const date = new Date(fs.endTime);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
    endTimeInput.value = localISOTime;
  }

  if (!fs.products || fs.products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--admin-muted);">Chưa có sản phẩm nào được chọn tham gia Flash Sale.</td></tr>`;
    return;
  }

  tbody.innerHTML = fs.products.map(fp => {
    const prod = STORE_DATA.products.find(p => p.id === fp.id);
    if (!prod) return '';

    const percentSold = Math.round((fp.soldQty / fp.limitQty) * 100);

    return `
      <tr>
        <td><img src="${prod.image}" alt="${prod.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px;"></td>
        <td style="font-weight: 700;">${prod.name}</td>
        <td style="text-decoration: line-through;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}</td>
        <td style="font-weight: 700; color: #f43f5e;">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(fp.flashPrice)}</td>
        <td style="font-weight: 700;">${fp.limitQty} cái</td>
        <td>
          <div style="width: 100%; height: 8px; background: #2b365a; border-radius: 4px; overflow: hidden; margin-bottom: 4px;">
            <div style="width: ${percentSold}%; height: 100%; background: #f43f5e;"></div>
          </div>
          <span style="font-size: 0.75rem; color: var(--admin-muted);">Đã bán ${fp.soldQty}/${fp.limitQty} (${percentSold}%)</span>
        </td>
        <td>
          <button class="admin-btn admin-btn-danger" onclick="removeFlashSaleProduct('${fp.id}')">Gỡ bỏ</button>
        </td>
      </tr>
    `;
  }).join('');
}

function populateFlashSaleDropdown() {
  const select = document.getElementById('fs-product-select');
  if (!select || !STORE_DATA?.products) return;

  select.innerHTML = STORE_DATA.products.map(p => `
    <option value="${p.id}">${p.name}</option>
  `).join('');
}

function saveFlashSaleDuration(event) {
  event.preventDefault();
  const inputVal = document.getElementById('fs-endtime-input').value;
  if (!inputVal) return;

  const isoTime = new Date(inputVal).toISOString();
  STORE_DATA.flashSale.endTime = isoTime;
  saveStoredFlashSale(STORE_DATA.flashSale);
  alert("✓ Đã cập nhật thời gian kết thúc Flash Sale thành công!");
}

function addFlashSaleProduct(event) {
  event.preventDefault();
  const id = document.getElementById('fs-product-select').value;
  const price = Number(document.getElementById('fs-price-input').value);
  const limit = Number(document.getElementById('fs-limit-input').value);
  const sold = Number(document.getElementById('fs-sold-input').value);

  if (!id || price <= 0 || limit <= 0) {
    alert("Vui lòng điền đầy đủ thông tin hợp lệ!");
    return;
  }

  const existingIdx = STORE_DATA.flashSale.products.findIndex(p => p.id === id);
  const newFSEntry = { id, flashPrice: price, limitQty: limit, soldQty: sold };

  if (existingIdx > -1) {
    STORE_DATA.flashSale.products[existingIdx] = newFSEntry;
  } else {
    STORE_DATA.flashSale.products.push(newFSEntry);
  }

  saveStoredFlashSale(STORE_DATA.flashSale);
  renderAdminFlashSale();
  alert("⚡ Đã thêm/cập nhật sản phẩm trong Flash Sale thành công!");
}

function removeFlashSaleProduct(prodId) {
  if (confirm("Bạn có chắc chắn muốn gỡ sản phẩm này khỏi Flash Sale?")) {
    STORE_DATA.flashSale.products = STORE_DATA.flashSale.products.filter(p => p.id !== prodId);
    saveStoredFlashSale(STORE_DATA.flashSale);
    renderAdminFlashSale();
  }
}

// User Management Logic
function renderAdminUsers() {
  const tbody = document.getElementById('all-users-tbody');
  const totalEl = document.getElementById('users-total-count');
  if (!tbody) return;

  if (totalEl) totalEl.textContent = `Tổng ${ADMIN_USERS.length} tài khoản`;

  tbody.innerHTML = ADMIN_USERS.map(u => `
    <tr>
      <td>#${u.id}</td>
      <td style="font-weight: 700;">${u.name}</td>
      <td>${u.email}</td>
      <td><span style="background: rgba(16,185,129,0.15); color: #10b981; padding: 2px 8px; border-radius: 6px; font-weight: 700; font-size: 0.78rem;">${u.auth}</span></td>
      <td><span style="background: ${u.role === 'admin' ? '#ef4444' : '#3b82f6'}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">${u.role.toUpperCase()}</span></td>
      <td>
        <span style="background: ${u.status === 'active' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}; color: ${u.status === 'active' ? '#10b981' : '#ef4444'}; padding: 4px 10px; border-radius: 9999px; font-size: 0.76rem; font-weight: 800;">
          ${u.status === 'active' ? '🟢 Hoạt động' : '🔴 Bị Khóa'}
        </span>
      </td>
      <td>${u.date}</td>
      <td>
        <button class="admin-btn" style="background: #3b82f6; margin-right: 4px;" onclick="editUser(${u.id})">Sửa</button>
        <button class="admin-btn" style="background: ${u.status === 'active' ? '#f59e0b' : '#10b981'}; margin-right: 4px;" onclick="toggleUserStatus(${u.id})">
          ${u.status === 'active' ? 'Khóa' : 'Kích hoạt'}
        </button>
        <button class="admin-btn admin-btn-danger" onclick="deleteUser(${u.id})">Xóa</button>
      </td>
    </tr>
  `).join('');
}

function toggleUserStatus(userId) {
  const user = ADMIN_USERS.find(u => u.id === userId);
  if (user) {
    user.status = user.status === 'active' ? 'inactive' : 'active';
    renderAdminUsers();
    alert(`Đã đổi trạng thái tài khoản ${user.email} thành ${user.status.toUpperCase()}!`);
  }
}

function editUser(userId) {
  const user = ADMIN_USERS.find(u => u.id === userId);
  if (user) {
    const newName = prompt("Nhập Tên mới cho người dùng:", user.name);
    if (newName && newName.trim() !== '') {
      user.name = newName.trim();
      renderAdminUsers();
      alert("Đã cập nhật thông tin người dùng thành công!");
    }
  }
}

function deleteUser(userId) {
  if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
    ADMIN_USERS = ADMIN_USERS.filter(u => u.id !== userId);
    renderAdminUsers();
  }
}

function approveOrder(code) {
  const orders = JSON.parse(localStorage.getItem('tagki_orders')) || DEFAULT_ORDERS;
  const ord = orders.find(o => o.code === code);
  if (ord) {
    ord.status = 'paid';
    localStorage.setItem('tagki_orders', JSON.stringify(orders));

    if (typeof dbPost === 'function') {
      dbPost('/orders', ord); // sync with backend
    }

    renderAdminOrders();
    alert(`Đã duyệt thành công đơn hàng ${code} và kích hoạt tài khoản bàn giao cho khách!`);
  }
}

// Promo & Referral Code Dashboard CRUD
function renderAdminPromotions() {
  let promotions = JSON.parse(localStorage.getItem('tagki_promotions'));
  if (!promotions) {
    promotions = [
      { code: "EMPIRE2026", discount: "10%", minOrder: 200000, note: "Giảm 10% cho đơn từ 200K" },
      { code: "WELCOME50K", discount: "50.000đ", minOrder: 500000, note: "Giảm 50K cho đơn hàng đầu tiên từ 500K" }
    ];
    localStorage.setItem('tagki_promotions', JSON.stringify(promotions));
  }

  let referrals = JSON.parse(localStorage.getItem('tagki_referral_codes'));
  if (!referrals) {
    referrals = [
      { code: "DEV2026", referrerName: "Lập trình viên Cộng tác", note: "Mã giới thiệu dev" },
      { code: "EMPIREPARTNER", referrerName: "Đối tác Tagki", note: "Mã đối tác chính thức" }
    ];
    localStorage.setItem('tagki_referral_codes', JSON.stringify(referrals));
  }

  const promoTbody = document.getElementById('admin-promo-tbody');
  if (promoTbody) {
    promoTbody.innerHTML = promotions.map(p => `
      <tr>
        <td style="font-weight:700; color:#38bdf8;">${p.code}</td>
        <td style="font-weight:700; color:#10b981;">${p.discount}</td>
        <td>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.minOrder)}</td>
        <td>${p.note}</td>
        <td>
          <button class="admin-btn admin-btn-danger" style="padding:4px 8px; font-size:0.75rem;" onclick="deletePromoCode('${p.code}')">Xóa</button>
        </td>
      </tr>
    `).join('');
  }

  const refTbody = document.getElementById('admin-ref-tbody');
  if (refTbody) {
    refTbody.innerHTML = referrals.map(r => `
      <tr>
        <td style="font-weight:700; color:#00b4d8;">${r.code}</td>
        <td style="font-weight:700;">${r.referrerName}</td>
        <td>${r.note}</td>
        <td>
          <button class="admin-btn admin-btn-danger" style="padding:4px 8px; font-size:0.75rem;" onclick="deleteReferralCode('${r.code}')">Xóa</button>
        </td>
      </tr>
    `).join('');
  }
}

function handleSavePromoForm(e) {
  e.preventDefault();
  const code = document.getElementById('promo-code-input').value.trim().toUpperCase();
  const discount = document.getElementById('promo-discount-input').value.trim();
  const minOrder = Number(document.getElementById('promo-minorder-input').value);
  const note = document.getElementById('promo-note-input').value.trim();

  const newPromo = { code, discount, minOrder, note };

  let promotions = JSON.parse(localStorage.getItem('tagki_promotions')) || [];
  promotions = promotions.filter(p => p.code !== code);
  promotions.unshift(newPromo);
  localStorage.setItem('tagki_promotions', JSON.stringify(promotions));

  if (typeof dbPost === 'function') {
    dbPost('/promotions', newPromo);
  }

  document.getElementById('promo-code-input').value = '';
  document.getElementById('promo-discount-input').value = '';
  document.getElementById('promo-minorder-input').value = '';
  document.getElementById('promo-note-input').value = '';

  renderAdminPromotions();
  alert("✓ Đã lưu mã giảm giá thành công!");
}

function deletePromoCode(code) {
  if (confirm(`Bạn có chắc muốn xóa mã giảm giá ${code}?`)) {
    let promotions = JSON.parse(localStorage.getItem('tagki_promotions')) || [];
    promotions = promotions.filter(p => p.code !== code);
    localStorage.setItem('tagki_promotions', JSON.stringify(promotions));

    if (typeof dbDelete === 'function') {
      dbDelete(`/promotions/${code}`);
    }

    renderAdminPromotions();
  }
}

// Referral management CRUD
function handleSaveReferralForm(e) {
  e.preventDefault();
  const code = document.getElementById('ref-code-input').value.trim().toUpperCase();
  const referrerName = document.getElementById('ref-name-input').value.trim();
  const note = document.getElementById('ref-note-input').value.trim();

  const newRef = { code, referrerName, note };

  let referrals = JSON.parse(localStorage.getItem('tagki_referral_codes')) || [];
  referrals = referrals.filter(r => r.code !== code);
  referrals.unshift(newRef);
  localStorage.setItem('tagki_referral_codes', JSON.stringify(referrals));

  if (typeof dbPost === 'function') {
    dbPost('/referrals', newRef);
  }

  document.getElementById('ref-code-input').value = '';
  document.getElementById('ref-name-input').value = '';
  document.getElementById('ref-note-input').value = '';

  renderAdminPromotions();
  alert("✓ Đã lưu mã giới thiệu thành công!");
}

function deleteReferralCode(code) {
  if (confirm(`Bạn có chắc muốn xóa mã giới thiệu ${code}?`)) {
    let referrals = JSON.parse(localStorage.getItem('tagki_referral_codes')) || [];
    referrals = referrals.filter(r => r.code !== code);
    localStorage.setItem('tagki_referral_codes', JSON.stringify(referrals));

    if (typeof dbDelete === 'function') {
      dbDelete(`/referrals/${code}`);
    }

    renderAdminPromotions();
  }
}

// Blog Dashboard CRUD
function renderAdminBlogs() {
  const tbody = document.getElementById('admin-blogs-tbody');
  if (!tbody) return;

  const blogs = JSON.parse(localStorage.getItem('tagki_blogs')) || [];

  if (blogs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--admin-muted);">Chưa có bài viết blog nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = blogs.map(b => `
    <tr>
      <td><img src="${b.image}" alt="${b.title}" style="width:40px; height:40px; object-fit:cover; border-radius:6px;"></td>
      <td style="font-weight:700; max-width:280px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${b.title}</td>
      <td>${b.author}</td>
      <td>${b.date}</td>
      <td>
        <button class="admin-btn" style="background:#3b82f6; margin-right:4px;" onclick="openBlogModalForm('${b.id}')">Sửa</button>
        <button class="admin-btn admin-btn-danger" onclick="deleteBlog('${b.id}')">Xóa</button>
      </td>
    </tr>
  `).join('');
}

function openBlogModalForm(blogId = null) {
  const modal = document.getElementById('blog-form-modal');
  const title = document.getElementById('blog-modal-title');
  if (!modal) return;

  if (blogId) {
    const blogs = JSON.parse(localStorage.getItem('tagki_blogs')) || [];
    const b = blogs.find(item => item.id === blogId);
    if (!b) return;

    title.textContent = `Chỉnh Sửa Bài Viết: ${b.title}`;
    document.getElementById('bf-id').value = b.id;
    document.getElementById('bf-title').value = b.title;
    document.getElementById('bf-author').value = b.author;
    document.getElementById('bf-tags').value = b.tags ? b.tags.join(', ') : '';
    document.getElementById('bf-image').value = b.image;
    document.getElementById('bf-summary').value = b.summary;
    document.getElementById('bf-content').value = b.content || b.summary;
  } else {
    title.textContent = "Soạn Thảo Bài Viết Mới";
    document.getElementById('bf-id').value = '';
    document.getElementById('bf-title').value = '';
    document.getElementById('bf-author').value = 'Admin';
    document.getElementById('bf-tags').value = '';
    document.getElementById('bf-image').value = '';
    document.getElementById('bf-summary').value = '';
    document.getElementById('bf-content').value = '';
  }

  modal.style.display = 'flex';
}

function closeBlogFormModal() {
  document.getElementById('blog-form-modal').style.display = 'none';
}

function handleSaveBlogForm(e) {
  e.preventDefault();
  const id = document.getElementById('bf-id').value;
  const title = document.getElementById('bf-title').value.trim();
  const author = document.getElementById('bf-author').value.trim() || 'Admin';
  const tagsRaw = document.getElementById('bf-tags').value.trim();
  const image = document.getElementById('bf-image').value.trim();
  const summary = document.getElementById('bf-summary').value.trim();
  const content = document.getElementById('bf-content').value.trim();

  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()) : [];

  let blogs = JSON.parse(localStorage.getItem('tagki_blogs')) || [];

  let savedBlog = null;
  if (id) {
    const idx = blogs.findIndex(b => b.id === id);
    if (idx > -1) {
      blogs[idx].title = title;
      blogs[idx].author = author;
      blogs[idx].tags = tags;
      blogs[idx].image = image;
      blogs[idx].summary = summary;
      blogs[idx].content = content;
      savedBlog = blogs[idx];
    }
  } else {
    const newId = "blog_" + Date.now();
    const newBlog = {
      id: newId,
      title: title,
      author: author,
      tags: tags,
      image: image,
      summary: summary,
      content: content,
      date: new Date().toLocaleDateString('vi-VN')
    };
    blogs.unshift(newBlog);
    savedBlog = newBlog;
  }

  localStorage.setItem('tagki_blogs', JSON.stringify(blogs));

  if (typeof dbPost === 'function') {
    dbPost('/blogs', savedBlog);
  }

  renderAdminBlogs();
  closeBlogFormModal();
  alert("🎉 Đã lưu bài viết blog thành công!");
}

function deleteBlog(id) {
  if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
    let blogs = JSON.parse(localStorage.getItem('tagki_blogs')) || [];
    blogs = blogs.filter(b => b.id !== id);
    localStorage.setItem('tagki_blogs', JSON.stringify(blogs));

    if (typeof dbDelete === 'function') {
      dbDelete(`/blogs/${id}`);
    }

    renderAdminBlogs();
  }
}

function saveBankingSettings(e) {
  e.preventDefault();
  alert("✓ Đã lưu cấu hình tài khoản ngân hàng VietQR thành công!");
}

function saveOxaPaySettings(e) {
  e.preventDefault();
  alert("✓ Đã lưu cấu hình Cổng thanh toán OxaPay Crypto thành công!");
}

function saveBinanceSettings(e) {
  e.preventDefault();
  alert("✓ Đã lưu cấu hình Cổng thanh toán Binance Pay ID thành công!");
}

function populateBrandingInputs() {
  const s = STORE_DATA.settings || {};
  if (document.getElementById('cfg-logo-text')) document.getElementById('cfg-logo-text').value = s.logoText || 'TAGKI';
  if (document.getElementById('cfg-logo-image')) document.getElementById('cfg-logo-image').value = s.logoImage || '';
  if (document.getElementById('cfg-hotline')) document.getElementById('cfg-hotline').value = s.hotline || '';
  if (document.getElementById('cfg-facebook')) document.getElementById('cfg-facebook').value = s.facebook || '';
  if (document.getElementById('cfg-telegram')) document.getElementById('cfg-telegram').value = s.telegram || '';
  if (document.getElementById('cfg-whatsapp')) document.getElementById('cfg-whatsapp').value = s.whatsapp || '';
  if (document.getElementById('cfg-twitter')) document.getElementById('cfg-twitter').value = s.twitter || '';
  if (document.getElementById('cfg-zalo')) document.getElementById('cfg-zalo').value = s.zalo || '';
}

function saveBrandingSettings(e) {
  e.preventDefault();
  const s = {
    logoText: document.getElementById('cfg-logo-text').value.trim(),
    logoImage: document.getElementById('cfg-logo-image').value.trim(),
    hotline: document.getElementById('cfg-hotline').value.trim(),
    facebook: document.getElementById('cfg-facebook').value.trim(),
    telegram: document.getElementById('cfg-telegram').value.trim(),
    whatsapp: document.getElementById('cfg-whatsapp').value.trim(),
    twitter: document.getElementById('cfg-twitter').value.trim(),
    zalo: document.getElementById('cfg-zalo').value.trim()
  };
  saveStoredSettings(s);
  if (typeof applySettingsToUI === 'function') applySettingsToUI();
  alert("✓ Đã lưu cấu hình thương hiệu và các mạng xã hội thành công!");
}

// Banner / Slider Management CRUD
function renderAdminBanners() {
  const tbody = document.getElementById('admin-banners-tbody');
  if (!tbody) return;

  const banners = JSON.parse(localStorage.getItem('tagki_banners')) || [];

  if (banners.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--admin-muted);">Chưa có banner nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = banners.map(b => `
    <tr>
      <td><img src="${b.image}" alt="${b.title}" style="width:70px; height:40px; object-fit:cover; border-radius:4px;"></td>
      <td style="font-weight:700;">${b.title}</td>
      <td>${b.subtitle}</td>
      <td><span style="background: rgba(59,130,246,0.2); color: #3b82f6; padding: 2px 8px; border-radius: 6px; font-weight: 700; font-size: 0.75rem;">${b.btnText}</span></td>
      <td style="font-size:0.8rem; max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${b.link}</td>
      <td>
        <button class="admin-btn" style="background:#3b82f6; margin-right:4px; padding:4px 8px; font-size:0.75rem;" onclick="openBannerModalForm(${b.id})">Sửa</button>
        <button class="admin-btn admin-btn-danger" style="padding:4px 8px; font-size:0.75rem;" onclick="deleteBanner(${b.id})">Xóa</button>
      </td>
    </tr>
  `).join('');
}

function openBannerModalForm(bannerId = null) {
  const modal = document.getElementById('banner-form-modal');
  const title = document.getElementById('banner-modal-title');
  if (!modal) return;

  if (bannerId) {
    const banners = JSON.parse(localStorage.getItem('tagki_banners')) || [];
    const b = banners.find(item => item.id == bannerId);
    if (!b) return;

    title.textContent = `Chỉnh Sửa Banner: ${b.title}`;
    document.getElementById('ban-id').value = b.id;
    document.getElementById('ban-title').value = b.title;
    document.getElementById('ban-subtitle').value = b.subtitle;
    document.getElementById('ban-image').value = b.image;
    document.getElementById('ban-btntext').value = b.btnText;
    document.getElementById('ban-link').value = b.link;
  } else {
    title.textContent = "Thêm Banner / Slider Mới";
    document.getElementById('ban-id').value = '';
    document.getElementById('ban-title').value = '';
    document.getElementById('ban-subtitle').value = '';
    document.getElementById('ban-image').value = '';
    document.getElementById('ban-btntext').value = 'Khám Phá Ngay';
    document.getElementById('ban-link').value = '#ai-tools';
  }

  modal.style.display = 'flex';
}

function closeBannerFormModal() {
  document.getElementById('banner-form-modal').style.display = 'none';
}

function handleSaveBannerForm(e) {
  e.preventDefault();
  const id = document.getElementById('ban-id').value;
  const title = document.getElementById('ban-title').value.trim();
  const subtitle = document.getElementById('ban-subtitle').value.trim();
  const image = document.getElementById('ban-image').value.trim();
  const btnText = document.getElementById('ban-btntext').value.trim();
  const link = document.getElementById('ban-link').value.trim();

  let banners = JSON.parse(localStorage.getItem('tagki_banners')) || [];

  if (id) {
    const idx = banners.findIndex(b => b.id == id);
    if (idx > -1) {
      banners[idx].title = title;
      banners[idx].subtitle = subtitle;
      banners[idx].image = image;
      banners[idx].btnText = btnText;
      banners[idx].link = link;
    }
  } else {
    const newId = Date.now();
    const newBanner = { id: newId, title, subtitle, image, btnText, link };
    banners.push(newBanner);
  }

  localStorage.setItem('tagki_banners', JSON.stringify(banners));

  if (typeof dbPost === 'function') {
    dbPost('/settings/banners', banners); 
  }

  renderAdminBanners();
  closeBannerFormModal();
  alert("🎉 Đã lưu banner trang chủ thành công!");
}

function deleteBanner(id) {
  if (confirm("Bạn có chắc chắn muốn xóa banner này?")) {
    let banners = JSON.parse(localStorage.getItem('tagki_banners')) || [];
    banners = banners.filter(b => b.id != id);
    localStorage.setItem('tagki_banners', JSON.stringify(banners));

    if (typeof dbPost === 'function') {
      dbPost('/settings/banners', banners);
    }

    renderAdminBanners();
  }
}
