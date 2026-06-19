const { Client } = require('pg');
const fs = require('fs');
const client = new Client('postgresql://postgres:deergh@localhost:5432/ledprisha');

async function exportData() {
  await client.connect();
  
  const cats = await client.query('SELECT * FROM categories');
  let catSql = '-- Categories Data\nINSERT INTO categories (id, name, slug, description, image_url, sort_order, is_active) VALUES\n';
  catSql += cats.rows.map(c => `('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.slug}', '${(c.description || '').replace(/'/g, "''")}', '${c.image_url}', ${c.sort_order}, ${c.is_active})`).join(',\n');
  catSql += '\nON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, image_url = EXCLUDED.image_url, sort_order = EXCLUDED.sort_order;\n\n';
  
  const subcats = await client.query('SELECT * FROM subcategories');
  let subSql = '-- Subcategories Data\nINSERT INTO subcategories (id, category_id, name, slug, description, sort_order, is_active) VALUES\n';
  subSql += subcats.rows.map(s => `('${s.id}', '${s.category_id}', '${s.name.replace(/'/g, "''")}', '${s.slug}', '${(s.description || '').replace(/'/g, "''")}', ${s.sort_order}, ${s.is_active})`).join(',\n');
  subSql += '\nON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order, category_id = EXCLUDED.category_id;\n\n';

  fs.writeFileSync('exported_categories.sql', catSql + subSql);
  console.log('Exported to exported_categories.sql');
  await client.end();
}

exportData().catch(console.error);
