const { exec } = require('child_process');
const assert = require('assert');
const dataController = require('../controllers/dataController');

const Request = require('./classes/fakeRequest');
const Response = require('./classes/fakeResponse');
const User = require('./classes/fakeUser');
const Role = require("../models/role");

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL_TESTING;

describe('Test to shifts on dashboard for the logged in student', () =>{

    beforeEach(() => {
        exec('npx prisma migrate reset --force');
    });

    it('shifts sent to dashboard belong to logged in user', async () => {
        const req = new Request();
        const res = new Response();
        const user = new User();

        await dataController.allShifts(req, res, user);

        for (const shift of res.getJson()) {
            if (shift.userId !== 'holiday' && shift.userId !== user.id) {
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

    it('shifts/holidays sent to dashboard have correct colours', async () => {
        const user = new User(1, 'Chris Chan', Role.INSTRUCTOR);
        const req = new Request();
        const res = new Response();

        await dataController.allShifts(req, res, user);

        for(const shift in res.json){
            if (shift.userId === 'holiday') {
                assert.equal(shift.color, '#577590')
            } else {
                if (shift.title === 'Nx') {
                    assert.equal(shift.color,'#744468')
                }
                if (shift.title === 'Dx') {
                    assert.equal(shift.color,'#ECA446')
                }
                if (shift.title === 'Sx') {
                    assert.equal(shift.color,'#D05353')
                }
                if (shift.title === 'Ex') {
                    assert.equal(shift.color,'#016BB7')
                }
            }
        }
    });
});
