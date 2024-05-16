const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const { jwtCheck } = require('../middleware/jwtAuth');

router.post('/api/signup', jwtCheck, async (req, res) => {
    const { email, username, profilepictureurl } = req.body;
    console.log(req.body)
    try {
        const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (exists.rows.length) {
            return res.status(409).send({ error: 'User already exists' });
        }
        const newUser = await pool.query(
            'INSERT INTO users (email, username, profilepictureurl, stories_id, favorites_id, totallikes, followers) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [email, username,profilepictureurl, [], [], 0, 0]
        );
        res.json(newUser.rows[0]);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send({ error: 'Server error' });
    }
});
router.get('/api/user', jwtCheck, async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).send({ error: 'Email parameter is missing' });
  }

  try {
    const userData = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userData.rows.length > 0) {
      const user = userData.rows[0];
      res.json(user);
    } else {
      res.status(404).send({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Failed to retrieve user:', error);
    res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;
