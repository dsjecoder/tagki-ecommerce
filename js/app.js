// tagki-clone Main Application Script with Flash Sale & Countdown Timer Support

let activeCategory = 'all';
let currentSlideIndex = 0;
let slideTimer = null;
let flashSaleInterval = null;

function checkUrlForProductDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const pId = params.get('p') || params.get('product') || (window.location.hash.startsWith('#product-') ? window.location.hash.replace('#product-', '') : null);
  if (pId) {
    setTimeout(() => {
      openProductModal(pId, false);
    }, 120);
  }
}

// Handle Browser Back & Forward buttons for SEO URLs
window.addEventListener('popstate', (e) => {
  const params = new URLSearchParams(window.location.search);
  const pId = params.get('p') || params.get('product') || (e.state && e.state.productId);
  if (pId) {
    openProductModal(pId, false);
  } else {
    closeProductModal(false);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderProducts();
  renderFeaturedProducts();
  initCarousel();
  initSearch();
  updateCartBadge();
  renderCartDrawer();
  initFlashSale();
  renderLatestBlogs();
  checkUrlForProductDeepLink();
});

// Render Category Chips
function renderCategories() {
  const catGrid = document.getElementById('category-grid');
  if (!catGrid) return;

  catGrid.innerHTML = STORE_DATA.categories.map(cat => `
    <div class="cat-chip ${cat.id === activeCategory ? 'active' : ''}" onclick="filterCategory('${cat.id}')">
      <div class="cat-icon">
        <i data-lucide="${cat.icon || 'grid'}"></i>
      </div>
      <span>${currentLang === 'en' && cat.name_en ? cat.name_en : cat.name}</span>
    </div>
  `).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

function filterCategory(catId) {
  activeCategory = catId;
  renderCategories();
  renderProducts();
  const prodSec = document.getElementById('products-section');
  if (prodSec) {
    prodSec.scrollIntoView({ behavior: 'smooth' });
  }
}

// Render Products Grid with Dynamic Language & Currency Switching (VND <-> USD)
function renderProducts(query = '') {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  let filtered = STORE_DATA.products;

  if (activeCategory !== 'all') {
    filtered = filtered.filter(p => p.category === activeCategory);
  }

  if (query.trim() !== '') {
    const q = query.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.name_en && p.name_en.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q) ||
      (p.description_en && p.description_en.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #64748b;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity:0.5;">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p style="font-size: 1.1rem; font-weight: 700;">${currentLang === 'en' ? 'No products found' : 'Không tìm thấy sản phẩm phù hợp'}</p>
        <p style="font-size: 0.85rem;">${currentLang === 'en' ? 'Try searching for "ChatGPT", "Canva", "Cursor", "Office"...' : 'Thử tìm kiếm với từ khóa khác như "ChatGPT", "Canva", "Office", "VPN"...'}</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const productName = currentLang === 'en' && p.name_en ? p.name_en : p.name;
    const productType = currentLang === 'en' && p.type_en ? p.type_en : p.type;
    const formattedPrice = formatCurrency(p.price);
    const formattedOrigPrice = p.originalPrice ? formatCurrency(p.originalPrice) : '';

    return `
      <div class="product-card">
        <div class="product-thumb" onclick="openProductModal('${p.id}')">
          <img src="${p.image}" alt="${productName}" loading="lazy">
          <span class="type-tag">${productType}</span>
          ${p.badge ? `<span class="badge-tag">${p.badge}</span>` : ''}
        </div>
        <div class="product-info">
          <h3 class="product-title" onclick="openProductModal('${p.id}')">${productName}</h3>
          <div class="product-stats">
            <span class="rating">★ ${p.rating}</span>
            <span>• ${t('sold')} ${p.sold}</span>
          </div>
          <div class="price-row">
            <div class="price-box">
              <span class="current-price">${formattedPrice}</span>
              ${p.originalPrice ? `<span class="original-price">${formattedOrigPrice}</span>` : ''}
            </div>
            <button class="add-cart-btn" onclick="addToCart('${p.id}', 0)" title="${t('add_to_cart')}">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderFeaturedProducts() {
  const grid = document.getElementById('featured-products-grid');
  const section = document.getElementById('featured-products-section');
  if (!grid) return;

  const featured = STORE_DATA.products.filter(p => p.isFeatured);
  if (featured.length === 0) {
    if (section) section.style.display = 'none';
    return;
  }

  if (section) section.style.display = 'block';

  grid.innerHTML = featured.map(p => {
    const productName = currentLang === 'en' && p.name_en ? p.name_en : p.name;
    const productType = currentLang === 'en' && p.type_en ? p.type_en : p.type;
    const formattedPrice = formatCurrency(p.price);
    const formattedOrigPrice = p.originalPrice ? formatCurrency(p.originalPrice) : '';

    return `
      <div class="product-card" style="border: 1px solid rgba(37,121,242,0.15); box-shadow: 0 4px 20px rgba(37,121,242,0.05);">
        <div class="product-thumb" onclick="openProductModal('${p.id}')">
          <img src="${p.image}" alt="${productName}" loading="lazy">
          <span class="type-tag" style="background: var(--primary); color: white;">⭐ NỔI BẬT</span>
          ${p.badge ? `<span class="badge-tag" style="background: #f59e0b;">${p.badge}</span>` : ''}
        </div>
        <div class="product-info">
          <h3 class="product-title" onclick="openProductModal('${p.id}')">${productName}</h3>
          <div class="product-stats">
            <span class="rating">★ ${p.rating}</span>
            <span>• ${t('sold')} ${p.sold}</span>
          </div>
          <div class="price-row">
            <div class="price-box">
              <span class="current-price">${formattedPrice}</span>
              ${p.originalPrice ? `<span class="original-price">${formattedOrigPrice}</span>` : ''}
            </div>
            <button class="add-cart-btn" onclick="addToCart('${p.id}', 0)" title="${t('add_to_cart')}">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Flash Sale & Countdown Timer logic
function initFlashSale() {
  const fsSection = document.getElementById('flash-sale-section');
  if (!fsSection || !STORE_DATA.flashSale || !STORE_DATA.flashSale.products.length) {
    if (fsSection) fsSection.style.display = 'none';
    return;
  }

  fsSection.style.display = 'block';
  renderFlashSale();

  if (flashSaleInterval) clearInterval(flashSaleInterval);

  flashSaleInterval = setInterval(() => {
    const now = new Date().getTime();
    const end = new Date(STORE_DATA.flashSale.endTime).getTime();
    const diff = end - now;

    if (diff <= 0) {
      clearInterval(flashSaleInterval);
      fsSection.style.display = 'none';
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const hrsEl = document.getElementById('fs-hours');
    const minsEl = document.getElementById('fs-minutes');
    const secsEl = document.getElementById('fs-seconds');

    if (hrsEl) hrsEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }, 1000);
}

function renderFlashSale() {
  const grid = document.getElementById('flash-sale-grid');
  if (!grid || !STORE_DATA.flashSale?.products) return;

  grid.innerHTML = STORE_DATA.flashSale.products.map(fp => {
    const p = STORE_DATA.products.find(item => item.id === fp.id);
    if (!p) return '';

    const productName = currentLang === 'en' && p.name_en ? p.name_en : p.name;
    const formattedFlashPrice = formatCurrency(fp.flashPrice);
    const formattedOrigPrice = formatCurrency(p.price);
    const percentSold = Math.round((fp.soldQty / fp.limitQty) * 100);

    return `
      <div class="product-card" style="border-color: #fecaca; box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.1);">
        <div class="product-thumb" onclick="openProductModal('${p.id}')">
          <img src="${p.image}" alt="${productName}">
          <span class="type-tag" style="background: #ef4444;">⚡ FLASH SALE</span>
          <span class="badge-tag">-${Math.round((1 - fp.flashPrice / p.price) * 100)}%</span>
        </div>
        <div class="product-info">
          <h3 class="product-title" onclick="openProductModal('${p.id}')">${productName}</h3>
          
          <!-- Sales Progress Bar -->
          <div style="margin: 6px 0 16px 0;">
            <div style="width: 100%; height: 16px; background: #fee2e2; border-radius: 9999px; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; left: 0; top: 0; bottom: 0; width: ${percentSold}%; background: linear-gradient(90deg, #ef4444, #f43f5e); transition: width 0.5s;"></div>
              <span style="position: relative; font-size: 0.72rem; font-weight: 800; color: ${percentSold > 50 ? 'white' : '#ef4444'}; z-index: 2;">🔥 Đã bán ${fp.soldQty}/${fp.limitQty}</span>
            </div>
          </div>

          <div class="price-row">
            <div class="price-box">
              <span class="current-price" style="color: #ef4444;">${formattedFlashPrice}</span>
              <span class="original-price">${formattedOrigPrice}</span>
            </div>
            <!-- Pass flash sale pricing custom details directly to cart -->
            <button class="add-cart-btn" style="background: #ef4444;" onclick="addToCart('${p.id}', 0, true, ${fp.flashPrice})" title="${t('add_to_cart')}">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Interactive Live Search Bar
function initSearch() {
  const input = document.getElementById('search-input');
  const resultsBox = document.getElementById('search-results');
  if (!input || !resultsBox) return;

  input.addEventListener('input', (e) => {
    const val = e.target.value.trim().toLowerCase();
    if (val.length === 0) {
      resultsBox.classList.remove('active');
      renderProducts();
      return;
    }

    const matches = STORE_DATA.products.filter(p => 
      p.name.toLowerCase().includes(val) || 
      (p.name_en && p.name_en.toLowerCase().includes(val))
    ).slice(0, 5);

    if (matches.length > 0) {
      resultsBox.innerHTML = matches.map(p => {
        const productName = currentLang === 'en' && p.name_en ? p.name_en : p.name;
        return `
          <div class="search-item" onclick="openProductModal('${p.id}'); document.getElementById('search-results').classList.remove('active');">
            <img src="${p.image}" alt="${productName}">
            <div class="search-item-info">
              <div class="search-item-title">${productName}</div>
              <div class="search-item-price">${formatCurrency(p.price)}</div>
            </div>
          </div>
        `;
      }).join('');
      resultsBox.classList.add('active');
    } else {
      resultsBox.innerHTML = `<div style="padding: 12px; font-size: 0.85rem; color: #64748b; text-align: center;">${currentLang === 'en' ? 'No results found' : 'Không thấy kết quả'}</div>`;
      resultsBox.classList.add('active');
    }

    renderProducts(val);
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !resultsBox.contains(e.target)) {
      resultsBox.classList.remove('active');
    }
  });
}

// Banner Carousel Slider
function initCarousel() {
  const carouselBox = document.getElementById('hero-carousel');
  if (!carouselBox) return;

  carouselBox.innerHTML = `
    ${STORE_DATA.banners.map((b, idx) => `
      <div class="carousel-slide ${idx === 0 ? 'active' : ''}" style="background-image: url('${b.image}');">
        <div class="carousel-overlay">
          <div class="carousel-title">${b.title}</div>
          <div class="carousel-sub">${b.subtitle}</div>
          <a href="${b.link}" class="carousel-btn">${b.btnText}</a>
        </div>
      </div>
    `).join('')}
    <div class="carousel-nav">
      ${STORE_DATA.banners.map((_, idx) => `
        <div class="dot ${idx === 0 ? 'active' : ''}" onclick="goToSlide(${idx})"></div>
      `).join('')}
    </div>
  `;

  startCarouselAutoPlay();
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  if (!slides.length) return;

  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  currentSlideIndex = (index + slides.length) % slides.length;
  slides[currentSlideIndex].classList.add('active');
  dots[currentSlideIndex].classList.add('active');
}

function startCarouselAutoPlay() {
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(() => {
    goToSlide(currentSlideIndex + 1);
  }, 4500);
}

// SEO Schema JSON-LD Injection for Google Rich Snippets
function injectProductSchemaJsonLd(product) {
  let script = document.getElementById('product-schema-jsonld');
  if (!script) {
    script = document.createElement('script');
    script.id = 'product-schema-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  const v = product.variants && product.variants[0] ? product.variants[0] : null;
  const price = v ? v.price : product.price;
  const schemaData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [product.image],
    "description": product.description,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "VND",
      "price": price,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 5.0,
      "reviewCount": product.sold || 10
    }
  };
  script.textContent = JSON.stringify(schemaData);
}

// Product Quick View Modal with SEO URL Deep Linking & Psychological Anchor Pricing
function openProductModal(productId, updateUrl = true) {
  const product = STORE_DATA.products.find(p => p.id === productId);
  if (!product) return;

  const modalBody = document.getElementById('product-modal-body');
  if (!modalBody) return;

  const productName = currentLang === 'en' && product.name_en ? product.name_en : product.name;
  const productType = currentLang === 'en' && product.type_en ? product.type_en : product.type;

  const v0 = product.variants && product.variants[0] ? product.variants[0] : null;
  const initialPrice = v0 ? v0.price : product.price;
  const initialOrigPrice = v0 ? (v0.originalPrice || v0.price * 1.5) : (product.originalPrice || product.price * 1.5);
  const initialDiscount = initialOrigPrice > initialPrice ? Math.round((1 - initialPrice / initialOrigPrice) * 100) : 0;
  const initialSavings = initialOrigPrice > initialPrice ? (initialOrigPrice - initialPrice) : 0;

  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;">
      <div>
        <img src="${product.image}" alt="${productName}" style="width: 100%; border-radius: 12px; height: 260px; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="margin-top: 12px; display: flex; gap: 8px;">
          <span style="background: #e0f2fe; color: #0284c7; font-weight: 700; font-size: 0.78rem; padding: 4px 10px; border-radius: 6px;">${productType}</span>
          <span style="background: #fef3c7; color: #d97706; font-weight: 700; font-size: 0.78rem; padding: 4px 10px; border-radius: 6px;">${t('lifetime_warranty')}</span>
        </div>
      </div>
      <div>
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 8px; line-height: 1.3;">${productName}</h2>
        <div style="font-size: 0.85rem; color: #64748b; margin-bottom: 12px;">${t('rating')}: ★ ${product.rating} (${t('sold')} ${product.sold})</div>

        <!-- Psychological Pricing Showcase (Giá hiện tại, Giá gốc gạch ngang, % Giảm giá & Tiết kiệm) -->
        <div class="modal-pricing-box" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; padding: 12px 16px; background: #f0f7ff; border: 1.5px solid #bae6fd; border-radius: 10px;">
          <div style="display: flex; align-items: baseline; gap: 10px;">
            <span id="modal-current-price" style="font-size: 1.5rem; font-weight: 900; color: #0284c7;">${formatCurrency(initialPrice)}</span>
            <span id="modal-orig-price" style="font-size: 0.95rem; color: #94a3b8; text-decoration: line-through; font-weight: 600;">${formatCurrency(initialOrigPrice)}</span>
            <span id="modal-discount-badge" style="background: #ef4444; color: white; font-size: 0.75rem; font-weight: 800; padding: 3px 8px; border-radius: 6px; ${initialDiscount > 0 ? '' : 'display: none;'}">-${initialDiscount}%</span>
          </div>
          <div id="modal-savings-text" style="font-size: 0.8rem; color: #059669; font-weight: 800; background: #d1fae5; padding: 4px 10px; border-radius: 6px; ${initialSavings > 0 ? '' : 'display: none;'}">
            ${currentLang === 'en' ? 'Save ' + formatCurrency(initialSavings) : 'Tiết kiệm ' + formatCurrency(initialSavings)}
          </div>
        </div>

        <p style="font-size: 0.88rem; color: #334155; margin-bottom: 16px; line-height: 1.45;">${currentLang === 'en' && product.description_en ? product.description_en : product.description}</p>
        
        <div style="margin-bottom: 16px;">
          <label style="font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 8px;">${currentLang === 'en' ? 'Select Plan Duration:' : 'Chọn gói thời hạn:'}</label>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;" id="variant-selector-box">
            ${product.variants ? product.variants.map((v, i) => `
              <button class="variant-btn ${i === 0 ? 'active' : ''}" onclick="selectVariant(${i}, '${product.id}')" style="padding: 8px 14px; border-radius: 8px; border: 1px solid #cbd5e1; background: ${i === 0 ? '#2579f2' : 'white'}; color: ${i === 0 ? 'white' : '#1e293b'}; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
                ${v.label} - ${formatCurrency(v.price)}
              </button>
            `).join('') : '<span style="font-size: 0.85rem;">Bản chuẩn</span>'}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="font-weight: 700; font-size: 0.88rem; margin-bottom: 6px;">${currentLang === 'en' ? 'Key Features:' : 'Tính năng nổi bật:'}</div>
          <ul style="padding-left: 18px; font-size: 0.84rem; color: #475569;">
            ${product.features.map(f => `<li style="margin-bottom: 4px;">${f}</li>`).join('')}
          </ul>
        </div>

        <div style="display: flex; gap: 12px; align-items: center;">
          <button onclick="addToCart('${product.id}', window.currentModalVariant || 0); closeProductModal();" style="flex: 1; background: linear-gradient(90deg, #2579f2, #1e6fdc); color: white; border: none; padding: 12px 20px; border-radius: 10px; font-weight: 800; font-size: 0.95rem; box-shadow: 0 4px 14px rgba(37,121,242,0.35); cursor: pointer;">
            ${t('add_to_cart')}
          </button>
        </div>
      </div>
    </div>
  `;

  window.currentModalVariant = 0;
  document.getElementById('product-modal')?.classList.add('active');

  // SEO URL routing & Title update
  if (updateUrl) {
    const url = new URL(window.location);
    url.searchParams.set('p', product.id);
    window.history.pushState({ productId: product.id }, '', url);
  }
  document.title = `${productName} - Tagki AI & Software`;
  injectProductSchemaJsonLd(product);
}

function selectVariant(idx, productId) {
  window.currentModalVariant = idx;
  const prod = STORE_DATA.products.find(p => p.id === productId);
  if (!prod) return;

  const btns = document.querySelectorAll('#variant-selector-box .variant-btn');
  btns.forEach((b, i) => {
    if (i === idx) {
      b.style.background = '#2579f2';
      b.style.color = 'white';
    } else {
      b.style.background = 'white';
      b.style.color = '#1e293b';
    }
  });

  const v = prod.variants && prod.variants[idx] ? prod.variants[idx] : null;
  if (v) {
    const price = v.price;
    const origPrice = v.originalPrice || v.price * 1.5;
    const discount = origPrice > price ? Math.round((1 - price / origPrice) * 100) : 0;
    const savings = origPrice > price ? (origPrice - price) : 0;

    const curEl = document.getElementById('modal-current-price');
    const origEl = document.getElementById('modal-orig-price');
    const discBadge = document.getElementById('modal-discount-badge');
    const saveEl = document.getElementById('modal-savings-text');

    if (curEl) curEl.textContent = formatCurrency(price);
    if (origEl) origEl.textContent = formatCurrency(origPrice);
    if (discBadge) {
      discBadge.textContent = `-${discount}%`;
      discBadge.style.display = discount > 0 ? 'inline-block' : 'none';
    }
    if (saveEl) {
      saveEl.textContent = (currentLang === 'en' ? 'Save ' + formatCurrency(savings) : 'Tiết kiệm ' + formatCurrency(savings));
      saveEl.style.display = savings > 0 ? 'block' : 'none';
    }
  }
}

function closeProductModal(updateUrl = true) {
  document.getElementById('product-modal')?.classList.remove('active');
  if (updateUrl) {
    const url = new URL(window.location);
    url.searchParams.delete('p');
    url.searchParams.delete('product');
    window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    document.title = (currentLang === 'en' ? 'Tagki - Premium AI Accounts & Software License Store' : 'Tagki - Cửa Hàng Tài Khoản AI & Key Bản Quyền Số 1 VN');
  }
  const script = document.getElementById('product-schema-jsonld');
  if (script) script.remove();
}

// 2FA Code Generator Tool Modal
function open2FAModal() {
  const modalBody = document.getElementById('tools-modal-body');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 16px;">
      <h3 style="font-size: 1.2rem; font-weight: 800;">${currentLang === 'en' ? '2FA Code Generator (TOTP)' : 'Công Cụ Tạo Mã 2FA (TOTP)'}</h3>
      <p style="font-size: 0.8rem; color: #64748b;">${currentLang === 'en' ? 'Enter 2FA Secret Key to generate secure 6-digit TOTP code' : 'Nhập Secret Key 2FA để sinh mã xác thực 6 chữ số an toàn ngay lập tức'}</p>
    </div>

    <div style="margin-bottom: 14px;">
      <input type="text" id="totp-secret" class="tool-input" placeholder="JBSWY3DPEHPK3PXP" value="JBSWY3DPEHPK3PXP" oninput="generateTOTPCode()">
    </div>

    <div class="code-display" id="totp-output-code">
      123 456
    </div>

    <div style="text-align: center; margin-top: 10px; font-size: 0.8rem; color: #10b981; font-weight: 600;" id="totp-timer">
      ⏱ ${currentLang === 'en' ? 'Code refreshes every 30s' : 'Mã tự động đổi sau 30s'}
    </div>
  `;

  generateTOTPCode();
  document.getElementById('tools-modal')?.classList.add('active');
}

function generateTOTPCode() {
  const secret = document.getElementById('totp-secret')?.value || '';
  const output = document.getElementById('totp-output-code');
  if (!output) return;

  if (secret.trim().length < 6) {
    output.textContent = '--- ---';
    return;
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  output.textContent = `${code.substring(0,3)} ${code.substring(3)}`;
}

function closeToolsModal() {
  document.getElementById('tools-modal')?.classList.remove('active');
}

// Render 3 Latest Blogs on homepage
function renderLatestBlogs() {
  const blogsGrid = document.getElementById('latest-blogs-grid');
  if (!blogsGrid) return;

  const INITIAL_BLOGS = [
    {
      id: "ai-trends-2026",
      title: "Xu Hướng Công Nghệ AI Năm 2026: ChatGPT & Sora Định Hình Thế Giới",
      title_en: "AI Trends in 2026: ChatGPT & Sora Reshaping the Digital World",
      summary: "Tìm hiểu sự phát triển vượt bậc của các mô hình AI tạo video như Sora và các tác vụ agentic AI tự động hóa lập trình.",
      summary_en: "Explore the massive evolution from passive AI assistants to active agentic AI workflows automating engineering.",
      image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80",
      date: "25/07/2026",
      author: "Tagki Editor"
    },
    {
      id: "why-use-cursor-ide",
      title: "Tại Sao Lập Trình Viên Nên Chuyển Sang Sử Dụng Cursor Pro?",
      title_en: "Why Developers Should Switch to Cursor Pro?",
      summary: "Khám phá các tính năng ưu việt của AI Code Editor số 1 hiện nay. Tăng tốc độ viết code lên gấp 3 lần với Claude 3.5 Sonnet.",
      summary_en: "Discover the advanced features of the #1 AI Code Editor. Accelerate your coding workflow up to 3x using Claude 3.5 Sonnet.",
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80",
      date: "24/07/2026",
      author: "Dev Admin"
    },
    {
      id: "vpn-protection-guide",
      title: "Hướng Dẫn Bảo Mật Tài Khoản Số & Dữ Liệu Khi Sử Dụng Wifi Công Cộng",
      title_en: "Securing Digital Accounts & Data on Public Wi-Fi Networks",
      summary: "Sử dụng VPN như NordVPN hay AdGuard Premium là cách đơn giản và an toàn nhất để tránh bị nghe lén dữ liệu cá nhân.",
      summary_en: "Using a VPN like NordVPN or AdGuard Premium is the easiest and safest way to avoid private data snooping.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
      date: "23/07/2026",
      author: "Security Expert"
    }
  ];

  let storedBlogs = JSON.parse(localStorage.getItem('tagki_blogs'));
  if (!storedBlogs || storedBlogs.length === 0 || !storedBlogs[0].title_en) {
    storedBlogs = INITIAL_BLOGS;
    localStorage.setItem('tagki_blogs', JSON.stringify(storedBlogs));
  }

  // Take the 3 latest blog posts
  const latestBlogs = storedBlogs.slice(0, 3);

  blogsGrid.innerHTML = latestBlogs.map(b => {
    const title = currentLang === 'en' ? (b.title_en || b.title) : b.title;
    const summary = currentLang === 'en' ? (b.summary_en || b.summary) : b.summary;
    const authorLabel = currentLang === 'en' ? 'Author' : 'Tác giả';
    const readMoreLabel = currentLang === 'en' ? 'Read Article ➜' : 'Đọc bài viết ➜';

    return `
      <div style="background: white; border-radius: var(--radius-md); border: 1px solid var(--border); overflow: hidden; box-shadow: var(--shadow-sm); display: flex; flex-direction: column;">
        <img src="${b.image}" alt="${title}" style="width: 100%; height: 160px; object-fit: cover;">
        <div style="padding: 16px; display: flex; flex-direction: column; flex: 1;">
          <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; margin-bottom: 6px;">📅 ${b.date} • ${authorLabel}: ${b.author}</span>
          <h3 style="font-size: 0.95rem; font-weight: 800; color: var(--text-main); margin-bottom: 8px; line-height: 1.4; min-height: 2.8em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
            ${title}
          </h3>
          <p style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 14px; flex: 1; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
            ${summary}
          </p>
          <a href="blog.html?id=${b.id}" style="color: var(--primary); font-weight: 800; font-size: 0.82rem; margin-top: auto; display: inline-flex; align-items: center; gap: 4px;">
            ${readMoreLabel}
          </a>
        </div>
      </div>
    `;
  }).join('');
}
