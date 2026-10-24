const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, '..', 'packages', 'alagoas_routes.json');
const routesData = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

// Format primary route: Piaçabuçu -> Penedo
const primaryRoute = routesData.piacabucu_penedo;
console.log(`Carregando rota primária: ${primaryRoute.name} (${primaryRoute.pointsCount} pontos, ${primaryRoute.distanceKm} km).`);

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mobility Studio 2.0 — Alagoas Intermunicipal Simulation</title>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#eef2ff',
              100: '#e0e7ff',
              500: '#6366f1',
              600: '#4f46e5',
              700: '#4338ca',
              900: '#312e81',
            }
          }
        }
      }
    }
  </script>

  <!-- MapLibre GL JS -->
  <link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet" />
  <script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>

  <!-- Lucide Icons (Vanilla) -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <style>
    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #64748b; }

    /* Phone Chassis 390x844 Reference */
    .phone-viewport {
      width: 390px;
      height: 844px;
      border-radius: 50px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 12px #1e293b, 0 0 0 14px #334155;
      background: #ffffff;
      flex-shrink: 0;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    .phone-notch {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 125px;
      height: 30px;
      background: #000000;
      border-radius: 20px;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    }

    .phone-status-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      z-index: 45;
      pointer-events: none;
    }

    .dark .phone-status-bar-dark {
      color: #ffffff;
    }

    .phone-home-indicator {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 134px;
      height: 5px;
      background: #0f172a;
      border-radius: 3px;
      z-index: 50;
      pointer-events: none;
      opacity: 0.8;
    }

    /* Radar Pulse Animation */
    @keyframes ping-slow {
      0% { transform: scale(0.9); opacity: 0.8; }
      50% { transform: scale(1.4); opacity: 0.2; }
      100% { transform: scale(0.9); opacity: 0.8; }
    }
    .pulse-radar {
      animation: ping-slow 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    /* Map Markers */
    .vehicle-marker {
      width: 38px;
      height: 38px;
      background: #4f46e5;
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 16px;
      transition: transform 0.1s linear;
      will-change: transform;
    }

    .pin-marker {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 2px solid white;
    }
  </style>
</head>

<body class="bg-slate-950 text-slate-100 min-h-screen font-sans flex flex-col select-none overflow-x-hidden">

  <!-- ==================== HEADER BAR ==================== -->
  <header class="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5">
    <div class="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-4">
      
      <!-- Brand & Title -->
      <div class="flex items-center gap-3.5">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/25">
          M
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-black tracking-tight text-white">Mobility Studio 2.0</h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              ALAGOAS INTERMUNICIPAL
            </span>
          </div>
          <p class="text-xs text-slate-400">Piaçabuçu ↔ Penedo • MapLibre GL • Roteamento OSRM Rodoviário • Sincronização em Tempo Real</p>
        </div>
      </div>

      <!-- Live Connectivity Badges -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-slate-300 font-semibold">Backend NestJS:</span>
          <a href="http://localhost:3001/admin/dashboard" target="_blank" class="text-emerald-400 font-bold hover:underline">Porta 3001 OK</a>
        </div>

        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
          <span class="text-slate-300 font-semibold">Admin Panel:</span>
          <a href="http://localhost:3000" target="_blank" class="text-indigo-400 font-bold hover:underline">Porta 3000</a>
        </div>

        <button onclick="toggleTheme()" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition" title="Alternar Tema Claro/Escuro">
          <i data-lucide="moon" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- ==================== SUB-BAR: SCENARIOS & TELEMETRY CONTROLS ==================== -->
  <section class="bg-slate-900 border-b border-slate-800 px-6 py-3">
    <div class="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-4">
      
      <!-- Route Scenario Selector -->
      <div class="flex items-center gap-3">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <i data-lucide="map-pin" class="w-3.5 h-3.5 text-indigo-400"></i>
          Corredor Rodoviário:
        </span>
        <select id="route-selector" onchange="changeScenario(this.value)" class="bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-indigo-500 cursor-pointer">
          <option value="piacabucu_penedo" selected>⭐ Piaçabuçu → Penedo (Prioritário • 28,2 km via AL-101 / AL-225)</option>
          <option value="penedo_igreja_nova">Penedo → Igreja Nova (31,9 km via AL-110)</option>
          <option value="penedo_colegio">Penedo → Porto Real do Colégio (58,3 km via AL-225 / BR-101)</option>
          <option value="penedo_coruripe">Penedo → Coruripe (58,5 km via AL-101 Sul)</option>
          <option value="penedo_arapiraca">Penedo → Arapiraca (72,3 km via AL-110)</option>
          <option value="penedo_maceio">Penedo → Maceió (146,6 km via Litoral Sul AL-101)</option>
          <option value="piacabucu_coruripe">Piaçabuçu → Coruripe (48,9 km via AL-101 Sul)</option>
        </select>
      </div>

      <!-- Playback Controls -->
      <div class="flex items-center gap-2">
        <button id="btn-play-pause" onclick="toggleSimulationPlayback()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition">
          <i id="play-icon" data-lucide="play" class="w-4 h-4 fill-white"></i>
          <span id="play-text">Iniciar Viagem</span>
        </button>

        <button onclick="resetSimulation()" class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition">
          <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
          Reiniciar
        </button>

        <!-- Speed Presets -->
        <div class="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
          <span class="text-slate-400 font-bold px-2">Vel:</span>
          <button onclick="setSimSpeed(1)" class="speed-btn px-2.5 py-1 rounded-lg font-bold bg-indigo-600 text-white" data-speed="1">1×</button>
          <button onclick="setSimSpeed(2)" class="speed-btn px-2.5 py-1 rounded-lg font-bold text-slate-300 hover:text-white" data-speed="2">2×</button>
          <button onclick="setSimSpeed(5)" class="speed-btn px-2.5 py-1 rounded-lg font-bold text-slate-300 hover:text-white" data-speed="5">5×</button>
          <button onclick="setSimSpeed(10)" class="speed-btn px-2.5 py-1 rounded-lg font-bold text-slate-300 hover:text-white" data-speed="10">10×</button>
          <button onclick="setSimSpeed(20)" class="speed-btn px-2.5 py-1 rounded-lg font-bold text-slate-300 hover:text-white" data-speed="20">20×</button>
        </div>

        <!-- Phone Scale Slider -->
        <div class="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
          <i data-lucide="smartphone" class="w-3.5 h-3.5 text-slate-400"></i>
          <span class="text-slate-400">Escala:</span>
          <select id="scale-selector" onchange="changePhoneScale(this.value)" class="bg-transparent text-white font-bold outline-none cursor-pointer">
            <option value="0.78">78% (Notebook)</option>
            <option value="0.88" selected>88% (Ideal)</option>
            <option value="1.0">100% (Real)</option>
          </select>
        </div>

        <!-- View Mode (Dual vs Single) -->
        <div class="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
          <button onclick="setViewMode('dual')" id="btn-view-dual" class="px-3 py-1 rounded-lg font-bold bg-indigo-600 text-white">Lado a Lado</button>
          <button onclick="setViewMode('passenger')" id="btn-view-passenger" class="px-3 py-1 rounded-lg font-bold text-slate-300 hover:text-white">Só Passageiro</button>
          <button onclick="setViewMode('driver')" id="btn-view-driver" class="px-3 py-1 rounded-lg font-bold text-slate-300 hover:text-white">Só Motorista</button>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== TELEMETRY HUD BAR ==================== -->
  <section class="bg-slate-900/60 border-b border-slate-800/80 px-6 py-2.5 text-xs text-slate-300">
    <div class="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-6">
        <div>
          <span class="text-slate-500 font-bold uppercase text-[10px]">Origem:</span>
          <span id="telemetry-origin" class="font-bold text-white ml-1">Piaçabuçu (Centro)</span>
        </div>
        <div>
          <span class="text-slate-500 font-bold uppercase text-[10px]">Destino:</span>
          <span id="telemetry-destination" class="font-bold text-white ml-1">Penedo (Centro Histórico)</span>
        </div>
        <div>
          <span class="text-slate-500 font-bold uppercase text-[10px]">Rodovia:</span>
          <span id="telemetry-highways" class="font-bold text-indigo-400 ml-1">AL-101 Sul / AL-225</span>
        </div>
        <div>
          <span class="text-slate-500 font-bold uppercase text-[10px]">Distância Real:</span>
          <span id="telemetry-total-dist" class="font-bold text-white ml-1">28,20 km</span>
        </div>
        <div>
          <span class="text-slate-500 font-bold uppercase text-[10px]">ETA Rodoviário:</span>
          <span id="telemetry-total-eta" class="font-bold text-white ml-1">~28 min</span>
        </div>
      </div>

      <div class="flex items-center gap-6 font-mono text-[11px]">
        <div>
          <span class="text-slate-500">Progresso:</span>
          <span id="telemetry-progress-pct" class="font-bold text-emerald-400">0.0%</span>
        </div>
        <div>
          <span class="text-slate-500">Restante:</span>
          <span id="telemetry-remaining-km" class="font-bold text-white">28.2 km</span>
        </div>
        <div>
          <span class="text-slate-500">Velocidade:</span>
          <span id="telemetry-speed" class="font-bold text-amber-400">0 km/h</span>
        </div>
        <div>
          <span class="text-slate-500">Direção (Bearing):</span>
          <span id="telemetry-bearing" class="font-bold text-indigo-300">312° (NO)</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== MAIN WORKSPACE: DUAL MOBILE SIMULATORS ==================== -->
  <main class="flex-1 max-w-[1720px] w-full mx-auto p-6 flex flex-col items-center justify-center">
    
    <div id="simulators-wrapper" class="flex items-center justify-center gap-12 transition-all duration-300" style="transform: scale(0.88); transform-origin: top center;">
      
      <!-- ========================================== -->
      <!-- PHONE 1: PASSENGER APP (MARINA SILVA)      -->
      <!-- ========================================== -->
      <div id="phone-passenger-container" class="flex flex-col items-center">
        <div class="mb-3 flex items-center justify-between w-[390px] px-2 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-indigo-500"></span>
            <span class="font-black text-slate-200">PASSAGEIRO: MARINA SILVA</span>
          </div>
          <span class="text-slate-400 font-mono text-[11px]">390 × 844 px</span>
        </div>

        <div class="phone-viewport text-slate-900 flex flex-col">
          <!-- Dynamic Island Notch -->
          <div class="phone-notch">
            <span class="w-3 h-3 rounded-full bg-slate-900 border border-slate-700"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <!-- Status Bar -->
          <div class="phone-status-bar">
            <span>09:41</span>
            <div class="flex items-center gap-1.5 text-xs">
              <i data-lucide="signal" class="w-3.5 h-3.5"></i>
              <span class="font-black">5G</span>
              <i data-lucide="battery-charging" class="w-4 h-4 text-emerald-600"></i>
            </div>
          </div>

          <!-- Map Container (MapLibre GL) -->
          <div class="relative flex-1 w-full bg-slate-200 overflow-hidden">
            <div id="passenger-map" class="w-full h-full"></div>

            <!-- Floating Top Card (Origin / Destination) -->
            <div id="p-floating-route-card" class="absolute top-12 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200 z-10">
              <div class="flex items-start gap-3">
                <div class="flex flex-col items-center pt-1">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span class="w-0.5 h-6 bg-slate-300 my-0.5"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                </div>
                <div class="flex-1 space-y-1">
                  <div class="border-b border-slate-100 pb-1">
                    <p class="text-[10px] font-bold text-slate-400 uppercase">Embarque</p>
                    <p id="p-card-origin" class="text-xs font-black text-slate-900 truncate">Piaçabuçu (Centro) • Praça São Francisco</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase">Destino</p>
                    <p id="p-card-destination" class="text-xs font-black text-slate-900 truncate">Penedo (Centro Histórico) • Convento dos Franciscanos</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recenter / Map Controls -->
            <div class="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              <button onclick="passengerMapFitRoute()" class="w-9 h-9 rounded-full bg-white text-slate-700 shadow-lg flex items-center justify-center hover:bg-slate-50 transition border border-slate-200" title="Ajustar Rota Completa">
                <i data-lucide="maximize-2" class="w-4 h-4"></i>
              </button>
              <button onclick="passengerMapFollowCar()" class="w-9 h-9 rounded-full bg-white text-indigo-600 shadow-lg flex items-center justify-center hover:bg-slate-50 transition border border-slate-200" title="Seguir Veículo">
                <i data-lucide="navigation" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <!-- Bottom Sheet (Dynamic States) -->
          <div class="bg-white border-t border-slate-100 rounded-t-3xl shadow-2xl p-5 relative z-20 transition-all duration-300 max-h-[380px] overflow-y-auto">
            
            <!-- STATE 1: IDLE / CATEGORY SELECTION -->
            <div id="p-state-idle" class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-black text-base text-slate-900">Selecione uma Categoria</h3>
                  <p class="text-xs text-slate-500">Viagem intermunicipal Alagoas (28,2 km)</p>
                </div>
                <span class="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Sem Alta Demanda
                </span>
              </div>

              <!-- Vehicle Category Cards -->
              <div class="grid grid-cols-3 gap-2.5">
                <div onclick="selectCategory('economy')" id="p-cat-economy" class="p-3 border-2 border-slate-200 rounded-2xl text-center cursor-pointer hover:border-indigo-500 transition">
                  <div class="text-2xl mb-1">🚗</div>
                  <div class="text-xs font-bold text-slate-800">Econômico</div>
                  <div class="text-[10px] text-slate-500">4 min</div>
                  <div class="text-xs font-black text-indigo-600 mt-1">R$ 47,07</div>
                </div>

                <div onclick="selectCategory('comfort')" id="p-cat-comfort" class="p-3 border-2 border-indigo-600 bg-indigo-50/60 rounded-2xl text-center cursor-pointer transition shadow-xs">
                  <div class="text-2xl mb-1">🚙</div>
                  <div class="text-xs font-bold text-indigo-900">Conforto</div>
                  <div class="text-[10px] text-indigo-700 font-semibold">2 min</div>
                  <div class="text-xs font-black text-indigo-600 mt-1">R$ 68,01</div>
                </div>

                <div onclick="selectCategory('premium')" id="p-cat-premium" class="p-3 border-2 border-slate-200 rounded-2xl text-center cursor-pointer hover:border-indigo-500 transition">
                  <div class="text-2xl mb-1">✨</div>
                  <div class="text-xs font-bold text-slate-800">Premium</div>
                  <div class="text-[10px] text-slate-500">6 min</div>
                  <div class="text-xs font-black text-indigo-600 mt-1">R$ 104,66</div>
                </div>
              </div>

              <!-- Payment Method & Details -->
              <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div class="flex items-center gap-2">
                  <span class="text-base">💳</span>
                  <span class="font-bold text-slate-800">Mastercard •••• 4829</span>
                </div>
                <span class="font-bold text-indigo-600 cursor-pointer">Trocar</span>
              </div>

              <!-- Request Button -->
              <button onclick="passengerRequestRide()" class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/30 transition text-sm flex items-center justify-center gap-2">
                <span>CONFIRMAR CONFORTO (R$ 68,01)</span>
              </button>
            </div>

            <!-- STATE 2: SEARCHING DRIVER -->
            <div id="p-state-searching" class="hidden flex-col items-center justify-center py-6 text-center space-y-4">
              <div class="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center pulse-radar">
                <i data-lucide="compass" class="w-8 h-8 text-indigo-600 animate-spin"></i>
              </div>
              <div>
                <h3 class="font-black text-base text-slate-900">Buscando motoristas próximos...</h3>
                <p class="text-xs text-slate-500 mt-1">Algoritmo Haversine varrendo a orla de Piaçabuçu</p>
                <p class="text-[11px] font-mono font-bold text-indigo-600 mt-2">Timeout: <span id="p-search-timer">15</span>s</p>
              </div>
              <button onclick="passengerCancel()" class="px-6 py-2 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100 transition">
                Cancelar Solicitação
              </button>
            </div>

            <!-- STATE 3: DRIVER ASSIGNED & ARRIVING -->
            <div id="p-state-assigned" class="hidden space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <span id="p-trip-stage-badge" class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-700 uppercase">
                    Motorista a Caminho
                  </span>
                  <h4 id="p-driver-eta-text" class="text-base font-black text-slate-900 mt-1">Chega em 2 minutos</h4>
                </div>
                <div class="text-right">
                  <p class="text-[10px] text-slate-400 font-bold uppercase">Preço Fixado</p>
                  <p class="text-sm font-black text-indigo-600">R$ 68,01</p>
                </div>
              </div>

              <!-- Driver & Vehicle Profile -->
              <div class="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                  CO
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-black text-sm text-slate-900">Carlos Oliveira</h4>
                    <span class="text-xs font-bold text-amber-500 flex items-center gap-0.5">⭐ 4.9</span>
                  </div>
                  <p class="text-xs text-slate-500 font-medium">Toyota Corolla Hybrid • Prata</p>
                </div>
                <div class="bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 font-mono text-xs font-black text-slate-800 shadow-xs">
                  BRA2E19
                </div>
              </div>

              <!-- Security PIN Code -->
              <div class="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Código PIN de Embarque</p>
                  <p class="text-xs text-amber-700">Informe ao motorista para iniciar a corrida</p>
                </div>
                <span class="text-xl font-black text-amber-900 font-mono tracking-widest bg-amber-100 px-3 py-1 rounded-xl">4 8 2 1</span>
              </div>

              <!-- Trip Highway Live Progress (AL-101 / AL-225) -->
              <div id="p-highway-progress-box" class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div class="flex justify-between font-bold">
                  <span class="text-slate-600">Trajeto Piaçabuçu → Penedo:</span>
                  <span id="p-live-remaining-dist" class="text-indigo-600">28,2 km restantes</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div id="p-progress-bar" class="bg-indigo-600 h-full rounded-full transition-all duration-300" style="width: 0%;"></div>
                </div>
              </div>

              <div class="flex gap-2">
                <button onclick="passengerCancel()" class="flex-1 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl text-xs hover:bg-rose-100 transition">
                  Cancelar Viagem
                </button>
                <button onclick="alert('Compartilhando localização de segurança em tempo real com contatos confiáveis.')" class="px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition">
                  Compartilhar Rota
                </button>
              </div>
            </div>

            <!-- STATE 4: COMPLETED & RATE -->
            <div id="p-state-rating" class="hidden text-center space-y-4 py-4">
              <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl">
                🏁
              </div>
              <div>
                <h3 class="font-black text-lg text-slate-900">Você chegou a Penedo!</h3>
                <p class="text-xs text-slate-500 mt-1">Viagem intermunicipal de 28,2 km concluída com sucesso.</p>
                <p class="text-sm font-black text-indigo-600 mt-1">R$ 68,01 debitado no Cartão Mastercard</p>
              </div>

              <div class="py-2">
                <p class="text-xs font-bold text-slate-700 mb-2">Como foi a corrida com Carlos Oliveira?</p>
                <div class="flex justify-center gap-2 text-3xl cursor-pointer" id="rating-stars">
                  <span onclick="setRating(1)">⭐</span>
                  <span onclick="setRating(2)">⭐</span>
                  <span onclick="setRating(3)">⭐</span>
                  <span onclick="setRating(4)">⭐</span>
                  <span onclick="setRating(5)">⭐</span>
                </div>
              </div>

              <button onclick="passengerFinishRating()" class="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl text-xs shadow-lg shadow-indigo-500/25">
                Enviar Avaliação e Concluir
              </button>
            </div>

          </div>

          <!-- Home Indicator -->
          <div class="phone-home-indicator"></div>
        </div>
      </div>


      <!-- ========================================== -->
      <!-- PHONE 2: DRIVER APP (CARLOS OLIVEIRA)      -->
      <!-- ========================================== -->
      <div id="phone-driver-container" class="flex flex-col items-center">
        <div class="mb-3 flex items-center justify-between w-[390px] px-2 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span class="font-black text-slate-200">MOTORISTA: CARLOS OLIVEIRA</span>
          </div>
          <span class="text-slate-400 font-mono text-[11px]">Toyota Corolla BRA2E19</span>
        </div>

        <div class="phone-viewport text-slate-900 flex flex-col">
          <!-- Dynamic Island Notch -->
          <div class="phone-notch">
            <span class="w-3 h-3 rounded-full bg-slate-900 border border-slate-700"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <!-- Status Bar -->
          <div class="phone-status-bar">
            <span>09:41</span>
            <div class="flex items-center gap-1.5 text-xs">
              <i data-lucide="signal" class="w-3.5 h-3.5"></i>
              <span class="font-black">5G</span>
              <i data-lucide="battery-charging" class="w-4 h-4 text-emerald-600"></i>
            </div>
          </div>

          <!-- Map Container (MapLibre GL) -->
          <div class="relative flex-1 w-full bg-slate-200 overflow-hidden">
            <div id="driver-map" class="w-full h-full"></div>

            <!-- Turn-by-Turn HUD (Visible during trip) -->
            <div id="d-hud-nav" class="hidden absolute top-12 left-4 right-4 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl z-10 border border-slate-800">
              <div class="flex items-center gap-3.5">
                <div class="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <i data-lucide="arrow-up-right" class="w-6 h-6"></i>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-indigo-400 font-bold uppercase tracking-wider" id="d-hud-next-turn">Em 800m siga na Rodovia</p>
                  <h4 class="font-black text-sm text-white truncate" id="d-hud-highway">AL-101 Sul sentido Penedo</h4>
                </div>
                <div class="text-right">
                  <span id="d-hud-speed" class="text-lg font-black font-mono text-emerald-400">72</span>
                  <span class="text-[10px] text-slate-400 block font-bold">km/h</span>
                </div>
              </div>
            </div>

            <!-- Recenter / Map Controls -->
            <div class="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              <button onclick="driverMapFitRoute()" class="w-9 h-9 rounded-full bg-white text-slate-700 shadow-lg flex items-center justify-center hover:bg-slate-50 transition border border-slate-200" title="Ajustar Rota Completa">
                <i data-lucide="maximize-2" class="w-4 h-4"></i>
              </button>
              <button onclick="driverMapFollowCar()" class="w-9 h-9 rounded-full bg-white text-emerald-600 shadow-lg flex items-center justify-center hover:bg-slate-50 transition border border-slate-200" title="Seguir Veículo">
                <i data-lucide="navigation" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <!-- Bottom Control Sheet -->
          <div class="bg-white border-t border-slate-100 rounded-t-3xl shadow-2xl p-5 relative z-20 max-h-[380px] overflow-y-auto">
            
            <!-- STATE 1: IDLE / ONLINE -->
            <div id="d-state-idle" class="space-y-4">
              <div class="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div class="flex items-center gap-3">
                  <span class="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <div>
                    <h4 class="font-black text-xs text-slate-900">VOCÊ ESTÁ ONLINE</h4>
                    <p class="text-[11px] text-slate-500">Piaçabuçu • Conforto & Premium</p>
                  </div>
                </div>
                <button onclick="toggleDriverOnline()" id="btn-driver-online" class="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs">
                  ONLINE
                </button>
              </div>

              <!-- Earnings Summary Card -->
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p class="text-[10px] font-bold text-slate-400 uppercase">Ganhos Hoje</p>
                  <p class="text-xl font-black text-slate-900 mt-0.5">R$ 342,50</p>
                  <p class="text-[10px] text-emerald-600 font-bold">8 corridas</p>
                </div>
                <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p class="text-[10px] font-bold text-slate-400 uppercase">Taxa de Aceite</p>
                  <p class="text-xl font-black text-slate-900 mt-0.5">98%</p>
                  <p class="text-[10px] text-indigo-600 font-bold">Nota 4.9 ⭐</p>
                </div>
              </div>

              <div class="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
                <i data-lucide="info" class="w-4 h-4 text-indigo-600 flex-shrink-0"></i>
                <span>Aguardando novas chamadas na região de Piaçabuçu e Penedo.</span>
              </div>
            </div>

            <!-- STATE 2: INCOMING TRIP OFFER MODAL -->
            <div id="d-state-offer" class="hidden space-y-4">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-800 uppercase animate-pulse">
                  Nova Corrida Intermunicipal!
                </span>
                <span id="d-offer-timer" class="text-base font-black text-rose-600 font-mono">15s</span>
              </div>

              <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-black text-xl text-slate-900">R$ 54,40</h3>
                    <p class="text-[11px] text-slate-500">Seu ganho líquido estimado (80%)</p>
                  </div>
                  <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-600 text-white">
                    Conforto
                  </span>
                </div>

                <div class="space-y-1.5 text-xs border-t border-slate-200 pt-2.5">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span class="font-bold text-slate-800">Embarque:</span>
                    <span class="text-slate-600 truncate">Piaçabuçu (Centro)</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <span class="font-bold text-slate-800">Desembarque:</span>
                    <span class="text-slate-600 truncate">Penedo (Centro Histórico)</span>
                  </div>
                  <div class="flex justify-between text-slate-500 text-[11px] pt-1">
                    <span>Distância: <b>28,2 km</b></span>
                    <span>Duração: <b>~28 min</b></span>
                    <span>Passageira: <b>Marina Silva ⭐ 4.95</b></span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <button onclick="driverDeclineOffer()" class="py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl text-xs transition">
                  Recusar
                </button>
                <button onclick="driverAcceptOffer()" class="py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xs shadow-lg shadow-emerald-500/25 transition">
                  ACEITAR CORRIDA
                </button>
              </div>
            </div>

            <!-- STATE 3: ON TRIP & NAVIGATION -->
            <div id="d-state-trip" class="hidden space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <span id="d-trip-stage-text" class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-700 uppercase">
                    Em Rota de Embarque
                  </span>
                  <h4 id="d-nav-title" class="text-sm font-black text-slate-900 mt-1">Marina Silva • Centro de Piaçabuçu</h4>
                </div>
                <div class="text-right">
                  <p class="text-[10px] text-slate-400 font-bold uppercase">Ganho Líquido</p>
                  <p class="text-sm font-black text-emerald-600 font-mono">R$ 54,40</p>
                </div>
              </div>

              <!-- Action Buttons based on stage -->
              <div id="d-action-box" class="space-y-2">
                <button id="btn-driver-arrived" onclick="driverNotifyArrived()" class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/25 text-xs transition">
                  CHEGUEI AO LOCAL DE EMBARQUE
                </button>

                <!-- PIN Verification Modal (hidden until arrived) -->
                <div id="d-pin-verification" class="hidden p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                  <div class="flex justify-between items-center text-xs">
                    <span class="font-bold text-amber-900">Validar Código PIN do Passageiro:</span>
                    <span class="font-mono font-black text-amber-800 text-sm">4 8 2 1</span>
                  </div>
                  <button onclick="driverStartTrip()" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-md transition">
                    CONFIRMAR PIN E INICIAR VIAGEM PARA PENEDO
                  </button>
                </div>

                <button id="btn-driver-complete" onclick="driverFinishTrip()" class="hidden w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/25 text-xs transition">
                  FINALIZAR VIAGEM EM PENEDO
                </button>
              </div>

              <!-- Trip Telemetry for Driver -->
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between font-mono">
                <span>Distância: <b id="d-telemetry-km" class="text-slate-900">28.2 km</b></span>
                <span>Restante: <b id="d-telemetry-min" class="text-indigo-600">28 min</b></span>
                <span>Velocidade: <b id="d-telemetry-spd" class="text-emerald-600">0 km/h</b></span>
              </div>
            </div>

            <!-- STATE 4: SUMMARY & EARNINGS -->
            <div id="d-state-summary" class="hidden text-center space-y-4 py-4">
              <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl">
                💰
              </div>
              <div>
                <h3 class="font-black text-lg text-slate-900">Viagem Finalizada com Sucesso!</h3>
                <p class="text-xs text-slate-500 mt-1">Trajeto: Piaçabuçu → Penedo (28,2 km)</p>
                <p class="text-xl font-black text-emerald-600 mt-2">+ R$ 54,40 creditados na carteira</p>
              </div>

              <button onclick="driverResetToIdle()" class="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl text-xs shadow-lg shadow-indigo-500/25">
                Voltar a Ficar Online
              </button>
            </div>

          </div>

          <!-- Home Indicator -->
          <div class="phone-home-indicator"></div>
        </div>
      </div>

    </div>

  </main>

  <!-- ==================== REAL-TIME AUDIT & EVENT LOG CONSOLE ==================== -->
  <section class="bg-slate-900 border-t border-slate-800 p-6">
    <div class="max-w-[1720px] mx-auto">
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div class="flex items-center gap-2">
          <i data-lucide="terminal" class="w-4 h-4 text-indigo-400"></i>
          <h3 class="font-black text-xs text-white uppercase tracking-wider">Console de Eventos em Tempo Real & Sincronização WebSocket</h3>
        </div>
        <div class="flex items-center gap-3">
          <button onclick="clearLogs()" class="text-slate-400 hover:text-white text-xs font-bold transition">Limpar Logs</button>
          <span class="text-[10px] text-slate-500 font-mono" id="log-count">0 eventos</span>
        </div>
      </div>

      <div id="log-console" class="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto space-y-1.5">
        <p class="text-slate-500">// Mobility Studio 2.0 pronto. Selecione o corredor de Alagoas e acione a simulação.</p>
      </div>
    </div>
  </section>

  <!-- ==================== SCRIPT SECTION ==================== -->
  <script>
    // Embed or reference All Alagoas Routes
    const ALAGOAS_ROUTES = ${JSON.stringify(routesData)};

    // State Variables
    let currentRouteKey = 'piacabucu_penedo';
    let currentRoute = ALAGOAS_ROUTES[currentRouteKey];
    let simProgressIndex = 0; // index in currentRoute.coordinates
    let simIsPlaying = false;
    let simSpeedMultiplier = 1;
    let simInterval = null;
    let currentCategory = 'comfort';
    let currentRating = 5;
    let tripStage = 'IDLE'; // IDLE | SEARCHING | ASSIGNED | ARRIVED | IN_PROGRESS | COMPLETED

    // MapLibre Instances
    let pMap = null;
    let dMap = null;
    let pCarMarker = null;
    let dCarMarker = null;
    let pOriginMarker = null;
    let pDestMarker = null;
    let dOriginMarker = null;
    let dDestMarker = null;

    // Initialize Maps on window load
    window.addEventListener('load', () => {
      lucide.createIcons();
      initMaps();
      logEvent('SYSTEM', 'Mobility Studio 2.0 inicializado com sucesso.');
      logEvent('GEODATA', 'Rota prioritária carregada: Piaçabuçu → Penedo (28,2 km, 485 nós rodoviários).');
      logEvent('API', 'Backend NestJS verificado na porta 3001.');
    });

    function initMaps() {
      // MapLibre Style with OpenStreetMap Standard Raster Tiles
      const osmStyle = {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      };

      const startCoord = currentRoute.coordinates[0]; // [lng, lat]
      const endCoord = currentRoute.coordinates[currentRoute.coordinates.length - 1];

      // 1. Passenger Map
      pMap = new maplibregl.Map({
        container: 'passenger-map',
        style: osmStyle,
        center: startCoord,
        zoom: 12,
        attributionControl: false
      });

      // 2. Driver Map
      dMap = new maplibregl.Map({
        container: 'driver-map',
        style: osmStyle,
        center: startCoord,
        zoom: 12,
        attributionControl: false
      });

      pMap.on('load', () => {
        setupMapLayers(pMap, 'passenger');
      });

      dMap.on('load', () => {
        setupMapLayers(dMap, 'driver');
      });
    }

    function setupMapLayers(mapInstance, type) {
      const geojsonRoute = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: currentRoute.coordinates
        }
      };

      // Add Route Source
      mapInstance.addSource('highway-route', {
        type: 'geojson',
        data: geojsonRoute
      });

      // Route Casing (Border)
      mapInstance.addLayer({
        id: 'highway-route-casing',
        type: 'line',
        source: 'highway-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#312e81',
          'line-width': 7,
          'line-opacity': 0.7
        }
      });

      // Route Core Line
      mapInstance.addLayer({
        id: 'highway-route-line',
        type: 'line',
        source: 'highway-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#4f46e5',
          'line-width': 5,
          'line-opacity': 0.95
        }
      });

      // Origin Marker (Green Pin)
      const originEl = document.createElement('div');
      originEl.className = 'pin-marker bg-emerald-600';
      originEl.innerHTML = 'A';
      const oMarker = new maplibregl.Marker({ element: originEl })
        .setLngLat(currentRoute.coordinates[0])
        .addTo(mapInstance);

      // Destination Marker (Red Pin)
      const destEl = document.createElement('div');
      destEl.className = 'pin-marker bg-rose-600';
      destEl.innerHTML = 'B';
      const dMarker = new maplibregl.Marker({ element: destEl })
        .setLngLat(currentRoute.coordinates[currentRoute.coordinates.length - 1])
        .addTo(mapInstance);

      // Moving Vehicle Marker (Toyota Corolla)
      const carEl = document.createElement('div');
      carEl.className = 'vehicle-marker';
      carEl.innerHTML = '🚗';
      const cMarker = new maplibregl.Marker({ element: carEl })
        .setLngLat(currentRoute.coordinates[0])
        .addTo(mapInstance);

      if (type === 'passenger') {
        pOriginMarker = oMarker;
        pDestMarker = dMarker;
        pCarMarker = cMarker;
        fitBounds(pMap);
      } else {
        dOriginMarker = oMarker;
        dDestMarker = dMarker;
        dCarMarker = cMarker;
        fitBounds(dMap);
      }
    }

    function fitBounds(mapInstance) {
      if (!mapInstance || !currentRoute) return;
      const bounds = new maplibregl.LngLatBounds();
      currentRoute.coordinates.forEach(coord => bounds.extend(coord));
      mapInstance.fitBounds(bounds, { padding: 45, maxZoom: 14.5 });
    }

    function passengerMapFitRoute() { fitBounds(pMap); }
    function driverMapFitRoute() { fitBounds(dMap); }

    function passengerMapFollowCar() {
      if (!pMap || !currentRoute) return;
      const coord = currentRoute.coordinates[simProgressIndex];
      pMap.flyTo({ center: coord, zoom: 14.5, speed: 1.2 });
    }

    function driverMapFollowCar() {
      if (!dMap || !currentRoute) return;
      const coord = currentRoute.coordinates[simProgressIndex];
      dMap.flyTo({ center: coord, zoom: 15, speed: 1.2 });
    }

    // Bearing calculation between two coordinates: [lng1, lat1] -> [lng2, lat2]
    function calculateBearing(p1, p2) {
      const lng1 = p1[0] * Math.PI / 180;
      const lat1 = p1[1] * Math.PI / 180;
      const lng2 = p2[0] * Math.PI / 180;
      const lat2 = p2[1] * Math.PI / 180;

      const dLng = lng2 - lng1;
      const y = Math.sin(dLng) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
      let brng = Math.atan2(y, x) * 180 / Math.PI;
      return (brng + 360) % 360;
    }

    // Change Corridor Scenario
    function changeScenario(key) {
      if (!ALAGOAS_ROUTES[key]) return;
      currentRouteKey = key;
      currentRoute = ALAGOAS_ROUTES[key];
      resetSimulation();

      // Update telemetry & headers
      document.getElementById('telemetry-origin').innerText = currentRoute.origin.name;
      document.getElementById('telemetry-destination').innerText = currentRoute.destination.name;
      document.getElementById('telemetry-highways').innerText = currentRoute.highways.join(' / ');
      document.getElementById('telemetry-total-dist').innerText = currentRoute.distanceKm.toFixed(2) + ' km';
      document.getElementById('telemetry-total-eta').innerText = '~' + currentRoute.durationMinutes + ' min';
      document.getElementById('telemetry-remaining-km').innerText = currentRoute.distanceKm.toFixed(2) + ' km';

      document.getElementById('p-card-origin').innerText = currentRoute.origin.name;
      document.getElementById('p-card-destination').innerText = currentRoute.destination.name;

      // Update map lines
      const geojsonRoute = {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: currentRoute.coordinates }
      };

      if (pMap && pMap.getSource('highway-route')) {
        pMap.getSource('highway-route').setData(geojsonRoute);
        pOriginMarker.setLngLat(currentRoute.coordinates[0]);
        pDestMarker.setLngLat(currentRoute.coordinates[currentRoute.coordinates.length - 1]);
        pCarMarker.setLngLat(currentRoute.coordinates[0]);
        fitBounds(pMap);
      }

      if (dMap && dMap.getSource('highway-route')) {
        dMap.getSource('highway-route').setData(geojsonRoute);
        dOriginMarker.setLngLat(currentRoute.coordinates[0]);
        dDestMarker.setLngLat(currentRoute.coordinates[currentRoute.coordinates.length - 1]);
        dCarMarker.setLngLat(currentRoute.coordinates[0]);
        fitBounds(dMap);
      }

      logEvent('SCENARIO', 'Alterado para corredor: ' + currentRoute.name + ' (' + currentRoute.distanceKm + ' km)');
    }

    // ==========================================
    // SIMULATION ENGINE (PHYSICS & INTERPOLATION)
    // ==========================================
    function toggleSimulationPlayback() {
      if (simIsPlaying) {
        pauseSimulation();
      } else {
        startSimulation();
      }
    }

    function startSimulation() {
      if (simIsPlaying) return;
      simIsPlaying = true;
      document.getElementById('play-text').innerText = 'Pausar Viagem';
      document.getElementById('btn-play-pause').className = 'px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition';
      document.getElementById('play-icon').setAttribute('data-lucide', 'pause');
      lucide.createIcons();

      logEvent('SIMULATION', 'Simulação iniciada a ' + simSpeedMultiplier + 'x de velocidade.');

      // Interval tick based on speed multiplier
      const tickMs = Math.max(20, Math.round(100 / simSpeedMultiplier));
      clearInterval(simInterval);
      simInterval = setInterval(stepSimulation, tickMs);
    }

    function pauseSimulation() {
      simIsPlaying = false;
      document.getElementById('play-text').innerText = 'Continuar Viagem';
      document.getElementById('btn-play-pause').className = 'px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition';
      document.getElementById('play-icon').setAttribute('data-lucide', 'play');
      lucide.createIcons();
      clearInterval(simInterval);
      logEvent('SIMULATION', 'Simulação pausada no km ' + ((simProgressIndex / currentRoute.coordinates.length) * currentRoute.distanceKm).toFixed(2));
    }

    function resetSimulation() {
      pauseSimulation();
      simProgressIndex = 0;
      updateSimulationUI();
      if (pCarMarker) pCarMarker.setLngLat(currentRoute.coordinates[0]);
      if (dCarMarker) dCarMarker.setLngLat(currentRoute.coordinates[0]);
      document.getElementById('play-text').innerText = 'Iniciar Viagem';
      logEvent('SIMULATION', 'Simulação reiniciada para o ponto zero.');
    }

    function setSimSpeed(mult) {
      simSpeedMultiplier = mult;
      document.querySelectorAll('.speed-btn').forEach(btn => {
        if (Number(btn.dataset.speed) === mult) {
          btn.className = 'speed-btn px-2.5 py-1 rounded-lg font-bold bg-indigo-600 text-white';
        } else {
          btn.className = 'speed-btn px-2.5 py-1 rounded-lg font-bold text-slate-300 hover:text-white';
        }
      });
      if (simIsPlaying) {
        pauseSimulation();
        startSimulation();
      }
      logEvent('SIMULATION', 'Velocidade ajustada para ' + mult + 'x.');
    }

    function stepSimulation() {
      if (simProgressIndex >= currentRoute.coordinates.length - 1) {
        pauseSimulation();
        onTripCompleted();
        return;
      }

      simProgressIndex++;
      updateSimulationUI();
    }

    function updateSimulationUI() {
      const coords = currentRoute.coordinates;
      const currentPt = coords[simProgressIndex];
      const nextPt = coords[Math.min(simProgressIndex + 1, coords.length - 1)];

      // Calculate bearing angle
      const bearing = calculateBearing(currentPt, nextPt);

      // Move vehicle markers
      if (pCarMarker) {
        pCarMarker.setLngLat(currentPt);
        const el = pCarMarker.getElement();
        if (el) el.style.transform = el.style.transform.replace(/rotate\([^)]*\)/g, '') + ' rotate(' + bearing + 'deg)';
      }
      if (dCarMarker) {
        dCarMarker.setLngLat(currentPt);
        const el = dCarMarker.getElement();
        if (el) el.style.transform = el.style.transform.replace(/rotate\([^)]*\)/g, '') + ' rotate(' + bearing + 'deg)';
      }

      // Calculate progress and remaining distance
      const progressFraction = simProgressIndex / (coords.length - 1);
      const progressPct = (progressFraction * 100).toFixed(1);
      const remainingKm = ((1 - progressFraction) * currentRoute.distanceKm).toFixed(1);
      const remainingMin = Math.max(1, Math.round((1 - progressFraction) * currentRoute.durationMinutes));

      // Realistic speed modulation (50 to 90 km/h on highway)
      const simSpeedKmh = simProgressIndex > 0 && simProgressIndex < coords.length - 1 ? (65 + Math.sin(simProgressIndex) * 15).toFixed(0) : '0';

      // Update Telemetry Bar
      document.getElementById('telemetry-progress-pct').innerText = progressPct + '%';
      document.getElementById('telemetry-remaining-km').innerText = remainingKm + ' km';
      document.getElementById('telemetry-speed').innerText = simSpeedKmh + ' km/h';
      document.getElementById('telemetry-bearing').innerText = Math.round(bearing) + '° (' + getCardinal(bearing) + ')';

      // Update Passenger App Phone UI
      const pProgress = document.getElementById('p-progress-bar');
      if (pProgress) pProgress.style.width = progressPct + '%';
      const pDist = document.getElementById('p-live-remaining-dist');
      if (pDist) pDist.innerText = remainingKm + ' km restantes (~' + remainingMin + ' min)';

      // Update Driver App Phone UI
      const dKm = document.getElementById('d-telemetry-km');
      if (dKm) dKm.innerText = remainingKm + ' km';
      const dMin = document.getElementById('d-telemetry-min');
      if (dMin) dMin.innerText = remainingMin + ' min';
      const dSpd = document.getElementById('d-telemetry-spd');
      if (dSpd) dSpd.innerText = simSpeedKmh + ' km/h';
      const dHudSpd = document.getElementById('d-hud-speed');
      if (dHudSpd) dHudSpd.innerText = simSpeedKmh;

      // Periodically keep cameras centered if in follow mode
      if (simProgressIndex % 8 === 0) {
        if (pMap) pMap.panTo(currentPt, { duration: 300 });
        if (dMap) dMap.panTo(currentPt, { duration: 300 });
      }
    }

    function getCardinal(angle) {
      const directions = ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'];
      return directions[Math.round(angle / 45) % 8];
    }

    // ==========================================
    // PASSENGER APP WORKFLOW
    // ==========================================
    function selectCategory(cat) {
      currentCategory = cat;
      ['economy', 'comfort', 'premium'].forEach(c => {
        const el = document.getElementById('p-cat-' + c);
        if (c === cat) {
          el.className = 'p-3 border-2 border-indigo-600 bg-indigo-50/60 rounded-2xl text-center cursor-pointer transition shadow-xs';
        } else {
          el.className = 'p-3 border-2 border-slate-200 rounded-2xl text-center cursor-pointer hover:border-indigo-500 transition';
        }
      });
    }

    function passengerRequestRide() {
      tripStage = 'SEARCHING';
      document.getElementById('p-state-idle').classList.add('hidden');
      document.getElementById('p-state-searching').classList.remove('hidden');

      logEvent('PASSENGER', 'Marina Silva solicitou categoria Conforto para ' + currentRoute.destination.name + '.');
      logEvent('DISPATCH', 'Buscando motorista mais próximo via Haversine na área de Piaçabuçu...');

      // Driver receives offer after 1.5 seconds
      setTimeout(() => {
        showDriverOffer();
      }, 1500);
    }

    function passengerCancel() {
      tripStage = 'IDLE';
      resetSimulation();
      document.getElementById('p-state-searching').classList.add('hidden');
      document.getElementById('p-state-assigned').classList.add('hidden');
      document.getElementById('p-state-idle').classList.remove('hidden');
      hideDriverOffer();
      logEvent('PASSENGER', 'Corrida cancelada pelo passageiro.');
    }

    function passengerFinishRating() {
      tripStage = 'IDLE';
      resetSimulation();
      document.getElementById('p-state-rating').classList.add('hidden');
      document.getElementById('p-state-idle').classList.remove('hidden');
      logEvent('PASSENGER', 'Avaliação de ' + currentRating + ' estrelas enviada para Carlos Oliveira.');
      alert('Obrigado pela sua avaliação! Corrida intermunicipal finalizada com sucesso.');
    }

    function setRating(val) {
      currentRating = val;
      const stars = document.getElementById('rating-stars').children;
      for (let i = 0; i < 5; i++) {
        stars[i].style.opacity = i < val ? '1' : '0.25';
      }
    }

    // ==========================================
    // DRIVER APP WORKFLOW
    // ==========================================
    let offerCountdown = 15;
    let offerInterval = null;

    function showDriverOffer() {
      document.getElementById('d-state-idle').classList.add('hidden');
      document.getElementById('d-state-offer').classList.remove('hidden');
      offerCountdown = 15;
      document.getElementById('d-offer-timer').innerText = offerCountdown + 's';

      clearInterval(offerInterval);
      offerInterval = setInterval(() => {
        offerCountdown--;
        document.getElementById('d-offer-timer').innerText = offerCountdown + 's';
        if (offerCountdown <= 0) {
          clearInterval(offerInterval);
          driverDeclineOffer();
        }
      }, 1000);

      logEvent('DISPATCH', 'Oferta de corrida enviada para Carlos Oliveira (Corolla BRA2E19).');
    }

    function hideDriverOffer() {
      clearInterval(offerInterval);
      document.getElementById('d-state-offer').classList.add('hidden');
      document.getElementById('d-state-trip').classList.add('hidden');
      document.getElementById('d-state-idle').classList.remove('hidden');
    }

    function driverDeclineOffer() {
      hideDriverOffer();
      logEvent('DRIVER', 'Carlos Oliveira recusou a chamada. Despacho reatribuindo...');
      document.getElementById('p-state-searching').classList.remove('hidden');
    }

    function driverAcceptOffer() {
      clearInterval(offerInterval);
      tripStage = 'ASSIGNED';

      document.getElementById('d-state-offer').classList.add('hidden');
      document.getElementById('d-state-trip').classList.remove('hidden');
      document.getElementById('d-hud-nav').classList.remove('hidden');

      // Update Passenger phone
      document.getElementById('p-state-searching').classList.add('hidden');
      document.getElementById('p-state-assigned').classList.remove('hidden');

      logEvent('DRIVER', 'Carlos Oliveira aceitou a corrida. Status: DRIVER_ARRIVING.');
      logEvent('WEBSOCKET', 'Evento tripAccepted emitido para passageiro e motorista.');
    }

    function driverNotifyArrived() {
      tripStage = 'ARRIVED';
      document.getElementById('btn-driver-arrived').classList.add('hidden');
      document.getElementById('d-pin-verification').classList.remove('hidden');
      document.getElementById('d-trip-stage-text').innerText = 'NO LOCAL DE EMBARQUE';
      document.getElementById('p-trip-stage-badge').innerText = 'Motorista Chegou!';
      document.getElementById('p-trip-stage-badge').className = 'px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 uppercase';
      document.getElementById('p-driver-eta-text').innerText = 'Aguardando no ponto de embarque';

      logEvent('DRIVER', 'Carlos Oliveira chegou ao ponto de embarque em Piaçabuçu.');
      logEvent('WEBSOCKET', 'Evento driverArrived emitido. Código PIN requerido: 4821.');
    }

    function driverStartTrip() {
      tripStage = 'IN_PROGRESS';
      document.getElementById('d-pin-verification').classList.add('hidden');
      document.getElementById('btn-driver-complete').classList.remove('hidden');
      document.getElementById('d-trip-stage-text').innerText = 'VIAGEM EM ANDAMENTO';
      document.getElementById('p-trip-stage-badge').innerText = 'Em Viagem para Penedo';
      document.getElementById('p-driver-eta-text').innerText = 'Trajeto Rodoviário AL-101 / AL-225';

      logEvent('SECURITY', 'PIN 4821 validado com sucesso!');
      logEvent('TRIP', 'Viagem iniciada com destino ao Centro Histórico de Penedo.');

      // Start simulation physics automatically
      startSimulation();
    }

    function onTripCompleted() {
      tripStage = 'COMPLETED';
      document.getElementById('d-hud-nav').classList.add('hidden');
      document.getElementById('d-state-trip').classList.add('hidden');
      document.getElementById('d-state-summary').classList.remove('hidden');

      document.getElementById('p-state-assigned').classList.add('hidden');
      document.getElementById('p-state-rating').classList.remove('hidden');

      logEvent('TRIP', 'Viagem concluída no destino: ' + currentRoute.destination.name);
      logEvent('PAYMENT', 'Pagamento de R$ 68,01 processado automaticamente.');
      logEvent('ADMIN', 'Auditoria registrada em mobility.sqlite.');
    }

    function driverFinishTrip() {
      onTripCompleted();
    }

    function driverResetToIdle() {
      document.getElementById('d-state-summary').classList.add('hidden');
      document.getElementById('d-state-idle').classList.remove('hidden');
      resetSimulation();
      logEvent('DRIVER', 'Carlos Oliveira voltou a ficar disponível para novas corridas.');
    }

    function toggleDriverOnline() {
      const btn = document.getElementById('btn-driver-online');
      if (btn.innerText === 'ONLINE') {
        btn.innerText = 'OFFLINE';
        btn.className = 'px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-black text-xs';
        logEvent('DRIVER', 'Motorista ficou OFFLINE.');
      } else {
        btn.innerText = 'ONLINE';
        btn.className = 'px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs';
        logEvent('DRIVER', 'Motorista ficou ONLINE em Piaçabuçu.');
      }
    }

    // ==========================================
    // VIEW CONTROLS & LOGGING
    // ==========================================
    function setViewMode(mode) {
      const pContainer = document.getElementById('phone-passenger-container');
      const dContainer = document.getElementById('phone-driver-container');
      const bDual = document.getElementById('btn-view-dual');
      const bPass = document.getElementById('btn-view-passenger');
      const bDriv = document.getElementById('btn-view-driver');

      bDual.className = 'px-3 py-1 rounded-lg font-bold text-slate-300 hover:text-white';
      bPass.className = 'px-3 py-1 rounded-lg font-bold text-slate-300 hover:text-white';
      bDriv.className = 'px-3 py-1 rounded-lg font-bold text-slate-300 hover:text-white';

      if (mode === 'dual') {
        pContainer.classList.remove('hidden');
        dContainer.classList.remove('hidden');
        bDual.className = 'px-3 py-1 rounded-lg font-bold bg-indigo-600 text-white';
      } else if (mode === 'passenger') {
        pContainer.classList.remove('hidden');
        dContainer.classList.add('hidden');
        bPass.className = 'px-3 py-1 rounded-lg font-bold bg-indigo-600 text-white';
      } else if (mode === 'driver') {
        pContainer.classList.add('hidden');
        dContainer.classList.remove('hidden');
        bDriv.className = 'px-3 py-1 rounded-lg font-bold bg-indigo-600 text-white';
      }

      setTimeout(() => {
        if (pMap) pMap.resize();
        if (dMap) dMap.resize();
      }, 200);
    }

    function changePhoneScale(scale) {
      document.getElementById('simulators-wrapper').style.transform = 'scale(' + scale + ')';
    }

    function toggleTheme() {
      document.documentElement.classList.toggle('dark');
    }

    let logCounter = 0;
    function logEvent(source, msg) {
      logCounter++;
      const time = new Date().toLocaleTimeString('pt-BR');
      const consoleEl = document.getElementById('log-console');
      const p = document.createElement('p');
      
      let badgeColor = 'text-indigo-400';
      if (source === 'PASSENGER') badgeColor = 'text-cyan-400';
      if (source === 'DRIVER') badgeColor = 'text-emerald-400';
      if (source === 'TRIP' || source === 'PAYMENT') badgeColor = 'text-amber-400';
      if (source === 'SECURITY') badgeColor = 'text-rose-400';

      p.innerHTML = '<span class="text-slate-500">[' + time + ']</span> <b class="' + badgeColor + '">[' + source + ']</b> ' + msg;
      consoleEl.appendChild(p);
      consoleEl.scrollTop = consoleEl.scrollHeight;
      document.getElementById('log-count').innerText = logCounter + ' eventos';
    }

    function clearLogs() {
      document.getElementById('log-console').innerHTML = '<p class="text-slate-500">// Logs limpos.</p>';
      logCounter = 0;
      document.getElementById('log-count').innerText = '0 eventos';
    }
  </script>
</body>
</html>`;

// Write to Artifact directory
const artifactPath = 'C:\\Users\\winc\\.gemini\\antigravity\\brain\\0e4110ac-259e-4ca3-a9b7-c49d7be31808\\mobility_interactive_studio.html';
fs.writeFileSync(artifactPath, htmlContent, 'utf8');

// Write to Scratch project directory
const scratchPath = 'C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\mobility_interactive_studio.html';
fs.writeFileSync(scratchPath, htmlContent, 'utf8');

console.log(`✅ Mobility Studio 2.0 gerado com sucesso em:\n- ${artifactPath}\n- ${scratchPath}`);
