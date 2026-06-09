const mongoose = require('mongoose')

const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: String,
    password: { type: String, required: true },
    shopName: String,
    rating: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Seller', sellerSchema)