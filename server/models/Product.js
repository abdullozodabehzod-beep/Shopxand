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
    specs: [[String]],
    thumbs: [String],
    inStock: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);