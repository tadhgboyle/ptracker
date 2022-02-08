const express = require('express');
const { check, validationResult } = require('express-validator')
const Shift = require('../models/shift');

const router = express.Router();

router.get('/', async (req, res) => {
    res.json(await Shift.all());
});

router.post(
    '/',
    [
        check('userId').isInt(),
        check('siteId').isInt(),
        check('date').isDate(),
        check('type').isIn(['D', 'E', 'N']),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        res.json(await Shift.create(req.body));
    }
);

router.put(
    '/:id',
    [
        check('userId').isInt(),
        check('siteId').isInt(),
        check('date').isDate(),
        check('type').isIn(['D', 'E', 'N']),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        res.json(await Shift.update(
            req.params.id,
            req.body
        ));
    }
);

module.exports = router;
