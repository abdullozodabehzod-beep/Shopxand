const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = 'shopxand_secret_key_2024';

// Регистрация
router.post('/register', async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;
        const cleanPhone = phone.replace(/[\+\s\-\(\)]/g, '');
        
        const exists = await User.findOne({ phone: cleanPhone });
        if (exists) return res.status(400).json({ error: 'Этот номер уже зарегистрирован' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, phone: cleanPhone, email, password: hashedPassword });
        
        const token = jwt.sign({ id: user._id, phone: user.phone }, SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: user._id, name: user.name, phone: user.phone, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Вход
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        const cleanPhone = phone.replace(/[\+\s\-\(\)]/g, '');
        
        const user = await User.findOne({ phone: cleanPhone });
        if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Неверный пароль' });
        
        const token = jwt.sign({ id: user._id, phone: user.phone }, SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: user._id, name: user.name, phone: user.phone, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Проверка токена
router.get('/me', async (req, res) => {
    try {
        const token = req.headers['authorization']?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
        
        const decoded = jwt.verify(token, SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
        
        res.json({ user: { id: user._id, name: user.name, phone: user.phone, email: user.email } });
    } catch (err) {
        res.status(401).json({ error: 'Неверный токен' });
    }
});

router.put('/update', async (req, res) => {
    try {
        const token = req.headers['authorization']?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
        const decoded = jwt.verify(token, SECRET);
        await User.findByIdAndUpdate(decoded.id, { name: req.body.name, email: req.body.email });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/change-password', async (req, res) => {
    try {
        const token = req.headers['authorization']?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
        const decoded = jwt.verify(token, SECRET);
        const user = await User.findById(decoded.id);
        const valid = await bcrypt.compare(req.body.current, user.password);
        if (!valid) return res.status(400).json({ error: 'Неверный текущий пароль' });
        user.password = await bcrypt.hash(req.body.new, 10);
        await user.save();
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;