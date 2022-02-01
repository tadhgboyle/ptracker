const express = require('express');

let dt = new Date();
let currentMonth = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();

const {ensureAuthenticated, forwardAuthenticated, isInstructor} = require('../middleware/checkAuth')

const router = express.Router();

router.get('/homepage', ensureAuthenticated, (req,res) => res.render('homepage/homepage'))

router.get('/calendar', ensureAuthenticated, (req,res) => res.render('calendar/calendar', {date: currentMonth}))

router.get('/section', isInstructor, (req,res) => res.render('section/overview'));

module.exports = router;
