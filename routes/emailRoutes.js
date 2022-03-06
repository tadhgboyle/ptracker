const express = require('express');
const router = express.Router();

const emailController = require('../controllers/emailController');

const Email = require("../classes/email");

router.post('/changeEmailStatus/:userId', async (req,res) => {
    return emailController.changeEmailStatus(req, res, req.user.id);
});

router.post('/newUser', async (req, res) => {
    res.sendStatus(200);

    await Email.sendToAdmins(
        'PTracker - New user registered',
        `Hi, a new user has signed up for PTracker. Please assign them to a section. Name: ${req.body.name}`,
    );
});

router.post('/userAssignedSection', async (req, res) => {
    res.sendStatus(200);

    await Email.send(
        req.body.sendTo,
        'PTracker - Welcome',
        `Hi, you have been assigned the: ${req.body.sectionName} section.`,
    );
});

router.post('/instructorDeleted', async (req, res) => {
    res.sendStatus(200);

    await Email.sendToAdmins(
        'PTracker - Instructor deleted',
        `Hi, the instructor named ${req.body.name} has been deleted from the application.`,
    );
});

router.post('/shiftCreated', async (req, res) => {
    res.sendStatus(200);

    await Email.sendToSectionInstructor(
        req.body.sectionId,
        'PTracker - Student shift created',
        `Hi, ${req.body.studentName} has created a ${req.body.shiftType} shift on ${req.body.shiftDate}.`,
    );
});

router.post('/shiftUpdated', async (req, res) => {
    res.sendStatus(200);

    await Email.sendToSectionInstructor(
        req.body.sectionId,
        'PTracker - Student shift updated',
        `Hi, ${req.body.studentName} has modified their shift on ${req.body.shiftDate}.`,
    );
});

router.post('/shiftDeleted', async (req, res) => {
    res.sendStatus(200);

    await Email.sendToSectionInstructor(
        req.body.sectionId,
        'PTracker - Student shift deleted',
        `Hi, ${req.body.studentName} has deleted a shift on ${req.body.shiftDate}.`,
    );
});

module.exports = router;
