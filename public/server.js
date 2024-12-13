const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

let users = [
    { id: 1, username: 'admin', password: bcrypt.hashSync('admin123', 8) }
];

let events = [];

// Login endpoint
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
        return res.status(401).send({ message: 'Invalid Password' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 });

    res.status(200).send({ token });
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send({ message: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).send({ message: 'Failed to authenticate token' });
        }

        req.userId = decoded.id;
        next();
    });
}

// Protected route for admin page
app.get('/admin', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Events endpoints
app.post('/events', verifyToken, (req, res) => {
    const event = req.body;
    events.push(event);
    res.status(201).send(event);
});

app.get('/events', (req, res) => {
    res.status(200).send(events);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});