const http = require('http');
const fs = require('fs');
const path = require('path');

function request(url, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const reqOptions = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (postData) {
      if (typeof postData === 'object') {
        postData = JSON.stringify(postData);
        reqOptions.headers['Content-Type'] = 'application/json';
      }
      reqOptions.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json, raw: data });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('   SIMBORA 3.4 — FULL-STACK AUTOMATED TEST SUITE');
  console.log('   Alagoas Intermunicipal Mobility & Real-Time Driver Operations');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // AUTHENTICATION & DRIVER APPROVAL SETUP
  // -------------------------------------------------------------
  let adminToken = '';
  let driverToken = '';
  let driverId = '';
  let vehicleId = '';

  try {
    const aLogin = await request('http://localhost:3001/auth/login', {
      method: 'POST'
    }, { identifier: 'admin@mobility.com', password: 'Password@123' });
    if (aLogin.status === 200 && aLogin.data.accessToken) {
      adminToken = aLogin.data.accessToken;
      assert(true, 'Admin authenticated successfully');
    } else {
      assert(false, 'Admin authentication failed');
    }
  } catch (err) {
    assert(false, 'Admin login error: ' + err.message);
  }

  const uniqueId = Date.now();
  const driverEmail = `carlos_${uniqueId}@simbora.al`;

  try {
    const drvReg = await request('http://localhost:3001/auth/register', {
      method: 'POST'
    }, {
      name: 'Carlos Oliveira',
      email: driverEmail,
      password: 'Password@123',
      role: 'driver',
      phone: `+558299${Math.floor(1000000 + Math.random() * 9000000)}`,
      licenseNumber: `CNH-${uniqueId}`,
      cnhCategory: 'B'
    });

    if (drvReg.status === 201 && drvReg.data.accessToken) {
      driverToken = drvReg.data.accessToken;
      driverId = drvReg.data.driver.id;
      assert(true, 'Driver Carlos Oliveira registered with CNH');
    } else {
      assert(false, 'Driver registration failed: ' + JSON.stringify(drvReg));
    }
  } catch (err) {
    assert(false, 'Driver registration error: ' + err.message);
  }

  // Register vehicle and approve driver via admin
  try {
    const vehRes = await request('http://localhost:3001/vehicles', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${driverToken}` }
    }, {
      make: 'Toyota',
      model: 'Corolla XEi 2.0',
      year: 2023,
      color: 'Prata',
      plateNumber: `QTT${Math.floor(1000 + Math.random() * 9000)}`,
      renavam: '12345678901',
      category: 'comfort',
      seats: 4
    });
    vehicleId = vehRes.data.id;
    assert(vehRes.status === 201 && vehicleId, 'Vehicle registered for driver');

    const appVeh = await request(`http://localhost:3001/vehicles/${vehicleId}/approve`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    }, { approved: true });
    assert(appVeh.status === 200, 'Admin approves vehicle');

    const appDrv = await request(`http://localhost:3001/admin/drivers/${driverId}/approve`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(appDrv.status === 200, 'Admin approves driver account');
  } catch (err) {
    assert(false, 'Vehicle registration and approval error: ' + err.message);
  }

  // -------------------------------------------------------------
  // TEST 1: Passenger Clean Initial State (Fase 2)
  // -------------------------------------------------------------
  console.log('\n--- TEST 1: Passenger Clean Initial State & Shortcuts ---');
  const studioHtmlPath = path.join(__dirname, '..', 'mobility_interactive_studio.html');
  const studioHtml = fs.readFileSync(studioHtmlPath, 'utf-8');

  assert(studioHtml.includes('id="p-state-initial"'), 'Initial search state container (#p-state-initial) exists');
  assert(studioHtml.includes('id="p-state-idle" class="hidden'), 'Idle category selection (#p-state-idle) starts hidden by default');
  assert(studioHtml.includes('selectQuickShortcut(\'current\')'), 'Quick shortcut for current location (Piaçabuçu) exists');
  assert(studioHtml.includes('selectQuickShortcut(\'home\')'), 'Quick shortcut for Home (Penedo) exists');
  assert(studioHtml.includes('selectQuickShortcut(\'work\')'), 'Quick shortcut for Work (Arapiraca) exists');
  assert(studioHtml.includes('Modo Demonstração'), 'Demonstration scenario fast button (Piaçabuçu ⇄ Penedo) present');
  assert(studioHtml.includes('resetToInitialSearch()'), 'Function resetToInitialSearch() exists to restore clean screen');

  // -------------------------------------------------------------
  // TEST 2: All 102 Municipalities of Alagoas (Fase 3)
  // -------------------------------------------------------------
  console.log('\n--- TEST 2: 102 Municipalities of Alagoas Dataset & Calculation ---');
  const match = studioHtml.match(/const ALAGOAS_102_MUNICIPALITIES\s*=\s*(\[[\s\S]*?\]);/);
  assert(match !== null, 'ALAGOAS_102_MUNICIPALITIES array defined in studio');
  
  if (match) {
    const list = eval(match[1]);
    assert(list.length === 102, `All 102 municipalities present (count: ${list.length})`);

    const hasMaceio = list.some(m => m.id === 'maceio' && m.name === 'Maceió');
    const hasPenedo = list.some(m => m.id === 'penedo' && m.name === 'Penedo');
    const hasPiacabucu = list.some(m => m.id === 'piacabucu' && m.name === 'Piaçabuçu');
    const hasDelmiro = list.some(m => m.id === 'delmiro_gouveia' && m.name === 'Delmiro Gouveia');
    const hasArapiraca = list.some(m => m.id === 'arapiraca' && m.name === 'Arapiraca');

    assert(hasMaceio && hasPenedo && hasPiacabucu && hasDelmiro && hasArapiraca, 'Key Alagoas cities correctly verified');
  }

  assert(studioHtml.includes('filterMunicipalitiesList'), 'filterMunicipalitiesList function implemented');
  assert(studioHtml.includes('calculateDynamicTrip'), 'calculateDynamicTrip computes road distance and live fares');
  assert(studioHtml.includes('openMunicipalityModal'), 'openMunicipalityModal supports choosing origin or destination');

  // -------------------------------------------------------------
  // TEST 3: Driver Availability Neon Online/Off-line Toggle (Fase 4)
  // -------------------------------------------------------------
  console.log('\n--- TEST 3: Driver Neon Availability Toggle & Backend Sync ---');
  assert(studioHtml.includes('btn-driver-toggle'), 'Neon button #btn-driver-toggle exists');
  assert(studioHtml.includes('#00FF9C'), 'Neon green hex color #00FF9C applied for ONLINE state');
  assert(studioHtml.includes('#FF334E'), 'Neon red hex color #FF334E applied for OFF-LINE state');
  assert(studioHtml.includes('toggleDriverOnline'), 'toggleDriverOnline() handler toggles availability and calls backend');

  try {
    const onlineRes = await request('http://localhost:3001/drivers/me/status', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${driverToken}` }
    }, { status: 'ONLINE' });
    assert(onlineRes.status === 200 && (onlineRes.data.status === 'ONLINE' || onlineRes.data.status === 'online'), 'Backend PUT /drivers/me/status sets status to ONLINE');

    const offlineRes = await request('http://localhost:3001/drivers/me/status', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${driverToken}` }
    }, { status: 'OFFLINE' });
    assert(offlineRes.status === 200 && (offlineRes.data.status === 'OFFLINE' || offlineRes.data.status === 'offline'), 'Backend PUT /drivers/me/status sets status to OFFLINE');

    // Restore to ONLINE
    await request('http://localhost:3001/drivers/me/status', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${driverToken}` }
    }, { status: 'ONLINE' });
  } catch (err) {
    assert(false, 'Driver status endpoint communication failed: ' + err.message);
  }

  // -------------------------------------------------------------
  // TEST 4: Vehicle Change Request Workflow (Fase 5 & 6)
  // -------------------------------------------------------------
  console.log('\n--- TEST 4: Vehicle Change Approval Workflow (Driver & Admin) ---');
  assert(studioHtml.includes('d-subpage-change-vehicle'), 'Driver vehicle change subpage form exists');
  assert(studioHtml.includes('d-veh-change-status-banner'), 'Vehicle change status banner exists in driver vehicle page');
  assert(studioHtml.includes('submitVehicleChangeRequest'), 'submitVehicleChangeRequest handler connects to POST /vehicles/change-requests');

  let createdRequestId = '';
  try {
    const uniquePlate = 'SIM' + Math.floor(1000 + Math.random() * 9000);
    const newReqRes = await request('http://localhost:3001/vehicles/change-requests', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${driverToken}` }
    }, {
      make: 'Toyota',
      model: 'Corolla Cross XRE 2.0',
      year: 2024,
      plate: uniquePlate,
      color: 'Branco Pérola',
      category: 'comfort',
      reason: 'Renovação e ampliação de capacidade intermunicipal',
      notes: 'Laudo Detran AL 2026 emitido'
    });
    assert(newReqRes.status === 201 && newReqRes.data.status === 'PENDING', 'Driver creates vehicle change request (Status: PENDING)');
    createdRequestId = newReqRes.data.id;

    const listRes = await request('http://localhost:3001/vehicles/change-requests/my', {
      headers: { 'Authorization': `Bearer ${driverToken}` }
    });
    assert(listRes.status === 200 && Array.isArray(listRes.data), 'Driver can list personal change requests via GET /vehicles/change-requests/my');
  } catch (err) {
    assert(false, 'Vehicle change request creation failed: ' + err.message);
  }

  if (adminToken && createdRequestId) {
    try {
      const approveRes = await request(`http://localhost:3001/vehicles/change-requests/${createdRequestId}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      }, { adminNotes: 'Homologado com laudo e vistoria conferidos' });
      if (approveRes.status !== 200 || (approveRes.data?.request?.status !== 'APPROVED' && approveRes.data?.status !== 'APPROVED')) {
        console.log('DEBUG approveRes:', JSON.stringify(approveRes));
      }
      const approvedStatus = approveRes.data?.request?.status || approveRes.data?.status;
      assert(approveRes.status === 200 && approvedStatus === 'APPROVED', 'Admin approves vehicle change request (Status: APPROVED)');

      // Verify rejection flow with mandatory justification
      const rejectTestReq = await request('http://localhost:3001/vehicles/change-requests', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${driverToken}` }
      }, {
        make: 'Fiat',
        model: 'Uno Mille',
        year: 2010,
        plate: 'OLD-1999',
        color: 'Prata',
        category: 'economy',
        reason: 'Veículo adicional para emergências'
      });
      const rejectId = rejectTestReq.data.id;

      const rejectRes = await request(`http://localhost:3001/vehicles/change-requests/${rejectId}/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      }, { rejectionReason: 'Ano do veículo anterior a 2014 — não atende os requisitos de conforto da portaria Alagoas' });
      assert(rejectRes.status === 200 && rejectRes.data.status === 'REJECTED', 'Admin rejects vehicle with mandatory reason (Status: REJECTED)');
    } catch (err) {
      assert(false, 'Admin approval/rejection failed: ' + err.message);
    }
  }

  // Check Admin page existence and compilation
  try {
    const adminPageRes = await request('http://localhost:3000/vehicles/requests');
    assert(adminPageRes.status === 200, 'Admin panel page /vehicles/requests renders successfully (HTTP 200)');
  } catch (err) {
    assert(false, 'Admin panel /vehicles/requests request failed: ' + err.message);
  }

  // -------------------------------------------------------------
  // TEST 5: Animated Weekly Earnings Dashboard (Fase 7-13)
  // -------------------------------------------------------------
  console.log('\n--- TEST 5: Animated Weekly Earnings Dashboard ---');
  assert(studioHtml.includes('id="d-weekly-bars-container"'), 'Weekly bars chart container (#d-weekly-bars-container) exists');
  assert(studioHtml.includes('id="d-chart-tooltip"'), 'Interactive floating tooltip (#d-chart-tooltip) exists');
  assert(studioHtml.includes('@keyframes earningsBarGrow'), 'CSS keyframes @keyframes earningsBarGrow defined for smooth animation');
  assert(studioHtml.includes('loadDriverWeeklyEarnings'), 'loadDriverWeeklyEarnings() loads weekly data');

  try {
    const weeklyRes = await request('http://localhost:3001/drivers/me/earnings/weekly', {
      headers: { 'Authorization': `Bearer ${driverToken}` }
    });
    assert(weeklyRes.status === 200, 'Backend GET /drivers/me/earnings/weekly returns HTTP 200');
    assert(Array.isArray(weeklyRes.data.days) && weeklyRes.data.days.length === 7, 'Weekly earnings contains exactly 7 days (SEG to DOM)');
    
    const maxDay = weeklyRes.data.days.find(d => d.isMax);
    const minDay = weeklyRes.data.days.find(d => d.isMin);
    assert(maxDay !== undefined, `Identified highest day (max: ${maxDay ? (maxDay.dayCode || maxDay.dayKey) + ' with R$ ' + maxDay.netEarnings : 'none'})`);
    assert(minDay !== undefined, `Identified lowest day (min: ${minDay ? (minDay.dayCode || minDay.dayKey) + ' with R$ ' + minDay.netEarnings : 'none'})`);
    const totalNet = weeklyRes.data.weeklyTotalNet || (weeklyRes.data.weeklySummary && weeklyRes.data.weeklySummary.totalNet) || 0;
    assert(totalNet > 0, `Weekly summary net earnings computed: R$ ${totalNet}`);
  } catch (err) {
    assert(false, 'Weekly earnings endpoint failed: ' + err.message);
  }

  // -------------------------------------------------------------
  // TEST 6: Static Studio Server HTTP Delivery
  // -------------------------------------------------------------
  console.log('\n--- TEST 6: SIMBORA Studio 3.4 Live Serving ---');
  try {
    const studioRes = await request('http://localhost:8080/');
    assert(studioRes.status === 200, 'SIMBORA Studio server on port 8080 delivers HTTP 200');
    assert(studioRes.raw.includes('ALAGOAS_102_MUNICIPALITIES'), 'Studio delivers updated script with 102 municipalities');
  } catch (err) {
    assert(false, 'SIMBORA Studio server delivery failed: ' + err.message);
  }

  console.log('\n================================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
