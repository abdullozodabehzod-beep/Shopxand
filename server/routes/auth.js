const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const SECRET = 'shopxand_secret_key_2024';
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

function getUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Регистрация
router.post('/register', async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;
        const users = getUsers();
        
        if (users.find(u => u.phone === phone)) {
            return res.status(400).json({ error: 'Номер уже зарегистрирован' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { id: Date.now().toString(), name, phone, email: email || '', password: hashedPassword };
        users.push(user);
        saveUsers(users);
        
        const token = jwt.sign({ id: user.id, phone: user.phone }, SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: user.id, name: user.name, phone: user.phone } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Вход
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        const users = getUsers();
        const user = users.find(u => u.phone === phone || u.email === phone);
        
        if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
        
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Неверный пароль' });
        
        const token = jwt.sign({ id: user.id, phone: user.phone }, SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: user.id, name: user.name, phone: user.phone } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

router.get('/me', (req, res) => {
    try {
        var token = req.headers['authorization'];
        if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
        
        var decoded = jwt.verify(token.replace('Bearer ', ''), SECRET);
        console.log('Декодирован токен:', decoded); // ← ДОБАВЬ
        
        var users = getUsers();
        console.log('Пользователи:', users); // ← ДОБАВЬ
        
        var user = users.find(u => u.id === decoded.id);
        console.log('Найден:', user); // ← ДОБАВЬ
        
        if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
        
        res.json({ user: { id: user.id, name: user.name, phone: user.phone, email: user.email } });
    } catch (err) {
        res.status(401).json({ error: 'Неверный токен' });
    }
});