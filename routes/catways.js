const express = require('express');
const router = express.Router();
const service = require('../services/catways');

// récupérer tous les catways
/**
 * @route GET /catways
 */
router.get('/', service.getAllCatways);
// récupérer un catway par son numéro
/**
 * @route GET /catways/:id
 */
router.get('/:id', service.getById);
// créer un catway
/**
 * @route POST /catways
 */
router.post('/', service.add);
// modifier un catway
/**
 * @route PUT /catways/:id
 */
router.put('/:id', service.update);
// supprimer un catway
/**
 * @route DELETE /catways/:id
 */
router.delete('/:id', service.delete);


module.exports = router;
