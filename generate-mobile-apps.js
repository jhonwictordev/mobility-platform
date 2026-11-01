const fs = require('fs');
const path = require('path');

const ALAGOAS_CITIES = [
  "Piaçabuçu", "Penedo", "Maceió", "Arapiraca", "Coruripe", "Igreja Nova", "Porto Real do Colégio",
  "Marechal Deodoro", "Barra de São Miguel", "Palmeira dos Índios", "Rio Largo", "União dos Palmares",
  "São Miguel dos Campos", "Campo Alegre", "Delmiro Gouveia", "Santana do Ipanema", "Atalaia",
  "Teotônio Vilela", "Girau do Ponciano", "Pilar", "São Sebastião", "Maragogi", "São José da Tapera",
  "São Luís do Quitunde", "Porto Calvo", "Batalha", "Traipu", "Viçosa", "Murici", "Matriz de Camaragibe",
  "Boca da Mata", "Junqueiro", "Feira Grande", "Limoeiro de Anadia", "Olho d'Água das Flores", "Taquarana",
  "Craíbas", "São José da Laje", "Major Izidoro", "Anadia", "Messias", "Capela", "Joaquim Gomes",
  "Passo de Camaragibe", "Barra de Santo Antônio", "Paripueira", "Satuba", "Santa Luzia do Norte",
  "Coqueiro Seco", "Colônia Leopoldina", "Ibateguara", "Novo Lino", "Jundiá", "Campestre", "Jacuípe",
  "Japaratinga", "Porto de Pedras", "São Miguel dos Milagres", "Branquinha",
  "Santana do Mundaú", "Chã Preta", "Pindoba", "Mar Vermelho", "Paulo Jacinto", "Quebrangulo",
  "Tanque d'Arca", "Belém", "Maribondo", "Roteiro", "Jequiá da Praia", "Feliz Deserto", "São Brás",
  "Olho d'Água Grande", "Lagoa da Canoa", "Coité do Nóia", "Estrela de Alagoas", "Minador do Negrão",
  "Cacimbinhas", "Dois Riachos", "Maravilha", "Ouro Branco", "Poço das Trincheiras", "Senador Rui Palmeira",
  "Carneiros", "Olivença", "Jacaré dos Homens", "Monteirópolis", "Jaramataia", "Belo Monte", "Palestina",
  "Pão de Açúcar", "Piranhas", "Olho d'Água do Casado", "Inhapi", "Canapi",
  "Mata Grande", "Água Branca", "Pariconha"
];

const PASSENGER_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>SIMBORA - Passageiro 4.0</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0E2922;
      color: #F8F9F6;
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .custom-scroll::-webkit-scrollbar { width: 4px; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #16A572; border-radius: 4px; }
    .pulse-radar {
      animation: pulseRadar 2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
    }
    @keyframes pulseRadar {
      0% { transform: scale(0.9); opacity: 0.9; }
      50% { transform: scale(1.15); opacity: 0.4; }
      100% { transform: scale(0.9); opacity: 0.9; }
    }
    .wave {
      position: absolute;
      border: 2px solid #FFCC45;
      border-radius: 50%;
      animation: ripple 2.5s linear infinite;
    }
    @keyframes ripple {
      0% { width: 40px; height: 40px; opacity: 1; transform: translate(-50%, -50%); }
      100% { width: 260px; height: 260px; opacity: 0; transform: translate(-50%, -50%); }
    }
  </style>
</head>
<body class="flex flex-col h-full select-none">

  <!-- TOP HEADER -->
  <header class="bg-[#123D32] px-4 py-2.5 flex items-center justify-between border-b border-[#16A572]/30 shadow-md z-30">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-[#FFCC45] flex items-center justify-center font-black text-[#123D32] text-lg shadow">
        S
      </div>
      <div>
        <h1 class="text-xs font-black tracking-wide text-[#F8F9F6]">SIMBORA <span class="text-[#FFCC45]">4.0</span></h1>
        <p class="text-[9px] text-[#16A572] font-black uppercase">Passageira: Marina Silva</p>
      </div>
    </div>

    <!-- Diagnostic & Avatar -->
    <div class="flex items-center gap-2">
      <button onclick="openDiagModal()" id="btn-diag-pill" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#17211D] border border-[#16A572]/40 text-[10px] font-bold text-slate-200">
        <span id="diag-dot" class="w-2 h-2 rounded-full bg-[#16A572] animate-pulse"></span>
        <span id="diag-host-label">192.168.3.5</span>
      </button>

      <div onclick="switchTab('profile')" class="w-7 h-7 rounded-full bg-[#16A572] flex items-center justify-center font-black text-[#123D32] text-xs shadow border border-[#FFCC45]">
        MS
      </div>
    </div>
  </header>

  <!-- MODALITY TOGGLE BAR: [ CORRIDA AGORA ] vs [ CARONAS ] -->
  <div class="bg-[#0B1B16] px-3 py-1.5 border-b border-[#16A572]/30 flex items-center justify-center gap-2 z-30">
    <button onclick="switchModality('rides')" id="btn-mode-rides" class="flex-1 py-1.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 bg-[#FFCC45] text-[#123D32] shadow">
      <span>⚡</span> CORRIDA AGORA
    </button>
    <button onclick="switchModality('carpools')" id="btn-mode-carpools" class="flex-1 py-1.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 bg-[#17211D] text-slate-300 border border-[#16A572]/30">
      <span>🚗</span> CARONAS INTERMUNICIPAIS
    </button>
  </div>

  <!-- MAIN VIEWPORT CONTAINER -->
  <main class="flex-1 relative overflow-hidden flex flex-col bg-[#0B1B16]">

    <!-- ========================================== -->
    <!-- MODALITY A: CORRIDA AGORA (ON-DEMAND RIDE) -->
    <!-- ========================================== -->
    <div id="view-mode-rides" class="flex-1 flex flex-col relative w-full h-full">

      <!-- MAP AREA (Interactive Vector/Canvas) -->
      <div id="map-container" class="flex-1 relative bg-[#0d261e] overflow-hidden">
        <svg class="w-full h-full object-cover opacity-90" viewBox="0 0 400 450" preserveAspectRatio="none">
          <rect width="400" height="450" fill="#0d261e" />
          <path d="M 330,0 Q 300,150 280,280 Q 250,380 200,450 L 400,450 L 400,0 Z" fill="#07302b" opacity="0.6" />
          <path d="M 0,340 Q 100,350 180,380 Q 230,400 280,450" stroke="#00b4d8" stroke-width="16" fill="none" opacity="0.5" stroke-linecap="round" />
          <path id="svg-route-path" d="M 170,390 Q 155,360 140,310 Q 130,260 120,200" stroke="#FFCC45" stroke-width="4" stroke-dasharray="6,4" fill="none" />

          <circle cx="170" cy="390" r="8" fill="#16A572" stroke="#FFFFFF" stroke-width="2" />
          <text x="170" y="415" fill="#F8F9F6" font-size="11" font-weight="bold" text-anchor="middle">Piaçabuçu</text>

          <circle cx="120" cy="200" r="8" fill="#FFCC45" stroke="#123D32" stroke-width="2" />
          <text x="120" y="185" fill="#FFCC45" font-size="11" font-weight="bold" text-anchor="middle">Penedo</text>

          <!-- Moving Car Icon -->
          <g id="svg-car-marker" transform="translate(170, 390)">
            <circle cx="0" cy="0" r="14" fill="#123D32" stroke="#FFCC45" stroke-width="2.5" />
            <text x="0" y="4" font-size="12" text-anchor="middle">🚗</text>
          </g>
        </svg>

        <!-- Floating Quick Preset -->
        <div class="absolute top-2 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <button onclick="setPresetRoute('Piaçabuçu', 'Penedo', 28.2, 42.50)" class="flex-1 py-1.5 px-3 bg-[#123D32]/90 backdrop-blur border border-[#FFCC45]/60 rounded-xl text-left shadow-lg">
            <span class="text-[9px] text-[#FFCC45] font-black uppercase tracking-wider block">⭐ CORRIDA IMEDIATA</span>
            <span class="text-xs font-bold text-white flex items-center justify-between">
              Piaçabuçu ➔ Penedo
              <span class="text-[#FFCC45] font-black">28,2 km</span>
            </span>
          </button>
          <button onclick="getCurrentGPSLocation()" class="w-9 h-9 rounded-xl bg-[#123D32] border border-[#16A572] flex items-center justify-center text-sm shadow text-[#FFCC45]">
            🎯
          </button>
        </div>
      </div>

      <!-- BOTTOM SHEET (ON-DEMAND STATES) -->
      <div id="bottom-sheet" class="bg-[#123D32] border-t-2 border-[#16A572]/40 rounded-t-3xl p-3 shadow-2xl flex flex-col gap-2.5 z-20 max-h-[55vh] overflow-y-auto custom-scroll">
        <!-- STATE 1: IDLE -->
        <div id="state-idle" class="flex flex-col gap-2.5">
          <!-- Origin & Destination -->
          <div class="bg-[#0B1B16] p-2.5 rounded-2xl border border-[#16A572]/30 flex flex-col gap-1.5 text-xs">
            <div class="flex items-center gap-2 cursor-pointer" onclick="openCityModal('origem')">
              <span class="w-2.5 h-2.5 rounded-full bg-[#16A572]"></span>
              <span id="lbl-origem" class="font-bold text-white truncate flex-1">Praça São Francisco, Piaçabuçu</span>
              <span class="text-[10px] text-[#16A572] font-black underline">Trocar</span>
            </div>
            <div class="h-px bg-slate-800 ml-4 mr-2"></div>
            <div class="flex items-center gap-2 cursor-pointer" onclick="openCityModal('destino')">
              <span class="w-2.5 h-2.5 rounded-full bg-[#FFCC45]"></span>
              <span id="lbl-destino" class="font-bold text-[#FFCC45] truncate flex-1">Centro Histórico, Penedo</span>
              <span class="text-[10px] text-[#FFCC45] font-black underline">Trocar</span>
            </div>
          </div>

          <!-- Categories Carousel -->
          <div class="grid grid-cols-2 gap-2">
            <div onclick="selectCategory('comum', 42.50)" id="cat-comum" class="p-2 rounded-xl border-2 border-[#FFCC45] bg-[#0B1B16] flex items-center justify-between cursor-pointer">
              <div>
                <p class="text-xs font-black text-white">🚗 Comum</p>
                <span class="text-[9px] text-slate-400">4 passageiros</span>
              </div>
              <span class="text-xs font-black text-[#FFCC45]">R$ 42,50</span>
            </div>
            <div onclick="selectCategory('mulher', 44.00)" id="cat-mulher" class="p-2 rounded-xl border border-[#16A572]/40 bg-[#17211D] flex items-center justify-between cursor-pointer">
              <div>
                <p class="text-xs font-black text-white">🌸 Mulher</p>
                <span class="text-[9px] text-slate-400">Motoristas mulheres</span>
              </div>
              <span class="text-xs font-black text-white">R$ 44,00</span>
            </div>
          </div>

          <!-- Request Button -->
          <button onclick="startRideRequest()" class="w-full py-3 bg-[#FFCC45] text-[#123D32] font-black text-xs rounded-xl shadow flex items-center justify-center gap-2 active:scale-95 transition">
            <span>PEDIR CORRIDA AGORA</span>
            <span id="btn-request-price" class="bg-[#123D32] text-[#FFCC45] text-[10px] px-2 py-0.5 rounded">R$ 42,50</span>
          </button>
        </div>

        <!-- STATE 2: RADAR -->
        <div id="state-radar" class="hidden flex flex-col items-center py-3 text-center">
          <div class="relative w-28 h-28 flex items-center justify-center mb-2">
            <div class="wave" style="left:50%; top:50%; animation-delay: 0s;"></div>
            <div class="wave" style="left:50%; top:50%; animation-delay: 0.8s;"></div>
            <div class="w-14 h-14 rounded-full bg-[#16A572] flex items-center justify-center text-xl shadow pulse-radar z-10">🚗</div>
          </div>
          <h4 class="text-xs font-black text-white">Procurando motoristas parceiros...</h4>
          <p class="text-[10px] text-[#FFCC45] font-bold mb-3">Piaçabuçu ➔ Penedo</p>
          <div class="w-full flex gap-2">
            <button onclick="simulateDriverMatch()" class="flex-1 py-2 bg-[#16A572] text-[#123D32] font-black text-xs rounded-xl shadow">
              ⚡ Confirmar Motorista Já
            </button>
            <button onclick="cancelRideRequest()" class="py-2 px-3 bg-red-600/30 text-red-200 border border-red-500/50 font-bold text-xs rounded-xl">
              Cancelar
            </button>
          </div>
        </div>

        <!-- STATE 3: DRIVER MATCHED & IN TRIP -->
        <div id="state-active" class="hidden flex flex-col gap-2.5">
          <div class="bg-[#0B1B16] p-2.5 rounded-xl border-2 border-[#16A572] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-full bg-[#16A572] flex items-center justify-center font-black text-[#123D32] text-xs">CO</div>
              <div>
                <h4 class="text-xs font-black text-white">Carlos Oliveira <span class="text-[#FFCC45]">4.98 ⭐</span></h4>
                <p class="text-[10px] text-slate-300">Fiat Cronos • <span class="font-mono text-[#16A572] font-black">QTT-4A82</span></p>
              </div>
            </div>
            <div class="bg-[#123D32] border border-[#FFCC45] px-2 py-1 rounded-lg text-center">
              <span class="text-[8px] text-[#FFCC45] font-black block">PIN EMBARQUE</span>
              <span class="text-sm font-black text-white tracking-widest">4821</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button onclick="switchTab('chat')" class="flex-1 py-2 bg-[#17211D] border border-[#16A572]/40 rounded-xl text-xs font-bold text-white">💬 Chat</button>
            <button onclick="completeRide()" class="flex-1 py-2 bg-[#16A572] text-[#123D32] rounded-xl text-xs font-black">Finalizar</button>
          </div>
        </div>

        <!-- STATE 4: COMPLETED -->
        <div id="state-completed" class="hidden flex flex-col items-center py-2 text-center gap-2">
          <span class="text-2xl">🎉</span>
          <h4 class="text-xs font-black text-white">Você chegou ao seu destino!</h4>
          <span class="text-xs font-black text-[#FFCC45]">R$ 42,50 (PIX Concluído)</span>
          <button onclick="resetTripState()" class="w-full py-2.5 bg-[#FFCC45] text-[#123D32] font-black text-xs rounded-xl shadow mt-1">
            NOVA CORRIDA
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- MODALITY B: CARONAS COMPARTILHADAS (INTERCITY) -->
    <!-- ============================================== -->
    <div id="view-mode-carpools" class="hidden flex-1 flex flex-col p-3 overflow-y-auto custom-scroll bg-[#0B1B16] gap-3">

      <!-- Carpool Search Card -->
      <div class="bg-[#123D32] p-3 rounded-2xl border border-[#16A572]/40 shadow-lg flex flex-col gap-2.5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-black text-[#FFCC45] uppercase flex items-center gap-1.5">
            <span>🔍</span> PESQUISAR CARONA INTERMUNICIPAL
          </span>
          <button onclick="openCarpoolAlertModal()" class="text-[10px] text-[#16A572] font-black underline flex items-center gap-1">
            <span>🔔</span> Criar Alerta
          </button>
        </div>

        <!-- Inputs -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label class="text-[9px] text-slate-300 font-bold uppercase block">Cidade Origem:</label>
            <input id="cp-search-origin" type="text" value="Piaçabuçu" class="w-full bg-[#0B1B16] text-white px-2.5 py-2 rounded-xl border border-slate-700 font-bold">
          </div>
          <div>
            <label class="text-[9px] text-slate-300 font-bold uppercase block">Cidade Destino:</label>
            <input id="cp-search-dest" type="text" value="Penedo" class="w-full bg-[#0B1B16] text-white px-2.5 py-2 rounded-xl border border-slate-700 font-bold">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label class="text-[9px] text-slate-300 font-bold uppercase block">Data da Viagem:</label>
            <input id="cp-search-date" type="date" class="w-full bg-[#0B1B16] text-white px-2.5 py-2 rounded-xl border border-slate-700 text-xs">
          </div>
          <div>
            <label class="text-[9px] text-slate-300 font-bold uppercase block">Assentos Desejados:</label>
            <select id="cp-search-seats" class="w-full bg-[#0B1B16] text-white px-2.5 py-2 rounded-xl border border-slate-700 font-bold">
              <option value="1">1 assento</option>
              <option value="2">2 assentos</option>
              <option value="3">3 assentos</option>
            </select>
          </div>
        </div>

        <!-- Quick Route Pills -->
        <div class="flex gap-1.5 overflow-x-auto whitespace-nowrap pt-1">
          <button onclick="setCarpoolSearchPreset('Piaçabuçu', 'Penedo')" class="text-[10px] bg-[#0B1B16] text-[#FFCC45] px-2.5 py-1 rounded-full border border-[#FFCC45]/40 font-bold">⭐ Piaçabuçu ➔ Penedo</button>
          <button onclick="setCarpoolSearchPreset('Penedo', 'Maceió')" class="text-[10px] bg-[#0B1B16] text-white px-2.5 py-1 rounded-full border border-slate-700">Penedo ➔ Maceió</button>
          <button onclick="setCarpoolSearchPreset('Arapiraca', 'Maceió')" class="text-[10px] bg-[#0B1B16] text-white px-2.5 py-1 rounded-full border border-slate-700">Arapiraca ➔ Maceió</button>
        </div>

        <button onclick="performCarpoolSearch()" class="w-full py-2.5 bg-[#FFCC45] text-[#123D32] font-black text-xs rounded-xl shadow active:scale-95 transition">
          BUSCAR CARONAS DISPONÍVEIS
        </button>
      </div>

      <!-- Search Results Header -->
      <div class="flex items-center justify-between px-1">
        <span class="text-xs font-black text-white" id="cp-results-title">Caronas Encontradas (2)</span>
        <span class="text-[10px] text-[#16A572] font-bold">Alagoas • Custo Compartilhado</span>
      </div>

      <!-- Results List Container -->
      <div id="carpool-results-list" class="flex flex-col gap-2.5">
        <!-- Rendered via JS -->
      </div>

      <!-- My Active Carpool Reservations -->
      <div class="bg-[#123D32] p-3 rounded-2xl border border-[#16A572]/30 flex flex-col gap-2 mt-2">
        <h4 class="text-xs font-black text-white uppercase flex items-center justify-between">
          <span>Minhas Reservas de Carona</span>
          <span class="text-[10px] text-[#FFCC45] font-bold">1 Ativa</span>
        </h4>

        <div id="passenger-active-reservation-card" class="bg-[#0B1B16] p-2.5 rounded-xl border border-[#16A572]/40 flex flex-col gap-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-white">Piaçabuçu ➔ Penedo</span>
            <span id="p-res-status-badge" class="text-[9px] bg-[#FFCC45] text-[#123D32] px-2 py-0.5 rounded font-black">PENDENTE DE APROVAÇÃO</span>
          </div>
          <p class="text-[10px] text-slate-300">Condutor: <b>Carlos Oliveira</b> • Fiat Cronos (QTT-4A82)</p>
          <div class="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800">
            <span class="text-slate-400">1 assento • R$ 25,00</span>
            <button onclick="switchTab('chat')" class="text-[#FFCC45] font-bold underline">Abrir Chat</button>
          </div>
        </div>
      </div>

    </div>

    <!-- TAB: ATIVIDADE -->
    <div id="tab-activity" class="hidden flex-1 flex flex-col p-4 overflow-y-auto custom-scroll bg-[#0B1B16]">
      <h2 class="text-base font-black text-white mb-2">Histórico de Atividades</h2>
      <div class="flex flex-col gap-2 text-xs">
        <div class="bg-[#123D32] p-3 rounded-xl border border-[#16A572]/30">
          <span class="text-[10px] text-slate-400">Ontem • Corrida Imediata</span>
          <p class="font-bold text-white">Piaçabuçu ➔ Penedo (R$ 42,50)</p>
        </div>
        <div class="bg-[#123D32] p-3 rounded-xl border border-[#16A572]/30">
          <span class="text-[10px] text-slate-400">28/10 • Carona Compartilhada</span>
          <p class="font-bold text-white">Penedo ➔ Maceió (1 assento - R$ 45,00)</p>
        </div>
      </div>
    </div>

    <!-- TAB: CHAT -->
    <div id="tab-chat" class="hidden flex-1 flex flex-col bg-[#0B1B16]">
      <div class="p-3 bg-[#123D32] border-b border-[#16A572]/30 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-[#16A572] flex items-center justify-center font-bold text-[#123D32] text-xs">CO</div>
          <div>
            <h3 class="text-xs font-black text-white">Carlos Oliveira</h3>
            <p class="text-[9px] text-[#16A572] font-bold">Carona Piaçabuçu ➔ Penedo</p>
          </div>
        </div>
        <a href="tel:82999990000" class="px-2.5 py-1 bg-[#17211D] border border-[#16A572] rounded-lg text-xs font-black text-[#FFCC45]">📞 Ligar</a>
      </div>
      <div id="chat-messages" class="flex-1 p-3 overflow-y-auto custom-scroll flex flex-col gap-2">
        <div class="self-start max-w-[80%] bg-[#123D32] p-2 rounded-xl text-xs">
          <p class="text-white">Olá Marina! Vi sua solicitação para a carona. Sairei às 07:30 da Praça São Francisco.</p>
        </div>
      </div>
      <div class="p-2 bg-[#123D32] flex items-center gap-2">
        <input id="input-chat" type="text" placeholder="Digite uma mensagem..." class="flex-1 bg-[#0B1B16] text-white text-xs px-3 py-2 rounded-xl border border-slate-700">
        <button onclick="sendChatMessage()" class="w-8 h-8 rounded-xl bg-[#FFCC45] text-[#123D32] font-black flex items-center justify-center">➔</button>
      </div>
    </div>

    <!-- TAB: SEGURANÇA -->
    <div id="tab-safety" class="hidden flex-1 flex flex-col p-4 overflow-y-auto custom-scroll bg-[#0B1B16] gap-3">
      <h2 class="text-base font-black text-white">Central de Segurança SIMBORA</h2>
      <a href="tel:190" class="w-full py-3 bg-red-600 text-white font-black text-xs rounded-xl text-center shadow">LIGAR 190 (POLÍCIA MILITAR)</a>
    </div>

    <!-- TAB: CONTA -->
    <div id="tab-profile" class="hidden flex-1 flex flex-col p-4 overflow-y-auto custom-scroll bg-[#0B1B16] gap-3">
      <div class="bg-[#123D32] p-4 rounded-2xl border border-[#16A572]/30 flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-[#16A572] flex items-center justify-center font-black text-[#123D32] text-lg">MS</div>
        <div>
          <h2 class="text-sm font-black text-white">Marina Silva</h2>
          <span class="text-[10px] bg-[#FFCC45] text-[#123D32] px-2 py-0.5 rounded font-black">4.9 ⭐ Alagoas</span>
        </div>
      </div>
      <div class="bg-[#123D32] p-3 rounded-xl">
        <span class="text-[10px] text-[#FFCC45] font-black">Saldo de Teste Carteira:</span>
        <h3 class="text-xl font-black text-white">R$ 78,50</h3>
      </div>
    </div>

  </main>

  <!-- BOTTOM NAV (5 TABS) -->
  <nav class="bg-[#123D32] border-t border-[#16A572]/40 px-2 py-2 flex items-center justify-around z-30">
    <button onclick="switchTab('home')" id="nav-home" class="flex flex-col items-center gap-0.5 text-[#FFCC45]">
      <span class="text-lg">🗺️</span>
      <span class="text-[10px] font-black">Início</span>
    </button>
    <button onclick="switchTab('activity')" id="nav-activity" class="flex flex-col items-center gap-0.5 text-slate-400">
      <span class="text-lg">📜</span>
      <span class="text-[10px] font-bold">Atividade</span>
    </button>
    <button onclick="switchTab('chat')" id="nav-chat" class="flex flex-col items-center gap-0.5 text-slate-400">
      <span class="text-lg">💬</span>
      <span class="text-[10px] font-bold">Chat</span>
    </button>
    <button onclick="switchTab('safety')" id="nav-safety" class="flex flex-col items-center gap-0.5 text-slate-400">
      <span class="text-lg">🛡️</span>
      <span class="text-[10px] font-bold">Segurança</span>
    </button>
    <button onclick="switchTab('profile')" id="nav-profile" class="flex flex-col items-center gap-0.5 text-slate-400">
      <span class="text-lg">👤</span>
      <span class="text-[10px] font-bold">Conta</span>
    </button>
  </nav>

  <!-- MODAL: CARPOOL BOOKING DETAIL -->
  <div id="carpool-booking-modal" class="hidden fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-[#123D32] border-2 border-[#16A572] rounded-3xl w-full max-w-sm p-4 flex flex-col gap-3 shadow-2xl">
      <div class="flex items-center justify-between border-b border-[#16A572]/30 pb-2">
        <div>
          <h3 class="text-xs font-black text-white">Reservar Lugar na Carona</h3>
          <p class="text-[9px] text-[#FFCC45] font-bold" id="modal-cp-route">Piaçabuçu ➔ Penedo</p>
        </div>
        <button onclick="closeCarpoolBookingModal()" class="text-slate-400 font-bold">✕</button>
      </div>

      <div class="bg-[#0B1B16] p-2.5 rounded-xl border border-[#16A572]/30 flex flex-col gap-1.5 text-xs">
        <div class="flex justify-between">
          <span class="text-slate-400">Condutor:</span>
          <span id="modal-cp-driver" class="font-bold text-white">Carlos Oliveira (4.98 ⭐)</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Veículo:</span>
          <span id="modal-cp-vehicle" class="font-mono text-slate-200">Fiat Cronos (QTT-4A82)</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Saída:</span>
          <span id="modal-cp-time" class="font-bold text-[#FFCC45]">07:30</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Preço / Assento:</span>
          <span id="modal-cp-price" class="font-black text-[#16A572]">R$ 25,00</span>
        </div>
      </div>

      <!-- Seats Selector -->
      <div>
        <label class="text-[10px] text-slate-300 font-bold uppercase block mb-1">Quantidade de Lugares:</label>
        <div class="flex gap-2">
          <button onclick="selectBookingSeats(1)" id="bseat-1" class="flex-1 py-1.5 bg-[#FFCC45] text-[#123D32] font-black text-xs rounded-lg">1 Lugar</button>
          <button onclick="selectBookingSeats(2)" id="bseat-2" class="flex-1 py-1.5 bg-[#0B1B16] text-white border border-slate-700 font-bold text-xs rounded-lg">2 Lugares</button>
        </div>
      </div>

      <!-- Total Price -->
      <div class="flex justify-between items-baseline pt-1 border-t border-slate-700/50">
        <span class="text-xs font-bold text-slate-300">Total Contribuição:</span>
        <span id="modal-booking-total" class="text-base font-black text-[#FFCC45]">R$ 25,00</span>
      </div>

      <p class="text-[9px] text-slate-400 text-center">Compartilhamento solidário de despesas de combustível (Lei nº 12.587/2012).</p>

      <button onclick="confirmCarpoolBooking()" class="w-full py-3 bg-[#16A572] hover:bg-[#138e62] text-[#07130F] font-black text-xs rounded-xl shadow active:scale-95 transition">
        CONFIRMAR RESERVA DE ASSENTO
      </button>
    </div>
  </div>

  <!-- MODAL: CARPOOL ALERT -->
  <div id="carpool-alert-modal" class="hidden fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-[#123D32] border-2 border-[#FFCC45] rounded-3xl w-full max-w-sm p-4 flex flex-col gap-3 shadow-2xl">
      <div class="flex items-center justify-between border-b border-[#16A572]/30 pb-2">
        <h3 class="text-xs font-black text-white">Criar Alerta de Carona</h3>
        <button onclick="closeCarpoolAlertModal()" class="text-slate-400 font-bold">✕</button>
      </div>
      <p class="text-[10px] text-slate-300">Você será avisado quando um condutor cadastrar uma carona para esse trajeto.</p>
      <div>
        <label class="text-[9px] text-slate-300 font-bold uppercase block">Origem:</label>
        <input id="alert-origin" type="text" value="Penedo" class="w-full bg-[#0B1B16] text-white text-xs px-2.5 py-2 rounded-xl border border-slate-700 font-bold">
      </div>
      <div>
        <label class="text-[9px] text-slate-300 font-bold uppercase block">Destino:</label>
        <input id="alert-dest" type="text" value="Maceió" class="w-full bg-[#0B1B16] text-white text-xs px-2.5 py-2 rounded-xl border border-slate-700 font-bold">
      </div>
      <button onclick="saveCarpoolAlert()" class="w-full py-2.5 bg-[#FFCC45] text-[#123D32] font-black text-xs rounded-xl shadow">
        ATIVAR ALERTA
      </button>
    </div>
  </div>

  <!-- DIAGNOSTIC MODAL -->
  <div id="diag-modal" class="hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-[#123D32] border-2 border-[#16A572] rounded-3xl w-full max-w-sm p-4 flex flex-col gap-3 shadow-2xl">
      <div class="flex items-center justify-between border-b border-[#16A572]/30 pb-2">
        <h3 class="text-xs font-black text-white">Diagnóstico de Rede</h3>
        <button onclick="closeDiagModal()" class="text-slate-400 font-bold">✕</button>
      </div>
      <div class="bg-[#0B1B16] p-2.5 rounded-xl text-xs flex flex-col gap-1">
        <div class="flex justify-between">
          <span class="text-slate-400">Status API:</span>
          <span id="diag-status-badge" class="font-black text-[#16A572]">ONLINE (200 OK)</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Ping:</span>
          <span id="diag-ping-badge" class="font-mono text-white">24 ms</span>
        </div>
      </div>
      <div>
        <label class="text-[10px] text-[#FFCC45] font-black uppercase">Host IP:</label>
        <input id="diag-input-host" type="text" value="http://192.168.3.5:3001" class="w-full bg-[#0B1B16] text-white text-xs px-2.5 py-2 rounded-xl border border-slate-700 font-mono">
      </div>
      <div class="flex gap-2">
        <button onclick="testConnectionNow()" class="flex-1 py-2 bg-[#16A572] text-[#123D32] font-black text-xs rounded-xl">Testar</button>
        <button onclick="saveCustomHost()" class="py-2 px-3 bg-[#FFCC45] text-[#123D32] font-black text-xs rounded-xl">Salvar</button>
      </div>
    </div>
  </div>

  <script>
    let currentModality = 'rides';
    let API_HOST = localStorage.getItem('SIMBORA_API_HOST') || 'http://192.168.3.5:3001';
    let activeCarpoolTrip = null;
    let selectedBookingSeats = 1;

    // Sample Carpools fallback
    let sampleCarpools = [
      {
        id: 'cp_piacabucu_penedo_sample',
        driver: { name: 'Carlos Oliveira', rating: 4.98, isVerified: true },
        vehicle: { model: 'Fiat Cronos 2023', plate: 'QTT-4A82' },
        originCity: 'Piaçabuçu',
        destinationCity: 'Penedo',
        departureTime: '07:30',
        departureDate: '2026-11-02',
        pricePerSeat: 25.00,
        availableSeats: 3,
        bookingMode: 'MANUAL',
        intermediateStops: ['Trevo do Peba'],
        notes: 'Saída pontual na frente da matriz. Ar-condicionado ligado.'
      },
      {
        id: 'cp_penedo_maceio_sample',
        driver: { name: 'Carlos Oliveira', rating: 4.98, isVerified: true },
        vehicle: { model: 'Fiat Cronos 2023', plate: 'QTT-4A82' },
        originCity: 'Penedo',
        destinationCity: 'Maceió',
        departureTime: '06:00',
        departureDate: '2026-11-02',
        pricePerSeat: 45.00,
        availableSeats: 3,
        bookingMode: 'INSTANT',
        intermediateStops: ['Igreja Nova', 'São Miguel dos Campos'],
        notes: 'Direto via AL-101 Sul.'
      }
    ];

    function init() {
      document.getElementById('diag-input-host').value = API_HOST;
      document.getElementById('diag-host-label').innerText = API_HOST.replace(/^https?:\\/\\//, '');
      const today = new Date().toISOString().split('T')[0];
      const dateInp = document.getElementById('cp-search-date');
      if (dateInp) dateInp.value = today;

      testConnectionNow();
      renderCarpoolResults(sampleCarpools);
      fetchLiveCarpools();
    }

    // Switch between CORRIDA AGORA and CARONAS
    function switchModality(mode) {
      currentModality = mode;
      const btnRides = document.getElementById('btn-mode-rides');
      const btnCarpools = document.getElementById('btn-mode-carpools');
      const viewRides = document.getElementById('view-mode-rides');
      const viewCarpools = document.getElementById('view-mode-carpools');

      if (window.SIMBORA_NATIVE) window.SIMBORA_NATIVE.vibrate(25);

      if (mode === 'rides') {
        btnRides.className = 'flex-1 py-1.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 bg-[#FFCC45] text-[#123D32] shadow';
        btnCarpools.className = 'flex-1 py-1.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 bg-[#17211D] text-slate-300 border border-[#16A572]/30';
        viewRides.classList.remove('hidden');
        viewCarpools.classList.add('hidden');
      } else {
        btnCarpools.className = 'flex-1 py-1.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 bg-[#FFCC45] text-[#123D32] shadow';
        btnRides.className = 'flex-1 py-1.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 bg-[#17211D] text-slate-300 border border-[#16A572]/30';
        viewRides.classList.add('hidden');
        viewCarpools.classList.remove('hidden');
        fetchLiveCarpools();
      }
    }

    // Fetch live carpools from NestJS
    async function fetchLiveCarpools() {
      try {
        const res = await fetch(API_HOST + '/carpools/search');
        if (res.ok) {
          const data = await res.json();
          if (data.carpools && data.carpools.length > 0) {
            sampleCarpools = data.carpools;
            renderCarpoolResults(sampleCarpools);
          }
        }
      } catch (e) {}
    }

    function renderCarpoolResults(list) {
      const container = document.getElementById('carpool-results-list');
      document.getElementById('cp-results-title').innerText = 'Caronas Encontradas (' + list.length + ')';

      container.innerHTML = list.map(cp => {
        const modeBadge = cp.bookingMode === 'INSTANT' ?
          '<span class="text-[9px] bg-[#16A572]/20 text-[#16A572] border border-[#16A572]/40 px-2 py-0.5 rounded font-black">⚡ Reserva Instantânea</span>' :
          '<span class="text-[9px] bg-[#FFCC45]/20 text-[#FFCC45] border border-[#FFCC45]/40 px-2 py-0.5 rounded font-black">⏳ Aprovação Manual</span>';

        const stopsText = cp.intermediateStops && cp.intermediateStops.length > 0 ?
          '<p class="text-[10px] text-slate-400">Paradas: ' + cp.intermediateStops.map(s => typeof s === 'string' ? s : s.cityName || s.stopName).join(', ') + '</p>' : '';

        return '<div class="bg-[#123D32] p-3 rounded-2xl border border-[#16A572]/30 flex flex-col gap-2 shadow">' +
          '<div class="flex items-center justify-between">' +
            '<div class="flex items-center gap-2">' +
              '<div class="w-9 h-9 rounded-full bg-[#16A572] flex items-center justify-center font-black text-[#123D32] text-xs">CO</div>' +
              '<div>' +
                '<h4 class="text-xs font-black text-white">' + cp.driver.name + ' <span class="text-[#FFCC45]">' + cp.driver.rating + ' ⭐</span></h4>' +
                '<span class="text-[9px] text-[#16A572] font-bold">✓ Condutor Verificado</span>' +
              '</div>' +
            '</div>' +
            '<div class="text-right">' +
              '<span class="text-base font-black text-[#FFCC45]">R$ ' + Number(cp.pricePerSeat).toFixed(2).replace('.', ',') + '</span>' +
              '<span class="text-[9px] text-slate-400 block">por assento</span>' +
            '</div>' +
          '</div>' +
          '<div class="bg-[#0B1B16] p-2 rounded-xl flex flex-col gap-1 text-xs">' +
            '<div class="flex items-center justify-between">' +
              '<span class="font-bold text-white">📍 ' + cp.originCity + ' ➔ ' + cp.destinationCity + '</span>' +
              '<span class="text-[#FFCC45] font-black">' + cp.departureTime + '</span>' +
            '</div>' +
            stopsText +
            '<div class="flex items-center justify-between text-[10px] text-slate-300 pt-1 border-t border-slate-800">' +
              '<span>' + cp.vehicle.model + ' (' + cp.vehicle.plate + ')</span>' +
              '<span class="font-bold text-[#16A572]">' + cp.availableSeats + ' vagas restantes</span>' +
            '</div>' +
          '</div>' +
          '<div class="flex items-center justify-between pt-1">' +
            modeBadge +
            '<button onclick="openCarpoolBookingModal(\\'' + cp.id + '\\')" class="px-3 py-1.5 bg-[#FFCC45] text-[#123D32] text-xs font-black rounded-xl shadow active:scale-95 transition">Reservar Vaga</button>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    function setCarpoolSearchPreset(orig, dest) {
      document.getElementById('cp-search-origin').value = orig;
      document.getElementById('cp-search-dest').value = dest;
      performCarpoolSearch();
    }

    async function performCarpoolSearch() {
      const orig = document.getElementById('cp-search-origin').value;
      const dest = document.getElementById('cp-search-dest').value;
      const seats = document.getElementById('cp-search-seats').value;

      try {
        const url = API_HOST + '/carpools/search?origin=' + encodeURIComponent(orig) + '&destination=' + encodeURIComponent(dest) + '&seats=' + seats;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          renderCarpoolResults(data.carpools || sampleCarpools);
          return;
        }
      } catch (e) {}

      // Fallback local filter
      const filtered = sampleCarpools.filter(c =>
        c.originCity.toLowerCase().includes(orig.toLowerCase()) ||
        c.destinationCity.toLowerCase().includes(dest.toLowerCase())
      );
      renderCarpoolResults(filtered.length > 0 ? filtered : sampleCarpools);
    }

    function openCarpoolBookingModal(cpId) {
      activeCarpoolTrip = sampleCarpools.find(c => c.id === cpId) || sampleCarpools[0];
      selectedBookingSeats = 1;

      document.getElementById('modal-cp-route').innerText = activeCarpoolTrip.originCity + ' ➔ ' + activeCarpoolTrip.destinationCity;
      document.getElementById('modal-cp-driver').innerText = activeCarpoolTrip.driver.name + ' (4.98 ⭐)';
      document.getElementById('modal-cp-vehicle').innerText = activeCarpoolTrip.vehicle.model + ' (' + activeCarpoolTrip.vehicle.plate + ')';
      document.getElementById('modal-cp-time').innerText = activeCarpoolTrip.departureTime;
      document.getElementById('modal-cp-price').innerText = 'R$ ' + Number(activeCarpoolTrip.pricePerSeat).toFixed(2).replace('.', ',');
      updateBookingTotal();

      document.getElementById('carpool-booking-modal').classList.remove('hidden');
    }

    function closeCarpoolBookingModal() {
      document.getElementById('carpool-booking-modal').classList.add('hidden');
    }

    function selectBookingSeats(num) {
      selectedBookingSeats = num;
      document.getElementById('bseat-1').className = num === 1 ? 'flex-1 py-1.5 bg-[#FFCC45] text-[#123D32] font-black text-xs rounded-lg' : 'flex-1 py-1.5 bg-[#0B1B16] text-white border border-slate-700 font-bold text-xs rounded-lg';
      document.getElementById('bseat-2').className = num === 2 ? 'flex-1 py-1.5 bg-[#FFCC45] text-[#123D32] font-black text-xs rounded-lg' : 'flex-1 py-1.5 bg-[#0B1B16] text-white border border-slate-700 font-bold text-xs rounded-lg';
      updateBookingTotal();
    }

    function updateBookingTotal() {
      if (!activeCarpoolTrip) return;
      const total = activeCarpoolTrip.pricePerSeat * selectedBookingSeats;
      document.getElementById('modal-booking-total').innerText = 'R$ ' + total.toFixed(2).replace('.', ',');
    }

    async function confirmCarpoolBooking() {
      if (!activeCarpoolTrip) return;
      if (window.SIMBORA_NATIVE) window.SIMBORA_NATIVE.vibrate(60);

      try {
        await fetch(API_HOST + '/carpools/' + activeCarpoolTrip.id + '/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            passengerId: 'marina-silva',
            passengerName: 'Marina Silva',
            seatsCount: selectedBookingSeats,
            pickupCity: activeCarpoolTrip.originCity,
            dropoffCity: activeCarpoolTrip.destinationCity
          })
        });
      } catch (e) {}

      closeCarpoolBookingModal();

      const card = document.getElementById('passenger-active-reservation-card');
      const badge = document.getElementById('p-res-status-badge');
      if (activeCarpoolTrip.bookingMode === 'INSTANT') {
        badge.className = 'text-[9px] bg-[#16A572] text-[#07130F] px-2 py-0.5 rounded font-black';
        badge.innerText = 'CONFIRMADA';
        alert('Reserva Instantânea Confirmada! 1 lugar garantido com Carlos Oliveira.');
      } else {
        badge.className = 'text-[9px] bg-[#FFCC45] text-[#123D32] px-2 py-0.5 rounded font-black';
        badge.innerText = 'PENDENTE DE APROVAÇÃO';
        alert('Solicitação de carona enviada ao condutor Carlos Oliveira! Aguardando aprovação.');
      }
    }

    function openCarpoolAlertModal() {
      document.getElementById('carpool-alert-modal').classList.remove('hidden');
    }
    function closeCarpoolAlertModal() {
      document.getElementById('carpool-alert-modal').classList.add('hidden');
    }
    async function saveCarpoolAlert() {
      const orig = document.getElementById('alert-origin').value;
      const dest = document.getElementById('alert-dest').value;
      try {
        await fetch(API_HOST + '/carpool-alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passengerId: 'marina-silva', originCity: orig, destinationCity: dest })
        });
      } catch (e) {}
      closeCarpoolAlertModal();
      alert('Alerta ativado para viagens entre ' + orig + ' e ' + dest + '!');
    }

    // ON-DEMAND RIDE FUNCTIONS (PRESERVED)
    function selectCategory(cat, p) {
      document.getElementById('cat-comum').className = cat === 'comum' ? 'p-2 rounded-xl border-2 border-[#FFCC45] bg-[#0B1B16] flex items-center justify-between cursor-pointer' : 'p-2 rounded-xl border border-[#16A572]/40 bg-[#17211D] flex items-center justify-between cursor-pointer';
      document.getElementById('cat-mulher').className = cat === 'mulher' ? 'p-2 rounded-xl border-2 border-[#FFCC45] bg-[#0B1B16] flex items-center justify-between cursor-pointer' : 'p-2 rounded-xl border border-[#16A572]/40 bg-[#17211D] flex items-center justify-between cursor-pointer';
      document.getElementById('btn-request-price').innerText = 'R$ ' + p.toFixed(2).replace('.', ',');
    }
    function setPresetRoute(o, d, km, p) {
      document.getElementById('lbl-origem').innerText = o;
      document.getElementById('lbl-destino').innerText = d;
      selectCategory('comum', p);
    }
    function startRideRequest() {
      if (window.SIMBORA_NATIVE) window.SIMBORA_NATIVE.vibrate(50);
      document.getElementById('state-idle').classList.add('hidden');
      document.getElementById('state-radar').classList.remove('hidden');
      setTimeout(simulateDriverMatch, 3500);
    }
    function cancelRideRequest() {
      document.getElementById('state-radar').classList.add('hidden');
      document.getElementById('state-idle').classList.remove('hidden');
    }
    function simulateDriverMatch() {
      if (window.SIMBORA_NATIVE) window.SIMBORA_NATIVE.vibrate(100);
      document.getElementById('state-radar').classList.add('hidden');
      document.getElementById('state-active').classList.remove('hidden');
    }
    function completeRide() {
      if (window.SIMBORA_NATIVE) window.SIMBORA_NATIVE.vibrate(120);
      document.getElementById('state-active').classList.add('hidden');
      document.getElementById('state-completed').classList.remove('hidden');
    }
    function resetTripState() {
      document.getElementById('state-completed').classList.add('hidden');
      document.getElementById('state-idle').classList.remove('hidden');
    }

    // Tabs
    function switchTab(t) {
      ['home', 'activity', 'chat', 'safety', 'profile'].forEach(id => {
        const el = document.getElementById('tab-' + id);
        if (el) el.classList.add('hidden');
      });
      if (t === 'home') {
        if (currentModality === 'rides') document.getElementById('view-mode-rides').classList.remove('hidden');
        else document.getElementById('view-mode-carpools').classList.remove('hidden');
      } else {
        document.getElementById('view-mode-rides').classList.add('hidden');
        document.getElementById('view-mode-carpools').classList.add('hidden');
        document.getElementById('tab-' + t).classList.remove('hidden');
      }
    }

    function sendChatMessage() {
      const inp = document.getElementById('input-chat');
      if (!inp.value.trim()) return;
      const c = document.getElementById('chat-messages');
      const div = document.createElement('div');
      div.className = 'self-end max-w-[80%] bg-[#16A572] text-[#07130F] p-2 rounded-xl text-xs font-bold';
      div.innerText = inp.value;
      c.appendChild(div);
      inp.value = '';
    }

    function openDiagModal() { document.getElementById('diag-modal').classList.remove('hidden'); }
    function closeDiagModal() { document.getElementById('diag-modal').classList.add('hidden'); }
    async function testConnectionNow() {
      try {
        const res = await fetch(API_HOST + '/health');
        if (res.ok) {
          document.getElementById('diag-status-badge').innerText = 'ONLINE (200 OK)';
          document.getElementById('diag-dot').className = 'w-2 h-2 rounded-full bg-[#16A572] animate-pulse';
        }
      } catch (e) {
        document.getElementById('diag-status-badge').innerText = 'OFFLINE';
        document.getElementById('diag-dot').className = 'w-2 h-2 rounded-full bg-red-500';
      }
    }
    function saveCustomHost() {
      const val = document.getElementById('diag-input-host').value.trim();
      if (val) {
        API_HOST = val;
        localStorage.setItem('SIMBORA_API_HOST', val);
        document.getElementById('diag-host-label').innerText = val.replace(/^https?:\\/\\//, '');
        closeDiagModal();
        testConnectionNow();
      }
    }

    window.onload = init;
  </script>
</body>
</html>
`;

const DRIVER_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>SIMBORA Motorista 4.0</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #07130F;
      color: #F8F9F6;
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .custom-scroll::-webkit-scrollbar { width: 4px; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #FFCC45; border-radius: 4px; }
    .pulse-neon-online {
      box-shadow: 0 0 15px rgba(22, 165, 114, 0.8);
      animation: neonPulseGreen 2s infinite alternate;
    }
    @keyframes neonPulseGreen {
      0% { box-shadow: 0 0 8px rgba(22, 165, 114, 0.4); }
      100% { box-shadow: 0 0 20px rgba(22, 165, 114, 0.9); }
    }
  </style>
</head>
<body class="flex flex-col h-full select-none">

  <!-- TOP DRIVER HEADER -->
  <header class="bg-[#0B1B16] px-4 py-2.5 flex items-center justify-between border-b border-[#16A572]/30 shadow-lg z-30">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-[#FFCC45] flex items-center justify-center font-black text-[#123D32] text-lg shadow">
        M
      </div>
      <div>
        <h1 class="text-xs font-black tracking-wide text-white">SIMBORA <span class="text-[#FFCC45]">MOTORISTA 4.0</span></h1>
        <p class="text-[9px] text-[#16A572] font-black uppercase">Carlos Oliveira • 4.98 ⭐</p>
      </div>
    </div>

    <!-- ONLINE / OFFLINE TOGGLE -->
    <div class="flex items-center gap-2">
      <button onclick="toggleOnlineStatus()" id="btn-online-toggle" class="px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 bg-[#16A572] text-[#07130F] pulse-neon-online active:scale-95 transition">
        <span id="online-dot" class="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
        <span id="online-text">ONLINE</span>
      </button>
      <button onclick="openDriverDiagModal()" class="w-7 h-7 rounded-full bg-[#123D32] border border-[#16A572]/40 flex items-center justify-center text-xs text-[#FFCC45]">
        ⚙️
      </button>
    </div>
  </header>

  <!-- MODALITY TOGGLE BAR: [ CORRIDAS ] vs [ MINHAS CARONAS ] -->
  <div class="bg-[#123D32] px-3 py-1.5 border-b border-[#16A572]/30 flex items-center justify-center gap-2 z-30">
    <button onclick="switchDriverModality('rides')" id="dbtn-mode-rides" class="flex-1 py-1.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 bg-[#FFCC45] text-[#123D32] shadow">
      <span>🚗</span> CORRIDAS URBANAS
    </button>
    <button onclick="switchDriverModality('carpools')" id="dbtn-mode-carpools" class="flex-1 py-1.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 bg-[#0B1B16] text-slate-300 border border-[#16A572]/30">
      <span>👥</span> MINHAS CARONAS
    </button>
  </div>

  <!-- MAIN VIEWPORT -->
  <main class="flex-1 relative overflow-hidden flex flex-col bg-[#07130F]">

    <!-- ============================================= -->
    <!-- MODALITY A: CORRIDAS SOB DEMANDA (PRESERVED) -->
    <!-- ============================================= -->
    <div id="dview-mode-rides" class="flex-1 flex flex-col relative w-full h-full">

      <!-- Map Display Area -->
      <div class="flex-1 relative bg-[#07130F] overflow-hidden">
        <svg class="w-full h-full object-cover opacity-90" viewBox="0 0 400 450" preserveAspectRatio="none">
          <rect width="400" height="450" fill="#091813" />
          <path d="M 320,0 Q 290,140 270,270 Q 240,370 190,450 L 400,450 L 400,0 Z" fill="#041f1a" opacity="0.6" />
          <path d="M 0,340 Q 90,350 170,380 Q 220,400 270,450" stroke="#0077b6" stroke-width="18" fill="none" opacity="0.5" />
          <path d="M 170,390 Q 155,360 140,310 Q 130,260 120,200" stroke="#16A572" stroke-width="5" fill="none" stroke-linecap="round" />

          <circle cx="170" cy="390" r="9" fill="#16A572" stroke="#FFFFFF" stroke-width="2" />
          <text x="170" y="415" fill="#F8F9F6" font-size="11" font-weight="bold" text-anchor="middle">Piaçabuçu</text>

          <circle cx="120" cy="200" r="9" fill="#FFCC45" stroke="#123D32" stroke-width="2" />
          <text x="120" y="185" fill="#FFCC45" font-size="11" font-weight="bold" text-anchor="middle">Penedo</text>

          <g id="driver-car-marker" transform="translate(170, 390)">
            <circle cx="0" cy="0" r="16" fill="#123D32" stroke="#16A572" stroke-width="3" />
            <polygon points="0,-12 8,8 0,4 -8,8" fill="#FFCC45" />
          </g>
        </svg>

        <!-- Top Floating Status Pill -->
        <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <div class="bg-[#0B1B16]/90 backdrop-blur border border-[#16A572]/40 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#16A572] animate-ping"></span>
            <span id="nav-mode-label" class="text-xs font-black text-white">Aguardando Corridas</span>
          </div>
          <button onclick="simulateIncomingRide()" class="px-3 py-1.5 bg-[#FFCC45] text-[#123D32] text-xs font-black rounded-xl shadow active:scale-95">
            ⚡ Simular Corrida
          </button>
        </div>

        <!-- Offline Overlay -->
        <div id="offline-overlay" class="hidden absolute inset-0 bg-black/75 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center">
          <span class="text-4xl mb-2">🛑</span>
          <h3 class="text-base font-black text-white mb-1">Você está OFFLINE</h3>
          <p class="text-xs text-slate-300 mb-4 max-w-xs">Toque no botão para ficar ONLINE para corridas imediatas.</p>
          <button onclick="toggleOnlineStatus()" class="px-6 py-2.5 bg-[#16A572] text-[#07130F] font-black text-xs rounded-2xl shadow-lg">
            FICAR ONLINE AGORA
          </button>
        </div>
      </div>

      <!-- INCOMING RIDE OFFER MODAL (15s) -->
      <div id="offer-modal" class="hidden absolute bottom-0 left-0 right-0 bg-[#0B1B16] border-t-4 border-[#FFCC45] rounded-t-3xl p-4 shadow-2xl z-30 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="relative w-10 h-10 flex items-center justify-center">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" stroke="#17211D" stroke-width="3" fill="none"></circle>
                <circle id="countdown-circle" cx="18" cy="18" r="15" stroke="#FFCC45" stroke-width="3" fill="none" stroke-dasharray="94.2" stroke-dashoffset="0"></circle>
              </svg>
              <span id="countdown-number" class="absolute text-xs font-black text-white">15</span>
            </div>
            <div>
              <span class="text-[10px] text-[#16A572] font-black uppercase tracking-wider block">NOVA CORRIDA DISPONÍVEL</span>
              <h3 class="text-xs font-bold text-slate-300">SIMBORA Comum • 4 passageiros</h3>
            </div>
          </div>
          <span class="text-base font-black text-[#FFCC45]">R$ 36,12</span>
        </div>

        <div class="bg-[#123D32] p-2.5 rounded-xl text-xs flex flex-col gap-1">
          <p class="font-bold text-white">📍 Praça São Francisco (Piaçabuçu) ➔ Centro (Penedo)</p>
          <span class="text-[10px] text-slate-300">Passageira: Marina Silva (4.9 ⭐)</span>
        </div>

        <div class="flex gap-2">
          <button onclick="declineOffer()" class="w-1/3 py-3 bg-red-950/70 border border-red-500/60 text-red-200 font-black text-xs rounded-xl">RECUSAR</button>
          <button onclick="acceptOffer()" class="flex-1 py-3 bg-[#16A572] text-[#07130F] font-black text-xs rounded-xl shadow">ACEITAR CORRIDA</button>
        </div>
      </div>

      <!-- PICKUP HUD -->
      <div id="hud-pickup" class="hidden absolute bottom-0 left-0 right-0 bg-[#0B1B16] border-t-2 border-[#16A572] rounded-t-3xl p-4 shadow-2xl z-30 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[10px] text-[#FFCC45] font-black uppercase block">A CAMINHO DO PASSAGEIRO</span>
            <h3 class="text-xs font-black text-white">Praça São Francisco, Piaçabuçu</h3>
          </div>
          <span class="text-sm font-black text-[#16A572]">3 min (1,2 km)</span>
        </div>
        <button onclick="arriveAtPickup()" class="w-full py-3 bg-[#FFCC45] text-[#123D32] font-black text-xs rounded-xl shadow">
          CHEGUEI AO LOCAL
        </button>
      </div>

      <!-- PIN MODAL -->
      <div id="pin-modal" class="hidden absolute inset-0 bg-black/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-4">
        <div class="bg-[#0B1B16] border-2 border-[#FFCC45] rounded-3xl w-full max-w-xs p-5 flex flex-col items-center text-center shadow-2xl">
          <h3 class="text-sm font-black text-white mb-1">Código de Segurança</h3>
          <p class="text-xs text-slate-300 mb-3">Solicite o PIN de 4 dígitos à passageira.</p>
          <div class="flex gap-2 mb-3">
            <div id="pin-box-0" class="w-10 h-10 rounded-xl bg-[#123D32] border border-[#16A572] flex items-center justify-center text-base font-black text-[#FFCC45]"></div>
            <div id="pin-box-1" class="w-10 h-10 rounded-xl bg-[#123D32] border border-[#16A572] flex items-center justify-center text-base font-black text-[#FFCC45]"></div>
            <div id="pin-box-2" class="w-10 h-10 rounded-xl bg-[#123D32] border border-[#16A572] flex items-center justify-center text-base font-black text-[#FFCC45]"></div>
            <div id="pin-box-3" class="w-10 h-10 rounded-xl bg-[#123D32] border border-[#16A572] flex items-center justify-center text-base font-black text-[#FFCC45]"></div>
          </div>
          <div class="grid grid-cols-3 gap-2 w-full max-w-[200px]">
            <button onclick="pressPinKey('4')" class="h-10 rounded-xl bg-[#123D32] text-white font-black text-sm">4</button>
            <button onclick="pressPinKey('8')" class="h-10 rounded-xl bg-[#123D32] text-white font-black text-sm">8</button>
            <button onclick="pressPinKey('2')" class="h-10 rounded-xl bg-[#123D32] text-white font-black text-sm">2</button>
            <button onclick="pressPinKey('1')" class="h-10 rounded-xl bg-[#123D32] text-white font-black text-sm">1</button>
            <button onclick="fillCorrectPin()" class="col-span-2 h-10 rounded-xl bg-[#17211D] text-[#FFCC45] font-black text-[10px]">PIN Rápido 4821</button>
          </div>
        </div>
      </div>

      <!-- IN-TRIP HUD -->
      <div id="hud-in-trip" class="hidden absolute bottom-0 left-0 right-0 bg-[#0B1B16] border-t-2 border-[#FFCC45] rounded-t-3xl p-4 shadow-2xl z-30 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <p class="text-xs font-black text-white">Destino: Centro Histórico, Penedo</p>
          <span class="text-base font-black text-[#FFCC45]">74 km/h</span>
        </div>
        <button onclick="finishTripDriver()" class="w-full py-3.5 bg-[#16A572] text-[#07130F] font-black text-xs rounded-2xl shadow">
          FINALIZAR CORRIDA
        </button>
      </div>

      <!-- TRIP FINISHED MODAL -->
      <div id="modal-finished" class="hidden absolute inset-0 bg-black/85 backdrop-blur-md z-40 flex flex-col items-center justify-center p-4">
        <div class="bg-[#0B1B16] border-2 border-[#16A572] rounded-3xl w-full max-w-xs p-5 flex flex-col items-center text-center shadow-2xl gap-3">
          <span class="text-3xl">💰</span>
          <h3 class="text-base font-black text-white">Corrida Concluída!</h3>
          <p class="text-sm font-black text-[#FFCC45]">+ R$ 36,12 (PIX Creditado)</p>
          <button onclick="dismissTripFinished()" class="w-full py-2.5 bg-[#FFCC45] text-[#123D32] font-black text-xs rounded-xl shadow">
            VOLTAR A NAVEGAR
          </button>
        </div>
      </div>

    </div>

    <!-- ============================================== -->
    <!-- MODALITY B: MINHAS CARONAS (INTERCITY CARPOOL) -->
    <!-- ============================================== -->
    <div id="dview-mode-carpools" class="hidden flex-1 flex flex-col p-3 overflow-y-auto custom-scroll bg-[#07130F] gap-3">

      <!-- Header & Publish Action Button -->
      <div class="bg-[#123D32] p-3.5 rounded-2xl border border-[#16A572]/40 shadow-lg flex items-center justify-between">
        <div>
          <h2 class="text-xs font-black text-white uppercase">Gestão de Caronas</h2>
          <p class="text-[10px] text-slate-300">Viagens Intermunicipais Programadas</p>
        </div>
        <button onclick="openPublishCarpoolModal()" class="px-3.5 py-2 bg-[#FFCC45] text-[#123D32] font-black text-xs rounded-xl shadow flex items-center gap-1 active:scale-95 transition">
          <span>+</span> PUBLICAR CARONA
        </button>
      </div>

      <!-- Incoming Reservation Requests (Needs Approval) -->
      <div class="bg-[#0B1B16] p-3 rounded-2xl border border-[#FFCC45]/40 flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-black text-[#FFCC45] flex items-center gap-1">
            <span>⏳</span> SOLICITAÇÕES DE RESERVA PENDENTES
          </span>
          <span id="d-pending-badge" class="text-[9px] bg-[#FFCC45] text-[#123D32] px-2 py-0.5 rounded font-black">1 Pendente</span>
        </div>

        <div id="d-reservation-request-card" class="bg-[#123D32] p-3 rounded-xl border border-[#16A572]/30 flex flex-col gap-2 text-xs">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-black text-white">Marina Silva <span class="text-[#FFCC45]">4.9 ⭐</span></h4>
              <p class="text-[10px] text-slate-300">Piaçabuçu ➔ Penedo • 1 assento (R$ 25,00)</p>
            </div>
            <span class="text-[10px] text-[#16A572] font-black">PIX Simulado</span>
          </div>
          <div class="flex gap-2 pt-1 border-t border-slate-700/50">
            <button onclick="driverRejectReservation()" class="w-1/3 py-2 bg-red-900/60 border border-red-500/50 text-red-200 font-bold text-xs rounded-xl">Recusar</button>
            <button onclick="driverApproveReservation()" class="flex-1 py-2 bg-[#16A572] text-[#07130F] font-black text-xs rounded-xl shadow">APROVAR RESERVA</button>
          </div>
        </div>
      </div>

      <!-- My Published Trips List -->
      <div class="flex flex-col gap-2">
        <span class="text-xs font-black text-white px-1">Minhas Viagens Publicadas:</span>

        <!-- Trip Card 1 -->
        <div class="bg-[#0B1B16] p-3 rounded-2xl border border-[#16A572]/30 flex flex-col gap-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-black text-white">Piaçabuçu ➔ Penedo</span>
            <span class="text-[#FFCC45] font-black">07:30 • R$ 25,00</span>
          </div>
          <p class="text-[10px] text-slate-300">Paradas: Pontal do Peba • <span class="text-[#16A572] font-bold">2 vagas restantes</span></p>
          <div class="flex gap-2 pt-1 border-t border-slate-800">
            <button onclick="startCarpoolTrip()" class="flex-1 py-2 bg-[#16A572] text-[#07130F] font-black rounded-xl">INICIAR VIAGEM</button>
            <button onclick="finishCarpoolTrip()" class="py-2 px-3 bg-[#123D32] border border-[#16A572]/50 text-white font-bold rounded-xl">Finalizar</button>
          </div>
        </div>

        <!-- Trip Card 2 -->
        <div class="bg-[#0B1B16] p-3 rounded-2xl border border-[#16A572]/30 flex flex-col gap-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-black text-white">Penedo ➔ Maceió</span>
            <span class="text-[#FFCC45] font-black">06:00 • R$ 45,00</span>
          </div>
          <p class="text-[10px] text-slate-300">Paradas: Igreja Nova, São Miguel dos Campos • <span class="text-[#16A572] font-bold">3 vagas</span></p>
          <span class="text-[9px] text-slate-400">⚡ Reserva Instantânea Ativada</span>
        </div>
      </div>

    </div>

    <!-- TAB: GANHOS -->
    <div id="dtab-earnings" class="hidden flex-1 flex flex-col p-4 overflow-y-auto custom-scroll bg-[#07130F] gap-3">
      <h2 class="text-base font-black text-white">Meus Ganhos</h2>
      <div class="bg-[#123D32] p-4 rounded-2xl border border-[#16A572]">
        <span class="text-[10px] text-slate-400 uppercase">Saldo Total (Corridas + Caronas):</span>
        <h3 id="driver-wallet-balance" class="text-2xl font-black text-[#FFCC45]">R$ 1.842,50</h3>
      </div>
    </div>

    <!-- TAB: DOCUMENTOS -->
    <div id="dtab-docs" class="hidden flex-1 flex flex-col p-4 overflow-y-auto custom-scroll bg-[#07130F] gap-3">
      <h2 class="text-base font-black text-white">Documentos Aprovados</h2>
      <p class="text-xs text-[#16A572]">CNH com EAR e CRLV 2024 Regulares</p>
    </div>

    <!-- TAB: MEU VEÍCULO -->
    <div id="dtab-vehicle" class="hidden flex-1 flex flex-col p-4 overflow-y-auto custom-scroll bg-[#07130F] gap-3">
      <h2 class="text-base font-black text-white">Meu Veículo</h2>
      <div class="bg-[#123D32] p-3 rounded-xl border border-[#16A572]">
        <p class="text-xs font-bold text-white">Fiat Cronos Precision 1.3 AT (QTT-4A82)</p>
      </div>
    </div>

    <!-- TAB: PERFIL -->
    <div id="dtab-profile" class="hidden flex-1 flex flex-col p-4 overflow-y-auto custom-scroll bg-[#07130F] gap-3">
      <h2 class="text-base font-black text-white">Perfil do Motorista</h2>
      <p class="text-xs text-slate-300">Carlos Oliveira • 4.98 ⭐</p>
    </div>

  </main>

  <!-- DRIVER BOTTOM NAVIGATION BAR -->
  <nav class="bg-[#0B1B16] border-t border-[#16A572]/40 px-2 py-2 flex items-center justify-around z-30">
    <button onclick="switchDriverTab('nav')" id="dnav-nav" class="flex flex-col items-center gap-0.5 text-[#FFCC45]">
      <span class="text-lg">🧭</span>
      <span class="text-[10px] font-black">Navegar</span>
    </button>
    <button onclick="switchDriverTab('earnings')" id="dnav-earnings" class="flex flex-col items-center gap-0.5 text-slate-400">
      <span class="text-lg">💰</span>
      <span class="text-[10px] font-bold">Ganhos</span>
    </button>
    <button onclick="switchDriverTab('docs')" id="dnav-docs" class="flex flex-col items-center gap-0.5 text-slate-400">
      <span class="text-lg">📋</span>
      <span class="text-[10px] font-bold">Documentos</span>
    </button>
    <button onclick="switchDriverTab('vehicle')" id="dnav-vehicle" class="flex flex-col items-center gap-0.5 text-slate-400">
      <span class="text-lg">🚙</span>
      <span class="text-[10px] font-bold">Veículo</span>
    </button>
    <button onclick="switchDriverTab('profile')" id="dnav-profile" class="flex flex-col items-center gap-0.5 text-slate-400">
      <span class="text-lg">⭐</span>
      <span class="text-[10px] font-bold">Perfil</span>
    </button>
  </nav>

  <!-- MODAL: PUBLICAR NOVA CARONA -->
  <div id="publish-carpool-modal" class="hidden fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col p-4">
    <div class="bg-[#0B1B16] border-2 border-[#FFCC45] rounded-3xl flex-1 flex flex-col overflow-hidden shadow-2xl p-4 gap-3">
      <div class="flex items-center justify-between border-b border-[#16A572]/30 pb-2">
        <div>
          <h3 class="text-xs font-black text-white">Publicar Viagem Intermunicipal</h3>
          <p class="text-[9px] text-[#FFCC45] font-bold">SIMBORA Caronas Alagoas</p>
        </div>
        <button onclick="closePublishCarpoolModal()" class="text-slate-400 font-bold">✕</button>
      </div>

      <div class="flex-1 overflow-y-auto custom-scroll flex flex-col gap-2.5 text-xs">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-[9px] text-[#FFCC45] font-bold uppercase">Cidade Origem:</label>
            <input id="pub-origin" type="text" value="Penedo" class="w-full bg-[#123D32] text-white px-2.5 py-2 rounded-xl border border-slate-700 font-bold">
          </div>
          <div>
            <label class="text-[9px] text-[#FFCC45] font-bold uppercase">Cidade Destino:</label>
            <input id="pub-dest" type="text" value="Maceió" class="w-full bg-[#123D32] text-white px-2.5 py-2 rounded-xl border border-slate-700 font-bold">
          </div>
        </div>

        <div>
          <label class="text-[9px] text-[#FFCC45] font-bold uppercase">Paradas Intermediárias (opcional):</label>
          <input id="pub-stops" type="text" value="Igreja Nova, São Miguel dos Campos" class="w-full bg-[#123D32] text-white px-2.5 py-2 rounded-xl border border-slate-700">
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-[9px] text-[#FFCC45] font-bold uppercase">Data de Saída:</label>
            <input id="pub-date" type="date" class="w-full bg-[#123D32] text-white px-2.5 py-2 rounded-xl border border-slate-700">
          </div>
          <div>
            <label class="text-[9px] text-[#FFCC45] font-bold uppercase">Horário de Saída:</label>
            <input id="pub-time" type="time" value="06:30" class="w-full bg-[#123D32] text-white px-2.5 py-2 rounded-xl border border-slate-700">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-[9px] text-[#FFCC45] font-bold uppercase">Assentos Livres:</label>
            <select id="pub-seats" class="w-full bg-[#123D32] text-white px-2.5 py-2 rounded-xl border border-slate-700 font-bold">
              <option value="3">3 vagas</option>
              <option value="2">2 vagas</option>
              <option value="1">1 vaga</option>
            </select>
          </div>
          <div>
            <label class="text-[9px] text-[#FFCC45] font-bold uppercase">Preço / Assento (R$):</label>
            <input id="pub-price" type="number" value="35.00" class="w-full bg-[#123D32] text-white px-2.5 py-2 rounded-xl border border-slate-700 font-bold">
          </div>
        </div>

        <div>
          <label class="text-[9px] text-[#FFCC45] font-bold uppercase">Modo de Reserva:</label>
          <select id="pub-booking-mode" class="w-full bg-[#123D32] text-white px-2.5 py-2 rounded-xl border border-slate-700 font-bold">
            <option value="MANUAL">Aprovação Manual pelo Condutor</option>
            <option value="INSTANT">Reserva Instantânea Automática</option>
          </select>
        </div>
      </div>

      <button onclick="submitPublishCarpool()" class="w-full py-3 bg-[#16A572] text-[#07130F] font-black text-xs rounded-xl shadow active:scale-95 transition">
        PUBLICAR CARONA NO SIMBORA
      </button>
    </div>
  </div>

  <!-- DIAGNOSTIC MODAL -->
  <div id="ddiag-modal" class="hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-[#0B1B16] border-2 border-[#16A572] rounded-3xl w-full max-w-sm p-4 flex flex-col gap-3 shadow-2xl">
      <div class="flex items-center justify-between border-b border-[#16A572]/30 pb-2">
        <h3 class="text-xs font-black text-white">Status Conexão Motorista</h3>
        <button onclick="closeDriverDiagModal()" class="text-slate-400 font-bold">✕</button>
      </div>
      <div>
        <label class="text-[10px] text-[#FFCC45] font-bold uppercase">Host IP:</label>
        <input id="ddiag-input-host" type="text" value="http://192.168.3.5:3001" class="w-full bg-[#123D32] text-white text-xs px-2.5 py-2 rounded-xl border border-slate-700 font-mono">
      </div>
      <button onclick="closeDriverDiagModal()" class="w-full py-2 bg-[#FFCC45] text-[#123D32] font-black text-xs rounded-xl">Fechar</button>
    </div>
  </div>

  <script>
    let currentDriverModality = 'rides';
    let isOnline = true;
    let countdownSec = 15;
    let countdownTimer = null;
    let enteredPin = '';
    let API_HOST = localStorage.getItem('SIMBORA_API_HOST') || 'http://192.168.3.5:3001';

    function init() {
      const today = new Date().toISOString().split('T')[0];
      const dateInp = document.getElementById('pub-date');
      if (dateInp) dateInp.value = today;
    }

    function switchDriverModality(mode) {
      currentDriverModality = mode;
      const btnRides = document.getElementById('dbtn-mode-rides');
      const btnCarpools = document.getElementById('dbtn-mode-carpools');
      const viewRides = document.getElementById('dview-mode-rides');
      const viewCarpools = document.getElementById('dview-mode-carpools');

      if (window.SIMBORA_NATIVE) window.SIMBORA_NATIVE.vibrate(25);

      if (mode === 'rides') {
        btnRides.className = 'flex-1 py-1.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 bg-[#FFCC45] text-[#123D32] shadow';
        btnCarpools.className = 'flex-1 py-1.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 bg-[#0B1B16] text-slate-300 border border-[#16A572]/30';
        viewRides.classList.remove('hidden');
        viewCarpools.classList.add('hidden');
      } else {
        btnCarpools.className = 'flex-1 py-1.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 bg-[#FFCC45] text-[#123D32] shadow';
        btnRides.className = 'flex-1 py-1.5 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 bg-[#0B1B16] text-slate-300 border border-[#16A572]/30';
        viewRides.classList.add('hidden');
        viewCarpools.classList.remove('hidden');
      }
    }

    // Carpool Driver Actions
    function openPublishCarpoolModal() {
      document.getElementById('publish-carpool-modal').classList.remove('hidden');
    }
    function closePublishCarpoolModal() {
      document.getElementById('publish-carpool-modal').classList.add('hidden');
    }
    async function submitPublishCarpool() {
      const orig = document.getElementById('pub-origin').value;
      const dest = document.getElementById('pub-dest').value;
      const date = document.getElementById('pub-date').value;
      const time = document.getElementById('pub-time').value;
      const seats = document.getElementById('pub-seats').value;
      const price = document.getElementById('pub-price').value;
      const bMode = document.getElementById('pub-booking-mode').value;
      const stops = document.getElementById('pub-stops').value.split(',').map(s => ({ cityName: s.trim() }));

      if (window.SIMBORA_NATIVE) window.SIMBORA_NATIVE.vibrate(80);

      try {
        await fetch(API_HOST + '/carpools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            driverId: 'carlos-oliveira',
            originCity: orig,
            destinationCity: dest,
            departureDate: date,
            departureTime: time,
            totalSeats: Number(seats),
            pricePerSeat: Number(price),
            bookingMode: bMode,
            intermediateStops: stops
          })
        });
      } catch (e) {}

      closePublishCarpoolModal();
      alert('Viagem de carona publicada com sucesso no SIMBORA!');
    }

    async function driverApproveReservation() {
      if (window.SIMBORA_NATIVE) window.SIMBORA_NATIVE.vibrate(100);
      const card = document.getElementById('d-reservation-request-card');
      const badge = document.getElementById('d-pending-badge');
      card.innerHTML = '<span class="text-[#16A572] font-black text-xs">✓ Reserva de Marina Silva APROVADA com sucesso! (1 assento garantido)</span>';
      badge.innerText = '0 Pendentes';
      badge.className = 'text-[9px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-black';

      try {
        await fetch(API_HOST + '/carpool-reservations/res_cp_001_marina/accept', { method: 'POST' });
      } catch (e) {}
    }

    function driverRejectReservation() {
      const card = document.getElementById('d-reservation-request-card');
      card.innerHTML = '<span class="text-red-400 font-bold text-xs">Reserva recusada pelo condutor.</span>';
    }

    function startCarpoolTrip() {
      if (window.SIMBORA_NATIVE) window.SIMBORA_NATIVE.vibrate(50);
      alert('Viagem de carona Piaçabuçu ➔ Penedo iniciada!');
    }

    function finishCarpoolTrip() {
      if (window.SIMBORA_NATIVE) window.SIMBORA_NATIVE.vibrate(150);
      alert('Carona concluída com sucesso! +R$ 21,25 líquido creditado via PIX.');
      document.getElementById('driver-wallet-balance').innerText = 'R$ 1.863,75';
    }

    // ON-DEMAND DRIVER FLOW (PRESERVED)
    function toggleOnlineStatus() {
      isOnline = !isOnline;
      const btn = document.getElementById('btn-online-toggle');
      const text = document.getElementById('online-text');
      const overlay = document.getElementById('offline-overlay');
      if (isOnline) {
        btn.className = 'px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 bg-[#16A572] text-[#07130F] pulse-neon-online';
        text.innerText = 'ONLINE';
        overlay.classList.add('hidden');
      } else {
        btn.className = 'px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 bg-red-600 text-white';
        text.innerText = 'OFFLINE';
        overlay.classList.remove('hidden');
      }
    }
    function simulateIncomingRide() {
      if (!isOnline) toggleOnlineStatus();
      document.getElementById('offer-modal').classList.remove('hidden');
    }
    function declineOffer() { document.getElementById('offer-modal').classList.add('hidden'); }
    function acceptOffer() {
      document.getElementById('offer-modal').classList.add('hidden');
      document.getElementById('hud-pickup').classList.remove('hidden');
    }
    function arriveAtPickup() {
      document.getElementById('hud-pickup').classList.add('hidden');
      document.getElementById('pin-modal').classList.remove('hidden');
    }
    function fillCorrectPin() {
      document.getElementById('pin-modal').classList.add('hidden');
      document.getElementById('hud-in-trip').classList.remove('hidden');
    }
    function pressPinKey(k) { fillCorrectPin(); }
    function finishTripDriver() {
      document.getElementById('hud-in-trip').classList.add('hidden');
      document.getElementById('modal-finished').classList.remove('hidden');
      document.getElementById('driver-wallet-balance').innerText = 'R$ 1.878,62';
    }
    function dismissTripFinished() { document.getElementById('modal-finished').classList.add('hidden'); }

    // Tabs
    function switchDriverTab(t) {
      ['nav', 'earnings', 'docs', 'vehicle', 'profile'].forEach(id => {
        const el = document.getElementById('dtab-' + id);
        if (el) el.classList.add('hidden');
      });
      if (t === 'nav') {
        if (currentDriverModality === 'rides') document.getElementById('dview-mode-rides').classList.remove('hidden');
        else document.getElementById('dview-mode-carpools').classList.remove('hidden');
      } else {
        document.getElementById('dview-mode-rides').classList.add('hidden');
        document.getElementById('dview-mode-carpools').classList.add('hidden');
        document.getElementById('dtab-' + t).classList.remove('hidden');
      }
    }

    function openDriverDiagModal() { document.getElementById('ddiag-modal').classList.remove('hidden'); }
    function closeDriverDiagModal() { document.getElementById('ddiag-modal').classList.add('hidden'); }

    window.onload = init;
  </script>
</body>
</html>
`;

// Write the asset files to both apps
const baseDir = path.resolve(__dirname, 'android-build');
const passengerIndex = path.join(baseDir, 'passenger', 'assets', 'www', 'index.html');
const driverIndex = path.join(baseDir, 'driver', 'assets', 'www', 'index.html');

fs.writeFileSync(passengerIndex, PASSENGER_HTML, 'utf8');
fs.writeFileSync(driverIndex, DRIVER_HTML, 'utf8');

console.log('Successfully generated SIMBORA 4.0 Dual-Modality Apps (Passenger & Driver)!');
