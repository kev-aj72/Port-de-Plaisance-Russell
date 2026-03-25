const express = require('express');
const router = express.Router();
const service = require('../services/reservations');

//route Reservation API

router.get('/catways/:id/reservations', service.getAllByCatway);
router.get('/catways/:id/reservations/:idReservation', service.getById);
router.post('/catways/:id/reservations', service.add);
router.put('/catways/:id/reservations/:idReservation', service.update);
router.delete('/catways/:id/reservations/:idReservation', service.delete)


module.exports = router;