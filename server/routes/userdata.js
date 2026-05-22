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

// Сохранить корзину и избранное
router.post('/sync', (req, res) => {
    try {
   var token = req.headers['authorization']?.replace('Bearer ', '');
   if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
   
   var decoded = jwt.verify(token, SECRET);
   var { cart, favorites } = req.body;
   var allData = getAllData();
   allData[decoded.id] = { cart: cart || [], favorites: favorites || [] };
   saveAllData(allData);
   res.json({ success: true });
    } catch (err) {
   res.status(500).json({ error: err.message });
    }
});

// Загрузить корзину и избранное
router.get('/data', (req, res) => {
    try {
   var token = req.headers['authorization']?.replace('Bearer ', '');
   if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
   
   var decoded = jwt.verify(token, SECRET);
   var allData = getAllData();
   var userData = allData[decoded.id] || { cart: [], favorites: [] };
   res.json(userData);
    } catch (err) {
   res.status(500).json({ error: err.message });
    }
});

module.exports = router;