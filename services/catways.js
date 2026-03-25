const Catways = require('../models/catway');
const Reservation = require('../models/reservation');

/**
 * Récupère tous les catways.
 * @route GET /catways
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */

exports.getAllCatways = async (req, res) => {
    try {
        const catways = await Catways.find();
        return res.status(200).json(catways);
    } catch (error) {
        return res.status(500).json({ message: 'erreur serveur' });
    }
};

/**
 * Récupère un catway par son numéro.
 * @route GET /catways/:id
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - Numéro du catway
 * @param {Object} res - Réponse Express
 */

exports.getById = async (req, res) => {
    const id = Number (req.params.id);

    try {
        const catway = await Catways.findOne({ catwayNumber: id });

        if (catway) {
            return res.status(200).json(catway);
        }

        return res.status(404).json('catway non trouvé');
    } catch (error) {
        return res.status(500).json({ message: 'erreur serveur' });
    }
};

/**
 * Ajoute un nouveau catway.
 * @route POST /catways
 * @param {Object} req - Requête Express
 * @param {Object} req.body - Corps de la requête
 * @param {number} req.body.catwayNumber - Numéro du catway
 * @param {string} req.body.catwayType - Type du catway
 * @param {string} req.body.catwayState - État du catway
 * @param {Object} res - Réponse Express
 */

exports.add = async (req, res) => {
    const temp = {
        catwayNumber: req.body.catwayNumber,
        catwayType: req.body.catwayType,
        catwayState: req.body.catwayState
    };

    try {
        const existing = await Catways.findOne({ catwayNumber: temp.catwayNumber });

        if (existing) {
            return res.status(400).send('Ce numéro de catway existe déjà');
        }

        await Catways.create(temp);
        return res.redirect('/app/catways');
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'erreur serveur' });
    }
};

/**
 * Modifie l’état d’un catway.
 * @route PUT /catways/:id
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - Numéro du catway
 * @param {Object} req.body - Corps de la requête
 * @param {string} [req.body.catwayState] - Nouvel état du catway
 * @param {Object} res - Réponse Express
 */

exports.update = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const catway = await Catways.findOne({ catwayNumber: id });

        if (!catway) {
            return res.status(404).json({ message: 'catway non trouvé' });
        }

        if (req.body.catwayState) {
            catway.catwayState = req.body.catwayState;
        }

        await catway.save();

        return res.status(200).json({ message: 'update ok' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'erreur serveur' });
    }
};

/**
 * Supprime un catway et ses réservations associées.
 * @route DELETE /catways/:id
 * @param {Object} req - Requête Express
 * @param {Object} req.params - Paramètres de la requête
 * @param {string} req.params.id - Numéro du catway
 * @param {Object} res - Réponse Express
 */

exports.delete = async (req, res) => {
    const id = Number (req.params.id);

    try {
        const catway = await Catways.findOne({ catwayNumber: id });

        if (!catway) {
            return res.status(404).json({ message: 'catway non trouvé' });
        }

        await Reservation.deleteMany({
            catwayNumber: catway.catwayNumber
        });

        await Catways.deleteOne({ catwayNumber: id });

        return res.status(200).json({ message: 'delete ok' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'erreur serveur' });
    }
};