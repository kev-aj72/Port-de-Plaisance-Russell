const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;


/**
 * Middleware de vérification du token JWT
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */

exports.checkJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/');
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        req.user = decoded.user;

        next();
    } catch (error) {
        return res.redirect('/');
    }
};