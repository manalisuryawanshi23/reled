const fs = require('fs');

const original = fs.readFileSync('database_backup.sql', 'utf8');
const master = fs.readFileSync('master_backup.sql', 'utf8');

// 1. Extract SCHEMA part from original (up to -- DATA)
const schemaPart = original.split('-- =====================================================\n-- DATA\n-- =====================================================')[0];

// 2. Extract PRODUCTS data from original
const productsDataMatch = original.match(/-- Products Data\nINSERT INTO products[\s\S]*?ON CONFLICT \(id\) DO NOTHING;/);
const productsData = productsDataMatch ? productsDataMatch[0] : '';

// 3. Extract INDEXES part from original
const indexesPart = original.substring(original.indexOf('-- =====================================================\n-- INDEXES FOR PERFORMANCE'));

// 4. Extract data from master, remove DELETE statements
const masterDataLines = master.split('\n').filter(line => !line.startsWith('DELETE FROM'));
const cleanMasterData = masterDataLines.join('\n');

// 5. Combine everything
const finalSql = `${schemaPart}
-- =====================================================
-- DATA
-- =====================================================

${cleanMasterData}

${productsData}

${indexesPart}
`;

fs.writeFileSync('database_backup.sql', finalSql);
console.log('Successfully created the perfect database_backup.sql');
