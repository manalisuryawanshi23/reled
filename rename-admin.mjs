import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adminDir = path.join(__dirname, 'src', 'pages', 'admin');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let changedFiles = 0;

walkDir(adminDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace accent color classes with primary
    const updatedContent = content.replace(/\baccent-/g, 'primary-');

    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      changedFiles++;
      console.log(`Updated ${path.relative(adminDir, filePath)}`);
    }
  }
});

console.log(`\nSuccessfully updated ${changedFiles} files in admin!`);
