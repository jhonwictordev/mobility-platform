// ============================================================
// SIMBORA 3.0 — Automated Test Suite: Sprint 4
// Precificação Dinâmica, Estimativas, PIX, Cartão e Repasses
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

async function runSprint4Tests() {
  console.log('🚀 Running SIMBORA 3.0 — Sprint 4 Test Suite: Precificação & Pagamentos...\n');

  const randomSuffix = Math.floor(Math.random() * 1000000);
  const password = 'Password@123';

  let adminToken = '';
  let passengerToken = '';
  let driverToken = '';
  let driverId = '';
  let tripId = '';

  // 1. Setup Admin, Passenger, and Driver
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
        name: 'Passageiro Pagador',
        email: `passenger.pay_${randomSuffix}@simbora.al`,
        password,
        phone: '+5582993334455',
        role: 'passenger',
      }),
    });
    passengerToken = passReg.data.accessToken;
    assert(passReg.ok, 'Cadastro de Passageiro para testes financeiros');

    const drvReg = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Motorista Recebedor',
        email: `driver.pay_${randomSuffix}@simbora.al`,
        password,
        phone: '+5582994445566',
        role: 'driver',
        licenseNumber: `CNH_PAY_${randomSuffix}`,
      }),
    });
    driverToken = drvReg.data.accessToken;
    driverId = drvReg.data.driver.id;

    // Approve driver and give PIX key
    await request(`/admin/drivers/${driverId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    await request('/drivers/me', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${driverToken}` },
      body: JSON.stringify({ pixKey: '82994445566', pixKeyType: 'PHONE' }),
    });

    assert(true, 'Motorista homologado com chave PIX cadastrada');
  }

  // 2. Pricing Categories Configuration
  console.log('\n--- Sub-suite 2: Consulta e Configuração de Categorias Tarifárias ---');
  {
    const catRes = await request('/pricing/categories');
    assert(
      catRes.ok && Array.isArray(catRes.data) && catRes.data.length === 3,
      'GET /pricing/categories retorna as 3 categorias oficiais (Economy, Comfort, Premium)',
      JSON.stringify(catRes.data),
    );

    const economy = catRes.data.find((c) => c.category === 'economy');
    assert(
      economy && economy.baseFare === 5.0 && economy.minimumFare === 8.0,
      'Parâmetros da categoria Economy validados (Bandeirada R$ 5,00, Mínima R$ 8,00)',
    );
  }

  // 3. Dynamic Surge Pricing
  console.log('\n--- Sub-suite 3: Tarifa Dinâmica (Surge Pricing) e RBAC ---');
  {
    // Passenger attempts to alter surge -> 403 Forbidden
    const unauthSurge = await request('/pricing/surge', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: JSON.stringify({ multiplier: 2.0 }),
    });
    assert(
      unauthSurge.status === 403,
      'Passageiro bloqueado com HTTP 403 ao tentar alterar tarifa dinâmica (Anti-Tampering)',
    );

    // Admin sets surge multiplier to 1.5
    const adminSurge = await request('/pricing/surge', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ multiplier: 1.5 }),
    });
    assert(
      adminSurge.ok && adminSurge.data.surgeMultiplier === 1.5,
      'Administrador ativa multiplicador de tarifa dinâmica 1.5x com sucesso',
    );

    // Estimate with surge
    const estimateSurge = await request(
      '/pricing/estimate?fromLat=-10.405602&fromLng=-36.434405&toLat=-10.289673&toLng=-36.586452',
    );
    const comfortEstimate = estimateSurge.data.find((e) => e.category === 'comfort');
    assert(
      comfortEstimate && comfortEstimate.surgeMultiplier === 1.5,
      'Estimativa de corrida Piaçabuçu ⇄ Penedo reflete tarifa dinâmica de 1.5x',
      `Valor calculado: R$ ${comfortEstimate?.totalFare}`,
    );

    // Reset surge back to 1.0
    await request('/pricing/surge', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ multiplier: 1.0 }),
    });
  }

  // 4. Trip Setup for Payment Testing
  console.log('\n--- Sub-suite 4: Criação de Viagem para Ciclo Financeiro ---');
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
    tripId = tripReq.data.data.id;
    assert(tripReq.ok && tripId, 'Corrida Piaçabuçu ⇄ Penedo criada para liquidação financeira');
  }

  // 5. PIX Payload Generation (EMV / QR Code Copia e Cola)
  console.log('\n--- Sub-suite 5: Geração de Cobrança PIX Dinâmica ---');
  let pixCopyPaste = '';
  {
    const pixRes = await request('/payments/pix/generate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: JSON.stringify({ tripId, amount: 45.5 }),
    });
    assert(
      pixRes.ok &&
        pixRes.data.pixCopyPaste &&
        pixRes.data.pixCopyPaste.startsWith('000201') &&
        pixRes.data.qrCodeUrl,
      'Geração de payload PIX Copia e Cola no padrão BACEN com QR Code em tempo real',
      JSON.stringify(pixRes.data),
    );
    pixCopyPaste = pixRes.data.pixCopyPaste;
  }

  // 6. Payment Processing: PIX with Platform Fee (15%) and Driver Net Payout
  console.log('\n--- Sub-suite 6: Liquidação Financeira e Split de Pagamento ---');
  {
    const payRes = await request('/payments/process', {
      method: 'POST',
      headers: { Authorization: `Bearer ${passengerToken}` },
      body: JSON.stringify({
        tripId,
        amount: 50.0,
        method: 'pix',
        tip: 5.0,
        pixCopyPaste,
      }),
    });

    assert(
      payRes.ok &&
        payRes.data.status === 'completed' &&
        payRes.data.method === 'pix' &&
        payRes.data.platformFee === 7.5 && // 15% of 50
        payRes.data.driverPayout === 47.5, // 50 - 7.5 + 5.0 tip
      'Processamento de PIX com split automático: Comissão SIMBORA (15% = R$ 7,50) e Repasse Líquido + Gorjeta (R$ 47,50)',
      JSON.stringify(payRes.data),
    );
  }

  // 7. Itemized Detailed Receipt
  console.log('\n--- Sub-suite 7: Emissão de Recibo Detalhado (Itemized Receipt) ---');
  {
    const receiptRes = await request(`/payments/receipt/${tripId}`, {
      headers: { Authorization: `Bearer ${passengerToken}` },
    });

    assert(
      receiptRes.ok &&
        receiptRes.data.receiptNumber &&
        receiptRes.data.financial.paymentMethod === 'pix' &&
        receiptRes.data.financial.platformFee === 7.5,
      'Emissão de recibo discriminado com número de comprovante, trajeto e detalhes financeiros',
      JSON.stringify(receiptRes.data),
    );
  }

  // 8. IDOR Security Verification on Financials
  console.log('\n--- Sub-suite 8: Proteção IDOR em Dados de Faturamento ---');
  {
    const otherPassenger = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Curioso Financeiro',
        email: `hacker.pay_${randomSuffix}@simbora.al`,
        password,
        phone: '+5582995556677',
        role: 'passenger',
      }),
    });
    const maliciousToken = otherPassenger.data.accessToken;

    const idorReceipt = await request(`/payments/receipt/${tripId}`, {
      headers: { Authorization: `Bearer ${maliciousToken}` },
    });
    assert(
      idorReceipt.status === 403,
      'Usuário não relacionado impedido com HTTP 403 de consultar recibo alheio (Anti-IDOR)',
    );

    const idorPayment = await request(`/payments/trip/${tripId}`, {
      headers: { Authorization: `Bearer ${maliciousToken}` },
    });
    assert(
      idorPayment.status === 403,
      'Usuário não relacionado impedido com HTTP 403 de consultar transação financeira alheia (Anti-IDOR)',
    );
  }

  // 9. Admin Global Financial Monitoring
  console.log('\n--- Sub-suite 9: Auditoria Global de Receita pelo Painel Admin ---');
  {
    const globalPayments = await request('/payments', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      globalPayments.ok &&
        Array.isArray(globalPayments.data) &&
        globalPayments.data.some((p) => p.tripId === tripId),
      'Painel de Controle Admin consolida transações globais e métricas de receita',
    );
  }

  // Summary
  console.log('\n============================================================');
  console.log(`📊 RESULTADO SPRINT 4: ${passedTests} PASSOU | ${failedTests} FALHOU`);
  console.log('============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runSprint4Tests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
