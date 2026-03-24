const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const Reservation = new Schema({
    catwayNumber: {
        type    : Number,
        trim    : true,
        required: [true, 'numero requis'],
        min: [1, 'Le numéro de catway doit être supérieur à 0'],
    },
    clientName: {
        type    : String,
        trim    : true,
        required: [true, 'Nom requis'],
    },
    boatName: {
        type    : String,
        trim    : true,
        required: [true, 'Nom requis'],
    },
    startDate: {
        type    : Date,
        required: [true, 'Date requis'],
    },
    endDate: {
        type    : Date,
        required: [true, 'Date requis'],
    }
},  {
    timestamps: true
});

module.exports = mongoose.model('reservations', Reservation);