const express = require('express');
const passport = require('passport');

const router = express.Router();

const {ensureAuthenticated, forwardAuthenticated} = require('../middleware/checkAuth')

const FAILURE_LOGIN_URL = 'http://localhost:3000/auth/login/error';

router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/auth/login');
})

router.get('/login', forwardAuthenticated, (req,res) => res.render('auth/login'));

router.get('/google', passport.authenticate('google', {
    scope: [
        'profile',
        'email',
    ]
}));

router.get('/login/error', (req,res) => {
    res.send('Error logging in');
})

router.get('/google/callback', passport.authenticate('google', { failureRedirect: FAILURE_LOGIN_URL }), (req, res) => {
    res.redirect('/homepage');
});

module.exports = router;
