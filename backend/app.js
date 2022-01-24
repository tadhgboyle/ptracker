const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const app = express();

require('./auth/passportGoogle');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(session({ secret: 'melody hensley is my spirit animal' }));
app.use(passport.initialize());
app.use(passport.session());

const authRouter = require('./routes/authRoutes');

app.use('/auth', authRouter);

app.use((req, res, next) => {
    next(createError(404));
});

module.exports = app;
