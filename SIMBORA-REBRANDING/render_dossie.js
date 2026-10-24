const { execSync } = require('child_process');
const fs = require('fs');

const edgePath = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const htmlPath = '"C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING\\SIMBORA_DOSSIE_COMPLETO_REBRANDING.html"';
const pdfPath = '"C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING\\SIMBORA_DOSSIE_COMPLETO_REBRANDING.pdf"';

console.log('Rendering SIMBORA_DOSSIE_COMPLETO_REBRANDING.pdf...');
execSync(`${edgePath} --headless --no-sandbox --disable-gpu --no-pdf-header-footer --print-to-pdf=${pdfPath} ${htmlPath}`);

const stats = fs.statSync('C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING\\SIMBORA_DOSSIE_COMPLETO_REBRANDING.pdf');
console.log('Dossier Rendered Successfully! PDF Size:', stats.size, 'bytes.');
