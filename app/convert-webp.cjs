const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'public', 'assets');
const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png'));

(async () => {
  for (const file of files) {
    const input = path.join(assetsDir, file);
    const output = path.join(assetsDir, file.replace('.png', '.webp'));
    const before = fs.statSync(input).size;
    await sharp(input).webp({ quality: 82 }).toFile(output);
    const after = fs.statSync(output).size;
    const saved = ((1 - after / before) * 100).toFixed(1);
    console.log(`${file} → ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB (${saved}% saved)`);
  }
  console.log(`\nConverted ${files.length} files.`);
})();
