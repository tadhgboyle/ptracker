const express = require('express');
const router = express.Router();

const {check, validationResult} = require("express-validator");

const User = require("../models/user");
const Section = require("../models/section");
const Shift = require("../models/shift");
const Site = require("../models/site")

const {ensureAuthenticated, isAdmin, isInstructor} = require("../middleware/checkAuth");

const adminController = require("../controllers/adminController");

router.get('/', [ensureAuthenticated, isAdmin], async (req, res) => {
    res.render('admin/overview', {
        page: 'admin',
        users: await User.all(),
        sections: await Section.all(),
        sites: await Site.all(),
    });
});

router.get('/resetPtracker', [ensureAuthenticated, isAdmin], (req, res) => {
    res.render('admin/resetPtracker', {
        page: 'admin'
    })
})

router.post('/deletePtrackerData', [ensureAuthenticated, isAdmin], async(req, res) => {
    return adminController.resetPtracker(req, res)
})

router.post(
    '/changeRole',
    [
        check('userId').isInt(),
        check('role').isIn(['STUDENT', 'INSTRUCTOR', 'ADMIN']),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            let err = '';
            for (const error of errors.array()) {
                err += `invalid value for ${error.param}`
            }
            req.session.error_message = `Invalid input: ${err}!`;
            return res.redirect('/admin');
        }

        return adminController.changeRole(req, res, req.body.userId, req.body.role);
    }
);

router.post(
    '/changeSection',
    [
        check('userId').isInt(),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            let err = '';
            for (const error of errors.array()) {
                err += `invalid value for ${error.param}`
            }
            req.session.error_message = `Invalid input: ${err}!`;
            return res.redirect('/admin');
        }

        return adminController.changeSection(req, res, req.body.userId, req.body.section);
    }
);

router.post(
    '/changeSectionInstructor',
    [
        check('sectionId').isInt(),
        check('instructor').isInt(),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            let err = '';
            for (const error of errors.array()) {
                err += `invalid value for ${error.param}`
            }
            req.session.error_message = `Invalid input: ${err}!`;
            return res.redirect('/admin');
        }

        return adminController.changeSectionInstructor(req, res, req.body.sectionId, req.body.instructor);
    }
);

router.get(
    '/userDelete/:id',
    [
        ensureAuthenticated,
        isAdmin
    ],
    async (req, res) => {
        return adminController.userDelete(req, res, req.params.id);
});

router.post('/siteDelete/:id', isInstructor, async (req, res) => {
    await Site.delete(req.params.id);
    res.redirect('/admin');
});

router.post('/addSection', async (req, res) => {
    await Section.create(req.body.sectionName, req.body.sectionInstructor);
    res.redirect('/admin');
});


router.delete('/deleteSection/:id/:length', async (req, res) => {
    if (req.params.length > 2) {
        await Section.delete(req.params.id);
        res.redirect('/admin');
    }
    else {
        // Do not allow deletion of sections if there is only 1 section left, otherwise you will not be able to access admin features
        // Note that we check if sectionsLength is > 2 because the default "Pending Users Section" counts as one. 
        req.session.error_message = 'Failed to delete section: At least 1 section must be active.'
        res.redirect('/admin');
    }
});

module.exports = router;
