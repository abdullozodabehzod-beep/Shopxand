const express = require('express');
const router = express.Router();
const { getReviews, saveReviews } = require('../models/Review');

// Получить все отзывы
router.get('/', (req, res) => {
    const reviews = getReviews();
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
});

// Добавить отзыв (сразу одобрен)
router.post('/', (req, res) => {
    const { productId, review } = req.body;
    const reviews = getReviews();
    reviews.push({
        productId,
        name: review.name,
        rating: review.rating,
        text: review.text,
        status: 'approved', // ← сразу одобрен
        date: new Date().toISOString()
    });
    saveReviews(reviews);
    res.json({ success: true });
});

module.exports = router;