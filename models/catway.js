const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

/**
 * Schéma catway
 * @typedef {Object} Catway
 * @property {number} catwayNumber
 * @property {string} catwayType
 * @property {string} catwayState
 */

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