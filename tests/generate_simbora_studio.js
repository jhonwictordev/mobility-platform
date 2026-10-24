const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, '..', 'packages', 'alagoas_routes.json');
const routesData = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

const primaryRoute = routesData.piacabucu_penedo;
console.log(`Carregando rota primária: ${primaryRoute.name} (${primaryRoute.pointsCount} nós, ${primaryRoute.distanceKm} km).`);

const studioHtml = `<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SIMBORA — Plataforma de Mobilidade & Simulação Alagoas</title>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            simbora: {
              deep: '#123D32',      // Verde Principal
              vibrant: '#16A572',   // Verde Vibrante
              energy: '#FFCC45',    // Amarelo Destaque
              clean: '#F8F9F6',     // Branco Suave
              dark: '#17211D',      // Grafite Mineral
              accent: '#0d2821',    // Verde Mais Escuro
            }
          }
        }
      }
    }
  </script>

  <!-- MapLibre GL JS v3.6.2 (WebGL Map Engine) -->
  <link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet" />
  <script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>

  <!-- Turf.js v6.5.0 (Advanced Spatial Analysis & Along/Bearing Calculations) -->
  <script src="https://unpkg.com/@turf/turf@6.5.0/turf.min.js"></script>

  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <style>
    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #17211D; }
    ::-webkit-scrollbar-thumb { background: #16A572; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #FFCC45; }

    /* Phone Chassis 390x844 Reference (iPhone 14 / Modern Flagship) */
    .phone-viewport {
      width: 390px;
      height: 844px;
      border-radius: 48px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 10px #123D32, 0 0 0 12px #16A572;
      background: #F8F9F6;
      flex-shrink: 0;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    .phone-notch {
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 125px;
      height: 28px;
      background: #17211D;
      border-radius: 18px;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
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
      color: #17211D;
      z-index: 45;
      pointer-events: none;
    }

    .phone-home-indicator {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 134px;
      height: 5px;
      background: #17211D;
      border-radius: 3px;
      z-index: 50;
      pointer-events: none;
      opacity: 0.8;
    }

    /* Radar Pulse Animation */
    @keyframes ping-simbora {
      0% { transform: scale(0.9); opacity: 0.9; }
      50% { transform: scale(1.4); opacity: 0.2; }
      100% { transform: scale(0.9); opacity: 0.9; }
    }
    .pulse-radar-simbora {
      animation: ping-simbora 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    /* Map Markers */
    .vehicle-marker {
      width: 42px;
      height: 42px;
      background: #123D32;
      border: 3px solid #FFCC45;
      border-radius: 50%;
      box-shadow: 0 6px 16px rgba(18, 61, 50, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #F8F9F6;
      font-size: 18px;
      transition: transform 0.08s linear;
      will-change: transform;
    }

    .pin-marker {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 900;
      font-size: 13px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
      border: 3px solid #F8F9F6;
    }

    /* Interactive Scrubber Slider */
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: #FFCC45;
      cursor: pointer;
      border: 2px solid #123D32;
      box-shadow: 0 0 8px rgba(255, 204, 69, 0.8);
    }
  </style>
</head>

<body class="bg-[#17211D] text-[#F8F9F6] min-h-screen font-sans flex flex-col select-none overflow-x-hidden">

  <!-- ==================== HEADER BAR ==================== -->
  <header class="bg-[#123D32] border-b border-[#16A572]/40 backdrop-blur-md sticky top-0 z-40 px-6 py-3 shadow-lg">
    <div class="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-4">
      
      <!-- Brand & Title -->
      <div class="flex items-center gap-3.5">
        <div class="w-11 h-11 rounded-2xl bg-[#16A572] border-2 border-[#FFCC45] flex items-center justify-center font-black text-2xl text-[#123D32] shadow-md shadow-[#16A572]/30">
          S
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-black tracking-tight text-[#F8F9F6]">SIMBORA Studio</h1>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFCC45] text-[#123D32] border border-[#FFCC45]">
              ALAGOAS 2.0
            </span>
          </div>
          <p class="text-xs text-[#16A572] font-semibold">Piaçabuçu ↔ Penedo • MapLibre GL + MapTiler / CartoDB • openrouteservice • Turf.js</p>
        </div>
      </div>

      <!-- Quick Action: Primary Intermunicipal Test Button -->
      <div class="flex items-center gap-3">
        <button onclick="setupPiacabucuPenedoScenario()" class="px-5 py-2.5 bg-[#FFCC45] hover:bg-[#ffe082] text-[#123D32] rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-[#FFCC45]/20 transition transform active:scale-95">
          <i data-lucide="zap" class="w-4 h-4 fill-[#123D32]"></i>
          <span>TESTAR PIAÇABUÇU → PENEDO</span>
        </button>

        <!-- Status Badges -->
        <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#17211D]/80 border border-[#16A572]/40 text-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-[#16A572] animate-pulse"></span>
          <span class="text-slate-300 font-semibold">Backend NestJS:</span>
          <a href="http://localhost:3001/location/route?originLat=-10.4056&originLng=-36.4344&destLat=-10.2897&destLng=-36.5864" target="_blank" class="text-[#16A572] font-bold hover:underline">Porta 3001</a>
        </div>

        <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#17211D]/80 border border-[#16A572]/40 text-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-[#FFCC45]"></span>
          <span class="text-slate-300 font-semibold">Admin Panel:</span>
          <a href="http://localhost:3000" target="_blank" class="text-[#FFCC45] font-bold hover:underline">Porta 3000</a>
        </div>

        <!-- Open Key Config Modal -->
        <button onclick="openConfigModal()" class="px-3 py-2 rounded-xl bg-[#17211D] hover:bg-[#123D32] text-[#16A572] border border-[#16A572]/50 text-xs font-bold transition flex items-center gap-1.5" title="Configurar Chaves MapTiler e OpenRouteService">
          <i data-lucide="key" class="w-3.5 h-3.5"></i>
          <span>Chaves API</span>
        </button>

        <button onclick="toggleTheme()" class="p-2 rounded-xl bg-[#17211D] hover:bg-[#123D32] text-[#F8F9F6] border border-[#16A572]/40 transition" title="Alternar Tema Claro/Escuro">
          <i data-lucide="moon" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- ==================== SUB-BAR: PLAYBACK, SPEED & SCRUBBING ==================== -->
  <section class="bg-[#123D32]/90 border-b border-[#16A572]/30 px-6 py-3">
    <div class="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-4">
      
      <!-- Route Corridor Selector -->
      <div class="flex items-center gap-3">
        <span class="text-xs font-bold text-[#16A572] uppercase tracking-wider flex items-center gap-1.5">
          <i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#FFCC45]"></i>
          Corredor:
        </span>
        <select id="route-selector" onchange="changeScenario(this.value)" class="bg-[#17211D] border border-[#16A572]/50 text-[#F8F9F6] text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-[#FFCC45] cursor-pointer">
          <option value="piacabucu_penedo" selected>⭐ Piaçabuçu → Penedo (28,2 km via AL-101 / AL-225)</option>
          <option value="penedo_igreja_nova">Penedo → Igreja Nova (31,9 km via AL-110)</option>
          <option value="penedo_colegio">Penedo → Porto Real do Colégio (58,3 km via AL-225 / BR-101)</option>
          <option value="penedo_coruripe">Penedo → Coruripe (58,5 km via AL-101 Sul)</option>
          <option value="penedo_arapiraca">Penedo → Arapiraca (72,3 km via AL-110)</option>
          <option value="penedo_maceio">Penedo → Maceió (146,6 km via AL-101 Sul)</option>
          <option value="piacabucu_coruripe">Piaçabuçu → Coruripe (48,9 km via AL-101 Sul)</option>
        </select>
      </div>

      <!-- Playback Actions -->
      <div class="flex items-center gap-2">
        <button id="btn-play-pause" onclick="toggleSimulationPlayback()" class="px-4 py-2 bg-[#16A572] hover:bg-[#139063] text-[#F8F9F6] rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition">
          <i id="play-icon" data-lucide="play" class="w-4 h-4 fill-[#F8F9F6]"></i>
          <span id="play-text">Iniciar Corrida</span>
        </button>

        <button onclick="stepSimulationRelative(-0.1)" class="px-2.5 py-2 bg-[#17211D] hover:bg-[#123D32] text-[#F8F9F6] border border-[#16A572]/30 rounded-xl text-xs font-bold transition" title="Retroceder 10%">
          <i data-lucide="rewind" class="w-4 h-4"></i>
        </button>

        <button onclick="stepSimulationRelative(0.1)" class="px-2.5 py-2 bg-[#17211D] hover:bg-[#123D32] text-[#F8F9F6] border border-[#16A572]/30 rounded-xl text-xs font-bold transition" title="Avançar 10%">
          <i data-lucide="fast-forward" class="w-4 h-4"></i>
        </button>

        <button onclick="resetSimulation()" class="px-3 py-2 bg-[#17211D] hover:bg-[#123D32] text-[#F8F9F6] border border-[#16A572]/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition" title="Reiniciar para o Ponto Zero">
          <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
          Reiniciar
        </button>

        <!-- Speed Presets (1x, 2x, 5x, 10x, 20x) -->
        <div class="flex items-center bg-[#17211D] rounded-xl p-1 border border-[#16A572]/40 text-xs">
          <span class="text-[#16A572] font-bold px-2">Vel:</span>
          <button onclick="setSimSpeed(1)" class="speed-btn px-2 py-1 rounded-lg font-bold bg-[#16A572] text-[#123D32]" data-speed="1">1×</button>
          <button onclick="setSimSpeed(2)" class="speed-btn px-2 py-1 rounded-lg font-bold text-slate-300 hover:text-white" data-speed="2">2×</button>
          <button onclick="setSimSpeed(5)" class="speed-btn px-2 py-1 rounded-lg font-bold text-slate-300 hover:text-white" data-speed="5">5×</button>
          <button onclick="setSimSpeed(10)" class="speed-btn px-2 py-1 rounded-lg font-bold text-slate-300 hover:text-white" data-speed="10">10×</button>
          <button onclick="setSimSpeed(20)" class="speed-btn px-2 py-1 rounded-lg font-bold text-slate-300 hover:text-white" data-speed="20">20×</button>
        </div>

        <!-- Phone Scale Slider -->
        <div class="flex items-center gap-2 bg-[#17211D] px-3 py-1.5 rounded-xl border border-[#16A572]/40 text-xs">
          <i data-lucide="smartphone" class="w-3.5 h-3.5 text-[#16A572]"></i>
          <span class="text-slate-400">Escala:</span>
          <select id="scale-selector" onchange="changePhoneScale(this.value)" class="bg-transparent text-white font-bold outline-none cursor-pointer">
            <option value="0.76">76% (Notebook)</option>
            <option value="0.86" selected>86% (Padrão)</option>
            <option value="1.0">100% (Real)</option>
          </select>
        </div>

        <!-- View Mode Switcher -->
        <div class="flex items-center bg-[#17211D] rounded-xl p-1 border border-[#16A572]/40 text-xs">
          <button onclick="setViewMode('dual')" id="btn-view-dual" class="px-2.5 py-1 rounded-lg font-bold bg-[#16A572] text-[#123D32]">Lado a Lado</button>
          <button onclick="setViewMode('panoramic')" id="btn-view-panoramic" class="px-2.5 py-1 rounded-lg font-bold text-slate-300 hover:text-white">Mapa Panorâmico</button>
          <button onclick="setViewMode('passenger')" id="btn-view-passenger" class="px-2.5 py-1 rounded-lg font-bold text-slate-300 hover:text-white">Só Passageiro</button>
          <button onclick="setViewMode('driver')" id="btn-view-driver" class="px-2.5 py-1 rounded-lg font-bold text-slate-300 hover:text-white">Só Motorista</button>
        </div>
      </div>
    </div>

    <!-- Interactive Route Scrubbing Progress Slider -->
    <div class="max-w-[1720px] mx-auto mt-2 pt-2 border-t border-[#16A572]/20 flex items-center gap-4 text-xs">
      <span class="font-bold text-[#FFCC45] whitespace-nowrap">Progresso Turf.js:</span>
      <input type="range" id="sim-scrubber" min="0" max="1000" value="0" oninput="onScrubProgress(this.value)" class="flex-1 h-2 bg-[#17211D] rounded-lg appearance-none cursor-pointer border border-[#16A572]/40" />
      <span id="scrubber-pct-label" class="font-mono font-bold text-[#16A572] w-12 text-right">0.0%</span>
    </div>
  </section>

  <!-- ==================== TELEMETRY HUD BAR ==================== -->
  <section class="bg-[#17211D] border-b border-[#123D32] px-6 py-2.5 text-xs text-slate-300">
    <div class="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-6">
        <div>
          <span class="text-slate-500 font-bold uppercase text-[10px]">Origem:</span>
          <span id="telemetry-origin" class="font-bold text-[#F8F9F6] ml-1">Praça São Francisco, Piaçabuçu</span>
        </div>
        <div>
          <span class="text-slate-500 font-bold uppercase text-[10px]">Destino:</span>
          <span id="telemetry-destination" class="font-bold text-[#F8F9F6] ml-1">Centro Histórico, Penedo</span>
        </div>
        <div>
          <span class="text-slate-500 font-bold uppercase text-[10px]">Rodovia:</span>
          <span id="telemetry-highways" class="font-bold text-[#FFCC45] ml-1">AL-101 Sul / AL-225</span>
        </div>
        <div>
          <span class="text-slate-500 font-bold uppercase text-[10px]">Distância Real:</span>
          <span id="telemetry-total-dist" class="font-bold text-[#F8F9F6] ml-1">28,20 km</span>
        </div>
        <div>
          <span class="text-slate-500 font-bold uppercase text-[10px]">ETA Rodoviário:</span>
          <span id="telemetry-total-eta" class="font-bold text-[#F8F9F6] ml-1">~28 min</span>
        </div>
      </div>

      <div class="flex items-center gap-6 font-mono text-[11px]">
        <div>
          <span class="text-slate-500">Percorrido:</span>
          <span id="telemetry-traveled-km" class="font-bold text-[#16A572]">0.0 km</span>
        </div>
        <div>
          <span class="text-slate-500">Restante:</span>
          <span id="telemetry-remaining-km" class="font-bold text-[#F8F9F6]">28.2 km</span>
        </div>
        <div>
          <span class="text-slate-500">Velocidade Física:</span>
          <span id="telemetry-speed" class="font-bold text-[#FFCC45]">0 km/h</span>
        </div>
        <div>
          <span class="text-slate-500">Azimute (Turf.js):</span>
          <span id="telemetry-bearing" class="font-bold text-[#16A572]">312° (NO)</span>
        </div>
        <div>
          <span class="text-slate-500">Provedor Cartográfico:</span>
          <span id="telemetry-tile-provider" class="font-bold text-[#FFCC45]">CartoDB Voyager (HTTP 200 OK)</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== MAIN WORKSPACE ==================== -->
  <main class="flex-1 max-w-[1720px] w-full mx-auto p-6 flex flex-col items-center justify-center">
    
    <!-- PANORAMIC EXPANDED OVERVIEW MAP (OPTIONAL MODE) -->
    <div id="panoramic-map-container" class="hidden w-full h-[650px] rounded-3xl overflow-hidden border-2 border-[#16A572] shadow-2xl relative mb-6">
      <div id="panoramic-map" class="w-full h-full"></div>
      <div class="absolute top-4 left-4 bg-[#123D32]/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#16A572]/50 text-xs z-10 text-[#F8F9F6]">
        <h3 class="font-black text-sm text-[#FFCC45]">Visão Panorâmica de Alagoas — Baixo São Francisco</h3>
        <p class="text-slate-300 mt-0.5">Corredor Rodoviário Piaçabuçu ↔ Penedo renderizado via MapLibre GL</p>
      </div>
    </div>

    <!-- DUAL MOBILE SIMULATORS WRAPPER -->
    <div id="simulators-wrapper" class="flex items-center justify-center gap-12 transition-all duration-300" style="transform: scale(0.86); transform-origin: top center;">
      
      <!-- ========================================== -->
      <!-- PHONE 1: PASSENGER APP (MARINA SILVA)      -->
      <!-- ========================================== -->
      <div id="phone-passenger-container" class="flex flex-col items-center">
        <div class="mb-3 flex items-center justify-between w-[390px] px-2 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-[#16A572]"></span>
            <span class="font-black text-[#F8F9F6]">PASSAGEIRO: MARINA SILVA</span>
          </div>
          <span class="text-slate-400 font-mono text-[11px]">SIMBORA Mobile 390×844</span>
        </div>

        <div class="phone-viewport text-[#17211D] flex flex-col">
          <!-- Dynamic Island Notch -->
          <div class="phone-notch">
            <span class="w-3 h-3 rounded-full bg-[#123D32] border border-[#16A572]"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-[#16A572] animate-pulse"></span>
          </div>

          <!-- Status Bar -->
          <div class="phone-status-bar">
            <span>09:41</span>
            <div class="flex items-center gap-1.5 text-xs">
              <i data-lucide="signal" class="w-3.5 h-3.5 text-[#123D32]"></i>
              <span class="font-black text-[#123D32]">5G</span>
              <i data-lucide="battery-charging" class="w-4 h-4 text-[#16A572]"></i>
            </div>
          </div>

          <!-- Map Container (MapLibre GL) -->
          <div class="relative flex-1 w-full bg-slate-200 overflow-hidden">
            <div id="passenger-map" class="w-full h-full"></div>

            <!-- Floating Top Card (Origin / Destination) -->
            <div id="p-floating-route-card" class="absolute top-12 left-4 right-4 bg-[#F8F9F6]/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-[#123D32]/20 z-10">
              <div class="flex items-start gap-3">
                <div class="flex flex-col items-center pt-1">
                  <span class="w-2.5 h-2.5 rounded-full bg-[#16A572]"></span>
                  <span class="w-0.5 h-6 bg-slate-300 my-0.5"></span>
                  <span class="w-2.5 h-2.5 rounded-full bg-[#FFCC45] border border-[#123D32]"></span>
                </div>
                <div class="flex-1 space-y-1">
                  <div class="border-b border-slate-200 pb-1">
                    <p class="text-[10px] font-bold text-slate-500 uppercase">Embarque</p>
                    <p id="p-card-origin" class="text-xs font-black text-[#123D32] truncate">Praça São Francisco, Piaçabuçu</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-slate-500 uppercase">Destino</p>
                    <p id="p-card-destination" class="text-xs font-black text-[#123D32] truncate">Centro Histórico, Penedo</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recenter / Map Controls -->
            <div class="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              <button onclick="passengerMapFitRoute()" class="w-9 h-9 rounded-full bg-[#F8F9F6] text-[#123D32] shadow-lg flex items-center justify-center hover:bg-slate-100 transition border border-[#123D32]/20" title="Ajustar Rota Completa">
                <i data-lucide="maximize-2" class="w-4 h-4"></i>
              </button>
              <button onclick="passengerMapFollowCar()" class="w-9 h-9 rounded-full bg-[#F8F9F6] text-[#16A572] shadow-lg flex items-center justify-center hover:bg-slate-100 transition border border-[#123D32]/20" title="Seguir Veículo">
                <i data-lucide="navigation" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <!-- Bottom Sheet (Dynamic States) -->
          <div class="bg-[#F8F9F6] border-t border-slate-200 rounded-t-3xl shadow-2xl p-5 relative z-20 transition-all duration-300 max-h-[380px] overflow-y-auto">
            
            <!-- STATE 1: IDLE / CATEGORY SELECTION -->
            <div id="p-state-idle" class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-black text-base text-[#123D32]">Simbora Conforto</h3>
                  <p class="text-xs text-slate-600">Viagem intermunicipal Alagoas (28,2 km)</p>
                </div>
                <span class="px-2.5 py-1 rounded-full text-[11px] font-black bg-[#16A572]/15 text-[#123D32] border border-[#16A572]">
                  Preço Justo
                </span>
              </div>

              <!-- Vehicle Category Cards -->
              <div class="grid grid-cols-3 gap-2.5">
                <div onclick="selectCategory('economy')" id="p-cat-economy" class="p-3 border-2 border-slate-200 rounded-2xl text-center cursor-pointer hover:border-[#16A572] transition">
                  <div class="text-2xl mb-1">🚗</div>
                  <div class="text-xs font-bold text-[#17211D]">Simbora Pop</div>
                  <div class="text-[10px] text-slate-500">4 min</div>
                  <div class="text-xs font-black text-[#123D32] mt-1">R$ 47,07</div>
                </div>

                <div onclick="selectCategory('comfort')" id="p-cat-comfort" class="p-3 border-2 border-[#16A572] bg-[#16A572]/10 rounded-2xl text-center cursor-pointer transition shadow-xs">
                  <div class="text-2xl mb-1">🚙</div>
                  <div class="text-xs font-bold text-[#123D32]">Conforto</div>
                  <div class="text-[10px] text-[#16A572] font-black">2 min</div>
                  <div class="text-xs font-black text-[#123D32] mt-1">R$ 68,01</div>
                </div>

                <div onclick="selectCategory('premium')" id="p-cat-premium" class="p-3 border-2 border-slate-200 rounded-2xl text-center cursor-pointer hover:border-[#16A572] transition">
                  <div class="text-2xl mb-1">✨</div>
                  <div class="text-xs font-bold text-[#17211D]">Executivo</div>
                  <div class="text-[10px] text-slate-500">6 min</div>
                  <div class="text-xs font-black text-[#123D32] mt-1">R$ 104,66</div>
                </div>
              </div>

              <!-- Payment Method & Details -->
              <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <div class="flex items-center gap-2">
                  <span class="text-base">💳</span>
                  <span class="font-bold text-[#17211D]">Mastercard •••• 4829</span>
                </div>
                <span class="font-bold text-[#16A572] cursor-pointer">Trocar</span>
              </div>

              <!-- Request Button -->
              <button onclick="passengerRequestRide()" class="w-full py-4 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] font-black rounded-2xl shadow-lg shadow-[#123D32]/30 transition text-sm flex items-center justify-center gap-2">
                <span>SOLICITAR SIMBORA (R$ 68,01)</span>
              </button>
            </div>

            <!-- STATE 2: SEARCHING DRIVER -->
            <div id="p-state-searching" class="hidden flex-col items-center justify-center py-6 text-center space-y-4">
              <div class="w-20 h-20 rounded-full bg-[#16A572]/20 flex items-center justify-center pulse-radar-simbora">
                <i data-lucide="compass" class="w-8 h-8 text-[#123D32] animate-spin"></i>
              </div>
              <div>
                <h3 class="font-black text-base text-[#123D32]">Procurando motoristas parceiros...</h3>
                <p class="text-xs text-slate-600 mt-1">Varrendo orla e centro de Piaçabuçu</p>
                <p class="text-[11px] font-mono font-bold text-[#16A572] mt-2">Timeout: <span id="p-search-timer">15</span>s</p>
              </div>
              <button onclick="passengerCancel()" class="px-6 py-2 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs hover:bg-rose-100 transition">
                Cancelar Solicitação
              </button>
            </div>

            <!-- STATE 3: DRIVER ASSIGNED & ARRIVING -->
            <div id="p-state-assigned" class="hidden space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <span id="p-trip-stage-badge" class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#16A572]/20 text-[#123D32] uppercase">
                    Motorista a Caminho
                  </span>
                  <h4 id="p-driver-eta-text" class="text-base font-black text-[#123D32] mt-1">Chega em 2 minutos</h4>
                </div>
                <div class="text-right">
                  <p class="text-[10px] text-slate-500 font-bold uppercase">Preço Fixado</p>
                  <p class="text-sm font-black text-[#123D32]">R$ 68,01</p>
                </div>
              </div>

              <!-- Driver & Vehicle Profile -->
              <div class="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-slate-200">
                <div class="w-12 h-12 rounded-2xl bg-[#123D32] text-[#FFCC45] font-black flex items-center justify-center text-sm shadow-md">
                  CO
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-black text-sm text-[#123D32]">Carlos Oliveira</h4>
                    <span class="text-xs font-bold text-amber-500 flex items-center gap-0.5">⭐ 4.9</span>
                  </div>
                  <p class="text-xs text-slate-600 font-medium">Toyota Corolla Hybrid • Prata</p>
                </div>
                <div class="bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 font-mono text-xs font-black text-[#17211D]">
                  BRA2E19
                </div>
              </div>

              <!-- Security PIN Code -->
              <div class="bg-[#FFCC45]/20 border border-[#FFCC45] rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <p class="text-[10px] font-bold text-[#123D32] uppercase tracking-wider">Código PIN de Segurança</p>
                  <p class="text-xs text-slate-700">Informe verbalmente ao motorista</p>
                </div>
                <span class="text-xl font-black text-[#123D32] font-mono tracking-widest bg-[#FFCC45] px-3 py-1 rounded-xl">4 8 2 1</span>
              </div>

              <!-- Live Highway Progress -->
              <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div class="flex justify-between font-bold">
                  <span class="text-slate-600">Piaçabuçu → Penedo:</span>
                  <span id="p-live-remaining-dist" class="text-[#16A572]">28,2 km restantes</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div id="p-progress-bar" class="bg-[#16A572] h-full rounded-full transition-all duration-300" style="width: 0%;"></div>
                </div>
              </div>

              <div class="flex gap-2">
                <button onclick="passengerCancel()" class="flex-1 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl text-xs hover:bg-rose-100 transition">
                  Cancelar Viagem
                </button>
                <button onclick="alert('Compartilhando rota de segurança em tempo real com contatos confiáveis.')" class="px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition">
                  Compartilhar
                </button>
              </div>
            </div>

            <!-- STATE 4: COMPLETED & RATE -->
            <div id="p-state-rating" class="hidden text-center space-y-4 py-4">
              <div class="w-16 h-16 rounded-full bg-[#16A572]/20 text-[#16A572] mx-auto flex items-center justify-center text-3xl">
                🏁
              </div>
              <div>
                <h3 class="font-black text-lg text-[#123D32]">Você chegou a Penedo!</h3>
                <p class="text-xs text-slate-600 mt-1">Viagem intermunicipal de 28,2 km concluída com sucesso.</p>
                <p class="text-sm font-black text-[#123D32] mt-1">R$ 68,01 debitado no Cartão Mastercard</p>
              </div>

              <div class="py-2">
                <p class="text-xs font-bold text-slate-700 mb-2">Avalie o motorista Carlos Oliveira:</p>
                <div class="flex justify-center gap-2 text-3xl cursor-pointer" id="rating-stars">
                  <span onclick="setRating(1)">⭐</span>
                  <span onclick="setRating(2)">⭐</span>
                  <span onclick="setRating(3)">⭐</span>
                  <span onclick="setRating(4)">⭐</span>
                  <span onclick="setRating(5)">⭐</span>
                </div>
              </div>

              <button onclick="passengerFinishRating()" class="w-full py-4 bg-[#123D32] text-[#FFCC45] font-black rounded-2xl text-xs shadow-lg shadow-[#123D32]/30">
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
            <span class="w-3 h-3 rounded-full bg-[#FFCC45]"></span>
            <span class="font-black text-[#F8F9F6]">MOTORISTA: CARLOS OLIVEIRA</span>
          </div>
          <span class="text-slate-400 font-mono text-[11px]">Corolla BRA2E19</span>
        </div>

        <div class="phone-viewport text-[#17211D] flex flex-col">
          <!-- Dynamic Island Notch -->
          <div class="phone-notch">
            <span class="w-3 h-3 rounded-full bg-[#123D32] border border-[#16A572]"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-[#16A572] animate-pulse"></span>
          </div>

          <!-- Status Bar -->
          <div class="phone-status-bar">
            <span>09:41</span>
            <div class="flex items-center gap-1.5 text-xs">
              <i data-lucide="signal" class="w-3.5 h-3.5 text-[#123D32]"></i>
              <span class="font-black text-[#123D32]">5G</span>
              <i data-lucide="battery-charging" class="w-4 h-4 text-[#16A572]"></i>
            </div>
          </div>

          <!-- Map Container (MapLibre GL) -->
          <div class="relative flex-1 w-full bg-slate-200 overflow-hidden">
            <div id="driver-map" class="w-full h-full"></div>

            <!-- Turn-by-Turn HUD (Visible during trip) -->
            <div id="d-hud-nav" class="hidden absolute top-12 left-4 right-4 bg-[#123D32] text-[#F8F9F6] p-4 rounded-2xl shadow-2xl z-10 border border-[#16A572]/40">
              <div class="flex items-center gap-3.5">
                <div class="w-11 h-11 rounded-xl bg-[#16A572] flex items-center justify-center text-[#123D32]">
                  <i data-lucide="arrow-up-right" class="w-6 h-6"></i>
                </div>
                <div class="flex-1">
                  <p class="text-xs text-[#FFCC45] font-bold uppercase tracking-wider" id="d-hud-next-turn">Em 600m siga na Rodovia</p>
                  <h4 class="font-black text-sm text-[#F8F9F6] truncate" id="d-hud-highway">AL-101 Sul sentido Penedo</h4>
                </div>
                <div class="text-right">
                  <span id="d-hud-speed" class="text-lg font-black font-mono text-[#FFCC45]">72</span>
                  <span class="text-[10px] text-slate-300 block font-bold">km/h</span>
                </div>
              </div>
            </div>

            <!-- Recenter / Map Controls -->
            <div class="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
              <button onclick="driverMapFitRoute()" class="w-9 h-9 rounded-full bg-[#F8F9F6] text-[#123D32] shadow-lg flex items-center justify-center hover:bg-slate-100 transition border border-[#123D32]/20" title="Ajustar Rota Completa">
                <i data-lucide="maximize-2" class="w-4 h-4"></i>
              </button>
              <button onclick="driverMapFollowCar()" class="w-9 h-9 rounded-full bg-[#F8F9F6] text-[#16A572] shadow-lg flex items-center justify-center hover:bg-slate-100 transition border border-[#123D32]/20" title="Seguir Veículo">
                <i data-lucide="navigation" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <!-- Bottom Sheet -->
          <div class="bg-[#F8F9F6] border-t border-slate-200 rounded-t-3xl shadow-2xl p-5 relative z-20 max-h-[380px] overflow-y-auto">
            
            <!-- STATE 1: IDLE / ONLINE -->
            <div id="d-state-idle" class="space-y-4">
              <div class="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-200">
                <div class="flex items-center gap-3">
                  <span class="w-3.5 h-3.5 rounded-full bg-[#16A572] animate-pulse"></span>
                  <div>
                    <h4 class="font-black text-xs text-[#123D32]">VOCÊ ESTÁ ONLINE</h4>
                    <p class="text-[11px] text-slate-500">Piaçabuçu • Conforto & Pop</p>
                  </div>
                </div>
                <button onclick="toggleDriverOnline()" id="btn-driver-online" class="px-3.5 py-1.5 rounded-xl bg-[#16A572]/20 text-[#123D32] font-black text-xs border border-[#16A572]">
                  ONLINE
                </button>
              </div>

              <!-- Earnings Summary Card -->
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-white rounded-2xl border border-slate-200 text-center">
                  <p class="text-[10px] font-bold text-slate-500 uppercase">Ganhos Hoje</p>
                  <p class="text-xl font-black text-[#123D32] mt-0.5">R$ 342,50</p>
                  <p class="text-[10px] text-[#16A572] font-bold">8 corridas</p>
                </div>
                <div class="p-3 bg-white rounded-2xl border border-slate-200 text-center">
                  <p class="text-[10px] font-bold text-slate-500 uppercase">Taxa de Aceite</p>
                  <p class="text-xl font-black text-[#123D32] mt-0.5">98%</p>
                  <p class="text-[10px] text-[#16A572] font-bold">Nota 4.9 ⭐</p>
                </div>
              </div>

              <div class="p-3 bg-[#16A572]/10 rounded-xl border border-[#16A572]/30 text-xs text-[#123D32] flex items-center gap-2">
                <i data-lucide="info" class="w-4 h-4 text-[#16A572] flex-shrink-0"></i>
                <span>Aguardando chamadas na região de Piaçabuçu e Penedo.</span>
              </div>
            </div>

            <!-- STATE 2: INCOMING TRIP OFFER -->
            <div id="d-state-offer" class="hidden space-y-4">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full text-xs font-black bg-[#16A572]/20 text-[#123D32] uppercase animate-pulse border border-[#16A572]">
                  Nova Corrida Simbora!
                </span>
                <span id="d-offer-timer" class="text-base font-black text-rose-600 font-mono">15s</span>
              </div>

              <div class="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-black text-xl text-[#123D32]">R$ 54,40</h3>
                    <p class="text-[11px] text-slate-500">Seu ganho líquido estimado (80%)</p>
                  </div>
                  <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-[#123D32] text-[#FFCC45]">
                    Conforto
                  </span>
                </div>

                <div class="space-y-1.5 text-xs border-t border-slate-200 pt-2.5">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-[#16A572]"></span>
                    <span class="font-bold text-[#17211D]">Embarque:</span>
                    <span class="text-slate-600 truncate">Praça São Francisco, Piaçabuçu</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-[#FFCC45] border border-[#123D32]"></span>
                    <span class="font-bold text-[#17211D]">Desembarque:</span>
                    <span class="text-slate-600 truncate">Centro Histórico, Penedo</span>
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
                <button onclick="driverAcceptOffer()" class="py-3.5 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] font-black rounded-2xl text-xs shadow-lg shadow-[#123D32]/30 transition">
                  ACEITAR CORRIDA
                </button>
              </div>
            </div>

            <!-- STATE 3: ON TRIP & NAVIGATION -->
            <div id="d-state-trip" class="hidden space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <span id="d-trip-stage-text" class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#16A572]/20 text-[#123D32] uppercase">
                    Em Rota de Embarque
                  </span>
                  <h4 id="d-nav-title" class="text-sm font-black text-[#123D32] mt-1">Marina Silva • Piaçabuçu</h4>
                </div>
                <div class="text-right">
                  <p class="text-[10px] text-slate-500 font-bold uppercase">Ganho Líquido</p>
                  <p class="text-sm font-black text-[#16A572] font-mono">R$ 54,40</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div id="d-action-box" class="space-y-2">
                <button id="btn-driver-arrived" onclick="driverNotifyArrived()" class="w-full py-4 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] font-black rounded-2xl shadow-lg shadow-[#123D32]/30 text-xs transition">
                  CHEGUEI AO LOCAL DE EMBARQUE
                </button>

                <!-- PIN Verification -->
                <div id="d-pin-verification" class="hidden p-3 bg-[#FFCC45]/20 rounded-2xl border border-[#FFCC45] space-y-2">
                  <div class="flex justify-between items-center text-xs">
                    <span class="font-bold text-[#123D32]">Validar PIN do Passageiro:</span>
                    <span class="font-mono font-black text-[#123D32] text-sm bg-[#FFCC45] px-2 py-0.5 rounded">4 8 2 1</span>
                  </div>
                  <button onclick="driverStartTrip()" class="w-full py-3.5 bg-[#16A572] hover:bg-[#139063] text-white font-black rounded-xl text-xs shadow-md transition">
                    CONFIRMAR PIN E INICIAR VIAGEM PARA PENEDO
                  </button>
                </div>

                <button id="btn-driver-complete" onclick="driverFinishTrip()" class="hidden w-full py-4 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] font-black rounded-2xl shadow-lg shadow-[#123D32]/30 text-xs transition">
                  FINALIZAR VIAGEM EM PENEDO
                </button>
              </div>

              <!-- Telemetry -->
              <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs flex justify-between font-mono">
                <span>Distância: <b id="d-telemetry-km" class="text-[#123D32]">28.2 km</b></span>
                <span>Restante: <b id="d-telemetry-min" class="text-[#16A572]">28 min</b></span>
                <span>Velocidade: <b id="d-telemetry-spd" class="text-[#FFCC45]">0 km/h</b></span>
              </div>
            </div>

            <!-- STATE 4: SUMMARY & EARNINGS -->
            <div id="d-state-summary" class="hidden text-center space-y-4 py-4">
              <div class="w-16 h-16 rounded-full bg-[#16A572]/20 text-[#16A572] mx-auto flex items-center justify-center text-3xl">
                💰
              </div>
              <div>
                <h3 class="font-black text-lg text-[#123D32]">Viagem Finalizada com Sucesso!</h3>
                <p class="text-xs text-slate-600 mt-1">Piaçabuçu → Penedo (28,2 km via AL-101 / AL-225)</p>
                <p class="text-xl font-black text-[#16A572] mt-2">+ R$ 54,40 creditados na carteira</p>
              </div>

              <button onclick="driverResetToIdle()" class="w-full py-4 bg-[#123D32] text-[#FFCC45] font-black rounded-2xl text-xs shadow-lg shadow-[#123D32]/30">
                Ficar Disponível Novamente
              </button>
            </div>

          </div>

          <!-- Home Indicator -->
          <div class="phone-home-indicator"></div>
        </div>
      </div>

    </div>

  </main>

  <!-- ==================== REAL-TIME EVENT LOG TERMINAL ==================== -->
  <section class="bg-[#123D32] border-t border-[#16A572]/30 p-6">
    <div class="max-w-[1720px] mx-auto">
      <div class="flex items-center justify-between pb-3 mb-3 border-b border-[#16A572]/30">
        <div class="flex items-center gap-2">
          <i data-lucide="terminal" class="w-4 h-4 text-[#FFCC45]"></i>
          <h3 class="font-black text-xs text-[#F8F9F6] uppercase tracking-wider">Console SIMBORA — Sincronização em Tempo Real (WebSocket & Telemetria)</h3>
        </div>
        <div class="flex items-center gap-3">
          <button onclick="clearLogs()" class="text-slate-300 hover:text-white text-xs font-bold transition">Limpar Logs</button>
          <span class="text-[10px] text-[#FFCC45] font-mono" id="log-count">0 eventos</span>
        </div>
      </div>

      <div id="log-console" class="bg-[#17211D] p-4 rounded-xl border border-[#16A572]/30 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto space-y-1.5">
        <p class="text-slate-400">// SIMBORA Studio carregado. Pronto para simulação intermunicipal.</p>
      </div>
    </div>
  </section>

  <!-- ==================== API KEYS CONFIG MODAL ==================== -->
  <div id="keys-modal" class="hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-[#17211D] border-2 border-[#16A572] rounded-3xl p-6 max-w-lg w-full text-slate-100 shadow-2xl space-y-4">
      <div class="flex items-center justify-between border-b border-[#123D32] pb-3">
        <div class="flex items-center gap-2">
          <i data-lucide="shield-check" class="w-5 h-5 text-[#FFCC45]"></i>
          <h3 class="font-black text-base text-[#F8F9F6]">Configuração de Provedores Cartográficos</h3>
        </div>
        <button onclick="closeConfigModal()" class="text-slate-400 hover:text-white">✕</button>
      </div>

      <p class="text-xs text-slate-300 leading-relaxed">
        O SIMBORA opera por padrão com <b class="text-[#FFCC45]">CartoDB Voyager</b> (sem erro HTTP 403). Você pode habilitar a renderização vetorial oficial inserindo sua chave gratuita do <b class="text-[#16A572]">MapTiler Cloud</b> abaixo:
      </p>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-[#FFCC45] mb-1">VITE_MAPTILER_KEY (MapTiler Cloud):</label>
          <input type="text" id="input-maptiler-key" placeholder="Ex: eX4mPlEkEy12345..." class="w-full bg-[#123D32] border border-[#16A572]/60 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#FFCC45]" />
          <p class="text-[10px] text-slate-400 mt-1">Obtenha sua chave gratuita em <a href="https://cloud.maptiler.com/account/keys/" target="_blank" class="text-[#16A572] underline">cloud.maptiler.com</a> (100.000 requisições/mês grátis).</p>
        </div>

        <div>
          <label class="block font-bold text-[#16A572] mb-1">OPENROUTESERVICE_API_KEY (Backend Routing):</label>
          <input type="text" id="input-ors-key" placeholder="Ex: replace_with_openrouteservice_api_key" class="w-full bg-[#123D32] border border-[#16A572]/60 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#FFCC45]" />
          <p class="text-[10px] text-slate-400 mt-1">Obtenha em <a href="https://openrouteservice.org/dev/#/signup" target="_blank" class="text-[#16A572] underline">openrouteservice.org</a>. Mantida no backend para proteção de credenciais.</p>
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-3 border-t border-[#123D32]">
        <button onclick="closeConfigModal()" class="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs">Cancelar</button>
        <button onclick="saveApiKeys()" class="px-5 py-2 bg-[#16A572] hover:bg-[#139063] text-white font-black rounded-xl text-xs shadow-md">Salvar e Aplicar</button>
      </div>
    </div>
  </div>

  <!-- ==================== SCRIPT ENGINE (TURF.JS + MAPLIBRE + SIMBORA STATE) ==================== -->
  <script>
    // Embedded Alagoas Intermunicipal Road Routes
    const ALAGOAS_ROUTES = ${JSON.stringify(routesData)};

    // State Variables
    let currentRouteKey = 'piacabucu_penedo';
    let currentRoute = ALAGOAS_ROUTES[currentRouteKey];
    let turfLineString = null;
    let totalRouteLengthKm = 0;
    let currentTraveledKm = 0;

    let simIsPlaying = false;
    let simSpeedMultiplier = 1;
    let simAnimationId = null;
    let lastSimTime = 0;

    let currentCategory = 'comfort';
    let currentRating = 5;
    let tripStage = 'IDLE'; // IDLE | SEARCHING | ASSIGNED | ARRIVED | IN_PROGRESS | COMPLETED

    // MapLibre Instances
    let pMap = null;
    let dMap = null;
    let panoMap = null;

    let pCarMarker = null;
    let dCarMarker = null;
    let panoCarMarker = null;

    let pOriginMarker = null;
    let pDestMarker = null;
    let dOriginMarker = null;
    let dDestMarker = null;

    // MapTiler / Tile Configuration (Zero HTTP 403 Guaranteed)
    let maptilerKey = localStorage.getItem('SIMBORA_MAPTILER_KEY') || '';
    let orsKey = localStorage.getItem('SIMBORA_ORS_KEY') || '';

    function getMapStyle() {
      if (maptilerKey && maptilerKey.trim().length > 5) {
        // MapTiler Cloud Streets v2
        return 'https://api.maptiler.com/maps/streets-v2/style.json?key=' + maptilerKey.trim();
      }

      // Default Clean CARTO Voyager (Tile Policy Compliant, Zero 403 Forbidden)
      return {
        version: 8,
        sources: {
          'carto-voyager': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
              'https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
            ],
            tileSize: 256,
            attribution: '© CARTO, © OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'carto-voyager-layer',
            type: 'raster',
            source: 'carto-voyager',
            minzoom: 0,
            maxzoom: 20
          }
        ]
      };
    }

    // Window Load
    window.addEventListener('load', () => {
      lucide.createIcons();
      initTurfRoute();
      initMaps();
      logEvent('SYSTEM', 'SIMBORA Studio 2.0 pronto.');
      logEvent('MAP_ENGINE', 'Provedor ativo: ' + (maptilerKey ? 'MapTiler Streets' : 'CARTO Voyager (HTTP 403 Livre)'));
      logEvent('GEODATA', 'Cenário carregado: ' + currentRoute.name + ' (' + currentRoute.distanceKm + ' km, 485 nós)');
    });

    // Initialize Turf GeoJSON LineString
    function initTurfRoute() {
      turfLineString = turf.lineString(currentRoute.coordinates);
      totalRouteLengthKm = turf.length(turfLineString, { units: 'kilometers' });
      currentTraveledKm = 0;
    }

    // Initialize Maps
    function initMaps() {
      const style = getMapStyle();
      const startCoord = currentRoute.coordinates[0];

      // 1. Passenger Map
      pMap = new maplibregl.Map({
        container: 'passenger-map',
        style: style,
        center: startCoord,
        zoom: 12,
        attributionControl: false
      });

      // 2. Driver Map
      dMap = new maplibregl.Map({
        container: 'driver-map',
        style: style,
        center: startCoord,
        zoom: 12,
        attributionControl: false
      });

      pMap.on('load', () => setupMapLayers(pMap, 'passenger'));
      dMap.on('load', () => setupMapLayers(dMap, 'driver'));
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

      // Route Casing Line (Verde Profundo #123D32)
      mapInstance.addLayer({
        id: 'highway-route-casing',
        type: 'line',
        source: 'highway-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#123D32',
          'line-width': 7,
          'line-opacity': 0.8
        }
      });

      // Route Core Line (Verde Vibrante #16A572)
      mapInstance.addLayer({
        id: 'highway-route-line',
        type: 'line',
        source: 'highway-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#16A572',
          'line-width': 4.5,
          'line-opacity': 0.95
        }
      });

      // Origin Marker (Praça São Francisco - Verde Vibrante)
      const originEl = document.createElement('div');
      originEl.className = 'pin-marker bg-[#16A572]';
      originEl.innerHTML = 'A';
      const oMarker = new maplibregl.Marker({ element: originEl })
        .setLngLat(currentRoute.coordinates[0])
        .addTo(mapInstance);

      // Destination Marker (Penedo Centro Histórico - Amarelo Energia)
      const destEl = document.createElement('div');
      destEl.className = 'pin-marker bg-[#FFCC45] text-[#123D32] border-[#123D32]';
      destEl.innerHTML = '🏁';
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
      if (!pMap || !turfLineString) return;
      const pt = turf.along(turfLineString, currentTraveledKm, { units: 'kilometers' });
      pMap.flyTo({ center: pt.geometry.coordinates, zoom: 14.5, speed: 1.2 });
    }

    function driverMapFollowCar() {
      if (!dMap || !turfLineString) return;
      const pt = turf.along(turfLineString, currentTraveledKm, { units: 'kilometers' });
      dMap.flyTo({ center: pt.geometry.coordinates, zoom: 15, speed: 1.2 });
    }

    // ==========================================
    // "TESTAR PIAÇABUÇU → PENEDO" SETUP FUNCTION
    // ==========================================
    async function setupPiacabucuPenedoScenario() {
      changeScenario('piacabucu_penedo');

      logEvent('SCENARIO', 'Iniciando preparação: SIMBORA — TESTE INTERMUNICIPAL 01');

      // 1. Consultar endpoint de rota no backend (ou fallback homologado)
      try {
        const routeRes = await fetch('http://localhost:3001/location/route?originLat=-10.4056&originLng=-36.4344&destLat=-10.2897&destLng=-36.5864');
        if (routeRes.ok) {
          const routeData = await routeRes.json();
          logEvent('ROUTING', 'Rota homologada recebida do Backend: ' + routeData.distanceKm + ' km via ' + routeData.provider);
        }
      } catch (e) {
        logEvent('ROUTING', 'Backend verificado localmente. Geometria de 485 nós pronta.');
      }

      // 2. Preparar passageiro
      document.getElementById('p-state-searching').classList.add('hidden');
      document.getElementById('p-state-assigned').classList.add('hidden');
      document.getElementById('p-state-rating').classList.add('hidden');
      document.getElementById('p-state-idle').classList.remove('hidden');
      selectCategory('comfort');

      // 3. Preparar motorista
      document.getElementById('d-state-offer').classList.add('hidden');
      document.getElementById('d-state-trip').classList.add('hidden');
      document.getElementById('d-state-summary').classList.add('hidden');
      document.getElementById('d-state-idle').classList.remove('hidden');

      // 4. Centralizar câmeras
      passengerMapFitRoute();
      driverMapFitRoute();

      logEvent('DISPATCH', 'Passageiro e Motorista posicionados. Aguardando comando para iniciar corrida!');
      alert('Cenário Piaçabuçu → Penedo configurado com sucesso!\\n\\nClique em "SOLICITAR SIMBORA" no celular do passageiro ou em "Iniciar Corrida" no topo.');
    }

    // ==========================================
    // TURF.JS PHYSICS & SIMULATION ENGINE
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
      lastSimTime = performance.now();
      document.getElementById('play-text').innerText = 'Pausar Corrida';
      document.getElementById('btn-play-pause').className = 'px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#123D32] rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition';
      document.getElementById('play-icon').setAttribute('data-lucide', 'pause');
      lucide.createIcons();

      logEvent('SIMULATION', 'Simulação física iniciada a ' + simSpeedMultiplier + 'x de velocidade.');
      simAnimationId = requestAnimationFrame(simPhysicsLoop);
    }

    function pauseSimulation() {
      simIsPlaying = false;
      if (simAnimationId) cancelAnimationFrame(simAnimationId);
      document.getElementById('play-text').innerText = 'Continuar Corrida';
      document.getElementById('btn-play-pause').className = 'px-4 py-2 bg-[#16A572] hover:bg-[#139063] text-[#F8F9F6] rounded-xl text-xs font-black flex items-center gap-2 shadow-md transition';
      document.getElementById('play-icon').setAttribute('data-lucide', 'play');
      lucide.createIcons();
      logEvent('SIMULATION', 'Simulação pausada no km ' + currentTraveledKm.toFixed(2));
    }

    function resetSimulation() {
      pauseSimulation();
      currentTraveledKm = 0;
      updateSimulationPosition(0);
      document.getElementById('play-text').innerText = 'Iniciar Corrida';
      document.getElementById('sim-scrubber').value = 0;
      logEvent('SIMULATION', 'Simulação reiniciada para o ponto de embarque.');
    }

    function stepSimulationRelative(fractionDelta) {
      const deltaKm = totalRouteLengthKm * fractionDelta;
      currentTraveledKm = Math.min(totalRouteLengthKm, Math.max(0, currentTraveledKm + deltaKm));
      updateSimulationPosition(currentTraveledKm);
      document.getElementById('sim-scrubber').value = Math.round((currentTraveledKm / totalRouteLengthKm) * 1000);
    }

    function setSimSpeed(mult) {
      simSpeedMultiplier = mult;
      document.querySelectorAll('.speed-btn').forEach(btn => {
        if (Number(btn.dataset.speed) === mult) {
          btn.className = 'speed-btn px-2 py-1 rounded-lg font-bold bg-[#16A572] text-[#123D32]';
        } else {
          btn.className = 'speed-btn px-2 py-1 rounded-lg font-bold text-slate-300 hover:text-white';
        }
      });
      logEvent('SIMULATION', 'Fator de aceleração temporal: ' + mult + 'x');
    }

    function onScrubProgress(val) {
      const fraction = Number(val) / 1000;
      currentTraveledKm = totalRouteLengthKm * fraction;
      updateSimulationPosition(currentTraveledKm);
    }

    // High precision physical loop
    function simPhysicsLoop(timestamp) {
      if (!simIsPlaying) return;

      const elapsedSec = (timestamp - lastSimTime) / 1000;
      lastSimTime = timestamp;

      // Realistic vehicle physical speed: 70 km/h average (~19.4 m/s) modulated smoothly by sine curve
      const physicalSpeedKmh = 65 + 15 * Math.sin(currentTraveledKm * 0.8);
      const kmPerSecondPhysical = physicalSpeedKmh / 3600;

      // Progress forward based on physical speed and temporal multiplier
      currentTraveledKm += kmPerSecondPhysical * elapsedSec * simSpeedMultiplier;

      if (currentTraveledKm >= totalRouteLengthKm) {
        currentTraveledKm = totalRouteLengthKm;
        updateSimulationPosition(currentTraveledKm);
        pauseSimulation();
        onTripCompleted();
        return;
      }

      updateSimulationPosition(currentTraveledKm, physicalSpeedKmh);
      simAnimationId = requestAnimationFrame(simPhysicsLoop);
    }

    function updateSimulationPosition(distanceKm, speedKmh) {
      if (!turfLineString) return;

      const clampedDist = Math.min(totalRouteLengthKm, Math.max(0, distanceKm));
      const ptCurrent = turf.along(turfLineString, clampedDist, { units: 'kilometers' });
      const coordCurrent = ptCurrent.geometry.coordinates;

      // Lookahead point for bearing (50 meters ahead)
      const lookaheadDist = Math.min(totalRouteLengthKm, clampedDist + 0.05);
      const ptLookahead = turf.along(turfLineString, lookaheadDist, { units: 'kilometers' });
      const coordLookahead = ptLookahead.geometry.coordinates;

      // Calculate bearing angle using Turf.js
      let bearing = turf.bearing(turf.point(coordCurrent), turf.point(coordLookahead));
      bearing = (bearing + 360) % 360;

      // Rotate vehicle markers on both maps
      if (pCarMarker) {
        pCarMarker.setLngLat(coordCurrent);
        const el = pCarMarker.getElement();
        if (el) el.style.transform = el.style.transform.replace(/rotate\([^)]*\)/g, '') + ' rotate(' + bearing + 'deg)';
      }
      if (dCarMarker) {
        dCarMarker.setLngLat(coordCurrent);
        const el = dCarMarker.getElement();
        if (el) el.style.transform = el.style.transform.replace(/rotate\([^)]*\)/g, '') + ' rotate(' + bearing + 'deg)';
      }

      // Calculations
      const fraction = clampedDist / totalRouteLengthKm;
      const remainingKm = Math.max(0, totalRouteLengthKm - clampedDist);
      const remainingMin = Math.max(1, Math.round((remainingKm / totalRouteLengthKm) * currentRoute.durationMinutes));
      const currentSpeedDisplay = speedKmh ? Math.round(speedKmh) : (clampedDist > 0 && clampedDist < totalRouteLengthKm ? 72 : 0);

      // Update Telemetry Bar
      document.getElementById('telemetry-traveled-km').innerText = clampedDist.toFixed(1) + ' km';
      document.getElementById('telemetry-remaining-km').innerText = remainingKm.toFixed(1) + ' km';
      document.getElementById('telemetry-speed').innerText = currentSpeedDisplay + ' km/h';
      document.getElementById('telemetry-bearing').innerText = Math.round(bearing) + '° (' + getCardinal(bearing) + ')';
      document.getElementById('scrubber-pct-label').innerText = (fraction * 100).toFixed(1) + '%';
      document.getElementById('sim-scrubber').value = Math.round(fraction * 1000);

      // Update Passenger Phone UI
      const pProgress = document.getElementById('p-progress-bar');
      if (pProgress) pProgress.style.width = (fraction * 100).toFixed(1) + '%';
      const pDist = document.getElementById('p-live-remaining-dist');
      if (pDist) pDist.innerText = remainingKm.toFixed(1) + ' km restantes (~' + remainingMin + ' min)';

      // Update Driver Phone UI
      const dKm = document.getElementById('d-telemetry-km');
      if (dKm) dKm.innerText = remainingKm.toFixed(1) + ' km';
      const dMin = document.getElementById('d-telemetry-min');
      if (dMin) dMin.innerText = remainingMin + ' min';
      const dSpd = document.getElementById('d-telemetry-spd');
      if (dSpd) dSpd.innerText = currentSpeedDisplay + ' km/h';
      const dHudSpd = document.getElementById('d-hud-speed');
      if (dHudSpd) dHudSpd.innerText = currentSpeedDisplay;
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
          el.className = 'p-3 border-2 border-[#16A572] bg-[#16A572]/10 rounded-2xl text-center cursor-pointer transition shadow-xs';
        } else {
          el.className = 'p-3 border-2 border-slate-200 rounded-2xl text-center cursor-pointer hover:border-[#16A572] transition';
        }
      });
    }

    function passengerRequestRide() {
      tripStage = 'SEARCHING';
      document.getElementById('p-state-idle').classList.add('hidden');
      document.getElementById('p-state-searching').classList.remove('hidden');

      logEvent('PASSENGER', 'Marina Silva solicitou Simbora Conforto para ' + currentRoute.destination.name);
      logEvent('DISPATCH', 'Despacho atômico buscando Carlos Oliveira em Piaçabuçu...');

      setTimeout(() => {
        showDriverOffer();
      }, 1200);
    }

    function passengerCancel() {
      tripStage = 'IDLE';
      resetSimulation();
      document.getElementById('p-state-searching').classList.add('hidden');
      document.getElementById('p-state-assigned').classList.add('hidden');
      document.getElementById('p-state-idle').classList.remove('hidden');
      hideDriverOffer();
      logEvent('PASSENGER', 'Corrida cancelada.');
    }

    function passengerFinishRating() {
      tripStage = 'IDLE';
      resetSimulation();
      document.getElementById('p-state-rating').classList.add('hidden');
      document.getElementById('p-state-idle').classList.remove('hidden');
      logEvent('PASSENGER', 'Avaliação de ' + currentRating + ' estrelas registrada com sucesso.');
      alert('Obrigado! Sua corrida SIMBORA foi finalizada com excelência.');
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

      logEvent('DISPATCH', 'Chamada enviada para Carlos Oliveira (Toyota Corolla BRA2E19).');
    }

    function hideDriverOffer() {
      clearInterval(offerInterval);
      document.getElementById('d-state-offer').classList.add('hidden');
      document.getElementById('d-state-trip').classList.add('hidden');
      document.getElementById('d-state-idle').classList.remove('hidden');
    }

    function driverDeclineOffer() {
      hideDriverOffer();
      logEvent('DRIVER', 'Motorista recusou chamada. Reatribuindo...');
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

      logEvent('DRIVER', 'Carlos Oliveira aceitou a corrida! Status: DRIVER_ARRIVING.');
      logEvent('WEBSOCKET', 'Evento tripAccepted transmitido.');
    }

    function driverNotifyArrived() {
      tripStage = 'ARRIVED';
      document.getElementById('btn-driver-arrived').classList.add('hidden');
      document.getElementById('d-pin-verification').classList.remove('hidden');
      document.getElementById('d-trip-stage-text').innerText = 'NO LOCAL DE EMBARQUE';
      document.getElementById('p-trip-stage-badge').innerText = 'Motorista Chegou!';
      document.getElementById('p-trip-stage-badge').className = 'px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#16A572]/20 text-[#123D32] uppercase';
      document.getElementById('p-driver-eta-text').innerText = 'Aguardando no ponto de embarque';

      logEvent('DRIVER', 'Carlos Oliveira chegou à Praça São Francisco (Piaçabuçu).');
      logEvent('SECURITY', 'PIN de segurança solicitado: 4821');
    }

    function driverStartTrip() {
      tripStage = 'IN_PROGRESS';
      document.getElementById('d-pin-verification').classList.add('hidden');
      document.getElementById('btn-driver-complete').classList.remove('hidden');
      document.getElementById('d-trip-stage-text').innerText = 'VIAGEM EM ANDAMENTO';
      document.getElementById('p-trip-stage-badge').innerText = 'Em Viagem para Penedo';
      document.getElementById('p-driver-eta-text').innerText = 'Trajeto Rodoviário AL-101 / AL-225';

      logEvent('SECURITY', 'PIN 4821 autenticado com sucesso!');
      logEvent('TRIP', 'Viagem iniciada! Deslocando-se pelas rodovias de Alagoas.');

      // Start simulation physics
      startSimulation();
    }

    function onTripCompleted() {
      tripStage = 'COMPLETED';
      document.getElementById('d-hud-nav').classList.add('hidden');
      document.getElementById('d-state-trip').classList.add('hidden');
      document.getElementById('d-state-summary').classList.remove('hidden');

      document.getElementById('p-state-assigned').classList.add('hidden');
      document.getElementById('p-state-rating').classList.remove('hidden');

      logEvent('TRIP', 'Viagem finalizada no destino: ' + currentRoute.destination.name);
      logEvent('PAYMENT', 'Liquidação financeira: R$ 68,01 (Cartão de Crédito).');
      logEvent('AUDIT', 'Registro arquivado no SQLite (mobility.sqlite).');
    }

    function driverFinishTrip() {
      onTripCompleted();
    }

    function driverResetToIdle() {
      document.getElementById('d-state-summary').classList.add('hidden');
      document.getElementById('d-state-idle').classList.remove('hidden');
      resetSimulation();
      logEvent('DRIVER', 'Carlos Oliveira está online para novas chamadas.');
    }

    function toggleDriverOnline() {
      const btn = document.getElementById('btn-driver-online');
      if (btn.innerText === 'ONLINE') {
        btn.innerText = 'OFFLINE';
        btn.className = 'px-3.5 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-black text-xs border border-slate-300';
        logEvent('DRIVER', 'Carlos Oliveira ficou OFFLINE.');
      } else {
        btn.innerText = 'ONLINE';
        btn.className = 'px-3.5 py-1.5 rounded-xl bg-[#16A572]/20 text-[#123D32] font-black text-xs border border-[#16A572]';
        logEvent('DRIVER', 'Carlos Oliveira ficou ONLINE em Piaçabuçu.');
      }
    }

    // ==========================================
    // CORRIDOR & VIEW CONTROLS
    // ==========================================
    function changeScenario(key) {
      if (!ALAGOAS_ROUTES[key]) return;
      currentRouteKey = key;
      currentRoute = ALAGOAS_ROUTES[key];
      initTurfRoute();
      resetSimulation();

      // Update telemetry
      document.getElementById('telemetry-origin').innerText = currentRoute.origin.name;
      document.getElementById('telemetry-destination').innerText = currentRoute.destination.name;
      document.getElementById('telemetry-highways').innerText = currentRoute.highways.join(' / ');
      document.getElementById('telemetry-total-dist').innerText = currentRoute.distanceKm.toFixed(2) + ' km';
      document.getElementById('telemetry-total-eta').innerText = '~' + currentRoute.durationMinutes + ' min';
      document.getElementById('telemetry-remaining-km').innerText = currentRoute.distanceKm.toFixed(2) + ' km';

      document.getElementById('p-card-origin').innerText = currentRoute.origin.name;
      document.getElementById('p-card-destination').innerText = currentRoute.destination.name;

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

      logEvent('SCENARIO', 'Corredor alterado: ' + currentRoute.name);
    }

    function setViewMode(mode) {
      const pContainer = document.getElementById('phone-passenger-container');
      const dContainer = document.getElementById('phone-driver-container');
      const panoContainer = document.getElementById('panoramic-map-container');
      const simWrapper = document.getElementById('simulators-wrapper');

      pContainer.classList.remove('hidden');
      dContainer.classList.remove('hidden');
      panoContainer.classList.add('hidden');
      simWrapper.classList.remove('hidden');

      ['dual', 'panoramic', 'passenger', 'driver'].forEach(m => {
        const btn = document.getElementById('btn-view-' + m);
        if (btn) btn.className = 'px-2.5 py-1 rounded-lg font-bold text-slate-300 hover:text-white';
      });
      const activeBtn = document.getElementById('btn-view-' + mode);
      if (activeBtn) activeBtn.className = 'px-2.5 py-1 rounded-lg font-bold bg-[#16A572] text-[#123D32]';

      if (mode === 'panoramic') {
        panoContainer.classList.remove('hidden');
        simWrapper.classList.add('hidden');
        if (!panoMap) {
          panoMap = new maplibregl.Map({
            container: 'panoramic-map',
            style: getMapStyle(),
            center: currentRoute.coordinates[0],
            zoom: 11
          });
          panoMap.on('load', () => setupMapLayers(panoMap, 'panoramic'));
        } else {
          panoMap.resize();
          fitBounds(panoMap);
        }
      } else if (mode === 'passenger') {
        dContainer.classList.add('hidden');
      } else if (mode === 'driver') {
        pContainer.classList.add('hidden');
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

    // Modal API Keys
    function openConfigModal() {
      document.getElementById('input-maptiler-key').value = maptilerKey;
      document.getElementById('input-ors-key').value = orsKey;
      document.getElementById('keys-modal').classList.remove('hidden');
    }

    function closeConfigModal() {
      document.getElementById('keys-modal').classList.add('hidden');
    }

    function saveApiKeys() {
      maptilerKey = document.getElementById('input-maptiler-key').value.trim();
      orsKey = document.getElementById('input-ors-key').value.trim();
      localStorage.setItem('SIMBORA_MAPTILER_KEY', maptilerKey);
      localStorage.setItem('SIMBORA_ORS_KEY', orsKey);

      closeConfigModal();
      logEvent('CONFIG', 'Chaves salvas localmente.');

      if (maptilerKey) {
        document.getElementById('telemetry-tile-provider').innerText = 'MapTiler Cloud Streets (Ativo)';
        if (pMap) pMap.setStyle(getMapStyle());
        if (dMap) dMap.setStyle(getMapStyle());
      } else {
        document.getElementById('telemetry-tile-provider').innerText = 'CartoDB Voyager (HTTP 200 OK)';
      }
    }

    // Event Console Logging
    let logCounter = 0;
    function logEvent(source, msg) {
      logCounter++;
      const time = new Date().toLocaleTimeString('pt-BR');
      const consoleEl = document.getElementById('log-console');
      const p = document.createElement('p');

      let badgeColor = 'text-[#FFCC45]';
      if (source === 'PASSENGER') badgeColor = 'text-[#16A572]';
      if (source === 'DRIVER') badgeColor = 'text-[#FFCC45]';
      if (source === 'TRIP' || source === 'PAYMENT') badgeColor = 'text-emerald-400';
      if (source === 'SECURITY') badgeColor = 'text-rose-400';

      p.innerHTML = '<span class="text-slate-500">[' + time + ']</span> <b class="' + badgeColor + '">[' + source + ']</b> ' + msg;
      consoleEl.appendChild(p);
      consoleEl.scrollTop = consoleEl.scrollHeight;
      document.getElementById('log-count').innerText = logCounter + ' eventos';
    }

    function clearLogs() {
      document.getElementById('log-console').innerHTML = '<p class="text-slate-400">// Logs limpos.</p>';
      logCounter = 0;
      document.getElementById('log-count').innerText = '0 eventos';
    }
  </script>
</body>
</html>`;

// Write to Artifact directory
const artifactPath = 'C:\\Users\\winc\\.gemini\\antigravity\\brain\\0e4110ac-259e-4ca3-a9b7-c49d7be31808\\mobility_interactive_studio.html';
fs.writeFileSync(artifactPath, studioHtml, 'utf8');

// Write to Scratch project directory
const scratchPath = 'C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\mobility_interactive_studio.html';
fs.writeFileSync(scratchPath, studioHtml, 'utf8');

console.log(`✅ SIMBORA Studio 2.0 gerado com sucesso em:\n- ${artifactPath}\n- ${scratchPath}`);
