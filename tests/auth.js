const faker = require('faker');
const request = require('supertest');
const expect = require('chai').expect;
const application = require('../dist/index').default;

let server = application.server;
describe('Authorization tests', function () {
    this.timeout(50000);
    before((done) => {
        // Setup server
        if (server.state === 'ready') {
            done();
        } else {
            server.on('ready', () => {
                done();
            });
        }
    });

    describe('Successfull scenario', () => {
        const user = {
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(9) + 'A1!',
        };

        it('Should successfully register a new user', (done) => {
            request(server.app)
                .post('/api/v1/auth/register')
                .send(user)
                .end((error, response) => {
                    if (error) {
                        done(error);
                    }
                    expect(response.status).to.be.equal(201);
                    expect(response.body).to.haveOwnProperty('jwt');
                    expect(response.body).to.haveOwnProperty('token');
                    expect(response.body.jwt).to.be.a('string');
                    expect(response.body.token).to.be.a('string');
                    done();
                });
        });

        it('Should successfully login a user', (done) => {
            request(server.app)
                .post('/api/v1/auth/login')
                .send({
                    email: user.email,
                    password: user.password,
                })
                .end((error, response) => {
                    if (error) {
                        done(error);
                    }
                    expect(response.status).to.be.equal(200);
                    expect(response.body).to.haveOwnProperty('jwt');
                    expect(response.body).to.haveOwnProperty('token');
                    expect(response.body.jwt).to.be.a('string');
                    expect(response.body.token).to.be.a('string');
                    done();
                });
        });

        it('Should successfully logout a user', (done) => {
            request(server.app)
                .del('/api/v1/auth/logout')
                .end((error, response) => {
                    if (error) {
                        done(error);
                    }
                    expect(response.status).to.be.equal(200);
                    done();
                });
        });
    });

    describe('Failing scenarios', () => {
        it('Should NOT register a new user due to fake email', (done) => {
            request(server.app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'thisIsNotEmail',
                    username: faker.internet.userName(),
                    password: faker.internet.password(9) + 'A1!',
                })
                .end((error, response) => {
                    if (error) {
                        done(error);
                    }
                    expect(response.status).to.be.equal(400);
                    expect(response.body).to.haveOwnProperty('status');
                    expect(response.body).to.haveOwnProperty('message');
                    expect(response.body.status).to.be.a('boolean');
                    expect(response.body.message).to.be.a('string');
                    done();
                });
        });

        it('Should NOT register a new user due to bad password', (done) => {
            request(server.app)
                .post('/api/v1/auth/register')
                .send({
                    email: faker.internet.email(),
                    username: faker.internet.userName(),
                    password: faker.internet.password(3) + 'A1!',
                })
                .end((error, response) => {
                    if (error) {
                        done(error);
                    }
                    expect(response.status).to.be.equal(400);
                    expect(response.body).to.haveOwnProperty('status');
                    expect(response.body).to.haveOwnProperty('message');
                    expect(response.body.status).to.be.a('boolean');
                    expect(response.body.message).to.be.a('string');
                    done();
                });
        });
    });
});
