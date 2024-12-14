const db = require('../db');

exports.handle = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const results = await db.query('SELECT * FROM events');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        } catch (err) {
            console.error('Database query error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', async () => {
            try {
                const event = JSON.parse(body);
                const sql = 'INSERT INTO events (title, description, date, location) VALUES (?, ?, ?, ?)';
                const result = await db.query(sql, [event.title, event.description, event.date, event.location]);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ id: result.insertId, ...event }));
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
