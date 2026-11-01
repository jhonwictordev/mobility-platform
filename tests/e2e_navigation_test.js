const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const rootDir = path.resolve(__dirname, '..');

async function testApp(name, htmlPath) {
  console.log(`\n======================================================`);
  console.log(`TESTING NAVIGATION ON: ${name}`);
  console.log(`File: ${htmlPath}`);
  console.log(`======================================================`);

  const html = fs.readFileSync(htmlPath, 'utf8');

  // Create virtual browser window with JS execution enabled
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost:8080/'
  });

  const { window } = dom;
  const { document } = window;

  // Mock lucide if needed
  if (!window.lucide) {
    window.lucide = { createIcons: () => {} };
  }

  // Helper function to check visibility
  function isVisible(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return false;
    const hasHiddenClass = el.classList.contains('hidden');
    const displayStyle = el.style.display;
    return !hasHiddenClass && displayStyle !== 'none';
  }

  function getActiveTab() {
    const tabs = ['nav', 'rides', 'carpools', 'earnings', 'profile'];
    for (const t of tabs) {
      const tabEl = document.getElementById('d-tab-' + t);
      if (tabEl && tabEl.className.includes('#FFCC45')) {
        return t;
      }
    }
    return null;
  }

  const steps = [
    {
      num: 1,
      desc: 'Abrir Navegar (Estado Inicial)',
      action: () => {
        window.switchDriverTab('nav');
      },
      assert: () => isVisible('d-screen-nav') && getActiveTab() === 'nav'
    },
    {
      num: 2,
      desc: 'Clicar Corridas',
      action: () => {
        const btn = document.getElementById('d-tab-rides');
        if (btn && btn.onclick) btn.onclick();
        else window.switchDriverTab('rides');
      },
      assert: () => isVisible('d-screen-rides') && !isVisible('d-screen-nav') && getActiveTab() === 'rides'
    },
    {
      num: 3,
      desc: 'Confirmar página Corridas (conteúdo ativo)',
      action: () => {},
      assert: () => document.getElementById('d-rides-list-container') !== null && isVisible('d-screen-rides')
    },
    {
      num: 4,
      desc: 'Clicar Caronas',
      action: () => {
        const btn = document.getElementById('d-tab-carpools');
        if (btn && btn.onclick) btn.onclick();
        else window.switchDriverTab('carpools');
      },
      assert: () => isVisible('d-screen-carpools') && !isVisible('d-screen-rides') && getActiveTab() === 'carpools'
    },
    {
      num: 5,
      desc: 'Confirmar página Caronas (cards presentes)',
      action: () => {},
      assert: () => document.getElementById('d-screen-carpools').textContent.includes('Penedo ➔ Maceió') && isVisible('d-screen-carpools')
    },
    {
      num: 6,
      desc: 'Clicar Ganhos',
      action: () => {
        const btn = document.getElementById('d-tab-earnings');
        if (btn && btn.onclick) btn.onclick();
        else window.switchDriverTab('earnings');
      },
      assert: () => isVisible('d-screen-earnings') && !isVisible('d-screen-carpools') && getActiveTab() === 'earnings'
    },
    {
      num: 7,
      desc: 'Confirmar página Ganhos (filtros Todos/Corridas/Caronas)',
      action: () => {},
      assert: () => document.getElementById('d-filter-btn-all') !== null && isVisible('d-screen-earnings')
    },
    {
      num: 8,
      desc: 'Clicar Perfil',
      action: () => {
        const btn = document.getElementById('d-tab-profile');
        if (btn && btn.onclick) btn.onclick();
        else window.switchDriverTab('profile');
      },
      assert: () => isVisible('d-screen-profile') && !isVisible('d-screen-earnings') && getActiveTab() === 'profile'
    },
    {
      num: 9,
      desc: 'Confirmar página Perfil (Carlos Oliveira 4.96 ★)',
      action: () => {},
      assert: () => document.getElementById('d-screen-profile').textContent.includes('Carlos Oliveira') && isVisible('d-screen-profile')
    },
    {
      num: 10,
      desc: 'Abrir Meu Veículo (dentro do Perfil)',
      action: () => {
        window.navigateToDriver('d-screen-vehicle');
      },
      assert: () => isVisible('d-screen-vehicle') && !isVisible('d-screen-profile')
    },
    {
      num: 11,
      desc: 'Voltar ao Perfil (a partir de Veículo)',
      action: () => {
        window.goBackDriver();
      },
      assert: () => isVisible('d-screen-profile') && !isVisible('d-screen-vehicle')
    },
    {
      num: 12,
      desc: 'Abrir Meus Documentos (dentro do Perfil)',
      action: () => {
        window.navigateToDriver('d-screen-docs');
      },
      assert: () => isVisible('d-screen-docs') && !isVisible('d-screen-profile')
    },
    {
      num: 13,
      desc: 'Voltar ao Perfil (a partir de Documentos)',
      action: () => {
        window.goBackDriver();
      },
      assert: () => isVisible('d-screen-profile') && !isVisible('d-screen-docs')
    },
    {
      num: 14,
      desc: 'Voltar para Navegar (GPS Operacional)',
      action: () => {
        const btn = document.getElementById('d-tab-nav');
        if (btn && btn.onclick) btn.onclick();
        else window.switchDriverTab('nav');
      },
      assert: () => isVisible('d-screen-nav') && !isVisible('d-screen-profile') && getActiveTab() === 'nav'
    }
  ];

  let passedSteps = 0;
  for (const step of steps) {
    try {
      step.action();
      const ok = step.assert();
      if (ok) {
        passedSteps++;
        console.log(`  [PASS] Passo ${step.num}: ${step.desc}`);
      } else {
        console.error(`  [FAIL] Passo ${step.num}: ${step.desc}`);
      }
    } catch (err) {
      console.error(`  [ERROR] Passo ${step.num}: ${step.desc} -> ${err.message}`);
    }
  }

  console.log(`Resultado ${name}: ${passedSteps} de ${steps.length} passos aprovados.`);
  return passedSteps === steps.length;
}

async function run() {
  const ok1 = await testApp('SIMBORA Studio (Driver Section)', path.join(rootDir, 'mobility_interactive_studio.html'));
  const ok2 = await testApp('SIMBORA Motorista Standalone App (APK)', path.join(rootDir, 'android-build', 'driver', 'assets', 'www', 'index.html'));

  if (ok1 && ok2) {
    console.log('\n>>> 100% DAS SEQUÊNCIAS DE NAVEGAÇÃO TESTADAS E APROVADAS! <<<');
  } else {
    console.error('\n>>> FALHA NA EXECUÇÃO DE TESTES! <<<');
    process.exit(1);
  }
}

run();
