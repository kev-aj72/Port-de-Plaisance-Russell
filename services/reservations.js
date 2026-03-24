const Reservation = require('../models/reservation');

exports.getAllReservation = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(501).json(error);
    }
};

exports.getById = async (req, res, next) => {
    const id = req.params.id

    try {
        let reservation = await Reservation.findById(id);

        if (reservation) {
            return res.status(200).json(reservation);
        }
       
        return res.status(404).json('reservation_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.add = async (req, res, next) => {

    const temp = ({
        catwayNumber   : req.body.catwayNumber,
        clientName     : req.body.clientName,
        boatName       : req.body.boatName,
        startDate      : req.body.startDate,
        endDate        : req.body.endDate
    });

    try {
        let reservation = await Reservation.create(temp);

        return res.status(201).json(reservation);
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.update = async (req, res, next) => {
    const Id = req.params.id
    const temp = ({
        catwayNumber   : req.body.catwayNumber,
        clientName     : req.body.clientName,
        boatName       : req.body.boatName,
        startDate      : req.body.startDate,
        endDate        : req.body.endDate
    });

    try {
        let reservation = await Reservation.findOne({_id : Id});
        
        if (reservation) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    reservation[key] = temp[key];
                }
            });

            await reservation.save();
            return res.status(201).json(reservation);
        }
        return res.status(404).json('reservation_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.delete = async (req, res, next) => {
    const Id = req.params.id
    
    try {
        await Reservation.deleteOne({_id : Id});

        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(501).json(error);
    }
}