const http = require('http');

const API_BASE = 'http://localhost:3001';

function makeRequest(method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, data: json });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('===============================================================');
  console.log('🛡️ SUÍTE DE TESTES: AUTORIZAÇÃO, IDOR E ISOLAMENTO DE RECURSOS');
  console.log('===============================================================\n');

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

  try {
    // 1. Create two test passengers: User A and User B
    const uniqueEmailA = `pass_a_${Date.now()}@example.com`;
    const uniqueEmailB = `pass_b_${Date.now()}@example.com`;

    const regA = await makeRequest('POST', '/auth/register', {}, {
      name: 'Passenger A',
      email: uniqueEmailA,
      password: 'replace_with_test_password',
      phone: '+55 11 99999-0010'
    });
    const tokenA = regA.data.accessToken;
    const userAId = regA.data.user.id;

    const regB = await makeRequest('POST', '/auth/register', {}, {
      name: 'Passenger B',
      email: uniqueEmailB,
      password: 'replace_with_test_password',
      phone: '+55 11 99999-0020'
    });
    const tokenB = regB.data.accessToken;
    const userBId = regB.data.user.id;

    // TEST 1: Password sanitization on /users/me
    const meA = await makeRequest('GET', '/users/me', { Authorization: `Bearer ${tokenA}` });
    assert(meA.status === 200 && !meA.data.password, '1. GET /users/me não deve expor o campo de hash de senha');

    // TEST 2: IDOR Defense on GET /users/:id (User A querying User B)
    const userBByA = await makeRequest('GET', `/users/${userBId}`, { Authorization: `Bearer ${tokenA}` });
    assert(userBByA.status === 403, `2. User A consultando User B deve retornar 403 Forbidden (Recebido: ${userBByA.status})`);

    // TEST 3: User enumeration protection on GET /users without admin
    const listUsersByA = await makeRequest('GET', '/users', { Authorization: `Bearer ${tokenA}` });
    assert(listUsersByA.status === 403, `3. Passageiro consultando GET /users deve retornar 403 Forbidden (Recebido: ${listUsersByA.status})`);

    // TEST 4: Vehicle approval protection on PUT /vehicles/:id/approve by non-admin
    const approveVehByA = await makeRequest('PUT', '/vehicles/fake-veh-id/approve', { Authorization: `Bearer ${tokenA}` }, { approved: true });
    assert(approveVehByA.status === 403, `4. Passageiro tentando aprovar veículo deve retornar 403 Forbidden (Recebido: ${approveVehByA.status})`);

    // TEST 5: Driver approval protection on PUT /drivers/:id/approval by non-admin
    const approveDriverByA = await makeRequest('PUT', '/drivers/fake-driver-id/approval', { Authorization: `Bearer ${tokenA}` }, { approvalStatus: 'approved' });
    assert(approveDriverByA.status === 403, `5. Passageiro tentando aprovar motorista deve retornar 403 Forbidden (Recebido: ${approveDriverByA.status})`);

    // TEST 6: Financial protection on GET /payments
    const listPaymentsByA = await makeRequest('GET', '/payments', { Authorization: `Bearer ${tokenA}` });
    assert(listPaymentsByA.status === 403, `6. Passageiro consultando histórico global de pagamentos deve retornar 403 Forbidden (Recebido: ${listPaymentsByA.status})`);

    // TEST 7: IDOR Defense on Trips: User A creates a trip
    const tripReq = await makeRequest('POST', '/trips', { Authorization: `Bearer ${tokenA}` }, {
      originLat: -10.405602,
      originLng: -36.434405,
      originAddress: 'Piaçabuçu Center',
      destLat: -10.289673,
      destLng: -36.586452,
      destAddress: 'Penedo Historic Center'
    });
    assert(tripReq.status === 201 && tripReq.data.data?.id, '7. Passageiro A solicita corrida com sucesso');
    const tripId = tripReq.data.data.id;

    // TEST 8: User B attempts to access User A's private trip
    const tripByB = await makeRequest('GET', `/trips/${tripId}`, { Authorization: `Bearer ${tokenB}` });
    assert(tripByB.status === 403, `8. Passageiro B tentando acessar corrida do Passageiro A deve retornar 403 Forbidden (Recebido: ${tripByB.status})`);

    // TEST 9: User B attempts to cancel or modify status of User A's trip
    const cancelByB = await makeRequest('POST', `/trips/${tripId}/cancel`, { Authorization: `Bearer ${tokenB}` }, { reason: 'Malicious cancel' });
    assert(cancelByB.status === 403, `9. Passageiro B tentando cancelar corrida do Passageiro A deve retornar 403 Forbidden (Recebido: ${cancelByB.status})`);

    // TEST 10: Owner (User A) successfully accesses their own trip
    const tripByA = await makeRequest('GET', `/trips/${tripId}`, { Authorization: `Bearer ${tokenA}` });
    assert(tripByA.status === 200 && tripByA.data.id === tripId, '10. Passageiro titular (User A) acessa seus próprios dados de corrida com sucesso');

  } catch (err) {
    console.error('Erro na execução dos testes:', err);
    failed++;
  }

  console.log('\n===============================================================');
  console.log(`RESULTADO FINAL: ${passed} PASSOU | ${failed} FALHOU`);
  console.log('===============================================================');

  if (failed > 0) process.exit(1);
}

runTests();
