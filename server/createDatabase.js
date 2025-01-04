const { Pool } = require('pg');

// Connect to default 'postgres' database first
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'postgres', // Connect to default postgres database
  password: 'Post0gres',
  port: 5432,
});

async function createDatabase() {
  try {
    const client = await pool.connect();
    // Create the database if it doesn't exist
    await client.query('CREATE DATABASE health_records');
    console.log('Database "health_records" created successfully!');
    client.release();
  } catch (err) {
    if (err.code === '42P04') {
      console.log('Database "health_records" already exists.');
    } else {
      console.error('Error creating database:', err.message);
    }
  } finally {
    await pool.end();
  }
}

createDatabase();
