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
        return res.status(201).json(user);
    } catch (error) {
         console.error("Erreur lors de l'ajout de l'utilisateur:", error);
        return res.status(501).json(error);
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

exports.authenticate = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        console.log("Body reçu:", req.body);

        const user = await User.findOne({ email }, '-__v -createdAt -updatedAt');
        console.log("User trouvé:", user);
        if (!user) return res.status(404).json({ message: 'user_not_found' });

        console.log("Password stocké:", user.password);
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(403).json({ message: 'wrong_credentials' });

        const userObj = user.toObject();
        delete userObj.password;

        console.log("SECRET_KEY:", SECRET_KEY);
        const token = jwt.sign({ user: userObj }, SECRET_KEY, { expiresIn: '24h' });

        res.header('Authorization', 'Bearer ' + token);
        return res.status(200).json({ message: 'authenticate_succeed', token });

    } catch (error) {
        console.error("Erreur authenticate:", error);
        return res.status(500).json({ message: 'server_error', error: error.message });
    }
};