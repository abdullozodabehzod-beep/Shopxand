const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    res.json({ success: true, message: 'Сообщение отправлено' });
});

module.exports = router;