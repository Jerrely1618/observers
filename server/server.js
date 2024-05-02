const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = jwksClient({
  jwksUri: 'https://dev-jx5b0ki2qctj8hxd.us.auth0.com/.well-known/jwks.json'
});
function getKey(header, callback){
  client.getSigningKey(header.kid, (err, key) => {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  jwt.verify(token, getKey, {
    audience: 'https://dev-jx5b0ki2qctj8hxd.us.auth0.com/api/v2/',
    issuer: 'https://dev-jx5b0ki2qctj8hxd.us.auth0.com/',
    algorithms: ['RS256']
  }, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = decoded;
    next();
  });
});

app.post('/api/users', async (req, res) => {
  const { email, name } = req.body;
  try {
    console.log('Creating user:', email, name)
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length) {
      return res.status(409).send({ error: 'User already exists' });
    }
    const newUser = await pool.query(
      'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *',
      [email, name]
    );
    res.json(newUser.rows[0]);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send('Server error');
  }
});
app.get('/stories', async (req, res) => {
  const search = req.query.search;
  let query = `
    SELECT s.*, u.username as author 
    FROM stories s
    LEFT JOIN users u ON s.author_id = u.id`;
  let params = [];
  if (search) {
    query += ` WHERE s.title ILIKE $1 OR u.username ILIKE $2 OR s.content ILIKE $3`;
    params = [`%${search}%`, `%${search}%`, `%${search}%`];
    query += ` ORDER BY CASE 
      WHEN s.title ILIKE $1 THEN 1 
      WHEN u.username ILIKE $2 THEN 2 
      WHEN s.content ILIKE $3 THEN 3 
      ELSE 4 
    END, s.created_at DESC`;
  } else {
    query += ' ORDER BY s.created_at DESC';
  }
  try {
    const stories = await pool.query(query, params);
    res.json(stories.rows);
  } catch (err) {
    console.error('Query error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

app.get('/stories/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM stories WHERE id = $1', [id]);
    if (result.rows.length) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send({ error: 'Story not found' });
    }
  } catch (err) {
    console.error('Query error:', err.message);
    res.status(500).send({ error: 'Failed to fetch story', details: err.message });
  }
});

app.post('/stories', async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query('INSERT INTO stories (title, content) VALUES ($1, $2) RETURNING *', [title, content]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Insert error:', err.message);
    res.status(500).json({ error: 'Failed to create story', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
