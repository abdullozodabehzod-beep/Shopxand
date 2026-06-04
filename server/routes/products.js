const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Схема товара
const ProductSchema = new mongoose.Schema({
    id: String,
    name: String,
    cat: String,
    price: Number,
    oldPrice: Number,
    discount: String,
    img: String,
    rating: Number,
    reviews: Number,
    desc: String,
    sizes: [String],
    shoeSizes: [String],
    specs: [[String]],
    thumbs: [String],
    brightness: Number,
    colors: [mongoose.Schema.Types.Mixed]
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

// Получить все товары
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Добавить товар
router.post('/', async (req, res) => {
    try {
        const product = new Product({
            id: Date.now().toString(),
            ...req.body
        });
        await product.save();
        console.log('✅ Товар сохранён в MongoDB:', product.name);
        res.json({ success: true, product });
    } catch (err) {
        console.error('❌ Ошибка:', err);
        res.status(500).json({ error: err.message });
    }
});

// Удалить товар
router.delete('/:id', async (req, res) => {
    try {
        await Product.deleteOne({ id: req.params.id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Обновить рейтинг
router.put('/:id/rating', async (req, res) => {
    try {
        await Product.updateOne(
            { id: req.params.id },
            { rating: req.body.rating, reviews: req.body.reviews }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;