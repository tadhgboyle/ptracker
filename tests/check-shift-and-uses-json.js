const { exec } = require('child_process');
const assert = require('assert');
const Shift = require('../models/shift');
const User = require('../models/user');

process.env.NODE_ENV = 'test';

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

describe('Test to check shifts and users sent to calender page is json format', () =>{

    let server;

    beforeEach(() => {
        exec('npx prisma migrate reset --force');

        delete require.cache[require.resolve('../bin/www')];
        server = require('../bin/www');
    });

    afterEach((done) => {
        server.close(done);
    });

    it('users sent to calenders page is json ', async () => {
        assert.equal(IsJsonString(Object.keys(await User.all())), true);
    });

    it('shifts sent to calenders page is json ', async () => {
        assert.equal(IsJsonString(Object.keys(await Shift.all())), true);
    });
})