// ============================================================
// SIMBORA 3.0 — Automated Test Suite: Sprint 2
// Motoristas, Veículos, Documentos, Aprovação e Homologação
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

async function runSprint2Tests() {
  console.log('🚀 Running SIMBORA 3.0 — Sprint 2 Test Suite: Motoristas & Veículos...\n');

  const randomSuffix = Math.floor(Math.random() * 100000);
  const driverEmail = `motorista.sprint2_${randomSuffix}@simbora.al`;
  const passengerEmail = `passageiro.sprint2_${randomSuffix}@simbora.al`;
  const password = 'Password@123';

  let driverToken = '';
  let driverUserId = '';
  let driverId = '';

  let passengerToken = '';
  let passengerUserId = '';

  let adminToken = '';

  let vehicleId = '';
  let cnhDocId = '';
  let crlvDocId = '';

  // 1. Setup Admin Token
  console.log('--- Sub-suite 1: Autenticação de Atores ---');
  {
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier: 'admin@mobility.com', password: 'Password@123' }),
    });

    if (adminLogin.ok) {
      adminToken = adminLogin.data.accessToken;
      assert(true, 'Login do Administrador SIMBORA realizado com sucesso');
    } else {
      assert(false, 'Falha no login administrativo', JSON.stringify(adminLogin.data));
    }
  }

  // 2. Register Passenger (for IDOR testing)
  {
    const passReg = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Passageiro Teste IDOR',
        email: passengerEmail,
        password,
        role: 'passenger',
        phone: '+5582999990001',
      }),
    });
    passengerToken = passReg.data.accessToken;
    passengerUserId = passReg.data.user.id;
    assert(passReg.ok, 'Registro de Passageiro para testes de isolamento e IDOR');
  }

  // 3. Register Driver
  console.log('\n--- Sub-suite 2: Cadastro e Perfil do Motorista Parceiro ---');
  {
    const drvReg = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Cláudio Motorista Alagoas',
        email: driverEmail,
        password,
        role: 'driver',
        phone: '+5582998887766',
        licenseNumber: 'AL-1234567890',
        cnhCategory: 'B',
      }),
    });
    assert(drvReg.ok && drvReg.data.driver, 'Cadastro de motorista com CNH e status PENDING inicial');
    driverToken = drvReg.data.accessToken;
    driverUserId = drvReg.data.user.id;
    driverId = drvReg.data.driver.id;

    assert(
      drvReg.data.driver.approvalStatus === 'pending',
      'Novo motorista inicia obrigatoriamente com approvalStatus = pending',
      `Obtido: ${drvReg.data.driver.approvalStatus}`,
    );
  }

  // 4. Verification: Driver cannot switch to ONLINE while PENDING
  console.log('\n--- Sub-suite 3: Bloqueio de Operação sem Homologação ---');
  {
    const onlineAttempt = await request(`/drivers/${driverId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: JSON.stringify({ status: 'online' }),
    });
    assert(
      onlineAttempt.status === 403,
      'Motorista NÃO homologado é impedido com HTTP 403 ao tentar ficar ONLINE',
      `Status HTTP: ${onlineAttempt.status}`,
    );
  }

  // 5. Update Driver Profile (PIX and CNH details)
  console.log('\n--- Sub-suite 4: Configuração de Repasse Financeiro (PIX) & CNH ---');
  {
    const updateRes = await request('/drivers/me', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: JSON.stringify({
        pixKey: '82998887766',
        pixKeyType: 'PHONE',
        cnhCategory: 'AB',
      }),
    });
    assert(
      updateRes.ok && updateRes.data.pixKey === '82998887766' && updateRes.data.cnhCategory === 'AB',
      'Motorista atualiza chave PIX de repasse e categoria de CNH via PATCH /drivers/me',
      JSON.stringify(updateRes.data),
    );
  }

  // 6. Vehicle Registration
  console.log('\n--- Sub-suite 5: Cadastro e Vistoria de Veículo ---');
  {
    const vehicleRes = await request('/vehicles', {
      method: 'POST',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: JSON.stringify({
        make: 'Toyota',
        model: 'Corolla Sedan',
        year: 2023,
        color: 'Prata Metálico',
        plateNumber: `SIM${randomSuffix.toString().slice(0, 4)}`,
        renavam: '12345678901',
        category: 'comfort',
        seats: 4,
      }),
    });
    assert(
      vehicleRes.ok && vehicleRes.data.id && vehicleRes.data.approved === false,
      'Veículo cadastrado pelo motorista inicia com approved = false (aguardando vistoria)',
      JSON.stringify(vehicleRes.data),
    );
    vehicleId = vehicleRes.data.id;

    // Driver queries their own vehicles
    const myVehicles = await request('/vehicles/my', {
      headers: { Authorization: `Bearer ${driverToken}` },
    });
    assert(
      myVehicles.ok && Array.isArray(myVehicles.data) && myVehicles.data.some((v) => v.id === vehicleId),
      'Motorista lista com sucesso seus veículos registrados via GET /vehicles/my',
    );
  }

  // 7. Documents Upload (CNH and CRLV)
  console.log('\n--- Sub-suite 6: Upload e Gestão de Documentos Probatórios ---');
  {
    const cnhUpload = await request('/documents', {
      method: 'POST',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: JSON.stringify({
        driverId,
        type: 'drivers_license',
        fileUrl: `https://storage.simbora.al/docs/${driverId}/cnh_ear.pdf`,
      }),
    });
    assert(cnhUpload.ok && cnhUpload.data.status === 'pending', 'Upload de CNH com EAR com status inicial PENDING');
    cnhDocId = cnhUpload.data.id;

    const crlvUpload = await request('/documents', {
      method: 'POST',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: JSON.stringify({
        driverId,
        type: 'vehicle_registration',
        fileUrl: `https://storage.simbora.al/docs/${driverId}/crlv_2024.pdf`,
      }),
    });
    assert(crlvUpload.ok && crlvUpload.data.status === 'pending', 'Upload de CRLV do automóvel com status inicial PENDING');
    crlvDocId = crlvUpload.data.id;

    // List driver documents
    const docList = await request(`/documents/driver/${driverId}`, {
      headers: { Authorization: `Bearer ${driverToken}` },
    });
    assert(
      docList.ok && docList.data.length >= 2,
      'Motorista consulta seus documentos enviados via GET /documents/driver/:id',
    );
  }

  // 8. IDOR & Authorization Tests
  console.log('\n--- Sub-suite 7: Proteção IDOR e Isolamento de Documentos ---');
  {
    // Passenger trying to upload doc for driver
    const idorUpload = await request('/documents', {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: JSON.stringify({
        driverId,
        type: 'drivers_license',
        fileUrl: 'https://attacker.com/malicious.pdf',
      }),
    });
    assert(
      idorUpload.status === 403,
      'Tentativa de upload de documento em conta de outro motorista bloqueada com HTTP 403 (Anti-IDOR)',
      `Status HTTP: ${idorUpload.status}`,
    );

    // Passenger trying to view driver documents
    const idorRead = await request(`/documents/driver/${driverId}`, {
      headers: { Authorization: `Bearer ${passengerToken}` },
    });
    assert(
      idorRead.status === 403,
      'Tentativa de consulta indevida de documentos protegidos bloqueada com HTTP 403 (Anti-IDOR)',
      `Status HTTP: ${idorRead.status}`,
    );
  }

  // 9. Admin Review and Approvals
  console.log('\n--- Sub-suite 8: Homologação Administrativa de Documentos e Frota ---');
  {
    // Admin approves CNH
    const reviewCnh = await request(`/documents/${cnhDocId}/review`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        status: 'approved',
        reviewNotes: 'CNH com EAR verificada no Detran/AL',
      }),
    });
    assert(
      reviewCnh.ok && reviewCnh.data.status === 'approved',
      'Administrador aprova CNH com parecer técnico de vistoria',
    );

    // Admin approves vehicle with inspection notes
    const reviewVehicle = await request(`/vehicles/${vehicleId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        approved: true,
        notes: 'Vistoria presencial aprovada: pneus novos, ar condicionado e cinto de segurança OK',
      }),
    });
    assert(
      reviewVehicle.ok && reviewVehicle.data.approved === true,
      'Administrador homologa veículo com nota de vistoria técnica',
    );

    // Admin sets vehicle category
    const updateCategory = await request(`/vehicles/${vehicleId}/category`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ category: 'comfort' }),
    });
    assert(
      updateCategory.ok && updateCategory.data.category === 'comfort',
      'Administrador enquadra veículo na categoria oficial SIMBORA COMFORT',
    );

    // Admin approves Driver account
    const approveDriver = await request(`/admin/drivers/${driverId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      approveDriver.ok && approveDriver.data.approvalStatus === 'approved',
      'Administrador concede homologação integral da conta do motorista',
    );
  }

  // 10. Privacy & LGPD: Sanitized Public Profile Check
  console.log('\n--- Sub-suite 9: Privacidade LGPD e Sanitização de Perfil Público ---');
  {
    const publicProfile = await request(`/drivers/${driverId}/public`, {
      headers: { Authorization: `Bearer ${passengerToken}` },
    });

    const isSanitized =
      publicProfile.ok &&
      publicProfile.data.name !== undefined &&
      publicProfile.data.licenseNumber === undefined &&
      publicProfile.data.pixKey === undefined &&
      publicProfile.data.rejectionReason === undefined;

    assert(
      isSanitized,
      'Perfil público (/drivers/:id/public) expõe nome e veículo, mas omite CNH, CPF e chave PIX (LGPD Compliance)',
      JSON.stringify(publicProfile.data),
    );
  }

  // 11. Driver Goes Online & Appears in Online Drivers List
  console.log('\n--- Sub-suite 10: Ativação Operacional e Presença Online ---');
  {
    const onlineRes = await request(`/drivers/${driverId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: JSON.stringify({ status: 'online' }),
    });
    assert(
      onlineRes.ok && onlineRes.data.status === 'online',
      'Motorista homologado altera status com sucesso para ONLINE',
      JSON.stringify(onlineRes.data),
    );

    const onlineList = await request('/drivers/online', {
      headers: { Authorization: `Bearer ${driverToken}` },
    });
    assert(
      onlineList.ok && Array.isArray(onlineList.data) && onlineList.data.some((d) => d.id === driverId),
      'Motorista ativo aparece imediatamente na lista pública de despacho /drivers/online',
    );
  }

  // 12. Suspension / Rejection with Reason
  console.log('\n--- Sub-suite 11: Suspensão Administrativa com Justificativa ---');
  {
    const rejectRes = await request(`/admin/drivers/${driverId}/reject`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ reason: 'Reclamação grave de conduta em Penedo' }),
    });
    assert(
      rejectRes.ok && rejectRes.data.approvalStatus === 'rejected' && rejectRes.data.rejectionReason.includes('Penedo'),
      'Administrador suspende/rejeita motorista gravando justificativa formal',
    );

    // Blocked from online again
    const onlineAfterReject = await request(`/drivers/${driverId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: JSON.stringify({ status: 'online' }),
    });
    assert(
      onlineAfterReject.status === 403,
      'Motorista suspenso é imediatamente impedido de operar na plataforma (HTTP 403)',
    );
  }

  // Summary
  console.log('\n============================================================');
  console.log(`📊 RESULTADO SPRINT 2: ${passedTests} PASSOU | ${failedTests} FALHOU`);
  console.log('============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSprint2Tests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
