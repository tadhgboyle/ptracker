const express = require('express');

const router = express.Router();

const {check, validationResult} = require("express-validator");
const User = require("../models/user");
const Section = require("../models/section");

router.post(
    '/changeRole',
    [
        check('userId').isInt(),
        check('role').isIn(['STUDENT', 'INSTRUCTOR', 'ADMIN']),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
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
            return res.status(422).json({
                errors: errors.array()
            });
        }

        const section = await Section.find(req.body.section);

        if (!section) {
            req.session.error_message = `Section ${req.body.section} does not exist`;
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

module.exports = router;
