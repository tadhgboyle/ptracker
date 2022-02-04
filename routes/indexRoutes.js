const express = require('express');

const {ensureAuthenticated, isInstructor, isAdmin} = require('../middleware/checkAuth')

const router = express.Router();

let dt = new Date();
let currentDays = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();

router.get('/dashboard', ensureAuthenticated, (req,res) => {
    res.render('dashboard/dashboard', {
        page: 'dashboard',
        days: currentDays,
        monthYear: `${dt.toLocaleString('default', { month: 'long' })}, ${dt.getFullYear()}`,
        year: dt.getFullYear(),
        date: dt
    });
});

router.get('/calendar', ensureAuthenticated, (req,res) => {
    res.render('calendar/calendar', {
        page: 'calendar',
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
