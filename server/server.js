const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Подключение к MongoDB
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:shopxand2024@cluster0.xxxxx.mongodb.net/shopxand';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB подключена'))
    .catch(err => console.error('❌ Ошибка MongoDB:', err));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
    console.log('🛒 ShopXand сервер на порту ' + PORT);
});