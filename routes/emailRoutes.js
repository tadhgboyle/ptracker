const express = require('express');
const router = express.Router();

// Prisma
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

// Classes
const Email = require("../classes/email");
const User = require("../models/user")

router.post('/changeEmailStatus/:userId', async (req,res) => {
    const user = await User.find(parseInt(req.params.userId))
    if (user.emailNotif) {
        await prisma.user.update({
            where: {
                id: parseInt(user.id)
            },
            data: {
                emailNotifications: false,
            }
        })
    } else {
        await prisma.user.update({
            where: {
                id: parseInt(user.id)
            },
            data: {
                emailNotifications: true,
            }
        })
    }
    res.redirect('/dashboard')
})

router.post('/newUser', async (req, res) => {
    res.sendStatus(200);

    await Email.sendToAdmins(
        'PTracker - New user registered',
        `Hi, a new user has signed up for PTracker. Please assign them to a section. Name: ${req.body.name}`,
    );
});

router.post('/shiftDeletionRequest', async (req, res) => {
    res.sendStatus(200);

    await Email.sendToAdmins(
        'PTracker - A new shift deletion request has been made',
        `Hi, a shift deletion request for ${req.body.name} on ${req.body.date} has been made. Please approve or decline this request.`,
    );
});

router.post('/shiftDeletionApproved', async (req, res) => {
    res.sendStatus(200);

    await Email.send(
        req.body.sendTo,
        'PTracker - Your shift deletion request has been approved',
        `Hi, your shift deletion request for ${req.body.date} has been approved.`,
    );
});

router.post('/shiftDeletionDeclined', async (req, res) => {
    res.sendStatus(200);

    await Email.send(
        req.body.sendTo,
        'PTracker - Your shift deletion request has been declined',
        `Hi, your shift deletion request for ${req.body.date} has been declined.`,
    );
});

module.exports = router;
