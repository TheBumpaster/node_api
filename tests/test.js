const ava = require('ava');
const got = require('got');
const { initializeMongooseDatabaseConnection } = require('../dist/services/Database/index.js');
const { default: Express } = require('../dist/services/Express/index.js');

process.env.port = '3003';
process.env.NODE_ENV = 'testing';
process.env.HOST = 'http://localhost';
process.env.SECRET = 'testing12345!!';

ava.before(async (t) => {
    try {
        t.context.database = initializeMongooseDatabaseConnection();
        t.context.server = new Express(3003);
        t.context.port = !!process.env.port ? Number(process.env.port) : 5000;
        t.context.host = process.env.HOST;
    } catch (e) {
        console.log(server);
        console.error(e);
    }
});

ava.after.always((t) => {
    t.context.server.close((error) => {
        console.log(error);
    });
});

ava.serial('get /', async (t) => {
    const { body, statusCode } = await got(`${t.context.host}:${t.context.port}/api/v1/`, { prefixUrl: '/' });
    const response = JSON.parse(body);
    t.is(response.message, 'Hello, world!', 'Should be "Hello, world!"');
    t.is(statusCode, 200);
});
