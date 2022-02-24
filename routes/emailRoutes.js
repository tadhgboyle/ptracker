const express = require('express');
const Email = require("../classes/email");
const router = express.Router();

router.post('/newUser', async (req, res) => {
    res.sendStatus(200);

    await Email.sendToAdmins(
        'PTracker - New user registered',
        `Hi, a new user has signed up for PTracker. Please assign them to a section. Name: ${req.body.name}`,
    );
});

module.exports = router;
