// Tagki User Auth & Google OAuth Module with 2FA Protection Emulation

let currentUser = JSON.parse(localStorage.getItem('tagki_user')) || null;

function saveUserSession(user) {
  currentUser = user;
  localStorage.setItem('tagki_user', JSON.stringify(user));
  updateAuthUI();
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem('tagki_user');
  updateAuthUI();
  if (typeof showToast === 'function') {
    showToast(currentLang === 'en' ? 'Logged out successfully' : 'Đã đăng xuất thành công');
  }
}

function updateAuthUI() {
  const loginBtns = document.querySelectorAll('.login-btn-header');
  const userProfileBtns = document.querySelectorAll('.user-profile-header');

  if (currentUser) {
    loginBtns.forEach(btn => btn.style.display = 'none');
    userProfileBtns.forEach(btn => {
      btn.style.display = 'flex';
      btn.innerHTML = `
        <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}" alt="${currentUser.fullName}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">
        <span style="font-weight: 700; font-size: 0.85rem; color: white;">${currentUser.fullName.split(' ')[0]}</span>
      `;
    });
  } else {
    loginBtns.forEach(btn => btn.style.display = 'flex');
    userProfileBtns.forEach(btn => btn.style.display = 'none');
  }
}

// Redirect Google login to account chooser modal
function loginWithGoogle() {
  // showGoogleAccountChooser(); gọi hàm chạy giả lập
  //429904534455-n7nkh8qe87b2piecusjfcig3hu8s0l2j.apps.googleusercontent.com
  google.accounts.id.initialize({
    client_id: "429904534455-n7nkh8qe87b2piecusjfcig3hu8s0l2j.apps.googleusercontent.com", // Dán Client ID của bạn vào đây
    callback: handleGoogleCredentialResponse
  });
  google.accounts.id.prompt(); // Hiện hộp thoại Google One Tap ở góc màn hình
}

function handleGoogleCredentialResponse(response) {
  // Gửi JWT token nhận từ Google về Backend để xác thực bảo mật
  fetch(BACKEND_API_URL + '/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: response.credential })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      saveUserSession(data.user);
      closeAuthModal();
      showToast(currentLang === 'en' ? "Logged in successfully!" : "Đăng nhập bằng tài khoản Google thành công!");
    } else {
      alert("Xác thực đăng nhập Google thất bại: " + data.message);
    }
  })
  .catch(err => console.error("Lỗi kết nối OAuth:", err));
}

// Render Google Account Chooser interface
function showGoogleAccountChooser() {
  const modalBody = document.getElementById('auth-modal-body');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 24px; font-family: Roboto, Arial, sans-serif;">
      <!-- Google Icon -->
      <svg width="24" height="24" viewBox="0 0 24 24" style="margin-bottom: 8px; display: inline-block;">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
      </svg>
      <h3 style="font-size: 1.25rem; font-weight: 500; color: #202124; margin: 0;">${t('google_chooser_title')}</h3>
      <p style="font-size: 0.88rem; color: #5f6368; margin-top: 4px;">${t('google_chooser_subtitle')}</p>
    </div>

    <div style="display: flex; flex-direction: column; border: 1px solid #dadce0; border-radius: 8px; overflow: hidden; margin-bottom: 20px; background: white;">
      <!-- Account Item 1 -->
      <div onclick="selectGoogleAccount('contact.tagki@gmail.com', 'Tagki Admin Support')" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #dadce0; cursor: pointer; transition: background 0.15s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
        <div style="text-align: left;">
          <div style="font-size: 0.88rem; font-weight: 600; color: #3c4043;">Tagki Admin Support</div>
          <div style="font-size: 0.78rem; color: #5f6368;">contact.tagki@gmail.com</div>
        </div>
      </div>

      <!-- Account Item 2 -->
      <div onclick="selectGoogleAccount('thiemvv@gmail.com', 'Thiêm Vũ')" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #dadce0; cursor: pointer; transition: background 0.15s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
        <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80" alt="Avatar" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
        <div style="text-align: left;">
          <div style="font-size: 0.88rem; font-weight: 600; color: #3c4043;">Thiêm Vũ</div>
          <div style="font-size: 0.78rem; color: #5f6368;">thiemvv@gmail.com</div>
        </div>
      </div>

      <!-- Account Item 3 (Add Account Prompt) -->
      <div onclick="selectGoogleAccountPrompt()" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; transition: background 0.15s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #f1f3f4; display: flex; align-items: center; justify-content: center; color: #1a73e8;">
          +
        </div>
        <div style="text-align: left;">
          <div style="font-size: 0.88rem; font-weight: 600; color: #1a73e8;">${t('google_use_another')}</div>
        </div>
      </div>
    </div>

    <div style="font-size: 0.75rem; color: #5f6368; text-align: left; line-height: 1.4; padding: 0 4px;">
      ${t('google_privacy_notice')}
    </div>
  `;
}

function selectGoogleAccount(email, name) {
  window.pendingUser = {
    id: "g_" + Math.floor(100000 + Math.random() * 900000),
    email: email,
    fullName: name,
    avatar: email === 'thiemvv@gmail.com' ? "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80" : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
    authProvider: "google_gmail",
    role: email.includes('admin') || email.includes('support') ? "admin" : "customer"
  };
  show2FAScreen();
}

function selectGoogleAccountPrompt() {
  const customEmail = prompt(currentLang === 'en' ? "Enter your new Gmail address to register:" : "Nhập địa chỉ Gmail mới của bạn để đăng ký:");
  if (customEmail && customEmail.includes("@")) {
    selectGoogleAccount(customEmail.trim(), customEmail.split("@")[0]);
  }
}

// Standard Email Login with 2FA Integration
function handleStandardLogin(event) {
  event.preventDefault();
  const email = document.getElementById('auth-email')?.value;
  const pass = document.getElementById('auth-password')?.value;

  if (!email || !pass) {
    if (typeof showToast === 'function') showToast(currentLang === 'en' ? "Please fill in Email and Password!" : "Vui lòng điền đầy đủ Email và Mật khẩu!");
    return;
  }

  // Admin account check
  if (email === 'admin@tagki.vn' && pass === 'admin123') {
    const adminUser = {
      id: 1,
      email: email,
      fullName: "Tagki Admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
      role: "admin"
    };
    window.pendingUser = adminUser;
    show2FAScreen();
    return;
  }

  const user = {
    id: "u_" + Date.now(),
    email: email,
    fullName: email.split('@')[0],
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
    role: "customer"
  };

  window.pendingUser = user;
  show2FAScreen();
}

// Render 2FA Security screen inside modal
function show2FAScreen() {
  const modalBody = document.getElementById('auth-modal-body');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #ef4444, #b91c1c); color: white; border-radius: 12px; font-weight: 800; font-size: 1.4rem; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 8px;">🔒</div>
      <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a;">${t('twofa_title')}</h3>
      <p style="font-size: 0.84rem; color: #64748b; margin-top: 4px;">${t('twofa_subtitle')}</p>
    </div>

    <div style="background: #f1f5f9; border-radius: 8px; padding: 12px; font-size: 0.82rem; margin-bottom: 16px; border: 1px solid #cbd5e1;">
      <div style="font-weight: 700; color: #334155; margin-bottom: 4px;">${t('twofa_secret_label')}</div>
      <code style="font-size: 0.95rem; font-weight: 800; color: #ef4444; word-break: break-all;">TAGKI2FA2026</code>
      <div style="margin-top: 6px; font-size: 0.76rem; color: #64748b;">${t('twofa_secret_help')}</div>
    </div>

    <form onsubmit="handleVerify2FA(event)">
      <div style="margin-bottom: 20px;">
        <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 6px;">${t('twofa_input_label')}</label>
        <input type="text" id="auth-2fa-input" class="tool-input" placeholder="123456" required style="font-size: 1.3rem; font-weight: 800; text-align: center; letter-spacing: 4px;" maxlength="6" autofocus>
      </div>

      <button type="submit" style="width: 100%; background: linear-gradient(90deg, #ef4444, #dc2626); color: white; border: none; padding: 12px; border-radius: 10px; font-weight: 800; font-size: 0.95rem; box-shadow: 0 4px 14px rgba(239,68,68,0.35); cursor: pointer;">
        ${t('twofa_verify_btn')}
      </button>
    </form>
  `;
}

// Verification callback
function handleVerify2FA(event) {
  event.preventDefault();
  const codeInput = document.getElementById('auth-2fa-input')?.value || '';
  if (codeInput.trim().length !== 6 || isNaN(codeInput)) {
    alert(currentLang === 'en' ? "2FA code must be exactly 6 digits!" : "Mã 2FA phải bao gồm đúng 6 chữ số!");
    return;
  }

  if (window.pendingUser) {
    saveUserSession(window.pendingUser);
    const userName = window.pendingUser.fullName;
    const userRole = window.pendingUser.role;
    window.pendingUser = null;
    
    closeAuthModal();
    if (typeof showToast === 'function') {
      showToast(currentLang === 'en' ? `Welcome back, ${userName}!` : `Đăng nhập & Xác thực 2FA thành công! Chào mừng ${userName}.`);
    }

    if (userRole === 'admin') {
      window.location.href = "admin.html";
    }
  }
}

function openAuthModal(mode = 'login') {
  const modalBody = document.getElementById('auth-modal-body');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #2579f2, #1e6fdc); color: white; border-radius: 12px; font-weight: 800; font-size: 1.4rem; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 8px;">T</div>
      <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a;">${mode === 'login' ? t('login_btn') : t('register_submit')}</h3>
      <p style="font-size: 0.84rem; color: #64748b;">${t('auth_subtitle')}</p>
    </div>

    <!-- Google Login Button -->
    <button onclick="loginWithGoogle()" style="width: 100%; background: #ffffff; color: #374151; border: 1px solid #d1d5db; padding: 12px; border-radius: 10px; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); transition: all 0.2s; margin-bottom: 16px; cursor: pointer;">
      <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
      <span>${t('login_google')}</span>
    </button>

    <div style="display: flex; align-items: center; margin: 16px 0; color: #94a3b8; font-size: 0.8rem;">
      <hr style="flex: 1; border: none; border-top: 1px solid #e2e8f0;">
      <span style="padding: 0 10px; font-weight: 600;">${t('login_or')}</span>
      <hr style="flex: 1; border: none; border-top: 1px solid #e2e8f0;">
    </div>

    <!-- Email Login Form -->
    <form onsubmit="handleStandardLogin(event)">
      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">${t('email_label')}</label>
        <input type="email" id="auth-email" class="tool-input" placeholder="${t('auth_email_placeholder')}" required>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">${t('password_label')}</label>
        <input type="password" id="auth-password" class="tool-input" placeholder="••••••••" required>
      </div>

      <button type="submit" style="width: 100%; background: linear-gradient(90deg, #2579f2, #1e6fdc); color: white; border: none; padding: 12px; border-radius: 10px; font-weight: 800; font-size: 0.95rem; box-shadow: 0 4px 14px rgba(37,121,242,0.35); cursor: pointer;">
        ${mode === 'login' ? t('login_submit') : t('register_submit')}
      </button>
    </form>

    ${mode === 'login' ? `
      <div style="text-align: center; margin-top: 16px; font-size: 0.82rem;">
        <a href="javascript:void(0)" onclick="openAuthModal('register')" style="color: #2579f2; font-weight: 700; text-decoration: none;">${t('need_account')}</a>
      </div>
    ` : `
      <div style="text-align: center; margin-top: 16px; font-size: 0.82rem;">
        <a href="javascript:void(0)" onclick="openAuthModal('login')" style="color: #2579f2; font-weight: 700; text-decoration: none;">${t('already_have_acc')}</a>
      </div>
    `}
  `;

  document.getElementById('auth-modal')?.classList.add('active');
}

function closeAuthModal() {
  document.getElementById('auth-modal')?.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
});
