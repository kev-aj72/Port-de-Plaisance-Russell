const Catways = require('../models/catway');


exports.getAllCatway = async (req, res) => {
    try {
        const catways = await Catways.find();
        res.status(200).json(catways);
    } catch (error) {
        res.status(501).json(error);
    }
};

exports.getById = async (req, res, next) => {
    const id = req.params.id

    try {
        let catway = await Catways.findById(id);

        if (catway) {
            return res.status(200).json(catway);
        }

        return res.status(404).json('catway_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.add = async (req, res, next) => {

    const temp = ({
        catwayNumber   : req.body.catwayNumber,
        catwayType     : req.body.catwayType,
        catwayState    : req.body.catwayState
    });

    try {
        let catway = await Catways.create(temp);

        return res.status(201).json(catway);
    } catch (error) {
        console.log(error);
        return res.status(501).json(error);
    }
}

exports.update = async (req, res, next) => {
    const Id = req.params.id
    const temp = ({
        catwayNumber   : req.body.catwayNumber,
        catwayType     : req.body.catwayType,
        catwayState    : req.body.catwayState
    });

    try {
        let catway = await Catways.findOne({_id : Id});
        
        if (catway) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    catway[key] = temp[key];
                }
            });

            await catway.save();
            return res.status(201).json(catway);
        }
        return res.status(404).json('catway_not_found');
    } catch (error) {
        return res.status(501).json(error);
    }
}

exports.delete = async (req, res, next) => {
    const Id = req.params.id
    
    try {
        await Catways.deleteOne({_id : Id});

        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(501).json(error);
    }
}