import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let changedFiles = 0;

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.css') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace standard color classes
    const updatedContent = content
      .replace(/\bgold-/g, 'primary-')
      .replace(/\bamber-/g, 'primary-')
      // Custom classes
      .replace(/\bgradient-gold\b/g, 'gradient-primary')
      .replace(/\bshadow-gold\b/g, 'shadow-primary')
      .replace(/\bshadow-gold-lg\b/g, 'shadow-primary-lg')
      .replace(/\bbadge-gold\b/g, 'badge-primary');

    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      changedFiles++;
      console.log(`Updated ${path.relative(srcDir, filePath)}`);
    }
  }
});

console.log(`\nSuccessfully updated ${changedFiles} files!`);
