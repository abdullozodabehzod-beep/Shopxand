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

router.post('/', (req, res) => {
    try {
        var orders = getOrders();
        var order = req.body;
        orders.push(order);
        saveOrders(orders);
        console.log('Заказ сохранён:', order.id);
        res.json({ success: true });
    } catch (err) {
        console.error('Ошибка сохранения заказа:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/', (req, res) => {
    const orders = getOrders();
    res.json({ orders });
});

router.get('/admin/all', (req, res) => {
    const orders = getOrders();
    res.json({ orders });
});

module.exports = router;



