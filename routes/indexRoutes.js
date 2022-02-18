const express = require('express');

const {ensureAuthenticated, isInstructor, isAdmin} = require('../middleware/checkAuth')

const router = express.Router();

const User = require('../models/User');

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    res.render('dashboard/dashboard', {
        page: 'dashboard',
    });
});

router.get('/calendar', ensureAuthenticated, (req, res) => {
    res.render('calendar/calendar', {
        page: 'calendar',
    });
});

router.get('/section', isInstructor, async (req, res) => {
    res.render('section/overview', {
        page: 'section',
        students: await User.allInSection(req.user.section.id),
    });
});

router.get('/admin', isAdmin, async (req, res) => {
    res.render('admin/overview', {
        page: 'admin',
        users: await User.all(),
    });
});

module.exports = router;
