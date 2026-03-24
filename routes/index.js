const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  res.render('index', { title: 'Accueil' })
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard', {title: 'dashboard'});
});

module.exports = router;
