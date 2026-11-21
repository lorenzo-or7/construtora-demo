// Baixa fotografias (Unsplash License) e gera versões WebP otimizadas + cor dominante.
// Uso: node scripts/fetch-images.mjs
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';

const photos = {
  'hero': '1614595737476-42487331b8a1',
  'hero-mobile': '1691425700573-5e2e6e4f6157',
  'manifesto': '1481253127861-534498168948',
  'aura-cover': '1691425700585-c108acad6467',
  'aura-social': '1724582586529-62622e50c0b3',
  'aura-interior': '1724582586580-8b52c02e99dd',
  'aura-landscape': '1721222204525-1118ce3860e1',
  'aura-extra': '1523217582562-09d0def993a6',
  'vertice-cover': '1506499802526-830edae0cb9a',
  'vertice-facade': '1583338850703-bc602b103674',
  'vertice-social': '1724582586495-d050726cf354',
  'vertice-interior': '1663811397091-9a13493eff11',
  'vertice-landscape': '1776362552930-fea1349d22af',
  'vertice-extra': '1619218070141-bcfeb8b93074',
  'noma-cover': '1780507637834-beafd4a79bc8',
  'noma-facade': '1789144528441-0657974d294d',
  'noma-social': '1768413292179-d958b344f1d4',
  'noma-interior': '1768578927019-8be9eb339fb5',
  'noma-landscape': '1757524492552-d47a66a2b63e',
  'noma-extra': '1776186243408-3c0489503faa',
  'mat-concrete': '1770892378739-004c0c702888',
  'mat-stone': '1542732056-648731297c97',
  'mat-wood': '1763392199003-27cee33bae31',
  'mat-glass': '1509024368907-57294758cfc5',
  'live-1': '1758915753369-6a33c7bc1d76',
  'live-2': '1762544968153-b9b47435fefd',
  'live-3': '1663811396649-b042463b8900',
  'live-4': '1600210491369-e753d80a41f3',
  'live-5': '1724582586458-a51791349977',
  'proc-vision': '1542621334-a254cf47733d',
  'proc-planning': '1603901622056-0a5bee231395',
  'proc-execution': '1527335988388-b40ee248d80c',
  'proc-delivery': '1483366774565-c783b9f70e2c',
};

const widths = [800, 1600];
const meta = {};
await mkdir('public/images', { recursive: true });
for (const [key, id] of Object.entries(photos)) {
  const res = await fetch(`https://images.unsplash.com/photo-${id}?w=2200&q=85&fm=jpg`);
  if (!res.ok) throw new Error(`${key}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const img = sharp(buf);
  const { width, height } = await img.metadata();
  for (const w of widths) {
    await sharp(buf).resize({ width: w, withoutEnlargement: true }).webp({ quality: 72 }).toFile(`public/images/${key}-${w}.webp`);
  }
  const { dominant } = await img.stats();
  const hex = '#' + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, '0')).join('');
  meta[key] = { w: width, h: height, color: hex, source: `https://images.unsplash.com/photo-${id}` };
  console.log(key, width, height, hex);
}
await writeFile('src/data/image-meta.json', JSON.stringify(meta, null, 2));
