// Админ-панель ShopXand

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'shopxand2024';
const API_URL = 'http://localhost:3000/api';

// Вход
document.getElementById('adminLoginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    var user = document.getElementById('adminUser').value;
    var pass = document.getElementById('adminPass').value;
    
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        localStorage.setItem('shopxand_admin', 'true');
        window.location.href = 'dashboard.html';
    } else {
        document.getElementById('adminError').style.display = 'block';
    }
});

// Проверка входа
function checkAdmin() {
    if (!localStorage.getItem('shopxand_admin')) {
        window.location.href = 'index.html';
    }
}

// Выход
function logoutAdmin() {
    localStorage.removeItem('shopxand_admin');
    window.location.href = 'index.html';
}

// Загрузка заказов
async function loadOrdersAdmin() {
    try {
        var res = await fetch(API_URL + '/orders');
        var data = await res.json();
        var tbody = document.getElementById('ordersTable');
        tbody.innerHTML = data.orders.map(function(o) {
            return '<tr>' +
                '<td>' + o.id + '</td>' +
                '<td>' + o.customer.name + '</td>' +
                '<td>' + o.customer.phone + '</td>' +
                '<td>' + o.total.toLocaleString() + ' с.</td>' +
                '<td><span class="badge badge--blue">' + o.status + '</span></td>' +
                '<td>' + new Date(o.date).toLocaleDateString('ru-RU') + '</td>' +
                '<td>' +
                    '<button class="btn-sm btn-sm--green" onclick="updateStatus(\'' + o.id + '\', \'completed\')">✅</button> ' +
                    '<button class="btn-sm btn-sm--red" onclick="updateStatus(\'' + o.id + '\', \'cancelled\')">❌</button>' +
                '</td>' +
            '</tr>';
        }).join('');
    } catch (err) {
        console.log('Ошибка загрузки заказов');
    }
}

// Обновление статуса
async function updateStatus(orderId, status) {
    try {
        await fetch(API_URL + '/orders/' + orderId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: status })
        });
        loadOrdersAdmin();
    } catch (err) {
        alert('Ошибка обновления');
    }
}

// Загрузка товаров
async function loadProductsAdmin() {
    try {
        var res = await fetch(API_URL + '/products');
        var data = await res.json();
        var tbody = document.getElementById('productsTable');
        tbody.innerHTML = data.products.map(function(p) {
            return '<tr>' +
                '<td>' + (p._id || p.id || '—') + '</td>' +
                '<td><img src="' + (p.img || '') + '" style="width:50px;height:50px;object-fit:contain;" onerror="this.style.display=\'none\'"></td>' +
                '<td>' + p.name + '</td>' +
                '<td>' + p.cat + '</td>' +
                '<td>' + p.price + ' с.</td>' +
                '<td><button class="btn-sm btn-sm--red" onclick="deleteProduct(\'' + (p._id || p.id) + '\')">🗑️</button></td>' +
            '</tr>';
        }).join('');
    } catch (err) {
        console.log('Ошибка загрузки товаров');
    }
}

// Сохранение товара
async function saveProduct() {
    var materialStr = document.getElementById('prodMaterial')?.value || '';
    var seasonStr = document.getElementById('prodSeason')?.value || '';
    var styleStr = document.getElementById('prodStyle')?.value || '';
    var thumbPricesStr = document.getElementById('prodThumbPrices')?.value || '';
    var sizesStr = document.getElementById('prodSizes')?.value || '';
    var shoeSizesStr = document.getElementById('prodShoeSizes')?.value || '';
    var colorsStr = document.getElementById('prodColors')?.value || '';
    var thumbsStr = document.getElementById('prodThumbs')?.value || '';
    
    var product = {
        name: document.getElementById('prodName').value,
        cat: document.getElementById('prodCat').value,
        inStock: document.getElementById('prodInStock')?.checked ?? true,
        price: parseInt(document.getElementById('prodPrice').value) || 0,
        oldPrice: document.getElementById('prodOldPrice').value ? parseInt(document.getElementById('prodOldPrice').value) : null,
        img: document.getElementById('prodImg').value || '',
        desc: document.getElementById('prodDesc').value || '',
        material: materialStr,
        season: seasonStr,
        style: styleStr,
        sizes: sizesStr ? sizesStr.split(',').map(function(s) { return s.trim(); }) : [],
        shoeSizes: shoeSizesStr ? shoeSizesStr.split(',').map(function(s) { return s.trim(); }) : [],
        colors: colorsStr ? colorsStr.split(',').map(function(c) { return c.trim(); }) : [],
        thumbs: thumbsStr ? thumbsStr.split(',').map(function(t) { return t.trim(); }) : [],
        thumbPrices: thumbPricesStr ? thumbPricesStr.split(',').map(function(p) { return parseInt(p.trim()) || 0; }) : [],
        rating: parseFloat(document.getElementById('prodRating')?.value) || 0,
        reviews: parseInt(document.getElementById('prodReviews')?.value) || 0,
        specs: [],
        brightness: 128
    };
    
    if (!product.name || !product.price) {
        alert('Заполните название и цену');
        return;
    }
    
    console.log('Сохраняю товар:', product);
    
    try {
        var response = await fetch(API_URL + '/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        var data = await response.json();
        
        if (response.ok) {
            loadProductsAdmin();
            alert('Товар добавлен!');
            document.getElementById('prodName').value = '';
            document.getElementById('prodPrice').value = '';
            document.getElementById('prodImg').value = '';
            document.getElementById('prodThumbs').value = '';
            document.getElementById('prodColors').value = '';
        } else {
            alert('Ошибка: ' + (data.error || ''));
        }
    } catch (err) {
        console.error('Ошибка:', err);
        alert('Сервер недоступен');
    }
}

// Загрузка отзывов
var currentReviewFilter = 'pending';

async function loadReviews(filter) {
    currentReviewFilter = filter;
    try {
        var res = await fetch(API_URL + '/reviews/admin');
        var data = await res.json();
        var reviews = data.reviews;
        if (filter !== 'all') reviews = reviews.filter(function(r) { return r.status === filter; });

        var list = document.getElementById('reviewsList');
        if (reviews.length === 0) {
            list.innerHTML = '<div style="text-align:center;padding:40px;">Нет отзывов</div>';
            return;
        }

        list.innerHTML = reviews.map(function(r) {
            var stars = '';
            for (var i = 1; i <= 5; i++) stars += i <= r.rating ? '⭐' : '☆';
            return '<div style="background:#fff;padding:14px;border-radius:10px;margin-bottom:8px;">' +
                '<strong>' + (r.name || 'Гость') + '</strong> ' + stars + ' ' + r.rating + '/5' +
                '<p>' + r.text + '</p>' +
                '<small>' + new Date(r.date).toLocaleString('ru-RU') + '</small>' +
                '<br><button class="btn-sm" onclick="deleteReviewById(\'' + r.id + '\')">🗑️ Удалить</button>' +
            '</div>';
        }).join('');
    } catch (err) {
        console.log('Ошибка:', err);
    }
}

async function deleteReviewById(id) {
    if (!confirm('Удалить отзыв?')) return;
    await fetch(API_URL + '/reviews/' + id, { method: 'DELETE' });
    loadReviews(currentReviewFilter);
}

// Аналитика
var salesChart = null;

async function loadAnalytics() {
    try {
        var res = await fetch(API_URL + '/orders/admin/all');
        var data = await res.json();
        var orders = data.orders || [];
        
        var totalRevenue = orders.reduce(function(s, o) { return s + (o.total || 0); }, 0);
        var avgCheck = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
        
        var clients = {};
        orders.forEach(function(o) {
            if (o.customer && o.customer.phone) clients[o.customer.phone] = true;
        });
        
        document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString();
        document.getElementById('totalOrders').textContent = orders.length;
        document.getElementById('avgCheck').textContent = avgCheck.toLocaleString();
        document.getElementById('totalClients').textContent = Object.keys(clients).length;
        
        var salesByDay = {};
        orders.forEach(function(o) {
            var day = new Date(o.date).toLocaleDateString('ru-RU');
            if (!salesByDay[day]) salesByDay[day] = 0;
            salesByDay[day] += o.total || 0;
        });
        
        var days = Object.keys(salesByDay).slice(-7);
        var values = days.map(function(d) { return salesByDay[d]; });
        
        var ctx = document.getElementById('salesChart')?.getContext('2d');
        if (ctx) {
            if (salesChart) salesChart.destroy();
            salesChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: days,
                    datasets: [{
                        label: 'Выручка (сомони)',
                        data: values,
                        borderColor: '#0066ff',
                        backgroundColor: 'rgba(0,102,255,0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: { responsive: true, plugins: { legend: { display: false } } }
            });
        }
        
        var productSales = {};
        orders.forEach(function(o) {
            if (o.items) {
                o.items.forEach(function(item) {
                    var key = item.name;
                    if (!productSales[key]) productSales[key] = 0;
                    productSales[key] += item.quantity || 1;
                });
            }
        });
        
        var topProducts = Object.entries(productSales).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 5);
        
        var topHtml = topProducts.map(function(p, i) {
            return '<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;">' +
                '<span>' + (i + 1) + '. ' + p[0] + '</span><strong>' + p[1] + ' шт.</strong></div>';
        }).join('');
        
        document.getElementById('topProducts').innerHTML = topHtml || '<p style="color:#999;">Нет данных</p>';
        
        var recent = orders.slice(-5).reverse();
        document.getElementById('recentOrders').innerHTML = recent.map(function(o) {
            return '<tr>' +
                '<td>' + (o.id || '—') + '</td>' +
                '<td>' + (o.customer?.name || '—') + '</td>' +
                '<td>' + (o.total || 0).toLocaleString() + ' с.</td>' +
                '<td><span class="badge badge--blue">' + (o.status || '—') + '</span></td>' +
                '<td>' + new Date(o.date).toLocaleDateString('ru-RU') + '</td>' +
            '</tr>';
        }).join('');
    } catch (err) {
        console.log('Ошибка загрузки аналитики:', err);
    }
}

async function deleteProduct(id) {
    if (!confirm('Удалить товар?')) return;
    try {
        var response = await fetch(API_URL + '/products/' + id, { method: 'DELETE' });
        var data = await response.json();
        if (response.ok) {
            loadProductsAdmin();
        } else {
            alert('Ошибка: ' + (data.error || ''));
        }
    } catch (err) {
        console.error('Ошибка удаления:', err);
        alert('Сервер недоступен');
    }
}