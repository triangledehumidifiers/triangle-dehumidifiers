import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const dirs = [
  { dir: 'public/images', prefix: 'images/' },
  { dir: 'public', prefix: '' },
];
for (const { dir, prefix } of dirs) {
  const files = readdirSync(dir).filter((f) => /\.(webp|jpg|png)$/.test(f));
  for (const f of files) {
    const p = join(dir, f);
    const meta = await sharp(p).metadata();
    const kb = Math.round(statSync(p).size / 1024);
    console.log(`${(prefix + f).padEnd(70)} ${meta.width}x${meta.height}  ${kb}KB`);
  }
}
