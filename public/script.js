const http = require('http');
const fs = require('fs');
const path = require('path');
const eventsApi = require('./api/events');

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api/events')) {
        eventsApi.handle(req, res);
    } else {
        const filePath = path.join(__dirname, '../public', req.url === '/' ? 'index.html' : req.url);
        const ext = path.extname(filePath);
        const contentType = ext === '.css' ? 'text/css' : ext === '.js' ? 'application/javascript' : 'text/html';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    }
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
