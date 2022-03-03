const { exec } = require('child_process');
const assert = require('assert');
const axios = require("axios");

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'mysql://root@localhost:3306/nurse_joy_testing';

describe('Test that instructors see only shifts that students in their section created', () =>{

    let server;

    beforeEach(() => {
        exec('npx prisma migrate reset --force');

        delete require.cache[require.resolve('../bin/www')];
        server = require('../bin/www');
    });

    afterEach((done) => {
        server.close(done);
    });

    // ...

});
