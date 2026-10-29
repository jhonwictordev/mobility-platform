const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'mobility_interactive_studio.html');
const html = fs.readFileSync(filePath, 'utf-8');

console.log('File size:', (html.length / 1024).toFixed(1), 'KB');
const scriptMatches = html.match(/<script[\s\S]*?<\/script>/gi) || [];
console.log('Found script blocks:', scriptMatches.length);

let errors = 0;
scriptMatches.forEach((s, idx) => {
  // Strip outer <script> tag
  const code = s.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '');
  if (code.trim().length > 100) {
    try {
      new Function(code);
      console.log(`[PASS] Script block #${idx} (${code.length} chars) is syntactically valid.`);
    } catch (err) {
      console.error(`[FAIL] Script block #${idx} syntax error:`, err.message);
      errors++;
    }
  }
});

if (errors === 0) {
  console.log('All inline scripts parsed without errors!');
} else {
  process.exit(1);
}
