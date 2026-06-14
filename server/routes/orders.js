const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const ORDERS_FILE = path.join(__dirname, '..', 'data', 'orders.json');

function getOrders() {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    try { return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8')); }
    catch (e) { return []; }
}

function saveOrders(orders) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// Все заказы
router.get('/', (req, res) => {
    res.json({ orders: getOrders() });
});

// Создать заказ
router.post('/', (req, res) => {
    const orders = getOrders();
    const order = req.body;
    orders.unshift(order);
    saveOrders(orders);
    res.json({ success: true, order });
});

// Обновить статус
router.put('/:id', (req, res) => {
    const orders = getOrders();
    const order = orders.find(o => o.id === req.params.id);
    if (order) {
        order.status = req.body.status;
        saveOrders(orders);
    }
    res.json({ success: true });
});

// Удалить заказ
router.delete('/:id', (req, res) => {
    let orders = getOrders();
    orders = orders.filter(o => o.id !== req.params.id);
    saveOrders(orders);
    res.json({ success: true });
});

module.exports = router;