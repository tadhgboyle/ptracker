require('dotenv').config();
const createError = require('http-errors');
const path = require('path') // used to make a dynamic route for the 'public' folder

// Express server
const express = require('express');
const cookieSession = require('cookie-session');
const session = require('express-session');
const ejsLayouts = require('express-ejs-layouts');

// middleware and routes
const passport = require('./auth/passport');
const passUser = require('./middleware/passUser');
const flashMessages = require('./middleware/flashMessages');
const ndaChecker = require('./middleware/ndaChecker');
const authRouter = require('./routes/authRoutes');
const indexRouter = require('./routes/indexRoutes');
const shiftRouter = require('./routes/shiftRoutes');
const dataRouter = require('./routes/dataRoutes')
const adminRouter = require('./routes/adminRoutes');
const methodOverride = require('method-override')
// Loggers and cors
const logger = require('morgan');
const cors = require('cors');

const app = express();

require('./auth/passport');
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}

app.use(ejsLayouts)
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
}));

app.use(cors());

app.use(session({
        secret: 'melody hensley is my spirit animal',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        }
    }
));

app.use(passport.initialize());
app.use(passport.session());
app.use(passUser);

app.use(flashMessages);
app.use(ndaChecker);

app.use('/', indexRouter);
app.use('/shifts', shiftRouter);
app.use('/auth', authRouter);
app.use('/data', dataRouter)
app.use('/admin', adminRouter)

app.use((req, res, next) => {
    next(createError(404));
});

module.exports = app;
