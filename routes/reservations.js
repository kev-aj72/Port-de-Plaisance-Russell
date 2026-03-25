const express = require('express');
const router = express.Router();
const service = require('../services/reservations');

// récupérer toutes les réservations d’un catway
/**
 * @route GET /catways/:id/reservations
 */
router.get('/catways/:id/reservations', service.getAllByCatway);
// récupérer une réservation
/**
 * @route GET /catways/:id/reservations/:idReservation
 */
router.get('/catways/:id/reservations/:idReservation', service.getById);
// créer une réservation
/**
 * @route POST /catways/:id/reservations
 */
router.post('/catways/:id/reservations', service.add);
// modifier une réservation
/**
 * @route PUT /catways/:id/reservations/:idReservation
 */
router.put('/catways/:id/reservations/:idReservation', service.update);
// supprimer une réservation
/**
 * @route DELETE /catways/:id/reservations/:idReservation
 */
router.delete('/catways/:id/reservations/:idReservation', service.delete)


module.exports = router;