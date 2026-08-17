// tagki-clone Cart & Multi-Gateway Checkout (VietQR, OxaPay Crypto, Binance Pay)

let cartState = JSON.parse(localStorage.getItem('tagki_cart')) || [];
let activePaymentTab = 'vietqr';

function syncCartWithLatestProducts() {
  if (!cartState || cartState.length === 0) return;
  let changed = false;
  const products = (typeof getStoredProducts === 'function') ? getStoredProducts() : (STORE_DATA?.products || []);

  cartState.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if (prod) {
      if (item.name !== prod.name) {
        item.name = prod.name;
        changed = true;
      }
      if (item.image !== prod.image) {
        item.image = prod.image;
        changed = true;
      }
      // If regular item (not flash sale), update price & label if variant changed in admin
      if (!item.cartItemId.includes('_flash')) {
        const parts = item.cartItemId.split('_');
        const vIdx = parseInt(parts[parts.length - 1], 10) || 0;
        if (prod.variants && prod.variants[vIdx]) {
          if (item.price !== prod.variants[vIdx].price) {
            item.price = prod.variants[vIdx].price;
            item.variantLabel = prod.variants[vIdx].label;
            changed = true;
          }
        } else if (item.price !== prod.price) {
          item.price = prod.price;
          changed = true;
        }
      }
    }
  });

  if (changed) {
    localStorage.setItem('tagki_cart', JSON.stringify(cartState));
  }
}

function saveCart() {
  localStorage.setItem('tagki_cart', JSON.stringify(cartState));
  updateCartBadge();
  renderCartDrawer();
}

function updateCartBadge() {
  const totalCount = cartState.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(b => {
    b.textContent = totalCount;
    b.style.display = totalCount > 0 ? 'flex' : 'none';
  });
}

function addToCart(productId, variantIndex = 0, isFlashSale = false, customPrice = null) {
  const product = STORE_DATA.products.find(p => p.id === productId);
  if (!product) return;

  const selectedVariant = product.variants ? product.variants[variantIndex] : { label: 'Bản chuẩn', price: product.price };
  const price = isFlashSale && customPrice ? customPrice : selectedVariant.price;
  const label = isFlashSale ? '⚡ Flash Sale' : selectedVariant.label;
  const cartItemId = isFlashSale ? `${productId}_flash` : `${productId}_${variantIndex}`;

  const existingIndex = cartState.findIndex(item => item.cartItemId === cartItemId);
  if (existingIndex > -1) {
    cartState[existingIndex].quantity += 1;
  } else {
    cartState.push({
      cartItemId: cartItemId,
      id: product.id,
      name: product.name,
      image: product.image,
      variantLabel: label,
      price: price,
      quantity: 1
    });
  }

  saveCart();
  showToast(currentLang === 'en' ? `Added "${product.name}" to cart!` : `Đã thêm "${product.name}" vào giỏ hàng!`);
  openCartDrawer();
}

function removeFromCart(cartItemId) {
  cartState = cartState.filter(item => item.cartItemId !== cartItemId);
  saveCart();
}

function updateQuantity(cartItemId, delta) {
  const item = cartState.find(i => i.cartItemId === cartItemId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      saveCart();
    }
  }
}

function renderCartDrawer() {
  const cartContainer = document.getElementById('cart-items-container');
  const totalEl = document.getElementById('cart-total-price');
  if (!cartContainer || !totalEl) return;

  if (cartState.length === 0) {
    cartContainer.innerHTML = `
      <div style="text-align: center; padding: 40px 10px; color: #64748b;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.5;">
          <circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
        </svg>
        <p style="font-weight: 600;" data-i18n="cart_empty">${t('cart_empty')}</p>
        <p style="font-size: 0.8rem; margin-top: 4px;" data-i18n="cart_empty_sub">${t('cart_empty_sub')}</p>
      </div>
    `;
    totalEl.textContent = formatCurrency(0);
    return;
  }

  let totalVnd = 0;
  cartContainer.innerHTML = cartState.map(item => {
    const itemTotal = item.price * item.quantity;
    totalVnd += itemTotal;
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-variant">Gói: ${item.variantLabel}</div>
          <div class="cart-item-price">${formatCurrency(item.price)}</div>
          <div class="qty-control">
            <button class="qty-btn" onclick="updateQuantity('${item.cartItemId}', -1)">-</button>
            <span style="font-size: 0.85rem; font-weight: 700;">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQuantity('${item.cartItemId}', 1)">+</button>
            <button onclick="removeFromCart('${item.cartItemId}')" style="margin-left: auto; background: none; border: none; color: #ef4444; font-size: 0.75rem; font-weight: 600;">Xóa</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  totalEl.textContent = formatCurrency(totalVnd);
}

function openCartDrawer() {
  syncCartWithLatestProducts();
  renderCartDrawer();
  document.getElementById('cart-drawer')?.classList.add('active');
  document.getElementById('cart-backdrop')?.classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cart-drawer')?.classList.remove('active');
  document.getElementById('cart-backdrop')?.classList.remove('active');
}

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function showToast(msg) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #0f172a;
      color: white;
      padding: 12px 20px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      z-index: 2000;
      font-size: 0.88rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${msg}</span>
  `;
  
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 3000);
}

// Global checkout pricing state variables
let currentDiscountVnd = 0;
let appliedPromoCode = "";
let currentCheckoutOrderCode = "";
let currentCheckoutTotalVnd = 0;
let currentCheckoutTotalUsd = 0;

// Multi-Gateway Checkout Modal (VietQR, OxaPay Crypto, Binance Pay)
function openCheckoutModal() {
  syncCartWithLatestProducts();
  if (!currentUser) {
    showToast(currentLang === 'en' ? "Please sign in to proceed with checkout!" : "Vui lòng đăng nhập để tiến hành thanh toán!");
    setTimeout(() => {
      openAuthModal('login');
    }, 800);
    return;
  }

  if (cartState.length === 0) {
    showToast(currentLang === 'en' ? "Your cart is empty!" : "Giỏ hàng của bạn đang trống!");
    return;
  }
  closeCartDrawer();

  currentDiscountVnd = 0;
  appliedPromoCode = "";
  currentCheckoutOrderCode = "ET-" + Math.floor(100000 + Math.random() * 900000);

  const subtotalVnd = cartState.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  currentCheckoutTotalVnd = subtotalVnd;
  currentCheckoutTotalUsd = (currentCheckoutTotalVnd / USD_TO_VND_RATE).toFixed(2);

  const checkoutBody = document.getElementById('checkout-modal-body');
  if (!checkoutBody) return;

  // Extend checkout modal window sizing for premium side-by-side design
  const modalBox = checkoutBody.closest('.modal-box');
  if (modalBox) {
    modalBox.style.maxWidth = '840px';
  }

  const isEn = (currentLang === 'en');
  const labelOrderCode = isEn ? "Order Transaction ID:" : "Mã giao dịch đơn hàng:";
  const labelContactHeader = isEn ? "📋 1. Shipping Information" : "📋 1. Thông Tin Nhận Hàng";
  const labelEmail = isEn ? "Email Address * <span style='font-size: 0.72rem; color: #ef4444;'>(Required to receive account/key)</span>" : "Địa chỉ Email * <span style='font-size: 0.72rem; color: #ef4444;'>(Bắt buộc để nhận tài khoản/key)</span>";
  const labelZalo = isEn ? "Zalo / Phone Number (Optional)" : "Số điện thoại Zalo (Tùy chọn)";
  const labelTelegram = isEn ? "Telegram Username" : "Telegram Username";
  const labelFb = isEn ? "Facebook Link" : "Facebook Link";
  const labelNotes = isEn ? "Additional Notes" : "Ghi chú bổ sung";
  const placeholderNotes = isEn ? "Example: Upgrade my existing personal email,..." : "Ví dụ: Nâng cấp tài khoản email cũ của tôi,...";
  const labelPromo = isEn ? "Promo Code" : "Mã Ưu Đãi (Promo)";
  const labelReferral = isEn ? "Referral Code" : "Mã Giới Thiệu (Referral)";
  const btnApply = isEn ? "Apply" : "Áp dụng";
  const btnCheck = isEn ? "Check" : "Check";
  
  const labelPaymentHeader = isEn ? "💳 2. Secure Payment" : "💳 2. Thanh Toán An Toàn";
  const labelCartTotal = isEn ? `Cart Subtotal (${cartState.reduce((sum, item) => sum + item.quantity, 0)} items):` : `Tổng giỏ hàng (${cartState.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm):`;
  const labelDiscount = isEn ? "Discount (Promo):" : "Mã giảm giá (Promo):";
  const labelAmountToPay = isEn ? "Amount to pay:" : "Số tiền cần thanh toán:";
  const btnConfirmPaid = isEn ? "✓ I Have Successfully Sent Payment" : "✓ Tôi Đã Chuyển Khoản Thành Công";

  checkoutBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="font-size: 1.4rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <span>🔒 ${t('checkout_title')}</span>
      </h2>
      <p style="font-size: 0.82rem; color: #64748b; margin-top: 4px;">${labelOrderCode} <b style="color:#2579f2; font-size: 0.95rem;">${currentCheckoutOrderCode}</b></p>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
      <!-- Left Column: Contact Form & Coupon Codes -->
      <div>
        <h3 style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">${labelContactHeader}</h3>
        
        <div style="margin-bottom: 10px;">
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 4px;">${labelEmail}</label>
          <input type="email" id="checkout-email" class="tool-input" placeholder="your-email@gmail.com" required style="width:100%; border: 1px solid #cbd5e1; padding: 10px; border-radius: 8px; font-size: 0.85rem; background: white; color: #0f172a;" value="${currentUser ? currentUser.email : ''}">
        </div>

        <div style="margin-bottom: 10px;">
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 4px;">${labelZalo}</label>
          <input type="text" id="checkout-zalo" class="tool-input" placeholder="e.g. +84908687510" style="width:100%; border: 1px solid #cbd5e1; padding: 10px; border-radius: 8px; font-size: 0.85rem; background: white; color: #0f172a;">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 4px;">${labelTelegram}</label>
            <input type="text" id="checkout-telegram" class="tool-input" placeholder="@username" style="width:100%; border: 1px solid #cbd5e1; padding: 10px; border-radius: 8px; font-size: 0.85rem; background: white; color: #0f172a;">
          </div>
          <div>
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 4px;">${labelFb}</label>
            <input type="text" id="checkout-facebook" class="tool-input" placeholder="profile link" style="width:100%; border: 1px solid #cbd5e1; padding: 10px; border-radius: 8px; font-size: 0.85rem; background: white; color: #0f172a;">
          </div>
        </div>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #334155; margin-bottom: 4px;">${labelNotes}</label>
          <textarea id="checkout-notes" rows="2" placeholder="${placeholderNotes}" style="width:100%; border: 1px solid #cbd5e1; padding: 10px; border-radius: 8px; font-size: 0.85rem; background: white; color: #0f172a; font-family: inherit; resize: none;"></textarea>
        </div>

        <!-- Promo and Referral Inputs -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 18px; border-top: 1px dashed #cbd5e1; padding-top: 12px;">
          <div>
            <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #334155; margin-bottom: 4px;">${labelPromo}</label>
            <div style="display: flex; gap: 4px;">
              <input type="text" id="checkout-promo-input" placeholder="EMPIRE2026" style="flex:1; border: 1px solid #cbd5e1; padding: 8px; border-radius: 8px; font-size: 0.82rem; text-transform: uppercase; background: white; color: #0f172a;">
              <button type="button" onclick="applyDiscountCode()" style="background:#2579f2; color:white; padding: 0 10px; border-radius: 8px; font-weight:700; font-size:0.8rem; border:none; cursor:pointer;">${btnApply}</button>
            </div>
          </div>
          <div>
            <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #334155; margin-bottom: 4px;">${labelReferral}</label>
            <div style="display: flex; gap: 4px;">
              <input type="text" id="checkout-referral-input" placeholder="DEV2026" style="flex:1; border: 1px solid #cbd5e1; padding: 8px; border-radius: 8px; font-size: 0.82rem; text-transform: uppercase; background: white; color: #0f172a;">
              <button type="button" onclick="verifyReferralCode()" style="background:#0f172a; color:white; padding: 0 10px; border-radius: 8px; font-weight:700; font-size:0.8rem; border:none; cursor:pointer;">${btnCheck}</button>
            </div>
          </div>
        </div>
        <div id="referral-info-msg" style="font-size:0.75rem; margin-top:4px; font-weight:600; color:#64748b;"></div>
      </div>

      <!-- Right Column: Pricing Summary & Gateway -->
      <div style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <h3 style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">${labelPaymentHeader}</h3>
          
          <!-- Pricing Summary Card -->
          <div style="background: #f8fafc; border-radius: 12px; padding: 14px; border: 1px solid #e2e8f0; margin-bottom: 16px; font-size: 0.84rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom: 6px; color:#475569;">
              <span>${labelCartTotal}</span>
              <span style="font-weight: 700;" id="summary-subtotal">${formatCurrency(subtotalVnd)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom: 6px; color: #ef4444;">
              <span>${labelDiscount}</span>
              <span style="font-weight: 700;" id="summary-discount">-0đ</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-weight: 800; font-size: 0.95rem; margin-top: 8px; border-top: 1px solid #e2e8f0; padding-top: 8px; color: #2579f2;">
              <span>${labelAmountToPay}</span>
              <span id="summary-total">${formatCurrency(subtotalVnd)}</span>
            </div>
          </div>

          <!-- Gateway Selector Tabs -->
          <div style="display: flex; gap: 4px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
            <button class="gw-tab-btn active" onclick="switchGatewayTab('vietqr')" id="tab-btn-vietqr" style="flex: 1; padding: 10px 4px; border-radius: 6px; border: none; font-weight: 800; font-size: 0.78rem; background: #2579f2; color: white; cursor: pointer;">
              🏛️ VietQR
            </button>
            <button class="gw-tab-btn" onclick="switchGatewayTab('oxapay')" id="tab-btn-oxapay" style="flex: 1; padding: 10px 4px; border-radius: 6px; border: none; font-weight: 800; font-size: 0.78rem; background: #f1f5f9; color: #475569; cursor: pointer;">
              ⚡ Crypto (OxaPay)
            </button>
            <button class="gw-tab-btn" onclick="switchGatewayTab('binance')" id="tab-btn-binance" style="flex: 1; padding: 10px 4px; border-radius: 6px; border: none; font-weight: 800; font-size: 0.78rem; background: #f1f5f9; color: #475569; cursor: pointer;">
              🟡 Binance Pay
            </button>
          </div>

          <!-- Dynamic Gateway Display Area -->
          <div id="gateway-content-box" style="text-align: center; min-height: 220px;"></div>
        </div>

        <div style="margin-top: 20px;">
          <button onclick="processSubmitPayment()" style="width: 100%; background: linear-gradient(90deg, #10b981, #059669); color: white; border: none; padding: 14px; border-radius: 10px; font-weight: 800; font-size: 1rem; box-shadow: 0 4px 14px rgba(16,185,129,0.35); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>${btnConfirmPaid}</span>
          </button>
        </div>
      </div>
    </div>
  `;

  activePaymentTab = 'vietqr';
  updateCheckoutPricing();
  document.getElementById('checkout-modal')?.classList.add('active');
}

function updateCheckoutPricing() {
  const subtotalVnd = cartState.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const discountedTotalVnd = Math.max(0, subtotalVnd - currentDiscountVnd);

  currentCheckoutTotalVnd = discountedTotalVnd;
  currentCheckoutTotalUsd = (discountedTotalVnd / USD_TO_VND_RATE).toFixed(2);

  // Update Summary elements
  const subEl = document.getElementById('summary-subtotal');
  const discEl = document.getElementById('summary-discount');
  const totEl = document.getElementById('summary-total');

  if (subEl) subEl.textContent = formatCurrency(subtotalVnd);
  if (discEl) discEl.textContent = "-" + formatCurrency(currentDiscountVnd);
  if (totEl) totEl.textContent = formatCurrency(discountedTotalVnd);

  // Redraw the active payment gateway content to update the QR code with the new amount
  switchGatewayTab(activePaymentTab);
}

function switchGatewayTab(tab) {
  activePaymentTab = tab;
  const btns = ['vietqr', 'oxapay', 'binance'];
  btns.forEach(b => {
    const btn = document.getElementById(`tab-btn-${b}`);
    if (btn) {
      if (b === tab) {
        btn.style.background = '#2579f2';
        btn.style.color = 'white';
      } else {
        btn.style.background = '#f1f5f9';
        btn.style.color = '#475569';
      }
    }
  });

  const box = document.getElementById('gateway-content-box');
  if (!box) return;

  const orderCode = currentCheckoutOrderCode;
  const amountVnd = currentCheckoutTotalVnd;
  const amountUsd = currentCheckoutTotalUsd;
  const isEn = (currentLang === 'en');

  // Dynamically load settings from getStoredSettings() or STORE_DATA
  const settings = (typeof getStoredSettings === 'function') ? getStoredSettings() : (STORE_DATA.settings || {});
  const bankName = settings.bankName || 'MB Bank';
  const accountNumber = settings.accountNumber || '0839888823';
  const accountHolder = settings.accountHolder || 'TAGKI DIGITAL SERVICES';
  const oxapayWallet = settings.oxapayWallet || 'TY4hP8...TagkiOxaPayWallet';
  const binanceId = settings.binanceId || '8839888823';

  if (tab === 'vietqr') {
    const vietQrUrl = `https://img.vietqr.io/image/${encodeURIComponent(bankName)}-${encodeURIComponent(accountNumber)}-compact2.png?amount=${amountVnd}&addInfo=${encodeURIComponent(orderCode)}&accountName=${encodeURIComponent(accountHolder)}`;
    const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TAGKI_VIETQR_${accountNumber}_${orderCode}_${amountVnd}`;

    box.innerHTML = `
      <div style="background: white; border: 2px solid #2579f2; border-radius: 12px; padding: 14px; box-shadow: 0 4px 12px rgba(37,121,242,0.06); text-align: left;">
        <div style="font-size: 0.82rem; font-weight: 800; color: #2579f2; margin-bottom: 10px; text-align: center; text-transform: uppercase;">
          ${isEn ? "SCAN VIETQR CODE (VND)" : "QUÉT MÃ QR VIETQR (VND)"}
        </div>
        <div style="display:flex; justify-content:center; margin-bottom:10px;">
          <img src="${vietQrUrl}" onerror="this.onerror=null; this.src='${fallbackQrUrl}'" alt="VietQR Code" style="width: 140px; height: 140px; border-radius: 6px; object-fit: contain;">
        </div>
        <div style="font-size: 0.8rem; color: #334155; margin-bottom:4px;">
          ${isEn ? "Bank:" : "Ngân hàng:"} <b>${bankName}</b>
        </div>
        <div style="font-size: 0.8rem; color: #334155; margin-bottom:4px;">
          ${isEn ? "Account No:" : "STK:"} <b style="color:#2579f2; user-select: all;">${accountNumber}</b>
        </div>
        <div style="font-size: 0.8rem; color: #334155; margin-bottom:4px;">
          ${isEn ? "Account Name:" : "Chủ tài khoản:"} <b>${accountHolder}</b>
        </div>
        <div style="font-size: 0.82rem; color: #e11d48; font-weight: 800; margin-top: 8px; border-top: 1px dashed #e2e8f0; padding-top: 8px; text-align:center;">
          ${isEn ? "Transfer Reference:" : "Nội dung chuyển khoản:"} <span style="background:#ffe4e6; padding: 2px 6px; border-radius:4px; font-family:monospace; font-size:0.9rem; user-select: all;">${orderCode}</span>
        </div>
      </div>
    `;
  } else if (tab === 'oxapay') {
    if (window.activeOxaPayInvoice && window.activeOxaPayInvoice.orderCode === orderCode) {
      box.innerHTML = `
        <div style="background: white; border: 2px solid #8b5cf6; border-radius: 12px; padding: 14px; box-shadow: 0 4px 12px rgba(139,92,246,0.06); text-align: left;">
          <div style="font-size: 0.82rem; font-weight: 800; color: #8b5cf6; text-align: center; margin-bottom: 8px;">
            ${isEn ? "⚡ INVOICE CREATED ON OXAPAY" : "⚡ HÓA ĐƠN ĐÃ TẠO TRÊN OXAPAY"}
          </div>
          <div style="display:flex; justify-content:center; margin-bottom:10px;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://oxapay.com/checkout/invoice?id=${window.activeOxaPayInvoice.id}" alt="OxaPay QR" style="width: 110px; height: 110px; border-radius: 6px;">
          </div>
          <div style="font-size: 0.8rem; color: #334155; margin-bottom: 4px;">
            ${isEn ? "Invoice ID:" : "Mã hóa đơn:"} <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: 700;">OXA-${orderCode}</code>
          </div>
          <div style="font-size: 0.8rem; color: #334155; margin-bottom: 4px;">
            ${isEn ? "Amount USDT:" : "Số tiền USDT:"} <b style="color:#8b5cf6; font-size:0.9rem;">$${amountUsd} USDT</b>
          </div>
          <div style="font-size: 0.72rem; color: #475569; word-break: break-all; margin-top: 6px; border-top: 1px dashed #e2e8f0; padding-top: 6px;">
            ${isEn ? "Recipient Wallet Address:" : "Địa chỉ ví nhận:"}<br>
            <span style="font-family:monospace; font-weight:700; color:#0f172a; font-size:0.72rem; user-select: all;">${oxapayWallet}</span>
          </div>
          <div style="margin-top: 10px; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 8px; text-align: center;">
            <span style="font-size: 0.76rem; font-weight: 700; color: #8b5cf6; animation: pulse 1s infinite; display: block;">
              ${isEn ? "⏳ Waiting for payment verification from OxaPay..." : "⏳ Đang chờ xác thực thanh toán từ OxaPay..."}
            </span>
          </div>
        </div>
      `;
    } else {
      box.innerHTML = `
        <div style="background: white; border: 2px solid #8b5cf6; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(139,92,246,0.06); text-align: center;">
          <div style="font-size: 1.6rem; margin-bottom: 8px;">⚡</div>
          <div style="font-size: 0.9rem; font-weight: 800; color: #8b5cf6; margin-bottom: 6px;">
            ${isEn ? "AUTOMATED CRYPTO PAYMENT (OXAPAY)" : "THANH TOÁN TỰ ĐỘNG QUA OXAPAY"}
          </div>
          <p style="font-size: 0.78rem; color: #64748b; margin-bottom: 16px; line-height: 1.4;">
            ${isEn ? "The system automatically creates a crypto invoice via OxaPay. Accepts USDT (TRC20), BTC, ETH..." : "Hệ thống tự động khởi tạo hóa đơn tiền điện tử qua OxaPay. Chấp nhận USDT (TRC20), BTC, ETH..."}
          </p>
          
          <button onclick="createMockOxaPayInvoice('${amountUsd}', '${orderCode}')" style="background: #8b5cf6; color: white; padding: 10px 20px; border-radius: 8px; font-weight: 800; font-size: 0.85rem; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(139,92,246,0.3); transition: all 0.2s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
            ${isEn ? `Create OxaPay Invoice ($${amountUsd})` : `Tạo Hóa Đơn OxaPay ($${amountUsd})`}
          </button>
        </div>
      `;
    }
  } else if (tab === 'binance') {
    box.innerHTML = `
      <div style="background: white; border: 2px solid #f59e0b; border-radius: 12px; padding: 14px; box-shadow: 0 4px 12px rgba(245,158,11,0.06); text-align: left;">
        <div style="font-size: 0.82rem; font-weight: 800; color: #d97706; margin-bottom: 4px; text-align: center;">BINANCE PAY GATEWAY</div>
        <div style="font-size: 0.72rem; color: #64748b; margin-bottom: 10px; text-align: center;">
          ${isEn ? "No gas fees - Scan QR code using Binance App" : "Không mất phí gas - Thanh toán quét mã bằng Binance App"}
        </div>
        <div style="display:flex; justify-content:center; margin-bottom:10px;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BINANCE_PAY_${binanceId}_${orderCode}_${amountUsd}" alt="Binance Pay QR" style="width: 120px; height: 120px; border-radius: 6px;">
        </div>
        <div style="font-size: 0.8rem; color: #334155; margin-bottom:4px;">Binance Pay ID: <b style="color:#d97706; user-select: all;">${binanceId}</b></div>
        <div style="font-size: 0.8rem; color: #334155;">
          ${isEn ? "Payment Amount:" : "Số tiền thanh toán:"} <b style="color:#d97706; font-size:0.9rem;">$${amountUsd} USDT / BUSD</b>
        </div>
      </div>
    `;
  }
}

function applyDiscountCode() {
  const codeInput = document.getElementById('checkout-promo-input');
  if (!codeInput) return;
  const rawCode = codeInput.value.trim().toUpperCase();
  if (rawCode === "") {
    alert("Vui lòng nhập mã giảm giá!");
    return;
  }

  // Load promotions from localStorage or fall back to defaults
  let promotions = JSON.parse(localStorage.getItem('tagki_promotions'));
  if (!promotions) {
    promotions = [
      { code: "EMPIRE2026", discount: "10%", minOrder: 200000, note: "Giảm 10% cho đơn từ 200K" },
      { code: "WELCOME50K", discount: "50.000đ", minOrder: 500000, note: "Giảm 50K cho đơn hàng đầu tiên từ 500K" }
    ];
    localStorage.setItem('tagki_promotions', JSON.stringify(promotions));
  }

  const promo = promotions.find(p => p.code === rawCode);
  if (!promo) {
    alert("Mã giảm giá không hợp lệ hoặc đã hết hạn!");
    return;
  }

  const subtotal = cartState.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  if (subtotal < promo.minOrder) {
    alert(`Mã này chỉ áp dụng cho đơn hàng từ ${formatCurrency(promo.minOrder)} trở lên!`);
    return;
  }

  let discountAmount = 0;
  if (promo.discount.endsWith('%')) {
    const percent = parseFloat(promo.discount.replace('%', ''));
    discountAmount = Math.round((subtotal * percent) / 100);
  } else {
    const cleanVal = promo.discount.replace(/[^0-9]/g, '');
    discountAmount = parseFloat(cleanVal);
  }

  currentDiscountVnd = discountAmount;
  appliedPromoCode = rawCode;

  updateCheckoutPricing();
  alert(`🎉 Áp dụng thành công mã ${rawCode}! Giảm ${formatCurrency(discountAmount)}.`);
}

function verifyReferralCode() {
  const codeInput = document.getElementById('checkout-referral-input');
  if (!codeInput) return;
  const rawCode = codeInput.value.trim().toUpperCase();
  if (rawCode === "") {
    alert("Vui lòng nhập mã giới thiệu!");
    return;
  }

  let referrals = JSON.parse(localStorage.getItem('tagki_referral_codes')) || [
    { code: "DEV2026", referrerName: "Lập trình viên Cộng tác", note: "Mã giới thiệu dev" },
    { code: "EMPIREPARTNER", referrerName: "Đối tác Tagki", note: "Mã đối tác chính thức" }
  ];
  localStorage.setItem('tagki_referral_codes', JSON.stringify(referrals));

  const ref = referrals.find(r => r.code === rawCode);
  if (ref) {
    const refInfoEl = document.getElementById('referral-info-msg');
    if (refInfoEl) {
      refInfoEl.innerHTML = `✓ Mã giới thiệu hợp lệ: <b>${ref.referrerName}</b>`;
      refInfoEl.style.color = '#10b981';
    }
  } else {
    alert("Mã giới thiệu không tồn tại!");
  }
}

async function processSubmitPayment() {
  const emailInput = document.getElementById('checkout-email');
  if (!emailInput || !emailInput.value.trim()) {
    alert("Vui lòng nhập địa chỉ Email để nhận tài khoản/key!");
    emailInput?.focus();
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value.trim())) {
    alert("Vui lòng nhập đúng định dạng Email!");
    emailInput.focus();
    return;
  }

  const email = emailInput.value.trim();
  const zalo = document.getElementById('checkout-zalo')?.value.trim() || '';
  const telegram = document.getElementById('checkout-telegram')?.value.trim() || '';
  const facebook = document.getElementById('checkout-facebook')?.value.trim() || '';
  const notes = document.getElementById('checkout-notes')?.value.trim() || '';
  const referralInput = document.getElementById('checkout-referral-input');
  const referralCode = referralInput ? referralInput.value.trim().toUpperCase() : '';

  // Format order items with product name, variant/duration, and quantity
  const orderItemsText = cartState.map(i => `${i.name} (${i.variantLabel}) (x${i.quantity})`).join(', ');

  const orderData = {
    code: currentCheckoutOrderCode,
    email: email,
    items: orderItemsText,
    totalVnd: currentCheckoutTotalVnd,
    totalUsd: Number(currentCheckoutTotalUsd),
    method: activePaymentTab === 'vietqr' ? 'VietQR MB Bank' : activePaymentTab === 'oxapay' ? 'OxaPay Crypto' : 'Binance Pay',
    status: 'pending',
    facebook: facebook,
    telegram: telegram,
    zalo: zalo,
    notes: notes,
    promoCode: appliedPromoCode,
    referralCode: referralCode,
    discountVnd: currentDiscountVnd,
    date: new Date().toLocaleString('vi-VN')
  };

  // 1. Post to SQL database backend (will fail gracefully if offline)
  if (typeof dbPost === 'function') {
    dbPost('/orders', orderData);
  }

  // 2. Save order to localStorage so admin/client pages can load it dynamically
  let ordersList = JSON.parse(localStorage.getItem('tagki_orders')) || [];
  ordersList.unshift(orderData);
  localStorage.setItem('tagki_orders', JSON.stringify(ordersList));

  // 3. Reset checkout and cart
  closeCheckoutModal();
  cartState = [];
  saveCart();

  showToast(currentLang === 'en' 
    ? `🎉 Order ${orderData.code} placed successfully! Check your email.` 
    : `🎉 Đơn hàng ${orderData.code} đã gửi thành công! Hãy chuyển khoản theo nội dung đơn và kiểm tra email.`);
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal')?.classList.remove('active');
}

function createMockOxaPayInvoice(amountUsd, orderCode) {
  const box = document.getElementById('gateway-content-box');
  if (!box) return;

  box.innerHTML = `
    <div style="text-align: center; padding: 40px 10px; color: #8b5cf6;">
      <div style="border: 4px solid #f3f3f3; border-top: 4px solid #8b5cf6; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 12px auto;"></div>
      <p style="font-size: 0.85rem; font-weight: 700;">Đang kết nối tới OxaPay Merchant API...</p>
    </div>
  `;

  if (!document.getElementById('loader-style')) {
    const style = document.createElement('style');
    style.id = 'loader-style';
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    window.activeOxaPayInvoice = {
      id: "oxa_inv_" + Math.floor(100000 + Math.random() * 900000),
      orderCode: orderCode,
      amount: amountUsd
    };
    switchGatewayTab('oxapay');
  }, 1200);
}
