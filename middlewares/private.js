const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'monsecret123';

exports.checkJWT = async (req, res, next) => {
    try {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        if (!token) return res.status(401).json({ message: 'token_required' });

        const decoded = jwt.verify(token, SECRET_KEY);
        req.decoded = decoded;

        // Renouvellement du token
        const newToken = jwt.sign({ user: decoded.user }, SECRET_KEY, { expiresIn: 24 * 60 * 60 });
        res.header('Authorization', 'Bearer ' + newToken);

        next();
    } catch (err) {
        console.error('JWT error:', err);
        return res.status(401).json({ message: 'token_not_valid' });
    }
};