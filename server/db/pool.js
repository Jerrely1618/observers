const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    // Connection limits and other parameters
    max: 20, // maximum number of clients in the pool
    idleTimeoutMillis: 30000, // idle before being closed
    connectionTimeoutMillis: 2000, // return an error after 2s if connection could not be established
});

module.exports = pool;
