var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var usersRouter = require('./routes/users.route');
var authRouter = require('./routes/auth.route');
var guestRouter = require('./routes/guests.route');

var app = express();
require('dotenv').config();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/guests', guestRouter);

module.exports = app;
