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
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function put(urlStr, data, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const postData = JSON.stringify(data);
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('--- 1. Authenticating Mariana & Carlos ---');
  const passLogin = await post('http://localhost:3001/auth/login', {
    identifier: 'mariana@example.com',
    password: 'Password@123'
  });
  console.log('Mariana Login:', passLogin.status, passLogin.data.accessToken ? 'OK' : passLogin.data);
  const passToken = passLogin.data.accessToken;

  const drvLogin = await post('http://localhost:3001/auth/login', {
    identifier: 'carlos.motorista@mobility.com',
    password: 'Password@123'
  });
  console.log('Carlos Login:', drvLogin.status, drvLogin.data.accessToken ? 'OK' : drvLogin.data);
  const drvToken = drvLogin.data.accessToken;

  console.log('--- 2. Requesting Trip (Piaçabuçu -> Penedo) ---');
  const tripReq = await post('http://localhost:3001/trips', {
    originLat: -10.4056,
    originLng: -36.4344,
    originAddress: 'Praça São Francisco, Piaçabuçu - AL',
    destLat: -10.2897,
    destLng: -36.5822,
    destAddress: 'Centro Histórico, Penedo - AL',
    category: 'comfort'
  }, passToken);
  console.log('Trip Request:', tripReq.status, tripReq.data.data?.id, 'Status:', tripReq.data.data?.status);
  const tripId = tripReq.data.data?.id;

  if (!tripId) {
    console.error('Failed to create trip:', tripReq.data);
    return;
  }

  console.log('--- 3. Carlos Accepts Trip ---');
  const acceptRes = await post(`http://localhost:3001/trips/${tripId}/accept`, {}, drvToken);
  console.log('Carlos Accept:', acceptRes.status, acceptRes.data);

  if (acceptRes.status !== 201 && acceptRes.status !== 200) {
    console.error('Carlos accept failed!');
    return;
  }

  console.log('--- 4. Driver Arrived At Pickup ---');
  const arrivedRes = await put(`http://localhost:3001/trips/${tripId}/status`, {
    status: 'driver_arrived'
  }, drvToken);
  console.log('Arrived status:', arrivedRes.status, arrivedRes.data.data?.status);

  console.log('--- 5. Start Trip with PIN ---');
  const startRes = await put(`http://localhost:3001/trips/${tripId}/status`, {
    status: 'in_progress',
    pinCode: '4821'
  }, drvToken);
  console.log('Start status:', startRes.status, startRes.data.data?.status);

  console.log('--- 6. Complete Trip ---');
  const completeRes = await put(`http://localhost:3001/trips/${tripId}/status`, {
    status: 'completed'
  }, drvToken);
  console.log('Complete status:', completeRes.status, completeRes.data.data?.status);

  console.log('--- 7. Rate Trip 5 Stars ---');
  const rateRes = await post(`http://localhost:3001/trips/${tripId}/rate`, {
    rating: 5,
    review: 'Excelente viagem de Piaçabuçu a Penedo!'
  }, passToken);
  console.log('Rate status:', rateRes.status, rateRes.data.data?.rating);

  console.log('✅ End-to-end API lifecycle test completed successfully!');
}

run().catch(console.error);
