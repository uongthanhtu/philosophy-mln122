/**
 * Remove BLUE chroma-key background from PNG images using Sharp.
 * Uses blue (#0000FF) instead of green to preserve green leaves on trees.
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const INPUT_DIR = path.join(__dirname, 'input');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets');

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

// Detect BLUE pixels (Hue 200-260, Saturation > 30%)
function isBlue(r, g, b) {
  const [h, s, l] = rgbToHsl(r, g, b);
  return (
    h >= 200 && h <= 260 &&
    s >= 30 &&
    l >= 10 && l <= 85
  );
}

async function removeBlue(inputPath, outputPath) {
  const image = sharp(inputPath);
  const { width, height } = await image.metadata();

  const rawBuffer = await image.ensureAlpha().raw().toBuffer();
  const pixels = new Uint8Array(rawBuffer);
  const total = width * height;
  let removed = 0;

  // Pass 1: Remove blue pixels
  for (let i = 0; i < total; i++) {
    const o = i * 4;
    if (isBlue(pixels[o], pixels[o + 1], pixels[o + 2])) {
      pixels[o + 3] = 0;
      removed++;
    }
  }

  // Pass 2: Edge smoothing
  const out = new Uint8Array(pixels);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4;
      if (out[i + 3] === 0) continue;

      let trans = 0;
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const ni = ((y + dy) * width + (x + dx)) * 4;
        if (pixels[ni + 3] === 0) trans++;
      }

      if (trans >= 2) {
        const [h, s] = rgbToHsl(out[i], out[i + 1], out[i + 2]);
        if (h >= 190 && h <= 270 && s >= 20) {
          out[i + 3] = Math.round(out[i + 3] * 0.4);
        }
      }
    }
  }

  // Pass 3: Auto-crop transparent edges
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (out[(y * width + x) * 4 + 3] > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  await sharp(Buffer.from(out), { raw: { width, height, channels: 4 } })
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .png()
    .toFile(outputPath);

  const pct = ((removed / total) * 100).toFixed(1);
  console.log(`✅ ${path.basename(inputPath)} → ${cropW}x${cropH} (${pct}% blue removed)`);
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.png'));
  console.log(`\n🔵 Removing BLUE backgrounds from ${files.length} images...\n`);

  for (const file of files) {
    await removeBlue(path.join(INPUT_DIR, file), path.join(OUTPUT_DIR, file));
  }
  console.log(`\n✅ Done!\n`);
}

main().catch(console.error);
