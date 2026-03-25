const express = require('express');
const router = express.Router();
const private = require('../middlewares/private');
const Reservations = require('../models/reservation');
const Catways = require('../models/catway');
const User = require('../models/user');


//route frontend checkJWT verifie que l'utilisateur est bien authentifié

//connexion

router.get('/', (req, res) => {
 res.render('index', { title: 'Accueil', error: null })
});

//deconnexion

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.redirect('/');
});

//route dashboard 

router.get('/dashboard', private.checkJWT, async (req, res) => {
  try {
    const today = new Date();

    const reservations = await Reservations.find().sort({catwayNumber: 1}); 

    res.render('dashboard', { title: 'dashboard', user: req.user, today: today.toLocaleDateString('fr-FR'), reservations: reservations });

  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur dashboard');
  }
});

//route page catways

router.get('/app/catways', private.checkJWT, async (req, res) => {
  try {
    const catways = await Catways.find().sort({ catwayNumber: 1});

    res.render('catways', { title: 'Catways', user: req.user, catways: catways });

  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur catways');
  }
});

//route page catway vue individuelle

router.get('/app/catways/:id', private.checkJWT, async (req, res) => {
  try {
    const catway = await Catways.findById(req.params.id);

    if (!catway) {
      return res.status(404).send('Catway non trouvé');
    }

    const reservations = await Reservations.find({ catwayNumber: catway.catwayNumber }).sort({ startDate: 1 });

    res.render('catway', {title: 'Détail du catway', user: req.user, catway: catway, reservations: reservations});
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur catway');
  }
});

//route page reservations 

router.get('/app/reservations', private.checkJWT, async (req, res) => {
   try {
    const reservations = await Reservations.find().sort({ catwayNumber: 1, startDate: 1 });

    res.render('reservations', { title: 'Reservation', user: req.user, reservations: reservations });
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur reservations');
  }
});

//route page reservation vue individuelle

router.get('/app/reservations/:id', private.checkJWT, async (req, res) => {
  try {
    const reservation = await Reservations.findById(req.params.id);

    if (!reservation) {
      return res.status(404).send('Réservation non trouvée');
    }

    const catway = await Catways.findOne({ catwayNumber: reservation.catwayNumber });

    if (!catway) {
      return res.status(404).send('Catway introuvable');
    }

    res.render('reservation', { title: 'Détail de la réservation', user: req.user, reservation: reservation, catway: catway });
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur réservation');
  }
});

//route page utillisateur

router.get('/app/users', private.checkJWT, async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.render('users', { title: 'Users', user: req.user, users: users });
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur users');
  }
});

//route page utillisateur individuelle par email

router.get('/app/users/:email', private.checkJWT, async (req, res) => {
  try {
    const userItem = await User.findOne({ email: req.params.email }).select('-password');

    if (!userItem) {
      return res.status(404).send('Utilisateur introuvable');
    }

    res.render('user', { title: 'Détail utilisateur', user: req.user, userItem: userItem, connectedEmail: req.user.email });
  } catch (error) {
    console.log(error);
    res.status(500).send('Erreur user');
  }
});

   //accée documentation

    router.get('/documentation', (req, res) => {
  res.send('Documentation bientôt disponible');
});

module.exports = router;