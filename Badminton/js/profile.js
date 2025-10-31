// Profile Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const USERS_KEY = 'proBadmintonUsers';
    const CURRENT_USER_KEY = 'proBadmintonCurrentUser';
    
    // Elements
    const profileSection = document.getElementById('profile');
    const profileUsername = document.getElementById('profile-username');
    const profileEmail = document.getElementById('profile-email');
    const profileAvatar = document.getElementById('profile-avatar');
    const welcomeUsername = document.getElementById('welcome-username');
    const profileNavLinks = document.querySelectorAll('.profile-nav-link');
    const profileTabs = document.querySelectorAll('.profile-tab');
    const profileLogoutBtn = document.getElementById('profile-logout-btn');
    const profileSettingsForm = document.getElementById('profile-settings-form');
    const profileFullname = document.getElementById('profile-fullname');
    const profileEmailInput = document.getElementById('profile-email-input');
    
    // Helper functions
    function getCurrentUser() {
        const curUser = localStorage.getItem(CURRENT_USER_KEY);
        return curUser ? JSON.parse(curUser) : null;
    }
    
    function getUsers() {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    }
    
    function updateUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    function updateCurrentUser(user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
    
    // Show/Hide profile section based on login status
    function checkProfileAccess() {
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.account) {
            // Chưa đăng nhập, ẩn profile
            if (profileSection) {
                profileSection.classList.add('hidden');
            }
            // Nếu đang ở hash profile, chuyển về trang chủ
            if (window.location.hash.startsWith('#profile')) {
                window.location.hash = '';
            }
            return false;
        }
        return true;
    }
    
    // Display user information
    function displayUserInfo() {
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.account) {
            const username = currentUser.account;
            const email = currentUser.email || '';
            
            // Cập nhật thông tin hiển thị
            if (profileUsername) profileUsername.textContent = username;
            if (profileEmail) profileEmail.textContent = `@${username.toLowerCase().replace(/\s/g, '')}`;
            if (welcomeUsername) welcomeUsername.textContent = username;
            
            // Cập nhật avatar (có thể thêm logic upload avatar sau)
            if (profileAvatar) {
                const initial = username.charAt(0).toUpperCase();
                profileAvatar.src = `https://placehold.co/128x128/e0e7ff/4338ca?text=${initial}`;
            }
            
            // Cập nhật form settings
            if (profileFullname) profileFullname.value = username;
            if (profileEmailInput) profileEmailInput.value = email;
        }
    }
    
    // Tab navigation
    function switchTab(tabId) {
        // Ẩn tất cả tabs
        profileTabs.forEach(tab => tab.classList.remove('active'));
        profileNavLinks.forEach(link => link.classList.remove('active'));
        
        // Hiện tab được chọn
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        // Highlight nav link
        const selectedLink = document.querySelector(`.profile-nav-link[data-tab="${tabId}"]`);
        if (selectedLink) {
            selectedLink.classList.add('active');
        }
    }
    
    // Handle nav link clicks
    profileNavLinks.forEach(link => {
        if (link.id !== 'profile-logout-btn') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = link.getAttribute('data-tab');
                if (tabId) {
                    switchTab(tabId);
                    // Cập nhật URL hash
                    history.pushState(null, null, `#profile/${tabId}`);
                }
            });
        }
    });
    
    // Handle logout
    if (profileLogoutBtn) {
        profileLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Bạn có chắc muốn đăng xuất?')) {
                localStorage.removeItem(CURRENT_USER_KEY);
                // Trigger sự kiện để script.js cập nhật UI
                document.body.classList.remove('user-logged-in');
                window.location.hash = '';
                window.location.reload();
            }
        });
    }
    
    // Handle settings form submit
    if (profileSettingsForm) {
        profileSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const currentUser = getCurrentUser();
            if (!currentUser) return;
            
            const newFullname = profileFullname.value.trim();
            const newEmail = profileEmailInput.value.trim();
            const currentPassword = document.getElementById('profile-current-password').value;
            const newPassword = document.getElementById('profile-new-password').value;
            
            // Validate
            if (!newFullname || !newEmail) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }
            
            // Cập nhật thông tin
            const users = getUsers();
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            
            if (userIndex !== -1) {
                users[userIndex].account = newFullname;
                
                // Nếu đổi mật khẩu
                if (currentPassword && newPassword) {
                    const hashedCurrentPassword = 'hashed_' + currentPassword;
                    if (users[userIndex].password !== hashedCurrentPassword) {
                        alert('Mật khẩu hiện tại không đúng!');
                        return;
                    }
                    users[userIndex].password = 'hashed_' + newPassword;
                }
                
                // Lưu lại
                updateUsers(users);
                updateCurrentUser(users[userIndex]);
                
                // Cập nhật UI
                displayUserInfo();
                
                // Toast notification
                const toastEl = document.getElementById('toast');
                if (toastEl) {
                    toastEl.textContent = 'Cập nhật thông tin thành công!';
                    toastEl.className = 'toast success show';
                    setTimeout(() => {
                        toastEl.classList.remove('show');
                    }, 2500);
                }
                
                // Reset password fields
                document.getElementById('profile-current-password').value = '';
                document.getElementById('profile-new-password').value = '';
            }
        });
    }
    
    // Handle hash navigation
    function handleHashChange() {
        const hash = window.location.hash;
        
        if (hash.startsWith('#profile')) {
            if (checkProfileAccess()) {
                // Hiện profile section
                if (profileSection) {
                    profileSection.classList.remove('hidden');
                }
                
                // Ẩn hero và các section khác
                const hero = document.querySelector('.hero');
                const sections = document.querySelectorAll('.featured-brands, .product-section, .promo-banner, .testimonials');
                if (hero) hero.style.display = 'none';
                sections.forEach(s => s.style.display = 'none');
                
                // Switch to specific tab if specified
                const parts = hash.split('/');
                if (parts[1]) {
                    switchTab(parts[1]);
                } else {
                    switchTab('TongQuan');
                }
            }
        } else {
            // Ẩn profile, hiện trang chủ
            if (profileSection) {
                profileSection.classList.add('hidden');
            }
            
            const hero = document.querySelector('.hero');
            const sections = document.querySelectorAll('.featured-brands, .product-section, .promo-banner, .testimonials');
            if (hero) hero.style.display = 'block';
            sections.forEach(s => s.style.display = 'block');
        }
    }
    
    // Listen to hash change
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial load
    if (checkProfileAccess()) {
        displayUserInfo();
    }
    handleHashChange();
});
