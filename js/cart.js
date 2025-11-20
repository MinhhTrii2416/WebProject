// Cart Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const CURRENT_USER_KEY = 'CurrentUser';
    
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
            if (cartEmpty) cartEmpty.classList.remove('hidden');
            if (cartContent) cartContent.classList.add('hidden');
            return;
        }

        if (cartEmpty) cartEmpty.classList.add('hidden');
        if (cartContent) cartContent.classList.remove('hidden');

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

    // Districts data for cities
    const districtsData = {
        'Hà Nội': ['Ba Đình', 'Hoàn Kiếm'],
        'Hồ Chí Minh': ['Quận 1', 'Quận 3']
    };

    const wardsData = {
        'Ba Đình': ['Phúc Xá', 'Trúc Bạch', 'Vĩnh Phúc', 'Cống Vị', 'Liễu Giai', 'Nguyễn Trung Trực', 'Quán Thánh', 'Ngọc Hà', 'Điện Biên', 'Đội Cấn', 'Ngọc Khánh', 'Kim Mã', 'Giảng Võ', 'Thành Công'],
        'Hoàn Kiếm': ['Phúc Tân', 'Đồng Xuân', 'Hàng Mã', 'Hàng Buồm', 'Hàng Đào', 'Hàng Bồ', 'Cửa Đông', 'Lý Thái Tổ', 'Hàng Bạc', 'Hàng Gai', 'Chương Dương', 'Hàng Trống', 'Cửa Nam', 'Hàng Bông', 'Tràng Tiền', 'Trần Hưng Đạo', 'Phan Chu Trinh'],
        'Quận 1': ['Tân Định', 'Đa Kao', 'Bến Nghé', 'Bến Thành', 'Nguyễn Thái Bình', 'Phạm Ngũ Lão', 'Cầu Ông Lãnh', 'Cô Giang', 'Nguyễn Cư Trinh', 'Cầu Kho'],
        'Quận 3': ['Võ Thị Sáu', 'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14']
    };

    // Handle city change
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    const wardSelect = document.getElementById('ward');

    if (citySelect && districtSelect && wardSelect) {
        citySelect.addEventListener('change', () => {
            const city = citySelect.value;
            districtSelect.innerHTML = '<option value="">Chọn Quận/Huyện</option>';
            wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>';
            
            if (city && districtsData[city]) {
                districtsData[city].forEach(district => {
                    const option = document.createElement('option');
                    option.value = district;
                    option.textContent = district;
                    districtSelect.appendChild(option);
                });
            }
        });

        districtSelect.addEventListener('change', () => {
            const district = districtSelect.value;
            wardSelect.innerHTML = '<option value="">Chọn Phường/Xã</option>';
            
            if (district && wardsData[district]) {
                wardsData[district].forEach(ward => {
                    const option = document.createElement('option');
                    option.value = ward;
                    option.textContent = ward;
                    wardSelect.appendChild(option);
                });
            }
        });
    }

    // Validate shipping form
    function validateShippingForm() {
        const name = document.getElementById('receiver-name').value.trim();
        const phone = document.getElementById('receiver-phone').value.trim();
        const city = document.getElementById('city').value;
        const district = document.getElementById('district').value;
        const ward = document.getElementById('ward').value;
        const address = document.getElementById('address').value.trim();

        if (!name || !phone || !city || !district || !ward || !address) {
            if (toastEl) {
                toastEl.textContent = 'Vui lòng điền đầy đủ thông tin giao hàng!';
                toastEl.className = 'toast error show';
                setTimeout(() => toastEl.classList.remove('show'), 2500);
            }
            return false;
        }

        // Validate phone number
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(phone)) {
            if (toastEl) {
                toastEl.textContent = 'Số điện thoại không hợp lệ! (10-11 chữ số)';
                toastEl.className = 'toast error show';
                setTimeout(() => toastEl.classList.remove('show'), 2500);
            }
            return false;
        }

        return true;
    }

    // Get shipping info
    function getShippingInfo() {
        return {
            name: document.getElementById('receiver-name').value.trim(),
            phone: document.getElementById('receiver-phone').value.trim(),
            city: document.getElementById('city').value,
            district: document.getElementById('district').value,
            ward: document.getElementById('ward').value,
            address: document.getElementById('address').value.trim(),
            note: document.getElementById('note').value.trim()
        };
    }

    // Get payment method
    function getPaymentMethod() {
        const selected = document.querySelector('input[name="payment"]:checked');
        return selected ? selected.value : 'cod';
    }

    // Get payment method text
    function getPaymentMethodText(method) {
        const texts = {
            'cod': 'Tiền mặt khi nhận hàng (COD)',
            'bank': 'Chuyển khoản ngân hàng',
            'online': 'Thanh toán trực tuyến'
        };
        return texts[method] || texts['cod'];
    }

    // Show order review modal
    function showOrderReview(cart, total) {
        
        const modal = document.getElementById('order-review-modal');
        const shippingInfo = getShippingInfo();
        const paymentMethod = getPaymentMethod();

        // Set shipping info
        document.getElementById('review-name').textContent = shippingInfo.name;
        document.getElementById('review-phone').textContent = shippingInfo.phone;
        document.getElementById('review-address').textContent = 
            `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`;
        
        // Set note (hide if empty)
        const noteContainer = document.getElementById('review-note-container');
        if (shippingInfo.note) {
            document.getElementById('review-note').textContent = shippingInfo.note;
            noteContainer.classList.remove('hidden');
        } else {
            noteContainer.classList.add('hidden');
        }

        // Set payment method
        document.getElementById('review-payment').innerHTML = `<i class="fas ${
            paymentMethod === 'cod' ? 'fa-money-bill-wave' : 
            paymentMethod === 'bank' ? 'fa-university' : 'fa-credit-card'
        }"></i> ${getPaymentMethodText(paymentMethod)}`;

        // Set totals
        document.getElementById('review-subtotal').textContent = formatPrice(total);
        document.getElementById('review-total').textContent = formatPrice(total);

        // Show modal
        modal.classList.remove('hidden');
    }

    // Close review modal
    const closeReviewBtn = document.getElementById('close-review-modal');
    const cancelReviewBtn = document.getElementById('cancel-review-btn');
    
    if (closeReviewBtn) {
        closeReviewBtn.addEventListener('click', () => {
            document.getElementById('order-review-modal').classList.add('hidden');
        });
    }
    
    if (cancelReviewBtn) {
        cancelReviewBtn.addEventListener('click', () => {
            document.getElementById('order-review-modal').classList.add('hidden');
        });
    }

    // Handle checkout button
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

            // Validate shipping form
            if (!validateShippingForm()) return;

            // Calculate total
            let total = 0;
            cart.forEach(item => {
                const product = getProductById(item.productId);
                if (product) {
                    total += product.price * item.quantity;
                }
            });

            // Show review modal
            showOrderReview(cart, total);
        });
    }

    // Confirm order from review modal
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', () => {
            const currentUser = checkLogin();
            if (!currentUser) return;

            const cart = getCart(currentUser);
            const shippingInfo = getShippingInfo();
            const paymentMethod = getPaymentMethod();

            // Calculate total and prepare order items
            let total = 0;
            const orderItems = [];
            
            cart.forEach(item => {
                const product = getProductById(item.productId);
                if (product) {
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

            // Create order data
            const orderData = {
                orderId: generateOrderId(),
                orderDate: new Date().toISOString().split('T')[0],
                items: orderItems,
                totalAmount: total,
                status: 1, // 1 = Mới đặt
                statusText: 'Mới đặt',
                shippingInfo: {
                    name: shippingInfo.name,
                    phone: shippingInfo.phone,
                    address: `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.city}`,
                    note: shippingInfo.note
                },
                paymentMethod: paymentMethod,
                paymentMethodText: getPaymentMethodText(paymentMethod)
            };
            
            // Save order to history
            saveOrderHistory(currentUser.email, currentUser.account, orderData);
            
            // Clear cart
            saveCart(currentUser, []);
            
            // Close modal
            document.getElementById('order-review-modal').classList.add('hidden');
            
            if (toastEl) {
                toastEl.textContent = 'Đặt hàng thành công! Cảm ơn bạn đã mua hàng.';
                toastEl.className = 'toast success show';
                setTimeout(() => {
                    toastEl.classList.remove('show');
                    window.location.href = 'index.html';
                }, 2500);
            }
        });
    }

    // Initial render
    renderCart();
    updateCartCount();
});
