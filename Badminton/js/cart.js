// Cart Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const CURRENT_USER_KEY = 'CurrentUser';
    const CART_KEY_PREFIX = 'Cart_';
    
    const cartEmpty = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalItemsEl = document.getElementById('total-items');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const toastEl = document.getElementById('toast');

    // Check if user is logged in
    function checkLogin() {
        const currentUser = localStorage.getItem(CURRENT_USER_KEY);
        if (!currentUser) {
            // Redirect to home if not logged in
            if (toastEl) {
                toastEl.textContent = 'Vui lòng đăng nhập để xem giỏ hàng!';
                toastEl.className = 'toast error show';
                setTimeout(() => {
                    toastEl.classList.remove('show');
                    window.location.href = 'index.html';
                }, 2000);
            }
            return null;
        }
        try {
            return JSON.parse(currentUser);
        } catch (e) {
            return null;
        }
    }

    // Get cart from localStorage (cấu trúc mới: lưu chung tất cả user)
    function getCart(user) {
        const GLOBAL_CART_KEY = 'AllCarts';
        const userEmail = user.email || user;
        
        // Lấy tất cả giỏ hàng
        const allCartsStr = localStorage.getItem(GLOBAL_CART_KEY);
        if (!allCartsStr) return [];
        
        try {
            const allCarts = JSON.parse(allCartsStr);
            // Tìm giỏ hàng của user này
            const userCart = allCarts.find(cart => cart.email === userEmail);
            return userCart ? userCart.items : [];
        } catch (e) {
            console.error('Error parsing carts:', e);
            return [];
        }
    }

    // Save cart to localStorage (cấu trúc mới)
    function saveCart(user, items) {
        const GLOBAL_CART_KEY = 'AllCarts';
        const userEmail = user.email || user;
        
        // Lấy tất cả giỏ hàng
        let allCarts = [];
        const allCartsStr = localStorage.getItem(GLOBAL_CART_KEY);
        if (allCartsStr) {
            try {
                allCarts = JSON.parse(allCartsStr);
            } catch (e) {
                console.error('Error parsing carts:', e);
                allCarts = [];
            }
        }
        
        // Tìm giỏ hàng của user
        const cartIndex = allCarts.findIndex(cart => cart.email === userEmail);
        
        if (cartIndex >= 0) {
            // Cập nhật giỏ hàng hiện tại
            allCarts[cartIndex].items = items;
        } else {
            // Thêm giỏ hàng mới
            allCarts.push({
                email: userEmail,
                items: items
            });
        }
        
        // Lưu lại
        localStorage.setItem(GLOBAL_CART_KEY, JSON.stringify(allCarts));
        updateCartCount();
    }

    // Update cart count in header
    function updateCartCount() {
        const currentUserData = localStorage.getItem(CURRENT_USER_KEY);
        if (!currentUserData) {
            const cartCountEl = document.getElementById('cart-count');
            if (cartCountEl) cartCountEl.textContent = '0';
            return;
        }

        try {
            const currentUser = JSON.parse(currentUserData);
            const cart = getCart(currentUser);
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const cartCountEl = document.getElementById('cart-count');
            if (cartCountEl) {
                cartCountEl.textContent = totalItems;
                cartCountEl.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        } catch (e) {
            console.error('Error updating cart count:', e);
        }
    }

    // Format price
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    }

    // Get product by ID
    function getProductById(productId) {
        const PRODUCTS_KEY = 'dataProducts';
        const productsDataStr = localStorage.getItem(PRODUCTS_KEY);
        
        if (!productsDataStr) {
            // Fallback to global productsData if localStorage is empty
            if (typeof productsData !== 'undefined') {
                for (const brand in productsData) {
                    const product = productsData[brand].find(p => p.id === productId);
                    if (product) return product;
                }
            }
            return null;
        }
        
        const productsDataLocal = JSON.parse(productsDataStr);
        for (const brand in productsDataLocal) {
            const product = productsDataLocal[brand].find(p => p.id === productId);
            if (product) return product;
        }
        return null;
    }

    // Render cart items
    function renderCart() {
        const currentUser = checkLogin();
        if (!currentUser) return;

        const cart = getCart(currentUser);

        if (cart.length === 0) {
            cartEmpty.classList.remove('hidden');
            cartContent.classList.add('hidden');
            return;
        }

        cartEmpty.classList.add('hidden');
        cartContent.classList.remove('hidden');

        // Render each cart item
        cartItemsContainer.innerHTML = cart.map(item => {
            const product = getProductById(item.productId);
            if (!product) return '';

            // Lấy hình ảnh đầu tiên (hỗ trợ cả images array và image string)
            const productImage = Array.isArray(product.images) ? product.images[0] : (product.image || product.images);

            return `
                <div class="cart-item" data-product-id="${item.productId}">
                    <img src="${productImage}" alt="${product.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <span class="cart-item-brand">${product.brand}</span>
                        <h3 class="cart-item-name">${product.name}</h3>
                        <p class="cart-item-weight">Trọng lượng: ${product.weight} (${product.weightGrams}g)</p>
                        <p class="cart-item-price">${formatPrice(product.price)}</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn decrease" data-product-id="${item.productId}" ${item.quantity <= 1 ? 'disabled' : ''}>
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn increase" data-product-id="${item.productId}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-item-btn" data-product-id="${item.productId}">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Calculate totals
        updateCartSummary(cart);
    }

    // Update cart summary
    function updateCartSummary(cart) {
        let totalItems = 0;
        let subtotal = 0;

        cart.forEach(item => {
            const product = getProductById(item.productId);
            if (product) {
                totalItems += item.quantity;
                subtotal += product.price * item.quantity;
            }
        });

        totalItemsEl.textContent = totalItems;
        subtotalEl.textContent = formatPrice(subtotal);
        totalEl.textContent = formatPrice(subtotal);
    }

    // Handle quantity change
    document.addEventListener('click', (e) => {
        const currentUser = checkLogin();
        if (!currentUser) return;

        // Decrease quantity
        if (e.target.closest('.quantity-btn.decrease')) {
            const btn = e.target.closest('.quantity-btn.decrease');
            const productId = btn.dataset.productId;
            const cart = getCart(currentUser);
            const item = cart.find(i => i.productId === productId);
            
            if (item && item.quantity > 1) {
                item.quantity--;
                saveCart(currentUser, cart);
                renderCart();

                if (toastEl) {
                    toastEl.textContent = 'Đã cập nhật số lượng';
                    toastEl.className = 'toast info show';
                    setTimeout(() => toastEl.classList.remove('show'), 1500);
                }
            }
        }

        // Increase quantity
        if (e.target.closest('.quantity-btn.increase')) {
            const btn = e.target.closest('.quantity-btn.increase');
            const productId = btn.dataset.productId;
            const cart = getCart(currentUser);
            const item = cart.find(i => i.productId === productId);
            
            if (item) {
                item.quantity++;
                saveCart(currentUser, cart);
                renderCart();

                if (toastEl) {
                    toastEl.textContent = 'Đã cập nhật số lượng';
                    toastEl.className = 'toast info show';
                    setTimeout(() => toastEl.classList.remove('show'), 1500);
                }
            }
        }

        // Remove item
        if (e.target.closest('.remove-item-btn')) {
            const btn = e.target.closest('.remove-item-btn');
            const productId = btn.dataset.productId;
            
            if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                const cart = getCart(currentUser);
                const newCart = cart.filter(i => i.productId !== productId);
                saveCart(currentUser, newCart);
                renderCart();

                if (toastEl) {
                    toastEl.textContent = 'Đã xóa sản phẩm khỏi giỏ hàng';
                    toastEl.className = 'toast success show';
                    setTimeout(() => toastEl.classList.remove('show'), 2000);
                }
            }
        }
    });

    // Save order to global orders list
    function saveOrderHistory(userEmail, userName, orderData) {
        const GLOBAL_ORDERS_KEY = 'AllOrders';
        
        // Get existing orders
        let allOrders = localStorage.getItem(GLOBAL_ORDERS_KEY);
        allOrders = allOrders ? JSON.parse(allOrders) : [];
        
        // Add user info to order
        const orderWithUser = {
            ...orderData,
            userEmail: userEmail,
            userName: userName
        };
        
        // Add to beginning
        allOrders.unshift(orderWithUser);
        
        // Save back to localStorage
        localStorage.setItem(GLOBAL_ORDERS_KEY, JSON.stringify(allOrders));
    }

    // Generate order ID with format DH_1, DH_2, ...
    function generateOrderId() {
        const GLOBAL_ORDERS_KEY = 'AllOrders';
        let allOrders = localStorage.getItem(GLOBAL_ORDERS_KEY);
        allOrders = allOrders ? JSON.parse(allOrders) : [];
        
        // Get next order number
        const nextNumber = allOrders.length + 1;
        return `DH_${nextNumber}`;
    }

    // Handle checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const currentUser = checkLogin();
            if (!currentUser) return;

            const cart = getCart(currentUser);
            if (cart.length === 0) {
                if (toastEl) {
                    toastEl.textContent = 'Giỏ hàng trống!';
                    toastEl.className = 'toast error show';
                    setTimeout(() => toastEl.classList.remove('show'), 2000);
                }
                return;
            }

            // Calculate total and prepare order items
            let total = 0;
            const orderItems = [];
            
            cart.forEach(item => {
                const product = getProductById(item.productId);
                if (product) {
                    // Lấy hình ảnh đầu tiên (hỗ trợ cả images array và image string)
                    const productImage = Array.isArray(product.images) ? product.images[0] : (product.image || product.images);
                    
                    total += product.price * item.quantity;
                    orderItems.push({
                        productId: item.productId,
                        productName: product.name,
                        productBrand: product.brand,
                        productImage: productImage,
                        price: product.price,
                        quantity: item.quantity
                    });
                }
            });

            // Show confirmation
            if (confirm(`Xác nhận thanh toán đơn hàng?\n\nTổng tiền: ${formatPrice(total)}`)) {
                // Create order data
                const orderData = {
                    orderId: generateOrderId(),
                    orderDate: new Date().toISOString().split('T')[0], // Chỉ lưu ngày YYYY-MM-DD
                    items: orderItems,
                    totalAmount: total,
                    status: 0, // 0 = Chưa xử lý, 1 = Đã xử lý
                    statusText: 'Chưa xử lý'
                };
                
                // Save order to history with user email and name
                saveOrderHistory(currentUser.email, currentUser.account, orderData);
                
                // Clear cart
                saveCart(currentUser, []);
                
                if (toastEl) {
                    toastEl.textContent = 'Đặt hàng thành công! Cảm ơn bạn đã mua hàng.';
                    toastEl.className = 'toast success show';
                    setTimeout(() => {
                        toastEl.classList.remove('show');
                        window.location.href = 'index.html';
                    }, 2500);
                }
            }
        });
    }

    // Initial render
    renderCart();
    updateCartCount();
});
