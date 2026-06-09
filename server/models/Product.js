const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    cat: String,
    price: Number,
    oldPrice: Number,
    img: String,
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    desc: String,
    sizes: [String],
    shoeSizes: [String],
    colors: [String],
    specs: [[String]],
    thumbs: [String],
    inStock: { type: Boolean, default: true },
    brightness: { type: Number, default: 128 },
    // Новые поля для мульти-продавцов
    sellerId: { type: String, required: true },
    sellerName: String,
    commission: { type: Number, default: 10 }, // % комиссии
});

module.exports = mongoose.model('Product', productSchema);