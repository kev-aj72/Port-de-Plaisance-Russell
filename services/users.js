const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY

/**
 * Récupère tous les utilisateurs sans leur mot de passe.
 * @route GET /users
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'erreur serveur' });
    }
};

/**
 * Récupère un utilisateur par son email.
 * @route GET /users/:email
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.email - Email de l'utilisateur
 * @param {Object} res - Réponse Express
 */

exports.getByEmail = async (req, res) => {
    const email = req.params.email

    try {
        const user = await User.findOne({email: email }).select('-password');

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(500).json({ message: 'erreur serveur' });
    }
}

/**
 * Crée un nouvel utilisateur.
 * @route POST /users
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.username - Nom de l'utilisateur
 * @param {string} req.body.email - Email de l'utilisateur
 * @param {string} req.body.password - Mot de passe de l'utilisateur
 * @param {Object} res - Réponse Express
 */

exports.add = async (req, res) => {

    const temp = ({
        username   : req.body.username,
        email      : req.body.email,
        password   : req.body.password
    });

    try {
        if (!req.body.password || req.body.password.length < 6) {
            return res.send('6 caractères minimum');
        }
        await User.create(temp);

        return res.redirect('/app/users');
    } catch (error) {
         return res.status(500).json({ message: 'erreur serveur' });
    }
}

/**
 * Modifie un utilisateur.
 * @route PUT /users/:email
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.email - Email de l'utilisateur à modifier
 * @param {Object} req.body - Corps de la requête
 * @param {string} [req.body.username] - Nouveau nom d'utilisateur
 * @param {string} [req.body.password] - Nouveau mot de passe
 * @param {Object} res - Réponse Express
 */

exports.update = async (req, res) => {
    const email = req.params.email;
    
    if (email !== req.user.email) {
        return res.status(403).json({ message: 'Vous ne pouvez accéder qu’à vos propres informations' });
    }

    try {
        let user = await User.findOne({ email: email });
        
        if (!user) {
            return res.status(404).json({ message: 'user non trouvé' });
        }

        if (req.body.username && req.body.username.trim() !== '') {
            user.username = req.body.username.trim();
        }

        if (req.body.password && req.body.password.trim() !== '') {
            if (req.body.password.length < 6) {
                return res.status(400).json({ message: 'password trop court' });
            }

                user.password = req.body.password;
        }

        await user.save();

        const userObj = user.toObject();
        delete userObj.password;

        const token = jwt.sign(
            { user: userObj },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, { httpOnly: true });

        return res.status(200).json({ message: 'user updated' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'erreur serveur' });
    }
};

/**
 * Supprime un utilisateur.
 * @route DELETE /users/:email
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.email - Email de l'utilisateur à supprimer
 * @param {Object} res - Réponse Express
 */

exports.delete = async (req, res) => {
    const email = req.params.email;

    if (email !== req.user.email) {
        return res.status(403).json({ message: 'erreur' });
    }
    
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'user non trouvé' });
        }

        await User.deleteOne({ email: email });

        res.clearCookie('token', { path: '/' });

        return res.status(200).json({ message: 'delete_ok', redirect: '/' });
    } catch (error) {
        return res.status(500).json({ message: 'erreur serveur' });
    }
};

/**
 * Authentifie un utilisateur.
 * @route POST /users/authenticate
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.email - Email de l'utilisateur
 * @param {string} req.body.password - Mot de passe de l'utilisateur
 * @param {Object} res - Réponse Express
 */

exports.authenticate = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne(
            { email: email },
            '-__v -createdAt -updatedAt'
        );

        if (!user) {
            return res.render('index', { title: 'Accueil', error: 'Utilisateur non trouvé' });
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.render('index', { title: 'Accueil', error: 'Email ou mot de passe incorrect' });
        }

        const userObj = user.toObject();
        delete userObj.password;

        const expireIn = 24 * 60 * 60;
        const token = jwt.sign(
            { user: userObj },
            SECRET_KEY,
            { expiresIn: expireIn }
        );

        res.cookie('token', token, { httpOnly: true });

        return res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'erreur serveur' });
    }
};