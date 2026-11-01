const fs = require('fs');
const path = require('path');
const puppeteer = require('C:\\Users\\winc\\.gemini\\antigravity\\scratch\\flow-automation\\node_modules\\puppeteer-core');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const studioDir = 'C:\\Users\\winc\\Desktop\\SIMBORA-CREATIVE-STUDIO';
const logosDir = path.join(studioDir, 'SIMBORA_BRAND_ASSETS', 'LOGOS');
const elementsDir = path.join(studioDir, 'SIMBORA_BRAND_ASSETS', 'GRAPHIC_ELEMENTS');

console.log('Generating Reusable Graphic Elements & Complete Logo Library...');

// 1. Vector Map Pin (for map UI & location mockups)
const mapPinSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 160" width="100%" height="100%">
  <!-- SIMBORA TRANSIT MAP PIN -->
  <defs>
    <filter id="pin-shadow" x="-30%" y="-20%" width="160%" height="160%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#123D32" flood-opacity="0.35"/>
    </filter>
  </defs>
  <!-- Shadow ground ellipse -->
  <ellipse cx="60" cy="150" rx="26" ry="7" fill="#123D32" opacity="0.3"/>
  <!-- Pin Teardrop Shape -->
  <path d="M 60 144 C 60 144, 12 88, 12 52 C 12 25.5, 33.5 4, 60 4 C 86.5 4, 108 25.5, 108 52 C 108 88, 60 144, 60 144 Z" fill="#123D32" filter="url(#pin-shadow)"/>
  <!-- Inner White Disc -->
  <circle cx="60" cy="52" r="38" fill="#F8F9F6"/>
  <!-- S! Mini Vector inside pin -->
  <g transform="translate(37, 26) scale(0.19) skewX(-12)">
    <path d="M 188 28 L 138 28 C 130 16, 116 10, 94 10 C 58 10, 36 30, 36 60 C 36 86, 56 102, 102 114 L 140 126 L 40 162 C 15 146, 0 120, 0 70 C 0 22, 42 0, 100 0 C 158 0, 186 24, 188 28 Z" fill="#123D32"/>
    <path d="M 198 214 C 198 284, 150 326, 88 326 C 34 326, 2 292, 0 236 L 56 230 C 58 262, 74 278, 96 278 C 122 278, 142 260, 142 228 C 142 200, 124 186, 78 172 L 68 168 L 168 132 C 188 152, 198 180, 198 214 Z" fill="#16A572"/>
    <polygon points="238,8 288,8 274,212 248,212" fill="#FFCC45"/>
    <circle cx="260" cy="282" r="28" fill="#FFCC45"/>
  </g>
</svg>`;

// 2. Vector Speed Slashes Pattern (12° dynamic movement lines)
const speedPatternSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300" width="100%" height="100%">
  <!-- SIMBORA 12-DEGREE SPEED SLASHES -->
  <g transform="skewX(-12)">
    <rect x="50" y="20" width="220" height="12" rx="6" fill="#16A572" opacity="0.8"/>
    <rect x="290" y="20" width="70" height="12" rx="6" fill="#FFCC45"/>
    <rect x="120" y="60" width="340" height="16" rx="8" fill="#16A572"/>
    <rect x="480" y="60" width="40" height="16" rx="8" fill="#FFCC45"/>
    <rect x="20" y="110" width="180" height="10" rx="5" fill="#123D32" opacity="0.3"/>
    <rect x="230" y="110" width="450" height="10" rx="5" fill="#16A572" opacity="0.6"/>
    <rect x="700" y="110" width="90" height="10" rx="5" fill="#FFCC45"/>
    <rect x="180" y="160" width="280" height="14" rx="7" fill="#16A572" opacity="0.9"/>
    <rect x="480" y="160" width="120" height="14" rx="7" fill="#FFCC45"/>
    <rect x="80" y="210" width="480" height="18" rx="9" fill="#123D32" opacity="0.4"/>
    <rect x="580" y="210" width="60" height="18" rx="9" fill="#FFCC45"/>
  </g>
</svg>`;

// 3. Official App Store & Google Play Badges
const appStoreBadgesSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 70" width="100%" height="100%">
  <!-- GOOGLE PLAY & APP STORE DOWNLOAD BADGES -->
  <!-- Google Play -->
  <g transform="translate(0, 0)">
    <rect width="215" height="66" rx="14" fill="#0D2C23" stroke="rgba(22, 165, 114, 0.4)" stroke-width="1.5"/>
    <!-- Play Icon -->
    <g transform="translate(18, 15) scale(0.07)">
      <path d="M 45 20 L 290 260 L 45 500 Z" fill="#16A572"/>
      <path d="M 45 20 L 370 200 L 290 260 Z" fill="#FFCC45"/>
      <path d="M 45 500 L 370 320 L 290 260 Z" fill="#F8F9F6"/>
      <path d="M 370 200 L 450 245 C 465 255, 465 265, 450 275 L 370 320 L 290 260 Z" fill="#FFCC45"/>
    </g>
    <text x="64" y="27" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" fill="#A3C9BC" letter-spacing="1.5">DISPONÍVEL NO</text>
    <text x="64" y="47" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="900" fill="#F8F9F6">Google Play</text>
  </g>

  <!-- App Store -->
  <g transform="translate(235, 0)">
    <rect width="215" height="66" rx="14" fill="#0D2C23" stroke="rgba(22, 165, 114, 0.4)" stroke-width="1.5"/>
    <!-- Apple Icon -->
    <g transform="translate(20, 16) scale(0.07)">
      <path d="M 230 180 C 230 130, 270 100, 275 95 C 250 60, 210 55, 195 55 C 160 50, 125 75, 105 75 C 90 75, 60 50, 30 55 C -5 60, -35 85, -55 125 C -90 190, -65 285, -30 335 C -10 360, 10 385, 35 385 C 60 385, 70 365, 100 365 C 130 365, 140 385, 165 385 C 195 385, 215 360, 230 335 C 255 300, 265 265, 265 260 C 260 255, 230 240, 230 180 Z" fill="#F8F9F6"/>
      <path d="M 155 40 C 170 20, 180 -5, 175 -30 C 150 -25, 125 -10, 110 10 C 95 30, 85 55, 90 80 C 115 80, 140 60, 155 40 Z" fill="#F8F9F6"/>
    </g>
    <text x="64" y="27" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" fill="#A3C9BC" letter-spacing="1.5">BAIXAR NA</text>
    <text x="64" y="47" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="900" fill="#F8F9F6">App Store</text>
  </g>
</svg>`;

// Write graphic elements
fs.writeFileSync(path.join(elementsDir, 'map-pin-simbora.svg'), mapPinSvg, 'utf8');
fs.writeFileSync(path.join(elementsDir, 'pattern-speed-lines.svg'), speedPatternSvg, 'utf8');
fs.writeFileSync(path.join(elementsDir, 'app-store-badges-simbora.svg'), appStoreBadgesSvg, 'utf8');

console.log('Graphic elements written.');

// Render PNGs into LOGOS folder
async function renderLogos() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();

  const finalDir = 'C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING\\03-LOGO\\final-identity';
  const logoLight = fs.readFileSync(path.join(finalDir, 'simbora-logo-horizontal-light.svg'), 'utf8');
  const logoDark = fs.readFileSync(path.join(finalDir, 'simbora-logo-horizontal-dark.svg'), 'utf8');
  const appIcon = fs.readFileSync(path.join(finalDir, 'simbora-app-icon.svg'), 'utf8');
  const symbol = fs.readFileSync(path.join(finalDir, 'simbora-symbol-isolated.svg'), 'utf8');

  async function exportItem(html, w, h, outPath, isPng, bg) {
    const full = `<!DOCTYPE html><html><head><meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800;900&display=swap" rel="stylesheet">
      <style>* { margin:0; padding:0; box-sizing:border-box; } body { width:100vw; height:100vh; display:flex; align-items:center; justify-content:center; background:${bg}; overflow:hidden; }</style>
    </head><body>${html}</body></html>`;
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
    await page.setContent(full, { waitUntil: 'networkidle0' });
    if (isPng) {
      await page.screenshot({ path: outPath, type: 'png', omitBackground: bg === 'transparent' });
    } else {
      await page.screenshot({ path: outPath, type: 'jpeg', quality: 100 });
    }
    console.log('Exported:', path.basename(outPath));
  }

  // PNG Transparent
  await exportItem(`<div style="width:85%">${logoLight.replace(/<rect width="780" height="200" fill="#FFFFFF"\/>/, '')}</div>`, 2000, 650, path.join(logosDir, 'simbora-logo-horizontal-sem-fundo.png'), true, 'transparent');
  await exportItem(`<div style="width:85%">${logoDark.replace(/<rect width="780" height="200" fill="#123D32"\/>/, '')}</div>`, 2000, 650, path.join(logosDir, 'simbora-logo-horizontal-branca-sem-fundo.png'), true, 'transparent');
  await exportItem(`<div style="width:75%; height:75%">${symbol}</div>`, 1500, 1500, path.join(logosDir, 'simbora-simbolo-s-exclamacao-sem-fundo.png'), true, 'transparent');
  await exportItem(`<div style="width:80%; height:80%">${appIcon}</div>`, 1024, 1024, path.join(logosDir, 'simbora-icone-app-sem-fundo.png'), true, 'transparent');

  // JPG Solid
  await exportItem(`<div style="width:100vw; height:100vh; background:#123D32; display:flex; align-items:center; justify-content:center;"><div style="width:75%">${logoDark}</div></div>`, 2400, 1350, path.join(logosDir, 'simbora-logo-fundo-verde-profundo.jpg'), false, '#123D32');
  await exportItem(`<div style="width:100vw; height:100vh; background:#FFFFFF; display:flex; align-items:center; justify-content:center;"><div style="width:75%">${logoLight}</div></div>`, 2400, 1350, path.join(logosDir, 'simbora-logo-fundo-branco.jpg'), false, '#FFFFFF');

  await browser.close();
  console.log('All studio logo assets successfully exported.');
}

renderLogos().catch(console.error);
