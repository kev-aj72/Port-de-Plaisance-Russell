const Reservation = require('../models/reservation');
const Catways = require('../models/catway');

exports.getAllByCatway = async (req, res) => {
    const catwayId = req.params.id;

    try {
        const catway = await Catways.findOne({ catwayNumber: catwayId });

        if (!catway) {
            return res.status(404).json('catway_not_found');
        }

        const reservations = await Reservation.find({
            catwayNumber: catway.catwayNumber
        });

        return res.status(200).json(reservations);
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.getById = async (req, res, next) => {
    const catwayId = req.params.id;
    const idReservation = req.params.idReservation;

    try {
        const catway = await Catways.findOne({ catwayNumber: catwayId });

        if (!catway) {
            return res.status(404).json('catway_not_found');
        }

        const reservation = await Reservation.findOne({
            _id: idReservation,
            catwayNumber: catway.catwayNumber
        });

        if (!reservation) {
            return res.status(404).json('reservation_not_found');
        }

        return res.status(200).json(reservation);
    } catch (error) {
        return res.status(500).json(error);
    }
};

exports.add = async (req, res) => {
    const catwayNumber = req.params.id;

    try {
        const catway = await Catways.findOne({ catwayNumber: catwayNumber });

        if (!catway) {
            return res.status(404).send('catway_not_found');
        }

        const temp = {
            catwayNumber: catway.catwayNumber,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        };

        await Reservation.create(temp);

        return res.redirect('/app/catways/' + catway._id);
    } catch (error) {
        console.log(error);
        return res.status(500).send('server_error');
    }
};

exports.update = async (req, res) => {
    const catwayId = req.params.id;
    const idReservation = req.params.idReservation;

    try {
        const catway = await Catways.findOne({ catwayNumber: catwayId });

        if (!catway) {
            return res.status(404).json('catway_not_found');
        }

        const reservation = await Reservation.findOne({
            _id: idReservation,
            catwayNumber: catway.catwayNumber
        });

        if (!reservation) {
            return res.status(404).json({ message: 'reservation_not_found' });
        }

        const temp = {
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        };

        Object.keys(temp).forEach((key) => {
            if (temp[key] !== undefined && temp[key] !== null && temp[key] !== '') {
                reservation[key] = temp[key];
            }
        });

        await reservation.save();

        return res.status(200).json({
            message: 'reservation_updated',
            reservation,
            redirect: '/app/catways/' + catway._id
        });
    } catch (error) {
        console.error('Erreur update reservation :', error);
        return res.status(500).json({
            message: 'server_error',
            error: error.message
        });
    }
};

exports.delete = async (req, res) => {
    const catwayId = req.params.id;
    const idReservation = req.params.idReservation;

    try {
        const catway = await Catways.findOne({ catwayNumber: catwayId });

        if (!catway) {
            return res.status(404).json('catway_not_found');
        }

        const reservation = await Reservation.findOneAndDelete({
            _id: idReservation,
            catwayNumber: catway.catwayNumber
        });

        if (!reservation) {
            return res.status(404).json({ message: 'reservation_not_found' });
        }

        return res.status(200).json({
            message: 'reservation_deleted',
            redirect: '/app/catways/' + catway._id
        });
    } catch (error) {
        console.error('Erreur delete reservation :', error);
        return res.status(500).json({
            message: 'server_error',
            error: error.message
        });
    }
};