const fs = require('fs');

let sql = fs.readFileSync('master_backup.sql', 'utf8');

const correctHeroSlides = [
  {
    "headline": "Illuminate Your World",
    "subheadline": "Premium LED lighting solutions for every space",
    "image_url": "https://images.pexels.com/photos/1125136/pexels-photo-1125136.jpeg?auto=compress&cs=tinysrgb&w=1920",
    "cta_text": "Explore Products",
    "cta_link": "/products"
  },
  {
    "headline": "Architectural Excellence",
    "subheadline": "Transform buildings into stunning visual experiences",
    "image_url": "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920",
    "cta_text": "View Solutions",
    "cta_link": "/products/category/architectural"
  },
  {
    "headline": "Industrial Strength",
    "subheadline": "Reliable lighting for demanding environments",
    "image_url": "https://images.pexels.com/photos/257740/pexels-photo-257740.jpeg?auto=compress&cs=tinysrgb&w=1920",
    "cta_text": "Learn More",
    "cta_link": "/sectors"
  }
];

const stringified = JSON.stringify(correctHeroSlides).replace(/'/g, "''");
sql = sql.replace("'{[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]}'", `'${stringified}'`);

fs.writeFileSync('master_backup.sql', sql);
console.log("Fixed master_backup.sql hero_slides");
