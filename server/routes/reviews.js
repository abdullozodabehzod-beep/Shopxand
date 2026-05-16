const express = require('express');
const router = express.Router();
const { getReviews, saveReviews } = require('../models/Review');

// Получить ОДОБРЕННЫЕ отзывы (для клиентов)
router.get('/', (req, res) => {
    const reviews = getReviews();
    const approved = reviews.filter(r => r.status === 'approved');
    const grouped = {};
    approved.forEach(r => {
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

// Добавить отзыв (статус: pending)
router.post('/', (req, res) => {
    try {
        const { productId, review } = req.body;
        const reviews = getReviews();
        reviews.push({
            productId,
            name: review.name,
            rating: review.rating,
            text: review.text,
            status: 'pending',
            date: new Date().toISOString()
        });
        saveReviews(reviews);
        res.json({ success: true, message: 'Отзыв отправлен на модерацию' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== АДМИНСКИЕ РОУТЫ =====

// Получить ВСЕ отзывы
router.get('/admin', (req, res) => {
    const reviews = getReviews();
    res.json({ reviews: reviews.reverse() });
});

// Одобрить
router.put('/:id/approve', (req, res) => {
    const reviews = getReviews();
    const index = reviews.findIndex(r => r.date === req.params.id);
    if (index >= 0) {
        reviews[index].status = 'approved';
        saveReviews(reviews);
    }
    res.json({ success: true });
});

// Отклонить
router.put('/:id/reject', (req, res) => {
    const reviews = getReviews();
    const index = reviews.findIndex(r => r.date === req.params.id);
    if (index >= 0) {
        reviews[index].status = 'rejected';
        saveReviews(reviews);
    }
    res.json({ success: true });
});

// Удалить
router.delete('/:id', (req, res) => {
    let reviews = getReviews();
    reviews = reviews.filter(r => r.date !== req.params.id);
    saveReviews(reviews);
    res.json({ success: true });
});

module.exports = router;