const http = require('http');

function post(urlStr, data, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const postData = JSON.stringify(data);
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function testConcurrency() {
  const drv1Login = await post('http://localhost:3001/auth/login', {
    identifier: 'carlos.motorista@mobility.com',
    password: 'Password@123'
  });
  const drv2Login = await post('http://localhost:3001/auth/login', {
    identifier: 'admin@mobility.com',
    password: 'Password@123'
  });
  const passLogin = await post('http://localhost:3001/auth/login', {
    identifier: 'mariana@example.com',
    password: 'Password@123'
  });

  // Ensure Carlos is online
  await fetch('http://localhost:3001/drivers/me/status', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${drv1Login.data.accessToken}` },
    body: JSON.stringify({ status: 'online' })
  });

  // Create trip
  const tripReq = await post('http://localhost:3001/trips', {
    originLat: -10.4056,
    originLng: -36.4344,
    originAddress: 'Praça São Francisco, Piaçabuçu - AL',
    destLat: -10.2897,
    destLng: -36.5822,
    destAddress: 'Centro Histórico, Penedo - AL',
    category: 'comfort'
  }, passLogin.data.accessToken);

  const tripId = tripReq.data.data.id;

  // Carlos accepts first
  const acc1 = await post(`http://localhost:3001/trips/${tripId}/accept`, {}, drv1Login.data.accessToken);
  console.log('Driver 1 Accept:', acc1.status, acc1.data.data?.status);

  // Driver 2 attempts to accept same trip
  const acc2 = await post(`http://localhost:3001/trips/${tripId}/accept`, { driverId: '151dde87-83bc-4202-a936-72af691bb167' }, drv2Login.data.accessToken);
  console.log('Driver 2 Conflict Response:', acc2.status, acc2.data.message);

  if (acc2.status === 400 && acc2.data.message.includes('já atribuída')) {
    console.log('✅ Concurrency check passed: Second driver received clear error message.');
  } else {
    console.error('❌ Concurrency check failed:', acc2);
  }
}

testConcurrency().catch(console.error);
