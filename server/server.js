const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB
const MONGO_URI = 'mongodb+srv://abdullozodabehzod_db_user:shopxand2024@cluster0.kbl37oo.mongodb.net/shopxand?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB подключена'))
    .catch(err => console.error('❌ Ошибка MongoDB:', err.message));

// API routes (ДОЛЖНЫ БЫТЬ ПЕРЕД static)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/user', require('./routes/userdata'));
app.use('/api/email', require('./routes/email'));
app.use('/api/telegram', require('./routes/telegram'));

// Статические файлы (ПОСЛЕ API)
app.use(express.static(path.join(__dirname, '..')));

app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /cart/\n\nSitemap: https://shopxand-3.onrender.com/sitemap.xml`);
});

app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'sitemap.xml'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// React build
app.use(express.static(path.join(__dirname, '..', 'shopxand-react', 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'shopxand-react', 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log('🛒 ShopXand сервер на порту ' + PORT);
});

