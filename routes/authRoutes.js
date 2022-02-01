const express = require('express');
const passport = require('passport');

const {ensureAuthentication} = require('../middleware/checkAuth')

const router = express.Router();

// port 3000 is our React app
const SUCCESS_LOGIN_URL = 'http://localhost:3000/login/success';
const FAILURE_LOGIN_URL = 'http://localhost:3000/login/error';
const URL = 'http://localhost:3000';

router.get('/logout', (req,res) => {
    req.logout();
    res.redirect(`${URL}/login`)
})

router.get('/google', passport.authenticate('google', {
    scope: [
        'profile',
        'email',
    ]
}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: FAILURE_LOGIN_URL }), (req, res) => {
    return res.redirect(SUCCESS_LOGIN_URL);
});

module.exports = router;
