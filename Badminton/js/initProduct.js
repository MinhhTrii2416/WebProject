// initProduct.js - Khởi tạo dữ liệu sản phẩm vào localStorage
// File này chỉ cần chạy 1 lần để chuyển dữ liệu từ product.js sang localStorage

// Import dữ liệu từ product.js (nếu chưa có trong localStorage)
function initializeProducts() {
    const PRODUCTS_KEY = 'dataProducts';
    
    // Kiểm tra xem dữ liệu đã tồn tại chưa
    const existingData = localStorage.getItem(PRODUCTS_KEY);
    
    if (existingData) {
        console.log('Dữ liệu sản phẩm đã tồn tại trong localStorage');
        return;
    }
    
    // Lấy dữ liệu từ product.js
    if (typeof productsData !== 'undefined') {
        // Lưu vào localStorage
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(productsData));
        console.log('Đã khởi tạo dữ liệu sản phẩm vào localStorage với key:', PRODUCTS_KEY);
        console.log('Tổng số brands:', Object.keys(productsData).length);
        
        // Đếm tổng số sản phẩm
        let totalProducts = 0;
        for (const brand in productsData) {
            totalProducts += productsData[brand].length;
        }
        console.log('Tổng số sản phẩm:', totalProducts);
    } else {
        console.error('Không tìm thấy dữ liệu productsData từ product.js');
    }
}

// Hàm để reset lại dữ liệu (nếu cần)
function resetProducts() {
    const PRODUCTS_KEY = 'dataProducts';
    
    if (typeof productsData !== 'undefined') {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(productsData));
        console.log('Đã reset dữ liệu sản phẩm trong localStorage');
        return true;
    }
    return false;
}

// Hàm để xóa dữ liệu sản phẩm
function clearProducts() {
    const PRODUCTS_KEY = 'dataProducts';
    localStorage.removeItem(PRODUCTS_KEY);
    console.log('Đã xóa dữ liệu sản phẩm khỏi localStorage');
}

// Tự động chạy khi load trang
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProducts);
} else {
    initializeProducts();
}
