const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors   = require ('cors');
const usersService = require('./services/users');
const indexRouter = require('./routes/index');
const userRoute = require('./routes/users');
const catwayRoute = require('./routes/catways');
const reservationRoute = require('./routes/reservations');
const mongodb     = require('./db/mongo');

mongodb.initClientDbConnection();

const app = express();

app.use(cors({
  exposedHeaders: ['Authorization'],
  origin: '*'
}));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.post('/login', usersService.authenticate);

app.use('/users', userRoute);
app.use('/catways', catwayRoute);
app.use('/', reservationRoute);

app.use('/', indexRouter);

app.use(function(req, res, next) {
    res.status(404).json({name: 'API', version: '1.0', status: 404, message: 'not_found'});
});

module.exports = app;
