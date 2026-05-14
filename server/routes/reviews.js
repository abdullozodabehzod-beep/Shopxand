const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Получить все отзывы (глобально)
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find();
        const grouped = {};
        reviews.forEach(r => {
            if (!grouped[r.productId]) grouped[r.productId] = [];
            grouped[r.productId].push({
                name: r.name,
                rating: r.rating,
                text: r.text,
                date: r.date
            });
        });
        res.json({ reviews: grouped });
    } catch (err) {
        res.json({ reviews: {} });
    }
});

// Добавить отзыв
router.post('/', async (req, res) => {
    try {
        const { productId, review } = req.body;
        await Review.create({
            productId,
            name: review.name,
            rating: review.rating,
            text: review.text
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка сохранения' });
    }
});

module.exports = router;