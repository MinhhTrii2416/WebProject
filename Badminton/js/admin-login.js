// Admin Login JavaScript

// Danh sách tài khoản admin được phép truy cập
const ADMIN_ACCOUNTS = [
    {
        email: 'admin@probadminton.vn',
        password: 'admin123',
        name: 'Admin',
        role: 'admin'
    },
    {
        email: 'superadmin@probadminton.vn',
        password: 'super123',
        name: 'Super Admin',
        role: 'admin'
    },
    {
        email: 'manager@probadminton.vn',
        password: 'manager123',
        name: 'Manager',
        role: 'admin'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminEmailInput = document.getElementById('admin-email');
    const adminPasswordInput = document.getElementById('admin-password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const errorMsg = document.getElementById('admin-error-msg');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = adminPasswordInput.type === 'password' ? 'text' : 'password';
        adminPasswordInput.type = type;
        
        const icon = togglePasswordBtn.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });

    // Handle form submission
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = adminEmailInput.value.trim();
        const password = adminPasswordInput.value;

        // Clear previous error
        errorMsg.classList.add('hidden');

        // Validate inputs
        if (!email || !password) {
            showError('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Tìm kiếm admin trong mảng ADMIN_ACCOUNTS
        const adminUser = ADMIN_ACCOUNTS.find(admin => 
            admin.email === email && 
            admin.password === password
        );

        if (adminUser) {
            // Successful login
            
            // Lưu thông tin admin vào sessionStorage (chỉ trong phiên làm việc)
            sessionStorage.setItem('currentAdmin', JSON.stringify({
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            }));
            
            // Show success toast
            showToast('Đăng nhập thành công! Đang chuyển hướng...', 'success');
            
            // Redirect to admin page after short delay
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
            
        } else {
            // Failed login
            showError('Email hoặc mật khẩu không chính xác hoặc bạn không có quyền truy cập!');
            
            // Shake the form
            adminLoginForm.classList.add('shake');
            setTimeout(() => {
                adminLoginForm.classList.remove('shake');
            }, 500);
        }
    });

    // Show error message
    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
    }

    // Show toast notification
    function showToast(message, type = 'info') {
        const toast = document.getElementById('admin-toast');
        toast.textContent = message;
        toast.className = `admin-toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Add shake animation to form
    const style = document.createElement('style');
    style.textContent = `
        .shake {
            animation: shake 0.5s ease !important;
        }
    `;
    document.head.appendChild(style);

    // Focus on email input
    adminEmailInput.focus();

    // Enter key support for better UX
    adminPasswordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adminLoginForm.dispatchEvent(new Event('submit'));
        }
    });
});
