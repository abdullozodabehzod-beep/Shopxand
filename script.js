// ========= ДАННЫЕ ТОВАРОВ =========
const productsData = [
    { id: 1, name: "iPhone 15 Pro", price: 99900, oldPrice: 119900, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop", badge: "🔥 Хит", category: "electronics" },
    { id: 2, name: "Наушники Sony WH-1000XM5", price: 29900, oldPrice: 39900, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop", badge: "🎧 Топ", category: "electronics" },
    { id: 3, name: "Смарт-часы Apple Watch", price: 45900, oldPrice: null, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop", badge: "✨ Новинка", category: "electronics" },
    { id: 4, name: "Кроссовки Nike Air Max", price: 12900, oldPrice: 18900, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", badge: "👟 -30%", category: "shoes" },
    { id: 5, name: "Джинсы Levi's 501", price: 7990, oldPrice: 12990, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop", badge: "👖 Бестселлер", category: "clothing" },
    { id: 6, name: "Парфюм Dior Sauvage", price: 8990, oldPrice: 12990, image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop", badge: "💎 Luxury", category: "beauty" },
    { id: 7, name: "Ноутбук MacBook Pro", price: 159900, oldPrice: 179900, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop", badge: "💻 Топ", category: "electronics" },
    { id: 8, name: "Платье вечернее", price: 5490, oldPrice: 8990, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop", badge: "👗 Стиль", category: "clothing" },
    { id: 9, name: "Кроссовки Adidas Ultraboost", price: 15900, oldPrice: 21900, image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=400&h=400&fit=crop", badge: "👟 Хит продаж", category: "shoes" },
    { id: 10, name: "Сумка кожаная", price: 12900, oldPrice: 18900, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop", badge: "👜 Акция", category: "clothing" },
    { id: 11, name: "Планшет Samsung Tab S9", price: 69900, oldPrice: 89900, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop", badge: "📱 Новинка", category: "electronics" },
    { id: 12, name: "Духи Chanel No.5", price: 14900, oldPrice: 19900, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop", badge: "💎 Luxury", category: "beauty" }
];

// ========= ПАГИНАЦИЯ =========
let currentPage = 1;
const itemsPerPage = 6;
let totalPages = 1;
let currentFilteredProducts = [];


function getCurrentPageProducts() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return currentFilteredProducts.slice(start, end);
}

function updatePagination() {
    totalPages = Math.ceil(currentFilteredProducts.length / itemsPerPage);
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const paginationNumbers = document.getElementById('paginationNumbers');
    if (!prevBtn || !nextBtn || !paginationNumbers) return;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    let pagesHtml = '';
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pagesHtml += `<button class="pagination__number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        }
    } else {
        pagesHtml += `<button class="pagination__number ${1 === currentPage ? 'active' : ''}" onclick="goToPage(1)">1</button>`;
        if (currentPage > 3) pagesHtml += `<span class="pagination__dots">...</span>`;
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);
        if (currentPage <= 3) { startPage = 2; endPage = 4; }
        if (currentPage >= totalPages - 2) { startPage = totalPages - 3; endPage = totalPages - 1; }
        for (let i = startPage; i <= endPage; i++) {
            pagesHtml += `<button class="pagination__number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        }
        if (currentPage < totalPages - 2) pagesHtml += `<span class="pagination__dots">...</span>`;
        pagesHtml += `<button class="pagination__number ${totalPages === currentPage ? 'active' : ''}" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    paginationNumbers.innerHTML = pagesHtml;
    const pagination = document.getElementById('pagination');
    if (pagination) pagination.style.display = totalPages > 1 ? 'flex' : 'none';
}

function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderProducts(getCurrentPageProducts());
    updatePagination();
    document.querySelector('.products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ========= КОРЗИНА =========
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        if (badge.closest('.cart-icon') || badge.closest('.header__action-icon')) {
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    });
    const cartCountLabel = document.getElementById('cartCountLabel');
    if (cartCountLabel) cartCountLabel.textContent = totalItems;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast-notification ${type}`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function openCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) { cartModal.classList.add('active'); renderCartItems(); document.body.style.overflow = 'hidden'; }
}
function closeCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) { cartModal.classList.remove('active'); document.body.style.overflow = ''; }
}
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) { existingItem.quantity++; } else { cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }); }
    saveCart(); updateCartBadge(); showToast(`${product.name} добавлен в корзину! ✅`, 'success');
}
function removeFromCart(productId) {
    const item = cart.find(i => i.id === productId);
    cart = cart.filter(item => item.id !== productId);
    saveCart(); updateCartBadge(); renderCartItems(); showToast(`${item?.name || 'Товар'} удален`, 'error');
}
function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) { removeFromCart(productId); } else if (newQuantity <= 99) { item.quantity = newQuantity; saveCart(); updateCartBadge(); renderCartItems(); }
    }
}
function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Очистить корзину?')) { cart = []; saveCart(); updateCartBadge(); renderCartItems(); showToast('Корзина очищена', 'info'); }
}
function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal > 5000 ? 0 : 299;
    const total = subtotal + delivery;
    const subtotalEl = document.getElementById('cartSubtotal');
    const deliveryEl = document.getElementById('cartDelivery');
    const totalEl = document.getElementById('cartTotal');
    if (subtotalEl) subtotalEl.textContent = `${subtotal.toLocaleString()} ₽`;
    if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'Бесплатно' : `${delivery} ₽`;
    if (totalEl) totalEl.textContent = `${total.toLocaleString()} ₽`;
}
function renderCartItems() {
    const cartContent = document.getElementById('cartContent');
    const cartFooter = document.getElementById('cartFooter');
    if (!cartContent) return;
    if (cart.length === 0) {
        cartContent.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-cart"></i><p>Корзина пуста</p><button class="btn-continue-shopping" onclick="closeCart()">Продолжить</button></div>`;
        if (cartFooter) cartFooter.style.display = 'none';
        return;
    }
    cartContent.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" class="cart-item__image">
            <div class="cart-item__info">
                <div class="cart-item__title">${item.name}</div>
                <div class="cart-item__price">${(item.price * item.quantity).toLocaleString()} ₽</div>
                <div class="cart-item__controls">
                    <button class="cart-item__quantity-btn" onclick="updateQuantity(${item.id}, -1)"><i class="fas fa-minus"></i></button>
                    <span class="cart-item__quantity">${item.quantity}</span>
                    <button class="cart-item__quantity-btn" onclick="updateQuantity(${item.id}, 1)"><i class="fas fa-plus"></i></button>
                    <button class="cart-item__remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        </div>
    `).join('');
    updateCartTotals();
    if (cartFooter) cartFooter.style.display = 'block';
}

// ========= ИЗБРАННОЕ =========
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function saveWishlist() { localStorage.setItem('wishlist', JSON.stringify(wishlist)); updateWishlistBadge(); }
function updateWishlistBadge() {
    const count = wishlist.length;
    const badges = document.querySelectorAll('.wishlist-badge');
    badges.forEach(badge => { badge.textContent = count; badge.style.display = count > 0 ? 'flex' : 'none'; });
}
function addToWishlist(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    const exists = wishlist.some(item => item.id === productId);
    if (exists) { wishlist = wishlist.filter(item => item.id !== productId); showToast(`${product.name} удален из избранного`, 'info'); }
    else { wishlist.push({ id: product.id, name: product.name, price: product.price, oldPrice: product.oldPrice, image: product.image, category: product.category, badge: product.badge }); showToast(`${product.name} добавлен в избранное ❤️`, 'success'); }
    saveWishlist(); updateWishlistButton(productId); renderWishlistPage();
}
function removeFromWishlist(productId) { wishlist = wishlist.filter(item => item.id !== productId); saveWishlist(); renderWishlistPage(); updateWishlistButton(productId); showToast('Товар удален из избранного', 'info'); }
function updateWishlistButton(productId) {
    const isInWishlist = wishlist.some(item => item.id === productId);
    const buttons = document.querySelectorAll(`.btn-wishlist[onclick*="addToWishlist(${productId})"]`);
    buttons.forEach(btn => {
        if (isInWishlist) { btn.innerHTML = '<i class="fas fa-heart" style="color: #ef4444;"></i>'; btn.style.background = '#fee2e2'; }
        else { btn.innerHTML = '<i class="far fa-heart"></i>'; btn.style.background = ''; }
    });
}
function renderWishlistPage() {
    const grid = document.getElementById('wishlistGrid');
    const wishlistPage = document.getElementById('wishlistPage');
    const mainContent = document.querySelector('main');
    const heroSection = document.querySelector('.hero');
    const categoriesSection = document.querySelector('.categories');
    const productsSection = document.querySelector('.products');
    if (!grid) return;
    if (wishlistPage) wishlistPage.style.display = 'block';
    if (mainContent) mainContent.style.display = 'none';
    if (heroSection) heroSection.style.display = 'none';
    if (categoriesSection) categoriesSection.style.display = 'none';
    if (productsSection) productsSection.style.display = 'none';
    if (wishlist.length === 0) {
        grid.innerHTML = `<div class="wishlist-empty" style="grid-column: 1/-1;"><i class="far fa-heart"></i><h3>Ваш список желаний пуст</h3><p>Добавляйте товары в избранное, чтобы не потерять их</p><button class="wishlist-empty__btn" onclick="hideWishlistPage()"><i class="fas fa-shopping-bag"></i> Продолжить покупки</button></div>`;
        return;
    }
    grid.innerHTML = wishlist.map(product => `
        <div class="wishlist-card">
            <button class="wishlist-card__remove" onclick="removeFromWishlist(${product.id})"><i class="fas fa-times"></i></button>
            <img src="${product.image}" class="wishlist-card__image" onclick="openProductModal(${product.id})">
            <div class="wishlist-card__info">
                <h3 class="wishlist-card__title" onclick="openProductModal(${product.id})">${product.name}</h3>
                <div class="wishlist-card__price">${product.price.toLocaleString()} ₽${product.oldPrice ? `<span class="wishlist-card__old-price">${product.oldPrice.toLocaleString()} ₽</span>` : ''}</div>
                <div class="wishlist-card__actions">
                    <button class="wishlist-card__add-to-cart" onclick="addToCart(${product.id})"><i class="fas fa-shopping-cart"></i> В корзину</button>
                </div>
            </div>
        </div>
    `).join('');
}
function hideWishlistPage() {
    const wishlistPage = document.getElementById('wishlistPage');
    const mainContent = document.querySelector('main');
    const heroSection = document.querySelector('.hero');
    const categoriesSection = document.querySelector('.categories');
    const productsSection = document.querySelector('.products');
    if (wishlistPage) wishlistPage.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    if (heroSection) heroSection.style.display = 'block';
    if (categoriesSection) categoriesSection.style.display = 'block';
    if (productsSection) productsSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function showWishlistPage() { renderWishlistPage(); }
function clearWishlist() {
    if (wishlist.length === 0) return;
    if (confirm('Очистить весь список избранного?')) { wishlist = []; saveWishlist(); renderWishlistPage(); showToast('Избранное очищено', 'info'); }
}
function initWishlistButtons() { productsData.forEach(product => updateWishlistButton(product.id)); }

// ========= ОТРИСОВКА ТОВАРОВ =========
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    if (products.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;"><i class="fas fa-search" style="font-size:64px;color:#cbd5e1;"></i><h3 style="margin-top:20px;">Товары не найдены</h3></div>`;
        return;
    }
    grid.innerHTML = products.map(product => {
        const isInWishlist = wishlist.some(item => item.id === product.id);
        return `
            <div class="product-card">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <img src="${product.image}" class="product-image" onclick="openProductModal(${product.id})" style="cursor:pointer;">
                <div class="product-info">
                    <h3 class="product-title" onclick="openProductModal(${product.id})" style="cursor:pointer;">${product.name}</h3>
                    <div class="product-price">${product.price.toLocaleString()} ₽${product.oldPrice ? `<span class="product-old-price">${product.oldPrice.toLocaleString()} ₽</span>` : ''}</div>
                    <div class="product-actions">
                        <button class="btn-cart" onclick="addToCart(${product.id})"><i class="fas fa-shopping-cart"></i> В корзину</button>
                        <button class="btn-wishlist" onclick="addToWishlist(${product.id})">${isInWishlist ? '<i class="fas fa-heart" style="color: #ef4444;"></i>' : '<i class="far fa-heart"></i>'}</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ========= ФИЛЬТРАЦИЯ И СОРТИРОВКА =========
let filters = { search: '', priceMin: 0, priceMax: 120000, categories: [], saleOnly: false };
let currentSort = 'popular';

function filterAndRender() {
    let filtered = [...productsData];
    if (filters.search) filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));
    filtered = filtered.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax);
    if (filters.categories.length) filtered = filtered.filter(p => filters.categories.includes(p.category));
    if (filters.saleOnly) filtered = filtered.filter(p => p.oldPrice !== null);
    switch(currentSort) {
        case 'price-asc': filtered.sort((a,b) => a.price - b.price); break;
        case 'price-desc': filtered.sort((a,b) => b.price - a.price); break;
        case 'newest': filtered.sort((a,b) => b.id - a.id); break;
    }
    currentFilteredProducts = filtered;
    currentPage = 1;
    const countSpan = document.getElementById('productsCount');
    if (countSpan) countSpan.textContent = filtered.length;
    renderProducts(getCurrentPageProducts());
    updatePagination();
    initWishlistButtons();
}

function sortProducts(sortType) { currentSort = sortType; filterAndRender(); }

function initFilters() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', (e) => { filters.search = e.target.value; filterAndRender(); });
    const priceMinSlider = document.getElementById('priceMinSlider');
    const priceMaxSlider = document.getElementById('priceMaxSlider');
    const priceMinInput = document.getElementById('priceMin');
    const priceMaxInput = document.getElementById('priceMax');
    function updatePriceRange() {
        let min = parseInt(priceMinSlider?.value || 0);
        let max = parseInt(priceMaxSlider?.value || 120000);
        if (min > max) [min, max] = [max, min];
        filters.priceMin = min; filters.priceMax = max;
        if (priceMinInput) priceMinInput.value = min;
        if (priceMaxInput) priceMaxInput.value = max;
        if (priceMinSlider) priceMinSlider.value = min;
        if (priceMaxSlider) priceMaxSlider.value = max;
        filterAndRender();
    }
    if (priceMinSlider) priceMinSlider.addEventListener('input', updatePriceRange);
    if (priceMaxSlider) priceMaxSlider.addEventListener('input', updatePriceRange);
    if (priceMinInput) priceMinInput.addEventListener('change', (e) => {
        let val = parseInt(e.target.value) || 0;
        filters.priceMin = Math.min(val, filters.priceMax);
        if (priceMinSlider) priceMinSlider.value = filters.priceMin;
        filterAndRender();
    });
    if (priceMaxInput) priceMaxInput.addEventListener('change', (e) => {
        let val = parseInt(e.target.value) || 120000;
        filters.priceMax = Math.max(val, filters.priceMin);
        if (priceMaxSlider) priceMaxSlider.value = filters.priceMax;
        filterAndRender();
    });
    document.querySelectorAll('.category-filter').forEach(cb => {
        cb.addEventListener('change', (e) => {
            if (e.target.checked) filters.categories.push(e.target.value);
            else filters.categories = filters.categories.filter(c => c !== e.target.value);
            filterAndRender();
        });
    });
    const saleOnlyCheckbox = document.getElementById('saleOnly');
    if (saleOnlyCheckbox) saleOnlyCheckbox.addEventListener('change', (e) => { filters.saleOnly = e.target.checked; filterAndRender(); });
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) resetBtn.addEventListener('click', () => {
        filters = { search: '', priceMin: 0, priceMax: 120000, categories: [], saleOnly: false };
        if (searchInput) searchInput.value = '';
        if (priceMinSlider) priceMinSlider.value = 0;
        if (priceMaxSlider) priceMaxSlider.value = 120000;
        if (priceMinInput) priceMinInput.value = 0;
        if (priceMaxInput) priceMaxInput.value = 120000;
        document.querySelectorAll('.category-filter').forEach(cb => cb.checked = false);
        if (saleOnlyCheckbox) saleOnlyCheckbox.checked = false;
        filterAndRender();
        showToast('Фильтры сброшены', 'info');
    });
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterPanel = document.getElementById('filterPanel');
    if (filterToggleBtn && filterPanel) filterToggleBtn.addEventListener('click', () => filterPanel.classList.toggle('open'));
}

// ========= ДЕТАЛЬНАЯ СТРАНИЦА =========
let currentProduct = null;
let currentQuantity = 1;

function openProductModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    currentProduct = product;
    currentQuantity = 1;
    const similarProducts = productsData.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    const productRating = product.rating || 0;
    const productReviewsCount = product.reviewsCount || (reviews[productId]?.length || 0);
    const container = document.getElementById('productModalContent');
    if (!container) return;
    container.innerHTML = `
        <div class="product-detail">
            <div class="product-gallery"><img src="${product.image}" class="product-main-image" id="mainImage"><div class="product-thumbnails"><img src="${product.image}" class="product-thumb active" onclick="changeMainImage('${product.image}', this)"></div></div>
            <div class="product-info-detail">
                <span class="product-category">${getCategoryName(product.category)}</span>
                <h1 class="product-title-detail">${product.name}</h1>
                <div class="product-rating"><div class="stars" id="productStars">${generateStarRating(productRating)}</div><span class="rating-value" id="productRatingValue">${productRating.toFixed(1)}</span><span class="reviews-count" id="productReviewsCount">${productReviewsCount}</span><span>отзывов</span></div>
                <div class="product-price-detail"><span class="current-price">${product.price.toLocaleString()} ₽</span>${product.oldPrice ? `<span class="old-price-detail">${product.oldPrice.toLocaleString()} ₽</span><span class="discount-badge">-${Math.round((1 - product.price/product.oldPrice)*100)}%</span>` : ''}</div>
                <div class="product-description"><p>${getDescription(product.name)}</p></div>
                <div class="product-attributes"><div class="attribute"><i class="fas fa-truck"></i><span>Бесплатная доставка от 5000₽</span></div><div class="attribute"><i class="fas fa-undo-alt"></i><span>Возврат 14 дней</span></div><div class="attribute"><i class="fas fa-shield-alt"></i><span>Гарантия 12 месяцев</span></div></div>
                <div class="quantity-selector"><label>Количество:</label><div class="quantity-controls"><button class="quantity-btn" onclick="changeQuantity(-1)"><i class="fas fa-minus"></i></button><span class="quantity-value" id="detailQuantity">1</span><button class="quantity-btn" onclick="changeQuantity(1)"><i class="fas fa-plus"></i></button></div></div>
                <div class="product-actions-detail"><button class="btn-add-to-cart" onclick="addToCartFromDetail()"><i class="fas fa-shopping-cart"></i> В корзину</button><button class="btn-buy-now" onclick="buyNow()">Купить сейчас</button></div>
            </div>
        </div>
        <div class="reviews-section"><div class="reviews-header"><h3>Отзывы покупателей</h3><button class="btn-write-review" onclick="openReviewForm()"><i class="fas fa-pen"></i> Написать отзыв</button></div><div class="reviews-summary"><div class="reviews-summary__rating"><div class="big-rating">${productRating.toFixed(1)}</div><div class="stars">${generateStarRating(productRating)}</div><div>${productReviewsCount} отзывов</div></div></div><div id="reviewsContainer" class="reviews-container"></div></div>
        ${similarProducts.length ? `<div class="similar-products"><h3>Похожие товары</h3><div class="similar-grid">${similarProducts.map(p => `<div class="similar-card" onclick="openProductModal(${p.id})"><img src="${p.image}"><div class="similar-card-info"><div class="similar-card-title">${p.name}</div><div class="similar-card-price">${p.price.toLocaleString()} ₽</div></div></div>`).join('')}</div></div>` : ''}
    `;
    renderReviews(product.id);
    const modal = document.getElementById('productModal');
    if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeProductModal() { const modal = document.getElementById('productModal'); if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; } currentProduct = null; currentQuantity = 1; }
function getCategoryName(category) { const names = { electronics: 'Электроника', clothing: 'Одежда', shoes: 'Обувь', beauty: 'Красота' }; return names[category] || category; }
function getDescription(name) { return `${name} — высококачественный продукт. Современный дизайн и надежные материалы делают его идеальным выбором.`; }
function changeMainImage(imgUrl, element) { const mainImage = document.getElementById('mainImage'); if (mainImage) mainImage.src = imgUrl; document.querySelectorAll('.product-thumb').forEach(thumb => thumb.classList.remove('active')); if (element) element.classList.add('active'); }
function changeQuantity(delta) { const newVal = currentQuantity + delta; if (newVal >= 1 && newVal <= 99) { currentQuantity = newVal; const span = document.getElementById('detailQuantity'); if (span) span.textContent = currentQuantity; } }
function addToCartFromDetail() { if (!currentProduct) return; for (let i = 0; i < currentQuantity; i++) addToCart(currentProduct.id); showToast(`Добавлено ${currentQuantity} шт. ${currentProduct.name}`, 'success'); closeProductModal(); }
function buyNow() { if (!currentProduct) return; for (let i = 0; i < currentQuantity; i++) addToCart(currentProduct.id); closeProductModal(); setTimeout(() => openCart(), 300); }

// ========= БУРГЕР-МЕНЮ =========
function initBurgerMenu() {
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    function openMenu() { if (mobileMenu) mobileMenu.classList.add('open'); if (overlay) overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
    function closeMenu() { if (mobileMenu) mobileMenu.classList.remove('open'); if (overlay) overlay.classList.remove('active'); document.body.style.overflow = ''; }
    if (burgerBtn) burgerBtn.addEventListener('click', openMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
}
function initMobileSearch() {
    const trigger = document.querySelector('.mobile-search-trigger');
    const panel = document.getElementById('mobileSearch');
    const closeBtn = document.getElementById('closeMobileSearch');
    if (trigger) trigger.addEventListener('click', () => panel?.classList.add('open'));
    if (closeBtn) closeBtn.addEventListener('click', () => panel?.classList.remove('open'));
}
function initScrollEffect() { const header = document.querySelector('.header'); if (header) window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20)); }

// ========= ПОДПИСКА =========
const subscribeForm = document.getElementById('subscribeForm');
if (subscribeForm) { subscribeForm.addEventListener('submit', (e) => { e.preventDefault(); const email = subscribeForm.querySelector('input[type="email"]').value; if (email) { showToast(`Спасибо за подписку! ${email}`, 'success'); subscribeForm.reset(); } }); }

// ========= ОТЗЫВЫ И РЕЙТИНГИ =========
let reviews = JSON.parse(localStorage.getItem('reviews')) || {};
function initReviews() { productsData.forEach(product => { if (!reviews[product.id]) reviews[product.id] = []; }); saveReviews(); }
function saveReviews() { localStorage.setItem('reviews', JSON.stringify(reviews)); }
function addReview(productId, rating, text, userName) {
    if (!reviews[productId]) reviews[productId] = [];
    const newReview = { id: Date.now(), userName: userName || 'Покупатель', rating: parseInt(rating), text: text, date: new Date().toLocaleDateString('ru-RU'), likes: 0 };
    reviews[productId].unshift(newReview);
    saveReviews();
    updateProductRating(productId);
    showToast('Спасибо за отзыв!', 'success');
    const modal = document.getElementById('productModal');
    if (modal && modal.classList.contains('active') && currentProduct && currentProduct.id === productId) {
        renderReviews(productId);
        const product = productsData.find(p => p.id === productId);
        if (product) {
            const starsContainer = document.getElementById('productStars');
            const ratingValue = document.getElementById('productRatingValue');
            const reviewsCountSpan = document.getElementById('productReviewsCount');
            if (starsContainer) starsContainer.innerHTML = generateStarRating(product.rating);
            if (ratingValue) ratingValue.textContent = product.rating.toFixed(1);
            if (reviewsCountSpan) reviewsCountSpan.textContent = product.reviewsCount;
        }
    }
}
function updateProductRating(productId) {
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) return;
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    const roundedRating = Math.round(avgRating * 10) / 10;
    const product = productsData.find(p => p.id === productId);
    if (product) { product.rating = roundedRating; product.reviewsCount = productReviews.length; }
}
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star" style="color: #fbbf24;"></i>';
    if (hasHalf) stars += '<i class="fas fa-star-half-alt" style="color: #fbbf24;"></i>';
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) stars += '<i class="far fa-star" style="color: #fbbf24;"></i>';
    return stars;
}
function renderReviews(productId) {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) { container.innerHTML = `<div class="reviews-empty"><i class="far fa-comment-dots"></i><p>Пока нет отзывов. Будьте первым!</p></div>`; return; }
    container.innerHTML = productReviews.map(review => `<div class="review-card"><div class="review-header"><div class="review-user"><i class="fas fa-user-circle"></i><strong>${escapeHtml(review.userName)}</strong></div><div class="review-rating">${generateStarRating(review.rating)}</div></div><div class="review-date">${review.date}</div><div class="review-text">${escapeHtml(review.text)}</div><div class="review-footer"><button class="review-like" onclick="likeReview(${productId}, ${review.id})"><i class="far fa-heart"></i> <span>${review.likes}</span></button></div></div>`).join('');
}
function likeReview(productId, reviewId) { const review = reviews[productId]?.find(r => r.id === reviewId); if (review) { review.likes++; saveReviews(); renderReviews(productId); showToast('Спасибо за лайк! ❤️', 'info'); } }
function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, function(m) { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }
function openReviewForm() {
    if (!currentProduct) { showToast('Ошибка: товар не выбран', 'error'); return; }
    const modal = document.getElementById('reviewModal');
    const productNameSpan = document.getElementById('reviewProductName');
    if (productNameSpan) productNameSpan.innerHTML = `<i class="fas fa-box"></i> ${currentProduct.name}`;
    if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
    document.getElementById('reviewRating')?.setAttribute('data-rating', '0');
    const textarea = document.getElementById('reviewText');
    const userNameInput = document.getElementById('reviewUserName');
    if (textarea) textarea.value = '';
    if (userNameInput) userNameInput.value = '';
    updateRatingStars(0);
}
function closeReviewForm() {
    const modal = document.getElementById('reviewModal');
    if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
    const ratingInput = document.getElementById('reviewRating');
    if (ratingInput) ratingInput.setAttribute('data-rating', '0');
    const textarea = document.getElementById('reviewText');
    const userNameInput = document.getElementById('reviewUserName');
    if (textarea) textarea.value = '';
    if (userNameInput) userNameInput.value = '';
    updateRatingStars(0);
}
function updateRatingStars(rating) {
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, index) => { if (index < rating) { star.style.color = '#fbbf24'; star.classList.add('active'); } else { star.style.color = '#cbd5e1'; star.classList.remove('active'); } });
    const ratingInput = document.getElementById('reviewRating');
    if (ratingInput) ratingInput.setAttribute('data-rating', rating);
}
function submitReview() {
    if (!currentProduct) { showToast('Ошибка: товар не выбран', 'error'); return; }
    const ratingInput = document.getElementById('reviewRating');
    const rating = parseInt(ratingInput?.getAttribute('data-rating') || 0);
    const text = document.getElementById('reviewText')?.value.trim();
    const userName = document.getElementById('reviewUserName')?.value.trim() || 'Покупатель';
    if (rating === 0) { showToast('Пожалуйста, оцените товар ⭐', 'error'); return; }
    if (!text) { showToast('Пожалуйста, напишите отзыв 📝', 'error'); return; }
    addReview(currentProduct.id, rating, text, userName);
    closeReviewForm();
}

// ========= TELEGRAM БОТ =========
const TELEGRAM_BOT_TOKEN = '8265957442:AAFWnqXyl8TJJzZXsv3vxXRCuWwWd_aY9mE';
const TELEGRAM_CHAT_ID = '5282056467';

async function sendOrderToTelegram(order) {
    let message = `🛍️ <b>НОВЫЙ ЗАКАЗ!</b>\n\n`;
    message += `📋 <b>Информация о заказе:</b>\n├ Номер: <b>#${order.id}</b>\n├ Дата: ${order.date}\n└ Статус: <b>⏳ Ожидает обработки</b>\n\n`;
    message += `👤 <b>Клиент:</b>\n├ Имя: <b>${escapeHtml(order.customer.name)}</b>\n├ Телефон: <code>${order.customer.phone}</code>\n`;
    if (order.customer.email) message += `├ Email: ${order.customer.email}\n`;
    message += `└ Адрес: ${escapeHtml(order.customer.address)}\n\n`;
    message += `📦 <b>Товары:</b>\n`;
    order.items.forEach((item, index) => { const isLast = index === order.items.length - 1; const prefix = isLast ? '└' : '├'; message += `${prefix} ${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} ₽\n`; });
    message += `\n💰 <b>Итого:</b>\n├ Товары: ${order.totals.subtotal.toLocaleString()} ₽\n├ Доставка: ${order.totals.delivery === 0 ? 'Бесплатно' : order.totals.delivery.toLocaleString() + ' ₽'}\n└ <b>ИТОГО: ${order.totals.total.toLocaleString()} ₽</b>\n\n`;
    message += `🚚 Доставка: ${getDeliveryName(order.delivery.method)}\n💳 Оплата: ${getPaymentName(order.payment)}\n`;
    if (order.customer.comment) message += `\n💬 Комментарий: ${escapeHtml(order.customer.comment)}\n`;
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'HTML' })
        });
        const result = await response.json();
        console.log(result.ok ? '✅ Заказ отправлен в Telegram' : '❌ Ошибка Telegram:', result);
        return result.ok;
    } catch (error) { console.error('❌ Ошибка отправки в Telegram:', error); return false; }
}
function getDeliveryName(method) { const names = { 'courier': '🚚 Курьером (300₽)', 'pickup': '📦 Самовывоз (бесплатно)', 'post': '📮 Почта России (500₽)' }; return names[method] || method; }
function getPaymentName(method) { const names = { 'card': '💳 Картой онлайн', 'cash': '💰 Наличными курьеру', 'sbp': '🏦 СБП' }; return names[method] || method; }

// ========= ФОРМА ОФОРМЛЕНИЯ ЗАКАЗА =========
function openCheckoutModal() {
    if (cart.length === 0) { showToast('Корзина пуста, добавьте товары', 'error'); return; }
    const modal = document.getElementById('checkoutModal');
    if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; renderCheckoutItems(); updateCheckoutTotals(); const deliverySelect = document.getElementById('deliveryMethod'); if (deliverySelect) { deliverySelect.addEventListener('change', updateCheckoutTotals); } }
}
function closeCheckoutModal() { const modal = document.getElementById('checkoutModal'); if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; } }
function renderCheckoutItems() {
    const container = document.getElementById('checkoutItems');
    if (!container) return;
    if (cart.length === 0) { container.innerHTML = '<div style="text-align:center; padding:20px;">Корзина пуста</div>'; return; }
    container.innerHTML = cart.map(item => `<div class="checkout-item"><img src="${item.image}" class="checkout-item__image"><div class="checkout-item__info"><div class="checkout-item__title">${item.name}</div><div class="checkout-item__price">${item.price.toLocaleString()} ₽</div><div class="checkout-item__quantity">Кол-во: ${item.quantity}</div></div><div class="checkout-item__total"><strong>${(item.price * item.quantity).toLocaleString()} ₽</strong></div></div>`).join('');
}
function updateCheckoutTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryMethod = document.getElementById('deliveryMethod')?.value;
    let deliveryCost = 0;
    switch(deliveryMethod) { case 'courier': deliveryCost = 300; break; case 'post': deliveryCost = 500; break; default: deliveryCost = 0; }
    const total = subtotal + deliveryCost;
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const deliveryEl = document.getElementById('checkoutDelivery');
    const totalEl = document.getElementById('checkoutTotal');
    if (subtotalEl) subtotalEl.textContent = `${subtotal.toLocaleString()} ₽`;
    if (deliveryEl) deliveryEl.textContent = deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost.toLocaleString()} ₽`;
    if (totalEl) totalEl.textContent = `${total.toLocaleString()} ₽`;
}

async function submitOrder(event) {
    event.preventDefault();
    console.log('✅ submitOrder вызвана!');
    if (cart.length === 0) { showToast('Корзина пуста', 'error'); return; }
    const order = {
        id: Date.now(), date: new Date().toLocaleString('ru-RU'),
        customer: {
            name: document.getElementById('userName').value,
            phone: document.getElementById('userPhone').value,
            email: document.getElementById('userEmail').value,
            address: document.getElementById('userAddress').value,
            comment: document.getElementById('userComment').value
        },
        delivery: { method: document.getElementById('deliveryMethod').value, cost: 0 },
        payment: document.getElementById('paymentMethod').value,
        items: [...cart],
        totals: { subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), delivery: 0, total: 0 }
    };
    switch(order.delivery.method) { case 'courier': order.totals.delivery = 300; break; case 'post': order.totals.delivery = 500; break; default: order.totals.delivery = 0; }
    order.totals.total = order.totals.subtotal + order.totals.delivery;
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // ОТПРАВКА В TELEGRAM
    await sendOrderToTelegram(order);
    
    showOrderConfirmation(order);
    cart = [];
    saveCart();
    updateCartBadge();
    renderCartItems();
    closeCheckoutModal();
}

function showOrderConfirmation(order) {
    const total = order.totals.total.toLocaleString();
    const itemsList = order.items.map(item => `${item.name} x${item.quantity}`).join(', ');
    const confirmation = document.createElement('div');
    confirmation.className = 'order-confirmation';
    confirmation.innerHTML = `<div class="order-confirmation__content"><i class="fas fa-check-circle"></i><h3>Заказ оформлен! 🎉</h3><p>Номер заказа: <strong>#${order.id}</strong></p><p>Сумма: <strong>${total} ₽</strong></p><p>Товары: ${itemsList}</p><p>Детали заказа отправлены на ваш телефон</p><button onclick="this.parentElement.parentElement.remove()">Отлично!</button></div>`;
    document.body.appendChild(confirmation);
    setTimeout(() => { if (confirmation) confirmation.remove(); }, 5000);
}

// ========= ЗАПУСК =========
document.addEventListener('DOMContentLoaded', () => {

      checkUserSession();
    currentFilteredProducts = [...productsData];
    renderProducts(getCurrentPageProducts());
    updateCartBadge();
    updateWishlistBadge();
    renderCartItems();
    initFilters();
    initBurgerMenu();
    initMobileSearch();
    initScrollEffect();
    initWishlistButtons();
    updatePagination();
    initReviews();
    updateUserIcon();
   if (currentUser) { renderProfilePage(); }
    
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) cartIcon.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.addEventListener('change', (e) => sortProducts(e.target.value));
    const wishlistIcon = document.querySelector('.wishlist-icon');
    if (wishlistIcon) { wishlistIcon.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); showWishlistPage(); }); }
    document.querySelector('.cart-modal__overlay')?.addEventListener('click', closeCart);
    document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
    document.getElementById('clearCartBtn')?.addEventListener('click', clearCart);
    document.getElementById('checkoutBtn')?.addEventListener('click', () => openCheckoutModal());
    document.getElementById('closeProductModal')?.addEventListener('click', closeProductModal);
    document.querySelector('.product-modal__overlay')?.addEventListener('click', closeProductModal);
    document.getElementById('clearWishlistBtn')?.addEventListener('click', clearWishlist);
    
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    if (prevPageBtn) prevPageBtn.addEventListener('click', () => { if (currentPage > 1) goToPage(currentPage - 1); });
    if (nextPageBtn) nextPageBtn.addEventListener('click', () => { if (currentPage < totalPages) goToPage(currentPage + 1); });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { closeCart(); const mobileMenu = document.getElementById('mobileMenu'); if (mobileMenu?.classList.contains('open')) { mobileMenu.classList.remove('open'); document.getElementById('overlay')?.classList.remove('active'); document.body.style.overflow = ''; } if (document.getElementById('productModal')?.classList.contains('active')) closeProductModal(); }
    });
    
    document.querySelectorAll('.category-card').forEach(cat => {
        cat.addEventListener('click', () => {
            const name = cat.querySelector('h3')?.textContent || '';
            let val = '';
            if (name.includes('Электроника')) val = 'electronics';
            else if (name.includes('Одежда')) val = 'clothing';
            else if (name.includes('Обувь')) val = 'shoes';
            else if (name.includes('Красота')) val = 'beauty';
            if (val) { filters.categories = [val]; document.querySelectorAll('.category-filter').forEach(cb => cb.checked = cb.value === val); filterAndRender(); showToast(`Категория: ${name}`, 'success'); if (window.innerWidth <= 768) document.getElementById('filterPanel')?.classList.remove('open'); }
        });
    });


// ========= ПРОВЕРКА СЕССИИ ПРИ ЗАГРУЗКЕ =========
function checkUserSession() {
    // Проверяем есть ли сохранённый пользователь
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            // Обновляем иконку
            updateUserIcon();
            console.log('✅ Сессия восстановлена для:', currentUser.name);
        } catch(e) {
            console.error('Ошибка восстановления сессии:', e);
            localStorage.removeItem('currentUser');
            currentUser = null;
        }
    } else {
        currentUser = null;
        updateUserIcon();
    }
}

// Вызови эту функцию в самом начале DOMContentLoaded
checkUserSession();

});


// ========= ЛИЧНЫЙ КАБИНЕТ (РЕГИСТРАЦИЯ/ВХОД) =========
// ========= ЛИЧНЫЙ КАБИНЕТ (РЕГИСТРАЦИЯ/ВХОД) =========
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];

function saveUsers() { 
    localStorage.setItem('users', JSON.stringify(users)); 
}

function saveCurrentUser() { 
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        localStorage.removeItem('currentUser');
    }
}

function showAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) { 
        modal.classList.add('active'); 
        document.body.style.overflow = 'hidden'; 
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) { 
        modal.classList.remove('active'); 
        document.body.style.overflow = ''; 
    }
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('authTitle').textContent = 'Регистрация';
}

function showLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('authTitle').textContent = 'Вход в аккаунт';
}

function registerUser() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (!name || !email || !phone || !password) {
        showToast('Заполните все поля', 'error'); 
        return;
    }
    if (password !== confirmPassword) {
        showToast('Пароли не совпадают', 'error'); 
        return;
    }
    if (users.find(u => u.email === email)) {
        showToast('Пользователь с таким email уже существует', 'error'); 
        return;
    }
    
    const newUser = { 
        id: Date.now(), 
        name, 
        email, 
        phone, 
        password, 
        orders: [],
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers();
    showToast('Регистрация успешна! Теперь войдите', 'success');
    showLoginForm();
}

function loginUser() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        showToast('Неверный email или пароль', 'error'); 
        return;
    }
    
    // Сохраняем пользователя в localStorage
    currentUser = user;
    saveCurrentUser();
    
    showToast(`Добро пожаловать, ${user.name}!`, 'success');
    closeAuthModal();
    
    // Обновляем иконку в хедере
    updateUserIcon();
    
    // Если нужно показать профиль
    if (document.getElementById('profilePage') && document.getElementById('profilePage').style.display !== 'block') {
        // Не показываем профиль автоматически, просто логиним
    }
}

function logoutUser() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showToast('Вы вышли из аккаунта', 'info');
        
        // Прячем страницу профиля, если она открыта
        const profilePage = document.getElementById('profilePage');
        if (profilePage && profilePage.style.display === 'block') {
            hideProfilePage();
        }
        
        // Обновляем иконку в хедере
        updateUserIcon();
    }
}

function renderProfilePage() {
    if (!currentUser) {
        showToast('Сначала войдите в аккаунт', 'error');
        showAuthModal();
        return;
    }
    
    const profilePage = document.getElementById('profilePage');
    const mainContent = document.querySelector('main');
    const heroSection = document.querySelector('.hero');
    const categoriesSection = document.querySelector('.categories');
    const productsSection = document.querySelector('.products');
    
    if (profilePage) profilePage.style.display = 'block';
    if (mainContent) mainContent.style.display = 'none';
    if (heroSection) heroSection.style.display = 'none';
    if (categoriesSection) categoriesSection.style.display = 'none';
    if (productsSection) productsSection.style.display = 'none';
    
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profilePhone').textContent = currentUser.phone;
    
    // Загружаем заказы пользователя
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = allOrders.filter(order => order.customer?.email === currentUser.email);
    
    const ordersContainer = document.getElementById('profileOrdersList');
    if (userOrders.length === 0) {
        ordersContainer.innerHTML = '<div style="text-align:center; padding:40px;">📦 У вас пока нет заказов</div>';
        return;
    }
    
    ordersContainer.innerHTML = userOrders.map(order => `
        <div class="order-card">
            <div class="order-card__header">
                <span><strong>Заказ #${order.id}</strong></span>
                <span>${order.date}</span>
                <span class="order-card__status ${order.deliveryStatus === 'delivered' ? 'paid' : 'pending'}">
                    ${order.deliveryStatus === 'delivered' ? '✅ Доставлен' : getStatusText(order.deliveryStatus)}
                </span>
            </div>
            <div class="order-card__items">
                Товары: ${order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
            </div>
            <div class="order-card__total">Сумма: ${order.totals?.total || order.items.reduce((s,i)=>s+i.price*i.quantity,0)} ₽</div>
            <button class="order-card__track-btn" onclick="trackOrderByNumber(${order.id})">
                <i class="fas fa-truck"></i> Отследить
            </button>
        </div>
    `).join('');
}

function getStatusText(status) {
    const statuses = {
        'pending': '⏳ Ожидает',
        'processing': '📦 На складе в Китае',
        'customs': '🛃 Таможня',
        'in_transit': '✈️ В пути',
        'in_tajikistan': '🇹🇯 В Таджикистане',
        'delivered': '✅ Доставлен'
    };
    return statuses[status] || '⏳ Ожидает';
}

function trackOrderByNumber(orderId) {
    document.getElementById('trackingNumber').value = orderId;
    trackOrder();
    // Прокручиваем к отслеживанию
    document.querySelector('.tracking-section')?.scrollIntoView({ behavior: 'smooth' });
}

function hideProfilePage() {
    const profilePage = document.getElementById('profilePage');
    const mainContent = document.querySelector('main');
    const heroSection = document.querySelector('.hero');
    const categoriesSection = document.querySelector('.categories');
    const productsSection = document.querySelector('.products');
    
    if (profilePage) profilePage.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    if (heroSection) heroSection.style.display = 'block';
    if (categoriesSection) categoriesSection.style.display = 'block';
    if (productsSection) productsSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showWishlistPage() { 
    renderWishlistPage(); 
}

function updateUserIcon() {
    const userIcon = document.querySelector('.header__action-icon:not(.cart-icon):not(.wishlist-icon)');
    if (userIcon) {
        if (currentUser) {
            userIcon.innerHTML = '<i class="fas fa-user-check"></i>';
            userIcon.onclick = () => renderProfilePage();
            userIcon.title = currentUser.name;
        } else {
            userIcon.innerHTML = '<i class="far fa-user"></i>';
            userIcon.onclick = () => showAuthModal();
            userIcon.title = 'Войти';
        }
    }
}


// Обновляем submitOrder, чтобы привязывать заказ к пользователю
const originalSubmitOrderAuth = submitOrder;
window.submitOrder = async function(event) {
    event.preventDefault();
    if (cart.length === 0) { showToast('Корзина пуста', 'error'); return; }
    
    const order = {
        id: Date.now(),
        date: new Date().toLocaleString('ru-RU'),
        customer: {
            name: document.getElementById('userName').value,
            phone: document.getElementById('userPhone').value,
            email: document.getElementById('userEmail').value,
            address: document.getElementById('userAddress').value,
            comment: document.getElementById('userComment').value
        },
        delivery: { method: document.getElementById('deliveryMethod').value },
        payment: document.getElementById('paymentMethod').value,
        items: [...cart],
        totals: {
            subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            delivery: 0,
            total: 0
        },
        status: 'pending'
    };
    
    switch(order.delivery.method) {
        case 'courier': order.totals.delivery = 300; break;
        case 'post': order.totals.delivery = 500; break;
        default: order.totals.delivery = 0;
    }
    order.totals.total = order.totals.subtotal + order.totals.delivery;
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Если пользователь авторизован, добавляем заказ в его историю
    if (currentUser) {
        const usersList = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = usersList.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            if (!usersList[userIndex].orders) usersList[userIndex].orders = [];
            usersList[userIndex].orders.push(order);
            currentUser = usersList[userIndex];
            localStorage.setItem('users', JSON.stringify(usersList));
            saveCurrentUser();
        }
    }
    
    await sendOrderToTelegram(order);
    showOrderConfirmation(order);
    cart = [];
    saveCart();
    updateCartBadge();
    renderCartItems();
    closeCheckoutModal();

    // ========= ВОССТАНОВЛЕНИЕ ПАРОЛЯ =========
function forgotPassword() {
    const email = prompt('Введите ваш Email для восстановления пароля:');
    if (!email) return;
    
    const user = users.find(u => u.email === email);
    if (!user) {
        showToast('Пользователь с таким Email не найден', 'error');
        return;
    }
    
    // В реальном проекте здесь отправка письма на почту
    // Сейчас просто показываем пароль (для теста)
    showToast(`Ваш пароль: ${user.password} (запишите его)`, 'info');
}

// Очистить историю заказов пользователя
function clearUserOrders() {
    if (!currentUser) {
        showToast('Вы не авторизованы', 'error');
        return;
    }
    
    if (!confirm('Вы уверены, что хотите очистить всю историю заказов? Это действие нельзя отменить!')) {
        return;
    }
    
    // Очищаем заказы текущего пользователя
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const otherUsersOrders = allOrders.filter(order => order.customer?.email !== currentUser.email);
    localStorage.setItem('orders', JSON.stringify(otherUsersOrders));
    
    // Очищаем в массиве пользователей
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].orders = [];
        currentUser.orders = [];
        localStorage.setItem('users', JSON.stringify(users));
        saveCurrentUser();
    }
    
    showToast('История заказов очищена', 'success');
    renderProfilePage(); // Обновляем страницу
}

// Очистить ВСЕХ пользователей (только для админа)
function clearAllUsers() {
    if (!confirm('⚠️ ВНИМАНИЕ! Это удалит ВСЕХ пользователей и ВСЕ заказы. Продолжить?')) {
        return;
    }
    
    localStorage.removeItem('users');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('orders');
    
    users = [];
    currentUser = null;
    
    showToast('Все пользователи и заказы удалены', 'info');
    location.reload(); // Перезагружаем страницу
}
};

// ========= СЕКРЕТНАЯ АДМИН-ПАНЕЛЬ =========
function initAdminPanel() {
    const logo = document.querySelector('.header__logo');
    if (!logo) return;
    
    let clickCount = 0;
    let timer;
    
    logo.addEventListener('dblclick', () => {
        const adminExists = document.querySelector('.admin-panel');
        if (adminExists) {
            adminExists.remove();
            return;
        }
        
        const panel = document.createElement('div');
        panel.className = 'admin-panel';
        panel.innerHTML = `
            <button onclick="clearAllUsers()" style="background:#ef4444;">
                <i class="fas fa-database"></i> Удалить всех пользователей
            </button>
            <button onclick="alert('Всего пользователей: ' + (JSON.parse(localStorage.getItem('users')) || []).length)" style="background:#3b82f6; margin-left:10px;">
                <i class="fas fa-users"></i> Статистика
            </button>
        `;
        document.body.appendChild(panel);
        
        setTimeout(() => {
            if (panel) panel.remove();
        }, 5000);
    });
}

// Вызови эту функцию в инициализации
// initAdminPanel(); - добавить в DOMContentLoaded или в конец файла




// ========= ГЛОБАЛЬНЫЕ ФУНКЦИИ =========
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.openCart = openCart;
window.closeCart = closeCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.sortProducts = sortProducts;
window.goToPage = goToPage;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.changeMainImage = changeMainImage;
window.changeQuantity = changeQuantity;
window.addToCartFromDetail = addToCartFromDetail;
window.buyNow = buyNow;
window.removeFromWishlist = removeFromWishlist;
window.hideWishlistPage = hideWishlistPage;
window.showWishlistPage = showWishlistPage;
window.clearWishlist = clearWishlist;
window.addReview = addReview;
window.likeReview = likeReview;
window.openReviewForm = openReviewForm;
window.closeReviewForm = closeReviewForm;
window.updateRatingStars = updateRatingStars;
window.initReviews = initReviews;
window.submitReview = submitReview;
window.renderReviews = renderReviews;
window.generateStarRating = generateStarRating;
window.submitOrder = submitOrder;
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.showAuthModal = showAuthModal;
window.closeAuthModal = closeAuthModal;
window.showRegisterForm = showRegisterForm;
window.showLoginForm = showLoginForm;
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.renderProfilePage = renderProfilePage;
window.hideProfilePage = hideProfilePage;
window.clearAllData = clearAllData;
window.trackOrder = trackOrder;
window.setOrderStatus = setOrderStatus;
window.sendDeliveryNotification = sendDeliveryNotification;
window.checkAndSendDeliveryNotification = checkAndSendDeliveryNotification;
window.goToHomePage = goToHomePage;
window.openAdminPanel = openAdminPanel;
window.closeAdminPanel = closeAdminPanel;
window.updateOrderStatus = updateOrderStatus;
window.deleteUser = deleteUser;
window.deleteProduct = deleteProduct;
window.showAddProductForm = showAddProductForm;
window.closeProductForm = closeProductForm;
window.addNewProduct = addNewProduct;
window.sendMessage = sendMessage;
window.addEmoji = addEmoji;

// ========= ОЧИСТКА ВСЕХ ДАННЫХ (для тестирования) =========
function clearAllData() {
    if (confirm('⚠️ Удалить ВСЕХ пользователей и ВСЕ заказы?')) {
        localStorage.removeItem('users');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('orders');
        localStorage.removeItem('cart');
        localStorage.removeItem('wishlist');
        localStorage.removeItem('reviews');
        showToast('Все данные удалены. Обновите страницу!', 'info');
        setTimeout(() => location.reload(), 1500);
    }
}

if (currentUser) {
    renderProfilePage();
}
updateUserIcon();


// ========= PWA: РЕГИСТРАЦИЯ SERVICE WORKER =========
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/Shopxand/sw.js')
            .then(registration => {
                console.log('✅ Service Worker зарегистрирован:', registration);
            })
            .catch(error => {
                console.log('❌ Ошибка регистрации Service Worker:', error);
            });
    });
}

// Проверка, можно ли установить PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Показываем кнопку "Установить приложение" (опционально)
    const installBtn = document.createElement('button');
    installBtn.textContent = '📱 Установить приложение';
    installBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#3b82f6;color:white;border:none;padding:12px 20px;border-radius:50px;z-index:9999;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.2);';
    installBtn.onclick = () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Пользователь установил приложение');
            }
            installBtn.remove();
            deferredPrompt = null;
        });
    };
    setTimeout(() => {
        if (installBtn.parentNode) installBtn.remove();
    }, 10000);
    document.body.appendChild(installBtn);
});

// ========= PWA: РЕГИСТРАЦИЯ SERVICE WORKER =========
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/Shopxand/sw.js')
            .then(reg => console.log('✅ SW зарегистрирован:', reg))
            .catch(err => console.log('❌ SW ошибка:', err));
    });
}


// ========= ОТСЛЕЖИВАНИЕ ДОСТАВКИ =========
function trackOrder() {
    const trackingNumber = document.getElementById('trackingNumber').value.trim();
    if (!trackingNumber) {
        showToast('Введите номер заказа', 'error');
        return;
    }
    
    // Извлекаем номер заказа (убираем # если есть)
    const orderId = parseInt(trackingNumber.replace('#', ''));
    if (isNaN(orderId)) {
        showToast('Неверный формат номера', 'error');
        return;
    }
    
    // Показываем анимацию загрузки
    const resultDiv = document.getElementById('trackingResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div class="tracking-loading">
            <div class="spinner"></div>
            <p>Поиск заказа...</p>
        </div>
    `;
    
    // Имитируем задержку (можно убрать)
    setTimeout(() => {
        // Ищем заказ в localStorage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
            resultDiv.innerHTML = `
                <div class="tracking-error">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <h3>Заказ не найден</h3>
                    <p>Проверьте номер заказа и попробуйте снова</p>
                </div>
            `;
            return;
        }
        
        // Генерируем статус доставки
        const trackingData = generateTrackingData(order);
        displayTrackingResult(trackingData);
    }, 800);
}

function generateTrackingData(order) {
    // Получаем дату заказа из order.date
    let orderDate;
    if (order.date) {
        // Парсим дату из формата "02.05.2026, 12:52:52"
        const dateParts = order.date.split(',')[0].split('.');
        if (dateParts.length === 3) {
            orderDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
        } else {
            orderDate = new Date(order.date);
        }
    } else {
        orderDate = new Date();
    }
    
    const today = new Date();
    
    // Рассчитываем этапы на основе ДАТЫ ЗАКАЗА (не текущей даты)
    const day0 = new Date(orderDate);
    const day2 = addDaysReal(day0, 2);
    const day5 = addDaysReal(day0, 5);
    const day8 = addDaysReal(day0, 8);
    const day12 = addDaysReal(day0, 12);
    const day18 = addDaysReal(day0, 18);
    
    // Определяем текущий этап на основе СРАВНЕНИЯ с датой заказа
    let currentStatus = 'pending';
    let currentStepIndex = 0;
    
    if (today >= day18) {
        currentStatus = 'delivered';
        currentStepIndex = 5;
    } else if (today >= day12) {
        currentStatus = 'in_tajikistan';
        currentStepIndex = 4;
    } else if (today >= day8) {
        currentStatus = 'in_transit';
        currentStepIndex = 3;
    } else if (today >= day5) {
        currentStatus = 'customs';
        currentStepIndex = 2;
    } else if (today >= day2) {
        currentStatus = 'processing';
        currentStepIndex = 1;
    } else {
        currentStatus = 'pending';
        currentStepIndex = 0;
    }
    
    // Шаги доставки с ВОЗМОЖНЫМИ датами (не показываем будущие даты)
    const steps = [
        { 
            status: 'pending', 
            title: 'Заказ оформлен', 
            subtitle: 'Ожидание подтверждения',
            icon: 'fas fa-clipboard-list',
            date: formatDate(day0),
            isCompleted: currentStepIndex >= 0
        },
        { 
            status: 'processing', 
            title: 'На складе в Китае', 
            subtitle: 'Комплектация заказа',
            icon: 'fas fa-boxes',
            date: formatDate(day2),
            isCompleted: currentStepIndex >= 1
        },
        { 
            status: 'customs', 
            title: 'Таможенное оформление', 
            subtitle: 'Прохождение границы КНР',
            icon: 'fas fa-passport',
            date: formatDate(day5),
            isCompleted: currentStepIndex >= 2
        },
        { 
            status: 'in_transit', 
            title: 'Авиаперевозка', 
            subtitle: 'В пути из Китая',
            icon: 'fas fa-plane',
            date: formatDate(day8),
            isCompleted: currentStepIndex >= 3
        },
        { 
            status: 'in_tajikistan', 
            title: 'Прибыл в Таджикистан', 
            subtitle: 'Таможня Душанбе',
            icon: 'fas fa-flag-checkered',
            date: formatDate(day12),
            isCompleted: currentStepIndex >= 4
        },
        { 
            status: 'delivered', 
            title: 'Доставлен', 
            subtitle: 'Получен получателем',
            icon: 'fas fa-home',
            date: formatDate(day18),
            isCompleted: currentStepIndex >= 5
        }
    ];
    
    // История — только выполненные шаги
    const history = [];
    for (let i = 0; i <= currentStepIndex; i++) {
        if (steps[i]) {
            history.push({
                date: steps[i].date,
                text: steps[i].title,
                description: steps[i].subtitle,
                status: steps[i].status
            });
        }
    }
    
    // Обратный отсчёт (если не доставлен)
    let daysLeft = null;
    if (currentStatus !== 'delivered') {
        const timeDiff = day18 - today;
        daysLeft = Math.max(0, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
    }
    
    // Статус для отображения
    const statusNames = {
        pending: { text: 'Ожидает обработки', class: 'status-pending', icon: '⏳' },
        processing: { text: 'На складе в Китае', class: 'status-processing', icon: '📦' },
        customs: { text: 'Таможня Китая', class: 'status-processing', icon: '🛃' },
        in_transit: { text: 'В пути из Китая', class: 'status-shipped', icon: '✈️' },
        in_tajikistan: { text: 'В Таджикистане', class: 'status-shipped', icon: '🇹🇯' },
        delivered: { text: 'Доставлен', class: 'status-delivered', icon: '✅' }
    };
    
    return {
        order: order,
        status: currentStatus,
        statusText: statusNames[currentStatus]?.text || 'В обработке',
        statusClass: statusNames[currentStatus]?.class || 'status-pending',
        statusIcon: statusNames[currentStatus]?.icon || '⏳',
        steps: steps,
        currentStep: currentStepIndex,
        history: history,
        daysLeft: daysLeft,
        estimatedDate: formatDate(day18)
    };
}

// Обновляем displayTrackingResult для правильного отображения прогресса
function displayTrackingResult(data) {
    const resultDiv = document.getElementById('trackingResult');
    
    // Определяем какой шаг сейчас активный
    const activeStepIndex = data.currentStep;
    
    resultDiv.innerHTML = `
        <div class="tracking-card">
            <div class="tracking-header">
                <div class="tracking-order-id">
                    <i class="fas fa-hashtag"></i> Заказ #${data.order.id}
                </div>
                <div class="tracking-status ${data.statusClass}">
                    <i class="${data.status === 'delivered' ? 'fas fa-check-circle' : 'fas fa-spinner fa-pulse'}"></i>
                    ${data.statusText}
                </div>
            </div>
            
            ${data.daysLeft !== null && data.daysLeft > 0 && data.status !== 'delivered' ? `
            <div class="tracking-countdown">
                <div class="countdown-icon"><i class="fas fa-calendar-day"></i></div>
                <div class="countdown-text">
                    <span class="countdown-days">${data.daysLeft}</span>
                    <span class="countdown-label">${getDaysWord(data.daysLeft)} до доставки</span>
                </div>
                <div class="countdown-date">Ожидается: ${data.estimatedDate}</div>
            </div>
            ` : data.status === 'delivered' ? `
            <div class="tracking-delivered-badge">
                <i class="fas fa-trophy"></i> Заказ доставлен! 🎉
            </div>
            ` : ''}
            
            <div class="tracking-steps">
                ${data.steps.map((step, idx) => `
                    <div class="step 
                        ${idx < activeStepIndex ? 'completed' : ''} 
                        ${idx === activeStepIndex ? 'active' : ''}
                        ${idx > activeStepIndex && step.isCompleted ? '' : ''}
                    ">
                        <div class="step-icon">
                            ${idx < activeStepIndex ? '<i class="fas fa-check"></i>' : `<i class="${step.icon}"></i>`}
                        </div>
                        <div class="step-title">${step.title}</div>
                        <div class="step-subtitle">${step.subtitle || ''}</div>
                        <div class="step-date">${step.date || '—'}</div>
                        ${idx === activeStepIndex && data.daysLeft !== null && data.status !== 'delivered' ? `<div class="step-progress">Осталось ${data.daysLeft} дней</div>` : ''}
                    </div>
                `).join('')}
            </div>
            
            <div class="tracking-details">
                <div class="detail-row">
                    <span class="detail-label">Дата заказа:</span>
                    <span class="detail-value">${data.order.date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Сумма:</span>
                    <span class="detail-value">${data.order.totals?.total || data.order.items.reduce((s,i)=>s+i.price*i.quantity,0)} ₽</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Способ доставки:</span>
                    <span class="detail-value">✈️ Авиадоставка из Китая (14-18 дней)</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Адрес:</span>
                    <span class="detail-value">${data.order.customer?.address || 'Не указан'}</span>
                </div>
            </div>
            
            <div class="tracking-history">
                <h4>📋 История обновлений</h4>
                ${data.history.map(h => `
                    <div class="history-item">
                        <div class="history-date">${h.date}</div>
                        <div class="history-content">
                            <div class="history-text">
                                <i class="fas ${h.status === 'delivered' ? 'fa-check-circle' : 'fa-clock'}" style="color: #3b82f6; margin-right: 8px;"></i>
                                ${h.text}
                            </div>
                            <div class="history-desc">${h.description}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="tracking-support">
                <i class="fas fa-headset"></i> 
                Вопросы по доставке из Китая? Свяжитесь: +992 XX XXX XX XX
            </div>
        </div>
    `;
}

// Функция для обновления статуса заказа в хранилище
function updateOrderStatusInStorage(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].deliveryStatus = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}

// Функция для ручного обновления статуса (для админа)
function setOrderStatus(orderId, newStatus) {
    const validStatuses = ['pending', 'processing', 'customs', 'in_transit', 'in_tajikistan', 'delivered'];
    if (!validStatuses.includes(newStatus)) {
        showToast('Неверный статус', 'error');
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].deliveryStatus = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        showToast(`Статус заказа #${orderId} обновлён на "${newStatus}"`, 'success');
        
        // Если сейчас открыто отслеживание этого заказа — обновляем
        const trackingInput = document.getElementById('trackingNumber');
        if (trackingInput && trackingInput.value == orderId) {
            trackOrder();
        }
    } else {
        showToast(`Заказ #${orderId} не найден`, 'error');
    }
}


// Вспомогательная функция для добавления дней
function addDaysReal(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Форматирование даты
function formatDate(date) {
    if (!date) return '—';
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Обновляем displayTrackingResult для отображения дней до доставки
function displayTrackingResult(data) {
    const resultDiv = document.getElementById('trackingResult');
    
    resultDiv.innerHTML = `
        <div class="tracking-card">
            <div class="tracking-header">
                <div class="tracking-order-id">
                    <i class="fas fa-hashtag"></i> Заказ #${data.order.id}
                </div>
                <div class="tracking-status ${data.statusClass}">
                    <i class="${data.status === 'delivered' ? 'fas fa-check-circle' : (data.status === 'in_transit' ? 'fas fa-plane fa-fw' : 'fas fa-spinner fa-pulse')}"></i>
                    ${data.statusText}
                </div>
            </div>
            
            ${data.daysLeft !== null ? `
            <div class="tracking-countdown">
                <div class="countdown-icon">
                    <i class="fas fa-calendar-day"></i>
                </div>
                <div class="countdown-text">
                    <span class="countdown-days">${data.daysLeft}</span>
                    <span class="countdown-label">${getDaysWord(data.daysLeft)} до доставки</span>
                </div>
                <div class="countdown-date">
                    Ожидается: ${data.estimatedDate}
                </div>
            </div>
            ` : `
            <div class="tracking-delivered-badge">
                <i class="fas fa-trophy"></i> Заказ доставлен!
            </div>
            `}
            
            <div class="tracking-steps">
                ${data.steps.map((step, idx) => `
                    <div class="step ${idx <= data.currentStep ? (idx < data.currentStep ? 'completed' : 'active') : ''}">
                        <div class="step-icon">
                            <i class="${step.icon}"></i>
                        </div>
                        <div class="step-title">${step.title}</div>
                        <div class="step-subtitle">${step.subtitle || ''}</div>
                        <div class="step-date">${step.date || '—'}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="tracking-details">
                <div class="detail-row">
                    <span class="detail-label">Дата заказа:</span>
                    <span class="detail-value">${data.order.date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Сумма:</span>
                    <span class="detail-value">${data.order.totals?.total || data.order.items.reduce((s,i)=>s+i.price*i.quantity,0)} ₽</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Способ доставки:</span>
                    <span class="detail-value">🚚 Авиадоставка из Китая (18 дней)</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Адрес:</span>
                    <span class="detail-value">${data.order.customer?.address || 'Не указан'}</span>
                </div>
            </div>
            
            <div class="tracking-history">
                <h4 style="margin-bottom: 16px;">📋 История обновлений</h4>
                ${data.history.map(h => `
                    <div class="history-item">
                        <div class="history-date">${h.date}</div>
                        <div class="history-content">
                            <div class="history-text">
                                <i class="fas ${h.status === 'delivered' ? 'fa-check-circle' : (h.status === 'in_transit' ? 'fa-plane' : 'fa-clock')}" style="color: #3b82f6; margin-right: 8px;"></i>
                                ${h.text}
                            </div>
                            <div class="history-desc">${h.description || ''}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="tracking-support">
                <i class="fas fa-headset"></i> 
                Есть вопросы по доставке из Китая? Свяжитесь с нами: +992 XX XXX XX XX
                <div class="support-note">Обычно доставка занимает 14-18 дней</div>
            </div>
        </div>
    `;
}

function getDaysWord(days) {
    if (days >= 11 && days <= 19) return 'дней';
    const lastDigit = days % 10;
    if (lastDigit === 1) return 'день';
    if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
    return 'дней';
   
    
    // Обрезаем шаги в зависимости от статуса
    let currentStepIndex;
    switch(randomStatus) {
        case 'pending': currentStepIndex = 0; break;
        case 'processing': currentStepIndex = 1; break;
        case 'shipped': currentStepIndex = 2; break;
        default: currentStepIndex = 3;
    }
    
    const currentSteps = steps.slice(0, currentStepIndex + 1);
    for (let i = currentStepIndex + 1; i < steps.length; i++) {
        steps[i].date = null;
    }
    
    // История обновлений
    const history = [];
    for (let i = 0; i <= currentStepIndex; i++) {
        if (steps[i].date) {
            history.push({
                date: steps[i].date,
                text: steps[i].title,
                status: steps[i].status
            });
        }
    }
    
    // Статус для отображения
    const statusNames = {
        pending: { text: 'Ожидает обработки', class: 'status-pending', icon: '⏳' },
        processing: { text: 'В обработке', class: 'status-processing', icon: '🔄' },
        shipped: { text: 'В пути', class: 'status-shipped', icon: '🚚' },
        delivered: { text: 'Доставлен', class: 'status-delivered', icon: '✅' }
    };
    
    return {
        order: order,
        status: randomStatus,
        statusText: statusNames[randomStatus].text,
        statusClass: statusNames[randomStatus].class,
        statusIcon: statusNames[randomStatus].icon,
        steps: steps,
        currentStep: currentStepIndex,
        history: history
    };
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toLocaleDateString('ru-RU');
}

function displayTrackingResult(data) {
    const resultDiv = document.getElementById('trackingResult');
    
    resultDiv.innerHTML = `
        <div class="tracking-card">
            <div class="tracking-header">
                <div class="tracking-order-id">
                    <i class="fas fa-hashtag"></i> Заказ #${data.order.id}
                </div>
                <div class="tracking-status ${data.statusClass}">
                    <i class="${data.status === 'delivered' ? 'fas fa-check-circle' : 'fas fa-spinner fa-pulse'}"></i>
                    ${data.statusText}
                </div>
            </div>
            
            <div class="tracking-steps">
                ${data.steps.map((step, idx) => `
                    <div class="step ${idx <= data.currentStep ? (idx < data.currentStep ? 'completed' : 'active') : ''}">
                        <div class="step-icon">
                            <i class="${step.icon}"></i>
                        </div>
                        <div class="step-title">${step.title}</div>
                        <div class="step-date">${step.date || '—'}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="tracking-details">
                <div class="detail-row">
                    <span class="detail-label">Дата заказа:</span>
                    <span class="detail-value">${data.order.date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Сумма:</span>
                    <span class="detail-value">${data.order.totals?.total || data.order.items.reduce((s,i)=>s+i.price*i.quantity,0)} ₽</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Способ доставки:</span>
                    <span class="detail-value">${getDeliveryName(data.order.delivery?.method)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Адрес:</span>
                    <span class="detail-value">${data.order.customer?.address || 'Не указан'}</span>
                </div>
            </div>
            
            <div class="tracking-history">
                <h4 style="margin-bottom: 16px;">История обновлений</h4>
                ${data.history.map(h => `
                    <div class="history-item">
                        <div class="history-date">${h.date}</div>
                        <div class="history-text">
                            <i class="fas ${h.status === 'delivered' ? 'fa-check-circle' : (h.status === 'shipped' ? 'fa-truck' : 'fa-clock')}" style="color: #3b82f6; margin-right: 8px;"></i>
                            ${h.text}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 13px; color: #94a3b8;">
                <i class="fas fa-headset"></i> Есть вопросы? Свяжитесь с нами: +992 XX XXX XX XX
            </div>
        </div>
    `;
    
    // Добавляем анимацию
    resultDiv.style.animation = 'none';
    resultDiv.offsetHeight; // reflow
    resultDiv.style.animation = 'slideUp 0.4s ease';
}

// Дополнительная функция для обновления статусов заказов (админская)
function updateOrderStatus(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].deliveryStatus = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        showToast(`Статус заказа #${orderId} обновлён`, 'success');
    }
}


// ========= УВЕДОМЛЕНИЕ В TELEGRAM О ДОСТАВКЕ =========
async function sendDeliveryNotification(order) {
    // Формируем красивое сообщение о доставке
    let message = `✅ <b>ЗАКАЗ ДОСТАВЛЕН!</b>\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🎉 <b>Ваш заказ успешно доставлен!</b>\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `📋 <b>Детали заказа:</b>\n`;
    message += `├ Номер: <b>#${order.id}</b>\n`;
    message += `├ Дата заказа: ${order.date}\n`;
    message += `├ Дата доставки: ${new Date().toLocaleString('ru-RU')}\n`;
    message += `└ Статус: <b>✅ ПОЛУЧЕН</b>\n\n`;
    
    message += `👤 <b>Получатель:</b>\n`;
    message += `├ Имя: <b>${escapeHtml(order.customer?.name)}</b>\n`;
    message += `├ Телефон: <code>${order.customer?.phone}</code>\n`;
    if (order.customer?.email) message += `├ Email: ${order.customer.email}\n`;
    message += `└ Адрес: ${escapeHtml(order.customer?.address)}\n\n`;
    
    message += `📦 <b>Состав заказа:</b>\n`;
    order.items.forEach((item, index) => {
        const isLast = index === order.items.length - 1;
        const prefix = isLast ? '└' : '├';
        message += `${prefix} ${item.name} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} ₽\n`;
    });
    
    message += `\n💰 <b>Финансы:</b>\n`;
    message += `├ Сумма товаров: ${order.totals.subtotal.toLocaleString()} ₽\n`;
    message += `├ Доставка: ${order.totals.delivery === 0 ? 'Бесплатно' : order.totals.delivery.toLocaleString() + ' ₽'}\n`;
    message += `└ <b>ИТОГО: ${order.totals.total.toLocaleString()} ₽</b>\n\n`;
    
    message += `🚚 <b>Способ доставки:</b> ${getDeliveryName(order.delivery?.method)}\n`;
    message += `💳 <b>Оплата:</b> ${getPaymentName(order.payment)}\n\n`;
    
    message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `🙏 <b>Спасибо за покупку!</b>\n`;
    message += `⭐ Оставьте отзыв о товаре на нашем сайте\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📱 <i>Магазин ShopXand — доставка из Китая за 18 дней</i>`;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        const result = await response.json();
        if (result.ok) {
            console.log('✅ Уведомление о доставке отправлено в Telegram');
            return true;
        } else {
            console.error('❌ Ошибка отправки уведомления:', result);
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка:', error);
        return false;
    }
}

// Функция для проверки и отправки уведомлений о доставке (вызывать при обновлении статуса)
async function checkAndSendDeliveryNotification(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (order && newStatus === 'delivered' && order.deliveryNotified !== true) {
        // Отправляем уведомление
        await sendDeliveryNotification(order);
        
        // Отмечаем, что уведомление отправлено
        order.deliveryNotified = true;
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}

// Обновляем функцию setOrderStatus (добавляем отправку уведомления)
window.setOrderStatus = async function(orderId, newStatus) {
    const validStatuses = ['pending', 'processing', 'customs', 'in_transit', 'in_tajikistan', 'delivered'];
    if (!validStatuses.includes(newStatus)) {
        showToast('Неверный статус', 'error');
        return false;
    }
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        const oldStatus = orders[orderIndex].deliveryStatus;
        orders[orderIndex].deliveryStatus = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        
        showToast(`Статус заказа #${orderId} обновлён на "${newStatus}"`, 'success');
        
        // Если новый статус "Доставлен" - отправляем уведомление
        if (newStatus === 'delivered' && oldStatus !== 'delivered') {
            await checkAndSendDeliveryNotification(orderId, newStatus);
            showToast('✅ Уведомление о доставке отправлено в Telegram', 'success');
        }
        
        // Если открыто отслеживание этого заказа - обновляем
        const trackingInput = document.getElementById('trackingNumber');
        if (trackingInput && trackingInput.value == orderId) {
            trackOrder();
        }
        return true;
    } else {
        showToast(`Заказ #${orderId} не найден`, 'error');
        return false;
    }
};

// Функция для возврата на главную без выхода
function goToHomePage() {
    const profilePage = document.getElementById('profilePage');
    const mainContent = document.querySelector('main');
    const heroSection = document.querySelector('.hero');
    const categoriesSection = document.querySelector('.categories');
    const productsSection = document.querySelector('.products');
    const footer = document.querySelector('.footer');
    
    // Скрываем профиль
    if (profilePage) profilePage.style.display = 'none';
    
    // Показываем основной контент
    if (mainContent) mainContent.style.display = 'block';
    if (heroSection) heroSection.style.display = 'block';
    if (categoriesSection) categoriesSection.style.display = 'block';
    if (productsSection) productsSection.style.display = 'block';
    if (footer) footer.style.display = 'block';
    
    // Плавный скролл к началу
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Обновляем иконку пользователя (она остаётся)
    updateUserIcon();
}

// ========= АДМИН-ПАНЕЛЬ =========
let adminLoggedIn = false;
const ADMIN_PASSWORD = 'admin123'; // Пароль для входа в админку

function openAdminPanel() {
    if (!adminLoggedIn) {
        const password = prompt('🔐 Введите пароль администратора:');
        if (password === ADMIN_PASSWORD) {
            adminLoggedIn = true;
            showAdminPanel();
        } else if (password !== null) {
            showToast('Неверный пароль!', 'error');
        }
        return;
    }
    showAdminPanel();
}

function showAdminPanel() {
    document.getElementById('adminOverlay').style.display = 'flex';
    loadAdminStats();
    loadAdminOrders();
    loadAdminUsers();
    loadAdminProducts();
}

function closeAdminPanel() {
    document.getElementById('adminOverlay').style.display = 'none';
}

function loadAdminStats() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const products = productsData;
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);
    const totalUsers = users.length;
    const totalProducts = products.length;
    
    document.getElementById('statsGrid').innerHTML = `
        <div class="stat-card"><i class="fas fa-shopping-cart"></i><div class="stat-value">${totalOrders}</div><div class="stat-label">Всего заказов</div></div>
        <div class="stat-card"><i class="fas fa-tenge"></i><div class="stat-value">${totalRevenue.toLocaleString()} ₽</div><div class="stat-label">Выручка</div></div>
        <div class="stat-card"><i class="fas fa-users"></i><div class="stat-value">${totalUsers}</div><div class="stat-label">Пользователей</div></div>
        <div class="stat-card"><i class="fas fa-boxes"></i><div class="stat-value">${totalProducts}</div><div class="stat-label">Товаров</div></div>
    `;
}

function loadAdminOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const container = document.getElementById('adminOrdersList');
    
    container.innerHTML = orders.map(order => `
        <div class="admin-order-card">
            <div class="admin-order-info">
                <div class="admin-order-id">Заказ #${order.id}</div>
                <div class="admin-order-customer">${order.customer?.name || 'Неизвестно'} | ${order.customer?.phone || '—'}</div>
                <div>Сумма: ${(order.totals?.total || order.items.reduce((s,i)=>s+i.price*i.quantity,0)).toLocaleString()} ₽</div>
            </div>
            <div class="admin-order-status ${order.deliveryStatus || 'pending'}">
                ${getStatusText(order.deliveryStatus)}
            </div>
            <div class="admin-order-actions">
                <select onchange="updateOrderStatus(${order.id}, this.value)">
                    <option value="pending" ${order.deliveryStatus === 'pending' ? 'selected' : ''}>⏳ Ожидает</option>
                    <option value="processing" ${order.deliveryStatus === 'processing' ? 'selected' : ''}>📦 На складе в Китае</option>
                    <option value="customs" ${order.deliveryStatus === 'customs' ? 'selected' : ''}>🛃 Таможня</option>
                    <option value="in_transit" ${order.deliveryStatus === 'in_transit' ? 'selected' : ''}>✈️ В пути</option>
                    <option value="in_tajikistan" ${order.deliveryStatus === 'in_tajikistan' ? 'selected' : ''}>🇹🇯 В Таджикистане</option>
                    <option value="delivered" ${order.deliveryStatus === 'delivered' ? 'selected' : ''}>✅ Доставлен</option>
                </select>
            </div>
        </div>
    `).join('');
}

function loadAdminUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const container = document.getElementById('adminUsersList');
    
    container.innerHTML = users.map(user => `
        <div class="admin-user-card">
            <div><strong>${user.name}</strong><br><small>${user.email}</small><br><small>${user.phone}</small></div>
            <div>📦 Заказов: ${user.orders?.length || 0}</div>
            <button onclick="deleteUser(${user.id})" style="background:#ef4444;color:white;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;">Удалить</button>
        </div>
    `).join('');
}

function loadAdminProducts() {
    const container = document.getElementById('adminProductsList');
    
    container.innerHTML = productsData.map(product => `
        <div class="admin-product-card">
            <div><strong>${product.name}</strong><br><small>${product.price.toLocaleString()} ₽</small></div>
            <button onclick="deleteProduct(${product.id})" style="background:#ef4444;color:white;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;">Удалить</button>
        </div>
    `).join('');
}

function updateOrderStatus(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].deliveryStatus = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        showToast(`Статус заказа #${orderId} обновлён`, 'success');
        
        // Если статус "Доставлен" — отправляем уведомление
        if (newStatus === 'delivered') {
            checkAndSendDeliveryNotification(orderId, newStatus);
        }
        
        loadAdminOrders();
        loadAdminStats();
    }
}

function deleteUser(userId) {
    if (confirm('Удалить пользователя? Все его заказы останутся.')) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        loadAdminUsers();
        loadAdminStats();
        showToast('Пользователь удалён', 'success');
    }
}

function deleteProduct(productId) {
    if (confirm('Удалить товар?')) {
        const index = productsData.findIndex(p => p.id === productId);
        if (index !== -1) {
            productsData.splice(index, 1);
            filterAndRender();
            loadAdminProducts();
            showToast('Товар удалён', 'success');
        }
    }
}

function showAddProductForm() {
    document.getElementById('productFormModal').style.display = 'flex';
}

function closeProductForm() {
    document.getElementById('productFormModal').style.display = 'none';
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productOldPrice').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productBadge').value = '';
}

function addNewProduct() {
    const name = document.getElementById('productName').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const oldPrice = parseInt(document.getElementById('productOldPrice').value) || null;
    const image = document.getElementById('productImage').value;
    const category = document.getElementById('productCategory').value;
    const badge = document.getElementById('productBadge').value;
    
    if (!name || !price || !image) {
        showToast('Заполните название, цену и ссылку на изображение', 'error');
        return;
    }
    
    const newProduct = {
        id: Date.now(),
        name,
        price,
        oldPrice,
        image,
        badge,
        category
    };
    
    productsData.push(newProduct);
    filterAndRender();
    loadAdminProducts();
    closeProductForm();
    showToast('Товар добавлен!', 'success');
}

function getStatusText(status) {
    const statuses = {
        'pending': '⏳ Ожидает',
        'processing': '📦 На складе в Китае',
        'customs': '🛃 Таможня',
        'in_transit': '✈️ В пути',
        'in_tajikistan': '🇹🇯 В Таджикистане',
        'delivered': '✅ Доставлен'
    };
    return statuses[status] || '⏳ Ожидает';
}

// Добавь в DOMContentLoaded
const logo = document.querySelector('.header__logo');
if (logo) {
    logo.addEventListener('dblclick', (e) => {
        e.preventDefault();
        openAdminPanel();
    });
}

// ========= ЧАТ ПОДДЕРЖКИ =========
let chatOpen = false;
let chatMessages = [];
let isTyping = false;

// Бот отвечает на сообщения
function getBotReply(message) {
    const msg = message.toLowerCase();
    
    const replies = {
        'привет': 'Здравствуйте! 👋 Чем могу помочь?',
        'здравствуй': 'Здравствуйте! 👋 Чем могу помочь?',
        'ку': 'Здравствуйте! 👋 Чем могу помочь?',
        'доставка': 'Доставка из Китая занимает 14-18 дней. Мы используем авиадоставку. Отследить заказ можно в личном кабинете! 🚚',
        'скидка': 'Следите за нашими акциями в Telegram-канале! Подпишитесь, чтобы не пропустить скидки до 70%! 🎁',
        'оплата': 'Можно оплатить наличными при получении, переводом на карту или через Alif. Скоро добавим оплату картами! 💳',
        'возврат': 'Возврат товара возможен в течение 14 дней. Товар должен быть в оригинальной упаковке. Подробнее в разделе "Возврат" 📦',
        'ошибка': 'Опишите проблему подробнее, я помогу разобраться! 🔧',
        'спасибо': 'Пожалуйста! Рады помочь! 😊 Обращайтесь ещё!',
        'товар': 'Все товары качественные, с гарантией. Можете посмотреть характеристики и отзывы на странице товара! ⭐',
        'заказ': 'Оформить заказ можно через корзину. Нужно добавить товары и заполнить форму. Доставка по всему Таджикистану! 📝',
        'как': 'Как я могу помочь? Уточните вопрос о доставке, оплате или товаре!',
        'help': 'Я могу ответить на вопросы о: доставке (14-18 дней), оплате, возврате, товарах. Что вас интересует?'
    };
    
    for (let key in replies) {
        if (msg.includes(key)) {
            return replies[key];
        }
    }
    
    return 'Спасибо за вопрос! Наш менеджер свяжется с вами в ближайшее время. А пока можете посмотреть FAQ на сайте 📚';
}

// Отправка сообщения в Telegram (для админа)
async function sendToAdminTelegram(message, userName) {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        const userNameTelegram = currentUser ? currentUser.name : 'Гость';
        
        const text = `💬 НОВОЕ СООБЩЕНИЕ ИЗ ЧАТА!\n\n👤 Пользователь: ${userNameTelegram}\n📝 Сообщение: ${message}\n🕐 Время: ${new Date().toLocaleString('ru-RU')}`;
        
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        });
    } catch(e) {
        console.log('Telegram уведомление не отправлено');
    }
}

function addMessageToChat(text, isUser = true) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
    
    const avatar = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-headset"></i>';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${avatar}
        </div>
        <div class="message-bubble">
            <div class="message-text">${escapeHtml(text)}</div>
            <div class="message-time">${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Сохраняем сообщение
    chatMessages.push({ text, isUser, time: new Date() });
    
    // Отправляем админу если это сообщение пользователя
    if (isUser) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        const userName = currentUser ? currentUser.name : 'Гость';
        sendToAdminTelegram(text, userName);
    }
}

function showTyping() {
    const typingDiv = document.getElementById('chatTyping');
    if (typingDiv) {
        typingDiv.style.display = 'block';
        isTyping = true;
    }
}

function hideTyping() {
    const typingDiv = document.getElementById('chatTyping');
    if (typingDiv) {
        typingDiv.style.display = 'none';
        isTyping = false;
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Добавляем сообщение пользователя
    addMessageToChat(message, true);
    input.value = '';
    
    // Показываем печать бота
    showTyping();
    
    // Имитация задержки ответа
    setTimeout(() => {
        hideTyping();
        
        // Получаем ответ бота
        const reply = getBotReply(message);
        addMessageToChat(reply, false);
    }, 800 + Math.random() * 500);
}

function addEmoji(emoji) {
    const input = document.getElementById('chatInput');
    input.value += emoji;
    input.focus();
}

function initChat() {
    const toggleBtn = document.getElementById('chatToggle');
    const closeBtn = document.getElementById('chatClose');
    const chatWindow = document.getElementById('chatWindow');
    const sendBtn = document.getElementById('chatSendBtn');
    const input = document.getElementById('chatInput');
    
    if (!toggleBtn || !chatWindow) return;
    
    toggleBtn.addEventListener('click', () => {
        if (chatWindow.style.display === 'none') {
            chatWindow.style.display = 'flex';
            // Скрываем бейдж
            const badge = document.querySelector('.chat-badge');
            if (badge) badge.style.display = 'none';
        } else {
            chatWindow.style.display = 'none';
        }
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            chatWindow.style.display = 'none';
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Авто-высота textarea
        input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 80) + 'px';
        });
    }
}

// Запускаем чат
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChat);
} else {
    initChat();
}


