const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'mobility_interactive_studio.html');
const brainFile = 'C:\\Users\\winc\\.gemini\\antigravity\\brain\\0e4110ac-259e-4ca3-a9b7-c49d7be31808\\mobility_interactive_studio.html';

console.log('Lendo mobility_interactive_studio.html original...');
let html = fs.readFileSync(targetFile, 'utf8');
html = html.replace(/\r\n/g, '\n');

// =========================================================================
// 1. PASSENGER CONTAINER INNER HTML (HOMEPAGE + 4 SCREENS + ALL SUBPAGES)
// =========================================================================
const pContainerStartTag = '<div id="phone-passenger-container" class="flex flex-col items-center">';
const dContainerStartTag = '<div id="phone-driver-container" class="flex flex-col items-center">';

const pStartIdx = html.indexOf(pContainerStartTag);
const dStartIdx = html.indexOf(dContainerStartTag);

if (pStartIdx === -1 || dStartIdx === -1) {
  console.error('❌ Não foi possível encontrar os limites dos containers!');
  process.exit(1);
}

// Build Passenger Phone Content
const passengerPhoneHTML = `<div id="phone-passenger-container" class="flex flex-col items-center">
        <div class="mb-3 flex items-center justify-between w-[390px] px-2 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-[#16A572]"></span>
            <span class="font-black text-[#F8F9F6]">PASSAGEIRO: MARINA SILVA</span>
          </div>
          <span class="text-slate-400 font-mono text-[11px]">SIMBORA Mobile 390×844</span>
        </div>

        <div class="phone-viewport text-[#17211D] flex flex-col relative overflow-hidden bg-[#F8F9F6]">
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

          <!-- ==================== PAGE 1: INÍCIO (MAPA & CORRIDAS) ==================== -->
          <div id="p-screen-home" class="p-page-view flex-1 flex flex-col relative w-full overflow-hidden">
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
            <div class="bg-[#F8F9F6] border-t border-slate-200 rounded-t-3xl shadow-2xl p-5 relative z-20 transition-all duration-300 max-h-[380px] overflow-y-auto mb-16">
              
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
                    <div class="text-xs font-black text-[#123D32] mt-1" id="p-fare-pop">R$ 47,07</div>
                  </div>

                  <div onclick="selectCategory('comfort')" id="p-cat-comfort" class="p-3 border-2 border-[#16A572] bg-[#16A572]/10 rounded-2xl text-center cursor-pointer transition shadow-xs">
                    <div class="text-2xl mb-1">🚙</div>
                    <div class="text-xs font-bold text-[#123D32]">Conforto</div>
                    <div class="text-[10px] text-[#16A572] font-black">2 min</div>
                    <div class="text-xs font-black text-[#123D32] mt-1" id="p-fare-comfort">R$ 68,01</div>
                  </div>

                  <div onclick="selectCategory('premium')" id="p-cat-premium" class="p-3 border-2 border-slate-200 rounded-2xl text-center cursor-pointer hover:border-[#16A572] transition">
                    <div class="text-2xl mb-1">✨</div>
                    <div class="text-xs font-bold text-[#17211D]">Executivo</div>
                    <div class="text-[10px] text-slate-500">6 min</div>
                    <div class="text-xs font-black text-[#123D32] mt-1" id="p-fare-premium">R$ 104,66</div>
                  </div>
                </div>

                <!-- Payment Method & Details -->
                <div class="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <div class="flex items-center gap-2">
                    <span class="text-base">💳</span>
                    <span id="p-selected-payment-label" class="font-bold text-[#17211D]">PIX Instantâneo</span>
                  </div>
                  <span class="font-bold text-[#16A572] cursor-pointer" onclick="navigateToPassenger('p-subpage-payment-methods')">Trocar</span>
                </div>

                <!-- Request Button -->
                <button onclick="passengerRequestRide()" id="p-btn-request-ride" class="w-full py-4 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] font-black rounded-2xl shadow-lg shadow-[#123D32]/30 transition text-sm flex items-center justify-center gap-2">
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
                  <p class="text-sm font-black text-[#123D32] mt-1">R$ 68,01 debitado via PIX Instantâneo</p>
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

          <!-- ==================== PAGE 2: ATIVIDADE (HISTÓRICO & CORRIDAS) ==================== -->
          <div id="p-screen-activity" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
              <h2 class="text-base font-black text-[#123D32] flex items-center gap-2">
                <i data-lucide="clock" class="w-5 h-5 text-[#16A572]"></i> Atividade
              </h2>
              <span class="text-[10px] font-bold bg-[#16A572]/20 text-[#123D32] px-2 py-0.5 rounded-full">Histórico Real</span>
            </div>

            <!-- Filter Tabs -->
            <div class="flex items-center gap-2 mb-3 bg-slate-200/60 p-1 rounded-xl text-xs font-bold">
              <button onclick="filterPassengerTrips('all')" id="p-trip-filter-all" class="flex-1 py-1.5 rounded-lg bg-[#123D32] text-[#FFCC45] transition">Todas</button>
              <button onclick="filterPassengerTrips('completed')" id="p-trip-filter-completed" class="flex-1 py-1.5 rounded-lg text-slate-600 hover:text-[#123D32] transition">Concluídas</button>
              <button onclick="filterPassengerTrips('cancelled')" id="p-trip-filter-cancelled" class="flex-1 py-1.5 rounded-lg text-slate-600 hover:text-[#123D32] transition">Canceladas</button>
            </div>

            <!-- Trips Container -->
            <div id="p-trips-list-container" class="space-y-3">
              <!-- Item 1: Piaçabuçu -> Penedo -->
              <div onclick="openPassengerTripDetails('TRIP-AL-01')" class="p-trip-card cursor-pointer bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-[#16A572] transition space-y-2.5" data-status="completed">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black text-[#16A572] bg-[#16A572]/15 px-2 py-0.5 rounded-md uppercase">Hoje • 09:42 (Concluída)</span>
                  <span class="text-sm font-black text-[#123D32]">R$ 68,01</span>
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
                  <span>Toyota Corolla • Carlos Oliveira</span>
                  <span class="font-bold text-[#16A572] flex items-center gap-1">Ver Detalhes <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i></span>
                </div>
              </div>

              <!-- Item 2: Penedo -> Arapiraca -->
              <div onclick="openPassengerTripDetails('TRIP-AL-02')" class="p-trip-card cursor-pointer bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-[#16A572] transition space-y-2.5" data-status="completed">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md uppercase">Ontem • 16:15 (Concluída)</span>
                  <span class="text-sm font-black text-[#123D32]">R$ 164,20</span>
                </div>
                <div>
                  <p class="text-xs font-semibold text-slate-800">Orla do São Francisco, Penedo</p>
                  <p class="text-xs font-semibold text-slate-800 mt-0.5">Bosque das Arapiracas, Arapiraca</p>
                </div>
                <div class="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span>72,4 km via AL-110 • Conforto</span>
                  <span class="font-bold text-[#16A572] flex items-center gap-1">Ver Detalhes <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i></span>
                </div>
              </div>

              <!-- Item 3: Piaçabuçu -> Peba (Cancelada) -->
              <div onclick="openPassengerTripDetails('TRIP-AL-03')" class="p-trip-card cursor-pointer bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-[#16A572] transition space-y-2.5 opacity-80" data-status="cancelled">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md uppercase">22 Out • 18:30 (Cancelada)</span>
                  <span class="text-sm font-black text-slate-500">R$ 0,00</span>
                </div>
                <div>
                  <p class="text-xs text-slate-700">Praça Central ➔ Pontal do Peba</p>
                  <p class="text-[10px] text-rose-500 mt-0.5">Cancelada pelo passageiro (sem cobrança de taxa)</p>
                </div>
                <div class="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span>Simbora Pop</span>
                  <span class="font-bold text-slate-600 flex items-center gap-1">Ver Detalhes <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i></span>
                </div>
              </div>
            </div>
          </div>

          <!-- ==================== SUBPAGE: DETALHES DA VIAGEM ==================== -->
          <div id="p-subpage-trip-details" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <button onclick="goBackPassenger()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123D32] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#123D32]">Detalhes da Viagem</h3>
            </div>

            <!-- Route Mini Banner -->
            <div class="bg-[#123D32] text-[#F8F9F6] p-4 rounded-2xl mb-3 shadow-md space-y-2">
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-[#FFCC45]">Piaçabuçu ➔ Penedo</span>
                <span class="font-mono text-[10px] bg-[#17211D] px-2 py-0.5 rounded">28,2 km (AL-101)</span>
              </div>
              <p class="text-xl font-black text-[#F8F9F6]">R$ 68,01</p>
              <p class="text-[10px] text-slate-300">Finalizada com sucesso • Pago com PIX Instantâneo</p>
            </div>

            <!-- Driver & Car Card -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-3 flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-[#123D32] text-[#FFCC45] flex items-center justify-center font-black text-base border-2 border-[#16A572]">
                CO
              </div>
              <div class="flex-1">
                <h4 class="font-black text-sm text-[#123D32]">Carlos Oliveira</h4>
                <p class="text-xs text-slate-600">Toyota Corolla XEi • Prata</p>
                <p class="text-[11px] font-mono font-bold text-slate-800">PLACA: QTT-4821</p>
              </div>
              <span class="text-xs font-black text-[#123D32] bg-[#FFCC45] px-2 py-1 rounded-lg">5.0 ⭐</span>
            </div>

            <!-- Fare Breakdown -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-3 space-y-2 text-xs">
              <h4 class="font-black text-xs text-[#123D32] uppercase tracking-wider pb-1 border-b border-slate-100">Discriminação Tarifária</h4>
              <div class="flex justify-between text-slate-600"><span>Tarifa Base:</span> <span>R$ 5,00</span></div>
              <div class="flex justify-between text-slate-600"><span>Distância (28,2 km × R$ 1,50):</span> <span>R$ 42,30</span></div>
              <div class="flex justify-between text-slate-600"><span>Duração (28 min × R$ 0,40):</span> <span>R$ 11,20</span></div>
              <div class="flex justify-between text-slate-600"><span>Taxa de Regulação Alagoas:</span> <span>R$ 9,51</span></div>
              <div class="flex justify-between font-black text-sm text-[#123D32] pt-2 border-t border-slate-200">
                <span>Total Pago:</span> <span>R$ 68,01</span>
              </div>
              <div class="p-2.5 rounded-xl bg-[#16A572]/10 border border-[#16A572]/30 text-[11px] text-[#123D32] mt-2">
                <b>Split Oficial da Plataforma (85% / 15%):</b>
                <p class="mt-0.5">• Repasse Líquido ao Condutor: <b>R$ 57,80 (85%)</b></p>
                <p>• Taxa de Operação SIMBORA: <b>R$ 10,21 (15%)</b></p>
              </div>
            </div>

            <!-- Actions -->
            <div class="space-y-2">
              <button onclick="openReceiptModal('TX-SIMB-4821')" class="w-full py-3 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition">
                <i data-lucide="receipt" class="w-4 h-4"></i> Visualizar Recibo Fiscal Oficial
              </button>
              <button onclick="navigateToPassenger('p-subpage-help')" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition">
                <i data-lucide="help-circle" class="w-4 h-4"></i> Ajuda com esta Viagem
              </button>
            </div>
          </div>

          <!-- ==================== PAGE 3: CHAT (MENSAGENS) ==================== -->
          <div id="p-screen-chat" class="p-page-view hidden flex-1 flex flex-col relative w-full bg-[#F8F9F6] pt-14 pb-20 text-[#17211D]">
            <!-- Chat Top Header -->
            <div class="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-full bg-[#123D32] text-[#FFCC45] flex items-center justify-center font-bold text-xs">
                  CO
                </div>
                <div>
                  <h3 class="text-xs font-black text-[#123D32]">Carlos Oliveira</h3>
                  <p class="text-[10px] text-[#16A572] font-semibold flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#16A572] animate-pulse"></span> Online • Toyota Corolla (QTT-4821)
                  </p>
                </div>
              </div>
              <button onclick="switchPassengerTab('home')" class="text-xs font-bold text-[#16A572] hover:underline flex items-center gap-0.5">
                <i data-lucide="map" class="w-3.5 h-3.5"></i> Mapa
              </button>
            </div>

            <!-- Chat Messages Container -->
            <div id="p-chat-messages" class="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              <div class="flex items-start gap-2">
                <div class="bg-slate-200 text-slate-800 p-2.5 rounded-2xl rounded-tl-none max-w-[80%] shadow-xs">
                  <p>Olá Marina! Confirmei sua corrida e já estou chegando na Praça São Francisco.</p>
                  <span class="text-[9px] text-slate-500 block mt-1 text-right">09:40</span>
                </div>
              </div>

              <div class="flex items-end justify-end gap-2">
                <div class="bg-[#123D32] text-[#F8F9F6] p-2.5 rounded-2xl rounded-tr-none max-w-[80%] shadow-xs">
                  <p>Oi Carlos! Estou aguardando em frente ao portão principal.</p>
                  <span class="text-[9px] text-slate-300 block mt-1 text-right">09:41 ✓✓</span>
                </div>
              </div>

              <div class="flex items-start gap-2">
                <div class="bg-slate-200 text-slate-800 p-2.5 rounded-2xl rounded-tl-none max-w-[80%] shadow-xs">
                  <p>Perfeito! Carro é um Corolla Prata. Lembre-se do PIN 4821 de segurança no embarque.</p>
                  <span class="text-[9px] text-slate-500 block mt-1 text-right">09:42</span>
                </div>
              </div>
            </div>

            <!-- Required Quick Reply Chips -->
            <div class="px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto border-t border-slate-200 bg-white">
              <button onclick="sendQuickPassengerReply('Estou chegando.')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#16A572]/20 text-slate-800 text-[10px] whitespace-nowrap font-medium border border-slate-200">Estou chegando.</button>
              <button onclick="sendQuickPassengerReply('Estou no local.')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#16A572]/20 text-slate-800 text-[10px] whitespace-nowrap font-medium border border-slate-200">Estou no local.</button>
              <button onclick="sendQuickPassengerReply('Pode aguardar um momento?')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#16A572]/20 text-slate-800 text-[10px] whitespace-nowrap font-medium border border-slate-200">Pode aguardar um momento?</button>
              <button onclick="sendQuickPassengerReply('Não encontrei o veículo.')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#16A572]/20 text-slate-800 text-[10px] whitespace-nowrap font-medium border border-slate-200">Não encontrei o veículo.</button>
            </div>

            <!-- Chat Input Bar -->
            <div class="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input id="p-chat-input" type="text" placeholder="Envie uma mensagem..." onkeypress="if(event.key==='Enter') sendPassengerMessage()" class="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#16A572]" />
              <button onclick="sendPassengerMessage()" class="p-2.5 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] rounded-xl font-bold transition">
                <i data-lucide="send" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <!-- ==================== PAGE 4: SEGURANÇA (CENTRAL DE SEGURANÇA) ==================== -->
          <div id="p-screen-safety" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
              <h2 class="text-base font-black text-[#123D32] flex items-center gap-2">
                <i data-lucide="shield-check" class="w-5 h-5 text-[#16A572]"></i> Central de Segurança
              </h2>
              <span class="text-[10px] font-bold bg-[#16A572]/20 text-[#123D32] px-2 py-0.5 rounded-full">Guardião SIMBORA</span>
            </div>

            <!-- Emergency Card -->
            <div class="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 shadow-xs mb-3 space-y-2 text-center">
              <div class="w-11 h-11 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto text-xl shadow-xs">
                🚨
              </div>
              <h3 class="font-black text-sm text-rose-700">Emergência e Ajuda Imediata</h3>
              <p class="text-[11px] text-slate-600">Ligue diretamente para as autoridades ou acione os canais de socorro de Alagoas.</p>
              <button onclick="triggerSOSModal()" class="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2">
                <i data-lucide="phone-call" class="w-4 h-4"></i> LIGAR 190 / SAMU 192
              </button>
            </div>

            <!-- Safety Navigation Menu -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs mb-3">
              <div onclick="shareTripLinkModal()" class="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-[#16A572]/15 text-[#16A572] flex items-center justify-center font-bold">
                    <i data-lucide="share-2" class="w-4 h-4"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-[#123D32]">Compartilhar Viagem</h4>
                    <p class="text-[10px] text-slate-500">Gere um link temporário seguro para familiares</p>
                  </div>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToPassenger('p-subpage-safety-contacts')" class="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-[#123D32]/10 text-[#123D32] flex items-center justify-center font-bold">
                    <i data-lucide="users" class="w-4 h-4"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-[#123D32]">Contatos de Confiança</h4>
                    <p class="text-[10px] text-slate-500">Cadastre parentes e amigos para envio de alertas</p>
                  </div>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="alert('Seu código PIN de embarque para esta corrida é 4821. Jamais embarque sem que o motorista o confirme!')" class="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-[#FFCC45]/20 text-[#123D32] flex items-center justify-center font-bold">
                    <i data-lucide="key" class="w-4 h-4"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-[#123D32]">Código de Confirmação (PIN 4821)</h4>
                    <p class="text-[10px] text-slate-500">Verificação obrigatória antes de entrar no veículo</p>
                  </div>
                </div>
                <span class="font-mono font-bold text-xs bg-[#123D32] text-[#FFCC45] px-2 py-0.5 rounded">4821</span>
              </div>

              <div onclick="navigateToPassenger('p-subpage-report-incident')" class="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <i data-lucide="alert-circle" class="w-4 h-4"></i>
                  </div>
                  <div>
                    <h4 class="font-bold text-[#123D32]">Reportar Incidente</h4>
                    <p class="text-[10px] text-slate-500">Relate desvios, direção perigosa ou itens esquecidos</p>
                  </div>
                </div>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>
            </div>
          </div>

          <!-- ==================== SUBPAGE: CONTATOS DE CONFIANÇA ==================== -->
          <div id="p-subpage-safety-contacts" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <button onclick="goBackPassenger()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123D32] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#123D32]">Contatos de Confiança</h3>
            </div>

            <p class="text-xs text-slate-600 mb-3">Seus contatos autorizados receberão o link da corrida em tempo real durante suas viagens por Alagoas.</p>

            <div id="p-contacts-list" class="space-y-2 mb-4 text-xs">
              <div class="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                <div>
                  <p class="font-bold text-slate-800">Marcos Silva (Irmão)</p>
                  <p class="text-[10px] text-slate-500">+55 (82) 99911-2233</p>
                </div>
                <span class="text-[10px] font-bold text-[#16A572] bg-[#16A572]/10 px-2 py-0.5 rounded">Ativo</span>
              </div>
              <div class="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                <div>
                  <p class="font-bold text-slate-800">Juliana Santos</p>
                  <p class="text-[10px] text-slate-500">+55 (82) 98844-5566</p>
                </div>
                <span class="text-[10px] font-bold text-[#16A572] bg-[#16A572]/10 px-2 py-0.5 rounded">Ativo</span>
              </div>
            </div>

            <!-- Add Contact Form -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 text-xs">
              <h4 class="font-black text-xs text-[#123D32]">Adicionar Novo Contato</h4>
              <input id="p-input-contact-name" type="text" placeholder="Nome Completo" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#16A572]" />
              <input id="p-input-contact-phone" type="tel" placeholder="Telefone com DDD (82)" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#16A572]" />
              <button onclick="addPassengerSafetyContact()" class="w-full py-2.5 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] font-black rounded-xl transition">
                + Salvar Contato de Confiança
              </button>
            </div>
          </div>

          <!-- ==================== SUBPAGE: REPORTAR INCIDENTE ==================== -->
          <div id="p-subpage-report-incident" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <button onclick="goBackPassenger()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123D32] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#123D32]">Reportar Ocorrência</h3>
            </div>

            <form onsubmit="submitIncidentReport(event)" class="space-y-3 text-xs bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Tipo de Ocorrência:</label>
                <select id="p-incident-type" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium">
                  <option value="dangerous_driving">Direção Perigosa / Excesso de Velocidade</option>
                  <option value="route_deviation">Desvio de Rota sem Autorização</option>
                  <option value="lost_item">Objeto Esquecido no Veículo</option>
                  <option value="wrong_fare">Cobrança Indevida / Divergência de Valor</option>
                  <option value="conduct">Conduta Inadequada do Motorista</option>
                  <option value="other">Outra Solicitação</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Corrida Relacionada:</label>
                <select id="p-incident-trip" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium">
                  <option value="TRIP-AL-01">Piaçabuçu ➔ Penedo (Hoje, R$ 68,01)</option>
                  <option value="TRIP-AL-02">Penedo ➔ Arapiraca (Ontem, R$ 164,20)</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-700 mb-1">Descrição do Ocorrido:</label>
                <textarea id="p-incident-desc" rows="3" required placeholder="Relate com clareza o que aconteceu durante a viagem..." class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#16A572]"></textarea>
              </div>

              <div class="flex items-center gap-2 pt-1">
                <input type="checkbox" id="p-incident-urgent" class="w-4 h-4 text-[#16A572] rounded" />
                <label for="p-incident-urgent" class="text-slate-600 font-medium">Desejo retorno prioritário da equipe</label>
              </div>

              <button type="submit" class="w-full py-3 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] font-black rounded-xl transition">
                Enviar Relatório para Central SIMBORA
              </button>
            </form>
          </div>

          <!-- ==================== PAGE 5: CONTA (MINHA CONTA & 12 SUBPÁGINAS) ==================== -->
          <div id="p-screen-profile" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <!-- User Header Card -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-3 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-13 h-13 rounded-full bg-[#123D32] text-[#FFCC45] flex items-center justify-center font-black text-xl border-2 border-[#16A572]">
                  MS
                </div>
                <div>
                  <h3 id="p-profile-display-name" class="font-black text-sm text-[#123D32]">Marina Silva</h3>
                  <p id="p-profile-display-email" class="text-xs text-slate-600">marina.silva@simbora.app</p>
                  <p id="p-profile-display-phone" class="text-[11px] text-[#16A572] font-bold mt-0.5">✓ (82) 99876-5432</p>
                </div>
              </div>
              <button onclick="navigateToPassenger('p-subpage-personal-data')" class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123D32] text-xs font-bold transition">
                Editar
              </button>
            </div>

            <!-- 12 Required Profile Items Menu -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs mb-3">
              <div onclick="navigateToPassenger('p-subpage-personal-data')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-800"><i data-lucide="user" class="w-4 h-4 text-[#16A572]"></i> 1. Dados Pessoais</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToPassenger('p-subpage-saved-places')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-800"><i data-lucide="map-pin" class="w-4 h-4 text-[#16A572]"></i> 2. Endereços Salvos</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToPassenger('p-subpage-wallet')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-800"><i data-lucide="wallet" class="w-4 h-4 text-[#16A572]"></i> 3. Carteira</span>
                <span class="font-bold text-[#16A572] bg-[#16A572]/10 px-2 py-0.5 rounded">R$ 45,00</span>
              </div>

              <div onclick="navigateToPassenger('p-subpage-payment-methods')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-800"><i data-lucide="credit-card" class="w-4 h-4 text-[#16A572]"></i> 4. Formas de Pagamento</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToPassenger('p-subpage-coupons')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-800"><i data-lucide="tag" class="w-4 h-4 text-[#16A572]"></i> 5. Cupons e Promoções</span>
                <span class="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">2 Ativos</span>
              </div>

              <div onclick="navigateToPassenger('p-subpage-referrals')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-800"><i data-lucide="gift" class="w-4 h-4 text-[#16A572]"></i> 6. Indicar Amigos</span>
                <span class="font-bold text-[#123D32] bg-[#FFCC45] px-2 py-0.5 rounded font-mono">MARINA82</span>
              </div>

              <div onclick="navigateToPassenger('p-subpage-notifications')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-800"><i data-lucide="bell" class="w-4 h-4 text-[#16A572]"></i> 7. Notificações</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToPassenger('p-subpage-privacy')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-800"><i data-lucide="lock" class="w-4 h-4 text-[#16A572]"></i> 8. Privacidade & LGPD</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToPassenger('p-subpage-settings')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-800"><i data-lucide="settings" class="w-4 h-4 text-[#16A572]"></i> 9. Configurações</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToPassenger('p-subpage-help')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-800"><i data-lucide="help-circle" class="w-4 h-4 text-[#16A572]"></i> 10. Central de Ajuda</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToPassenger('p-subpage-terms')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-800"><i data-lucide="file-text" class="w-4 h-4 text-[#16A572]"></i> 11. Termos de Uso</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="passengerLogoutPrompt()" class="p-3 flex items-center justify-between cursor-pointer hover:bg-rose-50 transition text-rose-600">
                <span class="flex items-center gap-2.5 font-bold"><i data-lucide="log-out" class="w-4 h-4 text-rose-600"></i> 12. Sair da Conta</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-rose-400"></i>
              </div>
            </div>
          </div>

          <!-- ==================== PASSENGER PROFILE SUBPAGES ==================== -->
          <!-- 1. DADOS PESSOAIS -->
          <div id="p-subpage-personal-data" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <button onclick="goBackPassenger()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123D32] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#123D32]">Dados Pessoais</h3>
            </div>

            <form onsubmit="savePassengerPersonalData(event)" class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Nome Completo:</label>
                <input id="p-input-name" type="text" value="Marina Silva" required class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#16A572]" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">E-mail Cadastrado:</label>
                <input id="p-input-email" type="email" value="marina.silva@simbora.app" required class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#16A572]" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Telefone Celular (com DDD):</label>
                <input id="p-input-phone" type="tel" value="+55 (82) 99876-5432" required class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#16A572]" />
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Nova Senha (opcional):</label>
                <input id="p-input-password" type="password" placeholder="••••••••" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#16A572]" />
              </div>

              <button type="submit" class="w-full py-3 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] font-black rounded-xl transition">
                Salvar Alterações
              </button>
            </form>
          </div>

          <!-- 2. ENDEREÇOS SALVOS -->
          <div id="p-subpage-saved-places" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <button onclick="goBackPassenger()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123D32] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#123D32]">Endereços Salvos</h3>
            </div>

            <div id="p-saved-places-container" class="space-y-2 mb-4 text-xs">
              <div class="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                <div class="flex items-center gap-2.5">
                  <span class="text-lg">🏠</span>
                  <div>
                    <p class="font-bold text-slate-800">Casa</p>
                    <p class="text-[10px] text-slate-500">Praça São Francisco, 42 - Piaçabuçu</p>
                  </div>
                </div>
                <span class="text-[10px] font-bold text-[#16A572]">Padrão</span>
              </div>

              <div class="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                <div class="flex items-center gap-2.5">
                  <span class="text-lg">💼</span>
                  <div>
                    <p class="font-bold text-slate-800">Trabalho</p>
                    <p class="text-[10px] text-slate-500">Centro Histórico, Rua Barão de Penedo - Penedo</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                <div class="flex items-center gap-2.5">
                  <span class="text-lg">🏖️</span>
                  <div>
                    <p class="font-bold text-slate-800">Praia do Peba</p>
                    <p class="text-[10px] text-slate-500">Pontal do Peba, Piaçabuçu, AL</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Place Form -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 text-xs">
              <h4 class="font-black text-xs text-[#123D32]">+ Adicionar Novo Endereço</h4>
              <input id="p-input-place-label" type="text" placeholder="Rótulo (ex: Academia, Casa de Praia)" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#16A572]" />
              <input id="p-input-place-address" type="text" placeholder="Endereço completo em Alagoas" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#16A572]" />
              <button onclick="addPassengerSavedPlace()" class="w-full py-2.5 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] font-black rounded-xl transition">
                Salvar Endereço
              </button>
            </div>
          </div>

          <!-- 3. CARTEIRA -->
          <div id="p-subpage-wallet" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <button onclick="goBackPassenger()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123D32] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#123D32]">Carteira SIMBORA</h3>
            </div>

            <!-- Balance Card -->
            <div class="bg-gradient-to-br from-[#123D32] to-[#0d2821] text-[#F8F9F6] p-4 rounded-2xl shadow-md mb-3 space-y-2">
              <span class="text-[10px] uppercase font-bold text-[#FFCC45]">Saldo Disponível:</span>
              <p class="text-3xl font-black text-[#F8F9F6] font-mono">R$ 45,00</p>
              <p class="text-[11px] text-[#16A572]">✓ R$ 15,00 em créditos de indicação ativos</p>
            </div>

            <!-- Add Balance Actions -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs mb-3 space-y-2 text-xs">
              <h4 class="font-black text-xs text-[#123D32]">Recarregar Saldo via PIX</h4>
              <div class="grid grid-cols-3 gap-2">
                <button onclick="topUpPassengerWallet(20)" class="py-2 rounded-xl bg-slate-100 hover:bg-[#16A572]/20 font-bold text-[#123D32]">+ R$ 20</button>
                <button onclick="topUpPassengerWallet(50)" class="py-2 rounded-xl bg-slate-100 hover:bg-[#16A572]/20 font-bold text-[#123D32]">+ R$ 50</button>
                <button onclick="topUpPassengerWallet(100)" class="py-2 rounded-xl bg-slate-100 hover:bg-[#16A572]/20 font-bold text-[#123D32]">+ R$ 100</button>
              </div>
            </div>

            <!-- Wallet History -->
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2 text-xs">
              <h4 class="font-black text-xs text-[#123D32] pb-1 border-b border-slate-100">Extrato Financeiro</h4>
              <div class="flex justify-between py-1 border-b border-slate-50">
                <span>Recarga PIX</span> <span class="font-bold text-[#16A572]">+ R$ 50,00</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-50">
                <span>Bônus Amigo Indicado</span> <span class="font-bold text-[#16A572]">+ R$ 15,00</span>
              </div>
              <div class="flex justify-between py-1">
                <span>Viagem Piaçabuçu ➔ Penedo</span> <span class="font-bold text-slate-700">- R$ 20,00</span>
              </div>
            </div>
          </div>

          <!-- 4. FORMAS DE PAGAMENTO -->
          <div id="p-subpage-payment-methods" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <button onclick="goBackPassenger()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123D32] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#123D32]">Formas de Pagamento</h3>
            </div>

            <div class="space-y-2 mb-4 text-xs">
              <div onclick="setPassengerPaymentMethod('PIX Instantâneo')" class="flex items-center justify-between p-3 rounded-xl bg-white border-2 border-[#16A572] cursor-pointer">
                <div class="flex items-center gap-2.5">
                  <span class="text-xl">⚡</span>
                  <div>
                    <p class="font-bold text-slate-800">PIX Instantâneo</p>
                    <p class="text-[10px] text-slate-500">Sem taxas, débito na hora</p>
                  </div>
                </div>
                <span class="text-[10px] font-bold text-[#16A572]">Principal</span>
              </div>

              <div onclick="setPassengerPaymentMethod('Mastercard •••• 4829')" class="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                <div class="flex items-center gap-2.5">
                  <span class="text-xl">💳</span>
                  <div>
                    <p class="font-bold text-slate-800">Mastercard •••• 4829</p>
                    <p class="text-[10px] text-slate-500">Crédito homologado</p>
                  </div>
                </div>
              </div>

              <div onclick="setPassengerPaymentMethod('Dinheiro em Espécie')" class="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                <div class="flex items-center gap-2.5">
                  <span class="text-xl">💵</span>
                  <div>
                    <p class="font-bold text-slate-800">Dinheiro</p>
                    <p class="text-[10px] text-slate-500">Pague direto ao motorista</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Card Form -->
            <form onsubmit="addPassengerCreditCard(event)" class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5 text-xs">
              <h4 class="font-black text-xs text-[#123D32]">+ Adicionar Novo Cartão</h4>
              <input type="text" placeholder="Número do Cartão (16 dígitos)" required maxlength="19" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              <input type="text" placeholder="Nome Completo do Titular" required class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              <div class="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Validade (MM/AA)" required maxlength="5" class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-center" />
                <input type="password" placeholder="CVV" required maxlength="4" class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-center" />
              </div>
              <button type="submit" class="w-full py-2.5 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] font-black rounded-xl transition">
                Cadastrar Cartão
              </button>
            </form>
          </div>

          <!-- 5. CUPONS E PROMOÇÕES -->
          <div id="p-subpage-coupons" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <button onclick="goBackPassenger()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123D32] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#123D32]">Cupons de Desconto</h3>
            </div>

            <!-- Apply Coupon Input -->
            <div class="flex items-center gap-2 mb-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
              <input id="p-input-coupon-code" type="text" placeholder="Digite o código promocional" class="flex-1 p-2 text-xs uppercase font-mono font-bold outline-none" />
              <button onclick="applyPassengerCoupon()" class="px-4 py-2 bg-[#123D32] text-[#FFCC45] font-black text-xs rounded-xl transition">
                Aplicar
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <div class="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 space-y-1">
                <div class="flex justify-between items-center">
                  <span class="font-mono font-black text-sm text-amber-800">SIMBORA10</span>
                  <span class="font-black text-[#16A572] bg-white px-2 py-0.5 rounded-md">R$ 10 OFF</span>
                </div>
                <p class="text-[11px] text-amber-900">Válido em qualquer viagem intermunicipal em Alagoas.</p>
                <p class="text-[10px] text-slate-500">Expira em 31/12/2026</p>
              </div>

              <div class="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-1">
                <div class="flex justify-between items-center">
                  <span class="font-mono font-black text-sm text-emerald-800">PENEDO20</span>
                  <span class="font-black text-[#16A572] bg-white px-2 py-0.5 rounded-md">20% OFF</span>
                </div>
                <p class="text-[11px] text-emerald-900">Desconto exclusivo no trecho Piaçabuçu ⇄ Penedo (AL-101).</p>
                <p class="text-[10px] text-slate-500">Expira em 15/11/2026</p>
              </div>
            </div>
          </div>

          <!-- 6. INDICAR AMIGOS -->
          <div id="p-subpage-referrals" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <button onclick="goBackPassenger()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123D32] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#123D32]">Indicar Amigos</h3>
            </div>

            <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-center space-y-3 text-xs mb-3">
              <div class="w-14 h-14 rounded-full bg-[#16A572]/20 text-[#16A572] mx-auto flex items-center justify-center text-3xl">
                🎁
              </div>
              <h4 class="font-black text-base text-[#123D32]">Ganhe R$ 15 em Créditos</h4>
              <p class="text-slate-600 text-[11px]">Compartilhe seu código com amigos em Alagoas. Quando realizarem a primeira viagem, ambos ganham R$ 15 de bônus na carteira!</p>

              <div class="p-3 rounded-xl bg-slate-100 border border-slate-200 font-mono font-black text-lg text-[#123D32] tracking-widest">
                MARINA82
              </div>

              <button onclick="copyReferralCode()" class="w-full py-3 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] font-black rounded-xl transition flex items-center justify-center gap-2">
                <i data-lucide="copy" class="w-4 h-4"></i> Copiar Código de Indicação
              </button>
            </div>
          </div>

          <!-- 7. NOTIFICAÇÕES -->
          <div id="p-subpage-notifications" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <button onclick="goBackPassenger()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123D32] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#123D32]">Notificações</h3>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs mb-3">
              <div class="p-3.5 flex items-center justify-between">
                <div>
                  <p class="font-bold text-slate-800">Alertas de Corrida em Tempo Real</p>
                  <p class="text-[10px] text-slate-500">Notificar chegada do motorista e início</p>
                </div>
                <input type="checkbox" checked class="w-4 h-4 text-[#16A572]" />
              </div>
              <div class="p-3.5 flex items-center justify-between">
                <div>
                  <p class="font-bold text-slate-800">Promoções e Cupons Especiais</p>
                  <p class="text-[10px] text-slate-500">Descontos nos fins de semana e feriados</p>
                </div>
                <input type="checkbox" checked class="w-4 h-4 text-[#16A572]" />
              </div>
              <div class="p-3.5 flex items-center justify-between">
                <div>
                  <p class="font-bold text-slate-800">Recibos por E-mail</p>
                  <p class="text-[10px] text-slate-500">Envio automático do comprovante fiscal</p>
                </div>
                <input type="checkbox" checked class="w-4 h-4 text-[#16A572]" />
              </div>
            </div>
          </div>

          <!-- 8. PRIVACIDADE & LGPD -->
          <div id="p-subpage-privacy" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <button onclick="goBackPassenger()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123D32] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#123D32]">Privacidade & LGPD</h3>
            </div>

            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs mb-3">
              <h4 class="font-black text-xs text-[#123D32] flex items-center gap-1.5">
                <i data-lucide="shield" class="w-4 h-4 text-[#16A572]"></i> Seus Direitos (Lei 13.709/2018)
              </h4>
              <p class="text-slate-600 text-[11px] leading-relaxed">
                O SIMBORA respeita sua privacidade. Seus dados de localização GPS são transmitidos unicamente durante a corrida e são anonimizados nos relatórios públicos.
              </p>
              <button onclick="alert('Relatório de dados enviado para marina.silva@simbora.app com sucesso!')" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 rounded-xl transition">
                Baixar Cópia dos Meus Dados
              </button>
              <button onclick="passengerDeleteAccountPrompt()" class="w-full py-2.5 bg-rose-50 hover:bg-rose-100 font-bold text-rose-600 rounded-xl transition border border-rose-200">
                Excluir Definitivamente Minha Conta
              </button>
            </div>
          </div>

          <!-- 9. CONFIGURAÇÕES -->
          <div id="p-subpage-settings" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <button onclick="goBackPassenger()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123D32] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#123D32]">Configurações do App</h3>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs mb-3">
              <div class="p-3.5 flex items-center justify-between">
                <span class="font-bold text-slate-800">Idioma:</span>
                <span class="font-bold text-[#16A572]">Português (Brasil)</span>
              </div>
              <div class="p-3.5 flex items-center justify-between">
                <span class="font-bold text-slate-800">Preferência de Ar-condicionado:</span>
                <span class="font-bold text-[#123D32]">Sempre Ligado</span>
              </div>
              <div class="p-3.5 flex items-center justify-between">
                <span class="font-bold text-slate-800">Estilo de Viagem:</span>
                <span class="font-bold text-slate-600">Silenciosa / Conversa moderada</span>
              </div>
            </div>
          </div>

          <!-- 10. CENTRAL DE AJUDA -->
          <div id="p-subpage-help" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <button onclick="goBackPassenger()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123D32] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#123D32]">Central de Ajuda</h3>
            </div>

            <div class="space-y-2.5 text-xs">
              <div class="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <h4 class="font-bold text-[#123D32]">Como funciona o código de segurança PIN?</h4>
                <p class="text-[11px] text-slate-600 leading-relaxed">O PIN de 4 dígitos (ex: 4821) é gerado para cada viagem. Você deve informá-lo ao motorista antes que ele possa iniciar a rota.</p>
              </div>

              <div class="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <h4 class="font-bold text-[#123D32]">Esqueci um objeto no veículo, o que fazer?</h4>
                <p class="text-[11px] text-slate-600 leading-relaxed">Acesse a aba "Atividade", clique na corrida realizada e selecione "Reportar Incidente / Objeto Esquecido" para contato direto com o condutor.</p>
              </div>

              <button onclick="alert('Suporte SIMBORA 24h acionado! Um atendente responderá em até 2 minutos.')" class="w-full py-3 bg-[#123D32] text-[#FFCC45] font-black rounded-xl transition flex items-center justify-center gap-2">
                <i data-lucide="message-circle" class="w-4 h-4"></i> Conversar com Suporte 24h
              </button>
            </div>
          </div>

          <!-- 11. TERMOS DE USO -->
          <div id="p-subpage-terms" class="p-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#F8F9F6] pt-14 pb-20 px-4 text-[#17211D]">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200">
              <button onclick="goBackPassenger()" class="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#123D32] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#123D32]">Termos de Uso</h3>
            </div>

            <div id="p-terms-content" class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs text-slate-700 leading-relaxed">
              <h4 class="font-black text-[#123D32]">Termos e Condições — SIMBORA Alagoas</h4>
              <p><b>1. Objeto:</b> Conexão tecnológica de mobilidade urbana e intermunicipal na região de Piaçabuçu, Penedo e Baixo São Francisco.</p>
              <p><b>2. Tarifação:</b> Calculada por motor cartográfico rodoviário oficial baseando-se na distância real e tempo nas rodovias AL-101 e AL-225.</p>
              <p><b>3. Embarque Seguro:</b> Validação obrigatória por PIN de segurança.</p>
            </div>
          </div>

          <!-- ==================== PASSENGER FIXED BOTTOM NAVIGATION BAR ==================== -->
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

          <!-- Home Indicator -->
          <div class="phone-home-indicator"></div>
        </div>
      </div>`;

// =========================================================================
// 2. DRIVER CONTAINER INNER HTML (NAV + 4 SCREENS + ALL SUBPAGES)
// =========================================================================
const driverPhoneHTML = `<div id="phone-driver-container" class="flex flex-col items-center">
        <div class="mb-3 flex items-center justify-between w-[390px] px-2 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-[#FFCC45]"></span>
            <span class="font-black text-[#F8F9F6]">MOTORISTA: CARLOS OLIVEIRA</span>
          </div>
          <span class="text-slate-400 font-mono text-[11px]">Corolla BRA2E19</span>
        </div>

        <div class="phone-viewport text-[#17211D] flex flex-col relative overflow-hidden bg-[#17211D]">
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

          <!-- ==================== PAGE 1: NAVEGAR (MAPA, HUD & RADAR) ==================== -->
          <div id="d-screen-nav" class="d-page-view flex-1 flex flex-col relative w-full overflow-hidden">
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
            <div class="bg-[#17211D] border-t border-[#123D32] rounded-t-3xl shadow-2xl p-5 relative z-20 text-[#F8F9F6] transition-all duration-300 max-h-[380px] overflow-y-auto mb-16">
              
              <!-- STATE 1: IDLE / ONLINE RADAR -->
              <div id="d-state-idle" class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span id="d-status-indicator" class="w-3.5 h-3.5 rounded-full bg-[#16A572] animate-pulse"></span>
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
                  Aguardando solicitação de passageiro na região de Piaçabuçu...
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

          <!-- ==================== PAGE 2: GANHOS (CARTEIRA & GRÁFICO) ==================== -->
          <div id="d-screen-earnings" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center justify-between mb-3 border-b border-[#123D32] pb-2">
              <h2 class="text-base font-black text-[#FFCC45] flex items-center gap-2">
                <i data-lucide="wallet" class="w-5 h-5 text-[#16A572]"></i> Meus Ganhos
              </h2>
              <span class="text-[10px] font-bold bg-[#16A572]/20 text-[#16A572] px-2 py-0.5 rounded-full">Repasse 85%</span>
            </div>

            <!-- Earnings Metrics Header Grid -->
            <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div class="bg-[#123D32]/80 p-3 rounded-2xl border border-[#16A572]/30">
                <span class="text-[10px] text-slate-400 font-bold uppercase">Ganhos Hoje:</span>
                <p class="text-lg font-black text-[#16A572] mt-0.5">R$ 178,20</p>
                <span class="text-[10px] text-slate-400">4 viagens concluídas</span>
              </div>
              <div class="bg-[#123D32]/80 p-3 rounded-2xl border border-[#16A572]/30">
                <span class="text-[10px] text-slate-400 font-bold uppercase">Ganhos da Semana:</span>
                <p class="text-lg font-black text-[#FFCC45] mt-0.5">R$ 1.140,00</p>
                <span class="text-[10px] text-slate-400">Média: R$ 43,84 / corrida</span>
              </div>
            </div>

            <!-- Interactive Weekly Earnings Bar Chart -->
            <div class="bg-[#123D32]/60 rounded-2xl p-4 border border-[#16A572]/30 shadow-xs mb-3 space-y-2">
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-[#FFCC45] uppercase tracking-wider">Ganhos por Dia (Esta Semana)</span>
                <span class="font-mono text-[10px] text-[#16A572] font-bold">Total: R$ 1.140</span>
              </div>

              <!-- SVG/HTML Bar Chart -->
              <div class="h-32 flex items-end justify-between gap-1.5 pt-4 pb-1 px-1 border-b border-[#16A572]/20 font-mono text-[10px]">
                <div class="flex-1 flex flex-col items-center gap-1">
                  <span class="text-[9px] text-slate-400">120</span>
                  <div class="w-full bg-[#16A572]/40 rounded-t-lg" style="height: 40%;"></div>
                  <span class="text-slate-400">Seg</span>
                </div>
                <div class="flex-1 flex flex-col items-center gap-1">
                  <span class="text-[9px] text-slate-400">145</span>
                  <div class="w-full bg-[#16A572]/50 rounded-t-lg" style="height: 50%;"></div>
                  <span class="text-slate-400">Ter</span>
                </div>
                <div class="flex-1 flex flex-col items-center gap-1">
                  <span class="text-[9px] text-slate-400">180</span>
                  <div class="w-full bg-[#16A572]/60 rounded-t-lg" style="height: 62%;"></div>
                  <span class="text-slate-400">Qua</span>
                </div>
                <div class="flex-1 flex flex-col items-center gap-1">
                  <span class="text-[9px] text-slate-400">160</span>
                  <div class="w-full bg-[#16A572]/55 rounded-t-lg" style="height: 55%;"></div>
                  <span class="text-slate-400">Qui</span>
                </div>
                <div class="flex-1 flex flex-col items-center gap-1">
                  <span class="text-[9px] text-[#FFCC45] font-bold">210</span>
                  <div class="w-full bg-[#16A572]/80 rounded-t-lg" style="height: 75%;"></div>
                  <span class="text-slate-400">Sex</span>
                </div>
                <div class="flex-1 flex flex-col items-center gap-1">
                  <span class="text-[9px] text-[#FFCC45] font-bold">178</span>
                  <div class="w-full bg-[#FFCC45] rounded-t-lg shadow-sm" style="height: 65%;"></div>
                  <span class="text-[#FFCC45] font-bold">Hoje</span>
                </div>
                <div class="flex-1 flex flex-col items-center gap-1">
                  <span class="text-[9px] text-slate-500">147</span>
                  <div class="w-full bg-[#16A572]/30 rounded-t-lg" style="height: 48%;"></div>
                  <span class="text-slate-400">Dom</span>
                </div>
              </div>
            </div>

            <!-- Balance Card & Instant Payout -->
            <div class="bg-gradient-to-br from-[#123D32] to-[#0d2821] rounded-2xl p-4 border border-[#16A572]/40 shadow-lg mb-3 space-y-3">
              <div>
                <span class="text-[10px] font-bold text-slate-300 uppercase">Saldo Disponível para Saque:</span>
                <p id="d-wallet-balance" class="text-2xl font-black text-[#FFCC45] mt-1 font-mono">R$ 384,50</p>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#16A572]/30">
                <div>
                  <span class="text-slate-400 block text-[10px]">Chave PIX Cadastrada:</span>
                  <span class="font-bold text-slate-200 truncate block">carlos.oliveira@pix</span>
                </div>
                <div class="text-right">
                  <span class="text-slate-400 block text-[10px]">Taxa Plataforma:</span>
                  <span class="font-bold text-[#16A572]">15% Oficial</span>
                </div>
              </div>

              <button onclick="requestPixPayout()" class="w-full py-3 bg-[#16A572] hover:bg-[#139063] text-[#123D32] font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2">
                <i data-lucide="zap" class="w-4 h-4 fill-[#123D32]"></i> SOLICITAR SAQUE PIX IMEDIATO
              </button>
            </div>

            <!-- Statements Action Button -->
            <button onclick="navigateToDriver('d-subpage-statement')" class="w-full py-2.5 bg-[#123D32] hover:bg-[#17211D] text-slate-200 border border-[#16A572]/30 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition">
              <i data-lucide="file-text" class="w-4 h-4 text-[#FFCC45]"></i> Ver Extrato Detalhado de Corridas
            </button>
          </div>

          <!-- ==================== SUBPAGE: EXTRATO DO MOTORISTA ==================== -->
          <div id="d-subpage-statement" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-[#123D32]">
              <button onclick="goBackDriver()" class="p-1.5 rounded-xl bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#F8F9F6]">Extrato Financeiro</h3>
            </div>

            <div class="space-y-2.5 text-xs">
              <div class="p-3 rounded-2xl bg-[#123D32]/70 border border-[#16A572]/30 space-y-1">
                <div class="flex justify-between">
                  <span class="font-bold text-white">Piaçabuçu ➔ Penedo (28,2 km)</span>
                  <span class="font-black text-[#16A572]">+ R$ 57,80</span>
                </div>
                <div class="flex justify-between text-[11px] text-slate-400">
                  <span>Bruto: R$ 68,01 | Taxa SIMBORA (15%): -R$ 10,21</span>
                  <span class="text-[#FFCC45]">PIX Pago</span>
                </div>
              </div>

              <div class="p-3 rounded-2xl bg-[#123D32]/70 border border-[#16A572]/30 space-y-1">
                <div class="flex justify-between">
                  <span class="font-bold text-white">Penedo Centro ➔ Cooperativa (8,5 km)</span>
                  <span class="font-black text-[#16A572]">+ R$ 20,40</span>
                </div>
                <div class="flex justify-between text-[11px] text-slate-400">
                  <span>Bruto: R$ 24,00 | Taxa SIMBORA (15%): -R$ 3,60</span>
                  <span class="text-[#FFCC45]">PIX Pago</span>
                </div>
              </div>

              <div class="p-3 rounded-2xl bg-[#123D32]/70 border border-[#16A572]/30 space-y-1">
                <div class="flex justify-between">
                  <span class="font-bold text-white">Penedo ➔ Igreja Nova (31,9 km)</span>
                  <span class="font-black text-[#16A572]">+ R$ 69,70</span>
                </div>
                <div class="flex justify-between text-[11px] text-slate-400">
                  <span>Bruto: R$ 82,00 | Taxa SIMBORA (15%): -R$ 12,30</span>
                  <span class="text-[#FFCC45]">PIX Pago</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ==================== PAGE 3: DOCUMENTOS (HOMOLOGAÇÃO) ==================== -->
          <div id="d-screen-docs" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center justify-between mb-3 border-b border-[#123D32] pb-2">
              <h2 class="text-base font-black text-[#FFCC45] flex items-center gap-2">
                <i data-lucide="file-check" class="w-5 h-5 text-[#16A572]"></i> Meus Documentos
              </h2>
              <span class="text-[10px] font-black bg-[#16A572] text-[#123D32] px-2 py-0.5 rounded-full">HOMOLOGADO</span>
            </div>

            <!-- Status Banner -->
            <div class="bg-[#123D32] border border-[#16A572]/40 rounded-2xl p-3.5 mb-3 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-[#16A572] text-[#123D32] flex items-center justify-center font-black text-xl">
                ✓
              </div>
              <div class="text-xs">
                <h4 class="font-black text-[#F8F9F6]">Condutor Homologado</h4>
                <p class="text-slate-300 text-[11px]">Todos os documentos probatórios conferidos e aprovados.</p>
              </div>
            </div>

            <!-- Documents List -->
            <div class="space-y-2.5 text-xs mb-3">
              <div class="bg-[#123D32]/60 p-3.5 rounded-2xl border border-[#16A572]/30 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#F8F9F6]">🪪 CNH Categoria B (com EAR)</span>
                  <span class="text-[10px] font-bold text-[#16A572] bg-[#16A572]/15 px-2 py-0.5 rounded">Aprovado</span>
                </div>
                <p class="text-[11px] text-slate-400">Nº 05829104820 • Validade: 28/05/2028</p>
              </div>

              <div class="bg-[#123D32]/60 p-3.5 rounded-2xl border border-[#16A572]/30 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#F8F9F6]">📄 CRLV do Veículo (2026)</span>
                  <span class="text-[10px] font-bold text-[#16A572] bg-[#16A572]/15 px-2 py-0.5 rounded">Aprovado</span>
                </div>
                <p class="text-[11px] text-slate-400">Exercício 2026 • Renavam: 00984729102</p>
              </div>

              <div class="bg-[#123D32]/60 p-3.5 rounded-2xl border border-[#16A572]/30 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#F8F9F6]">🔍 Laudo de Vistoria Anual</span>
                  <span class="text-[10px] font-bold text-[#16A572] bg-[#16A572]/15 px-2 py-0.5 rounded">Aprovado</span>
                </div>
                <p class="text-[11px] text-slate-400">Vistoria técnica 100% aprovada pelo vistoriador credenciado</p>
              </div>

              <div class="bg-[#123D32]/60 p-3.5 rounded-2xl border border-[#16A572]/30 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-[#F8F9F6]">🛡️ Antecedentes Criminais</span>
                  <span class="text-[10px] font-bold text-[#16A572] bg-[#16A572]/15 px-2 py-0.5 rounded">Certificado OK</span>
                </div>
                <p class="text-[11px] text-slate-400">TJ-AL • Nada Consta homologado</p>
              </div>
            </div>

            <!-- Upload Action Button -->
            <button onclick="navigateToDriver('d-subpage-upload-doc')" class="w-full py-3 bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] border border-[#16A572]/40 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition">
              <i data-lucide="upload-cloud" class="w-4 h-4"></i> Enviar ou Renovar Documento
            </button>
          </div>

          <!-- ==================== SUBPAGE: UPLOAD DE DOCUMENTOS ==================== -->
          <div id="d-subpage-upload-doc" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-[#123D32]">
              <button onclick="goBackDriver()" class="p-1.5 rounded-xl bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#F8F9F6]">Upload de Documento</h3>
            </div>

            <form onsubmit="submitDriverDocument(event)" class="bg-[#123D32]/60 p-4 rounded-2xl border border-[#16A572]/30 space-y-3 text-xs">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Tipo de Documento:</label>
                <select id="d-doc-type" class="w-full p-2 bg-[#17211D] border border-[#16A572]/40 rounded-xl outline-none text-white">
                  <option value="cnh">CNH (Carteira Nacional de Habilitação com EAR)</option>
                  <option value="crlv">CRLV (Certificado de Registro e Licenciamento)</option>
                  <option value="inspection">Laudo de Vistoria Mecânica</option>
                  <option value="background_check">Certidão de Antecedentes Criminais</option>
                  <option value="proof_of_address">Comprovante de Residência</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-slate-300 mb-1">Data de Validade:</label>
                <input id="d-doc-expiry" type="date" value="2028-05-28" class="w-full p-2 bg-[#17211D] border border-[#16A572]/40 rounded-xl outline-none text-white" />
              </div>

              <div>
                <label class="block font-bold text-slate-300 mb-1">Arquivo do Documento (PDF/JPG/PNG):</label>
                <div class="border-2 border-dashed border-[#16A572]/40 rounded-xl p-4 text-center cursor-pointer hover:border-[#FFCC45] transition bg-[#17211D]">
                  <i data-lucide="file-up" class="w-6 h-6 text-[#FFCC45] mx-auto mb-1"></i>
                  <span class="text-[11px] text-slate-300 block">Clique para selecionar imagem ou PDF</span>
                  <span class="text-[9px] text-slate-500">Tamanho máximo: 10MB</span>
                </div>
              </div>

              <button type="submit" class="w-full py-3 bg-[#16A572] hover:bg-[#139063] text-[#123D32] font-black rounded-xl transition">
                Enviar para Análise e Homologação
              </button>
            </form>
          </div>

          <!-- ==================== PAGE 4: VEÍCULO (MEU VEÍCULO) ==================== -->
          <div id="d-screen-vehicle" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center justify-between mb-3 border-b border-[#123D32] pb-2">
              <h2 class="text-base font-black text-[#FFCC45] flex items-center gap-2">
                <i data-lucide="car" class="w-5 h-5 text-[#16A572]"></i> Meu Veículo
              </h2>
              <span class="text-[10px] font-bold bg-[#16A572]/20 text-[#16A572] px-2 py-0.5 rounded-full">Simbora Conforto</span>
            </div>

            <div class="bg-[#123D32] rounded-2xl p-4 border border-[#16A572]/40 shadow-lg mb-3 text-center space-y-2">
              <div class="text-4xl mb-1">🚙</div>
              <h3 class="font-black text-base text-[#F8F9F6]">Toyota Corolla XEi 2.0</h3>
              <p class="text-xs text-[#FFCC45] font-mono font-bold tracking-widest bg-[#17211D] py-1 px-3 rounded-lg inline-block border border-[#16A572]/40">
                PLACA: QTT-4821 (AL)
              </p>
            </div>

            <!-- Vehicle Specs -->
            <div class="bg-[#123D32]/60 rounded-2xl p-4 border border-[#16A572]/30 space-y-2 text-xs mb-3">
              <div class="flex justify-between pb-1 border-b border-[#123D32]">
                <span class="text-slate-400">Fabricante / Modelo:</span>
                <span class="font-bold text-white">Toyota Corolla XEi</span>
              </div>
              <div class="flex justify-between pb-1 border-b border-[#123D32]">
                <span class="text-slate-400">Ano:</span>
                <span class="font-bold text-white">2023 / 2024</span>
              </div>
              <div class="flex justify-between pb-1 border-b border-[#123D32]">
                <span class="text-slate-400">Cor Oficial:</span>
                <span class="font-bold text-white">Prata Lunar Metálico</span>
              </div>
              <div class="flex justify-between pb-1 border-b border-[#123D32]">
                <span class="text-slate-400">Categoria Homologada:</span>
                <span class="font-bold text-[#16A572]">Conforto & Pop</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Status de Vistoria:</span>
                <span class="font-bold text-[#16A572]">Selo 2026 Vigente ✓</span>
              </div>
            </div>

            <!-- Vehicle Actions -->
            <div class="space-y-2 text-xs">
              <button onclick="navigateToDriver('d-subpage-edit-vehicle')" class="w-full py-2.5 bg-[#123D32] hover:bg-[#0d2821] text-white border border-[#16A572]/30 rounded-xl font-bold transition flex items-center justify-center gap-2">
                <i data-lucide="edit-3" class="w-4 h-4 text-[#FFCC45]"></i> Editar Dados do Veículo
              </button>
              <button onclick="navigateToDriver('d-subpage-inspections')" class="w-full py-2.5 bg-[#123D32] hover:bg-[#0d2821] text-white border border-[#16A572]/30 rounded-xl font-bold transition flex items-center justify-center gap-2">
                <i data-lucide="check-square" class="w-4 h-4 text-[#16A572]"></i> Consultar Laudo de Vistoria
              </button>
              <button onclick="navigateToDriver('d-subpage-change-vehicle')" class="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition flex items-center justify-center gap-2">
                <i data-lucide="refresh-cw" class="w-4 h-4 text-slate-400"></i> Solicitar Troca de Veículo
              </button>
            </div>
          </div>

          <!-- ==================== SUBPAGES DO VEÍCULO ==================== -->
          <!-- EDITAR VEÍCULO -->
          <div id="d-subpage-edit-vehicle" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-[#123D32]">
              <button onclick="goBackDriver()" class="p-1.5 rounded-xl bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#F8F9F6]">Editar Veículo</h3>
            </div>

            <form onsubmit="saveDriverVehicleData(event)" class="bg-[#123D32]/60 p-4 rounded-2xl border border-[#16A572]/30 space-y-3 text-xs">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Cor Oficial:</label>
                <input id="d-veh-color" type="text" value="Prata Lunar" class="w-full p-2.5 bg-[#17211D] border border-[#16A572]/40 rounded-xl outline-none text-white" />
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Quilometragem Atual:</label>
                <input id="d-veh-km" type="number" value="42800" class="w-full p-2.5 bg-[#17211D] border border-[#16A572]/40 rounded-xl outline-none text-white" />
              </div>
              <button type="submit" class="w-full py-3 bg-[#16A572] hover:bg-[#139063] text-[#123D32] font-black rounded-xl transition">
                Salvar Atualização
              </button>
            </form>
          </div>

          <!-- HISTÓRICO DE VISTORIAS -->
          <div id="d-subpage-inspections" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-[#123D32]">
              <button onclick="goBackDriver()" class="p-1.5 rounded-xl bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#F8F9F6]">Laudo de Vistoria 2026</h3>
            </div>

            <div class="bg-[#123D32]/60 p-4 rounded-2xl border border-[#16A572]/30 space-y-2 text-xs">
              <div class="flex justify-between items-center pb-2 border-b border-[#123D32]">
                <span class="font-bold text-white">Status Geral:</span>
                <span class="font-black text-[#16A572] bg-[#16A572]/15 px-2 py-0.5 rounded">100% APROVADO</span>
              </div>
              <p class="text-slate-300">Data: 15/01/2026 • Posto Técnico Penedo / AL</p>
              <div class="space-y-1 pt-1 text-slate-300">
                <p>• Pneus e Estepe: <b class="text-[#16A572]">Conforme</b></p>
                <p>• Freios ABS: <b class="text-[#16A572]">Conforme</b></p>
                <p>• Cintos de Segurança (5): <b class="text-[#16A572]">Conforme</b></p>
                <p>• Ar-condicionado: <b class="text-[#16A572]">Higienizado e Aprovado</b></p>
              </div>
            </div>
          </div>

          <!-- SOLICITAR TROCA DE VEÍCULO -->
          <div id="d-subpage-change-vehicle" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-[#123D32]">
              <button onclick="goBackDriver()" class="p-1.5 rounded-xl bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#F8F9F6]">Trocar de Veículo</h3>
            </div>

            <form onsubmit="submitVehicleChangeRequest(event)" class="bg-[#123D32]/60 p-4 rounded-2xl border border-[#16A572]/30 space-y-3 text-xs">
              <input type="text" placeholder="Marca e Modelo (ex: Honda Civic)" required class="w-full p-2.5 bg-[#17211D] border border-[#16A572]/40 rounded-xl outline-none text-white" />
              <input type="text" placeholder="Placa Mercosul" required maxlength="8" class="w-full p-2.5 bg-[#17211D] border border-[#16A572]/40 rounded-xl outline-none text-white uppercase font-mono" />
              <input type="number" placeholder="Ano de Fabricação" required class="w-full p-2.5 bg-[#17211D] border border-[#16A572]/40 rounded-xl outline-none text-white" />
              <button type="submit" class="w-full py-3 bg-[#FFCC45] text-[#123D32] font-black rounded-xl transition">
                Enviar para Homologação
              </button>
            </form>
          </div>

          <!-- ==================== PAGE 5: PERFIL (MEU PERFIL & 12 SUBPÁGINAS) ==================== -->
          <div id="d-screen-profile" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <!-- Driver Profile Header -->
            <div class="bg-[#123D32] rounded-2xl p-4 border border-[#16A572]/40 shadow-lg mb-3 flex items-center gap-3.5">
              <div class="w-13 h-13 rounded-full bg-[#16A572] text-[#123D32] flex items-center justify-center font-black text-xl border-2 border-[#FFCC45]">
                CO
              </div>
              <div class="flex-1">
                <h3 class="font-black text-base text-[#F8F9F6]">Carlos Oliveira</h3>
                <p class="text-xs text-slate-300">Penedo & Piaçabuçu • Alagoas</p>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="text-xs font-black text-[#FFCC45]">4.96 ★</span>
                  <span class="text-[10px] text-slate-400">(1.482 viagens)</span>
                </div>
              </div>
              <span class="text-[10px] font-black bg-[#FFCC45] text-[#123D32] px-2 py-0.5 rounded-full">DIAMANTE</span>
            </div>

            <!-- 12 Required Driver Menu Items -->
            <div class="bg-[#123D32]/70 rounded-2xl border border-[#16A572]/30 shadow-xs divide-y divide-[#16A572]/20 text-xs mb-3">
              <div onclick="navigateToDriver('d-subpage-personal-data')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-[#123D32] transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-200"><i data-lucide="user" class="w-4 h-4 text-[#FFCC45]"></i> 1. Dados Pessoais</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToDriver('d-subpage-ratings')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-[#123D32] transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-200"><i data-lucide="star" class="w-4 h-4 text-[#FFCC45]"></i> 2. Minha Avaliação (4.96 ★)</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToDriver('d-subpage-statement')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-[#123D32] transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-200"><i data-lucide="clock" class="w-4 h-4 text-[#FFCC45]"></i> 3. Histórico de Corridas</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="switchDriverTab('earnings')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-[#123D32] transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-200"><i data-lucide="wallet" class="w-4 h-4 text-[#FFCC45]"></i> 4. Carteira e Repasses</span>
                <span class="font-bold text-[#FFCC45]">R$ 384,50</span>
              </div>

              <div onclick="navigateToDriver('d-subpage-bank-data')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-[#123D32] transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-200"><i data-lucide="landmark" class="w-4 h-4 text-[#FFCC45]"></i> 5. Dados Bancários & PIX</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToDriver('d-subpage-preferences')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-[#123D32] transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-200"><i data-lucide="sliders" class="w-4 h-4 text-[#FFCC45]"></i> 6. Preferências de Viagem</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToDriver('d-subpage-notifications')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-[#123D32] transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-200"><i data-lucide="bell" class="w-4 h-4 text-[#FFCC45]"></i> 7. Notificações & Alertas</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToDriver('d-subpage-safety')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-[#123D32] transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-200"><i data-lucide="shield" class="w-4 h-4 text-[#FFCC45]"></i> 8. Segurança do Condutor</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToDriver('d-subpage-help')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-[#123D32] transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-200"><i data-lucide="help-circle" class="w-4 h-4 text-[#FFCC45]"></i> 9. Ajuda & Suporte</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToDriver('d-subpage-settings')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-[#123D32] transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-200"><i data-lucide="settings" class="w-4 h-4 text-[#FFCC45]"></i> 10. Configurações</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="navigateToDriver('d-subpage-terms')" class="p-3 flex items-center justify-between cursor-pointer hover:bg-[#123D32] transition">
                <span class="flex items-center gap-2.5 font-bold text-slate-200"><i data-lucide="file-text" class="w-4 h-4 text-[#FFCC45]"></i> 11. Termos do Parceiro</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-slate-400"></i>
              </div>

              <div onclick="driverLogoutPrompt()" class="p-3 flex items-center justify-between cursor-pointer hover:bg-rose-950/40 transition text-rose-400">
                <span class="flex items-center gap-2.5 font-bold"><i data-lucide="log-out" class="w-4 h-4 text-rose-400"></i> 12. Sair / Desconectar</span>
                <i data-lucide="chevron-right" class="w-4 h-4 text-rose-400"></i>
              </div>
            </div>
          </div>

          <!-- ==================== DRIVER PROFILE SUBPAGES ==================== -->
          <!-- 1. DADOS PESSOAIS -->
          <div id="d-subpage-personal-data" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-[#123D32]">
              <button onclick="goBackDriver()" class="p-1.5 rounded-xl bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#F8F9F6]">Dados Pessoais do Condutor</h3>
            </div>

            <form onsubmit="saveDriverPersonalData(event)" class="bg-[#123D32]/60 p-4 rounded-2xl border border-[#16A572]/30 space-y-3 text-xs">
              <div>
                <label class="block font-bold text-slate-300 mb-1">Nome:</label>
                <input id="d-input-name" type="text" value="Carlos Oliveira" required class="w-full p-2.5 bg-[#17211D] border border-[#16A572]/40 rounded-xl outline-none text-white" />
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Telefone:</label>
                <input id="d-input-phone" type="tel" value="+55 (82) 99123-4567" required class="w-full p-2.5 bg-[#17211D] border border-[#16A572]/40 rounded-xl outline-none text-white" />
              </div>
              <div>
                <label class="block font-bold text-slate-300 mb-1">Chave PIX Oficial:</label>
                <input id="d-input-pix" type="text" value="carlos.oliveira@pix.com.br" required class="w-full p-2.5 bg-[#17211D] border border-[#16A572]/40 rounded-xl outline-none text-white" />
              </div>
              <button type="submit" class="w-full py-3 bg-[#16A572] hover:bg-[#139063] text-[#123D32] font-black rounded-xl transition">
                Salvar Alterações
              </button>
            </form>
          </div>

          <!-- 2. MINHA AVALIAÇÃO -->
          <div id="d-subpage-ratings" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-[#123D32]">
              <button onclick="goBackDriver()" class="p-1.5 rounded-xl bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#F8F9F6]">Minha Avaliação</h3>
            </div>

            <div class="bg-[#123D32] p-4 rounded-2xl border border-[#16A572]/40 text-center mb-3">
              <span class="text-3xl font-black text-[#FFCC45]">4.96 ★</span>
              <p class="text-xs text-slate-300 mt-1">1.482 corridas avaliadas com 5 estrelas</p>
              <div class="mt-2 text-[10px] text-[#16A572] font-bold">96% de avaliações máximas em Alagoas</div>
            </div>

            <div class="space-y-2 text-xs">
              <div class="p-3 bg-[#123D32]/50 rounded-xl border border-[#16A572]/20">
                <p class="text-white italic">"Carlos foi muito pontual e conduziu com muita calma pela rodovia."</p>
                <span class="text-[10px] text-[#FFCC45] block mt-1">Marina S. • Piaçabuçu ⭐⭐⭐⭐⭐</span>
              </div>
              <div class="p-3 bg-[#123D32]/50 rounded-xl border border-[#16A572]/20">
                <p class="text-white italic">"Carro impecável, ar-condicionado excelente."</p>
                <span class="text-[10px] text-[#FFCC45] block mt-1">João P. • Penedo ⭐⭐⭐⭐⭐</span>
              </div>
            </div>
          </div>

          <!-- 5. DADOS BANCÁRIOS -->
          <div id="d-subpage-bank-data" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-[#123D32]">
              <button onclick="goBackDriver()" class="p-1.5 rounded-xl bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#F8F9F6]">Dados Bancários</h3>
            </div>

            <div class="bg-[#123D32]/60 p-4 rounded-2xl border border-[#16A572]/30 space-y-2.5 text-xs">
              <div class="flex justify-between pb-1 border-b border-[#123D32]">
                <span class="text-slate-400">Instituição:</span>
                <span class="font-bold text-white">Nubank (260)</span>
              </div>
              <div class="flex justify-between pb-1 border-b border-[#123D32]">
                <span class="text-slate-400">Agência:</span>
                <span class="font-bold text-white">0001</span>
              </div>
              <div class="flex justify-between pb-1 border-b border-[#123D32]">
                <span class="text-slate-400">Conta Corrente:</span>
                <span class="font-bold text-white">98472-1</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Chave PIX:</span>
                <span class="font-bold text-[#FFCC45]">carlos.oliveira@pix.com.br</span>
              </div>
            </div>
          </div>

          <!-- 6. PREFERÊNCIAS DE VIAGEM -->
          <div id="d-subpage-preferences" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-[#123D32]">
              <button onclick="goBackDriver()" class="p-1.5 rounded-xl bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#F8F9F6]">Preferências de Viagem</h3>
            </div>

            <div class="bg-[#123D32]/60 rounded-2xl border border-[#16A572]/30 divide-y divide-[#16A572]/20 text-xs mb-3">
              <div class="p-3.5 flex items-center justify-between">
                <div>
                  <p class="font-bold text-white">Raio Máximo de Chamadas</p>
                  <p class="text-[10px] text-slate-400">Até 35 km (Piaçabuçu ↔ Penedo ↔ Peba)</p>
                </div>
                <span class="font-bold text-[#FFCC45]">35 km</span>
              </div>
              <div class="p-3.5 flex items-center justify-between">
                <div>
                  <p class="font-bold text-white">Aceitar Corridas Pop</p>
                  <p class="text-[10px] text-slate-400">Atender chamadas Simbora Pop</p>
                </div>
                <input type="checkbox" checked class="w-4 h-4 text-[#16A572]" />
              </div>
              <div class="p-3.5 flex items-center justify-between">
                <div>
                  <p class="font-bold text-white">Aceitar Corridas Conforto</p>
                  <p class="text-[10px] text-slate-400">Categoria oficial do Corolla</p>
                </div>
                <input type="checkbox" checked class="w-4 h-4 text-[#16A572]" />
              </div>
            </div>
          </div>

          <!-- 7. NOTIFICAÇÕES -->
          <div id="d-subpage-notifications" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-[#123D32]">
              <button onclick="goBackDriver()" class="p-1.5 rounded-xl bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#F8F9F6]">Alertas do Motorista</h3>
            </div>

            <div class="bg-[#123D32]/60 rounded-2xl border border-[#16A572]/30 divide-y divide-[#16A572]/20 text-xs">
              <div class="p-3.5 flex items-center justify-between">
                <div>
                  <p class="font-bold text-white">Alerta Sonoro de Chamadas</p>
                  <p class="text-[10px] text-slate-400">Som alto e vibração</p>
                </div>
                <input type="checkbox" checked class="w-4 h-4 text-[#16A572]" />
              </div>
              <div class="p-3.5 flex items-center justify-between">
                <div>
                  <p class="font-bold text-white">Avisos de Trânsito AL-101 / AL-225</p>
                  <p class="text-[10px] text-slate-400">Obras e fiscalizações</p>
                </div>
                <input type="checkbox" checked class="w-4 h-4 text-[#16A572]" />
              </div>
            </div>
          </div>

          <!-- 8. SEGURANÇA DO CONDUTOR -->
          <div id="d-subpage-safety" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-[#123D32]">
              <button onclick="goBackDriver()" class="p-1.5 rounded-xl bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#F8F9F6]">Segurança do Condutor</h3>
            </div>

            <div class="space-y-3 text-xs">
              <div class="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-center space-y-2">
                <i data-lucide="alert-octagon" class="w-8 h-8 text-rose-500 mx-auto"></i>
                <h4 class="font-bold text-rose-300">Botão de Emergência do Motorista</h4>
                <p class="text-[11px] text-slate-300">Disparo prioritário silencioso para a Central SIMBORA em caso de risco.</p>
                <button onclick="alert('Alerta emitido para a Central Operacional do SIMBORA com telemetria GPS!')" class="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl">
                  Disparar Alerta à Central
                </button>
              </div>
            </div>
          </div>

          <!-- 9. AJUDA E SUPORTE -->
          <div id="d-subpage-help" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-[#123D32]">
              <button onclick="goBackDriver()" class="p-1.5 rounded-xl bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#F8F9F6]">Suporte ao Condutor</h3>
            </div>

            <div class="bg-[#123D32]/60 p-4 rounded-2xl border border-[#16A572]/30 space-y-2.5 text-xs text-slate-300">
              <h4 class="font-bold text-white">Atendimento Operacional SIMBORA</h4>
              <p>• Ponto de Apoio Penedo: Praça Barão de Penedo, 102</p>
              <p>• Telefone do Plantão 24h: <b>(82) 3551-9900</b></p>
              <button onclick="alert('Linha direta com o supervisor de frota acionada!')" class="w-full py-2.5 bg-[#FFCC45] text-[#123D32] font-black rounded-xl mt-2">
                Falar com Supervisor de Frota
              </button>
            </div>
          </div>

          <!-- 10. CONFIGURAÇÕES -->
          <div id="d-subpage-settings" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-[#123D32]">
              <button onclick="goBackDriver()" class="p-1.5 rounded-xl bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#F8F9F6]">Configurações</h3>
            </div>

            <div class="bg-[#123D32]/60 rounded-2xl border border-[#16A572]/30 divide-y divide-[#16A572]/20 text-xs">
              <div class="p-3.5 flex items-center justify-between">
                <span class="font-bold text-white">Navegador Padrão:</span>
                <span class="font-bold text-[#FFCC45]">MapLibre HD Alagoas</span>
              </div>
              <div class="p-3.5 flex items-center justify-between">
                <span class="font-bold text-white">Modo Noturno Automático:</span>
                <input type="checkbox" checked class="w-4 h-4 text-[#16A572]" />
              </div>
            </div>
          </div>

          <!-- 11. TERMOS DO PARCEIRO -->
          <div id="d-subpage-terms" class="d-page-view hidden flex-1 flex flex-col relative w-full overflow-y-auto bg-[#17211D] text-[#F8F9F6] pt-14 pb-20 px-4">
            <div class="flex items-center gap-2 mb-3 pb-2 border-b border-[#123D32]">
              <button onclick="goBackDriver()" class="p-1.5 rounded-xl bg-[#123D32] hover:bg-[#0d2821] text-[#FFCC45] transition flex items-center gap-1 font-bold text-xs">
                <i data-lucide="chevron-left" class="w-4 h-4"></i> Voltar
              </button>
              <h3 class="font-black text-sm text-[#F8F9F6]">Termos do Parceiro</h3>
            </div>

            <div class="bg-[#123D32]/60 p-4 rounded-2xl border border-[#16A572]/30 space-y-2 text-xs text-slate-300">
              <h4 class="font-bold text-white">Contrato de Parceria Operacional</h4>
              <p>• Repasse líquido garantido de <b>85%</b> para o condutor.</p>
              <p>• Pagamentos instantâneos via PIX sem carência.</p>
              <p>• Obrigatoriedade de vistoria veicular anual e CNH com EAR.</p>
            </div>
          </div>

          <!-- ==================== DRIVER FIXED BOTTOM NAVIGATION BAR ==================== -->
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

          <!-- Home Indicator -->
          <div class="phone-home-indicator"></div>
        </div>
      </div>`;

// Replace the two phone containers in html
const terminalMarker = '<!-- ==================== REAL-TIME EVENT LOG TERMINAL ==================== -->';
const terminalIdx = html.indexOf(terminalMarker);

const beforePassenger = html.substring(0, pStartIdx);
const afterDriver = html.substring(terminalIdx);

html = beforePassenger + passengerPhoneHTML + '\n\n      ' + driverPhoneHTML + '\n\n    </div>\n\n  </main>\n\n  ' + afterDriver;
console.log('✅ Containers de Passageiro e Motorista substituídos com sucesso!');

// =========================================================================
// 3. JAVASCRIPT NAVIGATION LOGIC & BACKEND INTEGRATION
// =========================================================================
const navigationControllerScript = `
  <script>
    // ==========================================
    // STACK-BASED SCREEN NAVIGATION CONTROLLER
    // ==========================================
    let pNavStack = ['p-screen-home'];
    let dNavStack = ['d-screen-nav'];

    function navigateToPassenger(targetId) {
      pNavStack.push(targetId);
      showPassengerPage(targetId);
      logEvent('PASSENGER', 'Navegou para: ' + targetId.replace('p-', ''));
    }

    function goBackPassenger() {
      if (pNavStack.length > 1) {
        pNavStack.pop();
        const prev = pNavStack[pNavStack.length - 1];
        showPassengerPage(prev);
        logEvent('PASSENGER', 'Retornou para: ' + prev.replace('p-', ''));
      }
    }

    function showPassengerPage(targetId) {
      document.querySelectorAll('.p-page-view').forEach(el => el.classList.add('hidden'));
      const target = document.getElementById(targetId);
      if (target) {
        target.classList.remove('hidden');
      }

      // Determine active branch for bottom navigation
      let currentBranch = 'profile';
      if (targetId.startsWith('p-screen-home')) currentBranch = 'home';
      else if (targetId.includes('activity') || targetId.includes('trip-detail')) currentBranch = 'activity';
      else if (targetId.includes('chat')) currentBranch = 'chat';
      else if (targetId.includes('safety') || targetId.includes('incident') || targetId.includes('contacts')) currentBranch = 'safety';
      else currentBranch = 'profile';

      updatePassengerNavUI(currentBranch);

      if (targetId === 'p-screen-home') {
        setTimeout(() => { if (pMap) pMap.resize(); }, 60);
      }
      if (window.lucide) lucide.createIcons();
    }

    function switchPassengerTab(tabName) {
      const map = {
        'home': 'p-screen-home',
        'activity': 'p-screen-activity',
        'chat': 'p-screen-chat',
        'safety': 'p-screen-safety',
        'profile': 'p-screen-profile'
      };
      const targetId = map[tabName] || 'p-screen-home';
      pNavStack = [targetId];
      showPassengerPage(targetId);
    }

    function updatePassengerNavUI(branch) {
      document.querySelectorAll('.p-tab-btn').forEach(b => {
        b.className = 'p-tab-btn flex flex-col items-center gap-0.5 text-slate-400 hover:text-[#123D32] font-semibold transition';
      });
      const activeTab = document.getElementById('p-tab-' + branch);
      if (activeTab) {
        activeTab.className = 'p-tab-btn flex flex-col items-center gap-0.5 text-[#123D32] font-black transition';
      }

      ['home', 'activity', 'chat', 'safety', 'profile'].forEach(t => {
        const pill = document.getElementById('pill-p-' + t);
        if (pill) {
          if (t === branch) {
            pill.className = 'px-2.5 py-1 rounded-lg font-bold bg-[#16A572] text-[#123D32] transition';
          } else {
            pill.className = 'px-2.5 py-1 rounded-lg font-bold bg-[#17211D] text-slate-300 hover:text-white border border-[#16A572]/30 transition';
          }
        }
      });
    }

    // ==========================================
    // DRIVER NAVIGATION CONTROLLER
    // ==========================================
    function navigateToDriver(targetId) {
      dNavStack.push(targetId);
      showDriverPage(targetId);
      logEvent('DRIVER', 'Navegou para: ' + targetId.replace('d-', ''));
    }

    function goBackDriver() {
      if (dNavStack.length > 1) {
        dNavStack.pop();
        const prev = dNavStack[dNavStack.length - 1];
        showDriverPage(prev);
        logEvent('DRIVER', 'Retornou para: ' + prev.replace('d-', ''));
      }
    }

    function showDriverPage(targetId) {
      document.querySelectorAll('.d-page-view').forEach(el => el.classList.add('hidden'));
      const target = document.getElementById(targetId);
      if (target) {
        target.classList.remove('hidden');
      }

      let currentBranch = 'profile';
      if (targetId.startsWith('d-screen-nav')) currentBranch = 'nav';
      else if (targetId.includes('earnings') || targetId.includes('statement')) currentBranch = 'earnings';
      else if (targetId.includes('docs') || targetId.includes('upload-doc')) currentBranch = 'docs';
      else if (targetId.includes('vehicle') || targetId.includes('inspections')) currentBranch = 'vehicle';
      else currentBranch = 'profile';

      updateDriverNavUI(currentBranch);

      if (targetId === 'd-screen-nav') {
        setTimeout(() => { if (dMap) dMap.resize(); }, 60);
      }
      if (window.lucide) lucide.createIcons();
    }

    function switchDriverTab(tabName) {
      const map = {
        'nav': 'd-screen-nav',
        'earnings': 'd-screen-earnings',
        'docs': 'd-screen-docs',
        'vehicle': 'd-screen-vehicle',
        'profile': 'd-screen-profile'
      };
      const targetId = map[tabName] || 'd-screen-nav';
      dNavStack = [targetId];
      showDriverPage(targetId);
    }

    function updateDriverNavUI(branch) {
      document.querySelectorAll('.d-tab-btn').forEach(b => {
        b.className = 'd-tab-btn flex flex-col items-center gap-0.5 text-slate-400 hover:text-white font-semibold transition';
      });
      const activeTab = document.getElementById('d-tab-' + branch);
      if (activeTab) {
        activeTab.className = 'd-tab-btn flex flex-col items-center gap-0.5 text-[#FFCC45] font-black transition';
      }

      ['nav', 'earnings', 'docs', 'vehicle', 'profile'].forEach(t => {
        const pill = document.getElementById('pill-d-' + t);
        if (pill) {
          if (t === branch) {
            pill.className = 'px-2.5 py-1 rounded-lg font-bold bg-[#FFCC45] text-[#123D32] transition';
          } else {
            pill.className = 'px-2.5 py-1 rounded-lg font-bold bg-[#17211D] text-slate-300 hover:text-white border border-[#16A572]/30 transition';
          }
        }
      });
    }

    // ==========================================
    // BACKEND INTEGRATION & INTERACTIVE HANDLERS
    // ==========================================
    function filterPassengerTrips(filter) {
      ['all', 'completed', 'cancelled'].forEach(f => {
        const btn = document.getElementById('p-trip-filter-' + f);
        if (btn) {
          if (f === filter) {
            btn.className = 'flex-1 py-1.5 rounded-lg bg-[#123D32] text-[#FFCC45] font-black transition';
          } else {
            btn.className = 'flex-1 py-1.5 rounded-lg text-slate-600 hover:text-[#123D32] font-semibold transition';
          }
        }
      });

      document.querySelectorAll('.p-trip-card').forEach(card => {
        if (filter === 'all' || card.getAttribute('data-status') === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    }

    function openPassengerTripDetails(tripId) {
      navigateToPassenger('p-subpage-trip-details');
    }

    function shareTripLinkModal() {
      const link = 'https://simbora.app/track/tr_piacabucu_penedo_4821';
      prompt('Link temporário seguro gerado para compartilhamento com familiares:', link);
      logEvent('SECURITY', 'Link seguro de compartilhamento de viagem gerado.');
    }

    function addPassengerSafetyContact() {
      const nameInput = document.getElementById('p-input-contact-name');
      const phoneInput = document.getElementById('p-input-contact-phone');
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();
      if (!name || !phone) {
        alert('Por favor, informe o nome e o telefone do contato.');
        return;
      }
      const list = document.getElementById('p-contacts-list');
      const item = document.createElement('div');
      item.className = 'flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200';
      item.innerHTML = \`
        <div>
          <p class="font-bold text-slate-800">\${name}</p>
          <p class="text-[10px] text-slate-500">\${phone}</p>
        </div>
        <span class="text-[10px] font-bold text-[#16A572] bg-[#16A572]/10 px-2 py-0.5 rounded">Ativo</span>
      \`;
      list.appendChild(item);
      nameInput.value = '';
      phoneInput.value = '';
      logEvent('SECURITY', 'Contato de confiança salvo: ' + name);
      alert('Contato de confiança adicionado com sucesso!');
    }

    function submitIncidentReport(e) {
      e.preventDefault();
      const type = document.getElementById('p-incident-type').value;
      const desc = document.getElementById('p-incident-desc').value;
      const protocol = 'INC-2026-0' + Math.floor(100 + Math.random() * 900);
      alert('Ocorrência registrada com sucesso!\\nProtocolo: ' + protocol + '\\nA Central de Segurança SIMBORA entrará em contato.');
      logEvent('SECURITY', 'Ocorrência registrada: [' + protocol + '] Tipo: ' + type);
      goBackPassenger();
    }

    function savePassengerPersonalData(e) {
      e.preventDefault();
      const name = document.getElementById('p-input-name').value;
      const email = document.getElementById('p-input-email').value;
      const phone = document.getElementById('p-input-phone').value;

      document.getElementById('p-profile-display-name').innerText = name;
      document.getElementById('p-profile-display-email').innerText = email;
      document.getElementById('p-profile-display-phone').innerText = '✓ ' + phone;

      // Persist to backend API if reachable
      fetch('http://localhost:3001/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone })
      }).catch(() => {});

      logEvent('PASSENGER', 'Dados cadastrais atualizados: ' + name);
      alert('Dados pessoais atualizados com sucesso!');
      goBackPassenger();
    }

    function addPassengerSavedPlace() {
      const label = document.getElementById('p-input-place-label').value.trim();
      const address = document.getElementById('p-input-place-address').value.trim();
      if (!label || !address) {
        alert('Informe o rótulo e o endereço.');
        return;
      }
      const container = document.getElementById('p-saved-places-container');
      const item = document.createElement('div');
      item.className = 'flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200';
      item.innerHTML = \`
        <div class="flex items-center gap-2.5">
          <span class="text-lg">📍</span>
          <div>
            <p class="font-bold text-slate-800">\${label}</p>
            <p class="text-[10px] text-slate-500">\${address}</p>
          </div>
        </div>
        <span class="text-[10px] font-bold text-[#16A572]">Salvo</span>
      \`;
      container.appendChild(item);
      document.getElementById('p-input-place-label').value = '';
      document.getElementById('p-input-place-address').value = '';

      fetch('http://localhost:3001/users/me/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, address, latitude: -10.4056, longitude: -36.4344 })
      }).catch(() => {});

      logEvent('PASSENGER', 'Novo lugar salvo adicionado: ' + label);
      alert('Endereço adicionado aos Lugares Salvos!');
    }

    function topUpPassengerWallet(val) {
      alert('Recarga PIX de R$ ' + val + ',00 confirmada instantaneamente!');
      logEvent('PAYMENT', 'Recarga PIX na carteira: R$ ' + val + ',00');
    }

    function setPassengerPaymentMethod(methodName) {
      document.getElementById('p-selected-payment-label').innerText = methodName;
      alert('Forma de pagamento padrão alterada para: ' + methodName);
      logEvent('PASSENGER', 'Forma de pagamento alterada para: ' + methodName);
      switchPassengerTab('home');
    }

    function addPassengerCreditCard(e) {
      e.preventDefault();
      alert('Cartão de crédito homologado e adicionado com sucesso!');
      logEvent('PASSENGER', 'Novo cartão de crédito cadastrado com sucesso.');
      goBackPassenger();
    }

    function applyPassengerCoupon() {
      const code = document.getElementById('p-input-coupon-code').value.trim().toUpperCase();
      if (code === 'SIMBORA10' || code === 'PENEDO20') {
        alert('Cupom ' + code + ' aplicado com sucesso! Desconto aplicado na sua corrida.');
        logEvent('PAYMENT', 'Cupom promocional ativado: ' + code);
        document.getElementById('p-fare-comfort').innerText = 'R$ 54,40';
        document.getElementById('p-btn-request-ride').innerHTML = '<span>SOLICITAR SIMBORA (R$ 54,40 COM DESCONTO)</span>';
        switchPassengerTab('home');
      } else {
        alert('Cupom inválido ou expirado. Tente SIMBORA10 ou PENEDO20.');
      }
    }

    function copyReferralCode() {
      alert('Código MARINA82 copiado! Compartilhe e ganhe R$ 15.');
      logEvent('PASSENGER', 'Código de indicação copiado.');
    }

    function passengerLogoutPrompt() {
      if (confirm('Deseja realmente sair da sua conta SIMBORA?')) {
        alert('Sessão encerrada com segurança. Você foi desconectado.');
        logEvent('AUTH', 'Passageiro efetuou logout seguro.');
        switchPassengerTab('home');
      }
    }

    function passengerDeleteAccountPrompt() {
      if (confirm('ATENÇÃO (LGPD): Deseja solicitar a exclusão de todos os seus dados e conta no SIMBORA?')) {
        fetch('http://localhost:3001/users/me', { method: 'DELETE' }).catch(() => {});
        alert('Solicitação de exclusão processada conforme o Art. 18 da LGPD.');
        logEvent('SECURITY', 'Conta do passageiro desativada (LGPD).');
      }
    }

    function submitDriverDocument(e) {
      e.preventDefault();
      const type = document.getElementById('d-doc-type').value;
      alert('Documento enviado com sucesso! Status: EM ANÁLISE.');
      logEvent('DRIVER', 'Documento submetido para vistoria técnica: ' + type);
      goBackDriver();
    }

    function saveDriverVehicleData(e) {
      e.preventDefault();
      alert('Dados do veículo atualizados com sucesso!');
      logEvent('DRIVER', 'Dados cadastrais do veículo atualizados.');
      goBackDriver();
    }

    function submitVehicleChangeRequest(e) {
      e.preventDefault();
      alert('Solicitação de troca de veículo enviada para vistoria SIMBORA.');
      logEvent('DRIVER', 'Nova solicitação de veículo enviada.');
      goBackDriver();
    }

    function saveDriverPersonalData(e) {
      e.preventDefault();
      alert('Dados do motorista parceiro salvos com sucesso!');
      logEvent('DRIVER', 'Dados pessoais do motorista atualizados.');
      goBackDriver();
    }

    function driverLogoutPrompt() {
      if (confirm('Deseja realmente sair e ficar Offline?')) {
        const btn = document.getElementById('btn-driver-toggle');
        const title = document.getElementById('d-online-status-title');
        const indicator = document.getElementById('d-status-indicator');
        btn.innerText = 'Ficar Online';
        btn.className = 'px-3.5 py-1.5 bg-[#16A572] hover:bg-[#139063] text-[#123D32] rounded-xl text-xs font-black transition';
        title.innerText = 'Você está Offline';
        title.className = 'font-black text-sm text-slate-400';
        indicator.className = 'w-3.5 h-3.5 rounded-full bg-slate-500';
        alert('Você ficou Offline e a sessão foi encerrada.');
        logEvent('AUTH', 'Motorista ficou Offline e encerrou sessão.');
        switchDriverTab('nav');
      }
    }

    // Load backend official terms & privacy dynamically
    async function loadBackendTermsAndPrivacy() {
      try {
        const termsRes = await fetch('http://localhost:3001/auth/terms');
        if (termsRes.ok) {
          const terms = await termsRes.json();
          const el = document.getElementById('p-terms-content');
          if (el && terms.sections) {
            let h = '<h4 class="font-black text-[#123D32]">' + terms.title + ' (v' + terms.version + ')</h4>';
            h += '<p class="text-[11px] text-slate-500 mb-2">' + terms.jurisdiction + '</p>';
            terms.sections.forEach(s => {
              h += '<p><b>' + s.title + ':</b> ' + s.content + '</p>';
            });
            el.innerHTML = h;
          }
        }
      } catch (err) {}
    }
    setTimeout(loadBackendTermsAndPrivacy, 1000);
  </script>
`;

// Insert the script right before </body>
const bodyEndMarker = '</body>';
const lastBodyIdx = html.lastIndexOf(bodyEndMarker);
if (lastBodyIdx !== -1) {
  html = html.substring(0, lastBodyIdx) + navigationControllerScript + '\n' + html.substring(lastBodyIdx);
  console.log('✅ Scripts de navegação empilhada e handlers injetados!');
}

fs.writeFileSync(targetFile, html, 'utf8');
fs.writeFileSync(brainFile, html, 'utf8');
console.log('🎉 SUCESSO! Todas as páginas e subpáginas dos 5 ícones foram implementadas e gravadas!');
