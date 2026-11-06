// ============================================================
// Админ-панель ShopXand
// ============================================================

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'shopxand2024';

// Автовыбор API: localhost при разработке, Render в проде
const API_URL =
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api'
    : 'https://shopxand-3.onrender.com/api';

// ---------- ВХОД ----------
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

function checkAdmin() {
    if (!localStorage.getItem('shopxand_admin')) {
        window.location.href = 'index.html';
    }
}

function logoutAdmin() {
    localStorage.removeItem('shopxand_admin');
    window.location.href = 'index.html';
}

// ============================================================
// ТОВАРЫ
// ============================================================

async function loadProductsAdmin() {
    const tbody = document.getElementById('productsTable');
    if (!tbody) return;

    try {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Загрузка...</td></tr>';
        var res = await fetch(API_URL + '/products');
        var data = await res.json();
        var products = data.products || [];

        if (!products.length) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#999;">Товаров пока нет — добавь первый!</td></tr>';
            return;
        }

        tbody.innerHTML = products.map(function(p) {
            var id = p._id || p.id;
            var imgSrc = p.img || '';
            
            // Фикс путей картинок
            if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/')) {
                imgSrc = '/' + imgSrc;
            }
            if (imgSrc && imgSrc.startsWith('/uploads/') && API_URL.indexOf('http') === 0) {
                imgSrc = API_URL.replace('/api', '') + imgSrc;
            }

            var priceVal = (p.price !== undefined && p.price !== null) ? p.price : '';
            var oldPriceVal = (p.oldPrice !== undefined && p.oldPrice !== null) ? p.oldPrice : '';

            return '<tr data-id="' + id + '">' +
                '<td><img src="' + imgSrc + '" style="width:50px;height:50px;object-fit:cover;border-radius:6px;" onerror="this.style.display=\'none\'"></td>' +
                '<td>' + (p.name || '—') + '</td>' +
                '<td><span class="badge badge--blue">' + (p.cat || '—') + '</span></td>' +
                '<td><input type="number" class="price-input" data-id="' + id + '" value="' + priceVal + '" step="0.01" min="0" style="width:90px;padding:6px;border:1px solid #ddd;border-radius:6px;"></td>' +
                '<td><input type="number" class="old-price-input" data-id="' + id + '" value="' + oldPriceVal + '" step="0.01" min="0" style="width:90px;padding:6px;border:1px solid #ddd;border-radius:6px;"></td>' +
                '<td><div style="display:flex;gap:4px;">' +
                  '<button class="btn-sm btn-sm--green" onclick="updateProductPrice(\'' + id + '\')" title="Сохранить цену" style="padding:8px 12px;background:#00c853;color:#fff;border:none;border-radius:6px;cursor:pointer;">💾 Сохранить</button>' +
                  '<button class="btn-sm btn-sm--red" onclick="deleteProduct(\'' + id + '\')" title="Удалить" style="padding:8px 12px;background:#ff4757;color:#fff;border:none;border-radius:6px;cursor:pointer;">🗑 Удалить</button>' +
                '</div></td>' +
            '</tr>';
        }).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#ff4757;">Ошибка загрузки товаров</td></tr>';
        console.log('Ошибка загрузки товаров:', err);
    }
}

async function saveProduct() {
    var name = document.getElementById('prodName')?.value?.trim();
    var cat = document.getElementById('prodCat')?.value;
    var price = document.getElementById('prodPrice')?.value;
    var oldPrice = document.getElementById('prodOldPrice')?.value;
    var desc = document.getElementById('prodDesc')?.value || '';
    var fileInput = document.getElementById('prodImgFile');
    var file = fileInput && fileInput.files ? fileInput.files[0] : null;

    if (!name || !price) {
        alert('Заполните название и цену');
        return;
    }
    if (!file) {
        alert('Выберите фото товара (нажми "Выбрать файл")');
        return;
    }

    var formData = new FormData();
    formData.append('name', name);
    formData.append('cat', cat);
    formData.append('price', price);
    if (oldPrice) formData.append('oldPrice', oldPrice);
    formData.append('desc', desc);
    formData.append('img', file);

    try {
        var response = await fetch(API_URL + '/products', {
            method: 'POST',
            body: formData
        });
        var data = await response.json();

        if (response.ok) {
            // Очистка формы
            document.getElementById('prodName').value = '';
            document.getElementById('prodPrice').value = '';
            document.getElementById('prodOldPrice').value = '';
            document.getElementById('prodDesc').value = '';
            document.getElementById('prodImgFile').value = '';
            // Перезагрузка таблицы — новый товар появится внизу
            loadProductsAdmin();
            alert('✅ Товар добавлен!');
        } else {
            alert('Ошибка: ' + (data.error || 'неизвестная'));
        }
    } catch (err) {
        console.error('Ошибка:', err);
        alert('Сервер недоступен');
    }
}

async function updateProductPrice(id) {
    var row = document.querySelector('tr[data-id="' + id + '"]');
    if (!row) return;

    var priceInput = row.querySelector('.price-input');
    var oldPriceInput = row.querySelector('.old-price-input');
    var newPrice = parseFloat(priceInput.value);
    var newOldPrice = oldPriceInput.value ? parseFloat(oldPriceInput.value) : null;

    if (isNaN(newPrice) || newPrice < 0) {
        alert('Введите корректную цену');
        return;
    }

    try {
        var response = await fetch(API_URL + '/products/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: newPrice, oldPrice: newOldPrice })
        });
        var data = await response.json();
        if (response.ok) {
            alert('✅ Цена обновлена');
            loadProductsAdmin();
        } else {
            alert('Ошибка: ' + (data.error || ''));
        }
    } catch (err) {
        alert('Сервер недоступен');
    }
}

async function deleteProduct(id) {
    if (!confirm('Удалить товар? Фото тоже удалится.')) return;
    try {
        var response = await fetch(API_URL + '/products/' + id, { method: 'DELETE' });
        var data = await response.json();
        if (response.ok) {
            loadProductsAdmin();
        } else {
            alert('Ошибка: ' + (data.error || ''));
        }
    } catch (err) {
        alert('Сервер недоступен');
    }
}

// ============================================================
// ПОЛЬЗОВАТЕЛИ
// ============================================================

async function loadUsersAdmin() {
    const tbody = document.getElementById('usersTable');
    if (!tbody) return;

    try {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Загрузка...</td></tr>';
        var res = await fetch(API_URL + '/users');
        var data = await res.json();
        var users = data.users || [];

        if (!users.length) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999;">Пользователей пока нет</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(function(u) {
            var id = u._id || u.id;
            var regDate = u.registeredAt
                ? new Date(u.registeredAt).toLocaleString('ru-RU')
                : '—';
            return '<tr>' +
                '<td style="font-size:11px;color:#888;max-width:120px;overflow:hidden;text-overflow:ellipsis;">' + id + '</td>' +
                '<td>' + (u.name || '—') + '</td>' +
                '<td>' + (u.phone || '—') + '</td>' +
                '<td>' + (u.email || '—') + '</td>' +
                '<td>' + regDate + '</td>' +
            '</tr>';
        }).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#ff4757;">Ошибка загрузки пользователей</td></tr>';
        console.log('Ошибка загрузки пользователей:', err);
    }
}

// ============================================================
// ЗАКАЗЫ (сохранено из старого admin.js)
// ============================================================

async function loadOrdersAdmin() {
    try {
        var res = await fetch(API_URL + '/orders');
        var data = await res.json();
        var tbody = document.getElementById('ordersTable');
        if (!tbody) return;
        tbody.innerHTML = (data.orders || []).map(function(o) {
            return '<tr>' +
                '<td>' + o.id + '</td>' +
                '<td>' + (o.customer && o.customer.name ? o.customer.name : '—') + '</td>' +
                '<td>' + (o.customer && o.customer.phone ? o.customer.phone : '—') + '</td>' +
                '<td>' + (o.total || 0).toLocaleString() + ' с.</td>' +
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

// ============================================================
// ОТЗЫВЫ (сохранено из старого admin.js)
// ============================================================

var currentReviewFilter = 'pending';

async function loadReviews(filter) {
    currentReviewFilter = filter;
    try {
        var res = await fetch(API_URL + '/reviews/admin');
        var data = await res.json();
        var reviews = data.reviews || [];
        if (filter !== 'all') reviews = reviews.filter(function(r) { return r.status === filter; });

        var list = document.getElementById('reviewsList');
        if (!list) return;

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

// ============================================================
// АНАЛИТИКА (сохранено из старого admin.js)
// ============================================================

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

        var $rev = document.getElementById('totalRevenue');
        var $ord = document.getElementById('totalOrders');
        var $avg = document.getElementById('avgCheck');
        var $cli = document.getElementById('totalClients');
        if ($rev) $rev.textContent = totalRevenue.toLocaleString();
        if ($ord) $ord.textContent = orders.length;
        if ($avg) $avg.textContent = avgCheck.toLocaleString();
        if ($cli) $cli.textContent = Object.keys(clients).length;

        var salesByDay = {};
        orders.forEach(function(o) {
            var day = new Date(o.date).toLocaleDateString('ru-RU');
            if (!salesByDay[day]) salesByDay[day] = 0;
            salesByDay[day] += o.total || 0;
        });

        var days = Object.keys(salesByDay).slice(-7);
        var values = days.map(function(d) { return salesByDay[d]; });

        var ctx = document.getElementById('salesChart')?.getContext('2d');
        if (ctx && typeof Chart !== 'undefined') {
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

        var $top = document.getElementById('topProducts');
        if ($top) $top.innerHTML = topHtml || '<p style="color:#999;">Нет данных</p>';

        var recent = orders.slice(-5).reverse();
        var $recent = document.getElementById('recentOrders');
        if ($recent) {
            $recent.innerHTML = recent.map(function(o) {
                return '<tr>' +
                    '<td>' + (o.id || '—') + '</td>' +
                    '<td>' + (o.customer && o.customer.name ? o.customer.name : '—') + '</td>' +
                    '<td>' + (o.total || 0).toLocaleString() + ' с.</td>' +
                    '<td><span class="badge badge--blue">' + (o.status || '—') + '</span></td>' +
                    '<td>' + new Date(o.date).toLocaleDateString('ru-RU') + '</td>' +
                '</tr>';
            }).join('');
        }
    } catch (err) {
        console.log('Ошибка загрузки аналитики:', err);
    }
}