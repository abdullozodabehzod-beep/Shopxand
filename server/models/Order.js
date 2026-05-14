const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    id: { type: String, required: true },
    userId: String,
    customer: {
        name: String,
        phone: String,
        city: String,
        address: String,
        comment: String
    },
    items: [{
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        img: String
    }],
    total: Number,
    status: { type: String, default: 'processing' },
    payment: String,
    delivery: String,
    date: { type: Date, default: Date.now },
    trackSteps: [{
        label: String,
        completed: Boolean,
        current: Boolean
    }]
});

module.exports = mongoose.model('Order', orderSchema);