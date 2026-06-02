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
 '<td>' + p.id + '</td>' +
 '<td>' + p.name + '</td>' +
 '<td>' + p.cat + '</td>' +
 '<td>' + p.price + ' с.</td>' +
 '<td>' +
'<button class="btn-sm btn-sm--red" onclick="deleteProduct(\'' + p.id + '\')">🗑️</button>' +
 '</td>' +
  '</tr>';
   }).join('');
    } catch (err) {
   console.log('Ошибка загрузки товаров');
    }
}

// Сохранение товара
async function saveProduct() {
  var sizesStr = document.getElementById('prodSizes')?.value || '';
    var shoeSizesStr = document.getElementById('prodShoeSizes')?.value || '';
    
    var product = {
   name: document.getElementById('prodName').value,
   cat: document.getElementById('prodCat').value,
   price: parseInt(document.getElementById('prodPrice').value) || 0,
   oldPrice: document.getElementById('prodOldPrice').value ? parseInt(document.getElementById('prodOldPrice').value) : null,
   img: document.getElementById('prodImg').value || '',
   desc: document.getElementById('prodDesc').value || '',
   sizes: sizesStr ? sizesStr.split(',').map(function(s) { return s.trim(); }) : [],
   shoeSizes: shoeSizesStr ? shoeSizesStr.split(',').map(function(s) { return s.trim(); }) : [],
   rating: 0,
   reviews: 0,
   specs: [],
   thumbs: [],
   inStock: true,
   brightness: 128,
    colors: [{ r: 128, g: 128, b: 128 }],
    rating: parseFloat(document.getElementById('prodRating')?.value) || 0,
    reviews: parseInt(document.getElementById('prodReviews')?.value) || 0,
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
   console.log('Ответ сервера:', data);
   
   if (response.ok) {
  loadProductsAdmin();
  alert('Товар добавлен!');
  // Очистить поля
  document.getElementById('prodName').value = '';
  document.getElementById('prodPrice').value = '';
  document.getElementById('prodImg').value = '';
  document.getElementById('prodDesc').value = '';
   } else {
  alert('Ошибка: ' + (data.error || 'Неизвестная'));
   }
    } catch (err) {
   console.error('Ошибка:', err);
   alert('Сервер недоступен');
    }
}

// Загрузка отзывов для модерации
var currentReviewFilter = 'pending';

async function loadReviews(filter) {
    currentReviewFilter = filter;
    try {
   var url = API_URL + '/reviews/admin';
   var res = await fetch(url);
   var data = await res.json();
   
   var reviews = data.reviews;
   if (filter !== 'all') {
  reviews = reviews.filter(function(r) { return r.status === filter; });
   }
   
   // Статистика
   var allReviews = data.reviews;
   document.getElementById('pendingCount').textContent = allReviews.filter(function(r) { return r.status === 'pending'; }).length;
   document.getElementById('approvedCount').textContent = allReviews.filter(function(r) { return r.status === 'approved'; }).length;
   document.getElementById('rejectedCount').textContent = allReviews.filter(function(r) { return r.status === 'rejected'; }).length;
   
   var list = document.getElementById('reviewsList');
   
   if (reviews.length === 0) {
  list.innerHTML = '<div style="text-align:center;padding:40px;color:#999;">Нет отзывов</div>';
  return;
   }
   
   list.innerHTML = reviews.map(function(r) {
  var stars = '';
  for (var i = 1; i <= 5; i++) stars += i <= r.rating ? '⭐' : '☆';
  var statusBadge = '';
  if (r.status === 'pending') statusBadge = '<span class="badge badge--orange">Ожидает</span>';
  if (r.status === 'approved') statusBadge = '<span class="badge badge--green">Одобрен</span>';
  if (r.status === 'rejected') statusBadge = '<span class="badge badge--red">Отклонён</span>';
  
  var actions = '';
  if (r.status === 'pending') {
 actions = '<button class="btn-sm btn-sm--green" onclick="approveReview(\'' + r.date + '\')">✅ Одобрить</button> ' +
 '<button class="btn-sm btn-sm--red" onclick="rejectReview(\'' + r.date + '\')">❌ Отклонить</button>';
  }
  actions += ' <button class="btn-sm" onclick="deleteReview(\'' + r.date + '\')">🗑️</button>';
  
  return '<div style="background:#fff;padding:16px;border-radius:12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:start;">' +
 '<div>' +
'<div style="font-weight:700;">' + r.name + ' ' + statusBadge + '</div>' +
'<div style="font-size:12px;color:#999;">' + new Date(r.date).toLocaleString('ru-RU') + ' | Товар: ' + r.productId + '</div>' +
'<div style="margin:6px 0;">' + stars + ' <strong>' + r.rating + '/5</strong></div>' +
'<div>' + r.text + '</div>' +
 '</div>' +
 '<div style="display:flex;gap:6px;flex-shrink:0;">' + actions + '</div>' +
  '</div>';
   }).join('');
   
    } catch (err) {
   console.log('Ошибка загрузки отзывов');
    }
}

// Одобрить
async function approveReview(id) {
    try {
   await fetch(API_URL + '/reviews/' + id + '/approve', { method: 'PUT' });
   loadReviews(currentReviewFilter);
    } catch (err) {
   alert('Ошибка');
    }
}

// Отклонить
async function rejectReview(id) {
    try {
   await fetch(API_URL + '/reviews/' + id + '/reject', { method: 'PUT' });
   loadReviews(currentReviewFilter);
    } catch (err) {
   alert('Ошибка');
    }
}

// Удалить
async function deleteReview(id) {
    if (!confirm('Удалить отзыв навсегда?')) return;
    try {
   await fetch(API_URL + '/reviews/' + id, { method: 'DELETE' });
   loadReviews(currentReviewFilter);
    } catch (err) {
   alert('Ошибка');
    }
}

// ============================================
// АНАЛИТИКА
// ============================================

var salesChart = null;

async function loadAnalytics() {
    try {
   var res = await fetch(API_URL + '/orders/admin/all');
   var data = await res.json();
   var orders = data.orders || [];
   
   // Базовая статистика
   var totalRevenue = orders.reduce(function(s, o) { return s + (o.total || 0); }, 0);
   var completedOrders = orders.filter(function(o) { return o.status === 'completed'; });
   var avgCheck = completedOrders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
   
   // Уникальные клиенты
   var clients = {};
   orders.forEach(function(o) {
  if (o.customer && o.customer.phone) clients[o.customer.phone] = true;
   });
   
   document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString();
   document.getElementById('totalOrders').textContent = orders.length;
   document.getElementById('avgCheck').textContent = avgCheck.toLocaleString();
   document.getElementById('totalClients').textContent = Object.keys(clients).length;
   
   // График продаж по дням
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
 options: {
responsive: true,
plugins: { legend: { display: false } }
 }
  });
   }
   
   // Топ товаров
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
   
   var topProducts = Object.entries(productSales)
  .sort(function(a, b) { return b[1] - a[1]; })
  .slice(0, 5);
   
   var topHtml = topProducts.map(function(p, i) {
  return '<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;">' +
 '<span>' + (i + 1) + '. ' + p[0] + '</span>' +
 '<strong>' + p[1] + ' шт.</strong>' +
  '</div>';
   }).join('');
   
   document.getElementById('topProducts').innerHTML = topHtml || '<p style="color:#999;">Нет данных</p>';
   
   // Последние заказы
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
    
    console.log('Удаляю товар:', id);
    
    try {
   var response = await fetch(API_URL + '/products/' + id, { 
  method: 'DELETE' 
   });
   var data = await response.json();
   console.log('Ответ:', data);
   
   if (response.ok) {
  loadProductsAdmin(); // Обновить список
   } else {
  alert('Ошибка: ' + (data.error || ''));
   }
    } catch (err) {
   console.error('Ошибка удаления:', err);
   alert('Сервер недоступен');
    }
}