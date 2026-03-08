import { createServer } from 'http';

const PORT = 8000;

const server = createServer((req, res) => {
    console.log(req.url, req.method, req.headers)
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!');
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});