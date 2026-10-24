// ============================================================
// SIMBORA 3.0 — Automated Test Suite: Sprint 7
// Painel Administrativo, Auditoria, Métricas e Governança
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

async function runSprint7Tests() {
  console.log('🚀 Running SIMBORA 3.0 — Sprint 7 Test Suite: Painel Admin & Auditoria...\n');

  const randomSuffix = Math.floor(Math.random() * 1000000);
  const password = 'Password@123';

  let adminToken = '';
  let passengerToken = '';

  // 1. Setup Admin and Passenger
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
        name: 'Passageiro Comum',
        email: `pass.audit_${randomSuffix}@simbora.al`,
        password,
        phone: '+5582991119988',
        role: 'passenger',
      }),
    });
    passengerToken = passReg.data.accessToken;
    assert(passReg.ok, 'Cadastro de Passageiro para testes de controle de acesso RBAC');
  }

  // 2. Dashboard Real-Time Metrics
  console.log('\n--- Sub-suite 2: Métricas Executivas do Dashboard (/admin/dashboard) ---');
  {
    const dashRes = await request('/admin/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      dashRes.ok &&
        dashRes.data.totalUsers > 0 &&
        dashRes.data.totalDrivers > 0 &&
        dashRes.data.totalTrips > 0 &&
        typeof dashRes.data.totalRevenue === 'number' &&
        Array.isArray(dashRes.data.recentLogs),
      'Dashboard consolida métricas de usuários, condutores, viagens, faturamento e logs recentes',
      JSON.stringify(dashRes.data),
    );

    // Non-admin blocked
    const unauthDash = await request('/admin/dashboard', {
      headers: { Authorization: `Bearer ${passengerToken}` },
    });
    assert(
      unauthDash.status === 403,
      'Passageiro bloqueado com HTTP 403 ao tentar acessar dashboard gerencial',
    );
  }

  // 3. Security Audit Trail Inspection (/audit/logs)
  console.log('\n--- Sub-suite 3: Trilha de Auditoria e Governança (/audit/logs) ---');
  {
    const logsRes = await request('/audit/logs?limit=20', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      logsRes.ok && Array.isArray(logsRes.data) && logsRes.data.length > 0,
      'Trilha de auditoria cronológica recuperada pelo Administrador',
      `Total de eventos: ${logsRes.data?.length}`,
    );

    const hasCriticalActions = logsRes.data.some(
      (log) =>
        log.action.includes('PAYMENT') ||
        log.action.includes('TRIP') ||
        log.action.includes('STATUS') ||
        log.action.includes('SOS'),
    );
    assert(
      hasCriticalActions,
      'Eventos críticos operacionais (Pagamentos, Corridas, Status e SOS) gravados na trilha de auditoria',
    );

    // Non-admin blocked from logs
    const unauthLogs = await request('/audit/logs', {
      headers: { Authorization: `Bearer ${passengerToken}` },
    });
    assert(
      unauthLogs.status === 403,
      'Passageiro bloqueado com HTTP 403 ao tentar inspecionar logs de auditoria do sistema',
    );
  }

  // 4. Fleet and Operational Administration (RBAC Checks)
  console.log('\n--- Sub-suite 4: Gestão Global da Frota e Isolamento de Funções ---');
  {
    // List users
    const usersRes = await request('/users', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(usersRes.ok && Array.isArray(usersRes.data), 'Administrador lista base completa de usuários');

    // List drivers
    const driversRes = await request('/drivers', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(driversRes.ok && Array.isArray(driversRes.data), 'Administrador lista frota completa de motoristas');

    // List vehicles
    const vehiclesRes = await request('/vehicles', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(vehiclesRes.ok && Array.isArray(vehiclesRes.data), 'Administrador lista veículos cadastrados para vistoria');

    // List trips
    const tripsRes = await request('/trips', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(tripsRes.ok && Array.isArray(tripsRes.data), 'Administrador lista histórico global de viagens e despacho');

    // Non-admin blocked across all management endpoints
    const unauthUsers = await request('/users', {
      headers: { Authorization: `Bearer ${passengerToken}` },
    });
    const unauthVehicles = await request('/vehicles', {
      headers: { Authorization: `Bearer ${passengerToken}` },
    });
    const unauthTrips = await request('/trips', {
      headers: { Authorization: `Bearer ${passengerToken}` },
    });

    assert(
      unauthUsers.status === 403 && unauthVehicles.status === 403 && unauthTrips.status === 403,
      'Passageiro bloqueado com HTTP 403 em todas as rotas administrativas restritas (/users, /vehicles, /trips)',
    );
  }

  // Summary
  console.log('\n============================================================');
  console.log(`📊 RESULTADO SPRINT 7: ${passedTests} PASSOU | ${failedTests} FALHOU`);
  console.log('============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSprint7Tests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
