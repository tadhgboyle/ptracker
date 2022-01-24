const express = require('express');
const {isAuthenticated} = require("../middleware/isAuthenticated");

const router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
    res.json(req.user);
});

module.exports = router;
