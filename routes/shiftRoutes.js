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

// const convertTimeFormat = (holidayDate) => {
//     // Converts the dates for holidays
//     const splitDateTime = holidayDate.split(",")[0]
//     const dateSplit = splitDateTime.split("/")
//     if (parseInt(dateSplit[0]) <= 9 && parseInt(dateSplit[1]) <= 9) {
//         return `${dateSplit[2]}-0${dateSplit[0]}-0${dateSplit[1]}`
//     } else if (parseInt(dateSplit[0]) >= 10 && parseInt(dateSplit[1]) <= 9) {
//         return `${dateSplit[2]}-${dateSplit[0]}-0${dateSplit[1]}`
//     } else if (parseInt(dateSplit[0]) <= 9 && parseInt(dateSplit[1]) >= 10) {
//         return `${dateSplit[2]}-0${dateSplit[0]}-${dateSplit[1]}`
//     } else {
//         return `${dateSplit[2]}-${dateSplit[0]}-${dateSplit[1]}`
//     }
// }

router.get('/', async (req, res) => {
    const allShifts = [];
    const allHolidays = hd.getHolidays(date.getFullYear())
    for (const shift of await Shift.allForLoggedInUser(req.user.id)) {
        allShifts.push({
            id: shift.id,
            title: shift.type,
            start: shift.date.toISOString().split('T')[0],
            color: shiftColor(shift.type)
        })
    }
    for (holiday of allHolidays) {
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
            return res.status(422).json({
                errors: errors.array()
            });
        }

        await Shift.create(req.body);

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
            return res.status(422).json({
                errors: errors.array()
            });
        }

        await Shift.update(
            req.params.id,
            req.body
        );

        res.redirect('/calendar');
    }
);

module.exports = router;
