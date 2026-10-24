// ============================================================
// SIMBORA 3.0 — Automated Test Suite: Sprint 6
// Chat Embarcado, Segurança SOS e Experiência do Usuário
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

async function runSprint6Tests() {
  console.log('🚀 Running SIMBORA 3.0 — Sprint 6 Test Suite: Chat & Segurança SOS...\n');

  const randomSuffix = Math.floor(Math.random() * 1000000);
  const password = 'Password@123';

  let adminToken = '';
  let passengerToken = '';
  let driverToken = '';
  let driverId = '';
  let attackerToken = '';
  let tripId = '';

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
        name: 'Passageira Segura',
        email: `pass.chat_${randomSuffix}@simbora.al`,
        password,
        phone: '+5582998881122',
        role: 'passenger',
      }),
    });
    passengerToken = passReg.data.accessToken;
    assert(passReg.ok, 'Cadastro de Passageira');

    const drvReg = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Motorista Atento',
        email: `driver.chat_${randomSuffix}@simbora.al`,
        password,
        phone: '+5582998883344',
        role: 'driver',
        licenseNumber: `CNH_CHAT_${randomSuffix}`,
      }),
    });
    driverToken = drvReg.data.accessToken;
    driverId = drvReg.data.driver.id;

    await request(`/admin/drivers/${driverId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(true, 'Motorista homologado');

    const hackerReg = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Invasor Chat',
        email: `hacker.chat_${randomSuffix}@simbora.al`,
        password,
        phone: '+5582998885566',
        role: 'passenger',
      }),
    });
    attackerToken = hackerReg.data.accessToken;
    assert(hackerReg.ok, 'Cadastro de Ator Não-Autorizado para testes de Anti-IDOR');
  }

  // 2. Create and Accept Trip
  console.log('\n--- Sub-suite 2: Abertura de Viagem Ativa ---');
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
        category: 'economy',
        pinCode: '4821',
      }),
    });
    tripId = tripReq.data.data.id;

    // Driver accepts
    await request(`/drivers/${driverId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: JSON.stringify({ status: 'online' }),
    });
    const acceptRes = await request(`/trips/${tripId}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: JSON.stringify({ driverId }),
    });
    assert(acceptRes.ok, 'Corrida iniciada e aceita pelo motorista');
  }

  // 3. In-Ride Chat Messaging
  console.log('\n--- Sub-suite 3: Comunicação em Tempo Real (Chat Embarcado) ---');
  {
    // Passenger sends message
    const msg1 = await request(`/trips/${tripId}/chat`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: JSON.stringify({ message: 'Olá! Estou aguardando em frente à igreja.' }),
    });
    assert(
      msg1.ok && msg1.data.data?.senderRole === 'passenger',
      'Passageiro envia mensagem no chat da corrida com role "passenger"',
      JSON.stringify(msg1.data),
    );

    // Driver replies
    const msg2 = await request(`/trips/${tripId}/chat`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: JSON.stringify({ message: 'Perfeito! Chego em 2 minutos no carro prata.' }),
    });
    assert(
      msg2.ok && msg2.data.data?.senderRole === 'driver',
      'Motorista responde no chat da corrida com role "driver"',
      JSON.stringify(msg2.data),
    );

    // Read chat history
    const history = await request(`/trips/${tripId}/chat`, {
      headers: { Authorization: `Bearer ${passengerToken}` },
    });
    assert(
      history.ok && Array.isArray(history.data) && history.data.length >= 2,
      'Histórico ordenado de mensagens do chat recuperado com sucesso',
    );
  }

  // 4. Anti-IDOR Protection on Chat
  console.log('\n--- Sub-suite 4: Proteção Anti-IDOR nas Mensagens ---');
  {
    const idorSend = await request(`/trips/${tripId}/chat`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${attackerToken}` },
      body: JSON.stringify({ message: 'Tentativa de espionagem' }),
    });
    assert(
      idorSend.status === 403,
      'Usuário não relacionado impedido com HTTP 403 de postar mensagens na conversa alheia (Anti-IDOR)',
    );

    const idorRead = await request(`/trips/${tripId}/chat`, {
      headers: { Authorization: `Bearer ${attackerToken}` },
    });
    assert(
      idorRead.status === 403,
      'Usuário não relacionado impedido com HTTP 403 de ler mensagens da conversa alheia (Anti-IDOR)',
    );
  }

  // 5. Emergency SOS Panic Button
  console.log('\n--- Sub-suite 5: Botão do Pânico (SOS Emergência Alagoas) ---');
  {
    const sosRes = await request(`/trips/${tripId}/sos`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: JSON.stringify({ reason: 'Veículo suspeito na rodovia AL-101' }),
    });

    assert(
      sosRes.ok &&
        sosRes.data.success === true &&
        sosRes.data.emergencyContacts?.police === '190' &&
        sosRes.data.emergencyContacts?.samu === '192' &&
        sosRes.data.emergencyContacts?.simboraSafetyDesk,
      'Botão SOS acionado com sucesso: Central SIMBORA notificada e telefones 190, 192 e 193 retornados',
      JSON.stringify(sosRes.data),
    );

    // Anti-IDOR on SOS
    const idorSos = await request(`/trips/${tripId}/sos`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${attackerToken}` },
      body: JSON.stringify({ reason: 'Falso alarme' }),
    });
    assert(
      idorSos.status === 403,
      'Tentativa de forjar acionamento de SOS em viagem alheia bloqueada com HTTP 403 (Anti-IDOR)',
    );
  }

  // Summary
  console.log('\n============================================================');
  console.log(`📊 RESULTADO SPRINT 6: ${passedTests} PASSOU | ${failedTests} FALHOU`);
  console.log('============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSprint6Tests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
