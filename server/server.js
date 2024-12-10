const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const filePath = path.join(
        __dirname,
        req.url === '/' ? 'index.html' : req.url
    );
    const ext = path.extname(filePath);
    const contentType = ext === '.css' ? 'text/css' : 'text/html';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>', 'utf-8');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
