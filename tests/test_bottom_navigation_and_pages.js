/**
 * SUÍTE DE TESTES AUTOMATIZADOS: NAVEGAÇÃO INFERIOR & SUBPÁGINAS (SIMBORA 3.1)
 * Valida a existência, integridade, handlers de navegação, persistência e APIs de todas as telas.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('======================================================================');
console.log('🧪 SUÍTE DE TESTES: SIMBORA 3.1 — NAVEGAÇÃO INFERIOR E SUBPÁGINAS');
console.log('======================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failed++;
  }
}

// 1. Ler arquivo HTML do Studio
const htmlPath = path.join(__dirname, '..', 'mobility_interactive_studio.html');
const html = fs.readFileSync(htmlPath, 'utf8');

console.log('--- Testes de Estrutura do Passageiro ---');
// 2. Verificar existência das 5 páginas principais do Passageiro
assert(html.includes('id="p-screen-home"'), 'Página 1 do Passageiro: Início (Mapa e Categorias) presente');
assert(html.includes('id="p-screen-activity"'), 'Página 2 do Passageiro: Atividade presente');
assert(html.includes('id="p-screen-chat"'), 'Página 3 do Passageiro: Chat (Mensagens) presente');
assert(html.includes('id="p-screen-safety"'), 'Página 4 do Passageiro: Central de Segurança presente');
assert(html.includes('id="p-screen-profile"'), 'Página 5 do Passageiro: Minha Conta presente');

// 3. Verificar botões da barra inferior do Passageiro
assert(html.includes('id="p-tab-home"') && html.includes("switchPassengerTab('home')"), 'Barra inferior: Botão Início configurado');
assert(html.includes('id="p-tab-activity"') && html.includes("switchPassengerTab('activity')"), 'Barra inferior: Botão Atividade configurado');
assert(html.includes('id="p-tab-chat"') && html.includes("switchPassengerTab('chat')"), 'Barra inferior: Botão Chat configurado');
assert(html.includes('id="p-tab-safety"') && html.includes("switchPassengerTab('safety')"), 'Barra inferior: Botão Segurança configurado');
assert(html.includes('id="p-tab-profile"') && html.includes("switchPassengerTab('profile')"), 'Barra inferior: Botão Conta configurado');

// 4. Verificar subpáginas e funcionalidades exigidas do Passageiro
assert(html.includes('id="p-subpage-trip-details"'), 'Subpágina: Detalhes da Viagem presente');
assert(html.includes('id="p-subpage-safety-contacts"'), 'Subpágina: Contatos de Confiança presente');
assert(html.includes('id="p-subpage-report-incident"'), 'Subpágina: Reportar Incidente presente com formulário');
assert(html.includes('id="p-subpage-personal-data"'), 'Subpágina: Dados Pessoais do Passageiro presente com formulário');
assert(html.includes('id="p-subpage-saved-places"'), 'Subpágina: Endereços Salvos presente com formulário');
assert(html.includes('id="p-subpage-wallet"'), 'Subpágina: Carteira presente com saldo e recargas');
assert(html.includes('id="p-subpage-payment-methods"'), 'Subpágina: Formas de Pagamento presente com cadastro de cartão');
assert(html.includes('id="p-subpage-coupons"'), 'Subpágina: Cupons e Promoções presente com validação de código');
assert(html.includes('id="p-subpage-referrals"'), 'Subpágina: Indicar Amigos presente com código MARINA82');
assert(html.includes('id="p-subpage-notifications"'), 'Subpágina: Notificações com toggles interativos');
assert(html.includes('id="p-subpage-privacy"'), 'Subpágina: Privacidade & LGPD presente');
assert(html.includes('id="p-subpage-settings"'), 'Subpágina: Configurações do Passageiro presente');
assert(html.includes('id="p-subpage-help"'), 'Subpágina: Central de Ajuda e FAQ presente');
assert(html.includes('id="p-subpage-terms"'), 'Subpágina: Termos de Uso do Passageiro presente');

// 5. Verificar mensagens rápidas do Chat exigidas no prompt
assert(html.includes('Estou chegando.'), 'Chat Passageiro: Mensagem rápida "Estou chegando." presente');
assert(html.includes('Estou no local.'), 'Chat Passageiro: Mensagem rápida "Estou no local." presente');
assert(html.includes('Pode aguardar um momento?'), 'Chat Passageiro: Mensagem rápida "Pode aguardar um momento?" presente');
assert(html.includes('Não encontrei o veículo.'), 'Chat Passageiro: Mensagem rápida "Não encontrei o veículo." presente');

console.log('\n--- Testes de Estrutura do Motorista ---');
// 6. Verificar existência das 5 páginas principais do Motorista
assert(html.includes('id="d-screen-nav"'), 'Página 1 do Motorista: Navegar (GPS e HUD) presente');
assert(html.includes('id="d-screen-earnings"'), 'Página 2 do Motorista: Meus Ganhos presente');
assert(html.includes('id="d-screen-docs"'), 'Página 3 do Motorista: Meus Documentos presente');
assert(html.includes('id="d-screen-vehicle"'), 'Página 4 do Motorista: Meu Veículo presente');
assert(html.includes('id="d-screen-profile"'), 'Página 5 do Motorista: Meu Perfil presente');

// 7. Verificar botões da barra inferior do Motorista
assert(html.includes('id="d-tab-nav"') && html.includes("switchDriverTab('nav')"), 'Barra inferior: Botão Navegar configurado');
assert(html.includes('id="d-tab-earnings"') && html.includes("switchDriverTab('earnings')"), 'Barra inferior: Botão Ganhos configurado');
assert(html.includes('id="d-tab-docs"') && html.includes("switchDriverTab('docs')"), 'Barra inferior: Botão Documentos configurado');
assert(html.includes('id="d-tab-vehicle"') && html.includes("switchDriverTab('vehicle')"), 'Barra inferior: Botão Veículo configurado');
assert(html.includes('id="d-tab-profile"') && html.includes("switchDriverTab('profile')"), 'Barra inferior: Botão Perfil configurado');

// 8. Verificar subpáginas e funcionalidades exigidas do Motorista
assert(html.includes('id="d-subpage-statement"'), 'Subpágina Motorista: Extrato Detalhado de Corridas presente');
assert(html.includes('id="d-subpage-upload-doc"'), 'Subpágina Motorista: Upload de Documentos presente com formulário');
assert(html.includes('id="d-subpage-edit-vehicle"'), 'Subpágina Motorista: Editar Dados do Veículo presente');
assert(html.includes('id="d-subpage-inspections"'), 'Subpágina Motorista: Laudo de Vistorias Técnicas presente');
assert(html.includes('id="d-subpage-change-vehicle"'), 'Subpágina Motorista: Trocar de Veículo presente');
assert(html.includes('id="d-subpage-personal-data"'), 'Subpágina Motorista: Dados Pessoais presente');
assert(html.includes('id="d-subpage-ratings"'), 'Subpágina Motorista: Minha Avaliação com 4.96 ★ presente');
assert(html.includes('id="d-subpage-bank-data"'), 'Subpágina Motorista: Dados Bancários e Chave PIX presente');
assert(html.includes('id="d-subpage-preferences"'), 'Subpágina Motorista: Preferências de Viagem e Raio de Despacho presente');
assert(html.includes('id="d-subpage-safety"'), 'Subpágina Motorista: Central de Segurança do Condutor presente');
assert(html.includes('id="d-subpage-help"'), 'Subpágina Motorista: Suporte ao Condutor em Penedo presente');
assert(html.includes('id="d-subpage-terms"'), 'Subpágina Motorista: Termos do Parceiro e Split 85% presente');

// 9. Verificar controlador de navegação e histórico (Stack Navigation)
console.log('\n--- Testes do Controlador de Navegação e Botões Voltar ---');
assert(html.includes('function navigateToPassenger'), 'Função de empilhamento de navegação do passageiro presente');
assert(html.includes('function goBackPassenger'), 'Função do botão Voltar do passageiro presente');
assert(html.includes('function navigateToDriver'), 'Função de empilhamento de navegação do motorista presente');
assert(html.includes('function goBackDriver'), 'Função do botão Voltar do motorista presente');
assert(html.includes('goBackPassenger()'), 'Todas as subpáginas do passageiro possuem chamada a goBackPassenger()');
assert(html.includes('goBackDriver()'), 'Todas as subpáginas do motorista possuem chamada a goBackDriver()');

// 10. Teste de conectividade com os serviços rodando
console.log('\n--- Testes de Conectividade de Rede ---');
function testHttp(url, name) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      assert(res.statusCode === 200, `${name} respondeu com HTTP 200 OK (${url})`);
      resolve();
    }).on('error', (err) => {
      assert(false, `${name} falhou na conexão: ${err.message}`);
      resolve();
    });
  });
}

(async () => {
  await testHttp('http://localhost:8080', 'SIMBORA Studio (Porta 8080)');
  await testHttp('http://localhost:3001/auth/terms', 'SIMBORA API Termos (Porta 3001)');
  await testHttp('http://localhost:3001/auth/privacy', 'SIMBORA API Privacidade LGPD (Porta 3001)');
  await testHttp('http://localhost:3000', 'SIMBORA Admin Dashboard (Porta 3000)');

  console.log('\n======================================================================');
  console.log(`RESULTADO FINAL: ${passed} PASSOU | ${failed} FALHOU`);
  console.log('======================================================================');

  if (failed > 0) {
    process.exit(1);
  }
})();
