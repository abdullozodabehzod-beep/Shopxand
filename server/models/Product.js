const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    cat: String,
    price: Number,
    oldPrice: Number,
    img: String,
    desc: String,
    material: String,
    season: String,
    style: String,
    sizes: [String],
    shoeSizes: [String],
    colors: [String],
    thumbs: [String],
    thumbPrices: [Number],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    specs: [[String]],
    brightness: { type: Number, default: 128 },
    inStock: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);