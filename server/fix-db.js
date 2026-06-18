const { Client } = require('pg');
const client = new Client('postgresql://postgres:deergh@localhost:5432/ledprisha');

async function fixDB() {
  await client.connect();
  await client.query("UPDATE settings SET about_text = REPLACE(about_text, 'LedPrisha', 'RELED')");
  console.log('Successfully updated database text.');
  await client.end();
}

fixDB().catch(console.error);
