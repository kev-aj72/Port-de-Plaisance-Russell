const Reservation = require('../models/reservation');
const Catways = require('../models/catway');

/**
 * Récupère toutes les réservations d’un catway.
 * @route GET /catways/:id/reservations
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - Numéro du catway
 * @param {Object} res - Réponse Express
 */

exports.getAllByCatway = async (req, res) => {
    const catwayId = req.params.id;

    try {
        const catway = await Catways.findOne({ catwayNumber: catwayId });

        if (!catway) {
            return res.status(404).json('catway non trouvé');
        }

        const reservations = await Reservation.find({ catwayNumber: catway.catwayNumber });

        return res.status(200).json(reservations);
    } catch (error) {
        return res.status(500).json({ message: 'erreur serveur' });
    }
};

/**
 * Récupère une réservation par son identifiant pour un catway donné.
 * @route GET /catways/:id/reservations/:idReservation
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - Numéro du catway
 * @param {string} req.params.idReservation - Identifiant de la réservation
 * @param {Object} res - Réponse Express
 */

exports.getById = async (req, res, next) => {
    const catwayId = req.params.id;
    const idReservation = req.params.idReservation;

    try {
        const catway = await Catways.findOne({ catwayNumber: catwayId });

        if (!catway) {
            return res.status(404).json('catway non trouvé');
        }

        const reservation = await Reservation.findOne({ _id: idReservation, catwayNumber: catway.catwayNumber });

        if (!reservation) {
            return res.status(404).json('reservation_not_found');
        }

        return res.status(200).json(reservation);
    } catch (error) {
        return res.status(500).json({ message: 'erreur serveur' });
    }
};

/**
 * Crée une réservation pour un catway.
 * @route POST /catways/:id/reservations
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - Numéro du catway
 * @param {Object} req.body - Corps de la requête
 * @param {string} req.body.clientName - Nom du client
 * @param {string} req.body.boatName - Nom du bateau
 * @param {string} req.body.startDate - Date de début
 * @param {string} req.body.endDate - Date de fin
 * @param {Object} res - Réponse Express
 */

exports.add = async (req, res) => {
    const catwayNumber = req.params.id;

    try {
        const catway = await Catways.findOne({ catwayNumber: catwayNumber });

        if (!catway) {
            return res.status(404).send('catway non trouvé');
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
        
        return res.status(500).send({ message: 'erreur serveur' });
    }
};

/**
 * Modifie une réservation d’un catway.
 * @route PUT /catways/:id/reservations/:idReservation
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - Numéro du catway
 * @param {string} req.params.idReservation - Identifiant de la réservation
 * @param {Object} req.body - Corps de la requête
 * @param {string} [req.body.clientName] - Nom du client
 * @param {string} [req.body.boatName] - Nom du bateau
 * @param {string} [req.body.startDate] - Date de début
 * @param {string} [req.body.endDate] - Date de fin
 * @param {Object} res - Réponse Express
 */

exports.update = async (req, res) => {
    const catwayId = req.params.id;
    const idReservation = req.params.idReservation;

    try {
        const catway = await Catways.findOne({ catwayNumber: catwayId });

        if (!catway) {
            return res.status(404).json('catway non trouvé');
        }

        const reservation = await Reservation.findOne({ _id: idReservation, catwayNumber: catway.catwayNumber });

        if (!reservation) {
            return res.status(404).json({ message: 'reservation non trouvé' });
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

        return res.status(200).json({ message: 'reservation_updated', reservation, redirect: '/app/catways/' + catway._id });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'erreur serveur' });
    }
};

/**
 * Supprime une réservation d’un catway.
 * @route DELETE /catways/:id/reservations/:idReservation
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - Numéro du catway
 * @param {string} req.params.idReservation - Identifiant de la réservation
 * @param {Object} res - Réponse Express
 */

exports.delete = async (req, res) => {
    const catwayId = req.params.id;
    const idReservation = req.params.idReservation;

    try {
        const catway = await Catways.findOne({ catwayNumber: catwayId });

        if (!catway) {
            return res.status(404).json('catway non touvé');
        }

        const reservation = await Reservation.findOneAndDelete({ _id: idReservation, catwayNumber: catway.catwayNumber });

        if (!reservation) {
            return res.status(404).json({ message: 'réservation non trouvé' });
        }

        return res.status(200).json({ message: 'reservation_deleted', redirect: '/app/catways/' + catway._id});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'erreur serveur' });
    }
};