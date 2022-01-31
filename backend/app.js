const createError = require('http-errors');
const path = require('path')

//Express server
const express = require('express');
const cookieSession = require('cookie-session');
const session = require('express-session');
const ejsLayouts = require('express-ejs-layouts');

//middleware and routes
const passport = require('./auth/passport');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

//Loggers, cors, and swagger
const logger = require('morgan');
const cors = require('cors');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Nurse Joy API',
            version: '0.1.0',
            description: 'The API for Nurse Joy',
        },
    },
    apis: ['./routes/*.js'],
};

const openapiSpecification = swaggerJsdoc(options);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiSpecification)
);

app.use('/auth', authRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    next(createError(404));
});

module.exports = app;
