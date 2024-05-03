const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// Retrieve a list of all stories, optionally filtered by a search term
router.get('/stories', async (req, res) => {
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

// Retrieve a single story by its ID
router.get('/stories/:id', async (req, res) => {
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

// Create a new story
router.post('/stories', async (req, res) => {
    const { title, content } = req.body;
    try {
        const result = await pool.query('INSERT INTO stories (title, content) VALUES ($1, $2) RETURNING *', [title, content]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Insert error:', err.message);
        res.status(500).json({ error: 'Failed to create story', details: err.message });
    }
});

module.exports = router;