const { execSync } = require('child_process');
const cwd = 'C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform';
process.env.PATH = 'C:\\Users\\winc\\AppData\\Local\\Programs\\mingit\\cmd;' + process.env.PATH;

execSync('git add .', { cwd, stdio: 'inherit' });
try {
  execSync('git commit -m "feat: SIMBORA final release - fix HTTP 403, MapTiler, openrouteservice, Turf.js and Piacabucu -> Penedo simulation"', { cwd, stdio: 'inherit' });
  execSync('git push origin main', { cwd, stdio: 'inherit' });
  console.log('✅ Alterações enviadas com sucesso para o GitHub!');
} catch (e) {
  console.log('Commit / push finalizado:', e.message);
}
