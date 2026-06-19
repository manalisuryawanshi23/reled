const { Client } = require('pg');
const fs = require('fs');

const client = new Client('postgresql://postgres:deergh@localhost:5432/ledprisha');

const tables = [
  'settings',
  'users',
  'categories',
  'subcategories',
  'products',
  'sectors',
  'gallery',
  'testimonials',
  'faqs',
  'team_members',
  'enquiries'
];

async function exportAll() {
  await client.connect();
  let sql = '-- MASTER DATABASE EXPORT\n\n';

  for (const table of tables) {
    try {
      const res = await client.query(`SELECT * FROM ${table}`);
      if (res.rows.length === 0) continue;

      sql += `-- Table: ${table}\n`;
      sql += `DELETE FROM ${table};\n`;

      const columns = Object.keys(res.rows[0]);
      
      for (const row of res.rows) {
        const values = columns.map(col => {
          const val = row[col];
          if (val === null) return 'NULL';
          if (typeof val === 'boolean') return val;
          if (typeof val === 'number') return val;
          if (Array.isArray(val)) {
            // Convert JS array to Postgres array string format '{a,b}'
            const arrStr = val.map(v => typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v).join(',');
            return `'{${arrStr}}'`;
          }
          if (typeof val === 'object') {
            // JSONB or Dates
            if (val instanceof Date) return `'${val.toISOString()}'`;
            return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
          }
          // String
          return `'${String(val).replace(/'/g, "''")}'`;
        });

        sql += `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
      }
      sql += '\n';
    } catch (e) {
      console.log(`Skipping ${table}: ${e.message}`);
    }
  }

  fs.writeFileSync('master_backup.sql', sql);
  console.log('Successfully generated master_backup.sql!');
  await client.end();
}

exportAll().catch(console.error);
