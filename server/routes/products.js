const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'products.json');

function getProducts() {
    if (!fs.existsSync(PRODUCTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
}

router.get('/', (req, res) => {
    const products = getProducts();
    res.json({ products });
});

router.get('/:id', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Товар не найден' });
    res.json({ product });
});

router.post('/', (req, res) => {
    const products = getProducts();
    const product = { id: Date.now().toString(), ...req.body };
    products.push(product);
    saveProducts(products);
    res.json({ success: true, product: product });
});

module.exports = router;