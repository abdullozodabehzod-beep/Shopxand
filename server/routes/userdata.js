const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const SECRET = 'shopxand_secret_key_2024';
const DATA_FILE = path.join(__dirname, '..', 'data', 'userdata.json');

function getAllData() {
    if (!fs.existsSync(DATA_FILE)) return {};
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveAllData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Middleware проверки токена
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
    try {
        req.user = jwt.verify(token.replace('Bearer ', ''), SECRET);
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Неверный токен' });
    }
}

// Сохранить корзину и избранное
router.post('/sync', verifyToken, (req, res) => {
    const { cart, favorites } = req.body;
    const allData = getAllData();
    allData[req.user.id] = { cart: cart || [], favorites: favorites || [] };
    saveAllData(allData);
    res.json({ success: true });
});

// Загрузить корзину и избранное
router.get('/data', verifyToken, (req, res) => {
    const allData = getAllData();
    const userData = allData[req.user.id] || { cart: [], favorites: [] };
    res.json(userData);
});

module.exports = router;