const ava = require('ava');
const app = require('../dist/index.js');
const got = require('got');

ava.before(async (t) => {
    try {
        t.context.server = app.server;
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
    const { body } = await got('http://localhost:3000', { prefixUrl: '/' });
    const response = JSON.parse(body);
    t.is(response.message, 'Hello world!', 'Should be "Hello, world!"');
});
