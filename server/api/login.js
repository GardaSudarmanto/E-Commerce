// api/login.js
const fs = require('fs');

module.exports = async (req, res) => {
    const { username, password } = req.body;
    
    // Read users from a file or database
    const data = JSON.parse(fs.readFileSync('database.json'));

    const user = data.users.find(u => u.username === username && u.password === password);

    if (user) {
        res.status(200).json({ message: 'Login successful', role: user.role });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};
