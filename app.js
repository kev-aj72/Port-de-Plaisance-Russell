const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors   = require ('cors');

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users',userRoute);
app.use('/catways', catwayRoute);
app.use('/reservations', reservationRoute);
app.use('/', indexRouter);

app.use(function(req, res, next) {
    res.status(404).json({name: 'API', version: '1.0', status: 404, message: 'not_found'});
});

module.exports = app;
