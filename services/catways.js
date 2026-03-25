const Catways = require('../models/catway');
const Reservation = require('../models/reservation');

//fonction recupérer tous les catways

exports.getAllCatways = async (req, res) => {
    try {
        const catways = await Catways.find();
        return res.status(200).json(catways);
    } catch (error) {
        return res.status(500).json({ message: 'erreur serveur' });
    }
};

//fonction recupérer un catways

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

//fonction ajouté un catways

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

//fonction modifier un catways

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

//fonction supprimer un catways

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