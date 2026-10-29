const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const STUDIO_PATH = path.join(ROOT, 'mobility_interactive_studio.html');

async function runTests() {
  console.log('====================================================');
  console.log(' SIMBORA 3.5 — E2E TEST & VERIFICATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // TEST 1: Check Brand Asset Files on Disk
  // ----------------------------------------------------
  console.log('\n--- Test Group 1: Brand Identity Assets ---');
  const brandAssets = [
    'brand/VETORES-OFICIAIS-SVG/simbora-app-icon.svg',
    'brand/VETORES-OFICIAIS-SVG/simbora-logo-horizontal-dark.svg',
    'brand/VETORES-OFICIAIS-SVG/simbora-logo-horizontal-light.svg',
    'brand/VETORES-OFICIAIS-SVG/simbora-symbol-isolated.svg',
    'public/brand/VETORES-OFICIAIS-SVG/simbora-app-icon.svg',
    'apps/admin/public/brand/simbora-app-icon.svg',
    'apps/passenger/assets/simbora-app-icon.svg',
    'apps/driver/assets/simbora-app-icon.svg'
  ];

  brandAssets.forEach(relPath => {
    const full = path.join(ROOT, relPath);
    assert(fs.existsSync(full), `Brand asset exists: ${relPath}`);
  });

  // ----------------------------------------------------
  // TEST 2: Check Studio HTML Elements and Tokens
  // ----------------------------------------------------
  console.log('\n--- Test Group 2: Studio HTML Elements & Brand Tokens ---');
  const html = fs.readFileSync(STUDIO_PATH, 'utf-8');

  assert(html.includes('Plus Jakarta Sans'), 'Google Font Plus Jakarta Sans linked');
  assert(html.includes('cdn.socket.io'), 'Socket.IO client library script tag present');
  assert(html.includes('id="receipt-modal"'), 'Receipt Modal #receipt-modal present');
  assert(html.includes('id="sos-modal"'), 'SOS Modal #sos-modal present');
  assert(html.includes('id="pix-payout-modal"'), 'Pix Payout Modal #pix-payout-modal present');
  assert(html.includes('id="btn-driver-accept-ride"'), 'Driver Accept button has id="btn-driver-accept-ride"');
  assert(html.includes('id="btn-driver-decline-ride"'), 'Driver Decline button has id="btn-driver-decline-ride"');
  assert(html.includes('simbora-app-icon.svg'), 'Studio header uses official SVG icon');
  assert(html.includes('Pediu. Chegou. Simbora!'), 'Studio header displays official slogan');

  // ----------------------------------------------------
  // TEST 3: Static Analysis of all onclick handlers in HTML
  // ----------------------------------------------------
  console.log('\n--- Test Group 3: Onclick Handler Verification in Studio ---');
  const onclickRegex = /onclick="([a-zA-Z0-9_]+)\(/g;
  let match;
  const handlers = new Set();
  while ((match = onclickRegex.exec(html)) !== null) {
    handlers.add(match[1]);
  }

  // Common built-ins or simple alerts to ignore
  const ignoreList = new Set(['alert']);

  console.log(`Found ${handlers.size} unique onclick functions in HTML.`);
  let allHandlersDefined = true;
  handlers.forEach(fn => {
    if (ignoreList.has(fn)) return;
    const isDeclared = html.includes(`function ${fn}`) || html.includes(`const ${fn} =`) || html.includes(`let ${fn} =`);
    if (!isDeclared) {
      console.error(`  Missing function declaration in script: ${fn}`);
      allHandlersDefined = false;
    }
  });
  assert(allHandlersDefined, 'All onclick handlers called in HTML are declared in <script>');

  // Critical handlers check
  const criticalHandlers = [
    'driverAcceptRide',
    'driverDeclineRide',
    'driverArrivedAtPickup',
    'driverConfirmPinAndStart',
    'driverFinishTrip',
    'passengerRequestRide',
    'passengerCancelRequest',
    'passengerFinishRating',
    'openReceiptModal',
    'closeReceiptModal',
    'triggerSOSModal',
    'closeSOSModal',
    'requestPixPayout',
    'closePixModal',
    'sendPassengerMessage',
    'sendQuickPassengerReply'
  ];

  criticalHandlers.forEach(h => {
    assert(html.includes(`function ${h}`) || html.includes(`const ${h} =`), `Critical handler defined: ${h}`);
  });

  // ----------------------------------------------------
  // TEST 4: Backend REST API + Dispatch Lifecycle
  // ----------------------------------------------------
  console.log('\n--- Test Group 4: Backend REST API Lifecycle (Port 3001) ---');

  async function apiRequest(method, urlPath, token, body) {
    return new Promise((resolve, reject) => {
      const url = new URL(urlPath, 'http://localhost:3001');
      const req = http.request({
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: data ? JSON.parse(data) : {} });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });
      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  try {
    // 4.1 Login
    const passLogin = await apiRequest('POST', '/auth/login', null, {
      email: 'mariana@example.com',
      password: 'Password@123'
    });
    assert(passLogin.status === 200 && passLogin.data.accessToken, 'Mariana login 200 OK');
    const passToken = passLogin.data.accessToken;

    const drvLogin = await apiRequest('POST', '/auth/login', null, {
      email: 'carlos.motorista@mobility.com',
      password: 'Password@123'
    });
    assert(drvLogin.status === 200 && drvLogin.data.accessToken, 'Carlos login 200 OK');
    const drvToken = drvLogin.data.accessToken;

    // 4.2 Set Driver Online
    const onlineRes = await apiRequest('PUT', '/drivers/me/status', drvToken, {
      status: 'online',
      latitude: -10.4056,
      longitude: -36.4344
    });
    assert(onlineRes.status === 200, 'Driver set to ONLINE at Piaçabuçu 200 OK');

    // 4.3 Request Trip
    const tripRes = await apiRequest('POST', '/trips', passToken, {
      originLat: -10.4056,
      originLng: -36.4344,
      destLat: -10.2897,
      destLng: -36.5864,
      originAddress: 'Praça São Francisco, Piaçabuçu',
      destAddress: 'Centro Histórico, Penedo',
      category: 'COMFORT',
      paymentMethod: 'CREDIT_CARD'
    });
    const tripData = tripRes.data?.data || tripRes.data;
    assert(tripRes.status === 201 && tripData.id, 'Trip requested: status SEARCHING / 201 Created');
    const tripId = tripData.id;

    // 4.4 Driver Accept Trip
    const acceptRes = await apiRequest('PUT', `/trips/${tripId}/accept`, drvToken, {});
    const acceptData = acceptRes.data?.data || acceptRes.data;
    assert(acceptRes.status === 200 && acceptData.status === 'ACCEPTED', 'Driver accepted trip: status ACCEPTED / 200 OK');

    // 4.5 Concurrency Check: Second accept attempt must fail with 400
    const secondAcceptRes = await apiRequest('PUT', `/trips/${tripId}/accept`, drvToken, {});
    assert(
      secondAcceptRes.status === 400 && secondAcceptRes.data.message && secondAcceptRes.data.message.includes('atribuída'),
      'Concurrency Protection: Second accept attempt returns 400 "Corrida já atribuída"'
    );

    // 4.6 Driver Arrived
    const arrivedRes = await apiRequest('PUT', `/trips/${tripId}/status`, drvToken, {
      status: 'DRIVER_ARRIVED'
    });
    const arrivedData = arrivedRes.data?.data || arrivedRes.data;
    assert(arrivedRes.status === 200 && arrivedData.status === 'DRIVER_ARRIVED', 'Driver arrived: status DRIVER_ARRIVED / 200 OK');

    // 4.7 Trip In Progress
    const inProgressRes = await apiRequest('PUT', `/trips/${tripId}/status`, drvToken, {
      status: 'IN_PROGRESS',
      pinCode: '4821'
    });
    const inProgressData = inProgressRes.data?.data || inProgressRes.data;
    assert(inProgressRes.status === 200 && inProgressData.status === 'IN_PROGRESS', 'PIN 4821 confirmed: status IN_PROGRESS / 200 OK');

    // 4.8 Complete Trip
    const completeRes = await apiRequest('PUT', `/trips/${tripId}/status`, drvToken, {
      status: 'COMPLETED'
    });
    const completeData = completeRes.data?.data || completeRes.data;
    assert(completeRes.status === 200 && completeData.status === 'COMPLETED', 'Trip completed in Penedo: status COMPLETED / 200 OK');

    // 4.9 Rate Trip
    const rateRes = await apiRequest('POST', `/trips/${tripId}/rate`, passToken, {
      rating: 5,
      feedback: 'Viagem sensacional de Piaçabuçu para Penedo!'
    });
    const rateData = rateRes.data?.data || rateRes.data;
    assert(rateRes.status === 201 && (rateData.rating === 5 || rateRes.data.success), 'Passenger 5-star rating: status 201 Created');

  } catch (err) {
    console.error('API Test Error:', err);
    failed++;
  }

  // ----------------------------------------------------
  // TEST 5: Verify Web Server Responses
  // ----------------------------------------------------
  console.log('\n--- Test Group 5: Web Server Endpoints ---');

  async function checkHttp(url) {
    return new Promise((resolve) => {
      http.get(url, (res) => {
        resolve(res.statusCode);
      }).on('error', () => resolve(null));
    });
  }

  const studioStatus = await checkHttp('http://localhost:8080/');
  assert(studioStatus === 200, 'SIMBORA Studio accessible at http://localhost:8080/ (200 OK)');

  const svgStatus = await checkHttp('http://localhost:8080/brand/VETORES-OFICIAIS-SVG/simbora-app-icon.svg');
  assert(svgStatus === 200, 'Brand SVG served at http://localhost:8080/brand/VETORES-OFICIAIS-SVG/simbora-app-icon.svg (200 OK)');

  const adminStatus = await checkHttp('http://localhost:3000/');
  assert(adminStatus === 200 || adminStatus === 307 || adminStatus === 308, 'Admin Panel accessible at http://localhost:3000/');

  console.log('\n====================================================');
  console.log(` RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
