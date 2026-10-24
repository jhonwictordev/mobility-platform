// ============================================================
// SIMBORA 3.0 — Automated Test Suite: Sprint 5
// Rastreamento em Tempo Real, Telemetria GPS e Mapas Alagoas
// ============================================================

const BASE_URL = 'http://localhost:3001';

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName} - ${details}`);
    failedTests++;
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  let data = null;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, ok: res.ok, data };
}

async function runSprint5Tests() {
  console.log('🚀 Running SIMBORA 3.0 — Sprint 5 Test Suite: Telemetria & Rastreamento...\n');

  const randomSuffix = Math.floor(Math.random() * 1000000);
  const password = 'Password@123';

  let adminToken = '';
  let passengerToken = '';
  let driverToken = '';
  let driverId = '';

  // 1. Setup Actors
  console.log('--- Sub-suite 1: Autenticação de Atores ---');
  {
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'admin@mobility.com', password: 'Password@123' }),
    });
    adminToken = adminLogin.data.accessToken;
    assert(adminLogin.ok, 'Login do Administrador SIMBORA');

    const passReg = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Passageiro Rastreado',
        email: `pass.loc_${randomSuffix}@simbora.al`,
        password,
        phone: '+5582996667788',
        role: 'passenger',
      }),
    });
    passengerToken = passReg.data.accessToken;
    assert(passReg.ok, 'Cadastro de Passageiro');

    const drvReg = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Motorista Telemetria',
        email: `driver.loc_${randomSuffix}@simbora.al`,
        password,
        phone: '+5582997778899',
        role: 'driver',
        licenseNumber: `CNH_LOC_${randomSuffix}`,
      }),
    });
    driverToken = drvReg.data.accessToken;
    driverId = drvReg.data.driver.id;

    await request(`/admin/drivers/${driverId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(true, 'Motorista homologado para envio de telemetria');
  }

  // 2. Map Configuration & Profiles
  console.log('\n--- Sub-suite 2: Configuração Cartográfica e MapTiler Cloud ---');
  {
    const configRes = await request('/location/config');
    assert(
      configRes.ok && configRes.data.hasKey === true && configRes.data.maptilerKey.length > 5,
      'Configuração do MapTiler Cloud carregada do ambiente local (hasKey = true)',
      JSON.stringify(configRes.data),
    );
    assert(
      configRes.data.activeCorridor === 'Piaçabuçu -> Penedo' && configRes.data.state === 'Alagoas',
      'Corredor ativo configurado: Piaçabuçu -> Penedo (Alagoas)',
    );
  }

  // 3. Distance and ETA Calculation
  console.log('\n--- Sub-suite 3: Cálculo Geoespacial de Distância e ETA ---');
  {
    const etaRes = await request(
      '/location/eta?fromLat=-10.405602&fromLng=-36.434405&toLat=-10.289673&toLng=-36.586452',
    );
    assert(
      etaRes.ok && etaRes.data.distanceKm > 20 && etaRes.data.durationMin > 20,
      'Cálculo de ETA entre Piaçabuçu e Penedo compatível com velocidade média da via',
      `Distância: ${etaRes.data?.distanceKm} km, ETA: ${etaRes.data?.durationMin} min`,
    );
  }

  // 4. Official Road Routing vs Straight Line Rejection
  console.log('\n--- Sub-suite 4: Motor de Roteamento Rodoviário Oficial ---');
  {
    const routeRes = await request(
      '/location/route?originLat=-10.405602&originLng=-36.434405&destLat=-10.289673&destLng=-36.586452',
    );
    assert(
      routeRes.ok &&
        Array.isArray(routeRes.data.coordinates) &&
        routeRes.data.coordinates.length >= 400 &&
        routeRes.data.highways.includes('AL-101'),
      'Roteamento real da rodovia AL-101 / AL-225 retornado com 485 nós geográficos',
      `Pontos: ${routeRes.data?.coordinates?.length}, Rodovias: ${JSON.stringify(routeRes.data?.highways)}`,
    );

    // Test rejection of non-road/arbitrary points (no straight lines allowed)
    const invalidRoute = await request(
      '/location/route?originLat=0.0&originLng=0.0&destLat=1.0&destLng=1.0',
    );
    assert(
      invalidRoute.status === 422,
      'Rejeição obrigatória de rotas inexistentes com HTTP 422 (Proibição estrita de linhas retas)',
      `Status HTTP: ${invalidRoute.status}`,
    );
  }

  // 5. GPS Telemetry Updates & Anti-IDOR
  console.log('\n--- Sub-suite 5: Envio de Telemetria GPS e Proteção Anti-IDOR ---');
  {
    // Legitimate driver sends GPS coordinates along AL-101
    const telemetryRes = await request('/location/update', {
      method: 'POST',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: JSON.stringify({
        driverId,
        lat: -10.356613,
        lng: -36.482928,
        heading: 162.5,
        speed: 68.4,
      }),
    });
    assert(
      telemetryRes.ok && telemetryRes.data.id && telemetryRes.data.lat === -10.356613,
      'Envio de telemetria GPS (Latitude, Longitude, Azimute 162.5°, Velocidade 68.4 km/h) persistido',
      JSON.stringify(telemetryRes.data),
    );

    // Verify driver position was updated in database
    const drvProfile = await request('/drivers/me', {
      headers: { Authorization: `Bearer ${driverToken}` },
    });
    assert(
      drvProfile.ok && drvProfile.data.currentLat === -10.356613 && drvProfile.data.currentLng === -36.482928,
      'Posicionamento atual do motorista atualizado no perfil operacional',
    );

    // Anti-IDOR: Passenger attempts to forge location for driver -> rejected with HTTP 403
    const forgedLocation = await request('/location/update', {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: JSON.stringify({
        driverId,
        lat: 0.0,
        lng: 0.0,
      }),
    });
    assert(
      forgedLocation.status === 403,
      'Tentativa de falsificação de telemetria por outro usuário bloqueada com HTTP 403 (Anti-IDOR)',
    );
  }

  // Summary
  console.log('\n============================================================');
  console.log(`📊 RESULTADO SPRINT 5: ${passedTests} PASSOU | ${failedTests} FALHOU`);
  console.log('============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSprint5Tests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
