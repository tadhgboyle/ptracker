const { exec } = require('child_process');
const assert = require('assert');
const dataController = require('../controllers/dataController');

const Request = require('./classes/fakeRequest');
const Response = require('./classes/fakeResponse');
const User = require('./classes/fakeUser');

const Role = require('../models/role');
const Section = require('../models/section');

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'mysql://root1:password@localhost:3306/nurse_joy_testing';

describe('Test the data displayed', () =>{

    let server;

    beforeEach(() => {
        exec('npx prisma migrate reset --force');

        delete require.cache[require.resolve('../bin/www')];
        server = require('../bin/www');
    });

    afterEach((done) => {
        server.close(done);
    });

    it('Tests the json to ensure the colours are correctly assigned', async () => {
       
        const user = new User(1, 'Chris Chan', Role.INSTRUCTOR);
        const req = new Request();
        const res = new Response();

        await dataController.allShifts(req, res, user);

        for(shift in res.json){ 
            if (shift.userId === 'holiday') {
                assert.equal(shift.color, '#577590')
            }
            else{
                if (shift.title === 'Nx'){assert.equal(shift.color,'#744468')}
                if (shift.title === 'Dx'){assert.equal(shift.color,'#ECA446')}
                if (shift.title === 'Sx'){assert.equal(shift.color,'#D05353')}
                if (shift.title === 'Ex'){assert.equal(shift.color,'#016BB7')}
            }
        }   
    });
});