const http = require('http');

function checkUrl(url, matches) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let ok = res.statusCode === 200;
        let missing = [];
        matches.forEach(m => {
          if (!body.includes(m)) {
            ok = false;
            missing.push(m);
          }
        });
        resolve({ url, status: res.statusCode, ok, missing });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Testing HTTP Endpoints on 8080...');
  const results = await Promise.all([
    checkUrl('http://localhost:8080/', ['d-tab-rides', 'd-tab-carpools', 'd-filter-btn-all', 'maplibregl']),
    checkUrl('http://localhost:8080/passageiro', ['maplibregl', 'SIMBORA - Passageiro', 'Piaçabuçu']),
    checkUrl('http://localhost:8080/motorista', ['d-tab-rides', 'd-tab-carpools', 'd-filter-btn-all', 'maplibregl', 'Carlos Oliveira'])
  ]);

  let allOk = true;
  results.forEach(r => {
    console.log(`URL: ${r.url} -> Status: ${r.status} | OK: ${r.ok}`);
    if (!r.ok) {
      allOk = false;
      console.log('  Missing patterns:', r.missing);
    }
  });

  if (allOk) {
    console.log('>>> ALL ENDPOINTS WORKING AND VERIFIED! <<<');
  } else {
    console.error('>>> FAILURES DETECTED! <<<');
    process.exit(1);
  }
}

run();
