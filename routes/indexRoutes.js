const express = require('express');
const passport = require('passport');

let dt = new Date();
let currentMonth = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();

const {ensureAuthenticated, forwardAuthenticated} = require('../middleware/checkAuth')

const router = express.Router();

router.get('/homepage', ensureAuthenticated, (req,res) => res.render('homepage/homepage'))

router.get('/calendar', ensureAuthenticated, (req,res) => res.render('calendar/calendar', {date: currentMonth}))

module.exports = router;