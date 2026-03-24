const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'monsecret123';

exports.checkJWT = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/');
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.redirect('/');
        }

        req.user = decoded.user;

        next();
    });
};