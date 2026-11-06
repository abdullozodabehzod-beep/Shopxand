const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users — список всех пользователей (без паролей)
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ registeredAt: -1 });
        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;