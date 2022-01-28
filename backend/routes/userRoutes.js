const express = require('express');
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { isInstructor } = require("../middleware/isInstructor");
const User = require('../models/User');

const router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
    return res.json(req.user);
});

router.get('/list', isInstructor, async (req, res) => {
    return res.json(await User.all());
});

router.get('/:id', isInstructor, async (req, res) => {
    return res.json(await User.find(req.params.id));
});

router.put('/', isInstructor, async (req, res) => {
    return res.json(await User.update(req.user.id, req.body));
});

router.put('/:id', isInstructor, async (req, res) => {
    return res.json(await User.update(req.params.id, req.body));
});


router.delete('/', isAuthenticated, async (req, res) => {
    throw new Error('Not implemented');
});

module.exports = router;
