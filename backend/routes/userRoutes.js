/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID.
 *           example: 1
 *         name:
 *           type: string
 *           description: The user's name.
 *           example: Tadhg Boyle
 *         email:
 *           type: string
 *           description: The user's email address.
 *           example: me@tadhg.sh
 *         picture:
 *           type: string
 *           description: URL to the user's Google profile picture.
 *           nullable: true
 *           example: https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg
 *         googleId:
 *           type: string
 *           description: The user's Google ID.
 *           nullable: true
 *           example: 10798858238972409876
 *         role:
 *           type: string
 *           description: The user's role.
 *           example: STUDENT
 *         sectionId:
 *           type: integer
 *           description: The ID of the section the user is enrolled in.
 *           nullable: true
 *           example: 4
 *         emailNotifications:
 *           type: boolean
 *           description: Whether the user receives email notifications.
 *           example: true
 *         section:
 *           $ref: '#/components/schemas/Section'
 *         shifts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Shift'
 *     Section:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The section ID.
 *           example: 4
 *         name:
 *           type: string
 *           description: The section's name.
 *           example: Set 3A
 *         instructorId:
 *           type: integer
 *           description: The ID of the section's instructor.
 *           example: 6
 *     Shift:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The shift ID.
 *           example: 412
 *         userId:
 *           type: integer
 *           description: The user whose shift this is ID.
 *           example: 1
 *         siteId:
 *           type: integer
 *           description: The ID of the physical site this shift is at.
 *           example: 3
 *         date:
 *           type: datetime
 *           description: The date of this shift.
 *           example: 2021-12-25
 *         type:
 *           type: string
 *           description: The type of shift.
 *           example: DAY
 */

const express = require('express');
const { isAuthenticated } = require("../middleware/isAuthenticated");
const { isInstructor } = require("../middleware/isInstructor");
const User = require('../models/User');

const router = express.Router();

/**
 * @openapi
 * /user:
 *   get:
 *     summary: Get the authenticated user.
 *     description: Get the authenticated user.
 *     responses:
 *       200:
 *         description: Returns the authenticated user object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 */
router.get('/', isAuthenticated, (req, res) => {
    return res.json(req.user);
});

/**
 * @openapi
 * /user/list:
 *   get:
 *     summary: Get all the users in the database.
 *     description: Get all the users in the database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/list', async (req, res) => {
    return res.json(await User.all());
});

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     summary: Get a specific user by their ID
 *     description: Get a specific user by their ID
 *     parameters:
 *     - in: path
 *       name: id
 *       description: The ID of the user to get.
 *       schema:
 *         type: string
 *       required: true
 *     responses:
 *       200:
 *        description: Returns the user object.
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 */
router.get('/:id', isInstructor, async (req, res) => {
    return res.json(await User.find(req.params.id));
});

/**
 * @openapi
 * /user:
 *   put:
 *     summary: Update the authenticated user
 *     description: Update the authenticated user
 *     responses:
 *       200:
 *        description: Returns the user object.
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 */
router.put('/', isInstructor, async (req, res) => {
    return res.json(await User.update(req.user.id, req.body));
});

/**
 * @openapi
 * /user/{id}:
 *   put:
 *     summary: Update a specific user
 *     description: Update a specific user
 *     parameters:
 *     - in: path
 *       name: id
 *       description: The ID of the user to get.
 *       schema:
 *         type: string
 *       required: true
 *     responses:
 *       200:
 *         description: Returns the user object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 */
router.put('/:id', isInstructor, async (req, res) => {
    return res.json(await User.update(req.params.id, req.body));
});

module.exports = router;
