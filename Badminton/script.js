
const dropdown = document.getElementsByClassName("dropdown");
dropdown[0].addEventListener("mouseover", () => {
    document.getElementById("dropdown-menu").style.display = "block";
});
dropdown[0].addEventListener("mouseout", () => {
    document.getElementById("dropdown-menu").style.display = "none";
});
const dropdown_user = document.getElementById("dropdown-user");
dropdown[1].addEventListener("click", () => {
    if(dropdown_user.style.display === "none") {
        dropdown_user.style.display = "block";
    }else{
        dropdown_user.style.display = "none";
    }
});

// Đợi cho tất cả nội dung HTML được tải xong
document.addEventListener("DOMContentLoaded", () => {

    // --- Khai báo các biến ---
    const USERS_KEY = 'proBadmintonUsers';
    const CURRENT_USER_KEY = 'proBadmintonCurrentUser';

    // Lấy các phần tử modal
    const authModal = document.getElementById("auth-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const loginRegisterBtn = document.getElementById("login-register-btn");

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
            // Đã đăng nhập
            console.log("Da dang nhap");
            loginRegisterBtn.classList.add("hidden");
            userInfo.classList.remove("hidden");
            const username = currentUser.account;
            welcomeMsg.textContent = `Chào, ${username}`;
        } else {
            // Chưa đăng nhập
            console.log("chua dang nhap");
            loginRegisterBtn.classList.remove("hidden");
            userInfo.classList.add("hidden");
            welcomeMsg.textContent = "";
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

        // Mã hóa mật khẩu (đơn giản, không an toàn cho sản phẩm thật)
        const hashedPassword = "hashed_" + password; 
        
        users.push({ account: account, email: email, password: hashedPassword });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        registerForm.reset();
        showLoginView();
    }

    // Xử lý Đăng nhập
    function handleLogin(event) {
        event.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const hashedPassword = "hashed_" + password; // giải mã hóa

        const users = getUsers();
        const user = users.find(user => user.account && user.email === email && user.password === hashedPassword);

        if (user) {
            // Đăng nhập thành công
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            hideModal();
            checkLoginStatus();
        } else {
            // Sai thông tin
            showError(loginError, "Email hoặc Mật khẩu không đúng.");
        }
    }

    // Xử lý Đăng xuất
    function handleLogout() {
        localStorage.removeItem(CURRENT_USER_KEY);
        checkLoginStatus();
    }

    // Xử lý khi nhấn vào Giỏ hàng
    function handleCartClick(event) {
        const currentUser = getCurrentUser();
        if (!currentUser.account) {
            event.preventDefault(); // Chặn chuyển trang
            alert("Vui lòng đăng nhập để xem giỏ hàng!");
            showModal(); // Hiển thị modal đăng nhập
        }
        // Nếu đã đăng nhập, trình duyệt sẽ tự động đi tiếp
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

    checkLoginStatus();

});
