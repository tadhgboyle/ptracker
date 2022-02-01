const express = require('express');
const passport = require('passport');

const {ensureAuthentication} = require('../middleware/checkAuth')

const router = express.Router();

router.get('/homepage', (req,res) => res.render('homepage/homepage'))

router.get('/calendar', (req,res) => res.render('calendar/calendar'))

module.exports = router;