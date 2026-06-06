const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ============================================
// AUTOPING — чтобы сервер не засыпал
// ============================================
const SITE_URL = 'shopxand-3.onrender.com';

function keepAlive() {
    https.get('https://' + SITE_URL + '/ping', (res) => {
        console.log('✅ Autoping:', res.statusCode);
    }).on('error', (err) => {
        console.log('❌ Ping error:', err.message);
    });
}

// Пингуем каждые 14 минут (Render засыпает после 15 мин)
setInterval(keepAlive, 14 * 60 * 1000);

// Эндпоинт для пинга
app.get('/ping', (req, res) => {
    res.json({ status: 'alive', time: new Date().toISOString() });
});

// robots.txt
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /cart/

Sitemap: https://shopxand-3.onrender.com/sitemap.xml`);
});

app.use(express.static(path.join(__dirname, '..')));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/user', require('./routes/userdata'));
app.use('/api/email', require('./routes/email'));
app.use('/api/telegram', require('./routes/telegram'));

app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'sitemap.xml'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
    console.log('🛒 ShopXand сервер на порту ' + PORT);
    // Первый пинг через 1 минуту после старта
    setTimeout(keepAlive, 60 * 1000);
});