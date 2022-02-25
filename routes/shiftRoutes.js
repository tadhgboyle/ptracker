const express = require('express');

// Validaton and shifts
const {check, validationResult} = require('express-validator')
const Shift = require('../models/shift');

const axios = require("axios");

const router = express.Router();

router.post(
    '/',
    [
        check('userId').isInt(),
        check('siteId').isInt(),
        check('date').isDate({
            format: 'YYYY-MM-DD'
        }),
        check('type').isIn(['DAY', 'EVENING', 'NIGHT']),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {

            let err = '';
            for (const error of errors.array()) {
                err += `invalid value for ${error.param}`
            }

            req.session.error_message = `Invalid shift data: ${err}!`;

            return res.redirect('/calendar');
        }

        await Shift.create(req.body);

        req.session.success_message = `Shift created successfully on ${req.body.date}!`;

        res.redirect('/calendar');
    }
);

router.put(
    '/:id',
    [
        check('userId').isInt(),
        check('siteId').isInt(),
        check('date').isDate(),
        check('type').isIn(['DAY', 'EVENING', 'NIGHT']),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            let err = '';
            for (const error of errors.array()) {
                err += `invalid value for ${error.param}`
            }

            req.session.error_message = `Invalid shift data: ${err}!`;

            return res.redirect('/calendar');
        }

        await Shift.update(
            req.params.id,
            req.body
        );

        req.session.success_message = `Shift updated successfully on ${req.body.date}!`;

        res.redirect('/calendar');
    }
);

router.delete(
    '/delete/:id',
    async (req, res) => {
        const shift = await Shift.find(req.params.id);

        if (shift.user.id !== req.user.id) {
            req.session.error_message = 'This is not your shift!';
            return res.redirect('/calendar');
        }

        if (shift.status === 'PENDING') {
            req.session.error_message = 'You have already requested deletion of this shift!';
            return res.redirect('/calendar');
        }

        await Shift.prisma.shift.update({
            where: {id: parseInt(req.params.id)},
            data: {
                status: 'PENDING',
            }
        });

        let URL = process.env.APP_URL;
        if (URL.endsWith('/')) {
            URL = URL.slice(0, -1);
        }

        await axios.post(URL + '/email/shiftDeletionRequest', {
            name: shift.user.name,
            date: shift.date.toLocaleString(),
        });

        req.session.success_message = `Shift deletion requested!`;

        res.redirect('/calendar');
    }
);

module.exports = router;
