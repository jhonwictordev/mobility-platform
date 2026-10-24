// ============================================================
// SIMBORA 3.0 — Master Test Runner (Consolidador Geral)
// Executa todas as suítes de testes de ponta a ponta
// ============================================================

const { execSync } = require('child_process');
const path = require('path');

const suites = [
  { name: 'Sprint 1: Autenticação, Cadastro, Perfis & Lugares Salvos', file: 'test_sprint1_auth_and_profiles.js' },
  { name: 'Sprint 2: Motoristas, Veículos, Documentos & Homologação', file: 'test_sprint2_drivers_and_vehicles.js' },
  { name: 'Sprint 3: Matching, Despacho, 10 Estados & Validação PIN', file: 'test_sprint3_dispatch_and_trips.js' },
  { name: 'Sprint 4: Precificação Dinâmica, Estimativas, PIX & Repasses', file: 'test_sprint4_pricing_and_payments.js' },
  { name: 'Sprint 5: Telemetria GPS, Rastreamento & Mapas Alagoas', file: 'test_sprint5_location_telemetry_maps.js' },
  { name: 'Sprint 6: Chat Embarcado, Segurança SOS & Experiência', file: 'test_sprint6_chat_sos_safety.js' },
  { name: 'Sprint 7: Painel Admin, Auditoria & Métricas Executivas', file: 'test_sprint7_admin_and_audit.js' },
  { name: 'Geo: Integração MapTiler Streets v2 & Roteamento', file: 'test_simbora_maps_and_routing.js' },
  { name: 'Corredor Alagoas: Piaçabuçu ⇄ Penedo (AL-101 / AL-225)', file: 'test_penedo_piacabucu.js' },
  { name: 'DevSecOps: Hardening de Segurança & Headers OWASP', file: 'test_security_hardening.js' },
  { name: 'Segurança: Autorização RBAC, Anti-IDOR & Isolamento', file: 'test_authorization_and_websockets.js' },
];

console.log('======================================================================');
console.log('🏁 SIMBORA 3.0 — MASTER AUTOMATED TEST SUITE (REGRESSÃO COMPLETA)');
console.log('======================================================================\n');

let totalSuites = suites.length;
let passedSuites = 0;
let failedSuites = 0;

for (const suite of suites) {
  const filePath = path.join(__dirname, suite.file);
  console.log(`▶ Executando: ${suite.name}...`);
  try {
    const output = execSync(`node "${filePath}"`, {
      encoding: 'utf8',
      cwd: path.resolve(__dirname, '..'),
    });
    console.log(output);
    console.log(`✔ [SUCESSO] ${suite.name}\n----------------------------------------------------------------------\n`);
    passedSuites++;
  } catch (error) {
    console.error(`✖ [FALHA] ${suite.name}`);
    console.error(error.stdout || error.message);
    failedSuites++;
  }
}

console.log('======================================================================');
console.log(`📊 CONSOLIDAÇÃO GERAL: ${passedSuites}/${totalSuites} SUÍTES APROVADAS (${failedSuites} FALHAS)`);
console.log('======================================================================');

if (failedSuites > 0) {
  process.exit(1);
} else {
  console.log('🎉 TODAS AS SUÍTES DO SIMBORA 3.0 FORAM APROVADAS COM 100% DE SUCESSO!\n');
  process.exit(0);
}
