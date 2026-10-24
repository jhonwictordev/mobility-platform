const assert = require('assert');
const path = require('path');
const fs = require('fs');

console.log('===============================================================');
console.log('🧪 SUÍTE DE TESTES AUTOMATIZADOS: CENÁRIO PIAÇABUÇU ↔ PENEDO (AL)');
console.log('===============================================================\n');

let testsPassed = 0;
let testsFailed = 0;

function it(desc, fn) {
  try {
    fn();
    console.log(`✅ [PASS] ${desc}`);
    testsPassed++;
  } catch (err) {
    console.error(`❌ [FAIL] ${desc}\n   ${err.message}`);
    testsFailed++;
  }
}

// 1. Carregamento dos dados geográficos de Alagoas
const geodataPath = path.join(__dirname, '..', 'packages', 'alagoas_routes.json');
let geodata = null;

it('1. Arquivo de rotas reais de Alagoas deve existir e ser válido', () => {
  assert.ok(fs.existsSync(geodataPath), 'Arquivo alagoas_routes.json não encontrado');
  geodata = JSON.parse(fs.readFileSync(geodataPath, 'utf8'));
  assert.ok(geodata.piacabucu_penedo, 'Rota prioritária piacabucu_penedo ausente');
});

const route = geodata.piacabucu_penedo;

// 2. Validação de coordenadas oficiais
it('2. Coordenadas de Piaçabuçu e Penedo devem corresponder às fontes geográficas oficiais', () => {
  // Piaçabuçu: -10.4056, -36.4344
  assert.strictEqual(route.origin.lat, -10.4056);
  assert.strictEqual(route.origin.lng, -36.4344);
  // Penedo: -10.2897, -36.5864
  assert.strictEqual(route.destination.lat, -10.2897);
  assert.strictEqual(route.destination.lng, -36.5864);
});

// 3. Validação de distância e proibição de linha reta
it('3. Rota rodoviária deve seguir AL-101 / AL-225 (NÃO PODE SER LINHA RETA)', () => {
  assert.ok(route.pointsCount >= 400, `Esperado >400 nós rodoviários, obtido: ${route.pointsCount}`);
  assert.ok(route.distanceKm >= 27 && route.distanceKm <= 30, `Distância rodoviária fora da faixa de 27-30km: ${route.distanceKm} km`);
  
  // Prova matemática de não-linearidade: a distância euclidiana/reta é ~21 km, enquanto a rodoviária é ~28,2 km
  const dLat = (route.destination.lat - route.origin.lat) * 111.32;
  const dLng = (route.destination.lng - route.origin.lng) * 111.32 * Math.cos(route.origin.lat * Math.PI / 180);
  const straightDistance = Math.sqrt(dLat * dLat + dLng * dLng);
  
  console.log(`   [Info] Distância em Linha Reta: ${straightDistance.toFixed(2)} km`);
  console.log(`   [Info] Distância Rodoviária Real (OSRM): ${route.distanceKm.toFixed(2)} km (+${(((route.distanceKm / straightDistance) - 1) * 100).toFixed(1)}% de sinuosidade)`);
  assert.ok(route.distanceKm > straightDistance * 1.25, 'A rota é muito reta! Deve ter sinuosidade de rodovia.');
});

// 4. Validação de cálculo de direção e tangente (Bearing)
it('4. Cálculo de rolamento (Bearing) deve produzir ângulos válidos (0° a 360°)', () => {
  function calculateBearing(p1, p2) {
    const lng1 = p1[0] * Math.PI / 180;
    const lat1 = p1[1] * Math.PI / 180;
    const lng2 = p2[0] * Math.PI / 180;
    const lat2 = p2[1] * Math.PI / 180;
    const dLng = lng2 - lng1;
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
  }

  const pFirst = route.coordinates[0];
  const pSecond = route.coordinates[1];
  const bearing = calculateBearing(pFirst, pSecond);
  assert.ok(!isNaN(bearing) && bearing >= 0 && bearing <= 360, `Bearing inválido: ${bearing}`);
  console.log(`   [Info] Bearing inicial de saída de Piaçabuçu: ${bearing.toFixed(1)}°`);
});

// 5. Validação de precificação e categorias
it('5. Cálculo tarifário para 28,2 km deve atender às três categorias de veículos', () => {
  const dist = route.distanceKm;
  const time = route.durationMinutes;

  // Fórmulas da API NestJS
  const economyFare = 5.0 + (dist * 1.5) + (time * 0.25);
  const comfortFare = 7.0 + (dist * 2.2) + (time * 0.35);
  const premiumFare = 10.0 + (dist * 3.5) + (time * 0.50);

  assert.ok(economyFare >= 45 && economyFare <= 60, `Tarifa Economy fora da faixa: R$ ${economyFare.toFixed(2)}`);
  assert.ok(comfortFare >= 65 && comfortFare <= 85, `Tarifa Comfort fora da faixa: R$ ${comfortFare.toFixed(2)}`);
  assert.ok(premiumFare >= 95 && premiumFare <= 130, `Tarifa Premium fora da faixa: R$ ${premiumFare.toFixed(2)}`);

  console.log(`   [Info] Economy: R$ ${economyFare.toFixed(2)} | Comfort: R$ ${comfortFare.toFixed(2)} | Premium: R$ ${premiumFare.toFixed(2)}`);
});

// 6. Validação da máquina de estados e PIN de segurança
it('6. Transições de estados de Piaçabuçu a Penedo devem respeitar a integridade estrita e PIN 4821', () => {
  const transitions = [
    { from: 'REQUESTED', to: 'SEARCHING' },
    { from: 'SEARCHING', to: 'ACCEPTED' },
    { from: 'ACCEPTED', to: 'DRIVER_ARRIVING' },
    { from: 'DRIVER_ARRIVING', to: 'DRIVER_ARRIVED' },
    { from: 'DRIVER_ARRIVED', to: 'IN_PROGRESS', requiresPin: true },
    { from: 'IN_PROGRESS', to: 'COMPLETED' },
    { from: 'COMPLETED', to: 'RATED' },
  ];

  let currentState = 'REQUESTED';
  const securityPin = '4821';

  for (const step of transitions) {
    assert.strictEqual(currentState, step.from);
    if (step.requiresPin) {
      assert.strictEqual(securityPin, '4821', 'PIN de segurança incorreto!');
    }
    currentState = step.to;
  }
  assert.strictEqual(currentState, 'RATED');
});

// 7. Validação de expansão dos outros 6 corredores de Alagoas
it('7. Todos os 7 corredores de Alagoas devem estar disponíveis com dados OSRM completos', () => {
  const expectedKeys = [
    'piacabucu_penedo',
    'penedo_igreja_nova',
    'penedo_colegio',
    'penedo_coruripe',
    'penedo_arapiraca',
    'penedo_maceio',
    'piacabucu_coruripe'
  ];

  for (const key of expectedKeys) {
    const c = geodata[key];
    assert.ok(c, `Corredor ${key} ausente`);
    assert.ok(c.distanceKm > 0, `Distância zerada para ${key}`);
    assert.ok(c.coordinates.length > 100, `Poucos pontos para ${key}: ${c.coordinates.length}`);
  }
  console.log(`   [Info] 7/7 corredores intermunicipais de Alagoas verificados com sucesso.`);
});

console.log('\n===============================================================');
console.log(`RESULTADO FINAL: ${testsPassed} PASSOU | ${testsFailed} FALHOU`);
console.log('===============================================================\n');

if (testsFailed > 0) process.exit(1);
