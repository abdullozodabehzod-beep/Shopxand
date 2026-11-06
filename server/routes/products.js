const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Папка uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Настройка multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) cb(null, true);
        else cb(new Error('Только изображения (jpeg, jpg, png, webp, gif)'));
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

// GET все товары — формат { products } для React
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ products });
    } catch (err) {
        res.json({ products: [] });
    }
});

// GET один
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Товар не найден' });
        res.json({ product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST добавить (multipart/form-data — с файлом)
router.post('/', upload.single('img'), async (req, res) => {
    try {
        const { name, cat, price, oldPrice, desc } = req.body;

        if (!name || !price || !cat) {
            return res.status(400).json({ error: 'Заполните название, категорию и цену' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Загрузите фото товара' });
        }

        const product = await Product.create({
            name: name.trim(),
            cat: cat.trim(),
            price: Number(price),
            oldPrice: oldPrice ? Number(oldPrice) : null,
            img: '/uploads/' + req.file.filename,
            desc: desc || '',
            inStock: true
        });

        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT обновить (цена, старая цена, название, категория, описание)
router.put('/:id', async (req, res) => {
    try {
        const { price, oldPrice, name, cat, desc } = req.body;
        const update = {};

        if (price !== undefined) update.price = Number(price);
        if (oldPrice !== undefined) update.oldPrice = oldPrice ? Number(oldPrice) : null;
        if (name !== undefined) update.name = name;
        if (cat !== undefined) update.cat = cat;
        if (desc !== undefined) update.desc = desc;

        const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!product) return res.status(404).json({ error: 'Товар не найден' });

        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT рейтинг (сохранено из старого)
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

// DELETE — удаляем товар и файл
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let product = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            product = await Product.findByIdAndDelete(id);
        } else {
            product = await Product.findOneAndDelete({ id: id });
        }

        if (product && product.img && product.img.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '..', product.img);
            if (fs.existsSync(filePath)) {
                try { fs.unlinkSync(filePath); } catch (e) { console.log('Не удалось удалить файл:', e.message); }
            }
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;