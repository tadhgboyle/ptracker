const express = require('express');

const {ensureAuthenticated, isInstructor, isAdmin} = require('../middleware/checkAuth')

const router = express.Router();

const User = require('../models/User');
const Section = require('../models/Section');

router.get('/nda', ensureAuthenticated, (req, res) => {
    req.session.error_message = 'You must accept the NDA to continue.';
    req.session.error_perm = true;

    res.render('nda', {
        page: 'nda',
    });
});

router.post('/nda', ensureAuthenticated, async (req, res) => {
    if (req.body.secret_nda_thing === 'yes-i-actually-used-the-button') {
        await User.update(req.user.id, {
            acceptedNda: true
        });

        req.session.success_message = 'Thanks for accepting the NDA!';
    }

    return res.redirect('/dashboard');
});

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
        sections: await Section.all(),
    });
});

module.exports = router;
