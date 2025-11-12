
// Desktop hover for dropdown is handled via CSS.

// Đợi cho tất cả nội dung HTML được tải xong
document.addEventListener("DOMContentLoaded", () => {

    // --- Khai báo các biến ---
    const USERS_KEY = 'Users'; 
    const CURRENT_USER_KEY = 'CurrentUser';

    // Lấy các phần tử modal
    const authModal = document.getElementById("auth-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const loginRegisterBtn = document.getElementById("login-register-btn");

    // Kiểm tra xem có phải trang admin không (không có modal login)
    if (!authModal || !closeModalBtn || !loginRegisterBtn) {
        // Đang ở trang admin, không cần chạy code login/register
        return;
    }

    // Lấy các form
    const loginFormContainer = document.getElementById("login-form-container");
    const registerFormContainer = document.getElementById("register-form-container");
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    // Lấy các link chuyển đổi form
    const showRegisterLink = document.getElementById("show-register");
    const showLoginLink = document.getElementById("show-login");

    // Lấy các thông báo lỗi
    const loginError = document.getElementById("login-error");
    const registerError = document.getElementById("register-error");

    // Lấy các phần tử liên quan đến trạng thái đăng nhập
    const userContainer = document.getElementById("user-container");
    const userInfo = document.getElementById("user-info");
    const welcomeMsg = document.getElementById("welcome-msg");
    const logoutBtn = document.getElementById("logout-btn");

    // Lấy link giỏ hàng
    const cartLink = document.getElementById("cart-link");

    // Mobile menu elements
    const menuToggleBtn = document.getElementById("menu-toggle");
    const mainNav = document.querySelector(".main-nav");
    const navOverlay = document.getElementById("nav-overlay");

    // Mobile search elements
    const mobileSearchBtn = document.getElementById("mobile-search-btn");
    const mobileSearchPanel = document.getElementById("mobile-search-panel");
    const mobileSearchClose = document.getElementById("mobile-search-close");
    const mobileSearchInput = document.getElementById("mobile-search-input");

    // Menu user elements in drawer
    const menuUserName = document.getElementById("menu-user-name");
    const menuUserToggle = document.getElementById("menu-user-toggle");
    const menuUserDropdown = document.getElementById("menu-user-dropdown");
    const menuUserLogin = document.getElementById("menu-user-login");
    const menuUserLogout = document.getElementById("menu-user-logout");

    // Nav 'Vợt' dropdown toggle on mobile (smooth slide)
    const navCategoryToggle = document.querySelector('.main-nav .dropdown > a');

    // Toast element
    const toastEl = document.getElementById('toast');

    function showToast(message, type = 'info', duration = 2500) {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.className = `toast ${type} show`;
        setTimeout(() => {
            toastEl.classList.remove('show');
        }, duration);
    }

    // --- Hàm trợ giúp ---

    // Hàm lấy danh sách người dùng từ localStorage
    function getUsers() {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    // Hàm lấy người dùng hiện tại
    function getCurrentUser() {
        const curUser = localStorage.getItem(CURRENT_USER_KEY);
        return curUser ? JSON.parse(curUser) : [];
    }

    // Hàm hiển thị thông báo lỗi
    function showError(element, message) {
        element.textContent = message;
        element.classList.remove("hidden");
    }

    // Hàm ẩn thông báo lỗi
    function hideError(element) {
        element.textContent = "";
        element.classList.add("hidden");
    }

    // Hàm ẩn/hiện modal
    function showModal() {
        authModal.classList.remove("hidden");
    }
    function hideModal() {
        authModal.classList.add("hidden");
        // Reset form khi đóng
        hideError(loginError);
        hideError(registerError);
        loginForm.reset();
        registerForm.reset();
        showLoginView(); // Luôn quay về form đăng nhập
    }

    // Hàm chuyển đổi giữa 2 form
    function showRegisterView() {
        loginFormContainer.classList.add("hidden");
        registerFormContainer.classList.remove("hidden");
    }
    function showLoginView() {
        registerFormContainer.classList.add("hidden");
        loginFormContainer.classList.remove("hidden");
    }

    // --- Hàm cập nhật UI dựa trên trạng thái đăng nhập ---
    function checkLoginStatus() {
        const currentUser = getCurrentUser();
        if (currentUser.account) {
            // Đã đăng nhập - Thêm class vào body
            document.body.classList.add("user-logged-in");
            const username = currentUser.account;
            welcomeMsg.textContent = `Chào, ${username}`;
            
            // Cập nhật tên user trong menu trái (mobile)
            if (menuUserName) menuUserName.textContent = username;
        } else {
            // Chưa đăng nhập - Xóa class khỏi body
            document.body.classList.remove("user-logged-in");
            welcomeMsg.textContent = "";
            
            // Trạng thái khách trong menu trái
            if (menuUserName) menuUserName.textContent = "Guest";
        }
    }

    // --- Hàm xử lý Logic ---

    // Xử lý Đăng ký
    function handleRegister(event) {
        event.preventDefault();
        const account = document.getElementById("register-account").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("register-confirm-password").value;

        if (password !== confirmPassword) {
            showError(registerError, "Mật khẩu không khớp!");
            return;
        }

        const users = getUsers();
        const userExists = users.find(user => user.email === email);

        if (userExists) {
            showError(registerError, "Email này đã được sử dụng!");
            return;
        }

        const hashedPassword = 'hashed_' + password;
        
        const newUser = {
            account: account,
            email: email,
            password: hashedPassword,
            joinDate: new Date().toISOString().split('T')[0],
            isLocked: false,
        };
        
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        showToast("Đăng ký thành công! Vui lòng đăng nhập.", 'success');
        registerForm.reset();
        showLoginView();
    }

    // Xử lý Đăng nhập
    function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;


        // Kiểm tra tài khoản người dùng thông thường
        const hashedPassword = "hashed_" + password;
        const users = getUsers();
        const user = users.find(user => user.account && user.email.toLowerCase() === email.toLowerCase() && user.password === hashedPassword);

        if (user) {
            // Kiểm tra tài khoản có bị khóa không
            if (user.isLocked === true) {
                showError(loginError, "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.");
                return;
            }
            
            // Đăng nhập thành công
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            hideModal();
            checkLoginStatus();
            showToast("Đăng nhập thành công.", 'success');
        } else {
            // Sai thông tin
            showError(loginError, "Email hoặc Mật khẩu không đúng.");
        }
    }

    // Xử lý Đăng xuất
    function handleLogout() {
        localStorage.removeItem(CURRENT_USER_KEY);
        
        // Hiển thị toast trước khi reload
        showToast('Đăng xuất thành công!', 'success');
        
        // Reload trang về trang chủ sau khi đăng xuất (delay để hiện toast)
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    }

    // Xử lý khi nhấn vào Giỏ hàng
    function handleCartClick(event) {
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser.account) {
            event.preventDefault(); // Chặn chuyển trang
            showToast("Vui lòng đăng nhập để xem giỏ hàng!", 'info');
            showModal(); // Hiển thị modal đăng nhập
            return;
        }
        // Nếu đã đăng nhập, cho phép chuyển trang
        window.location.href = 'cart.html';
    }

    // Mở/Đóng Modal
    loginRegisterBtn.addEventListener("click", showModal);
    closeModalBtn.addEventListener("click", hideModal);
    
    // Đóng modal khi nhấn ra ngoài
    authModal.addEventListener("click", (event) => {
        if (event.target === authModal) {
            hideModal();
        }
    });

    // Chuyển đổi form
    showRegisterLink.addEventListener("click", (e) => { e.preventDefault(); showRegisterView(); });
    showLoginLink.addEventListener("click", (e) => { e.preventDefault(); showLoginView(); });

    // Submit form
    registerForm.addEventListener("submit", handleRegister);
    loginForm.addEventListener("submit", handleLogin);

    // Đăng xuất
    logoutBtn.addEventListener("click", handleLogout);

    // Giỏ hàng
    cartLink.addEventListener("click", handleCartClick);

    // --- Mobile menu toggle ---
    function closeMobileMenu() {
        if (mainNav) mainNav.classList.remove("open");
        if (navOverlay) navOverlay.classList.remove("show");
        document.body.style.overflow = "";
    }

    function toggleMobileMenu() {
        if (!mainNav) return;
        const willOpen = !mainNav.classList.contains("open");
        mainNav.classList.toggle("open", willOpen);
        if (navOverlay) navOverlay.classList.toggle("show", willOpen);
        document.body.style.overflow = willOpen ? "hidden" : "";
    }

    if (menuToggleBtn) menuToggleBtn.addEventListener("click", toggleMobileMenu);
    if (navOverlay) navOverlay.addEventListener("click", closeMobileMenu);

    // --- Mobile search toggle ---
    function openMobileSearch() {
        if (!mobileSearchPanel) return;
        mobileSearchPanel.classList.add("show");
        mobileSearchPanel.setAttribute("aria-hidden", "false");
        setTimeout(() => mobileSearchInput && mobileSearchInput.focus(), 0);
    }
    function closeMobileSearch() {
        if (!mobileSearchPanel) return;
        mobileSearchPanel.classList.remove("show");
        mobileSearchPanel.setAttribute("aria-hidden", "true");
    }
    if (mobileSearchBtn) mobileSearchBtn.addEventListener("click", () => {
        closeMobileMenu();
        openMobileSearch();
    });
    if (mobileSearchClose) mobileSearchClose.addEventListener("click", closeMobileSearch);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeMobileSearch();
            closeMobileMenu();
        }
    });

    // --- Drawer user block interactions ---
    if (menuUserToggle) menuUserToggle.addEventListener("click", () => {
        const willOpen = !menuUserDropdown.classList.contains("show");
        menuUserDropdown.classList.toggle("show", willOpen);
        menuUserToggle.setAttribute("aria-expanded", String(willOpen));
    });
    if (menuUserLogin) menuUserLogin.addEventListener("click", () => {
        closeMobileMenu();
        showModal();
    });
    if (menuUserLogout) menuUserLogout.addEventListener("click", () => {
        handleLogout();
        closeMobileMenu();
    });

    checkLoginStatus();

    // Toggle the 'Vợt' submenu when clicked (primarily for mobile)
    if (navCategoryToggle) {
        navCategoryToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parentLi = navCategoryToggle.closest('.dropdown');
            if (!parentLi) return;
            parentLi.classList.toggle('open');
        });
    }

    // Desktop user dropdown (logged-in): click to toggle small dropdown box
    const desktopUserInfo = document.getElementById('user-info');
    const desktopUserDropdown = document.getElementById('dropdown-user');
    if (desktopUserInfo && desktopUserDropdown) {
        desktopUserInfo.addEventListener('click', (e) => {
            e.stopPropagation();
            const isShown = desktopUserDropdown.style.display === 'block';
            desktopUserDropdown.style.display = isShown ? 'none' : 'block';
        });
        document.addEventListener('click', () => {
            desktopUserDropdown.style.display = 'none';
        });
    }

    // Sticky header effect with scroll
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

});
