const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'mobility_interactive_studio.html');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

console.log('Total lines:', lines.length);

lines.forEach((line, idx) => {
  if (line.includes('d-bottom-nav') || line.includes('switchDriverTab') || line.includes('d-screen-earnings') || line.includes('d-screen-vehicle') || line.includes('d-screen-docs') || line.includes('d-screen-profile') || line.includes('d-screen-carpools')) {
    console.log(`Line ${idx + 1}: ${line.trim().slice(0, 100)}`);
  }
});
