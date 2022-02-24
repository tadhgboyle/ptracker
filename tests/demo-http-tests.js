const request = require('supertest');
process.env.NODE_ENV = 'test';

describe('Demo HTTP tests', () => {

    let server;

    beforeEach(() => {
        delete require.cache[require.resolve('../bin/www')];
        server = require('../bin/www');
    });

    afterEach((done) => {
        server.close(done);
    });

    it('should return 200 on homepage', (done) => {
        request(server)
            .get('/')
            .expect(200, done);
    });

    it('should return 404 on random url', (done) => {
        request(server)
            .get('/blah/blah')
            .expect(404, done);
    });

    it('should redirect to login when requesting dashboard', (done) => {
        request(server)
            .get('/dashboard')
            .expect(302, done)
            .expect('Location', '/auth/login');
    });

});
