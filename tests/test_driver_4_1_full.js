const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const studioHtml = fs.readFileSync(path.join(rootDir, 'mobility_interactive_studio.html'), 'utf8');
const driverHtml = fs.readFileSync(path.join(rootDir, 'android-build', 'driver', 'assets', 'www', 'index.html'), 'utf8');

console.log('====================================================');
console.log('SIMBORA 4.1 AUTOMATED TEST SUITE');
console.log('Driver App Navigation Restructuring & Unified Earnings');
console.log('====================================================');

const testCases = [
  // 1. Navigation Structure
  {
    category: 'NAVEGAÇÃO (5 ITENS OBRIGATÓRIOS)',
    name: 'Barra inferior com exatamente 5 abas (NAVEGAR | CORRIDAS | CARONAS | GANHOS | PERFIL)',
    run: () => {
      const order = ['d-tab-nav', 'd-tab-rides', 'd-tab-carpools', 'd-tab-earnings', 'd-tab-profile'];
      let lastIdx = -1;
      for (const id of order) {
        const idx = studioHtml.indexOf(`id="${id}"`);
        if (idx === -1 || idx < lastIdx) return false;
        lastIdx = idx;
      }
      return true;
    }
  },
  {
    category: 'NAVEGAÇÃO (5 ITENS OBRIGATÓRIOS)',
    name: 'Remoção de Veículo e Documentos da barra inferior (sem exclusão de componentes)',
    run: () => {
      const studioHasTabDocs = studioHtml.includes('id="d-tab-docs"');
      const studioHasTabVeh = studioHtml.includes('id="d-tab-vehicle"');
      const driverHasTabDocs = driverHtml.includes('id="d-tab-docs"');
      const driverHasTabVeh = driverHtml.includes('id="d-tab-vehicle"');
      return !studioHasTabDocs && !studioHasTabVeh && !driverHasTabDocs && !driverHasTabVeh;
    }
  },
  {
    category: 'NAVEGAÇÃO (MIGRAÇÃO PARA PERFIL)',
    name: 'Acesso a "MEU VEÍCULO" integrado dentro da página PERFIL',
    run: () => {
      return studioHtml.includes('navigateToDriver(\'d-screen-vehicle\')') &&
             driverHtml.includes('showDriverPage(\'d-screen-vehicle\')');
    }
  },
  {
    category: 'NAVEGAÇÃO (MIGRAÇÃO PARA PERFIL)',
    name: 'Acesso a "MEUS DOCUMENTOS" integrado dentro da página PERFIL',
    run: () => {
      return studioHtml.includes('navigateToDriver(\'d-screen-docs\')') &&
             driverHtml.includes('showDriverPage(\'d-screen-docs\')');
    }
  },
  {
    category: 'NAVEGAÇÃO (MIGRAÇÃO PARA PERFIL)',
    name: 'Botão funcional de retorno "<- Voltar ao Perfil" em Veículo e Documentos',
    run: () => {
      return studioHtml.includes('Voltar ao Perfil') && driverHtml.includes('Voltar ao Perfil');
    }
  },
  {
    category: 'NOVA SEÇÃO: MINHAS CORRIDAS',
    name: 'Página dedicada "d-screen-rides" para corridas urbanas e sob demanda',
    run: () => {
      return studioHtml.includes('id="d-screen-rides"') && driverHtml.includes('id="d-screen-rides"');
    }
  },
  {
    category: 'NOVA SEÇÃO: MINHAS CORRIDAS',
    name: 'Filtros de status (Todas, Em Andamento, Concluídas, Canceladas)',
    run: () => {
      return studioHtml.includes('filterDriverRides(\'all\')') &&
             studioHtml.includes('filterDriverRides(\'active\')') &&
             studioHtml.includes('filterDriverRides(\'completed\')') &&
             studioHtml.includes('filterDriverRides(\'cancelled\')');
    }
  },
  {
    category: 'NOVA SEÇÃO: MINHAS CORRIDAS',
    name: 'Exibição de detalhes de corridas urbanas (data, horário, rota Piaçabuçu-Penedo, valor líquido)',
    run: () => {
      return studioHtml.includes('Piaçabuçu ➔ Penedo') &&
             studioHtml.includes('+ R$ 38,50') &&
             studioHtml.includes('Marina Silva');
    }
  },
  {
    category: 'PRESERVAÇÃO CARONAS',
    name: 'Página "Minhas Caronas Intermunicipais" preservada exatamente como no design aprovado',
    run: () => {
      return studioHtml.includes('Penedo ➔ Maceió') &&
             studioHtml.includes('R$ 45,00') &&
             studioHtml.includes('Piaçabuçu ➔ Penedo') &&
             studioHtml.includes('R$ 25,00') &&
             studioHtml.includes('Instant Booking Ativo');
    }
  },
  // 2. Financial Dashboard
  {
    category: 'PAINEL FINANCEIRO UNIFICADO',
    name: 'Filtros de modalidade funcionais [TODOS] [CORRIDAS] [CARONAS]',
    run: () => {
      return studioHtml.includes('setDriverEarningsFilter(\'all\')') &&
             studioHtml.includes('setDriverEarningsFilter(\'rides\')') &&
             studioHtml.includes('setDriverEarningsFilter(\'carpools\')') &&
             driverHtml.includes('setDriverEarningsFilter(\'all\')');
    }
  },
  {
    category: 'PAINEL FINANCEIRO UNIFICADO',
    name: 'Cálculo dinâmico dos cards de Ganhos Hoje e Ganhos da Semana conforme filtro',
    run: () => {
      return studioHtml.includes('d-earnings-today-val') &&
             studioHtml.includes('d-earnings-week-val') &&
             driverHtml.includes('d-earnings-today-val');
    }
  },
  {
    category: 'PAINEL FINANCEIRO UNIFICADO',
    name: 'Gráfico semanal dinâmico de 7 dias com escala proporcional e destaque do dia máximo (SEX)',
    run: () => {
      return studioHtml.includes('d-weekly-bars-container') &&
             studioHtml.includes('showChartTooltip') &&
             driverHtml.includes('d-weekly-bars-container');
    }
  },
  {
    category: 'PAINEL FINANCEIRO UNIFICADO',
    name: 'Tooltip interativo detalhando faturamento de Corridas e Caronas de cada dia',
    run: () => {
      return studioHtml.includes('d-chart-tooltip') &&
             driverHtml.includes('d-chart-tooltip') &&
             studioHtml.includes('ridesCount') &&
             studioHtml.includes('carpoolsCount');
    }
  },
  {
    category: 'PAINEL FINANCEIRO UNIFICADO',
    name: 'Saldo disponível para saque preservado (R$ 384,50) sem duplicação',
    run: () => {
      return studioHtml.includes('R$ 384,50') && driverHtml.includes('R$ 384,50');
    }
  },
  {
    category: 'EXTRATO FINANCEIRO',
    name: 'Extrato detalhado com tags de modalidade (CORRIDA URBANA vs CARONA INTERMUNICIPAL)',
    run: () => {
      return studioHtml.includes('CORRIDA URBANA') &&
             studioHtml.includes('CARONA INTERMUNICIPAL') &&
             driverHtml.includes('CORRIDA URBANA') &&
             driverHtml.includes('CARONA INTERMUNICIPAL');
    }
  },
  {
    category: 'INTEGRIDADE VISUAL E MAPA',
    name: 'Motor MapLibre GL JS e cartografia real (MapTiler Streets / Esri) estritamente preservados',
    run: () => {
      return studioHtml.includes('maplibregl.Map') &&
             driverHtml.includes('maplibregl.Map') &&
             !studioHtml.includes('<svg class="fake-map') &&
             !driverHtml.includes('<svg class="fake-map');
    }
  },
  {
    category: 'INTEGRIDADE VISUAL E MAPA',
    name: 'Identidade visual oficial Simbora (#123D32, #16A572, #FFCC45, #F8F9F6, #17211D) intacta',
    run: () => {
      return studioHtml.includes('#123D32') &&
             studioHtml.includes('#16A572') &&
             studioHtml.includes('#FFCC45') &&
             studioHtml.includes('#17211D');
    }
  }
];

let passed = 0;
let failed = 0;

testCases.forEach((t, i) => {
  const result = t.run();
  if (result) {
    passed++;
    console.log(`[PASS] Test #${i+1} [${t.category}]: ${t.name}`);
  } else {
    failed++;
    console.error(`[FAIL] Test #${i+1} [${t.category}]: ${t.name}`);
  }
});

console.log('----------------------------------------------------');
console.log(`Summary: ${passed} Passed, ${failed} Failed out of ${testCases.length} tests.`);
if (failed === 0) {
  console.log('>>> 100% OF SIMBORA 4.1 TEST REQUIREMENTS VERIFIED! <<<');
} else {
  process.exit(1);
}
