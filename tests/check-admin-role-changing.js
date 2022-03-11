const { exec } = require('child_process');
const assert = require('assert');
const adminController = require('../controllers/adminController');

const Request = require('./classes/fakeRequest');
const Response = require('./classes/fakeResponse');
const User = require('./classes/fakeUser');

const Role = require('../models/role');
const Section = require('../models/section');

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL_TESTING;

describe('Test the roleChange function', () =>{

    beforeEach(() => {
        exec('npx prisma migrate reset --force');
    });

    it('does not let instructor or admin who is assigned a section be demoted', async () => {
        await Section.create('test', 1);

        const user = new User(1, 'Chris Chan', Role.INSTRUCTOR);
        const req = new Request();
        const res = new Response();

        await adminController.changeRole(req, res, user.id, Role.STUDENT);

        assert.equal(req.session.error_message.includes('and cannot be demoted!'), true);
        assert.equal(res.getRedirect(), '/admin');
    });

    it('updates user role and redirects', async () => {
        const user = new User(1, 'Chris Chan', Role.STUDENT);
        const req = new Request();
        const res = new Response();

        await adminController.changeRole(req, res, user.id, Role.ADMIN);

        assert.equal(req.session.success_message.includes(`Set role of user #${user.id} to`), true);
        assert.equal(res.getRedirect(), '/admin');
    });
});
