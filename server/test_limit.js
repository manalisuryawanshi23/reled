import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  password: 'adminpassword',
  host: 'localhost',
  port: 5432,
  database: 'ledprisha'
});

async function run() {
  try {
    const res = await pool.query(`SELECT * FROM enquiries WHERE 1=1 ORDER BY created_at DESC LIMIT 5`);
    console.log("Success:", res.rowCount);
  } catch(e) {
    console.error("Error:", e.message);
  } finally {
    pool.end();
  }
}
run();
