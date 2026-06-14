const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const REVIEWS_FILE = path.join(__dirname, '..', 'data', 'reviews.json');

function getReviews() {
    if (!fs.existsSync(REVIEWS_FILE)) return [];
    try { return JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf-8')); }
    catch (e) { return []; }
}

function saveReviews(reviews) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
}

// GET — все отзывы
router.get('/', (req, res) => {
    const reviews = getReviews();
    const grouped = {};
    reviews.forEach(r => {
        if (!grouped[r.productId]) grouped[r.productId] = [];
        grouped[r.productId].push({ id: r.id, name: r.name, rating: r.rating, text: r.text, date: r.date });
    });
    res.json({ reviews: grouped });
});

// POST — добавить отзыв
router.post('/', (req, res) => {
    const { productId, review } = req.body;
    const reviews = getReviews();
    const newReview = {
        id: Date.now().toString(),
        productId,
        name: review.name || 'Гость',
        rating: review.rating || 5,
        text: review.text || '',
        date: new Date().toISOString()
    };
    reviews.push(newReview);
    saveReviews(reviews);
    res.json({ success: true, review: newReview });
});

// DELETE — удалить
router.delete('/:id', (req, res) => {
    let reviews = getReviews();
    reviews = reviews.filter(r => r.id !== req.params.id);
    saveReviews(reviews);
    res.json({ success: true });
});

module.exports = router;