const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
// React build (ПЕРВЫМ!)
// ============================================
app.use(express.static(path.join(__dirname, '..', 'shopxand-react', 'build')));

// ============================================
// Старая статика — админка, картинки (ВТОРЫМ)
// ============================================
app.use(express.static(path.join(__dirname, '..')));

// ============================================
// robots.txt и sitemap
// ============================================
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /cart/\n\nSitemap: https://shopxand-3.onrender.com/sitemap.xml');
});

app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'sitemap.xml'));
});

// ============================================
// SEO: страница товара для поисковиков
// ============================================
app.get('/product/:id', async (req, res) => {
    try {
        const Product = require('./models/Product');
        const product = await Product.findById(req.params.id);
        if (!product) return res.redirect('/');
        
        const userAgent = req.get('User-Agent') || '';
        const isBot = /bot|google|yandex|baidu|bing|facebook|twitter/i.test(userAgent);
        
        if (isBot) {
            const { renderProductPage } = require('./seo');
            const products = await Product.find().limit(20);
            res.send(renderProductPage(product, products));
        } else {
            res.sendFile(path.join(__dirname, '..', 'shopxand-react', 'build', 'index.html'));
        }
    } catch (err) {
        res.redirect('/');
    }
});

// ============================================
// Все остальные запросы → React
// ============================================
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