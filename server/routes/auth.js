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
    const { name, phone, email, password } = req.body;
    
    if (!name || !phone || !password) {
        return res.status(400).json({ error: 'Заполните все поля' });
    }
    
    const users = getUsers();
    
    if (users.find(u => u.phone === phone)) {
        return res.status(400).json({ error: 'Номер уже зарегистрирован' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
        id: Date.now().toString(),
        name,
        phone,
        email: email || '',
        password: hashedPassword,
        registeredAt: new Date().toISOString()
    };
    
    users.push(user);
    saveUsers(users);
    
    const token = jwt.sign({ id: user.id, phone: user.phone }, SECRET, { expiresIn: '30d' });
    
    res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email } });
});

// Вход
router.post('/login', async (req, res) => {
    const { phone, password } = req.body;
    
    if (!phone || !password) {
        return res.status(400).json({ error: 'Введите телефон и пароль' });
    }
    
    const users = getUsers();
    const user = users.find(u => u.phone === phone || u.email === phone);
    
    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
        return res.status(401).json({ error: 'Неверный пароль' });
    }
    
    const token = jwt.sign({ id: user.id, phone: user.phone }, SECRET, { expiresIn: '30d' });
    
    res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email } });
});

module.exports = router;