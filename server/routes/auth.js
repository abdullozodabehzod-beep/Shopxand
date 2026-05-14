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
        
        const exists = await User.findOne({ phone });
        if (exists) return res.status(400).json({ error: 'Номер уже зарегистрирован' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, phone, email, password: hashedPassword });
        
        const token = jwt.sign({ id: user._id, phone: user.phone }, SECRET, { expiresIn: '30d' });
        
        res.json({ token, user: { id: user._id, name: user.name, phone: user.phone } });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Вход
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ $or: [{ phone }, { email: phone }] });
        
        if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Неверный пароль' });
        
        const token = jwt.sign({ id: user._id, phone: user.phone }, SECRET, { expiresIn: '30d' });
        
        res.json({ token, user: { id: user._id, name: user.name, phone: user.phone } });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

module.exports = router;