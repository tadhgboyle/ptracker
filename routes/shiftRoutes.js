const express = require('express');

const {check, validationResult} = require('express-validator')

const shiftController = require('../controllers/shiftController');

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

        return shiftController.create(req, res, req.body);
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

        return shiftController.update(req, res, req.params.id, req.body);
    }
);

router.delete(
    '/delete/:id',
    async (req, res) => {
        return shiftController.del(req, res, req.params.id, req.user);
    }
);

module.exports = router;
