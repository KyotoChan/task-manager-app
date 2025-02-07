const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'channing21!'; // Secret key for JWT

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Verify and decode the token
        req.user = decoded; // Attach user info to the request
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authenticateToken;