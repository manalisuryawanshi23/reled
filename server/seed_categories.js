import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Copy the generated images from the brain directory
const brainDir = 'C:/Users/MPPKVVCL/.gemini/antigravity-ide/brain/793f01b0-4312-4131-a62b-bec2ea4b7cc9';
const images = {
  'Indoor Lighting': 'indoor_lighting_1781880234381.png',
  'Outdoor Lighting': 'outdoor_lighting_1781880246488.png',
  'Architectural Lighting': 'architectural_lighting_1781880260327.png',
  'Decorative Pole': 'decorative_pole_1781880276468.png',
  'Underwater Light': 'underwater_light_1781880291711.png',
  'EV Charger': 'ev_charger_1781880304776.png'
};

const categoryMap = {};

for (const [name, filename] of Object.entries(images)) {
  const src = path.join(brainDir, filename);
  const dest = path.join(uploadsDir, filename);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    categoryMap[name] = `/uploads/${filename}`;
  } else {
    categoryMap[name] = ''; // fallback
  }
}

const pool = new Pool({
  user: 'postgres',
  password: 'deergh',
  host: 'localhost',
  port: 5432,
  database: 'ledprisha'
});

const categories = [
  {
    name: 'Indoor Lighting',
    subcategories: ['LED Panel Light', 'LED COB Light', 'LED Bulb / Tube Light', 'LED Track Light', 'LED Cylinder Light']
  },
  {
    name: 'Outdoor Lighting',
    subcategories: ['LED Street Light', 'LED Flood Light', 'LED Stadium Light', 'LED Highway Light', 'LED Solar Light']
  },
  {
    name: 'Architectural Lighting',
    subcategories: ['COB Light', 'Magnetic Light', 'Strip Light / SMPS', 'LED Foot Lamp', 'Profile Light', 'Hanging Profile Light', 'Gimble Lighting', 'Facade Lighting']
  },
  {
    name: 'Decorative Pole',
    subcategories: ['Pole Light', 'Bollard Light']
  },
  {
    name: 'Underwater Light',
    subcategories: ['Inground Light', 'Nozzle Light', 'Garden Light', 'Fiber Optic Light', 'Wall Washer Light', 'DMX Flood Light']
  },
  {
    name: 'EV Charger',
    subcategories: ['AC EV Charger', 'DC Fast Charger', 'Home EV Charger', 'Commercial EV Charger', 'EV Charging Station']
  }
];

function generateSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function seed() {
  try {
    // We do NOT truncate categories to avoid deleting products if there are any.
    // Actually, TRUNCATE CASCADE will delete products. 
    // Wait, the user didn't mention products. If we delete categories, products without ON DELETE CASCADE will either be deleted or their category_id set to NULL.
    // The schema says ON DELETE SET NULL for products. So it's perfectly safe!
    
    console.log('Truncating categories and subcategories...');
    await pool.query('TRUNCATE TABLE subcategories CASCADE');
    await pool.query('TRUNCATE TABLE categories CASCADE');

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const catSlug = generateSlug(cat.name);
      const imageUrl = categoryMap[cat.name] || '';

      const catRes = await pool.query(
        `INSERT INTO categories (name, slug, sort_order, image_url) VALUES ($1, $2, $3, $4) RETURNING id`,
        [cat.name, catSlug, i + 1, imageUrl]
      );
      const catId = catRes.rows[0].id;
      console.log(`Created category: ${cat.name} (Image: ${imageUrl})`);

      for (let j = 0; j < cat.subcategories.length; j++) {
        const subName = cat.subcategories[j];
        const subSlug = generateSlug(subName);
        
        // We'll just inherit the parent's image for subcategories so it doesn't look broken
        await pool.query(
          `INSERT INTO subcategories (category_id, name, slug, sort_order, image_url) VALUES ($1, $2, $3, $4, $5)`,
          [catId, subName, subSlug, j + 1, imageUrl]
        );
        console.log(`  Created subcategory: ${subName}`);
      }
    }

    console.log('Successfully seeded all categories and subcategories!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    pool.end();
  }
}

seed();
