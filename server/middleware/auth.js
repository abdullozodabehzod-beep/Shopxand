const jwt = require('jsonwebtoken');
const SECRET = 'shopxand_secret_key_2024';

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }
    
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Неверный токен' });
    }
}

module.exports = { verifyToken, SECRET };