const express = require('express');
const router = express.Router();
const service = require('../services/reservations');

router.get('/', service.getAllReservation);
router.get('/:id', service.getById);
router.post('/', service.add);
router.put('/:id', service.update);
router.delete('/:id/delete', service.delete);


module.exports = router;