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
    const orders = getOrders();
    const order = {
   id: 'SX-' + Date.now().toString().slice(-8),
   ...req.body,
   status: 'processing',
   date: new Date().toISOString()
    };
    orders.push(order);
    saveOrders(orders);
    res.json({ order });
});

router.get('/', (req, res) => {
    const orders = getOrders();
    res.json({ orders });
});

module.exports = router;



// Получить ВСЕ заказы (для админа)
router.get('/admin/all', async (req, res) => {
    try {
   const orders = await Order.find().sort({ date: -1 });
   res.json({ orders });
    } catch (err) {
   res.json({ orders: [] });
    }
});