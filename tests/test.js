const ava = require('ava');
const app = require('../dist/index.js');
const got = require('got');

ava.before(async (t) => {
    try {
        t.context.server = app.server;
        t.context.port = !!process.env.port ? Number(process.env.port) : 5000;
        t.context.host = 'http://localhost';
    } catch (e) {
        console.log(app.server);
        console.log(e);
    }
});

ava.after.always((t) => {
    t.context.server.close((error) => {
        console.log(error);
    });
});

ava.serial('get /', async (t) => {
    const { body } = await got(`${t.context.host}:${t.context.port}`, { prefixUrl: '/' });
    const response = JSON.parse(body);
    t.is(response.message, 'Hello world!', 'Should be "Hello, world!"');
});
