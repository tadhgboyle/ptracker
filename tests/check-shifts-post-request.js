const { exec } = require('child_process');
const request = require('supertest');


process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'mysql://root@localhost:3306/nurse_joy_testing';



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

    it('should return 201 on shift created', (done) => {
        request(server)
            .post('/shifts/')
            .expect(201, done);
    });
});