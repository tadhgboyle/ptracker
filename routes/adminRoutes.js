const express = require('express');

const router = express.Router();

const {check, validationResult} = require("express-validator");
const User = require("../models/user");

router.post(
    '/',
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

        res.redirect('/admin');
    }
);

module.exports = router;
