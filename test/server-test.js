const assert = require('assert');
const app    = require('../server');
const request = require('request');

describe('Server', () => {

    before(done => {
        this.port = 9876;
        this.server = app.listen(this.port, (err, result) => {
            if (err) { return done(err); }
            done();
        });

        this.request = request.defaults({
            baseUrl: 'http://localhost:9876'
        });
    });

    after(() => {
        this.server.close();
    });

    it('should exist', () => {
        assert(app);
    });

    describe('GET /', () => {
        it('should return a 200', (done) => {
            this.request.get('/', (error, res) => {
                if (error) { done(error); }
                assert.equal(res.statusCode, 200);
                done();
            });
        });
    });
});
