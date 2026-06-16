const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const mongoose = require('mongoose');

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

setInterval(keepAlive, 14 * 60 * 1000);

app.get('/ping', (req, res) => {
    res.json({ status: 'alive', time: new Date().toISOString() });
});

// ============================================
// MongoDB
// ============================================
const MONGO_URI = 'mongodb+srv://abdullozodabehzod_db_user:shopxand2024@cluster0.kbl37oo.mongodb.net/shopxand?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB подключена'))
    .catch(err => console.error('❌ Ошибка MongoDB:', err.message));

// ============================================
// API routes
// ============================================
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/user', require('./routes/userdata'));
app.use('/api/email', require('./routes/email'));
app.use('/api/telegram', require('./routes/telegram'));

// ============================================
// Старая статика (админка, картинки, старый сайт)
// ============================================
app.use(express.static(path.join(__dirname, '..')));

// ============================================
// React build
// ============================================
app.use(express.static(path.join(__dirname, '..', 'shopxand-react', 'build')));

// ============================================
// Остальные роуты
// ============================================
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /cart/\n\nSitemap: https://shopxand-3.onrender.com/sitemap.xml');
});

app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'sitemap.xml'));
});

// Все остальные запросы → React index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'shopxand-react', 'build', 'index.html'));
});

// ============================================
// Запуск
// ============================================
app.listen(PORT, () => {
    console.log('🛒 ShopXand сервер на порту ' + PORT);
    setTimeout(keepAlive, 60 * 1000);
});