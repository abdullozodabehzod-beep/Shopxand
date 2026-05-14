const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    productId: String,
    name: String,
    rating: Number,
    text: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);