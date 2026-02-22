import sharp from 'sharp';
import { readdirSync, statSync, unlinkSync, writeFileSync } from 'fs';
import { join, extname, basename } from 'path';

async function compress(src, dest, opts) {
  const maxWidth = opts && opts.maxWidth ? opts.maxWidth : null;
  const quality = opts && opts.quality ? opts.quality : 60;
  const sizeBefore = statSync(src).size;

  let pipeline = sharp(src);
  if (maxWidth) {
    const meta = await sharp(src).metadata();
    if (meta.width > maxWidth) pipeline = pipeline.resize({ width: maxWidth });
  }
  const buf = await pipeline.webp({ quality }).toBuffer();
  writeFileSync(dest, buf);

  const sizeAfter = statSync(dest).size;
  const saved = Math.round((sizeBefore - sizeAfter) / 1024);
  console.log(basename(src).padEnd(65) + ' ' + Math.round(sizeBefore/1024) + 'KB -> ' + Math.round(sizeAfter/1024) + 'KB  (-' + saved + 'KB)');
  return sizeBefore - sizeAfter;
}

let totalSaved = 0;

console.log('\n=== Logo ===');
totalSaved += await compress('public/logo.webp', 'public/logo.webp', { maxWidth: 200, quality: 85 });

console.log('\n=== Content images ===');
const imgDir = 'public/images';
for (const f of readdirSync(imgDir)) {
  const p = join(imgDir, f);
  const ext = extname(f).toLowerCase();
  if (ext === '.webp') {
    const isHero = f.includes('hero') || f.includes('encapsulated-crawlspace-raleigh-nc');
    totalSaved += await compress(p, p, { maxWidth: isHero ? 1440 : 1200, quality: 60 });
  } else if (ext === '.jpg' || ext === '.jpeg') {
    const newPath = join(imgDir, basename(f, ext) + '.webp');
    totalSaved += await compress(p, newPath, { maxWidth: 1200, quality: 60 });
    unlinkSync(p);
    console.log('    converted ' + f + ' to .webp');
  }
}

console.log('\nTotal saved: ' + Math.round(totalSaved / 1024) + ' KB');
