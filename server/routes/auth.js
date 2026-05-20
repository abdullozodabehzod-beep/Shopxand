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
        
        // ===== ПРОВЕРКА УСТРОЙСТВА =====
        const deviceId = req.body.deviceId || 'unknown';
        const devices = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'devices.json'), 'utf-8') || '{}');
        const userDevices = devices[phone] || [];
        const isNewDevice = !userDevices.includes(deviceId);
        
        if (isNewDevice && user.email) {
            console.log('Уведомление на почту:', user.email, 'Новое устройство');
        }
        
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


// Отправка кода при входе с нового устройства
router.post('/send-code', async (req, res) => {
    const { phone, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.phone === phone);
    
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Неверный пароль' });
    
    // Генерируем код
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Сохраняем код временно
    const codes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'codes.json'), 'utf-8') || '{}');
    codes[phone] = { code, expires: Date.now() + 300000 }; // 5 минут
    fs.writeFileSync(path.join(__dirname, '..', 'data', 'codes.json'), JSON.stringify(codes, null, 2));
    
    // Отправляем код на почту (если есть email)
    if (user.email) {
        console.log('Отправка кода на email:', user.email, 'Код:', code);
        // Здесь интеграция с email-сервисом
    }
    
    // Отправляем в Telegram тебе
    const BOT_TOKEN = '8265957442:AAFWnqXyl8TJJzZXsv3vxXRCuWwWd_aY9mE';
    const CHAT_ID = '5282056467';
    
    fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: '🔐 Код для входа\n📞 ' + phone + '\n👤 ' + user.name + '\n🔑 Код: ' + code
        })
    });
    
    res.json({ success: true, message: 'Код отправлен' });
});

// Проверка кода и вход
router.post('/verify-code', async (req, res) => {
    const { phone, code, deviceId } = req.body;
    const users = getUsers();
    const user = users.find(u => u.phone === phone);
    
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    
    const codes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'codes.json'), 'utf-8') || '{}');
    const savedCode = codes[phone];
    
    if (!savedCode) return res.status(400).json({ error: 'Код не найден' });
    if (Date.now() > savedCode.expires) return res.status(400).json({ error: 'Код истёк' });
    if (savedCode.code !== code) return res.status(400).json({ error: 'Неверный код' });
    
    // Удаляем использованный код
    delete codes[phone];
    fs.writeFileSync(path.join(__dirname, '..', 'data', 'codes.json'), JSON.stringify(codes, null, 2));
    
    // Сохраняем устройство как доверенное
    const devices = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'devices.json'), 'utf-8') || '{}');
    if (!devices[phone]) devices[phone] = [];
    if (!devices[phone].includes(deviceId)) {
        devices[phone].push(deviceId);
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'devices.json'), JSON.stringify(devices, null, 2));
    }
    
    const token = jwt.sign({ id: user.id, phone: user.phone }, SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user.id, name: user.name, phone: user.phone } });
});


