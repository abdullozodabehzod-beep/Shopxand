const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Seller = require('../models/Seller')
const Product = require('../models/Product');

const SECRET = 'shopxand_seller_secret_2024';

router.post('/register', async (req, res) => {
    try {
        const { name, phone, email, password, shopName } = req.body;
        
        const exists = await Seller.findOne({ phone });
        if (exists) return res.status(400).json({ error: 'Продавец уже зарегистрирован' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const seller = await Seller.create({ name, phone, email, password: hashedPassword, shopName });
        
        const token = jwt.sign({ id: seller._id, phone: seller.phone }, SECRET, { expiresIn: '30d' });
        res.json({ token, seller: { id: seller._id, name: seller.name, shopName: seller.shopName } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Вход продавца
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        const seller = await Seller.findOne({ phone });
        if (!seller) return res.status(404).json({ error: 'Продавец не найден' });
        
        const valid = await bcrypt.compare(password, seller.password);
        if (!valid) return res.status(401).json({ error: 'Неверный пароль' });
        
        const token = jwt.sign({ id: seller._id, phone: seller.phone }, SECRET, { expiresIn: '30d' });
        res.json({ token, seller: { id: seller._id, name: seller.name, shopName: seller.shopName } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Товары продавца
router.get('/my-products', async (req, res) => {
    try {
        const token = req.headers['authorization']?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
        
        const decoded = jwt.verify(token, SECRET);
        const products = await Product.find({ sellerId: decoded.id });
        res.json({ products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Добавить товар
router.post('/add-product', async (req, res) => {
    try {
        const token = req.headers['authorization']?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
        
        const decoded = jwt.verify(token, SECRET);
        const seller = await Seller.findById(decoded.id);
        
        const product = await Product.create({
            ...req.body,
            sellerId: decoded.id,
            sellerName: seller.shopName || seller.name
        });
        
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Статистика продавца
router.get('/stats', async (req, res) => {
    try {
        const token = req.headers['authorization']?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
        
        const decoded = jwt.verify(token, SECRET);
        const seller = await Seller.findById(decoded.id);
        const products = await Product.find({ sellerId: decoded.id });
        
        res.json({
            shopName: seller.shopName,
            balance: seller.balance,
            totalSales: seller.totalSales,
            rating: seller.rating,
            productsCount: products.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;