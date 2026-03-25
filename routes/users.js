const express = require('express');
const router = express.Router();
const service = require('../services/users');
const private = require('../middlewares/private');

//route users API

router.get('/', service.getAllUsers);
router.get('/:email', private.checkJWT, service.getByEmail);
router.post('/', private.checkJWT, service.add);
router.put('/:email', private.checkJWT, service.update);
router.delete('/:email', private.checkJWT, service.delete);


module.exports = router;