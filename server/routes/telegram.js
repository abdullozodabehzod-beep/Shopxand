const express = require('express');
const router = express.Router();

router.post('/webhook', (req, res) => {
    const update = req.body;
    console.log('Webhook received:', JSON.stringify(update));
    
    if (update.callback_query) {
        const cb = update.callback_query;
        const data_text = cb.data;
        
        // Здесь обработка кнопок (как в checkTelegramUpdates)
        // ...
    }
    
    res.sendStatus(200);
});

module.exports = router;