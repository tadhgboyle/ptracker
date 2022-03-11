const { exec } = require('child_process');
const assert = require('assert');
const dataController = require('../controllers/dataController');

const Request = require('./classes/fakeRequest');
const Response = require('./classes/fakeResponse');
const FakeUser = require('./classes/fakeUser');
const User = require('../models/user');
const Role = require("../models/role");

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL_TESTING;

describe('Test to shifts on dashboard for the logged in instructor/admin', () =>{

    beforeEach(() => {
        exec('npx prisma migrate reset --force');
    });

    it('shifts sent to dashboard have different users in different sections for instructor', async () => {
        const req = new Request();
        const res = new Response();
        const user = new FakeUser(1, 'hi', Role.INSTRUCTOR);

        await dataController.dashboardShifts(req, res, user);

        const userIds = [];
        for (const shift of res.getJson()) {
            const shiftUser = await User.find(shift.resourceId);

            if (shiftUser.section.id !== user.section.id) {
                assert.fail('Shifts user section does not match instructors section');
            }

            userIds.push(shift.resourceId);
        }

        assert.equal(userIds.length > 1, true);
    });
});
