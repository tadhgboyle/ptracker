const express = require('express');

let dt = new Date();
let currentMonth = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();

const {ensureAuthenticated, isInstructor, isAdmin} = require('../middleware/checkAuth')

const router = express.Router();

router.get('/dashboard', ensureAuthenticated, (req,res) => {
    res.render('dashboard/dashboard', {
        page: 'dashboard',
    });
});

router.get('/calendar', ensureAuthenticated, (req,res) => {
    res.render('calendar/calendar', {
        page: 'calendar',
        date: currentMonth
    });
});

router.get('/section', isInstructor, (req,res) => {
    res.render('section/overview', {
        page: 'section',
    });
});

router.get('/admin', isAdmin, (req,res) => {
    res.render('admin/overview', {
        page: 'admin',
    });
});

module.exports = router;
