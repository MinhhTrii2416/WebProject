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
    const brandSection = document.getElementById('brand-section');
    
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
    
    // Get user favorites from localStorage
    function getUserFavorites(userId) {
        const favKey = `proBadmintonFavorites_${userId}`;
        const favorites = localStorage.getItem(favKey);
        return favorites ? JSON.parse(favorites) : [];
    }
    
    // Get user order history from localStorage
    function getUserOrderHistory(userId) {
        const ORDER_HISTORY_KEY = 'proBadmintonOrderHistory_';
        const historyKey = ORDER_HISTORY_KEY + userId;
        const history = localStorage.getItem(historyKey);
        return history ? JSON.parse(history) : [];
    }
    
    // Format price
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    }
    
    // Format date
    function formatDate(isoString) {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    // Get status badge class and text
    function getStatusInfo(status) {
        const statusMap = {
            'processing': { class: 'status-processing', text: 'Đang xử lý' },
            'shipping': { class: 'status-shipping', text: 'Đang vận chuyển' },
            'delivered': { class: 'status-delivered', text: 'Đã giao hàng' },
            'cancelled': { class: 'status-cancelled', text: 'Đã hủy' }
        };
        return statusMap[status] || { class: 'status-processing', text: 'Đang xử lý' };
    }
    
    // Display order history
    function displayOrderHistory() {
        const currentUserAccount = localStorage.getItem(CURRENT_USER_KEY);
        if (!currentUserAccount) return;
        
        const orderTab = document.getElementById('LichSuDonHang');
        if (!orderTab) return;
        
        // Get order history
        const orders = getUserOrderHistory(currentUserAccount);
        
        if (orders.length === 0) {
            orderTab.innerHTML = `
                <h2 class="profile-tab-title">Lịch sử Đơn hàng</h2>
                <p class="profile-empty-message">Bạn chưa có đơn hàng nào.</p>
            `;
            return;
        }
        
        // Render order history
        const ordersHTML = orders.map(order => {
            const statusInfo = getStatusInfo(order.status);
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
            
            return `
                <div class="profile-order-item">
                    <div class="profile-order-info">
                        <p class="profile-order-id">Mã đơn: #${order.orderId}</p>
                        <p class="profile-order-date">Ngày đặt: ${formatDate(order.orderDate)}</p>
                        <p class="profile-order-items">${itemCount} sản phẩm</p>
                    </div>
                    <div class="profile-order-price">
                        <p>Tổng tiền: <span class="profile-order-total">${formatPrice(order.totalAmount)}</span></p>
                    </div>
                    <div class="profile-order-status">
                        <span class="profile-status-badge ${statusInfo.class}">${statusInfo.text}</span>
                    </div>
                    <button class="profile-order-detail-btn" data-order-id="${order.orderId}">
                        Xem chi tiết
                    </button>
                </div>
            `;
        }).join('');
        
        orderTab.innerHTML = `
            <h2 class="profile-tab-title">Lịch sử Đơn hàng (${orders.length})</h2>
            <div class="profile-orders-list">
                ${ordersHTML}
            </div>
        `;
        
        // Add event listeners for detail buttons
        const detailButtons = orderTab.querySelectorAll('.profile-order-detail-btn');
        detailButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const orderId = btn.dataset.orderId;
                showOrderDetail(orderId, currentUserAccount);
            });
        });
    }
    
    // Show order detail modal
    function showOrderDetail(orderId, userId) {
        const orders = getUserOrderHistory(userId);
        const order = orders.find(o => o.orderId === orderId);
        
        if (!order) return;
        
        const statusInfo = getStatusInfo(order.status);
        
        // Create modal HTML
        const itemsHTML = order.items.map(item => `
            <div class="order-detail-item">
                <img src="${item.productImage}" alt="${item.productName}" class="order-item-image">
                <div class="order-item-info">
                    <span class="order-item-brand">${item.productBrand}</span>
                    <h4 class="order-item-name">${item.productName}</h4>
                    <p class="order-item-price">${formatPrice(item.price)} x ${item.quantity}</p>
                </div>
                <div class="order-item-total">
                    ${formatPrice(item.price * item.quantity)}
                </div>
            </div>
        `).join('');
        
        const modalHTML = `
            <div class="order-detail-modal-overlay" id="order-detail-modal">
                <div class="order-detail-modal-content">
                    <button class="order-detail-modal-close" id="close-order-detail">&times;</button>
                    <h2>Chi tiết đơn hàng #${order.orderId}</h2>
                    <div class="order-detail-info">
                        <p><strong>Ngày đặt:</strong> ${formatDate(order.orderDate)}</p>
                        <p><strong>Trạng thái:</strong> <span class="profile-status-badge ${statusInfo.class}">${statusInfo.text}</span></p>
                    </div>
                    <div class="order-detail-items">
                        ${itemsHTML}
                    </div>
                    <div class="order-detail-summary">
                        <div class="order-summary-row">
                            <span>Tạm tính:</span>
                            <span>${formatPrice(order.totalAmount)}</span>
                        </div>
                        <div class="order-summary-row">
                            <span>Phí vận chuyển:</span>
                            <span>Miễn phí</span>
                        </div>
                        <div class="order-summary-row total">
                            <span>Tổng cộng:</span>
                            <span>${formatPrice(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('order-detail-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add close event
        const modal = document.getElementById('order-detail-modal');
        const closeBtn = document.getElementById('close-order-detail');
        
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Display favorite products
    function displayFavoriteProducts() {
        const currentUserAccount = localStorage.getItem(CURRENT_USER_KEY);
        if (!currentUserAccount) return;
        
        const favoriteTab = document.getElementById('SanPhamYeuThich');
        if (!favoriteTab) return;
        
        // Get favorites from dedicated localStorage key
        const favorites = getUserFavorites(currentUserAccount);
        
        if (favorites.length === 0) {
            favoriteTab.innerHTML = `
                <h2 class="profile-tab-title">Sản phẩm Yêu thích</h2>
                <p class="profile-empty-message">Bạn chưa có sản phẩm yêu thích nào.</p>
            `;
            return;
        }
        
        // Get all products and filter favorites
        const allProducts = [];
        if (typeof productsData !== 'undefined') {
            for (const brand in productsData) {
                allProducts.push(...productsData[brand]);
            }
        }
        
        const favoriteProducts = allProducts.filter(p => favorites.includes(p.id));
        
        if (favoriteProducts.length === 0) {
            favoriteTab.innerHTML = `
                <h2 class="profile-tab-title">Sản phẩm Yêu thích</h2>
                <p class="profile-empty-message">Bạn chưa có sản phẩm yêu thích nào.</p>
            `;
            return;
        }
        
        // Render favorite products
        const productsHTML = favoriteProducts.map(product => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            return `
                <div class="product-card" data-id="${product.id}" data-click="view-detail">
                    <div class="product-image-wrapper">
                        <img src="${product.image}" alt="${product.name}">
                        ${discount > 0 ? `<span class="product-discount">-${discount}%</span>` : ''}
                        <button class="favorite-btn active" data-id="${product.id}" title="Xóa khỏi yêu thích">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <span class="product-brand">${product.brand}</span>
                    <h3 class="product-name">${product.name} (${product.weight})</h3>
                    <div class="product-price-wrapper">
                        <p class="product-price">${formatPrice(product.price)}</p>
                        ${product.originalPrice > product.price ? 
                            `<p class="product-original-price">${formatPrice(product.originalPrice)}</p>` 
                            : ''}
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
                    </button>
                </div>
            `;
        }).join('');
        
        favoriteTab.innerHTML = `
            <h2 class="profile-tab-title">Sản phẩm Yêu thích (${favoriteProducts.length})</h2>
            <div class="product-grid">
                ${productsHTML}
            </div>
        `;
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
        
        // Load data based on tab
        if (tabId === 'SanPhamYeuThich') {
            displayFavoriteProducts();
        } else if (tabId === 'LichSuDonHang') {
            displayOrderHistory();
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
                // Cập nhật thông tin người dùng mỗi khi vào profile
                displayUserInfo();
                
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
    
    // Listen to favorites update event
    window.addEventListener('favoritesUpdated', () => {
        const hash = window.location.hash;
        if (hash === '#profile/SanPhamYeuThich') {
            displayFavoriteProducts();
        }
    });
    
    // Initial load
    if (checkProfileAccess()) {
        displayUserInfo();
    }
    handleHashChange();
});
