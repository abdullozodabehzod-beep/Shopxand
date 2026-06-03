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

router.get('/', (req, res) => {
    const reviews = getReviews();
    const grouped = {};
    reviews.forEach(r => {
        if (!grouped[r.productId]) grouped[r.productId] = [];
        grouped[r.productId].push({ name: r.name, rating: r.rating, text: r.text, date: r.date });
    });
    res.json({ reviews: grouped });
});

router.get('/admin', (req, res) => {
    const reviews = getReviews();
    res.json({ reviews: reviews.reverse() });
});


router.post('/', (req, res) => {
    try {
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
        console.log('Отзыв сохранён:', review.name);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;