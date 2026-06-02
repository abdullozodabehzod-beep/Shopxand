const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const REVIEWS_FILE = path.join(__dirname, '..', 'data', 'reviews.json');

function getReviews() {
    if (!fs.existsSync(REVIEWS_FILE)) return [];
    return JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf-8'));
}

function saveReviews(reviews) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
}

// Получить все отзывы (для клиентов)
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

// Получить ВСЕ отзывы (для админа)
router.get('/admin', (req, res) => {
    const reviews = getReviews();
    res.json({ reviews: reviews.reverse() });
});

// Добавить отзыв
router.post('/', (req, res) => {
    const { productId, review } = req.body;
    const reviews = getReviews();
    reviews.push({
        productId,
        name: review.name,
        rating: review.rating,
        text: review.text,
        status: 'approved',
        date: new Date().toISOString()
    });
    saveReviews(reviews);
    res.json({ success: true });
});

module.exports = router;