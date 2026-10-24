const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROUTE_PAIRS = [
  {
    id: 'piacabucu_penedo',
    name: 'Piaçabuçu → Penedo (Prioritário)',
    origin: { name: 'Piaçabuçu (Centro)', lat: -10.4056, lng: -36.4344 },
    destination: { name: 'Penedo (Centro Histórico)', lat: -10.2897, lng: -36.5864 },
    highways: ['AL-101', 'AL-225'],
  },
  {
    id: 'penedo_igreja_nova',
    name: 'Penedo → Igreja Nova',
    origin: { name: 'Penedo (Centro)', lat: -10.2897, lng: -36.5864 },
    destination: { name: 'Igreja Nova (Centro)', lat: -10.1256, lng: -36.6622 },
    highways: ['AL-110'],
  },
  {
    id: 'penedo_colegio',
    name: 'Penedo → Porto Real do Colégio',
    origin: { name: 'Penedo (Centro)', lat: -10.2897, lng: -36.5864 },
    destination: { name: 'Porto Real do Colégio (Centro)', lat: -10.1856, lng: -36.8394 },
    highways: ['AL-225', 'BR-101'],
  },
  {
    id: 'penedo_coruripe',
    name: 'Penedo → Coruripe',
    origin: { name: 'Penedo (Centro)', lat: -10.2897, lng: -36.5864 },
    destination: { name: 'Coruripe (Centro)', lat: -10.1256, lng: -36.1756 },
    highways: ['AL-101 Sul'],
  },
  {
    id: 'penedo_arapiraca',
    name: 'Penedo → Arapiraca',
    origin: { name: 'Penedo (Centro)', lat: -10.2897, lng: -36.5864 },
    destination: { name: 'Arapiraca (Centro)', lat: -9.7517, lng: -36.6606 },
    highways: ['AL-110'],
  },
  {
    id: 'penedo_maceio',
    name: 'Penedo → Maceió',
    origin: { name: 'Penedo (Centro)', lat: -10.2897, lng: -36.5864 },
    destination: { name: 'Maceió (Pajuçara)', lat: -9.6658, lng: -35.7350 },
    highways: ['AL-101 Sul'],
  },
  {
    id: 'piacabucu_coruripe',
    name: 'Piaçabuçu → Coruripe',
    origin: { name: 'Piaçabuçu (Centro)', lat: -10.4056, lng: -36.4344 },
    destination: { name: 'Coruripe (Centro)', lat: -10.1256, lng: -36.1756 },
    highways: ['AL-101 Sul'],
  }
];

function fetchRoute(pair) {
  const url = `https://router.project-osrm.org/route/v1/driving/${pair.origin.lng},${pair.origin.lat};${pair.destination.lng},${pair.destination.lat}?overview=full&geometries=geojson`;
  console.log(`Buscando rota: ${pair.name}...`);
  try {
    const cmd = `curl.exe -s -A "MobilityStudio/2.0" "${url}"`;
    const output = execSync(cmd, { encoding: 'utf8', timeout: 15000 });
    const data = JSON.parse(output);
    if (data.code === 'Ok' && data.routes && data.routes[0]) {
      const r = data.routes[0];
      return {
        ...pair,
        distanceMeters: r.distance,
        distanceKm: Number((r.distance / 1000).toFixed(2)),
        durationSeconds: r.duration,
        durationMinutes: Math.round(r.duration / 60),
        coordinates: r.geometry.coordinates, // array of [lng, lat]
        pointsCount: r.geometry.coordinates.length,
        status: 'SUCCESS'
      };
    } else {
      console.warn(`Erro na resposta OSRM para ${pair.name}:`, data.code);
    }
  } catch (err) {
    console.error(`Falha ao buscar ${pair.name}:`, err.message);
  }
  return null;
}

function run() {
  const results = {};
  for (const pair of ROUTE_PAIRS) {
    const route = fetchRoute(pair);
    if (route) {
      results[pair.id] = route;
      console.log(`✅ ${pair.name}: ${route.distanceKm} km, ~${route.durationMinutes} min, ${route.pointsCount} nós rodoviários.`);
    }
    // Delay de 400ms entre chamadas
    execSync('powershell -Command "Start-Sleep -Milliseconds 400"');
  }

  const outDir = path.join(__dirname, '..', 'packages');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'alagoas_routes.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');

  // Também salvar em apps/admin/src/data se existir
  const adminDir = path.join(__dirname, '..', 'apps', 'admin', 'src', 'data');
  if (!fs.existsSync(adminDir)) fs.mkdirSync(adminDir, { recursive: true });
  fs.writeFileSync(path.join(adminDir, 'alagoas_routes.json'), JSON.stringify(results, null, 2), 'utf8');

  console.log(`\nArquivo salvo com sucesso em: ${outPath} e em ${adminDir}`);
}

run();
