const http = require('http');
const fs = require('fs');
const path = require('path');
const eventsApi = require('./api/events');
const authApi = require('./api/auth');

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api/events')) {
        eventsApi.handle(req, res);
    } else if (req.url.startsWith('/api/auth')) {
        authApi.handle(req, res);
    } else {
        const filePath = path.join(__dirname, '../public', req.url === '/' ? 'login.html' : req.url);
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

const express = require('express');
const fs = require('fs');

const app = express();
const DATABASE_FILE = 'database.json';

// Initialize the database if it doesn't exist
if (!fs.existsSync(DATABASE_FILE)) {
    const defaultData = {
        users: [
            {
                username: 'admin',
                password: 'admin123', // Hash in a real-world app!
                role: 'admin',
            },
        ],
        events: [],
    };
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(defaultData, null, 2));
    console.log('Database initialized with default admin user.');
}

// Middleware to parse JSON
app.use(express.json());

// Your routes go here...
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    // Read users from the database
    const data = JSON.parse(fs.readFileSync(DATABASE_FILE));
    const user = data.users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ message: 'Login successful', role: user.role });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
