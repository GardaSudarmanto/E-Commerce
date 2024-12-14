// api/login.js
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Read users from a file or database
        const data = JSON.parse(await fs.readFile('database.json', 'utf8'));

        const user = data.users.find(u => u.username === username);

        if (user && await bcrypt.compare(password, user.password)) {
            res.status(200).json({ message: 'Login successful', role: user.role });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error reading database:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
