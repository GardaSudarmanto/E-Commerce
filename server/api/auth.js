const db = require('../db');
const bcrypt = require('bcrypt');

exports.handle = async (req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', async () => {
            try {
                const { username, password } = JSON.parse(body);

                const sql = 'SELECT username, password, role FROM users WHERE username = ?';
                const results = await db.query(sql, [username]);

                if (results.length > 0) {
                    const user = results[0];
                    const match = await bcrypt.compare(password, user.password);

                    if (match) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ role: user.role }));
                    } else {
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Invalid credentials' }));
                    }
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid credentials' }));
                }
            } catch (err) {
                console.error('Database query error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Internal server error' }));
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Method not allowed' }));
    }
};
