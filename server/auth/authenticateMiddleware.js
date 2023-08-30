const jwt = require('jsonwebtoken');

const authenticateMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verified:', decodedToken);
        
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (error) {
        // Handle token expiration, invalid signature, etc.
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

module.exports = authenticateMiddleware;
