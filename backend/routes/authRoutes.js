const express = require('express');
const passport = require('passport');

const router = express.Router();

// port 3000 is our React app
const SUCCESS_LOGIN_URL = 'http://localhost:3000';
const FAILURE_LOGIN_URL = 'http://localhost:3000/login/error';

router.get('/google', passport.authenticate('google', {
    scope: [
        'profile',
        'email',
    ]
}));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: FAILURE_LOGIN_URL,
}), (req, res) => {
    res.redirect(SUCCESS_LOGIN_URL);
});

module.exports = router;
