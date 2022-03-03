const { exec } = require('child_process');
const assert = require('assert');
const dataController = require('../controllers/dataController');

const Request = require('./classes/fakeRequest');
const Response = require('./classes/fakeResponse');
const User = require('./classes/fakeUser');

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'mysql://root@localhost:3306/nurse_joy_testing';

describe('Test to check shifts on dashboard for the logged in user', () =>{

    let server;

    beforeEach(() => {
        exec('npx prisma migrate reset --force');

        delete require.cache[require.resolve('../bin/www')];
        server = require('../bin/www');
    });

    afterEach((done) => {
        server.close(done);
    });

    it('shifts sent to dashboard belong to logged in user', async () => {
        const req = new Request();
        const res = new Response();
        const user = new User();

        await dataController.allShifts(req, res, user);

        for (const shift of res.getJson()) {
            if (shift.userId !== user.id) {
                assert.fail('Shift does not belong to logged in user');
            }
        }
    });

    it('shifts sent to dashboard are not of status "DELETED"', async () => {
        const req = new Request();
        const res = new Response();
        const user = new User();

        await dataController.allShifts(req, res, user);

        for (const shift of res.getJson()) {
            if (shift.status === 'DELETED') {
                assert.fail('Shift is marked as DELETED');
            }
        }
    });
});
