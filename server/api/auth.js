const db = require('../db');

exports.handle = (req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
            const { username, password } = JSON.parse(body);

            const sql = 'SELECT role FROM users WHERE username = ? AND password = ?';
            db.query(sql, [username, password], (err, results) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Internal server error' }));
                } else if (results.length > 0) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ role: results[0].role }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid credentials' }));
                }
            });
        });
    }
};
