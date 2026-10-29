const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\SIMBORA IDV';
const rootDir = 'C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform';

const targetDirs = [
  path.join(rootDir, 'brand'),
  path.join(rootDir, 'public', 'brand'),
  path.join(rootDir, 'apps', 'admin', 'public', 'brand'),
  path.join(rootDir, 'apps', 'admin', 'public', 'brand', 'logos'),
  path.join(rootDir, 'apps', 'admin', 'public', 'brand', 'icons'),
  path.join(rootDir, 'apps', 'passenger', 'assets'),
  path.join(rootDir, 'apps', 'driver', 'assets'),
];

for (const d of targetDirs) {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 1. Copy everything from C:\SIMBORA IDV into root/brand and admin/public/brand
copyRecursive(srcDir, path.join(rootDir, 'brand'));
copyRecursive(srcDir, path.join(rootDir, 'public', 'brand'));
copyRecursive(srcDir, path.join(rootDir, 'apps', 'admin', 'public', 'brand'));

// Also copy vectors and pngs directly into admin logos/icons for easy lookup
const svgDir = path.join(srcDir, 'VETORES-OFICIAIS-SVG');
if (fs.existsSync(svgDir)) {
  for (const f of fs.readdirSync(svgDir)) {
    fs.copyFileSync(path.join(svgDir, f), path.join(rootDir, 'apps', 'admin', 'public', 'brand', 'logos', f));
    fs.copyFileSync(path.join(svgDir, f), path.join(rootDir, 'apps', 'admin', 'public', 'brand', 'icons', f));
    fs.copyFileSync(path.join(svgDir, f), path.join(rootDir, 'public', 'brand', f));
  }
}

// Copy icon as favicon.svg and app-icon.svg in admin/public/brand/icons
const iconSvg = path.join(svgDir, 'simbora-app-icon.svg');
if (fs.existsSync(iconSvg)) {
  fs.copyFileSync(iconSvg, path.join(rootDir, 'apps', 'admin', 'public', 'brand', 'icons', 'favicon.svg'));
  fs.copyFileSync(iconSvg, path.join(rootDir, 'apps', 'admin', 'public', 'brand', 'icons', 'app-icon.svg'));
}

// Copy PNG icon to passenger and driver assets
const pngIcon = path.join(srcDir, 'LOGOS-PNG-SEM-FUNDO', 'simbora-icone-app-sem-fundo.png');
if (fs.existsSync(pngIcon)) {
  fs.copyFileSync(pngIcon, path.join(rootDir, 'apps', 'passenger', 'assets', 'icon.png'));
  fs.copyFileSync(pngIcon, path.join(rootDir, 'apps', 'passenger', 'assets', 'adaptive-icon.png'));
  fs.copyFileSync(pngIcon, path.join(rootDir, 'apps', 'driver', 'assets', 'icon.png'));
  fs.copyFileSync(pngIcon, path.join(rootDir, 'apps', 'driver', 'assets', 'adaptive-icon.png'));
}

console.log('Brand assets successfully copied and synchronized across all platform directories!');
