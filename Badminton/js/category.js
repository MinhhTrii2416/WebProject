// Category & Product Display Logic
document.addEventListener('DOMContentLoaded', () => {
    // Config
    const ITEMS_PER_PAGE = 8;
    let currentPage = 1;
    let currentBrand = null;
    let filteredProducts = [];
    let searchResults = []; // Lưu kết quả tìm kiếm từ header
    
    // Elements
    const featuredSection = document.getElementById('featured-products-section');
    const sectionTitle = document.querySelector('#featured-products-section .section-title');
    const featuredGrid = document.getElementById('featured-product-grid');
    const featuredPagination = document.getElementById('featured-pagination');
    
    // Filters
    const priceFilter = document.getElementById('home-price-filter');
    const weightFilter = document.getElementById('home-weight-filter');
    const categoryFilter = document.getElementById('home-category-filter');
    
    // Header search inputs
    const headerSearchInput = document.querySelector('.search-container .search-input');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    
    // Lấy tất cả sản phẩm từ localStorage
    function getAllProducts() {
        const allProducts = [];
        const LS_KEY_PRODUCT_DATA = 'dataProducts';
        
        // Lấy từ localStorage
        const rawData = localStorage.getItem(LS_KEY_PRODUCT_DATA);
        
        if (!rawData) {
            return allProducts;
        }
        
        try {
            const productsData = JSON.parse(rawData);
            
            // Duyệt qua tất cả các brand
            for (const brand in productsData) {
                if (Array.isArray(productsData[brand])) {
                    productsData[brand].forEach(product => {
                        // Thêm brand vào product nếu chưa có
                        allProducts.push({
                            ...product,
                            brand: product.brand || brand
                        });
                    });
                }
            }
        } catch (e) {
            console.error('Error parsing products from localStorage:', e);
        }
        
        return allProducts;
    }
    
    // Parse weight string to number (e.g., "3U" -> 88, "4U" -> 83, "5U" -> 78)
    function parseWeight(weightStr) {
        if (!weightStr) return 0;
        // Map weight U to grams
        const weightMap = {
            '2U': 93,
            '3U': 88,
            '4U': 83,
            '5U': 78,
            '6U': 73
        };
        return weightMap[weightStr] || 0;
    }
    
    // Format giá tiền
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    }
    
    // Get user favorites from localStorage
    function getUserFavorites(userId) {
        const favKey = `Favorites_${userId}`;
        const favorites = localStorage.getItem(favKey);
        return favorites ? JSON.parse(favorites) : [];
    }
    
    // Save user favorites to localStorage
    function saveUserFavorites(userId, favorites) {
        const favKey = `Favorites_${userId}`;
        localStorage.setItem(favKey, JSON.stringify(favorites));
    }
    
    // Check if product is in favorites
    function isProductFavorite(productId) {
        const CURRENT_USER_KEY = 'CurrentUser';
        const currentUser = localStorage.getItem(CURRENT_USER_KEY);
        if (!currentUser) return false;
        
        const favorites = getUserFavorites(currentUser);
        return favorites.includes(productId);
    }
    
    // Cart functions
    const CART_KEY_PREFIX = 'Cart_';
    
    function getCart(user) {
        const GLOBAL_CART_KEY = 'AllCarts';
        
        // Parse user nếu là string
        let userEmail;
        if (typeof user === 'string') {
            try {
                const userObj = JSON.parse(user);
                userEmail = userObj.email;
            } catch (e) {
                userEmail = user; // Nếu không parse được thì coi như là email
            }
        } else {
            userEmail = user.email || user;
        }
        
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
    
    function saveCart(user, items) {
        const GLOBAL_CART_KEY = 'AllCarts';
        
        // Parse user nếu là string
        let userEmail;
        if (typeof user === 'string') {
            try {
                const userObj = JSON.parse(user);
                userEmail = userObj.email;
            } catch (e) {
                userEmail = user; // Nếu không parse được thì coi như là email
            }
        } else {
            userEmail = user.email || user;
        }
        
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
    
    function addToCart(userId, productId) {
        const cart = getCart(userId);
        const existingItem = cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                productId: productId,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        saveCart(userId, cart);
    }
    
    function updateCartCount() {
        const CURRENT_USER_KEY = 'CurrentUser';
        const currentUser = localStorage.getItem(CURRENT_USER_KEY);
        const cartCountEl = document.getElementById('cart-count');
        
        if (!cartCountEl) return;
        
        if (!currentUser) {
            cartCountEl.textContent = '0';
            cartCountEl.style.display = 'none';
            return;
        }
        
        const cart = getCart(currentUser);
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;
        cartCountEl.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Render product card
    function renderProductCard(product) {
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        const isFavorite = isProductFavorite(product.id);
        const mainImage = Array.isArray(product.images) ? product.images[0] : product.image;
        
        return `
            <div class="product-card" data-id="${product.id}" data-click="view-detail">
                <div class="product-image-wrapper">
                    <img src="${mainImage}" alt="${product.name}">
                    ${discount > 0 ? `<span class="product-discount">-${discount}%</span>` : ''}
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${product.id}" title="Yêu thích">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <span class="product-brand">${product.brand}</span>
                <h3 class="product-name">${product.name} (${product.weight})</h3>
                <div class="product-rating">
                    ${renderStars(product.rating)}
                    <span class="rating-number">(${product.rating})</span>
                </div>
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
    }
    
    // Render stars
    function renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    // Render pagination
    function renderPagination(container, totalItems, currentPage) {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let html = '';
        
        // Previous button
        html += `<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>`;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += `<span class="page-dots">...</span>`;
            }
        }
        
        // Next button
        html += `<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>`;
        
        container.innerHTML = html;
    }
    
    // Display products
    function displayProducts(page = 1) {
        const allProducts = getAllProducts();
        
        // Get filter values
        const priceRange = priceFilter ? priceFilter.value : 'all';
        const weightRange = weightFilter ? weightFilter.value : 'all';
        const categoryValue = categoryFilter ? categoryFilter.value : 'all';
        
        // Apply filters
        let filtered = filterAndSortProducts(allProducts, '', priceRange, 'rating', weightRange, categoryValue);
        
        // Pagination
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const productsToShow = filtered.slice(startIndex, endIndex);
        
        // Render products
        featuredGrid.innerHTML = productsToShow.map(product => renderProductCard(product)).join('');
        
        // Render pagination
        renderPagination(featuredPagination, filtered.length, page);
        
        // Add pagination event listeners
        featuredPagination.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const newPage = parseInt(btn.dataset.page);
                if (newPage > 0 && newPage <= Math.ceil(filtered.length / ITEMS_PER_PAGE)) {
                    currentPage = newPage;
                    displayProducts(currentPage);
                    window.scrollTo({ top: featuredSection.offsetTop - 100, behavior: 'smooth' });
                }
            });
        });
    }
    
    // Filter và sort products
    function filterAndSortProducts(products, searchTerm, priceRange, sortBy, weightRange = 'all', categoryValue = 'all') {
        let filtered = [...products];
        
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Price filter
        if (priceRange !== 'all') {
            const [min, max] = priceRange.split('-').map(Number);
            filtered = filtered.filter(p => p.price >= min && p.price <= max);
        }
        
        // Weight filter
        if (weightRange !== 'all') {
            const [min, max] = weightRange.split('-').map(Number);
            filtered = filtered.filter(p => {
                const weight = parseWeight(p.weight);
                return weight >= min && weight <= max;
            });
        }
        
        // Category filter
        if (categoryValue !== 'all') {
            filtered = filtered.filter(p => p.category === categoryValue);
        }
        
        // Sort
        switch(sortBy) {
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
                break;
        }
        
        return filtered;
    }
    
    // Filter products by brand name (giống như search)
    function filterByBrand(brandName) {
        // Set search input value to brand name
        if (headerSearchInput) {
            headerSearchInput.value = brandName;
        }
        if (mobileSearchInput) {
            mobileSearchInput.value = brandName;
        }
        
        // Perform search with brand name
        performHeaderSearch(brandName);
        
        // Scroll to products section
        if (featuredSection) {
            window.scrollTo({ top: featuredSection.offsetTop - 100, behavior: 'smooth' });
        }
    }
    
    // Show/Hide sections
    function showSection(section) {
        const hero = document.querySelector('.hero');
        const featuredBrands = document.querySelector('.featured-brands');
        const promoBanner = document.querySelector('.promo-banner');
        const testimonials = document.querySelector('.testimonials');
        const profileSection = document.getElementById('profile');
        
        if (section === 'home') {
            // Show all home sections
            if (hero) hero.style.display = 'block';
            if (featuredBrands) featuredBrands.style.display = 'block';
            if (featuredSection) featuredSection.classList.remove('hidden');
            if (promoBanner) promoBanner.style.display = 'block';
            if (testimonials) testimonials.style.display = 'block';
            if (profileSection) profileSection.classList.add('hidden');
        }
    }
    
    // Handle hash navigation
    function handleHashChange() {
        const hash = window.location.hash;
        
        if (hash.startsWith('#brand/')) {
            const brand = hash.replace('#brand/', '');
            
            // Kiểm tra brand có tồn tại trong localStorage
            const LS_KEY_PRODUCT_DATA = 'dataProducts';
            const rawData = localStorage.getItem(LS_KEY_PRODUCT_DATA);
            let productsData = null;
            
            if (rawData) {
                try {
                    productsData = JSON.parse(rawData);
                } catch (e) {
                    console.error('Error parsing products:', e);
                }
            }
            
            if (productsData && productsData[brand]) {
                // Show home section
                showSection('home');
                
                // Reset filters
                if (priceFilter) priceFilter.value = 'all';
                if (weightFilter) weightFilter.value = 'all';
                if (categoryFilter) categoryFilter.value = 'all';
                
                // Map brand code to display name
                const brandNames = {
                    'yonex': 'Yonex',
                    'lining': 'Lining',
                    'victor': 'Victor',
                    'mizuno': 'Mizuno'
                };
                
                // Filter by brand using search
                filterByBrand(brandNames[brand] || brand);
            }
        } else if (hash.startsWith('#profile')) {
            // Profile page handled by profile.js
            return;
        } else {
            // Home page
            showSection('home');
            
            // Clear search
            if (headerSearchInput) headerSearchInput.value = '';
            if (mobileSearchInput) mobileSearchInput.value = '';
            
            // Reset display
            searchResults = [];
            currentPage = 1;
            sectionTitle.textContent = 'SẢN PHẨM NỔI BẬT';
            displayProducts(1);
        }
    }
    
    // Filter event listeners
    if (priceFilter) {
        priceFilter.addEventListener('change', () => {
            currentPage = 1;
            // Check if we're in search mode
            const currentSearchTerm = headerSearchInput ? headerSearchInput.value : '';
            if (searchResults.length > 0 || currentSearchTerm) {
                displaySearchResults(1, currentSearchTerm);
            } else {
                displayProducts(1);
            }
        });
    }
    
    if (weightFilter) {
        weightFilter.addEventListener('change', () => {
            currentPage = 1;
            // Check if we're in search mode
            const currentSearchTerm = headerSearchInput ? headerSearchInput.value : '';
            if (searchResults.length > 0 || currentSearchTerm) {
                displaySearchResults(1, currentSearchTerm);
            } else {
                displayProducts(1);
            }
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            currentPage = 1;
            // Check if we're in search mode
            const currentSearchTerm = headerSearchInput ? headerSearchInput.value : '';
            if (searchResults.length > 0 || currentSearchTerm) {
                displaySearchResults(1, currentSearchTerm);
            } else {
                displayProducts(1);
            }
        });
    }
    
    // Favorite button handler (must be before add-to-cart handler)
    document.addEventListener('click', (e) => {
        // Check if clicked on favorite button or its child (icon)
        const favoriteBtn = e.target.closest('.favorite-btn');
        if (favoriteBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = favoriteBtn.dataset.id;
            
            // Check if user is logged in
            const CURRENT_USER_KEY = 'CurrentUser';
            const currentUser = localStorage.getItem(CURRENT_USER_KEY);
            const toastEl = document.getElementById('toast');
            
            if (!currentUser) {
                // User not logged in
                if (toastEl) {
                    toastEl.textContent = 'Vui lòng đăng nhập để thêm sản phẩm yêu thích!';
                    toastEl.className = 'toast error show';
                    setTimeout(() => {
                        toastEl.classList.remove('show');
                    }, 2500);
                }
                
                setTimeout(() => {
                    const authModal = document.getElementById('auth-modal');
                    if (authModal) {
                        authModal.classList.remove('hidden');
                    }
                }, 500);
                
                return;
            }
            
            // Toggle favorite
            const favorites = getUserFavorites(currentUser);
            const favIndex = favorites.indexOf(productId);
            
            if (favIndex === -1) {
                // Add to favorites
                favorites.push(productId);
                favoriteBtn.classList.add('active');
                const icon = favoriteBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-heart';
                
                if (toastEl) {
                    toastEl.textContent = 'Đã thêm vào sản phẩm yêu thích!';
                    toastEl.className = 'toast success show';
                    setTimeout(() => {
                        toastEl.classList.remove('show');
                    }, 2000);
                }
            } else {
                // Remove from favorites
                favorites.splice(favIndex, 1);
                favoriteBtn.classList.remove('active');
                const icon = favoriteBtn.querySelector('i');
                if (icon) icon.className = 'far fa-heart';
                
                if (toastEl) {
                    toastEl.textContent = 'Đã xóa khỏi sản phẩm yêu thích!';
                    toastEl.className = 'toast info show';
                    setTimeout(() => {
                        toastEl.classList.remove('show');
                    }, 2000);
                }
            }
            
            // Save favorites
            saveUserFavorites(currentUser, favorites);
            
            // Trigger event to update profile page if open
            window.dispatchEvent(new Event('favoritesUpdated'));
        }
    });
    
    // Add to cart button handler
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.classList.contains('add-to-cart-btn') ? e.target : e.target.closest('.add-to-cart-btn');
            const productId = btn.dataset.id;
            
            // Check if user is logged in
            const CURRENT_USER_KEY = 'CurrentUser';
            const currentUser = localStorage.getItem(CURRENT_USER_KEY);
            
            const toastEl = document.getElementById('toast');
            
            if (!currentUser) {
                // User not logged in - show error and open login modal
                if (toastEl) {
                    toastEl.textContent = 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!';
                    toastEl.className = 'toast error show';
                    setTimeout(() => {
                        toastEl.classList.remove('show');
                    }, 2500);
                }
                
                // Open login modal after a short delay
                setTimeout(() => {
                    const authModal = document.getElementById('auth-modal');
                    if (authModal) {
                        authModal.classList.remove('hidden');
                    }
                }, 500);
                
                return;
            }
            
            // User is logged in - add to cart
            addToCart(currentUser, productId);
            
            if (toastEl) {
                toastEl.textContent = 'Đã thêm sản phẩm vào giỏ hàng!';
                toastEl.className = 'toast success show';
                setTimeout(() => {
                    toastEl.classList.remove('show');
                }, 2000);
            }
        }
    });
    
    // Listen to hash change
    window.addEventListener('hashchange', handleHashChange);
    
    // Display search results with pagination and filters
    function displaySearchResults(page = 1, searchTerm = '') {
        // Get current filter values
        const priceRange = priceFilter ? priceFilter.value : 'all';
        const weightRange = weightFilter ? weightFilter.value : 'all';
        const categoryValue = categoryFilter ? categoryFilter.value : 'all';
        
        // Apply filters to search results
        let filtered = filterAndSortProducts(searchResults, '', priceRange, 'rating', weightRange, categoryValue);
        
        if (filtered.length === 0) {
            featuredGrid.innerHTML = '<p class="no-products">Không tìm thấy sản phẩm nào.</p>';
            featuredPagination.innerHTML = '';
            // Update title with search term
            if (searchTerm) {
                sectionTitle.textContent = `Tìm kiếm cho: "${searchTerm.toUpperCase()}"`;
            }
            return;
        }
        
        // Update title with search term
        if (searchTerm) {
            sectionTitle.textContent = `Tìm kiếm cho: "${searchTerm.toUpperCase()}"`;
        }
        
        currentPage = page;
        
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const productsToShow = filtered.slice(startIndex, endIndex);
        
        featuredGrid.innerHTML = productsToShow.map(product => renderProductCard(product)).join('');
        renderPagination(featuredPagination, filtered.length, page);
        
        // Update pagination event listeners
        featuredPagination.querySelectorAll('.page-btn:not(.disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                const newPage = parseInt(btn.dataset.page);
                const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
                if (!isNaN(newPage) && newPage > 0 && newPage <= totalPages) {
                    displaySearchResults(newPage, searchTerm);
                    window.scrollTo({ top: featuredSection.offsetTop - 100, behavior: 'smooth' });
                }
            });
        });
    }
    
    // Function to perform header search (realtime)
    function performHeaderSearch(searchTerm) {
        const allProducts = getAllProducts();
        
        if (!searchTerm || searchTerm.trim() === '') {
            // Nếu không có từ khóa, hiển thị tất cả sản phẩm
            searchResults = [];
            currentPage = 1;
            sectionTitle.textContent = 'SẢN PHẨM NỔI BẬT';
            displayProducts(1);
            return;
        }
        
        // Tìm kiếm trong tất cả sản phẩm
        const term = searchTerm.toLowerCase();
        searchResults = allProducts.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.brand.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term)
        );
        
        // Hiển thị kết quả với search term
        currentPage = 1;
        displaySearchResults(1, searchTerm);
            
    }
    
    // Desktop search - realtime input
    if (headerSearchInput) {
        headerSearchInput.addEventListener('input', (e) => {
            performHeaderSearch(e.target.value);
        });
    }
    
    // Mobile search - realtime input
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', (e) => {
            performHeaderSearch(e.target.value);
        });
    }
    
    // Clear hash when clicking logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '';
        });
    }
    
    // Product detail modal
    const productModal = document.getElementById('product-detail-modal');
    const closeProductModal = document.getElementById('close-product-modal');
    
    // Show product detail modal
    function showProductDetail(productId) {
        const allProducts = getAllProducts();
        const product = allProducts.find(p => p.id === productId);
        
        if (!product) return;
        
        // Update modal images (support multiple images)
        const imageContainer = document.querySelector('.product-modal-image');
        const images = Array.isArray(product.images) ? product.images : [product.image];
        
        if (images.length > 1) {
            // Multiple images - create carousel
            imageContainer.innerHTML = `
                <div class="product-image-carousel">
                    <img id="modal-product-image" src="${images[0]}" alt="${product.name}">
                    <div class="carousel-dots">
                        ${images.map((img, index) => `
                            <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
                        `).join('')}
                    </div>
                    <div class="carousel-thumbnails">
                        ${images.map((img, index) => `
                            <img src="${img}" class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}" alt="Ảnh ${index + 1}">
                        `).join('')}
                    </div>
                </div>
            `;
            
            // Add click handlers for thumbnails
            const thumbnails = imageContainer.querySelectorAll('.thumbnail');
            const dots = imageContainer.querySelectorAll('.dot');
            const mainImage = imageContainer.querySelector('#modal-product-image');
            
            thumbnails.forEach((thumb, index) => {
                thumb.addEventListener('click', () => {
                    mainImage.src = images[index];
                    thumbnails.forEach(t => t.classList.remove('active'));
                    dots.forEach(d => d.classList.remove('active'));
                    thumb.classList.add('active');
                    dots[index].classList.add('active');
                });
            });
            
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    mainImage.src = images[index];
                    thumbnails.forEach(t => t.classList.remove('active'));
                    dots.forEach(d => d.classList.remove('active'));
                    thumbnails[index].classList.add('active');
                    dot.classList.add('active');
                });
            });
        } else {
            // Single image
            imageContainer.innerHTML = `<img id="modal-product-image" src="${images[0]}" alt="${product.name}">`;
        }
        
        document.getElementById('modal-product-brand').textContent = product.brand;
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-product-price').textContent = formatPrice(product.price);
        
        const originalPriceEl = document.getElementById('modal-product-original-price');
        if (product.originalPrice > product.price) {
            originalPriceEl.textContent = formatPrice(product.originalPrice);
            originalPriceEl.style.display = 'block';
        } else {
            originalPriceEl.style.display = 'none';
        }
        
        // Rating
        const ratingEl = document.getElementById('modal-product-rating');
        ratingEl.innerHTML = `
            ${renderStars(product.rating)}
            <span class="rating-number">(${product.rating})</span>
        `;
        
        // Description
        document.getElementById('modal-product-description').textContent = product.description;
        
        // Specs
        document.getElementById('modal-product-weight').textContent = `${product.weight} (${product.weightGrams}g)`;
        document.getElementById('modal-product-balance').textContent = product.balance;
        document.getElementById('modal-product-flexibility').textContent = product.flexibility;
        document.getElementById('modal-product-tension').textContent = product.maxTension;
        document.getElementById('modal-product-origin').textContent = product.madeIn;
        document.getElementById('modal-product-category').textContent = product.category;
        
        // Update favorite button
        const modalFavoriteBtn = document.getElementById('modal-favorite-btn');
        const isFavorite = isProductFavorite(productId);
        if (isFavorite) {
            modalFavoriteBtn.classList.add('active');
            modalFavoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Đã yêu thích';
        } else {
            modalFavoriteBtn.classList.remove('active');
            modalFavoriteBtn.innerHTML = '<i class="far fa-heart"></i> Yêu thích';
        }
        
        // Store product ID for actions
        modalFavoriteBtn.dataset.id = productId;
        document.getElementById('modal-add-to-cart').dataset.id = productId;
        
        // Show modal
        productModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal
    function closeModal() {
        productModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    if (closeProductModal) {
        closeProductModal.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                closeModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !productModal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    // Handle product card click
    document.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card[data-click="view-detail"]');
        
        // Ignore if clicked on favorite or add-to-cart button
        if (e.target.closest('.favorite-btn') || e.target.closest('.add-to-cart-btn')) {
            return;
        }
        
        if (productCard) {
            const productId = productCard.dataset.id;
            showProductDetail(productId);
        }
    });
    
    // Modal favorite button handler
    document.addEventListener('click', (e) => {
        if (e.target.closest('#modal-favorite-btn')) {
            const btn = e.target.closest('#modal-favorite-btn');
            const productId = btn.dataset.id;
            
            // Check if user is logged in
            const CURRENT_USER_KEY = 'CurrentUser';
            const currentUser = localStorage.getItem(CURRENT_USER_KEY);
            const toastEl = document.getElementById('toast');
            
            if (!currentUser) {
                if (toastEl) {
                    toastEl.textContent = 'Vui lòng đăng nhập để thêm sản phẩm yêu thích!';
                    toastEl.className = 'toast error show';
                    setTimeout(() => {
                        toastEl.classList.remove('show');
                    }, 2500);
                }
                
                closeModal();
                setTimeout(() => {
                    const authModal = document.getElementById('auth-modal');
                    if (authModal) {
                        authModal.classList.remove('hidden');
                    }
                }, 500);
                
                return;
            }
            
            // Toggle favorite
            const favorites = getUserFavorites(currentUser);
            const favIndex = favorites.indexOf(productId);
            
            if (favIndex === -1) {
                favorites.push(productId);
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-heart"></i> Đã yêu thích';
                
                if (toastEl) {
                    toastEl.textContent = 'Đã thêm vào sản phẩm yêu thích!';
                    toastEl.className = 'toast success show';
                    setTimeout(() => {
                        toastEl.classList.remove('show');
                    }, 2000);
                }
            } else {
                favorites.splice(favIndex, 1);
                btn.classList.remove('active');
                btn.innerHTML = '<i class="far fa-heart"></i> Yêu thích';
                
                if (toastEl) {
                    toastEl.textContent = 'Đã xóa khỏi sản phẩm yêu thích!';
                    toastEl.className = 'toast info show';
                    setTimeout(() => {
                        toastEl.classList.remove('show');
                    }, 2000);
                }
                
                // Close modal and reload profile if on favorites page
                const currentHash = window.location.hash;
                if (currentHash === '#profile/SanPhamYeuThich') {
                    closeModal();
                    // Trigger profile page reload after a short delay
                    setTimeout(() => {
                        window.dispatchEvent(new Event('favoritesUpdated'));
                    }, 300);
                }
            }
            
            saveUserFavorites(currentUser, favorites);
            window.dispatchEvent(new Event('favoritesUpdated'));
            
            // Update the card in background
            const card = document.querySelector(`.product-card[data-id="${productId}"]`);
            if (card) {
                const cardFavBtn = card.querySelector('.favorite-btn');
                if (cardFavBtn) {
                    if (favIndex === -1) {
                        cardFavBtn.classList.add('active');
                        const icon = cardFavBtn.querySelector('i');
                        if (icon) icon.className = 'fas fa-heart';
                    } else {
                        cardFavBtn.classList.remove('active');
                        const icon = cardFavBtn.querySelector('i');
                        if (icon) icon.className = 'far fa-heart';
                    }
                }
            }
        }
    });
    
    // Modal add to cart handler
    document.addEventListener('click', (e) => {
        if (e.target.closest('#modal-add-to-cart')) {
            const btn = e.target.closest('#modal-add-to-cart');
            const productId = btn.dataset.id;
            
            // Check if user is logged in
            const CURRENT_USER_KEY = 'CurrentUser';
            const currentUser = localStorage.getItem(CURRENT_USER_KEY);
            const toastEl = document.getElementById('toast');
            
            if (!currentUser) {
                if (toastEl) {
                    toastEl.textContent = 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!';
                    toastEl.className = 'toast error show';
                    setTimeout(() => {
                        toastEl.classList.remove('show');
                    }, 2500);
                }
                
                closeModal();
                setTimeout(() => {
                    const authModal = document.getElementById('auth-modal');
                    if (authModal) {
                        authModal.classList.remove('hidden');
                    }
                }, 500);
                
                return;
            }
            
            // Add to cart
            addToCart(currentUser, productId);
            
            if (toastEl) {
                toastEl.textContent = 'Đã thêm sản phẩm vào giỏ hàng!';
                toastEl.className = 'toast success show';
                setTimeout(() => {
                    toastEl.classList.remove('show');
                }, 2000);
            }
            
            closeModal();
        }
    });
    
    // Initial load
    updateCartCount();
    handleHashChange();
});
