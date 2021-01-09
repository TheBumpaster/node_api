import { createServer, Server, IncomingMessage, ServerResponse } from 'http';

const server: Server = createServer((request: IncomingMessage, response: ServerResponse) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify({ message: 'Hello world!' }));
    response.end();
});

const port = !!process.env.port ? Number(process.env.port) : 3000;

server.listen(port, () => {
    console.log(`Server is up and running on port ${port}`);
});

export { server };
