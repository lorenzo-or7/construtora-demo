// Gera og-image.jpg (1200x630) e apple-touch-icon.png a partir dos assets locais.
import sharp from 'sharp';
const og = await sharp('public/images/hero-1600.webp').resize(1200, 630, { fit: 'cover', position: 'attention' }).modulate({ brightness: 0.82 }).toBuffer();
const overlay = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
<rect width="1200" height="630" fill="url(#g)"/><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.35" stop-color="#151A17" stop-opacity="0"/><stop offset="1" stop-color="#151A17" stop-opacity="0.85"/></linearGradient></defs>
<g transform="translate(72 470)" fill="none" stroke="#F4F1E9" stroke-width="2.4"><path d="M0 0h44v44H0z"/><path d="M14 9h16v16H14zM14 25v19M30 25v19"/></g>
<text x="140" y="508" fill="#F4F1E9" font-family="Georgia, serif" font-size="64">Espaços que atravessam o tempo.</text>
<text x="142" y="548" fill="#D9D3C4" font-family="Arial, sans-serif" font-size="22" letter-spacing="1">ATRIUM · Protótipo conceitual Or7.dev</text></svg>`);
await sharp(og).composite([{ input: overlay }]).jpeg({ quality: 82 }).toFile('public/og-image.jpg');
const icon = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="180" height="180"><rect width="32" height="32" fill="#202521"/><path d="M7 7h18v18H7z" fill="none" stroke="#C3AF91" stroke-width="1.5"/><path d="M12.5 10.5h7v7h-7zM12.5 17.5V25M19.5 17.5V25" fill="none" stroke="#C3AF91" stroke-width="1.5"/></svg>`);
await sharp(icon).png().toFile('public/apple-touch-icon.png');
console.log('ok');
