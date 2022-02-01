const createError = require('http-errors');

// Express server
const express = require('express');
const cookieSession = require('cookie-session');
const session = require('express-session');
const ejsLayouts = require('express-ejs-layouts');

// middleware and routes
const passport = require('./auth/passport');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

// Loggers and cors
const logger = require('morgan');
const cors = require('cors');

const app = express();

require('./auth/passport');

app.use(logger('dev'));
app.use(ejsLayouts)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
}));
app.set('view engine', 'ejs');
app.use(cors());
app.use(session({
    secret: 'melody hensley is my spirit animal',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }}
));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.render('index', {
        user: {
            name: 'Tadhg Boyle',
            notifications: [
                1, 2, 3
            ],
            notificationsColour: 'orange',
            isInstructor: true,
            isAdmin: false,
        }
    });
});
app.use('/auth', authRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    next(createError(404));
});

module.exports = app;
