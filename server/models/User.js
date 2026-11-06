const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    password: String,
    registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);