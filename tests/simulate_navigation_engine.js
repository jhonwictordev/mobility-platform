const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function runSimulation(appName, filePath) {
  console.log(`\n=============================================================`);
  console.log(`SIMULATING NAVIGATION: ${appName}`);
  console.log(`File: ${filePath}`);
  console.log(`=============================================================`);

  const html = fs.readFileSync(filePath, 'utf8');

  // Parse all elements with id or class
  const elements = {};
  const idRegex = /id="([^"]+)"/g;
  let m;
  while ((m = idRegex.exec(html)) !== null) {
    const id = m[1];
    if (!elements[id]) {
      elements[id] = {
        id,
        classList: new Set(),
        style: {},
        className: '',
        textContent: '',
        onclick: null
      };
    }
  }

  // Find all d-page-view elements
  const pageViewRegex = /<div\s+id="([^"]+)"[^>]*class="([^"]*d-page-view[^"]*)"/g;
  const pageViews = [];
  while ((m = pageViewRegex.exec(html)) !== null) {
    const id = m[1];
    const classes = m[2].split(/\s+/).filter(Boolean);
    if (!elements[id]) {
      elements[id] = { id, classList: new Set(classes), style: {}, className: m[2] };
    } else {
      classes.forEach(c => elements[id].classList.add(c));
      elements[id].className = m[2];
    }
    pageViews.push(elements[id]);
  }

  // Find all buttons with id d-tab-*
  const tabRegex = /<button[^>]*id="(d-tab-[^"]+)"[^>]*onclick="([^"]+)"[^>]*class="([^"]+)"/g;
  while ((m = tabRegex.exec(html)) !== null) {
    const id = m[1];
    const onclickStr = m[2];
    const cls = m[3];
    if (elements[id]) {
      elements[id].className = cls;
      elements[id].onclickStr = onclickStr;
    }
  }

  // Build fake DOM
  const fakeDoc = {
    getElementById: (id) => {
      if (!elements[id]) {
        elements[id] = { id, classList: new Set(), style: {}, className: '', innerText: '', textContent: '' };
      }
      const el = elements[id];
      if (!el.classList.contains) {
        el.classList.contains = (c) => el.classList.has(c);
        el.classList.add = (c) => el.classList.add(c);
        el.classList.remove = (c) => el.classList.delete(c);
      }
      return el;
    },
    querySelectorAll: (selector) => {
      if (selector === '.d-page-view') {
        return pageViews.map(el => {
          if (!el.classList.contains) {
            el.classList.contains = (c) => el.classList.has(c);
            el.classList.add = (c) => el.classList.add(c);
            el.classList.remove = (c) => el.classList.delete(c);
          }
          return el;
        });
      }
      if (selector === '.d-tab-btn') {
        return ['nav', 'rides', 'carpools', 'earnings', 'profile'].map(t => {
          return fakeDoc.getElementById('d-tab-' + t);
        });
      }
      return [];
    }
  };

  // Extract JS scripts from HTML
  const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptCode = '';
  while ((m = scriptRegex.exec(html)) !== null) {
    scriptCode += '\n' + m[1];
  }

  // Prepare Sandbox Context
  const sandbox = {
    document: fakeDoc,
    addEventListener: () => {},
    location: { search: '', href: '' },
    URLSearchParams: global.URLSearchParams,
    localStorage: { getItem: () => null, setItem: () => null },
    tailwind: { config: {} },
    console: { log: () => {}, warn: () => {}, error: console.error },
    setTimeout: (fn) => {},
    alert: (msg) => {},
    lucide: { createIcons: () => {} },
    maplibregl: { Map: function() { return { on: () => {}, resize: () => {}, setStyle: () => {} }; }, Marker: function() { return { setLngLat: () => ({ addTo: () => {} }) }; } },
    dMap: { resize: () => {} },
    pMap: { resize: () => {} },
    logEvent: () => {}
  };
  sandbox.window = sandbox;

  // Execute scripts in Sandbox
  const vm = require('vm');
  const context = vm.createContext(sandbox);
  vm.runInContext(scriptCode, context);

  function isElementVisible(id) {
    const el = fakeDoc.getElementById(id);
    if (!el) return false;
    const hasHidden = el.classList.has('hidden');
    const isDisplayNone = el.style.display === 'none';
    return !hasHidden && !isDisplayNone;
  }

  function getActiveTab() {
    for (const t of ['nav', 'rides', 'carpools', 'earnings', 'profile']) {
      const tabEl = fakeDoc.getElementById('d-tab-' + t);
      if (tabEl && tabEl.className.includes('#FFCC45')) {
        return t;
      }
    }
    return null;
  }

  const sequence = [
    { num: 1, name: '1. Abrir Navegar', run: () => context.switchDriverTab('nav'), check: () => isElementVisible('d-screen-nav') && getActiveTab() === 'nav' },
    { num: 2, name: '2. Clicar Corridas', run: () => context.switchDriverTab('rides'), check: () => isElementVisible('d-screen-rides') && !isElementVisible('d-screen-nav') && getActiveTab() === 'rides' },
    { num: 3, name: '3. Confirmar página Corridas', run: () => {}, check: () => isElementVisible('d-screen-rides') },
    { num: 4, name: '4. Clicar Caronas', run: () => context.switchDriverTab('carpools'), check: () => isElementVisible('d-screen-carpools') && !isElementVisible('d-screen-rides') && getActiveTab() === 'carpools' },
    { num: 5, name: '5. Confirmar página Caronas', run: () => {}, check: () => isElementVisible('d-screen-carpools') },
    { num: 6, name: '6. Clicar Ganhos', run: () => context.switchDriverTab('earnings'), check: () => isElementVisible('d-screen-earnings') && !isElementVisible('d-screen-carpools') && getActiveTab() === 'earnings' },
    { num: 7, name: '7. Confirmar página Ganhos', run: () => {}, check: () => isElementVisible('d-screen-earnings') },
    { num: 8, name: '8. Clicar Perfil', run: () => context.switchDriverTab('profile'), check: () => isElementVisible('d-screen-profile') && !isElementVisible('d-screen-earnings') && getActiveTab() === 'profile' },
    { num: 9, name: '9. Confirmar página Perfil', run: () => {}, check: () => isElementVisible('d-screen-profile') },
    { num: 10, name: '10. Abrir Meu Veículo', run: () => context.navigateToDriver('d-screen-vehicle'), check: () => isElementVisible('d-screen-vehicle') && !isElementVisible('d-screen-profile') },
    { num: 11, name: '11. Voltar ao Perfil', run: () => context.goBackDriver(), check: () => isElementVisible('d-screen-profile') && !isElementVisible('d-screen-vehicle') },
    { num: 12, name: '12. Abrir Meus Documentos', run: () => context.navigateToDriver('d-screen-docs'), check: () => isElementVisible('d-screen-docs') && !isElementVisible('d-screen-profile') },
    { num: 13, name: '13. Voltar ao Perfil', run: () => context.goBackDriver(), check: () => isElementVisible('d-screen-profile') && !isElementVisible('d-screen-docs') },
    { num: 14, name: '14. Voltar para Navegar', run: () => context.switchDriverTab('nav'), check: () => isElementVisible('d-screen-nav') && !isElementVisible('d-screen-profile') && getActiveTab() === 'nav' }
  ];

  let passed = 0;
  sequence.forEach(s => {
    try {
      s.run();
      const ok = s.check();
      if (ok) {
        passed++;
        console.log(`  [PASS] Passo ${s.num}: ${s.name}`);
      } else {
        console.error(`  [FAIL] Passo ${s.num}: ${s.name}`);
      }
    } catch (e) {
      console.error(`  [ERROR] Passo ${s.num}: ${s.name} -> ${e.message}`);
    }
  });

  console.log(`Resultado ${appName}: ${passed} de ${sequence.length} passos verificados com sucesso.`);
  return passed === sequence.length;
}

const okStudio = runSimulation('SIMBORA Studio', path.join(rootDir, 'mobility_interactive_studio.html'));
const okDriver = runSimulation('SIMBORA Motorista Native App (APK)', path.join(rootDir, 'android-build', 'driver', 'assets', 'www', 'index.html'));

if (okStudio && okDriver) {
  console.log('\n=============================================================');
  console.log('>>> 100% DE SUCESSO: TODAS AS 14 ETAPAS DE NAVEGAÇÃO TESTADAS! <<<');
  console.log('=============================================================');
} else {
  process.exit(1);
}
