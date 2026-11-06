const express = require('express');
const router = express.Router();
const { sendOrderConfirmation } = require('../email');

router.post('/order-confirmation', async (req, res) => {
    try {
        const { email, order } = req.body;
        if (!email) return res.status(400).json({ error: 'Email не указан' });
        
        await sendOrderConfirmation(email, order);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;