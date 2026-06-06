const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Заказы пользователя
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json({ orders });
    } catch (err) {
        res.json({ orders: [] });
    }
});

// Создать заказ
router.post('/', async (req, res) => {
    try {
        const order = await Order.create(req.body);
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Обновить статус
router.put('/:id', async (req, res) => {
    try {
        await Order.findOneAndUpdate({ id: req.params.id }, { status: req.body.status });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;