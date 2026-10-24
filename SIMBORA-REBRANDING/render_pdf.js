const { execSync } = require('child_process');
const fs = require('fs');

const edgePath = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const htmlPath = '"C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING\\06-BRAND-BOOK\\SIMBORA-BRAND-BOOK-V2.html"';
const pdfPath = '"C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING\\06-BRAND-BOOK\\SIMBORA-BRAND-BOOK-V2.pdf"';

console.log('Rendering SIMBORA-BRAND-BOOK-V2.pdf...');
execSync(`${edgePath} --headless --no-sandbox --disable-gpu --no-pdf-header-footer --print-to-pdf=${pdfPath} ${htmlPath}`);

const stats = fs.statSync('C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING\\06-BRAND-BOOK\\SIMBORA-BRAND-BOOK-V2.pdf');
console.log('Success! Rendered PDF size:', stats.size, 'bytes.');
