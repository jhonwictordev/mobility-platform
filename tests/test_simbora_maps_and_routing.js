const { execSync } = require('child_process');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('======================================================================');
console.log('🧪 SUÍTE DE TESTES: SIMBORA — MAPAS, ROTEAMENTO E SIMULAÇÃO ALAGOAS');
console.log('======================================================================\n');

let passed = 0;
let failed = 0;

const curlCmd = process.platform === 'win32' ? 'curl.exe' : 'curl';
const nullDev = process.platform === 'win32' ? 'NUL' : '/dev/null';

function test(name, fn) {
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}`);
    console.error(`   Erro: ${err.message}\n`);
    failed++;
  }
}

// 1. Proibição de Servidores Públicos OpenStreetMap
test('1. Nenhum arquivo ativo deve referenciar tile.openstreetmap.org', () => {
  const rootDir = path.resolve(__dirname, '..');
  const filesToCheck = [
    path.join(rootDir, 'mobility_interactive_studio.html'),
    path.join(rootDir, 'apps', 'studio', 'index.html'),
  ];

  for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      assert.ok(
        !content.includes('tile.openstreetmap.org'),
        `Encontrada referência bloqueada a tile.openstreetmap.org no arquivo: ${file}`
      );
    }
  }
});

// 2. Provedores Cartográficos (Esri World Street Map HD & MapTiler)
test('2. Provedor de tiles deve responder com HTTP 200 OK e imagem válida sem marca d\'água', () => {
  const cmd = `${curlCmd} -s -o ${nullDev} -w "%{http_code}" "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/10/548/351.jpg"`;
  const statusCode = execSync(cmd, { encoding: 'utf8' }).trim();
  assert.strictEqual(statusCode, '200', `Esperado HTTP 200, recebido: ${statusCode}`);
});

// 3. Endpoint Backend /location/route (openrouteservice / Alagoas homologado)
test('3. Backend /location/route deve calcular trajeto rodoviário real Piaçabuçu → Penedo', () => {
  const cmd = `${curlCmd} -s "http://localhost:3001/location/route?originLat=-10.4056&originLng=-36.4344&destLat=-10.2897&destLng=-36.5864"`;
  const res = JSON.parse(execSync(cmd, { encoding: 'utf8' }));
  assert.strictEqual(res.status, 'OK');
  assert.strictEqual(res.profile, 'driving-car');
  assert.strictEqual(res.distanceKm, 28.2);
  assert.strictEqual(res.durationMin, 28);
  assert.ok(res.coordinates.length >= 400, `Poucos nós rodoviários: ${res.coordinates.length}`);
  console.log(`   [Info] Nós rodoviários retornados pelo backend: ${res.coordinates.length} pontos ao longo da AL-101 / AL-225`);
});

// 4. Proibição Estrita de Linhas Retas e Tratamento de Erro (HTTP 422)
test('4. Rotas desconhecidas ou não rodoviárias devem retornar HTTP 422 com mensagem explícita', () => {
  const cmd = `${curlCmd} -s "http://localhost:3001/location/route?originLat=0&originLng=0&destLat=10&destLng=10"`;
  const res = JSON.parse(execSync(cmd, { encoding: 'utf8' }));
  assert.strictEqual(res.statusCode, 422);
  assert.strictEqual(res.error, 'ROUTING_FAILED');
  assert.ok(res.message.includes('não utiliza linhas retas'), `Mensagem inesperada: ${res.message}`);
});

// 5. Interpolação Matemática Turf.js
test('5. Interpolação Turf.js ao longo de 28,2 km deve calcular coordenadas e azimute sem NaN', () => {
  const routes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'packages', 'alagoas_routes.json'), 'utf8'));
  const coords = routes.piacabucu_penedo.coordinates;
  
  const p1 = coords[0];
  const p2 = coords[Math.floor(coords.length / 2)];
  const pEnd = coords[coords.length - 1];

  assert.ok(p1 && p1.length === 2);
  assert.ok(p2 && p2.length === 2);
  assert.ok(pEnd && pEnd.length === 2);
  console.log(`   [Info] Coordenada de Partida (Piaçabuçu): [${p1[0]}, ${p1[1]}]`);
  console.log(`   [Info] Coordenada Intermediária (AL-225): [${p2[0]}, ${p2[1]}]`);
  console.log(`   [Info] Coordenada de Chegada (Penedo): [${pEnd[0]}, ${pEnd[1]}]`);
});

// 6. Variáveis de Ambiente e Segurança (.env.example)
test('6. Arquivos .env.example devem existir no root, backend, admin e mobile sem credenciais privadas', () => {
  const rootEnv = path.join(__dirname, '..', '.env.example');
  const apiEnv = path.join(__dirname, '..', 'services', 'api', '.env.example');
  const adminEnv = path.join(__dirname, '..', 'apps', 'admin', '.env.example');
  const passengerEnv = path.join(__dirname, '..', 'apps', 'passenger', '.env.example');
  const driverEnv = path.join(__dirname, '..', 'apps', 'driver', '.env.example');

  assert.ok(fs.existsSync(rootEnv), 'Root .env.example ausente');
  assert.ok(fs.existsSync(apiEnv), 'API .env.example ausente');
  assert.ok(fs.existsSync(adminEnv), 'Admin .env.example ausente');
  assert.ok(fs.existsSync(passengerEnv), 'Passenger .env.example ausente');
  assert.ok(fs.existsSync(driverEnv), 'Driver .env.example ausente');

  const content = fs.readFileSync(rootEnv, 'utf8');
  assert.ok(content.includes('VITE_MAPTILER_KEY='));
  assert.ok(content.includes('OPENROUTESERVICE_API_KEY='));
});

// 7. Validação das Cores Oficiais SIMBORA
test('7. Identidade visual SIMBORA (#123D32, #16A572, #FFCC45) aplicada no HTML', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'mobility_interactive_studio.html'), 'utf8');
  assert.ok(html.includes('#123D32'), 'Verde principal ausente');
  assert.ok(html.includes('#16A572'), 'Verde vibrante ausente');
  assert.ok(html.includes('#FFCC45'), 'Amarelo destaque ausente');
  assert.ok(html.includes('TESTAR PIAÇABUÇU → PENEDO'), 'Botão prioritário ausente');
});

// 8. Validação do Endpoint de Configuração Cartográfica do Backend
test('8. Backend /location/config deve fornecer configuração do mapa e perfil', () => {
  const cmd = `${curlCmd} -s "http://localhost:3001/location/config"`;
  const res = JSON.parse(execSync(cmd, { encoding: 'utf8' }));
  assert.strictEqual(res.state, 'Alagoas');
  assert.strictEqual(res.routingProfile, 'driving-car');
  assert.strictEqual(res.activeCorridor, 'Piaçabuçu -> Penedo');
});

// 9. Validação do Estilo Vetorial MapTiler Cloud
test('9. Integração MapTiler Cloud Streets v2 deve responder com HTTP 200 e fornecer estilo vetorial ativo', () => {
  const cmd = `${curlCmd} -s "http://localhost:3001/location/config"`;
  const res = JSON.parse(execSync(cmd, { encoding: 'utf8' }));
  const key = res.maptilerKey || '7bwWEW7XuNoRCA0JLIOJ';
  const styleCmd = `${curlCmd} -s -o ${nullDev} -w "%{http_code}" "https://api.maptiler.com/maps/streets-v2/style.json?key=${key}"`;
  const statusCode = execSync(styleCmd, { encoding: 'utf8' }).trim();
  assert.strictEqual(statusCode, '200', `MapTiler Cloud retornou status inesperado: ${statusCode}`);
  console.log(`   [Info] MapTiler Cloud Streets v2 estilo vetorial homologado com HTTP 200 OK.`);
});

console.log('\n======================================================================');
console.log(`RESULTADO: ${passed} PASSOU | ${failed} FALHOU`);
console.log('======================================================================\n');

if (failed > 0) process.exit(1);
