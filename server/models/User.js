const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, default: '' },
    password: { type: String, required: true },
    telegramId: { type: String, default: null },
    registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);