const faker = require('faker');
const request = require('supertest');
const expect = require('chai').expect;
const application = require('../dist/index').default;

let server = application.server;
let user;

const createNewUser = (done) => {
    // Create user and save it.
    const newUser = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(9) + 'A1!',
    };

    request(server.app)
        .post('/api/v1/auth/register')
        .send(newUser)
        .end((error, response) => {
            if (error) {
                done(error);
            }
            expect(response.status).to.be.equal(201);
            expect(response.body).to.haveOwnProperty('jwt');
            expect(response.body).to.haveOwnProperty('token');
            expect(response.body.jwt).to.be.a('string');
            expect(response.body.token).to.be.a('string');
            user = newUser;
            user.jwt = response.body.jwt;
            user.token = response.body.token;
            done();
        });
};

describe('Users tests', function () {
    this.timeout(50000);
    before((done) => {
        // Setup server
        if (server.state === 'ready') {
            createNewUser(done);
        }
        server.on('ready', () => {
            createNewUser(done);
        });
    });

    describe('Successfull scenario', () => {
        it('Should get list of users', (done) => {
            request(server.app)
                .get('/api/v1/users/')
                .set('Authorization', user.jwt)
                .end((error, response) => {
                    if (error) {
                        done(error);
                    }
                    expect(response.status).to.be.equal(200);
                    expect(response.body.result.length).to.be.gt(0);
                    done();
                });
        });
    });

    describe('Failing scenarios', () => {
        it('Should NOT get list of users due to bad token', (done) => {
            request(server.app)
                .get('/api/v1/users/')
                .end((error, response) => {
                    if (error) {
                        done(error);
                    }
                    expect(response.status).to.be.equal(401);
                    done();
                });
        });
    });
});
