const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = req.url.split('?')[0];

  // Test Reporter Endpoint
  if (req.method === 'POST' && reqPath === '/api/test-report') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        fs.writeFileSync(path.join(ROOT, 'tests', 'last_browser_test_result.json'), JSON.stringify(data, null, 2), 'utf8');
        console.log('\n[TEST REPORT RECEIVED FROM BROWSER]:');
        console.log(`Summary: ${data.passed ? 'ALL PASSED' : 'FAILED'}`);
        data.logs.forEach(l => console.log(' ' + l));
      } catch (e) {
        console.error('Error parsing test report:', e);
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ received: true }));
    });
    return;
  }

  // Routing shortcuts
  if (reqPath === '/' || reqPath === '/studio' || reqPath === '/index.html') {
    reqPath = '/mobility_interactive_studio.html';
  } else if (reqPath === '/passageiro' || reqPath === '/passenger') {
    reqPath = '/android-build/passenger/assets/www/index.html';
  } else if (reqPath === '/motorista' || reqPath === '/driver') {
    reqPath = '/android-build/driver/assets/www/index.html';
  } else if (reqPath === '/downloads' || reqPath === '/apks' || reqPath === '/download') {
    const htmlPage = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SIMBORA — Download dos Aplicativos Android</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #0b1e19; color: #f8f9f6; margin: 0; padding: 24px 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 90vh; }
    .card { background-color: #123D32; border: 1px solid #16A572; border-radius: 20px; max-width: 480px; width: 100%; padding: 28px 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.4); box-sizing: border-box; text-align: center; }
    h1 { color: #FFCC45; font-size: 24px; margin-top: 0; margin-bottom: 6px; }
    p.sub { color: #A2C4B7; font-size: 14px; margin-bottom: 24px; }
    .btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 14px 18px; margin-bottom: 14px; border-radius: 12px; font-size: 15px; font-weight: bold; text-decoration: none; transition: transform 0.15s ease, opacity 0.15s ease; box-sizing: border-box; cursor: pointer; }
    .btn:active { transform: scale(0.98); }
    .btn-passenger { background-color: #FFCC45; color: #123D32; }
    .btn-driver { background-color: #16A572; color: #FFFFFF; }
    .btn-zip { background-color: #1f4f42; color: #FFCC45; border: 1px solid #2e715f; }
    .badge { background: rgba(255,255,255,0.15); font-size: 11px; padding: 2px 8px; border-radius: 12px; margin-left: auto; }
    .info-box { background: rgba(0,0,0,0.25); border-radius: 10px; padding: 14px; margin-top: 20px; text-align: left; font-size: 12px; color: #d0e4dc; line-height: 1.5; }
    .info-box strong { color: #FFCC45; }
    .links-bar { margin-top: 20px; font-size: 13px; }
    .links-bar a { color: #16A572; text-decoration: underline; margin: 0 8px; }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 40px; margin-bottom: 8px;">🚀</div>
    <h1>SIMBORA Android 4.2</h1>
    <p class="sub">Selecione o aplicativo para instalar diretamente no seu celular ou computador.</p>

    <a href="/SIMBORA_ANDROID_TEST/SIMBORA-PASSAGEIRO-TEST.apk" class="btn btn-passenger" download>
      <span>📱 Baixar SIMBORA Passageiro</span>
      <span class="badge">100 KB</span>
    </a>

    <a href="/SIMBORA_ANDROID_TEST/SIMBORA-MOTORISTA-TEST.apk" class="btn btn-driver" download>
      <span>🚕 Baixar SIMBORA Motorista</span>
      <span class="badge">108 KB</span>
    </a>

    <a href="/SIMBORA_ANDROID_TEST/SIMBORA_ANDROID_TEST.zip" class="btn btn-zip" download>
      <span>📦 Baixar Pacote Completo (ZIP)</span>
      <span class="badge">172 KB</span>
    </a>

    <div class="info-box">
      <strong>Como enviar para o Google Drive:</strong><br>
      1. No seu navegador onde o Drive já está aberto, clique em <strong>+ Novo</strong> &rarr; <strong>Upload de arquivo</strong>.<br>
      2. No campo de nome ou pasta, cole o caminho copiado: <code>C:\\Users\\winc\\Desktop\\SIMBORA_APKs</code>.<br>
      3. Selecione os dois APKs e clique em <strong>Abrir</strong>.
    </div>

    <div class="links-bar">
      <a href="/studio">Abrir Studio</a> •
      <a href="/passageiro">App Passageiro Web</a> •
      <a href="/motorista">App Motorista Web</a>
    </div>
  </div>
</body>
</html>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(htmlPage);
    return;
  }

  let filePath = path.join(ROOT, reqPath.replace(/^\//, ''));
  if (!fs.existsSync(filePath) && (reqPath.endsWith('.apk') || reqPath.endsWith('.zip'))) {
    filePath = path.join(ROOT, 'SIMBORA_ANDROID_TEST', path.basename(reqPath));
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    let contentType = 'text/plain';
    if (filePath.endsWith('.html')) contentType = 'text/html; charset=utf-8';
    else if (filePath.endsWith('.js')) contentType = 'application/javascript; charset=utf-8';
    else if (filePath.endsWith('.css')) contentType = 'text/css; charset=utf-8';
    else if (filePath.endsWith('.json')) contentType = 'application/json; charset=utf-8';
    else if (filePath.endsWith('.png')) contentType = 'image/png';
    else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
    else if (filePath.endsWith('.svg')) contentType = 'image/svg+xml';
    else if (filePath.endsWith('.apk')) {
      contentType = 'application/vnd.android.package-archive';
      res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
    } else if (filePath.endsWith('.zip')) {
      contentType = 'application/zip';
      res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
    }

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found: ' + reqPath);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[SIMBORA Studio & Web Apps] Serving at:`);
  console.log(` - Studio:      http://localhost:${PORT}/`);
  console.log(` - Passageiro:  http://localhost:${PORT}/passageiro`);
  console.log(` - Motorista:   http://localhost:${PORT}/motorista`);
  console.log(` - Na rede:     http://192.168.3.5:${PORT}/`);
});
