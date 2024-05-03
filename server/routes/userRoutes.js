const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

const { jwtCheck } = require('../middleware/jwtAuth');

// Create a new user with JWT protection
router.post('/api/users', jwtCheck, async (req, res) => {
    const { email, username } = req.body;
    try {
        const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (exists.rows.length) {
            return res.status(409).send({ error: 'User already exists' });
        }
        const newUser = await pool.query(
            'INSERT INTO users (email, username) VALUES ($1, $2) RETURNING *',
            [email, username]
        );
        res.json(newUser.rows[0]);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send({ error: 'Server error' });
    }
});

module.exports = router;
