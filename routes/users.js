const express = require('express');
const router = express.Router();
const service = require('../services/users');
const privateMiddlewares = require('../middlewares/private');

/**
 * Routes utilisateurs
 * @route /users
 */
router.get('/', service.getAllUsers);

/**
 * @route GET /users/:email
 */
router.get('/:email', privateMiddlewares.checkJWT, service.getByEmail);
/**
 * @route POST /users
 */
router.post('/', privateMiddlewares.checkJWT, service.add);
/**
 * @route PUT /users/:email
 */
router.put('/:email', privateMiddlewares.checkJWT, service.update);
/**
 * @route DELETE /users/:email
 */
router.delete('/:email', privateMiddlewares.checkJWT, service.delete);


module.exports = router;