const assert = require('assert');
const http = require('http');

console.log('======================================================================');
console.log('🧪 SUÍTE DE TESTES: SPRINT 1 — AUTENTICAÇÃO, CADASTRO, PERFIS E LUGARES SALVOS');
console.log('======================================================================\n');

let passed = 0;
let failed = 0;

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = body ? JSON.parse(body) : null;
        } catch (e) {
          parsed = body;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTest(name, fn) {
  try {
    await fn();
    console.log(`✅ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}\n   Erro: ${err.message}`);
    failed++;
  }
}

async function main() {
  const timestamp = Date.now();
  const passengerEmail = `passageiro_${timestamp}@simbora.al`;
  const driverEmail = `motorista_${timestamp}@simbora.al`;
  const testPassword = 'SenhaForte123!';
  let passengerToken = '';
  let driverToken = '';
  let savedPlaceId = '';
  let resetToken = '';

  // 1. Termos e Condições
  await runTest('1. GET /auth/terms deve retornar termos oficiais do SIMBORA Alagoas', async () => {
    const res = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/auth/terms',
      method: 'GET',
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.title.includes('Termos e Condições'));
    assert.strictEqual(res.body.version, '3.0.0');
    assert.ok(res.body.sections.length >= 4);
  });

  // 2. Política de Privacidade LGPD
  await runTest('2. GET /auth/privacy deve retornar diretrizes de privacidade LGPD', async () => {
    const res = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/auth/privacy',
      method: 'GET',
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.title.includes('LGPD'));
    assert.strictEqual(res.body.dpoContact, 'dpo@simbora.app.br');
  });

  // 3. Cadastro de Passageiro
  await runTest('3. POST /auth/register deve cadastrar passageiro com sucesso', async () => {
    const res = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Clara Maria Ribeiro',
        email: passengerEmail,
        password: testPassword,
        phone: '82999887766',
        role: 'passenger',
      },
    );
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.accessToken, 'Token JWT ausente');
    assert.strictEqual(res.body.user.email, passengerEmail);
    assert.strictEqual(res.body.user.role, 'passenger');
    passengerToken = res.body.accessToken;
  });

  // 4. Bloqueio de Escalada de Privilégios (Anti-Privilege Escalation)
  await runTest('4. POST /auth/register não deve permitir auto-atribuição de role "admin"', async () => {
    const maliciousEmail = `hacker_${timestamp}@simbora.al`;
    const res = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Tentativa Invasor',
        email: maliciousEmail,
        password: testPassword,
        phone: '82911112222',
        role: 'admin',
      },
    );
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.user.role, 'passenger', 'Role não foi forçada para passenger!');
  });

  // 5. Cadastro de Motorista com criação de perfil pendente
  await runTest('5. POST /auth/register deve registrar motorista com perfil pendente de aprovação', async () => {
    const res = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Marcos Vinicius Santos',
        email: driverEmail,
        password: testPassword,
        phone: '82988776655',
        role: 'driver',
        licenseNumber: 'AL-9876543210',
      },
    );
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.accessToken);
    assert.strictEqual(res.body.user.role, 'driver');
    assert.ok(res.body.driver, 'Perfil de motorista não retornado');
    assert.strictEqual(res.body.driver.approvalStatus, 'pending');
    driverToken = res.body.accessToken;
  });

  // 6. Login com credenciais válidas e verificação de JWT
  await runTest('6. POST /auth/login deve autenticar com email/telefone e senha', async () => {
    const res = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        email: passengerEmail,
        password: testPassword,
      },
    );
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.accessToken);
    assert.strictEqual(res.body.user.email, passengerEmail);
  });

  // 7. Envio e Validação de OTP
  await runTest('7. POST /auth/send-otp e /auth/verify-otp devem validar o telefone do usuário', async () => {
    const sendRes = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/auth/send-otp',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { identifier: passengerEmail },
    );
    assert.strictEqual(sendRes.status, 200);
    assert.ok(sendRes.body.code, 'Código OTP não retornado no ambiente de teste');

    const verifyRes = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/auth/verify-otp',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { identifier: passengerEmail, code: sendRes.body.code },
    );
    assert.strictEqual(verifyRes.status, 200);
    assert.strictEqual(verifyRes.body.verified, true);
  });

  // 8. Recuperação de Senha (Forgot & Reset Password)
  await runTest('8. POST /auth/forgot-password e /auth/reset-password devem redefinir a senha com segurança', async () => {
    const forgotRes = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/auth/forgot-password',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: passengerEmail },
    );
    assert.strictEqual(forgotRes.status, 200);
    assert.ok(forgotRes.body.resetToken, 'Token de recuperação ausente');
    resetToken = forgotRes.body.resetToken;

    const newPass = 'NovaSenhaSegura456!';
    const resetRes = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/auth/reset-password',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { token: resetToken, newPassword: newPass },
    );
    assert.strictEqual(resetRes.status, 200);
    assert.ok(resetRes.body.message.includes('sucesso'));

    // Testa login com a nova senha
    const loginRes = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: passengerEmail, password: newPass },
    );
    assert.strictEqual(loginRes.status, 200);
    passengerToken = loginRes.body.accessToken; // Atualiza token para os testes seguintes
  });

  // 9. Consulta do Próprio Perfil (GET /users/me)
  await runTest('9. GET /users/me deve retornar dados completos e telefone verificado', async () => {
    const res = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/users/me',
      method: 'GET',
      headers: { Authorization: `Bearer ${passengerToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.email, passengerEmail);
    assert.strictEqual(res.body.phoneVerified, true);
    assert.strictEqual(res.body.password, undefined, 'Hash de senha não pode ser vazado');
  });

  // 10. Atualização de Perfil e Preferências (PATCH /users/me)
  await runTest('10. PATCH /users/me deve atualizar preferências e dados cadastrais', async () => {
    const preferences = {
      preferredCategory: 'comfort',
      accessibilityNotes: 'Espaço no porta-malas para bagagem',
      shareTripEmergency: true,
    };
    const res = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/users/me',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${passengerToken}`,
        },
      },
      {
        name: 'Clara Maria Ribeiro de Penedo',
        preferences: preferences,
      },
    );
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.name, 'Clara Maria Ribeiro de Penedo');
    assert.ok(res.body.preferences.includes('comfort'));
  });

  // 11. Cadastro e Consulta de Endereços Salvos (Minha Conta)
  await runTest('11. POST e GET /users/me/places deve gerenciar lugares salvos (Casa, Trabalho)', async () => {
    const createRes = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/users/me/places',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${passengerToken}`,
        },
      },
      {
        label: 'Casa',
        address: 'Rua São Vicente, 45 - Centro Histórico, Penedo - AL',
        lat: -10.2897,
        lng: -36.5864,
      },
    );
    assert.strictEqual(createRes.status, 201);
    assert.strictEqual(createRes.body.label, 'Casa');
    assert.ok(createRes.body.id);
    savedPlaceId = createRes.body.id;

    // Listar lugares
    const listRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/users/me/places',
      method: 'GET',
      headers: { Authorization: `Bearer ${passengerToken}` },
    });
    assert.strictEqual(listRes.status, 200);
    assert.ok(Array.isArray(listRes.body));
    assert.ok(listRes.body.some((p) => p.id === savedPlaceId));
  });

  // 12. Exclusão de Endereço Salvo
  await runTest('12. DELETE /users/me/places/:id deve remover endereço salvo com controle de posse', async () => {
    const deleteRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: `/users/me/places/${savedPlaceId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${passengerToken}` },
    });
    assert.strictEqual(deleteRes.status, 200);
    assert.strictEqual(deleteRes.body.success, true);

    // Confirma que não está mais listado
    const listRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/users/me/places',
      method: 'GET',
      headers: { Authorization: `Bearer ${passengerToken}` },
    });
    assert.strictEqual(listRes.body.some((p) => p.id === savedPlaceId), false);
  });

  // 13. Alteração Direta de Senha Autenticada (PUT /users/me/password)
  await runTest('13. PUT /users/me/password deve validar senha atual e persistir nova senha', async () => {
    const res = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/users/me/password',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${passengerToken}`,
        },
      },
      {
        currentPassword: 'NovaSenhaSegura456!',
        newPassword: 'SenhaDefinitiva789!',
      },
    );
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });

  // 14. Desativação / Exclusão de Conta (DELETE /users/me)
  await runTest('14. DELETE /users/me deve desativar a conta e bloquear logins subsequentes', async () => {
    const delRes = await request({
      hostname: 'localhost',
      port: 3001,
      path: '/users/me',
      method: 'DELETE',
      headers: { Authorization: `Bearer ${passengerToken}` },
    });
    assert.strictEqual(delRes.status, 200);
    assert.strictEqual(delRes.body.success, true);

    // Tentar logar com a conta desativada deve falhar (401)
    const loginFailRes = await request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        email: passengerEmail,
        password: 'SenhaDefinitiva789!',
      },
    );
    assert.strictEqual(loginFailRes.status, 401);
    assert.ok(loginFailRes.body.message.includes('desativada'));
  });

  console.log('\n======================================================================');
  console.log(`RESULTADO FINAL SPRINT 1: ${passed} PASSOU | ${failed} FALHOU`);
  console.log('======================================================================\n');

  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
