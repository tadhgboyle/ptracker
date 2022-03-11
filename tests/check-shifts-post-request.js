const { exec } = require('child_process');
const assert = require('assert');
const dataController = require('../controllers/dataController');
const shiftController = require('../controllers/shiftController');

const Request = require('./classes/fakeRequest');
const Response = require('./classes/fakeResponse');
const User = require('./classes/fakeUser');

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'mysql://root:Jaspreet78@localhost:3306/nurse_joy_testing';

describe('Test to check shifts on calender for the user', () =>{

    let server;

    beforeEach(() => {
        exec('npx prisma migrate reset --force');

        delete require.cache[require.resolve('../bin/www')];
        server = require('../bin/www');
    });

    afterEach((done) => {
        server.close(done);
    });

    it('check creating shifts make post request to the database', async () => {
        const user = new User();
        const req = new Request();
        const res = new Response();


        await shiftController.create(req, res, {userId: user.id, siteId: 1, date: Date.now(), type: 'DAY'});

        await dataController.allShifts(req, res, user);
        

        for(const shift in res.json){
            assert.equal(shift.length, 1)
        }

    });
});