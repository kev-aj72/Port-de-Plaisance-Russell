const Reservation = require('../models/reservation');
const Catways = require('../models/catway');

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

    if (!temp.catwayNumber) {
        return res.status(400).send('catway_required');
    }

    try {
        let reservation = await Reservation.create(temp);
        
         const catway = await Catways.findOne({
            catwayNumber: reservation.catwayNumber
        });

        if (catway) {
            return res.redirect('/app/catways/' + catway._id);
        }

        return res.redirect('/app/reservations');       
    } catch (error) {
        console.log(error);
        return res.status(501).json(error);
    }
}

exports.update = async (req, res, next) => {
    const Id = req.params.id;

    const temp = {
        catwayNumber: req.body.catwayNumber,
        clientName: req.body.clientName,
        boatName: req.body.boatName,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    };

    try {
        let reservation = await Reservation.findOne({ _id: Id });

        if (!reservation) {
            return res.status(404).json({ message: 'reservation_not_found' });
        }

        Object.keys(temp).forEach((key) => {
            if (temp[key] !== undefined && temp[key] !== null && temp[key] !== '') {
                reservation[key] = temp[key];
            }
        });

        await reservation.save();

        const catway = await Catways.findOne({
            catwayNumber: reservation.catwayNumber
        });

        return res.status(200).json({
            message: 'reservation_updated',
            redirect: catway ? '/app/catways/' + catway._id : '/app/reservations'
        });
    } catch (error) {
        console.error('Erreur update reservation :', error);
        return res.status(500).json({
            message: 'server_error',
            error: error.message
        });
    }
};

exports.delete = async (req, res, next) => {
    const Id = req.params.id;

    try {
        const reservation = await Reservation.findOne({ _id: Id });

        if (!reservation) {
            return res.status(404).json({ message: 'reservation_not_found' });
        }

        const catway = await Catways.findOne({
            catwayNumber: reservation.catwayNumber
        });

        await Reservation.deleteOne({ _id: Id });

        return res.status(200).json({
            message: 'reservation_deleted',
            redirect: catway ? '/app/catways/' + catway._id : '/app/reservations'
        });
    } catch (error) {
        console.error('Erreur delete reservation :', error);
        return res.status(500).json({
            message: 'server_error',
            error: error.message
        });
    }
};