const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/user', require('./routes/userdata')); // ← новая строка

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


// sitemap.xml
app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'sitemap.xml'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.use('/api/user', require('./routes/userdata'));

app.listen(PORT, () => {
    console.log('🛒 ShopXand сервер на порту ' + PORT);
});

app.use('/api/email', require('./routes/email'));

app.use('/api/telegram', require('./routes/telegram'));