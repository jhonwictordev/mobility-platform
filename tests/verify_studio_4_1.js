const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const studioPath = path.join(rootDir, 'mobility_interactive_studio.html');
const html = fs.readFileSync(studioPath, 'utf8');

console.log('--- Verifying mobility_interactive_studio.html (SIMBORA 4.1) ---');

const checks = [
  { name: 'Driver 5-tab Nav Exists (nav, rides, carpools, earnings, profile)', test: html.includes('d-tab-nav') && html.includes('d-tab-rides') && html.includes('d-tab-carpools') && html.includes('d-tab-earnings') && html.includes('d-tab-profile') },
  { name: 'Vehicle & Docs removed from bottom bar', test: !html.includes('id="d-tab-docs"') && !html.includes('id="d-tab-vehicle"') },
  { name: 'Minhas Corridas Screen Exists (d-screen-rides)', test: html.includes('id="d-screen-rides"') },
  { name: 'Minhas Caronas Screen Exists (d-screen-carpools)', test: html.includes('id="d-screen-carpools"') },
  { name: 'Meus Ganhos Screen Exists (d-screen-earnings)', test: html.includes('id="d-screen-earnings"') },
  { name: 'Modality Filter Buttons Exist (TODOS | CORRIDAS | CARONAS)', test: html.includes('d-filter-btn-all') && html.includes('d-filter-btn-rides') && html.includes('d-filter-btn-carpools') },
  { name: 'Migrated Vehicle in Profile', test: html.includes('navigateToDriver(\'d-screen-vehicle\')') },
  { name: 'Migrated Docs in Profile', test: html.includes('navigateToDriver(\'d-screen-docs\')') },
  { name: 'Statement with Modality Tags', test: html.includes('CORRIDA URBANA') && html.includes('CARONA INTERMUNICIPAL') },
  { name: 'MapLibre GL JS & Street Tiles Preserved', test: html.includes('maplibregl.Map') && (html.includes('maptiler') || html.includes('arcgisonline')) },
  { name: 'Alagoas Routes Preserved (AL-101 / Piaçabuçu / Penedo)', test: html.includes('AL-101') && html.includes('Piaçabuçu') && html.includes('Penedo') }
];

let allPassed = true;
checks.forEach(c => {
  console.log(`[${c.test ? 'PASS' : 'FAIL'}] ${c.name}`);
  if (!c.test) allPassed = false;
});

if (allPassed) {
  console.log('\n>>> ALL 11 VERIFICATION CHECKS PASSED FOR STUDIO 4.1! <<<');
} else {
  console.error('\n>>> SOME VERIFICATION CHECKS FAILED! <<<');
  process.exit(1);
}
