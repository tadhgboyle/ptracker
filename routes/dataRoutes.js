const express = require('express');
const router = express.Router();

const dataController = require('../controllers/dataController');

router.get("/dashboardStudentSites", async (req, res) => {
    return dataController.dashboardStudentSites(req, res, req.user, req.query.start);
});

router.get("/dashboardShifts", async (req, res) => {
    return dataController.dashboardShifts(req, res, req.user);
});

router.get('/allShifts', async (req, res) => {
    return dataController.allShifts(req, res, req.user);
});

module.exports = router;
