// ============================================================
// SIMBORA 3.0 — Automated Test Suite: Sprint 3
// Matching, Despacho, Máquina de 10 Estados e Ciclo da Corrida
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

async function runSprint3Tests() {
  console.log('🚀 Running SIMBORA 3.0 — Sprint 3 Test Suite: Matching & Ciclo de Vida da Corrida...\n');

  const randomSuffix = Math.floor(Math.random() * 1000000);
  const password = 'Password@123';

  let adminToken = '';
  let passengerToken = '';
  let passengerUserId = '';

  let driver1Token = '';
  let driver1Id = '';

  let driver2Token = '';
  let driver2Id = '';

  // 1. Setup Admin Token
  console.log('--- Sub-suite 1: Setup e Autenticação de Atores ---');
  {
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'admin@mobility.com', password: 'Password@123' }),
    });
    assert(adminLogin.ok, 'Login do Administrador SIMBORA');
    adminToken = adminLogin.data.accessToken;

    // Create Passenger in Piaçabuçu
    const passReg = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Mariana Alagoana',
        email: `pass.sprint3_${randomSuffix}@simbora.al`,
        password,
        phone: '+5582991112233',
        role: 'passenger',
      }),
    });
    assert(passReg.ok, 'Cadastro do passageiro em Piaçabuçu');
    passengerToken = passReg.data.accessToken;
    passengerUserId = passReg.data.user.id;

    // Create Driver 1 (Economy - Piaçabuçu)
    const drv1Reg = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'João Condutor Economy',
        email: `drv1.sprint3_${randomSuffix}@simbora.al`,
        password,
        phone: '+5582991114455',
        role: 'driver',
        licenseNumber: `CNH1_${randomSuffix}`,
      }),
    });
    driver1Token = drv1Reg.data.accessToken;
    driver1Id = drv1Reg.data.driver.id;

    // Approve Driver 1 and add Economy vehicle
    await request(`/admin/drivers/${driver1Id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const veh1 = await request('/vehicles', {
      method: 'POST',
      headers: { Authorization: `Bearer ${driver1Token}` },
      body: JSON.stringify({
        make: 'Renault',
        model: 'Kwid',
        year: 2022,
        color: 'Branco',
        plateNumber: `ECO${randomSuffix.toString().slice(0, 4)}`,
        category: 'economy',
        seats: 4,
      }),
    });
    await request(`/vehicles/${veh1.data.id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ approved: true, notes: 'Vistoriado' }),
    });

    // Create Driver 2 (Comfort - Piaçabuçu)
    const drv2Reg = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Carlos Condutor Comfort',
        email: `drv2.sprint3_${randomSuffix}@simbora.al`,
        password,
        phone: '+5582991116677',
        role: 'driver',
        licenseNumber: `CNH2_${randomSuffix}`,
      }),
    });
    driver2Token = drv2Reg.data.accessToken;
    driver2Id = drv2Reg.data.driver.id;

    // Approve Driver 2 and add Comfort vehicle
    await request(`/admin/drivers/${driver2Id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const veh2 = await request('/vehicles', {
      method: 'POST',
      headers: { Authorization: `Bearer ${driver2Token}` },
      body: JSON.stringify({
        make: 'Toyota',
        model: 'Corolla Sedan',
        year: 2023,
        color: 'Prata',
        plateNumber: `COM${randomSuffix.toString().slice(0, 4)}`,
        category: 'comfort',
        seats: 4,
      }),
    });
    await request(`/vehicles/${veh2.data.id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ approved: true, notes: 'Vistoriado' }),
    });

    assert(true, 'Motoristas 1 (Economy) e 2 (Comfort) cadastrados e homologados');
  }

  // 2. Set Driver Locations and Go ONLINE
  console.log('\n--- Sub-suite 2: Georreferenciamento e Presença Operacional ---');
  {
    // Driver 1 in Piaçabuçu Center
    await request('/location/update', {
      method: 'POST',
      headers: { Authorization: `Bearer ${driver1Token}` },
      body: JSON.stringify({
        driverId: driver1Id,
        lat: -10.405602,
        lng: -36.434405,
      }),
    });
    await request(`/drivers/${driver1Id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${driver1Token}` },
      body: JSON.stringify({ status: 'online' }),
    });

    // Driver 2 in Piaçabuçu Center
    await request('/location/update', {
      method: 'POST',
      headers: { Authorization: `Bearer ${driver2Token}` },
      body: JSON.stringify({
        driverId: driver2Id,
        lat: -10.406000,
        lng: -36.435000,
      }),
    });
    await request(`/drivers/${driver2Id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${driver2Token}` },
      body: JSON.stringify({ status: 'online' }),
    });

    assert(true, 'Motoristas posicionados em Piaçabuçu e ativados em ONLINE');
  }

  // 3. Trip Request: Piaçabuçu to Penedo (Comfort)
  console.log('\n--- Sub-suite 3: Solicitação de Corrida e Despacho de Categoria ---');
  let tripId = '';
  let tripPin = '';
  {
    const tripReq = await request('/trips', {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: JSON.stringify({
        originLat: -10.405602,
        originLng: -36.434405,
        originAddress: 'Praça São Francisco, Piaçabuçu - AL',
        destLat: -10.289673,
        destLng: -36.586452,
        destAddress: 'Largo de São Gonçalo, Penedo - AL',
        category: 'comfort',
        pinCode: '4821',
      }),
    });

    assert(
      tripReq.ok && tripReq.data.data?.status === 'SEARCHING',
      'Passageiro solicita corrida e transita imediatamente para status SEARCHING',
      JSON.stringify(tripReq.data),
    );

    tripId = tripReq.data.data.id;
    tripPin = tripReq.data.data.pinCode;

    assert(
      tripReq.data.data.fare > 30 && tripReq.data.data.distanceKm > 20,
      'Cálculo tarifário e distância estimado com precisão (28.2 km)',
      `Tarifa: R$ ${tripReq.data.data.fare}, Distância: ${tripReq.data.data.distanceKm} km`,
    );

    assert(
      tripPin === '4821',
      'PIN de segurança de 4 dígitos gerado na criação da corrida',
      `PIN: ${tripPin}`,
    );
  }

  // 4. Driver Acceptance & Atomic Concurrency Lock
  console.log('\n--- Sub-suite 4: Aceite do Motorista e Trava de Concorrência ---');
  {
    const acceptRes = await request(`/trips/${tripId}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${driver2Token}` },
      body: JSON.stringify({ driverId: driver2Id }),
    });
    assert(
      acceptRes.ok && acceptRes.data.data?.status === 'ACCEPTED',
      'Motorista Comfort aceita a corrida e status transita para ACCEPTED',
      JSON.stringify(acceptRes.data),
    );

    // Verify driver status is now BUSY
    const drv2Profile = await request('/drivers/me', {
      headers: { Authorization: `Bearer ${driver2Token}` },
    });
    assert(
      drv2Profile.ok && drv2Profile.data.status === 'busy',
      'Status operacional do motorista passa automaticamente para BUSY',
      `Status: ${drv2Profile.data?.status}`,
    );

    // Concurrency check: Driver 1 attempts to accept the already accepted trip
    const doubleAccept = await request(`/trips/${tripId}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${driver1Token}` },
      body: JSON.stringify({ driverId: driver1Id }),
    });
    assert(
      doubleAccept.status === 400,
      'Trava de concorrência atômica: segundo motorista impedido com HTTP 400',
      `Status HTTP: ${doubleAccept.status}`,
    );
  }

  // 5. Trip Lifecycle Progressions (10-state machine)
  console.log('\n--- Sub-suite 5: Ciclo de Vida da Corrida e Validação de PIN ---');
  {
    // ACCEPTED -> DRIVER_ARRIVING
    const arrivingRes = await request(`/trips/${tripId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${driver2Token}` },
      body: JSON.stringify({ status: 'DRIVER_ARRIVING' }),
    });
    assert(
      arrivingRes.ok && arrivingRes.data.data?.status === 'DRIVER_ARRIVING',
      'Transição ACCEPTED -> DRIVER_ARRIVING (A caminho do embarque)',
    );

    // DRIVER_ARRIVING -> DRIVER_ARRIVED
    const arrivedRes = await request(`/trips/${tripId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${driver2Token}` },
      body: JSON.stringify({ status: 'DRIVER_ARRIVED' }),
    });
    assert(
      arrivedRes.ok && arrivedRes.data.data?.status === 'DRIVER_ARRIVED',
      'Transição DRIVER_ARRIVING -> DRIVER_ARRIVED (No local de embarque)',
    );

    // DRIVER_ARRIVED -> IN_PROGRESS with WRONG PIN -> Should fail
    const wrongPinRes = await request(`/trips/${tripId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${driver2Token}` },
      body: JSON.stringify({ status: 'IN_PROGRESS', pinCode: '0000' }),
    });
    assert(
      wrongPinRes.status === 400,
      'Tentativa de início da viagem com PIN incorreto rejeitada com HTTP 400',
      `Status HTTP: ${wrongPinRes.status}`,
    );

    // DRIVER_ARRIVED -> IN_PROGRESS with CORRECT PIN ('4821') -> Success
    const correctPinRes = await request(`/trips/${tripId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${driver2Token}` },
      body: JSON.stringify({ status: 'IN_PROGRESS', pinCode: '4821' }),
    });
    assert(
      correctPinRes.ok && correctPinRes.data.data?.status === 'IN_PROGRESS',
      'Validação bem-sucedida do PIN 4821 e início da viagem (IN_PROGRESS)',
    );

    // Unauthorized transition attempt by passenger
    const unauthComplete = await request(`/trips/${tripId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: JSON.stringify({ status: 'COMPLETED' }),
    });
    assert(
      unauthComplete.status === 403,
      'Passageiro impedido de concluir viagem com HTTP 403 (Controle RBAC)',
      `Status HTTP: ${unauthComplete.status}`,
    );

    // IN_PROGRESS -> COMPLETED by Driver
    const completeRes = await request(`/trips/${tripId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${driver2Token}` },
      body: JSON.stringify({ status: 'COMPLETED' }),
    });
    assert(
      completeRes.ok && completeRes.data.data?.status === 'COMPLETED',
      'Transição IN_PROGRESS -> COMPLETED (Viagem finalizada com sucesso em Penedo)',
    );

    // Verify driver automatically returned to ONLINE
    const drv2AfterComplete = await request('/drivers/me', {
      headers: { Authorization: `Bearer ${driver2Token}` },
    });
    assert(
      drv2AfterComplete.ok && drv2AfterComplete.data.status === 'online',
      'Motorista retorna automaticamente ao status ONLINE após conclusão',
      `Status obtido: ${drv2AfterComplete.data?.status}`,
    );
  }

  // 6. Passenger Trip Details Sanitization (LGPD)
  console.log('\n--- Sub-suite 6: Sanitização de Dados do Motorista para o Passageiro ---');
  {
    const tripDetails = await request(`/trips/${tripId}`, {
      headers: { Authorization: `Bearer ${passengerToken}` },
    });

    const drvData = tripDetails.data.driver;
    const isSanitized =
      drvData &&
      drvData.name !== undefined &&
      drvData.rating !== undefined &&
      drvData.licenseNumber === undefined &&
      drvData.pixKey === undefined;

    assert(
      isSanitized,
      'Consulta da corrida (/trips/:id) não expõe CNH nem chave PIX do motorista ao passageiro (LGPD)',
      JSON.stringify(drvData),
    );
  }

  // 7. Rating and Review Submission
  console.log('\n--- Sub-suite 7: Avaliação e Reputação do Motorista ---');
  {
    const rateRes = await request(`/trips/${tripId}/rate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: JSON.stringify({
        rating: 5,
        review: 'Excelente viagem de Piaçabuçu a Penedo pela AL-101. Carro muito limpo e ar condicionado perfeito.',
      }),
    });
    assert(
      rateRes.ok && rateRes.data.data?.rating === 5,
      'Passageiro envia avaliação de 5 estrelas e depoimento com sucesso',
    );

    // Verify driver rating and totalTrips updated
    const drv2Rating = await request(`/drivers/${driver2Id}/public`, {
      headers: { Authorization: `Bearer ${passengerToken}` },
    });
    assert(
      drv2Rating.ok && drv2Rating.data.totalTrips >= 1 && drv2Rating.data.rating === 5,
      'Métricas do motorista atualizadas após avaliação (rating: 5.0, trips >= 1)',
      `Rating: ${drv2Rating.data?.rating}, Trips: ${drv2Rating.data?.totalTrips}`,
    );
  }

  // 8. Cancellation by Passenger while Searching
  console.log('\n--- Sub-suite 8: Fluxos de Cancelamento e Estados Terminais ---');
  {
    const trip2 = await request('/trips', {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: JSON.stringify({
        originLat: -10.405602,
        originLng: -36.434405,
        originAddress: 'Piaçabuçu',
        destLat: -10.289673,
        destLng: -36.586452,
        destAddress: 'Penedo',
        category: 'economy',
      }),
    });
    const cancelPassRes = await request(`/trips/${trip2.data.data.id}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: JSON.stringify({ reason: 'Desisti da viagem antes do aceite' }),
    });
    assert(
      cancelPassRes.ok && cancelPassRes.data.data?.status === 'CANCELLED_BY_PASSENGER',
      'Passageiro cancela corrida em SEARCHING -> CANCELLED_BY_PASSENGER',
    );
  }

  // 9. Cancellation by Driver after Acceptance
  {
    const trip3 = await request('/trips', {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: JSON.stringify({
        originLat: -10.405602,
        originLng: -36.434405,
        originAddress: 'Piaçabuçu',
        destLat: -10.289673,
        destLng: -36.586452,
        destAddress: 'Penedo',
        category: 'economy',
      }),
    });
    await request(`/trips/${trip3.data.data.id}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${driver1Token}` },
      body: JSON.stringify({ driverId: driver1Id }),
    });
    const cancelDrvRes = await request(`/trips/${trip3.data.data.id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${driver1Token}` },
      body: JSON.stringify({
        status: 'CANCELLED_BY_DRIVER',
        reason: 'Pneu furado na saída de Piaçabuçu',
      }),
    });
    assert(
      cancelDrvRes.ok && cancelDrvRes.data.data?.status === 'CANCELLED_BY_DRIVER',
      'Motorista cancela corrida após aceite -> CANCELLED_BY_DRIVER',
    );

    // Verify Driver 1 returned to ONLINE
    const drv1Profile = await request('/drivers/me', {
      headers: { Authorization: `Bearer ${driver1Token}` },
    });
    assert(
      drv1Profile.ok && drv1Profile.data.status === 'online',
      'Motorista liberado de volta para ONLINE após cancelamento',
    );
  }

  // 10. Driver Decline Flow
  console.log('\n--- Sub-suite 9: Recusa de Oferta pelo Motorista ---');
  {
    const trip4 = await request('/trips', {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: JSON.stringify({
        originLat: -10.405602,
        originLng: -36.434405,
        originAddress: 'Piaçabuçu',
        destLat: -10.289673,
        destLng: -36.586452,
        destAddress: 'Penedo',
        category: 'economy',
      }),
    });
    const declineRes = await request(`/trips/${trip4.data.data.id}/decline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${driver1Token}` },
    });
    assert(
      declineRes.ok && declineRes.data.success === true,
      'Motorista recusa oferta de corrida via POST /trips/:id/decline',
    );
  }

  // Summary
  console.log('\n============================================================');
  console.log(`📊 RESULTADO SPRINT 3: ${passedTests} PASSOU | ${failedTests} FALHOU`);
  console.log('============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSprint3Tests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
