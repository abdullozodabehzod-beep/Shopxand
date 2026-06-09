const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Все товары
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ products });
    } catch (err) {
        res.json({ products: [] });
    }
});

// Один товар
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Товар не найден' });
        res.json({ product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Добавить товар
router.post('/', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Обновить рейтинг
router.put('/:id/rating', async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, {
            rating: req.body.rating,
            reviews: req.body.reviews
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Удалить товар
router.delete('/:id', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const id = req.params.id;
        
        // Проверяем валидный ли ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            await Product.findByIdAndDelete(id);
        } else {
            // Если это старый id (строка) — ищем по полю id
            await Product.findOneAndDelete({ id: id });
        }
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;