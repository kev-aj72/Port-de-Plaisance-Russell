const express = require('express');
const router = express.Router();
const private = require('../middlewares/private');
const Reservations = require('../models/reservation');
const Catways = require('../models/catway');
const User = require('../models/user');



/* GET home page. */
router.get('/', async (req, res, next) => {
 res.render('index', { title: 'Accueil', error: null })
});



router.get('/dashboard', private.checkJWT, async (req, res) => {
  try {
    const today = new Date();

    const reservations = await Reservations.find().sort({catwayNumber: 1}); 

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

router.get('/app/catways', private.checkJWT, async (req, res) => {
  try {
    const catways = await Catways.find().sort({ catwayNumber: 1});

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

router.get('/app/catways/:id', private.checkJWT, async (req, res) => {
  try {
    const catway = await Catways.findById(req.params.id);

    if (!catway) {
      return res.status(404).send('Catway non trouvé');
    }

    const reservations = await Reservations.find({
      catwayNumber: catway.catwayNumber
    }).sort({ startDate: 1 });

    res.render('catway', {
      title: 'Détail du catway',
      user: req.user,
      catway: catway,
      reservations: reservations
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur catway');
  }
});

router.get('/app/reservations', private.checkJWT, async (req, res) => {
   try {
    const reservations = await Reservations.find().sort({
    catwayNumber: 1,
    startDate: 1
});

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

router.get('/app/reservations/:id', private.checkJWT, async (req, res) => {
  try {
    const reservation = await Reservations.findById(req.params.id);

    if (!reservation) {
      return res.status(404).send('Réservation non trouvée');
    }

    res.render('reservation', {
      title: 'Détail de la réservation',
      user: req.user,
      reservation: reservation
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur réservation');
  }
});

router.get('/app/users', private.checkJWT, async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.render('users', {
      title: 'Users',
      user: req.user,
      users: users
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur users');
  }
});

router.get('/app/users/:email', private.checkJWT, async (req, res) => {
  try {
    const userItem = await User.findOne({ email: req.params.email }).select('-password');

    if (!userItem) {
      return res.status(404).send('Utilisateur introuvable');
    }

    res.render('user', {
      title: 'Détail utilisateur',
      user: req.user,
      userItem: userItem,
      connectedEmail: req.user.email
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur user');
  }
});


module.exports = router;