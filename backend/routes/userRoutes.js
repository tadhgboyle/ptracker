const express = require('express');
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const User = require('../models/User');

const router = express.Router();

router.get('/', isAuthenticated, (req, res) => {
    res.json(req.user);
});

router.put('/', isAuthenticated, async (req, res) => {
    await prisma.user.findUnique({
        where: {
            id: req.user.id
        }
    }).update({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    });

    return res.json(await prisma.user.findUnique({
        where: {
            id: req.user.id
        }
    }));
});

router.get('/list', async (req, res) => {
    return res.json(await prisma.user.findMany({
        include: {
            section: true,
            shifts: true,
        }
    }));
});

router.delete('/', isAuthenticated, async (req, res) => {
    throw new Error('Not implemented');
});

module.exports = router;
