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

function keepAlive() {
    https.get('https://shopxand-3.onrender.com/ping', (res) => {
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
// React build (САМЫЙ ПЕРВЫЙ — для JS/CSS файлов)
// ============================================
app.use(express.static(path.join(__dirname, '..', 'shopxand-react', 'build')));

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
// SEO — Server-Side Rendering
// ============================================
const { renderProductPage, renderHomePage } = require('./seo');

// SEO: страница товара
app.get('/product/:id', async (req, res) => {
    try {
        const Product = require('./models/Product');
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.redirect('/');
        }
        
        const userAgent = req.get('User-Agent') || '';
        const isBot = /bot|google|yandex|baidu|bing|slurp|duckduck|facebook|twitter/i.test(userAgent);
        
        if (isBot) {
            const products = await Product.find().limit(20);
            res.send(renderProductPage(product, products));
        } else {
            res.sendFile(path.join(__dirname, '..', 'shopxand-react', 'build', 'index.html'));
        }
    } catch (err) {
        res.redirect('/');
    }
});

// SEO: категории
app.get('/category/:cat', async (req, res) => {
    try {
        const Product = require('./models/Product');
        const products = await Product.find({ cat: req.params.cat }).limit(20);
        const userAgent = req.get('User-Agent') || '';
        const isBot = /bot|google|yandex|baidu|bing|slurp|duckduck|facebook|twitter/i.test(userAgent);
        
        if (isBot) {
            res.send(renderHomePage(products));
        } else {
            res.sendFile(path.join(__dirname, '..', 'shopxand-react', 'build', 'index.html'));
        }
    } catch (err) {
        res.redirect('/');
    }
});

// ============================================
// Sitemap — динамический
// ============================================
app.get('/sitemap.xml', async (req, res) => {
    try {
        const Product = require('./models/Product');
        const products = await Product.find();
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        xml += '<url><loc>https://shopxand-3.onrender.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n';
        
        products.forEach(p => {
            xml += '<url>\n';
            xml += `  <loc>https://shopxand-3.onrender.com/product/${p._id}</loc>\n`;
            xml += '  <changefreq>weekly</changefreq>\n';
            xml += '  <priority>0.8</priority>\n';
            xml += '</url>\n';
        });
        
        xml += '</urlset>';
        res.type('application/xml');
        res.send(xml);
    } catch (err) {
        res.sendFile(path.join(__dirname, '..', 'sitemap.xml'));
    }
});

// ============================================
// Старая статика — админка, картинки
// ============================================
app.use(express.static(path.join(__dirname, '..')));

// ============================================
// robots.txt
// ============================================
app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /cart/\n\nSitemap: https://shopxand-3.onrender.com/sitemap.xml');
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