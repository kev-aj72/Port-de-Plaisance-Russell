const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

//model Catway

const Catway = new Schema({
    catwayNumber: {
        type    : Number,
        trim    : true,
        required: [true, 'numero requis'],
        unique  : true,
        min: [1, 'Le numéro de catway doit être supérieur à 0'],
    },
    catwayType: {
        type    : String,
        trim    : true,
        required: [true, 'Nom requis'],
        enum: ['long', 'short'],
    },
    catwayState: {
        type    : String,
        trim    : true,
        required: [true, 'Nom requis'],
    }

    },  {
    timestamps: true
});

module.exports = mongoose.model('catways', Catway);