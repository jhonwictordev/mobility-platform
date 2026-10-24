const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data ? (res.headers['content-type']?.includes('json') ? JSON.parse(data) : data) : null,
        });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runSecurityTests() {
  console.log('===============================================================');
  console.log('🔒 SUÍTE DE TESTES: VERIFICAÇÃO DE HARDENING & SEGURANÇA');
  console.log('===============================================================');

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
    // Test 1: OWASP Security Headers
    const rootRes = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/users',
      method: 'GET',
    });

    assert(
      rootRes.headers['x-content-type-options'] === 'nosniff',
      'Header X-Content-Type-Options deve ser "nosniff"'
    );
    assert(
      rootRes.headers['x-frame-options'] === 'SAMEORIGIN',
      'Header X-Frame-Options deve ser "SAMEORIGIN"'
    );
    assert(
      rootRes.headers['x-xss-protection'] === '1; mode=block',
      'Header X-XSS-Protection deve ser "1; mode=block"'
    );
    assert(
      rootRes.headers['strict-transport-security']?.includes('max-age='),
      'Header Strict-Transport-Security deve estar presente com max-age'
    );
    assert(
      rootRes.headers['referrer-policy'] === 'strict-origin-when-cross-origin',
      'Header Referrer-Policy deve ser "strict-origin-when-cross-origin"'
    );

    // Test 2: Admin routes require authentication (401 Unauthorized)
    const adminRes = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/admin/dashboard',
      method: 'GET',
    });
    assert(
      adminRes.statusCode === 401,
      `GET /admin/dashboard sem token deve retornar 401 (Recebido: ${adminRes.statusCode})`
    );

    const approveRes = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/admin/drivers/driver-001/approve',
      method: 'PUT',
    });
    assert(
      approveRes.statusCode === 401,
      `PUT /admin/drivers/:id/approve sem token deve retornar 401 (Recebido: ${approveRes.statusCode})`
    );

    // Test 3: Trips endpoint requires authentication (401 Unauthorized)
    const tripsRes = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/trips',
      method: 'GET',
    });
    assert(
      tripsRes.statusCode === 401,
      `GET /trips sem token deve retornar 401 (Recebido: ${tripsRes.statusCode})`
    );

    // Test 4: Privilege Escalation check on Auth Registration
    const testEmail = `test_attacker_${Date.now()}@example.com`;
    const regPayload = JSON.stringify({
      name: 'Security Test Attacker',
      email: testEmail,
      password: 'replace_with_test_password',
      phone: '+5511999998888',
      role: 'admin', // Attacker attempts to become admin
    });

    const regRes = await makeRequest(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/auth/register',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(regPayload),
        },
      },
      regPayload
    );

    assert(
      regRes.statusCode === 201 && regRes.body?.user?.role === 'passenger',
      `Tentativa de auto-elevação para 'admin' foi neutralizada: role forçada para 'passenger' (Recebido: ${regRes.body?.user?.role})`
    );

    // Test 5: Location route proxy is open for client routing
    const routeRes = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/location/route?originLat=-10.405602&originLng=-36.434405&destLat=-10.289673&destLng=-36.586452',
      method: 'GET',
    });
    assert(
      routeRes.statusCode === 200 && routeRes.body?.coordinates?.length > 100,
      `GET /location/route Piaçabuçu → Penedo responde com HTTP 200 e geometria válida (${routeRes.body?.coordinates?.length} nós)`
    );

    console.log('===============================================================');
    console.log(`RESULTADO: ${passed} PASSOU | ${failed} FALHOU`);
    console.log('===============================================================');
    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Erro na execução dos testes:', err);
    process.exit(1);
  }
}

runSecurityTests();
