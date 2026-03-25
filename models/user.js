const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const bcrypt   = require('bcrypt');

//model user

const User = new Schema({
    username: {
        type    : String,
        trim    : true,
        required: [true, 'username requis']
    },
    email: {
        type    : String,
        trim    : true,
        required: [true, 'Email requis'],
        unique  : true,
        
    },
    password: {
        type    : String,
        trim    : true,
        minlength: 6,
        required: [true, 'Mot de passe requis']
    }
    },  {
    timestamps: true
});

//Hash le mot de passe quand il est modifié

User.pre('save', async function() {
    if (!this.isModified('password') || !this.password) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});
module.exports = mongoose.model('User', User);