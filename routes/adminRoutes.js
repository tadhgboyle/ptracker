const express = require('express');

const router = express.Router();

const {check, validationResult} = require("express-validator");
const User = require("../models/user");
const Section = require("../models/section");
const Role = require("../models/role");

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

        if (req.body.role === Role.STUDENT) {
            const section = await Section.whereIsInstructor(req.body.userId);
            if (section) {
                req.session.error_message = `User is currently assigned to section ${section.name}, and cannot be demoted!`;
                return res.redirect('/admin');
            }
        }

        await User.update(req.body.userId, {
            role: req.body.role
        });

        req.session.success_message = `Set role of user #${req.body.userId} to ${req.body.role}`;

        res.redirect('/admin');
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

        const section = await Section.find(req.body.section);

        if (!section) {
            req.session.error_message = `Section #${req.body.section} does not exist`;
            return res.redirect('/admin');
        }

        await User.prisma.user.update({
            where: {id: parseInt(req.body.userId)},
            data: {
                section: {connect: {id: section.id}}
            }
        });

        req.session.success_message = `Set section of user #${req.body.userId} to ${section.name}`;

        res.redirect('/admin');
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

        const section = await Section.find(req.body.sectionId);

        if (!section) {
            req.session.error_message = `Section #${req.body.sectionId} does not exist`;
            return res.redirect('/admin');
        }

        try {
            await Section.prisma.section.update({
                where: {id: parseInt(req.body.sectionId)},
                data: {
                    instructorId: parseInt(req.body.instructor)
                }
            });
        } catch (e) {
            req.session.error_message = `Instructor #${req.body.instructor} is already assigned another section`;
            return res.redirect('/admin');
        }

        await User.prisma.user.update({
            where: {id: parseInt(req.body.instructor)},
            data: {
                section: {connect: {id: section.id}}
            }
        });

        req.session.success_message = `Set instructor of section ${section.name} to #${req.body.instructor}`;

        res.redirect('/admin');
    }
);

module.exports = router;
