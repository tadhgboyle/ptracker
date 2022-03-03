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
        shifts: await Shift.allPending(),
        sites: await Site.all(),
    });
});

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
    '/approveShiftDelete/:id',
    [
        ensureAuthenticated,
        isAdmin
    ],
    async (req, res) => {
        return adminController.approveShiftDelete(req, res, req.params.id);
});

router.get(
    '/declineShiftDelete/:id',
    [
        ensureAuthenticated,
        isAdmin
    ],
    async (req, res) => {
        return adminController.declineShiftDelete(req, res, req.params.id);
});

router.post('/siteDelete/:id', isInstructor, async (req, res) => {
    await Site.delete(req.params.id);
    res.redirect('/admin');
});

router.post('/addSection', async (req, res) => {
    await Section.create(req.body.sectionName, req.body.sectionInstructor);
    res.redirect('/admin');
});

module.exports = router;
