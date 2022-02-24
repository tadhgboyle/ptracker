const express = require('express');

// Validaton and shifts
const {check, validationResult} = require('express-validator')
const Shift = require('../models/shift');

// Holidays
const date = new Date()
const Holidays = require('date-holidays')
const hd = new Holidays('CA', 'BC')

const router = express.Router();

const shiftColor = (shift) => {
    if (shift === 'NIGHT') {
        return '#744468'
    } else if (shift === 'EVENING') {
        return '#016BB7'
    } else if (shift === 'DAY') {
        return '#ECA446'
    } else if (shift === 'SICK') {
        return '#D05353'
    }
}

router.get('/', async (req, res) => {
    const allShifts = [];
    const allHolidays = hd.getHolidays(date.getFullYear())
    for (const shift of await Shift.allForLoggedInUser(req.user.id)) {
        if (shift.status !== 'NORMAL') {
            continue;
        }
        allShifts.push({
            id: shift.id,
            title: shift.type,
            start: shift.date.toISOString().split('T')[0],
            color: shiftColor(shift.type)
        })
    }
    for (const holiday of allHolidays) {
        allShifts.push({
            title: holiday.name,
            start: holiday.date.split(" ")[0],
            color: '#577590'
        })
    }
    res.json(allShifts);
});

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

        await Shift.prisma.shift.update({
            where: {id: parseInt(req.params.id)},
            data: {
                status: 'PENDING',
            }
        });

        req.session.success_message = `Shift deletion requested!`;

        res.redirect('/calendar');
    }
);

module.exports = router;
