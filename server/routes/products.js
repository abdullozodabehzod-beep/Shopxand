const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'products.json');

function getProducts() {
    if (!fs.existsSync(PRODUCTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
}

function saveProducts(products) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// Получить все товары
router.get('/', (req, res) => {
    res.json({ products: getProducts() });
});

// Получить один товар
router.get('/:id', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    res.json({ product });
});

// Добавить товар
router.post('/', (req, res) => {
    try {
        const products = getProducts();
        const product = {
            id: Date.now().toString(),
            name: req.body.name || '',
            cat: req.body.cat || 'Одежда',
            price: parseInt(req.body.price) || 0,
            oldPrice: req.body.oldPrice ? parseInt(req.body.oldPrice) : null,
            img: req.body.img || '',
            thumbs: req.body.thumbs || [],
            colors: req.body.colors || [],
            desc: req.body.desc || '',
            sizes: req.body.sizes || [],
            shoeSizes: req.body.shoeSizes || [],
            rating: parseFloat(req.body.rating) || 0,
            reviews: parseInt(req.body.reviews) || 0,
            specs: req.body.specs || [],
            brightness: req.body.brightness || 128,
            inStock: true
        };
        products.push(product);
        saveProducts(products);
        console.log('Товар сохранён:', product.name);
        res.json({ success: true, product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Обновить рейтинг
router.put('/:id/rating', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === req.params.id);
    if (product) {
        product.rating = req.body.rating || product.rating;
        product.reviews = req.body.reviews || product.reviews;
        saveProducts(products);
    }
    res.json({ success: true });
});

// Удалить товар
router.delete('/:id', (req, res) => {
    let products = getProducts();
    products = products.filter(p => p.id !== req.params.id);
    saveProducts(products);
    res.json({ success: true });
});

module.exports = router;