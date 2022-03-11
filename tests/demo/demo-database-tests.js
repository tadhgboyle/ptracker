const { exec } = require('child_process');
const assert = require('assert');
const Shift = require('../models/shift');
const User = require('../models/user');

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL_TESTING;

describe('Demo Database tests', () => {

    beforeEach(() => {
        exec('npx prisma migrate reset --force');
    });

    it('seeds the database with 100 users', async () => {
        assert.equal(Object.keys(await User.all()).length, 100);
    });

    it('seeds the database with 500 shifts', async () => {
        assert.equal(Object.keys(await Shift.all()).length, 500);
    });

    // ...

});
