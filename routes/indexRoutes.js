const express = require('express');

// Prisma
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

// Authentication
const {ensureAuthenticated, isInstructor} = require('../middleware/checkAuth')

// Date
const date = new Date()

// User and Section classes
const User = require('../models/user');
const Section = require('../models/section');
const Site = require('../models/site')

// Router
const router = express.Router();

const getShifts = (shifts) => {
    const shiftsPerMonth = [];
    const currentMonthYear = `${convertMonth(date.getMonth())} ${date.getFullYear()}`
    if (shifts.length === 0) {
        return 0;
    }

    for (const shift of shifts) {
        const shiftMonth = new Date(shift.date)
        const monthYear = `${convertMonth(shiftMonth.getMonth())} ${shiftMonth.getFullYear()}`
        if (monthYear === currentMonthYear) {
            shiftsPerMonth.push(shift)
        }
    }
    return shiftsPerMonth;
}

const convertMonth = (monthNum) => {
    return [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ][monthNum];
}

const findNameOfSite = async (siteId) => {
    const findSite = await prisma.site.findUnique({
        where: {
            id: parseInt(siteId)
        }
    })

    return findSite.name;
}

const findMainSite = async (shifts) => {
    // Checks to see which site they are work at the most (basically checking what their main site is)
    const numOfShifts = {};
    let siteNum = [];
    for (const shift of shifts) {
        // console.log(Object.keys(numOfShifts).length)
        if (numOfShifts[shift.siteId] === undefined && shift.status !== 'DELETED') {
            numOfShifts[shift.siteId] = 1;
        } else {
            if (shift.status !== 'DELETED') {
                numOfShifts[shift.siteId] += 1;
            }
        }
    }
    for (const [key, value] of Object.entries(numOfShifts)) {
        if (siteNum.length === 0) {
            siteNum.push(key);
            siteNum.push(value);
        } else {
            if (value > siteNum[1]) {
                siteNum[0] = key;
                siteNum[1] = value;
            }
        }
    }
    if (siteNum.length !== 0) {
        return await findNameOfSite(parseInt(siteNum[0]));
    } else {
        return undefined;
    }
}

router.get('/nda', ensureAuthenticated, (req, res) => {
    req.session.error_message = 'You must accept the NDA to continue.';
    req.session.error_perm = true;

    res.render('nda', {
        page: 'nda',
    });
});

router.get('/pendingSection', ensureAuthenticated, (req, res) => {
    if (req.user.section.id !== 1) {
        // if they get assigned a section and then reload the page
        return res.redirect('/dashboard');
    }

    res.render('pendingSection', {
        page: 'assign',
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

router.get('/calendar', ensureAuthenticated, async (req, res) => {
    res.render('calendar/calendar', {
        page: 'calendar',
        sites: await Site.all(),
        mainSite: await findMainSite(req.user.shifts),
    });
});

router.get('/section', [ensureAuthenticated, isInstructor], async (req, res) => {
    const section = await Section.whereIsInstructor(req.user.id);
    if (!section) {
        req.session.error_message = 'You are not assigned to a section.';
        res.redirect(req.header('Referer') || '/dashboard');
    } else if (section.id === 1) {
        req.session.error_message = 'You are assigned to an invalid section. Please contact an administrator.';
        res.redirect(req.header('Referer') || '/dashboard');
    } else {
        res.render('section/overview', {
            page: 'section',
            sectionName: section.name,
            sectionId: section.id,
            students: await User.allInSection(section.id),
        });
    }
});

router.get('/update/:id', ensureAuthenticated, async (req, res) => {
    const studentId = parseInt(req.params.id)
    const findUser = await User.find(studentId)
    const allShifts = getShifts(findUser.shifts)
    res.render('section/updateStudent', {
        page: 'section',
        student: findUser,
        shifts: allShifts,
        sites: await Site.all(),
    });
})

router.post('/update/:id', async (req, res) => {
    const studentId = parseInt(req.params.id)
    const findUser = await User.find(studentId)
    for (const num in req.body.shiftID) {
        // Checks if there is only one element in req.body
        if (typeof(req.body.shiftID) === "string") {
            await prisma.shift.update({
                where: {
                    id: parseInt(req.body.shiftID)
                },
                data: {
                    date: new Date(req.body.date),
                    type: req.body.shiftType,
                    siteId: parseInt(req.body.site),
                }
            })
        } else {
            // If it's an array, that means theres two or more shifts that needs to get updated
            await prisma.shift.update({
                where: {
                    id: parseInt(req.body.shiftID[num])
                },
                data: {
                    date: new Date(req.body.date[num]),
                    type: req.body.shiftType[num],
                    siteId: parseInt(req.body.site[num]),
                }
            })
        }
    }

    if (req.body.date !== undefined) {
        req.session.success_message = `Shift updated successfully on ${req.body.date} for ${findUser.name}!`;
    }

    res.redirect('/section')
})


router.get('/addSite', ensureAuthenticated, async (req, res) => {
    res.render('admin/addSite', {
        page: 'admin',
    });
})

router.post('/addSite', ensureAuthenticated, async (req, res) => {
    if (req.body.site.length !== 0) {
        await Site.create(req.body)
    } else {
        req.session.error_message = `You must input a valid site`;
    }
    res.redirect('/admin')
})

router.post('/sectionDelete/:studentId', isInstructor, async (req, res) => {
    await prisma.user.update({
        where: {
            id: parseInt(req.params.studentId)
        },
        data: {
            sectionId: 1
        }
    })
    res.redirect('/section')
})

router.post('/section/shiftDelete/:studentId/:shiftId', isInstructor, async (req, res) => {
    await prisma.shift.update({
        where: {
            id: parseInt(req.params.shiftId)
        },
        data: {
            status: 'DELETED',
        }
    });
    res.redirect(`/update/${parseInt(req.params.studentId)}`)
})

module.exports = router;
