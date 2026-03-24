const express = require('express');
const router = express.Router();
const private = require('../middlewares/private');
const Reservations = require('../models/reservation');
const Catways = require('../models/catway');
const Users = require('../models/user');
/* GET home page. */
router.get('/', async (req, res, next) => {
  res.render('index', { title: 'Accueil' })
});

router.get('/catways', private.checkJWT, async (req, res) => {
  try {
    const catways = await Catways.find();

    res.render('catways', {
      title: 'Catways',
      user: req.user,
      catways: catways
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur catways');
  }
});

router.get('/reservations', private.checkJWT, async (req, res) => {
   try {
    const reservations = await Reservations.find();

    res.render('reservations', {
      title: 'Reservation',
      user: req.user,
      reservations: reservations
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur reservations');
  }
});


router.get('/users', private.checkJWT, async (req, res) => {
   try {
    const users = await Users.find();

    res.render('users', {
      title: 'users',
      user: req.user,
      users: users
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur users');
  }
});

router.get('/dashboard', private.checkJWT, async (req, res) => {
  try {
    const today = new Date();

    const reservations = await Reservations.find();

    res.render('dashboard', {
      title: 'dashboard',
      user: req.user,
      today: today.toLocaleDateString('fr-FR'),
      reservations: reservations
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur dashboard');
  }
});

module.exports = router;