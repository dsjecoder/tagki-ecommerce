// Tagki Social Proof Real-Time Notifications Module

const SAMPLE_LOCATIONS = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Bình Dương', 'Quảng Ninh', 'Đồng Nai','Florida', 'Texas', 'Orlando'];
const SAMPLE_NAMES = ['Anh Nam', 'Nguyễn T.', 'Trần K.', 'Lê Minh', 'Phạm H.', 'Đỗ Hoàng', 'Vũ Đức', 'Hoàng Yến', 'Tony Hoàng', 'Cường Ngô', 'Annie'];

let socialProofTimer = null;

function initSocialProof() {
  createSocialProofContainer();
  scheduleNextNotification();
}

function createSocialProofContainer() {
  if (document.getElementById('social-proof-toast')) return;

  const toast = document.createElement('div');
  toast.id = 'social-proof-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 24px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-left: 4px solid #2579f2;
    border-radius: 14px;
    padding: 12px 16px;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.15);
    z-index: 1500;
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 340px;
    transform: translateY(120px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    cursor: pointer;
  `;

  document.body.appendChild(toast);
}

function getRandomActivity() {
  const name = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
  const loc = SAMPLE_LOCATIONS[Math.floor(Math.random() * SAMPLE_LOCATIONS.length)];
  const product = STORE_DATA.products[Math.floor(Math.random() * STORE_DATA.products.length)];
  const types = ['purchased', 'cart', 'viewed'];
  const type = types[Math.floor(Math.random() * types.length)];
  const timeAgo = `${Math.floor(Math.random() * 15) + 1} phút trước`;

  return { name, loc, product, type, timeAgo };
}

function showSocialProofNotification() {
  const toast = document.getElementById('social-proof-toast');
  if (!toast || !STORE_DATA?.products?.length) return;

  const activity = getRandomActivity();

  let iconHtml = '🛒';
  let actionTextVi = 'vừa mua thành công';
  let actionTextEn = 'just purchased';
  let badgeColor = '#10b981';

  if (activity.type === 'cart') {
    iconHtml = '🛍️';
    actionTextVi = 'vừa thêm vào giỏ hàng';
    actionTextEn = 'added to cart';
    badgeColor = '#f59e0b';
  } else if (activity.type === 'viewed') {
    iconHtml = '👀';
    actionTextVi = 'đang xem sản phẩm';
    actionTextEn = 'is viewing';
    badgeColor = '#3b82f6';
  }

  const productName = currentLang === 'en' && activity.product.name_en ? activity.product.name_en : activity.product.name;
  const actionText = currentLang === 'en' ? actionTextEn : actionTextVi;

  toast.innerHTML = `
    <img src="${activity.product.image}" alt="${productName}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 10px;">
    <div style="flex: 1;">
      <div style="font-size: 0.78rem; color: #64748b; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
        <span>${iconHtml} ${activity.name} (${activity.loc})</span>
        <span style="font-size: 0.7rem; color: #94a3b8;">${activity.timeAgo}</span>
      </div>
      <div style="font-size: 0.85rem; font-weight: 700; color: #0f172a; margin-top: 2px;">${actionText}</div>
      <div style="font-size: 0.8rem; font-weight: 700; color: #2579f2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px;">
        ${productName}
      </div>
    </div>
    <button onclick="event.stopPropagation(); hideSocialProof();" style="background: none; border: none; color: #94a3b8; font-size: 1.1rem; padding: 0 4px; cursor: pointer;">✕</button>
  `;

  toast.onclick = () => {
    openProductModal(activity.product.id);
  };

  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    hideSocialProof();
  }, 5000);
}

function hideSocialProof() {
  const toast = document.getElementById('social-proof-toast');
  if (toast) {
    toast.style.transform = 'translateY(120px)';
    toast.style.opacity = '0';
  }
}

function scheduleNextNotification() {
  if (socialProofTimer) clearTimeout(socialProofTimer);
  
  const interval = Math.floor(Math.random() * 19000) + 8000; // 8 - 27 seconds
  socialProofTimer = setTimeout(() => {
    showSocialProofNotification();
    scheduleNextNotification();
  }, interval);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initSocialProof, 3000);
});
