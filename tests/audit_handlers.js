const fs = require('fs');
const path = require('path');
const htmlPath = path.resolve(__dirname, '..', 'mobility_interactive_studio.html');
const content = fs.readFileSync(htmlPath, 'utf8');

const regex = /onclick=["']([^"']+)["']/g;
let m;
const handlers = new Set();
while ((m = regex.exec(content)) !== null) {
  const expr = m[1].trim();
  const fn = expr.split('(')[0].trim();
  if (fn && !fn.includes(';') && !fn.includes('=') && !fn.startsWith('this.')) {
    handlers.add(fn);
  }
}

console.log('Total onclick functions:', handlers.size);
const missing = [];
for (const fn of handlers) {
  const hasDef = content.includes('function ' + fn) || 
                 content.includes('window.' + fn) || 
                 content.includes(fn + ' = function') || 
                 content.includes(fn + ' = () =>') ||
                 content.includes(fn + ' = async');
  if (!hasDef) {
    missing.push(fn);
  }
}

console.log('Missing functions:', missing);
