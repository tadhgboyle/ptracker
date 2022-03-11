const { exec } = require('child_process');
const assert = require('assert');
const dataController = require('../controllers/dataController');
const shiftController = require('../controllers/shiftController');

const Request = require('./classes/fakeRequest');
const Response = require('./classes/fakeResponse');
const User = require('./classes/fakeUser');

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL_TESTING;

describe('Test shift creation', () =>{

    beforeEach(() => {
        exec('npx prisma migrate reset --force');
    });

    it('check creating shifts', async () => {
        const user = new User();
        const req = new Request();
        const res = new Response();

        await dataController.allShifts(req, res, user);
        const shiftsBefore = res.json.length;

        await shiftController.create(req, res, {
            userId: user.id, siteId: 1, date: Date.now(), type: 'DAY'
        });

        const newRes = new Response();
        await dataController.allShifts(req, newRes, user);

        assert.equal(newRes.json.length, shiftsBefore + 1);
    });
});
