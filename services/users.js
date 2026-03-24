const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(501).json(error);
    }
};

exports.getByEmail = async (req, res) => {
    const email = req.params.email

    try {
        let user = await User.findOne({email: email });

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
        return res.redirect('/');
    } catch (error) {
         console.error("Erreur lors de l'ajout de l'utilisateur:", error);
        return res.render('index', { error: 'Impossible de créer l utilisateur', error});
    }
}

exports.update = async (req, res) => {
    const email = req.params.email
    const temp  = ({
        username   : req.body.username,
        email      : req.body.email,
        password   : req.body.password
    });

    try {
        let user = await User.findOne({email : email});
        
        if (user) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    user[key] = temp[key];
                }
            });

            await user.save();
            return res.status(201).json(user);
        }
        return res.status(404).json('user_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.delete = async (req, res) => {
    const email = req.params.email
    
    try {
        await User.deleteOne({email : email});

        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(501).json(error);
    }
}

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
        
            return res.status(403).json('wrong-credentials');
        });
    } else {
        return res.status(404).json('user_not_found');
    }
} catch (error) {
    return res.status(501).json(error);
}
};