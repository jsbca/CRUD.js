const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change this to your MySQL user
    password: 'root', // Change this to your MySQL password
    database: 'crud_example'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Routes

// Get all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            res.status(500).json({ message: err.message });
        } else {
            res.json(results);
        }
    });
});

// Add a new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, results) => {
        if (err) {
            res.status(400).json({ message: err.message });
        } else {
            res.status(201).json({ id: results.insertId, name, email });
        }
    });
});






// Get a single user by ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: err.message }); // Ensure error response is JSON
        } 
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' }); // Ensure no user found is returned as JSON
        }
        return res.json(results[0]); // Ensure the user data is returned as JSON
    });
});

// Update an existing user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id], (err, results) => {
        if (err) {
            res.status(400).json({ message: err.message });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: 'User not found.' });
        } else {
            res.json({ success: true, id, name, email });
        }
    });
});












// Delete a user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            res.status(400).json({ message: err.message });
        } else {
            res.status(204).send();
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
