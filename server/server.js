const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
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

// Fetch stories with optional search filter
app.get('/stories', async (req, res) => {
  const search = req.query.search;
  try {
    let query = 'SELECT * FROM stories';
    let params = [];
    if (search) {
      query += ' WHERE title ILIKE $1 OR author ILIKE $1';
      params.push(`%${search}%`);
    }
    const stories = await pool.query(query, params);
    res.json(stories.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch a single story by ID
app.get('/stories/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { rows } = await pool.query('SELECT * FROM stories WHERE id = $1', [id]);
    if (rows.length) {
      res.json(rows[0]);
    } else {
      res.status(404).send({ error: 'Story not found' });
    }
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch story', details: err.message });
  }
});

// Create a new story
app.post('/stories', async (req, res) => {
  const { title, content } = req.body;
  try {
    const newStory = await pool.query(
      'INSERT INTO stories (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    res.json(newStory.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});