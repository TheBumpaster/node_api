import * as dotenv from 'dotenv';
import { initializeMongooseDatabaseConnection } from '../../server/services/Database';
import Express from '../../server/services/Express/index';
import * as faker from 'faker';
const chaiHttp = require('chai-http');
const chai = require('chai');

const expect = chai.expect;
chai.use(chaiHttp);

let server;

describe('Authorization tests', function () {
    this.timeout(100000);
    before(async () => {
        dotenv.config();
        process.env.NODE_ENV = 'testing';
        await initializeMongooseDatabaseConnection();

        server = new Express(Number(process.env.PORT));
    });

    describe('Successfull scenario', () => {
        const newUser = {
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(9) + 'A!1',
        };
        let jwt = '';
        let token = '';

        it('Should register a new user', (done) => {
            chai.request(server.app)
                .post('/api/v1/auth/register')
                .send(newUser)
                .end((error, response) => {
                    if (error) {
                        done(error);
                    }

                    expect(response.status).to.be.equal(201);
                    expect(response.body).to.haveOwnProperty('jwt');
                    expect(response.body.jwt).to.be.a('string');
                    jwt = response.body.jwt;
                    expect(response.body).to.haveOwnProperty('token');
                    expect(response.body.token).to.be.a('string');
                    token = response.body.token;
                    done();
                });
        });
        it('Should login with the user', (done) => {
            chai.request(server.app)
                .post('/api/v1/auth/login')
                .send({
                    email: newUser.email,
                    password: newUser.password,
                })
                .end((error, response) => {
                    if (error) {
                        done(error);
                    }

                    expect(response.status).to.be.equal(200);
                    expect(response.body).to.haveOwnProperty('jwt');
                    expect(response.body.jwt).to.be.a('string');
                    jwt = response.body.jwt;
                    expect(response.body).to.haveOwnProperty('token');
                    expect(response.body.token).to.be.a('string');
                    token = response.body.token;
                    done();
                });
        });
        it('Should logout with the user', (done) => {
            chai.request(server.app)
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

    describe('Unsuccessfull scenarios', () => {
        it('Should not register, invalid email', (done) => {
            chai.request(server.app)
                .post('/api/v1/auth/register')
                .send({
                    username: faker.internet.userName(),
                    password: faker.internet.password(9) + 'A1!',
                    email: 'fakeemail',
                })
                .end((error, response) => {
                    if (error) {
                        done(error);
                    }

                    expect(response.status).to.be.equal(400);
                    expect(response.body).to.haveOwnProperty('message');
                    expect(response.body.message).to.be.a('string');
                    done();
                });
        });
        it('Should not register, invalid password', (done) => {
            chai.request(server.app)
                .post('/api/v1/auth/register')
                .send({
                    username: faker.internet.userName(),
                    password: faker.internet.password(7),
                    email: faker.internet.email(),
                })
                .end((error, response) => {
                    if (error) {
                        done(error);
                    }

                    expect(response.status).to.be.equal(400);
                    expect(response.body).to.haveOwnProperty('message');
                    expect(response.body.message).to.be.a('string');
                    done();
                });
        });
    });
});
