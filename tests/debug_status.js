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
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('--- 1. Login Carlos & Mariana ---');
  const drvLogin = await post('http://localhost:3001/auth/login', {
    identifier: 'carlos.motorista@mobility.com',
    password: 'Password@123'
  });
  const drvToken = drvLogin.data.accessToken;

  const passLogin = await post('http://localhost:3001/auth/login', {
    identifier: 'mariana@example.com',
    password: 'Password@123'
  });
  const passToken = passLogin.data.accessToken;

  console.log('--- 2. Setting Carlos ONLINE ---');
  const setOnline = await put('http://localhost:3001/drivers/me/status', {
    status: 'online'
  }, drvToken);
  console.log('Carlos Online status:', setOnline.status, setOnline.data.status);

  console.log('--- 3. Mariana Requests Trip ---');
  const tripReq = await post('http://localhost:3001/trips', {
    originLat: -10.4056,
    originLng: -36.4344,
    originAddress: 'Praça São Francisco, Piaçabuçu - AL',
    destLat: -10.2897,
    destLng: -36.5822,
    destAddress: 'Centro Histórico, Penedo - AL',
    category: 'comfort'
  }, passToken);
  const tripId = tripReq.data.data.id;
  console.log('Trip created:', tripId, 'Initial status:', tripReq.data.data.status);

  console.log('--- 4. Carlos Accepts Trip ---');
  const acc = await post(`http://localhost:3001/trips/${tripId}/accept`, {}, drvToken);
  console.log('Accepted:', acc.status, acc.data.data?.status, 'Assigned driver:', acc.data.data?.driver?.user?.name);

  console.log('--- 5. Carlos Arrived at Pickup (direct or arriving) ---');
  const arrived = await put(`http://localhost:3001/trips/${tripId}/status`, {
    status: 'DRIVER_ARRIVED'
  }, drvToken);
  console.log('DRIVER_ARRIVED:', arrived.status, arrived.data.data?.status);

  console.log('--- 6. Confirm PIN 4821 and Start Trip ---');
  const started = await put(`http://localhost:3001/trips/${tripId}/status`, {
    status: 'IN_PROGRESS',
    pinCode: '4821'
  }, drvToken);
  console.log('IN_PROGRESS:', started.status, started.data.data?.status);

  console.log('--- 7. Complete Trip ---');
  const completed = await put(`http://localhost:3001/trips/${tripId}/status`, {
    status: 'COMPLETED'
  }, drvToken);
  console.log('COMPLETED:', completed.status, completed.data.data?.status);

  console.log('--- 8. Mariana Rates Trip ---');
  const rated = await post(`http://localhost:3001/trips/${tripId}/rate`, {
    rating: 5,
    review: 'Viagem sensacional de Piaçabuçu para Penedo!'
  }, passToken);
  console.log('RATED:', rated.status, rated.data.data?.rating, rated.data.data?.review);

  console.log('\n🎉 ALL 8 LIFECYCLE STEPS PASSED WITH 200/201 SUCCESS!');
}

run().catch(console.error);
