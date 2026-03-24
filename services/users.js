const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(501).json(error);
    }
};

exports.getByEmail = async (req, res) => {
    const email = req.params.email

    try {
        const user = await User.findOne({email: email }).select('-password');

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json('user_not_found');
    } catch (error) {
        console.log(error);
        return res.status(501).json(error);
    }
}

exports.add = async (req, res) => {

    const temp = ({
        username   : req.body.username,
        email      : req.body.email,
        password   : req.body.password
    });
console.log("Tentative d'ajout d'utilisateur:", temp);
    try {
        let user = await User.create(temp);
 console.log("Utilisateur ajouté avec succès:", user);
        return res.redirect('/users');
    } catch (error) {
         console.error("Erreur lors de l'ajout de l'utilisateur:", error);
        return res.render('index', { error: 'Impossible de créer l utilisateur'});
    }
}

exports.update = async (req, res) => {
    const email = req.params.email;
    
    if (email !== req.user.email) {
        return res.status(403).json({ message: 'forbidden' });
    }

    try {
        let user = await User.findOne({ email: email });
        
        if (!user) {
            return res.status(404).json({ message: 'user_not_found' });
        }

        if (req.body.username && req.body.username.trim() !== '') {
            user.username = req.body.username.trim();
        }

        if (req.body.password && req.body.password.trim() !== '') {
            if (req.body.password.length < 6) {
                return res.status(400).json({ message: 'password_too_short' });
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

        return res.status(200).json({ message: 'user_updated' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'server_error' });
    }
};

exports.delete = async (req, res) => {
    const email = req.params.email;

    if (email !== req.user.email) {
        return res.status(403).json({ message: 'forbidden' });
    }
    
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'user_not_found' });
        }

        await User.deleteOne({ email: email });

        res.clearCookie('token', { path: '/' });

        return res.status(200).json({
            message: 'delete_ok',
            redirect: '/'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'server_error' });
    }
};

exports.authenticate = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email }, '-__v -createdAt -updatedAt');

        if (user) {
            bcrypt.compare(password, user.password, function(err, response) {
                if (err){
                    throw new Error(err);
                }
            if (response) {
                delete user._doc.password;

                const expireIn = 24 * 60 * 60;
                const token    = jwt.sign(
                    {user: user},
                    SECRET_KEY,
                    {expiresIn: expireIn}
                );

        res.cookie('token', token, { httpOnly: true });
        return res.redirect('/dashboard');
            }
        
            return res.render('index', { error: 'Email ou mot de passe incorrect' });
        });
    } else {
        return res.render('index', { error: 'Utilisateur non trouvé' });
    }
} catch (error) {
    return res.status(501).json(error);
}
};