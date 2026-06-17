// Icon generator script
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const sizes = [72, 96, 128, 192, 512];

sizes.forEach(size => {
  const rx = Math.round(size * 0.2);
  const fontSize = Math.round(size * 0.45);
  const textY = Math.round(size * 0.68);
  const cx = Math.round(size / 2);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f59e0b"/>
      <stop offset="1" stop-color="#ea580c"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${rx}" fill="#0f172a"/>
  <rect width="${size}" height="${size}" rx="${rx}" fill="url(#g)" opacity="0.95"/>
  <text x="${cx}" y="${textY}" font-family="Arial,sans-serif" font-weight="900" font-size="${fontSize}" fill="#0f172a" text-anchor="middle">R</text>
</svg>`;

  // Save as SVG with .png extension (browsers will handle SVG as image source)
  fs.writeFileSync(path.join(dir, `icon-${size}x${size}.png`), svg);
  console.log(`Created icon-${size}x${size}.png`);
});

console.log('All PWA icons created at public/icons/');
