const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB подключена'))
    .catch(err => console.error('❌ MongoDB ошибка:', err));

app.use(cors());
app.use(express.json());

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

app.use('/api/user', require('./routes/userdata'));

app.use('/api/email', require('./routes/email'));

app.use('/api/telegram', require('./routes/telegram'));

app.listen(PORT, () => {
    console.log('🛒 ShopXand сервер на порту ' + PORT);
});