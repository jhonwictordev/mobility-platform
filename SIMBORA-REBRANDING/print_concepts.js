const { execSync } = require('child_process');
const edgePath = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const htmlPath = '"C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING\\simbora-rebranding-concepts.html"';
const pdfPath = '"C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING\\03-LOGO\\concepts\\SIMBORA-CONCEITOS-FASE-4.pdf"';

console.log('Generating Phase 4 presentation PDF...');
execSync(`${edgePath} --headless --no-sandbox --disable-gpu --no-pdf-header-footer --print-to-pdf=${pdfPath} ${htmlPath}`);
console.log('PDF Generation Complete.');
