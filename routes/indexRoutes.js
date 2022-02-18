const express = require('express');

// Authenication measures
const {ensureAuthenticated, isInstructor, isAdmin} = require('../middleware/checkAuth')

const router = express.Router();

const Role = require('../models/Role');
const User = require('../models/User');

router.get('/dashboard', ensureAuthenticated, async (req,res) => {
    res.render('dashboard/dashboard', {
        page: 'dashboard',
    });
});

router.get('/calendar', ensureAuthenticated, (req,res) => {
    res.render('calendar/calendar', {
        page: 'calendar',
    });
});

router.get('/section', isInstructor, async(req,res) => {
    res.render('section/overview', {
        page: 'section',
        students: await User.all(),

    });
});

router.get('/admin', isAdmin, (req,res) => {
    res.render('admin/overview', {
        page: 'admin',
    });
});

module.exports = router;
