const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const ORDERS_FILE = path.join(__dirname, '..', 'data', 'orders.json');

function getOrders() {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
}

function saveOrders(orders) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

router.get('/', (req, res) => {
    res.json({ orders: getOrders() });
});

router.post('/', (req, res) => {
    const orders = getOrders();
    orders.push(req.body);
    saveOrders(orders);
    res.json({ success: true });
});

module.exports = router;