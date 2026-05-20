const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'products.json');

function getProducts() {
    try {
        if (!fs.existsSync(PRODUCTS_FILE)) return [];
        return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
    } catch (err) {
        console.error('Ошибка чтения:', err);
        return [];
    }
}

function saveProducts(products) {
    try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
        console.log('Файл сохранён');
    } catch (err) {
        console.error('Ошибка сохранения:', err);
    }
}

router.get('/', (req, res) => {
    res.json({ products: getProducts() });
});

router.post('/', (req, res) => {
    try {
        var products = getProducts();
        var product = { id: Date.now().toString(), ...req.body };
        products.push(product);
        saveProducts(products);
        console.log('Товар сохранён:', product.name);
        res.json({ success: true, product: product });
    } catch (err) {
        console.error('Ошибка:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;