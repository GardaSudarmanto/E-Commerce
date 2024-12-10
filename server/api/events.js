const db = require('../db');

exports.handle = (req, res) => {
    if (req.method === 'GET') {
        db.query('SELECT * FROM events', (err, results) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
            const event = JSON.parse(body);
            const sql = 'INSERT INTO events (title, description, date, location) VALUES (?, ?, ?, ?)';
            db.query(sql, [event.title, event.description, event.date, event.location], (err, result) => {
                if (err) throw err;
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ id: result.insertId, ...event }));
            });
        });
    }
};
