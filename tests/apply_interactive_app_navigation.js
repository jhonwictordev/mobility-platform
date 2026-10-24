const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'mobility_interactive_studio.html');
const brainFile = 'C:\\Users\\winc\\.gemini\\antigravity\\brain\\0e4110ac-259e-4ca3-a9b7-c49d7be31808\\mobility_interactive_studio.html';

console.log('Carregando HTML do Studio...');
let html = fs.readFileSync(targetFile, 'utf8');

// Normalize to LF for matching
const isCRLF = html.includes('\r\n');
html = html.replace(/\r\n/g, '\n');

// 0. ADD GLOBAL APP NAVIGATION SHORTCUT BAR
const oldSimulatorsWrapper = `<div id="simulators-wrapper" class="flex items-center justify-center gap-12 transition-all duration-300" style="transform: scale(0.86); transform-origin: top center;">`;
const newSimulatorsWrapper = `
    <!-- GLOBAL APP NAVIGATION SHORTCUT BAR -->
    <div class="mb-5 flex flex-wrap items-center justify-center gap-6 bg-[#123D32]/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-[#16A572]/40 text-xs shadow-2xl">
      <div class="flex items-center gap-2">
        <span class="text-[11px] font-black uppercase text-[#16A572] flex items-center gap-1">
          <i data-lucide="user" class="w-3.5 h-3.5"></i> Telas Passageiro:
        </span>
        <button onclick="switchPassengerTab('home')" id="pill-p-home" class="px-2.5 py-1 rounded-lg font-bold bg-[#16A572] text-[#123D32] transition">🗺️ Início (Mapa)</button>
        <button onclick="switchPassengerTab('activity')" id="pill-p-activity" class="px-2.5 py-1 rounded-lg font-bold bg-[#17211D] text-slate-300 hover:text-white border border-[#16A572]/30 transition">📜 Atividades</button>
        <button onclick="switchPassengerTab('chat')" id="pill-p-chat" class="px-2.5 py-1 rounded-lg font-bold bg-[#17211D] text-slate-300 hover:text-white border border-[#16A572]/30 transition">💬 Chat</button>
        <button onclick="switchPassengerTab('safety')" id="pill-p-safety" class="px-2.5 py-1 rounded-lg font-bold bg-[#17211D] text-slate-300 hover:text-white border border-[#16A572]/30 transition">🛡️ Segurança / SOS</button>
        <button onclick="switchPassengerTab('profile')" id="pill-p-profile" class="px-2.5 py-1 rounded-lg font-bold bg-[#17211D] text-slate-300 hover:text-white border border-[#16A572]/30 transition">👤 Minha Conta</button>
      </div>

      <div class="h-4 w-px bg-[#16A572]/40 hidden md:block"></div>

      <div class="flex items-center gap-2">
        <span class="text-[11px] font-black uppercase text-[#FFCC45] flex items-center gap-1">
          <i data-lucide="car" class="w-3.5 h-3.5"></i> Telas Motorista:
        </span>
        <button onclick="switchDriverTab('nav')" id="pill-d-nav" class="px-2.5 py-1 rounded-lg font-bold bg-[#FFCC45] text-[#123D32] transition">🧭 Navegar (GPS)</button>
        <button onclick="switchDriverTab('earnings')" id="pill-d-earnings" class="px-2.5 py-1 rounded-lg font-bold bg-[#17211D] text-slate-300 hover:text-white border border-[#16A572]/30 transition">💰 Ganhos PIX</button>
        <button onclick="switchDriverTab('docs')" id="pill-d-docs" class="px-2.5 py-1 rounded-lg font-bold bg-[#17211D] text-slate-300 hover:text-white border border-[#16A572]/30 transition">📋 Documentos</button>
        <button onclick="switchDriverTab('vehicle')" id="pill-d-vehicle" class="px-2.5 py-1 rounded-lg font-bold bg-[#17211D] text-slate-300 hover:text-white border border-[#16A572]/30 transition">🚙 Veículo</button>
        <button onclick="switchDriverTab('profile')" id="pill-d-profile" class="px-2.5 py-1 rounded-lg font-bold bg-[#17211D] text-slate-300 hover:text-white border border-[#16A572]/30 transition">⭐ Perfil</button>
      </div>
    </div>

    <!-- DUAL MOBILE SIMULATORS WRAPPER -->
    <div id="simulators-wrapper" class="flex items-center justify-center gap-12 transition-all duration-300" style="transform: scale(0.86); transform-origin: top center;">
`;

if (html.includes(oldSimulatorsWrapper)) {
  html = html.replace(oldSimulatorsWrapper, newSimulatorsWrapper);
  console.log('✅ Barra global de atalhos de tela injetada com sucesso.');
}

// 1. REPLACEMENT FOR PASSENGER PHONE INNER BODY
const pTargetStart = `          <!-- Map Container (MapLibre GL) -->
          <div class="relative flex-1 w-full bg-slate-200 overflow-hidden">
            <div id="passenger-map" class="w-full h-full"></div>`;

const pTargetEnd = `          <!-- Home Indicator -->
          <div class="phone-home-indicator"></div>`;

const pReplacement = `          <!-- SCREEN 1: MAP & RIDE DISPATCH (HOME) -->
          <div id="p-screen-home" class="p-app-screen flex-1 flex flex-col relative w-full overflow-hidden">
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
            <div class="bg-[#F8F9F6] border-t border-slate-200 rounded-t-3xl shadow-2xl p-5 relative z-20 transition-all duration-300 max-h-[380px] overflow-y-auto mb-14">
              
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
                  <span class="font-bold text-[#16A572] cursor-pointer" onclick="switchPassengerTab('profile')">Trocar</span>
                </div>

                <!-- Request Button -->
                <button onclick="passengerRequestRide()" class="w-full py-4 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] font-black rounded-2xl shadow-lg shadow-[#123D32]/30 transition text-sm flex items-center justify-center gap-2">
                  <span>SOLICITAR SIMBORA (R$ 68,01)</span>
                </button>
              </div>

              <!-- STATE 2: SEARCHING DRIVERS (RADAR PULSE) -->
              <div id="p-state-searching" class="hidden text-center space-y-4 py-4">
                <div class="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div class="absolute inset-0 rounded-full bg-[#16A572]/30 pulse-radar-simbora"></div>
                  <div class="w-14 h-14 rounded-full bg-[#123D32] text-[#FFCC45] flex items-center justify-center text-2xl shadow-xl z-10">
                    🚗
                  </div>
                </div>
                <div>
                  <h3 class="font-black text-base text-[#123D32]">Procurando motoristas parceiros...</h3>
                  <p class="text-xs text-slate-500 mt-1">Conectando aos condutores homologados de Piaçabuçu</p>
                </div>
                <button onclick="passengerCancelRequest()" class="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-2xl text-xs transition">
                  Cancelar Solicitação
                </button>
              </div>

              <!-- STATE 3: DRIVER ASSIGNED & IN TRIP -->
              <div id="p-state-assigned" class="hidden space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-[#123D32] text-[#FFCC45] flex items-center justify-center font-black text-lg border-2 border-[#16A572]">
                      CO
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <h4 class="font-black text-sm text-[#123D32]">Carlos Oliveira</h4>
                        <span class="text-xs font-black text-[#FFCC45] bg-[#123D32] px-1.5 py-0.5 rounded">4.96 ★</span>
                      </div>
                      <p class="text-xs text-slate-600">Toyota Corolla • Prata (QTT-4821)</p>
                    </div>
                  </div>
                  <span id="p-trip-stage-badge" class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-[#16A572] text-[#123D32]">
                    A Caminho
                  </span>
                </div>

                <!-- Security PIN Display -->
                <div class="bg-[#123D32] text-[#F8F9F6] p-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-wider text-[#FFCC45]">Código de Segurança (PIN)</p>
                    <p class="text-xs text-slate-300">Informe verbalmente ao motorista</p>
                  </div>
                  <div class="bg-[#17211D] px-3.5 py-1.5 rounded-xl border border-[#16A572] font-mono text-xl font-black tracking-widest text-[#FFCC45]">
                    4 8 2 1
                  </div>
                </div>

                <!-- Actions: Chat, Call & Panic -->
                <div class="grid grid-cols-3 gap-2 text-xs">
                  <button onclick="switchPassengerTab('chat')" class="py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-[#123D32] flex items-center justify-center gap-1.5 transition">
                    <i data-lucide="message-square" class="w-3.5 h-3.5"></i> Chat
                  </button>
                  <button onclick="switchPassengerTab('safety')" class="py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-[#123D32] flex items-center justify-center gap-1.5 transition">
                    <i data-lucide="shield" class="w-3.5 h-3.5 text-[#16A572]"></i> Segurança
                  </button>
                  <button onclick="triggerSOSModal()" class="py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black flex items-center justify-center gap-1.5 transition shadow-xs">
                    <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i> SOS 190
                  </button>
                </div>
              </div>

              <!-- STATE 4: RATING / TRIP FINISHED -->
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
          </div>

          <!-- SCREEN 2: PASSENGER ACTIVITY & RECEIPTS -->
          <div id="p-screen-activity" class="p-app-screen hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-12 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <h2 class="text-base font-black text-[#123D32] flex items-center gap-2">
                <i data-lucide="clock" class="w-5 h-5 text-[#16A572]"></i> Suas Viagens Recentes
              </h2>
              <span class="text-[10px] font-bold bg-[#16A572]/20 text-[#123D32] px-2 py-0.5 rounded-full">3 Viagens</span>
            </div>

            <!-- Trip 1 (Latest / Active) -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-3 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black text-[#16A572] bg-[#16A572]/15 px-2 py-0.5 rounded-md uppercase">Hoje • 09:42</span>
                <span class="text-xs font-black text-[#123D32]">R$ 68,01</span>
              </div>
              <div>
                <p class="text-xs font-bold text-[#123D32] flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-[#16A572]"></span> Praça São Francisco, Piaçabuçu
                </p>
                <p class="text-xs font-bold text-slate-700 flex items-center gap-1.5 mt-1">
                  <span class="w-2 h-2 rounded-full bg-[#FFCC45]"></span> Centro Histórico, Penedo
                </p>
              </div>
              <div class="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Toyota Corolla • Carlos O.</span>
                <span class="font-bold text-[#16A572]">Simbora Conforto</span>
              </div>
              <button onclick="openReceiptModal('TX-SIMB-4821')" class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#123D32] font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition">
                <i data-lucide="receipt" class="w-3.5 h-3.5"></i> Ver Recibo Detalhado PIX
              </button>
            </div>

            <!-- Trip 2 -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-3 space-y-2 opacity-90">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-slate-500 uppercase">Ontem • 16:15</span>
                <span class="text-xs font-black text-[#123D32]">R$ 164,20</span>
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-800">Penedo Orla ➔ Arapiraca Centro</p>
                <p class="text-[11px] text-slate-500">72,4 km via AL-110 • Conforto</p>
              </div>
            </div>

            <!-- Trip 3 -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-3 space-y-2 opacity-90">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-slate-500 uppercase">22 Out • 11:30</span>
                <span class="text-xs font-black text-[#123D32]">R$ 26,50</span>
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-800">Piaçabuçu Centro ➔ Pontal do Peba</p>
                <p class="text-[11px] text-slate-500">14,0 km • Simbora Pop</p>
              </div>
            </div>
          </div>

          <!-- SCREEN 3: PASSENGER IN-RIDE CHAT -->
          <div id="p-screen-chat" class="p-app-screen hidden flex-1 flex flex-col relative w-full bg-[#F8F9F6] pt-12 pb-20 text-[#17211D]">
            <!-- Chat Header -->
            <div class="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full bg-[#123D32] text-[#FFCC45] flex items-center justify-center font-bold text-xs">
                  CO
                </div>
                <div>
                  <h3 class="text-xs font-black text-[#123D32]">Carlos Oliveira</h3>
                  <p class="text-[10px] text-[#16A572] font-semibold flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#16A572] animate-pulse"></span> Online • Toyota Corolla (QTT-4821)
                  </p>
                </div>
              </div>
              <button onclick="switchPassengerTab('home')" class="text-xs font-bold text-[#16A572] hover:underline">Voltar</button>
            </div>

            <!-- Chat Messages Container -->
            <div id="p-chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              <div class="flex items-start gap-2">
                <div class="bg-slate-200 text-slate-800 p-2.5 rounded-2xl rounded-tl-none max-w-[80%] shadow-xs">
                  <p>Olá Marina! Já confirmei sua corrida para Penedo e estou a caminho da Praça São Francisco.</p>
                  <span class="text-[9px] text-slate-500 block mt-1 text-right">09:40</span>
                </div>
              </div>

              <div class="flex items-end justify-end gap-2">
                <div class="bg-[#123D32] text-[#F8F9F6] p-2.5 rounded-2xl rounded-tr-none max-w-[80%] shadow-xs">
                  <p>Oi Carlos! Estou em frente à igreja com uma bolsa preta.</p>
                  <span class="text-[9px] text-slate-300 block mt-1 text-right">09:41</span>
                </div>
              </div>

              <div class="flex items-start gap-2">
                <div class="bg-slate-200 text-slate-800 p-2.5 rounded-2xl rounded-tl-none max-w-[80%] shadow-xs">
                  <p>Perfeito! Chego em 2 minutos. Lembre-se do PIN 4821 de segurança ao embarcar.</p>
                  <span class="text-[9px] text-slate-500 block mt-1 text-right">09:42</span>
                </div>
              </div>
            </div>

            <!-- Quick Reply Chips -->
            <div class="px-3 py-1 flex items-center gap-1.5 overflow-x-auto border-t border-slate-200 bg-white">
              <button onclick="sendQuickPassengerReply('Estou no local de embarque!')" class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-[#16A572]/20 text-[10px] whitespace-nowrap font-medium">Estou no local!</button>
              <button onclick="sendQuickPassengerReply('Camisa azul')" class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-[#16A572]/20 text-[10px] whitespace-nowrap font-medium">Camisa azul</button>
              <button onclick="sendQuickPassengerReply('Pode buzinar!')" class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-[#16A572]/20 text-[10px] whitespace-nowrap font-medium">Pode buzinar!</button>
            </div>

            <!-- Chat Input Bar -->
            <div class="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input id="p-chat-input" type="text" placeholder="Envie uma mensagem..." onkeypress="if(event.key==='Enter') sendPassengerMessage()" class="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#16A572]" />
              <button onclick="sendPassengerMessage()" class="p-2.5 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] rounded-xl font-bold transition">
                <i data-lucide="send" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <!-- SCREEN 4: PASSENGER SAFETY TOOLKIT -->
          <div id="p-screen-safety" class="p-app-screen hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-12 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <h2 class="text-base font-black text-[#123D32] flex items-center gap-2">
                <i data-lucide="shield-check" class="w-5 h-5 text-[#16A572]"></i> SIMBORA Guardião
              </h2>
              <span class="text-[10px] font-bold bg-[#16A572]/20 text-[#123D32] px-2 py-0.5 rounded-full">Proteção Ativa</span>
            </div>

            <!-- SOS Panic Button -->
            <div class="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 shadow-sm mb-4 space-y-2 text-center">
              <div class="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto text-xl shadow-md">
                🚨
              </div>
              <h3 class="font-black text-sm text-rose-700">Botão de Emergência SOS</h3>
              <p class="text-[11px] text-slate-600">Dispara alerta prioritário para a Central 24h SIMBORA e Polícia Militar (190) com coordenadas em tempo real.</p>
              <button onclick="triggerSOSModal()" class="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2">
                <i data-lucide="phone-call" class="w-4 h-4"></i> ACIONAR SOS EMERGÊNCIA
              </button>
            </div>

            <!-- PIN Card -->
            <div class="bg-[#123D32] text-[#F8F9F6] rounded-2xl p-4 shadow-sm mb-4 space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-xs text-[#FFCC45] uppercase">Código de Embarque (PIN)</h4>
                  <p class="text-[11px] text-slate-300">Confira antes de entrar no carro</p>
                </div>
                <div class="bg-[#17211D] px-3 py-1.5 rounded-xl border border-[#16A572] font-mono text-xl font-black text-[#FFCC45]">
                  4 8 2 1
                </div>
              </div>
              <p class="text-[10px] text-slate-400">O motorista deve validar este código no painel dele para liberar o início da corrida.</p>
            </div>

            <!-- Trusted Contacts -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-3 space-y-3">
              <h4 class="font-black text-xs text-[#123D32] flex items-center gap-1.5">
                <i data-lucide="users" class="w-4 h-4 text-[#16A572]"></i> Contatos de Confiança
              </h4>
              <div class="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <div>
                  <p class="font-bold text-slate-800">Marcos Silva (Irmão)</p>
                  <p class="text-[10px] text-slate-500">+55 (82) 99911-2233</p>
                </div>
                <span class="text-[10px] font-bold text-[#16A572]">Notificado</span>
              </div>
              <button onclick="alert('Link de rastreamento da viagem enviado com sucesso para Marcos Silva!')" class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#123D32] font-bold text-xs rounded-xl transition">
                Compartilhar Rota em Tempo Real
              </button>
            </div>
          </div>

          <!-- SCREEN 5: PASSENGER PROFILE & SAVED PLACES -->
          <div id="p-screen-profile" class="p-app-screen hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-12 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <h2 class="text-base font-black text-[#123D32] flex items-center gap-2">
                <i data-lucide="user" class="w-5 h-5 text-[#16A572]"></i> Minha Conta
              </h2>
              <span class="text-[10px] font-bold bg-[#FFCC45] text-[#123D32] px-2 py-0.5 rounded-full font-black">VIP 4.98 ★</span>
            </div>

            <!-- User Info Card -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4 flex items-center gap-3">
              <div class="w-14 h-14 rounded-full bg-[#123D32] text-[#FFCC45] flex items-center justify-center font-black text-xl border-2 border-[#16A572]">
                MS
              </div>
              <div class="flex-1">
                <h3 class="font-black text-sm text-[#123D32]">Marina Silva</h3>
                <p class="text-xs text-slate-600">marina.silva@simbora.app</p>
                <p class="text-[11px] text-[#16A572] font-bold mt-0.5">✓ Telefone (82) 99876-5432 verificado</p>
              </div>
            </div>

            <!-- Saved Places -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4 space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="font-black text-xs text-[#123D32] flex items-center gap-1.5">
                  <i data-lucide="map-pin" class="w-4 h-4 text-[#16A572]"></i> Lugares Salvos
                </h4>
                <button onclick="addSavedPlacePrompt()" class="text-[10px] font-black text-[#16A572] hover:underline">+ Adicionar</button>
              </div>

              <div id="saved-places-list" class="space-y-2 text-xs">
                <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div class="flex items-center gap-2">
                    <span class="text-base">🏠</span>
                    <div>
                      <p class="font-bold text-slate-800">Casa</p>
                      <p class="text-[10px] text-slate-500">Praça São Francisco, 42 - Piaçabuçu</p>
                    </div>
                  </div>
                  <span class="text-[10px] font-bold text-[#16A572]">Padrão</span>
                </div>

                <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div class="flex items-center gap-2">
                    <span class="text-base">💼</span>
                    <div>
                      <p class="font-bold text-slate-800">Trabalho</p>
                      <p class="text-[10px] text-slate-500">Centro Histórico, Rua Barão de Penedo - Penedo</p>
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div class="flex items-center gap-2">
                    <span class="text-base">🏖️</span>
                    <div>
                      <p class="font-bold text-slate-800">Praia do Peba</p>
                      <p class="text-[10px] text-slate-500">Pontal do Peba, Piaçabuçu, AL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Methods -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4 space-y-2">
              <h4 class="font-black text-xs text-[#123D32] flex items-center gap-1.5">
                <i data-lucide="credit-card" class="w-4 h-4 text-[#16A572]"></i> Formas de Pagamento
              </h4>
              <div class="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                <div class="flex items-center gap-2">
                  <span>📱</span>
                  <span class="font-bold text-slate-800">PIX Instantâneo</span>
                </div>
                <span class="text-[10px] font-bold text-[#16A572]">Ativo</span>
              </div>
              <div class="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                <div class="flex items-center gap-2">
                  <span>💳</span>
                  <span class="font-bold text-slate-800">Mastercard •••• 4829</span>
                </div>
                <span class="text-[10px] text-slate-500">Crédito</span>
              </div>
            </div>

            <!-- LGPD & Account Actions -->
            <div class="space-y-2 text-center text-xs">
              <button onclick="alert('Termos de Uso e Política de Privacidade SIMBORA em estrita conformidade com a LGPD.')" class="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700">
                Termos de Uso & Política LGPD
              </button>
            </div>
          </div>

          <!-- PASSENGER BOTTOM TAB NAVIGATION BAR -->
          <nav class="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around px-2 z-30 pb-3 text-slate-500 shadow-lg">
            <button onclick="switchPassengerTab('home')" id="p-tab-home" class="p-tab-btn flex flex-col items-center gap-0.5 text-[#123D32] font-black transition">
              <i data-lucide="map-pin" class="w-4 h-4"></i>
              <span class="text-[9px]">Início</span>
            </button>
            <button onclick="switchPassengerTab('activity')" id="p-tab-activity" class="p-tab-btn flex flex-col items-center gap-0.5 text-slate-400 hover:text-[#123D32] font-semibold transition">
              <i data-lucide="clock" class="w-4 h-4"></i>
              <span class="text-[9px]">Atividade</span>
            </button>
            <button onclick="switchPassengerTab('chat')" id="p-tab-chat" class="p-tab-btn flex flex-col items-center gap-0.5 text-slate-400 hover:text-[#123D32] font-semibold transition relative">
              <i data-lucide="message-square" class="w-4 h-4"></i>
              <span class="text-[9px]">Chat</span>
              <span id="p-chat-unread-dot" class="absolute -top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#16A572]"></span>
            </button>
            <button onclick="switchPassengerTab('safety')" id="p-tab-safety" class="p-tab-btn flex flex-col items-center gap-0.5 text-slate-400 hover:text-[#123D32] font-semibold transition">
              <i data-lucide="shield" class="w-4 h-4"></i>
              <span class="text-[9px]">Segurança</span>
            </button>
            <button onclick="switchPassengerTab('profile')" id="p-tab-profile" class="p-tab-btn flex flex-col items-center gap-0.5 text-slate-400 hover:text-[#123D32] font-semibold transition">
              <i data-lucide="user" class="w-4 h-4"></i>
              <span class="text-[9px]">Conta</span>
            </button>
          </nav>
`;

// Replace Passenger Phone Inner Body
const pStartIdx = html.indexOf(pTargetStart);
const pEndIdx = html.indexOf(pTargetEnd);

console.log('pStartIdx:', pStartIdx, 'pEndIdx:', pEndIdx);
if (pStartIdx !== -1 && pEndIdx !== -1 && pEndIdx > pStartIdx) {
  html = html.substring(0, pStartIdx) + pReplacement + html.substring(pEndIdx);
  console.log('✅ Telas interativas e barra de navegação do PASSAGEIRO injetadas com sucesso!');
} else {
  console.error('❌ Falha ao localizar marcadores do passageiro.');
}

// 2. REPLACEMENT FOR DRIVER PHONE INNER BODY
const dTargetStart = `          <!-- Map Container (MapLibre GL) -->
          <div class="relative flex-1 w-full bg-slate-200 overflow-hidden">
            <div id="driver-map" class="w-full h-full"></div>`;

const dTargetEnd = `          <!-- Home Indicator -->
          <div class="phone-home-indicator"></div>`;

const dReplacement = `          <!-- SCREEN 1: DRIVER NAVIGATION & RADAR (NAV) -->
          <div id="d-screen-nav" class="d-app-screen flex-1 flex flex-col relative w-full overflow-hidden">
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

              <!-- Recenter & Follow Controls -->
              <div class="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
                <button onclick="driverMapFitRoute()" class="w-9 h-9 rounded-full bg-[#123D32] text-[#F8F9F6] shadow-lg flex items-center justify-center hover:bg-[#17211D] transition border border-[#16A572]/40" title="Ajustar Rota Completa">
                  <i data-lucide="maximize-2" class="w-4 h-4"></i>
                </button>
                <button onclick="driverMapFollowCar()" class="w-9 h-9 rounded-full bg-[#123D32] text-[#FFCC45] shadow-lg flex items-center justify-center hover:bg-[#17211D] transition border border-[#16A572]/40" title="Centralizar GPS">
                  <i data-lucide="navigation" class="w-4 h-4"></i>
                </button>
              </div>
            </div>

            <!-- Bottom Sheet (Driver Dynamic States) -->
            <div class="bg-[#17211D] border-t border-[#123D32] rounded-t-3xl shadow-2xl p-5 relative z-20 text-[#F8F9F6] transition-all duration-300 max-h-[380px] overflow-y-auto mb-14">
              
              <!-- STATE 1: IDLE / ONLINE RADAR -->
              <div id="d-state-idle" class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3.5 h-3.5 rounded-full bg-[#16A572] animate-pulse"></span>
                    <div>
                      <h3 id="d-online-status-title" class="font-black text-sm text-[#F8F9F6]">Você está Online</h3>
                      <p class="text-xs text-slate-400">Piaçabuçu • Radar de Chamadas Ativo</p>
                    </div>
                  </div>
                  <button onclick="toggleDriverOnline()" id="btn-driver-toggle" class="px-3.5 py-1.5 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] border border-[#16A572]/40 rounded-xl text-xs font-black transition">
                    Pausar
                  </button>
                </div>

                <div class="bg-[#123D32]/80 p-3.5 rounded-2xl border border-[#16A572]/30 flex items-center justify-between text-xs">
                  <div>
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">Ganhos Hoje:</span>
                    <span class="text-base font-black text-[#16A572]">R$ 178,20</span>
                  </div>
                  <div class="text-right">
                    <span class="text-slate-400 block text-[10px] uppercase font-bold">Corridas:</span>
                    <span class="text-sm font-black text-[#FFCC45]">4 concluídas</span>
                  </div>
                </div>

                <p class="text-center text-xs text-slate-400 italic">
                  Aguardando solicitação de passageiro na região...
                </p>
              </div>

              <!-- STATE 2: RIDE OFFER (NEW CALL INCOMING) -->
              <div id="d-state-offer" class="hidden space-y-4">
                <div class="flex items-center justify-between bg-[#FFCC45] text-[#123D32] p-3 rounded-2xl">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">🔔</span>
                    <div>
                      <h4 class="font-black text-xs uppercase">Nova Corrida Disponível</h4>
                      <p class="text-[10px] font-bold">Simbora Conforto • R$ 68,01</p>
                    </div>
                  </div>
                  <span class="font-black text-xs font-mono bg-[#123D32] text-[#FFCC45] px-2 py-1 rounded-lg">28s</span>
                </div>

                <div class="space-y-2 text-xs">
                  <div class="flex items-center justify-between pb-1 border-b border-[#123D32]">
                    <span class="text-slate-400">Embarque:</span>
                    <span class="font-bold text-[#F8F9F6]">Praça São Francisco, Piaçabuçu</span>
                  </div>
                  <div class="flex items-center justify-between pb-1 border-b border-[#123D32]">
                    <span class="text-slate-400">Destino:</span>
                    <span class="font-bold text-[#FFCC45]">Centro Histórico, Penedo</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">Distância / Tempo:</span>
                    <span class="font-bold text-[#F8F9F6]">28,2 km (~28 min)</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2.5">
                  <button onclick="driverDeclineRide()" class="py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-bold transition">
                    Recusar
                  </button>
                  <button onclick="driverAcceptRide()" class="py-3 bg-[#16A572] hover:bg-[#139063] text-[#123D32] rounded-xl text-xs font-black shadow-lg shadow-[#16A572]/20 transition">
                    ACEITAR CORRIDA
                  </button>
                </div>
              </div>

              <!-- STATE 3: ON TRIP & NAVIGATION -->
              <div id="d-state-trip" class="hidden space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-[#123D32]">
                  <div>
                    <span class="text-[10px] font-bold text-[#FFCC45] uppercase tracking-wider block">Passageiro:</span>
                    <h4 id="d-nav-title" class="text-sm font-black text-[#F8F9F6] mt-0.5">Marina Silva • Piaçabuçu</h4>
                  </div>
                  <div class="flex items-center gap-2">
                    <button onclick="switchDriverTab('earnings')" class="p-2 bg-[#123D32] hover:bg-[#17211D] rounded-xl text-[#FFCC45] border border-[#16A572]/30" title="Ver Carteira">
                      <i data-lucide="wallet" class="w-4 h-4"></i>
                    </button>
                  </div>
                </div>

                <!-- Arrived Action Button -->
                <div id="d-action-arrive-box">
                  <button onclick="driverArrivedAtPickup()" class="w-full py-3.5 bg-[#FFCC45] hover:bg-[#ffe082] text-[#123D32] font-black rounded-2xl text-xs shadow-lg transition">
                    CHEGUEI AO LOCAL DE EMBARQUE
                  </button>
                </div>

                <!-- PIN Verification Form -->
                <div id="d-action-pin-box" class="hidden space-y-3 bg-[#123D32] p-4 rounded-2xl border border-[#16A572]/40">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-[#F8F9F6]">Validar PIN do Passageiro:</span>
                    <span class="text-[10px] text-slate-300">Solicite à Marina</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <input id="d-input-pin" type="text" maxlength="4" placeholder="4821" value="4821" class="flex-1 bg-[#17211D] border border-[#16A572] text-[#FFCC45] text-center font-mono text-xl font-black py-2 rounded-xl outline-none" />
                    <button onclick="driverConfirmPinAndStart()" class="px-4 py-2 bg-[#16A572] hover:bg-[#139063] text-[#123D32] font-black text-xs rounded-xl transition">
                      CONFIRMAR PIN
                    </button>
                  </div>
                </div>

                <!-- Finish Trip Action -->
                <div id="d-action-finish-box" class="hidden">
                  <button onclick="driverFinishTrip()" class="w-full py-3.5 bg-[#16A572] hover:bg-[#139063] text-[#123D32] font-black rounded-2xl text-xs shadow-lg transition">
                    CONCLUIR CORRIDA EM PENEDO
                  </button>
                </div>
              </div>

              <!-- STATE 4: SUMMARY & FARE EARNED -->
              <div id="d-state-summary" class="hidden text-center space-y-4 py-4">
                <div class="w-16 h-16 rounded-full bg-[#16A572]/20 text-[#16A572] mx-auto flex items-center justify-center text-3xl">
                  💰
                </div>
                <div>
                  <h3 class="font-black text-lg text-[#F8F9F6]">Viagem Finalizada com Sucesso!</h3>
                  <p class="text-xs text-slate-300 mt-1">Piaçabuçu → Penedo (28,2 km via AL-101 / AL-225)</p>
                  <p class="text-xl font-black text-[#16A572] mt-2">+ R$ 57,80 creditados na carteira (85%)</p>
                </div>

                <button onclick="driverResetToIdle()" class="w-full py-4 bg-[#FFCC45] hover:bg-[#ffe082] text-[#123D32] font-black rounded-2xl text-xs shadow-lg transition">
                  Ficar Disponível Novamente
                </button>
              </div>

            </div>
          </div>

          <!-- SCREEN 2: DRIVER EARNINGS & PIX WALLET -->
          <div id="d-screen-earnings" class="d-app-screen hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-12 pb-20 px-4">
            <div class="flex items-center justify-between mb-4 border-b border-[#123D32] pb-3">
              <h2 class="text-base font-black text-[#FFCC45] flex items-center gap-2">
                <i data-lucide="wallet" class="w-5 h-5 text-[#16A572]"></i> Ganhos & Carteira
              </h2>
              <span class="text-[10px] font-bold bg-[#16A572]/20 text-[#16A572] px-2 py-0.5 rounded-full">Repasse 85%</span>
            </div>

            <!-- Balance Card -->
            <div class="bg-gradient-to-br from-[#123D32] to-[#0d2821] rounded-2xl p-4 border border-[#16A572]/40 shadow-lg mb-4 space-y-3">
              <div>
                <span class="text-[10px] font-bold text-slate-300 uppercase">Saldo Disponível para Saque:</span>
                <p id="d-wallet-balance" class="text-2xl font-black text-[#FFCC45] mt-1 font-mono">R$ 384,50</p>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#16A572]/30">
                <div>
                  <span class="text-slate-400 block text-[10px]">Ganhos de Hoje:</span>
                  <span class="font-bold text-[#16A572]">R$ 178,20</span>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px]">Chave PIX:</span>
                  <span class="font-bold text-slate-200 truncate block">carlos.oliveira@pix</span>
                </div>
              </div>

              <button onclick="requestPixPayout()" class="w-full py-3 bg-[#16A572] hover:bg-[#139063] text-[#123D32] font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2">
                <i data-lucide="arrow-up-right" class="w-4 h-4"></i> SOLICITAR SAQUE PIX IMEDIATO
              </button>
            </div>

            <!-- Statements List -->
            <div class="bg-[#123D32]/60 rounded-2xl p-4 border border-[#16A572]/30 shadow-sm space-y-3">
              <h4 class="font-black text-xs text-[#FFCC45] uppercase tracking-wider">Histórico de Corridas</h4>

              <div class="space-y-2 text-xs">
                <div class="p-2.5 rounded-xl bg-[#17211D] border border-[#16A572]/20 flex items-center justify-between">
                  <div>
                    <p class="font-bold text-white">Piaçabuçu ➔ Penedo</p>
                    <p class="text-[10px] text-slate-400">28,2 km • Conforto (Bruto: R$ 68,01)</p>
                  </div>
                  <div class="text-right">
                    <span class="font-black text-[#16A572] block">+ R$ 57,80</span>
                    <span class="text-[9px] text-slate-500">Taxa 15%: R$ 10,21</span>
                  </div>
                </div>

                <div class="p-2.5 rounded-xl bg-[#17211D] border border-[#16A572]/20 flex items-center justify-between">
                  <div>
                    <p class="font-bold text-white">Penedo Centro ➔ Cooperativa</p>
                    <p class="text-[10px] text-slate-400">8,5 km • Pop (Bruto: R$ 24,00)</p>
                  </div>
                  <div class="text-right">
                    <span class="font-black text-[#16A572] block">+ R$ 20,40</span>
                    <span class="text-[9px] text-slate-500">Taxa 15%: R$ 3,60</span>
                  </div>
                </div>

                <div class="p-2.5 rounded-xl bg-[#17211D] border border-[#16A572]/20 flex items-center justify-between">
                  <div>
                    <p class="font-bold text-white">Penedo ➔ Igreja Nova</p>
                    <p class="text-[10px] text-slate-400">31,9 km • Conforto (Bruto: R$ 82,00)</p>
                  </div>
                  <div class="text-right">
                    <span class="font-black text-[#16A572] block">+ R$ 69,70</span>
                    <span class="text-[9px] text-slate-500">Taxa 15%: R$ 12,30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SCREEN 3: DRIVER DOCUMENTS & HOMOLOGATION -->
          <div id="d-screen-docs" class="d-app-screen hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-12 pb-20 px-4">
            <div class="flex items-center justify-between mb-4 border-b border-[#123D32] pb-3">
              <h2 class="text-base font-black text-[#FFCC45] flex items-center gap-2">
                <i data-lucide="file-check" class="w-5 h-5 text-[#16A572]"></i> Homologação & Vistoria
              </h2>
              <span class="text-[10px] font-black bg-[#16A572] text-[#123D32] px-2 py-0.5 rounded-full">HOMOLOGADO</span>
            </div>

            <!-- Status Banner -->
            <div class="bg-[#123D32] border border-[#16A572]/40 rounded-2xl p-3.5 mb-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#16A572] text-[#123D32] flex items-center justify-center font-black text-xl">
                ✓
              </div>
              <div class="text-xs">
                <h4 class="font-black text-[#F8F9F6]">Condutor Homologado</h4>
                <p class="text-slate-300 text-[11px]">Apto para corridas intermunicipais em Alagoas.</p>
              </div>
            </div>

            <!-- Documents Checklist -->
            <div class="space-y-3 text-xs">
              <!-- CNH -->
              <div class="bg-[#123D32]/60 p-3.5 rounded-2xl border border-[#16A572]/30 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#F8F9F6] flex items-center gap-1.5">
                    🪪 CNH Categoria B (com EAR)
                  </span>
                  <span class="text-[10px] font-bold text-[#16A572] bg-[#16A572]/15 px-2 py-0.5 rounded">Aprovado</span>
                </div>
                <p class="text-[11px] text-slate-400">Nº 05829104820 • Vencimento: 28/05/2028</p>
              </div>

              <!-- CRLV -->
              <div class="bg-[#123D32]/60 p-3.5 rounded-2xl border border-[#16A572]/30 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#F8F9F6] flex items-center gap-1.5">
                    📄 CRLV do Veículo (Digital)
                  </span>
                  <span class="text-[10px] font-bold text-[#16A572] bg-[#16A572]/15 px-2 py-0.5 rounded">Aprovado</span>
                </div>
                <p class="text-[11px] text-slate-400">Exercício: 2026 • Renavam: 00984729102</p>
              </div>

              <!-- Inspection -->
              <div class="bg-[#123D32]/60 p-3.5 rounded-2xl border border-[#16A572]/30 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#F8F9F6] flex items-center gap-1.5">
                    🔍 Laudo de Vistoria SIMBORA
                  </span>
                  <span class="text-[10px] font-bold text-[#16A572] bg-[#16A572]/15 px-2 py-0.5 rounded">Conforme</span>
                </div>
                <p class="text-[11px] text-slate-400">Vistoria realizada em 15/01/2026 • Pneus, Cintos e Freios OK</p>
              </div>

              <!-- Background Check -->
              <div class="bg-[#123D32]/60 p-3.5 rounded-2xl border border-[#16A572]/30 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#F8F9F6] flex items-center gap-1.5">
                    🛡️ Antecedentes Criminais
                  </span>
                  <span class="text-[10px] font-bold text-[#16A572] bg-[#16A572]/15 px-2 py-0.5 rounded">Certificado OK</span>
                </div>
                <p class="text-[11px] text-slate-400">Tribunal de Justiça de Alagoas • Sem apontamentos</p>
              </div>
            </div>
          </div>

          <!-- SCREEN 4: DRIVER VEHICLE DETAILS -->
          <div id="d-screen-vehicle" class="d-app-screen hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-12 pb-20 px-4">
            <div class="flex items-center justify-between mb-4 border-b border-[#123D32] pb-3">
              <h2 class="text-base font-black text-[#FFCC45] flex items-center gap-2">
                <i data-lucide="car" class="w-5 h-5 text-[#16A572]"></i> Veículo Vinculado
              </h2>
              <span class="text-[10px] font-bold bg-[#16A572]/20 text-[#16A572] px-2 py-0.5 rounded-full">Simbora Conforto</span>
            </div>

            <div class="bg-[#123D32] rounded-2xl p-4 border border-[#16A572]/40 shadow-lg mb-4 text-center space-y-2">
              <div class="text-4xl mb-1">🚙</div>
              <h3 class="font-black text-base text-[#F8F9F6]">Toyota Corolla XEi 2.0</h3>
              <p class="text-xs text-[#FFCC45] font-mono font-bold tracking-widest bg-[#17211D] py-1 px-3 rounded-lg inline-block border border-[#16A572]/40">
                PLACA: QTT-4821 (AL)
              </p>
            </div>

            <div class="bg-[#123D32]/60 rounded-2xl p-4 border border-[#16A572]/30 space-y-2.5 text-xs">
              <div class="flex items-center justify-between pb-1 border-b border-[#123D32]">
                <span class="text-slate-400">Ano de Fabricação:</span>
                <span class="font-bold text-white">2023 / 2024</span>
              </div>
              <div class="flex items-center justify-between pb-1 border-b border-[#123D32]">
                <span class="text-slate-400">Cor Oficial:</span>
                <span class="font-bold text-white">Prata Lunar Metálico</span>
              </div>
              <div class="flex items-center justify-between pb-1 border-b border-[#123D32]">
                <span class="text-slate-400">Combustível:</span>
                <span class="font-bold text-white">Flex (Álcool / Gasolina)</span>
              </div>
              <div class="flex items-center justify-between pb-1 border-b border-[#123D32]">
                <span class="text-slate-400">Ar-condicionado:</span>
                <span class="font-bold text-[#16A572]">Digital Automático</span>
              </div>
              <div class="flex items-center justify-between pb-1 border-b border-[#123D32]">
                <span class="text-slate-400">Capacidade:</span>
                <span class="font-bold text-white">4 passageiros + 470L malas</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-400">Selo de Vistoria:</span>
                <span class="font-bold text-[#16A572]">AL-2026-CONF-0482</span>
              </div>
            </div>
          </div>

          <!-- SCREEN 5: DRIVER PROFILE -->
          <div id="d-screen-profile" class="d-app-screen hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-12 pb-20 px-4">
            <div class="flex items-center justify-between mb-4 border-b border-[#123D32] pb-3">
              <h2 class="text-base font-black text-[#FFCC45] flex items-center gap-2">
                <i data-lucide="user-check" class="w-5 h-5 text-[#16A572]"></i> Perfil do Condutor
              </h2>
              <span class="text-[10px] font-black bg-[#FFCC45] text-[#123D32] px-2 py-0.5 rounded-full">DIAMANTE</span>
            </div>

            <!-- Profile Info -->
            <div class="bg-[#123D32] rounded-2xl p-4 border border-[#16A572]/40 shadow-lg mb-4 flex items-center gap-3.5">
              <div class="w-14 h-14 rounded-full bg-[#16A572] text-[#123D32] flex items-center justify-center font-black text-2xl border-2 border-[#FFCC45]">
                CO
              </div>
              <div class="flex-1">
                <h3 class="font-black text-base text-[#F8F9F6]">Carlos Oliveira</h3>
                <p class="text-xs text-slate-300">Penedo & Piaçabuçu • Alagoas</p>
                <div class="flex items-center gap-1.5 mt-1">
                  <span class="text-xs font-black text-[#FFCC45]">4.96 ★</span>
                  <span class="text-[10px] text-slate-400">(1.482 viagens)</span>
                </div>
              </div>
            </div>

            <!-- Driver Statistics -->
            <div class="grid grid-cols-2 gap-3 text-xs mb-4">
              <div class="bg-[#123D32]/60 p-3 rounded-2xl border border-[#16A572]/30 text-center">
                <span class="text-[10px] text-slate-400 block uppercase font-bold">Aceitação:</span>
                <span class="text-lg font-black text-[#16A572]">98.4%</span>
              </div>
              <div class="bg-[#123D32]/60 p-3 rounded-2xl border border-[#16A572]/30 text-center">
                <span class="text-[10px] text-slate-400 block uppercase font-bold">Cancelamento:</span>
                <span class="text-lg font-black text-[#FFCC45]">0.6%</span>
              </div>
            </div>

            <!-- Driver Badges -->
            <div class="bg-[#123D32]/60 rounded-2xl p-4 border border-[#16A572]/30 space-y-2.5 text-xs">
              <h4 class="font-black text-xs text-[#FFCC45] uppercase tracking-wider">Elogios dos Passageiros</h4>
              <div class="flex items-center gap-2 text-slate-300">
                <span>🛡️</span> <span>Especialista em Rodovias Alagoanas</span>
              </div>
              <div class="flex items-center gap-2 text-slate-300">
                <span>✨</span> <span>Veículo Impecável e Higienizado</span>
              </div>
              <div class="flex items-center gap-2 text-slate-300">
                <span>⏱️</span> <span>Pontualidade e Direção Confortável</span>
              </div>
            </div>
          </div>

          <!-- DRIVER BOTTOM TAB NAVIGATION BAR -->
          <nav class="absolute bottom-0 left-0 right-0 h-16 bg-[#123D32]/95 backdrop-blur-md border-t border-[#16A572]/40 flex items-center justify-around px-2 z-30 pb-3 text-slate-300 shadow-lg">
            <button onclick="switchDriverTab('nav')" id="d-tab-nav" class="d-tab-btn flex flex-col items-center gap-0.5 text-[#FFCC45] font-black transition">
              <i data-lucide="navigation" class="w-4 h-4"></i>
              <span class="text-[9px]">Navegar</span>
            </button>
            <button onclick="switchDriverTab('earnings')" id="d-tab-earnings" class="d-tab-btn flex flex-col items-center gap-0.5 text-slate-400 hover:text-white font-semibold transition">
              <i data-lucide="wallet" class="w-4 h-4"></i>
              <span class="text-[9px]">Ganhos</span>
            </button>
            <button onclick="switchDriverTab('docs')" id="d-tab-docs" class="d-tab-btn flex flex-col items-center gap-0.5 text-slate-400 hover:text-white font-semibold transition">
              <i data-lucide="file-check" class="w-4 h-4"></i>
              <span class="text-[9px]">Documentos</span>
            </button>
            <button onclick="switchDriverTab('vehicle')" id="d-tab-vehicle" class="d-tab-btn flex flex-col items-center gap-0.5 text-slate-400 hover:text-white font-semibold transition">
              <i data-lucide="car" class="w-4 h-4"></i>
              <span class="text-[9px]">Veículo</span>
            </button>
            <button onclick="switchDriverTab('profile')" id="d-tab-profile" class="d-tab-btn flex flex-col items-center gap-0.5 text-slate-400 hover:text-white font-semibold transition">
              <i data-lucide="user-check" class="w-4 h-4"></i>
              <span class="text-[9px]">Perfil</span>
            </button>
          </nav>
`;

// Replace Driver Phone Inner Body
const dStartIdx = html.indexOf(dTargetStart);
const dEndIdx = html.indexOf(dTargetEnd, dStartIdx);

console.log('dStartIdx:', dStartIdx, 'dEndIdx:', dEndIdx);
if (dStartIdx !== -1 && dEndIdx !== -1 && dEndIdx > dStartIdx) {
  html = html.substring(0, dStartIdx) + dReplacement + html.substring(dEndIdx);
  console.log('✅ Telas interativas e barra de navegação do MOTORISTA injetadas com sucesso!');
} else {
  console.error('❌ Falha ao localizar marcadores do motorista.');
}

if (isCRLF) {
  html = html.replace(/\n/g, '\r\n');
}

fs.writeFileSync(targetFile, html, 'utf8');
fs.writeFileSync(brainFile, html, 'utf8');
console.log('🎉 Gravação concluída!');
