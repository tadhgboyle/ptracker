const express = require('express');

// Prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

// Authenication measures
const {ensureAuthenticated, isInstructor, isAdmin} = require('../middleware/checkAuth')

const router = express.Router();

// Datetime
let dt = new Date();
let currentDays = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();

// Fetching all the users in the database
const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        include: {
            section: true,
            shift: true,
        },
    })
    return users
}


router.get('/dashboard', ensureAuthenticated, async (req,res) => {
    if (req.user.role == 'INSTRUCTOR') {
        res.render('dashboard/dashboardProf', {
            page: 'dashboard',
            days: currentDays,
            monthYear: `${dt.toLocaleString('default', { month: 'long' })}, ${dt.getFullYear()}`,
            year: dt.getFullYear(),
            date: dt,
            students: await getAllUsers()
        });
    } else {
        res.render('dashboard/dashboard', {
            page: 'dashboard',
            days: currentDays,
            monthYear: `${dt.toLocaleString('default', { month: 'long' })}, ${dt.getFullYear()}`,
            year: dt.getFullYear(),
            date: dt
        });
    }
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
