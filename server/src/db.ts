import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load env variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';

export const pool = new Pool({
  connectionString,
  // Set reasonable timeout
  connectionTimeoutMillis: 5000,
});

// Test connection on boot
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('================================================================');
    console.error('DATABASE CONNECTION ERROR!');
    console.error('Could not connect to your local PostgreSQL database on port 5432.');
    console.error('Error Details:', err.message);
    console.error('================================================================');
    console.error('Please make sure:');
    console.error('1. PostgreSQL is running locally on port 5432.');
    console.error('2. The credentials in your server/.env file are correct.');
    console.error('   Current DATABASE_URL config:', connectionString);
    console.error('================================================================');
  } else {
    console.log('Successfully connected to local PostgreSQL database at', res.rows[0].now);
  }
});
