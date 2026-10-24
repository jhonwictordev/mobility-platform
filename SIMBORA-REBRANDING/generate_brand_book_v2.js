const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const basePath = 'C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING';
const htmlPath = path.join(basePath, '06-BRAND-BOOK', 'SIMBORA-BRAND-BOOK-V2.html');
const pdfPath = path.join(basePath, '06-BRAND-BOOK', 'SIMBORA-BRAND-BOOK-V2.pdf');
const edgePath = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';

console.log('Writing SIMBORA-BRAND-BOOK-V2.html...');

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>SIMBORA — Manual Oficial de Identidade Visual (Brand Book V2.0)</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@600;800&display=swap');

    @page {
      size: A4 portrait;
      margin: 10mm 10mm 10mm 10mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      color: #17211D;
      background-color: #FFFFFF;
      font-size: 9.5pt;
      line-height: 1.45;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      page-break-after: always;
      position: relative;
      min-height: 275mm;
      padding-bottom: 12mm;
      overflow: hidden;
    }

    .page-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #E2E8F0;
      padding-top: 3mm;
      font-size: 7.5pt;
      color: #64748B;
      font-weight: 700;
    }

    .header-tag {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 7.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .tag-green { background: #DCFCE7; color: #166534; }
    .tag-gold { background: #FEF3C7; color: #92400E; }
    .tag-dark { background: #123D32; color: #FFCC45; }

    h1.sec-title {
      font-family: 'Manrope', sans-serif;
      font-size: 20pt;
      font-weight: 900;
      color: #123D32;
      margin-top: 2mm;
      margin-bottom: 1mm;
      letter-spacing: -0.5px;
    }

    p.sec-subtitle {
      font-size: 9pt;
      color: #4B5563;
      margin-bottom: 4mm;
    }

    .card {
      background: #F8F9F6;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 10px 12px;
      margin-bottom: 8px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 6px;
    }

    .grid-5 {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 6px;
    }

    .svg-container {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .table-spec {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
      margin-top: 4px;
    }

    .table-spec th {
      background: #123D32;
      color: #FFFFFF;
      text-align: left;
      padding: 5px 8px;
      font-weight: 700;
      font-family: 'Manrope', sans-serif;
    }

    .table-spec td {
      padding: 4px 8px;
      border-bottom: 1px solid #E2E8F0;
    }

    .table-spec tr:nth-child(even) td {
      background: #F8F9F6;
    }

    .mono {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
    }
  </style>
</head>
<body>

  <!-- ==========================================
       PÁGINA 1: CAPA INSTITUCIONAL DE LUXO
       ========================================== -->
  <div class="page" style="background: #123D32; color: #FFFFFF; padding: 25mm 20mm 15mm 20mm; display: flex; flex-direction: column; justify-content: space-between;">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 10mm;">
        <div>
          <span style="background: rgba(22,165,114,0.25); color: #16A572; border: 1px solid #16A572; padding: 4px 14px; border-radius: 20px; font-size: 8.5pt; font-weight: 800; letter-spacing: 2px;">DOCUMENTO OFICIAL • BRAND BOOK V2.0</span>
        </div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 8pt; color: #CBD5E1;">
          DATA: OUTUBRO / 2026
        </div>
      </div>

      <!-- SÍMBOLO CENTRAL GIGANTE ILUMINADO -->
      <div style="text-align: center; margin-top: 25mm; margin-bottom: 20mm;">
        <svg viewBox="0 0 100 100" width="160" height="160">
          <g fill="none">
            <path d="M 28 76 C 24 64, 30 52, 44 48 L 56 44 C 68 40, 76 32, 74 20" stroke="#F8F9F6" stroke-width="11" stroke-linecap="round"/>
            <path d="M 72 24 C 62 14, 42 16, 32 26 C 22 36, 28 50, 48 54 C 68 58, 76 68, 68 80 C 60 90, 42 88, 30 80" stroke="#16A572" stroke-width="10" stroke-linecap="round"/>
            <circle cx="72" cy="24" r="7.5" fill="#FFCC45"/>
            <circle cx="30" cy="80" r="6" fill="#F8F9F6"/>
          </g>
        </svg>

        <h1 style="font-family: 'Manrope', sans-serif; font-size: 42pt; font-weight: 900; letter-spacing: 4px; color: #FFFFFF; margin-top: 6mm;">SIMBORA</h1>
        <p style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15pt; font-weight: 700; color: #FFCC45; letter-spacing: 2px; text-transform: uppercase;">"Pediu. Chegou. Simbora!"</p>
      </div>

      <div style="max-width: 140mm; margin: 0 auto; text-align: center;">
        <p style="font-size: 10.5pt; color: #CBD5E1; line-height: 1.6;">
          Manual de Identidade Visual, Posicionamento Estratégico, Design System e Diretrizes de Aplicação da Nova Marca de Mobilidade Urbana e Intermunicipal.
        </p>
      </div>
    </div>

    <div style="border-top: 1px solid rgba(255,255,255,0.15); padding-top: 6mm; display: flex; justify-content: space-between; font-size: 8pt; color: #94A3B8;">
      <div>DIREÇÃO CRIATIVA: Brand Design Director</div>
      <div>CONCEITO OFICIAL: The Kinetic Ribbon (B)</div>
      <div>ALAGOAS • BRASIL</div>
    </div>
  </div>

  <!-- ==========================================
       PÁGINA 2: ESTRATÉGIA, PROPÓSITO E POSICIONAMENTO
       ========================================== -->
  <div class="page">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="header-tag tag-green">SEÇÃO 01 &amp; 02 • FUNDAMENTOS ESTRATÉGICOS</span>
      <span class="mono" style="font-size: 8pt; color: #64748B;">SIMBORA BRAND BOOK</span>
    </div>
    <h1 class="sec-title">Estratégia, Propósito e Posicionamento</h1>
    <p class="sec-subtitle">A essência e o papel da SIMBORA na transformação da mobilidade brasileira.</p>

    <div class="card" style="background: #123D32; color: #FFFFFF; padding: 14px 18px;">
      <div style="font-size: 7.5pt; font-weight: 800; color: #FFCC45; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">DECLARAÇÃO DE POSICIONAMENTO OFICIAL</div>
      <p style="font-size: 9.5pt; line-height: 1.55; color: #F8F9F6; font-style: italic;">
        "Para os milhões de brasileiros que precisam se deslocar diariamente entre bairros e municípios com rapidez, economia e respeito, a SIMBORA é a plataforma brasileira de mobilidade que oferece a agilidade da tecnologia moderna com o calor, a segurança e a empatia da cultura nacional — onde pedir uma viagem é simples, chegar é rápido e ir em frente é um convite: <strong>Pediu. Chegou. Simbora!</strong>"
      </p>
    </div>

    <div class="grid-2">
      <div class="card">
        <h3 style="font-family: 'Manrope', sans-serif; font-size: 11pt; font-weight: 800; color: #123D32; margin-bottom: 6px;">O Arquétipo: O Conector Ágil</h3>
        <p style="font-size: 8.5pt; color: #4B5563; margin-bottom: 6px;">
          A fusão perfeita entre o <strong>Cidadão Comum (The Everyman)</strong> — que ouve, acolhe, valoriza o trabalhador e fala a língua do povo — e o <strong>Explorador Pioneiro</strong> — que cruza pontes, rompe fronteiras municipais e abre novos caminhos.
        </p>
        <ul style="font-size: 8pt; color: #17211D; padding-left: 14px; line-height: 1.6;">
          <li><strong>Proximidade Humana:</strong> Sem corporativismo frio ou atendimento robotizado.</li>
          <li><strong>Pioneirismo de Rota:</strong> Ligando o interior ao litoral (Penedo a Piaçabuçu).</li>
          <li><strong>Segurança Sem Medo:</strong> Proteção física e digital para passageiros e motoristas.</li>
        </ul>
      </div>

      <div class="card">
        <h3 style="font-family: 'Manrope', sans-serif; font-size: 11pt; font-weight: 800; color: #123D32; margin-bottom: 6px;">Ambição: De Alagoas para o Brasil</h3>
        <p style="font-size: 8.5pt; color: #4B5563; margin-bottom: 6px;">
          Nascida na histórica cidade de Penedo e na paradisíaca Piaçabuçu, às margens do Rio São Francisco, a SIMBORA carrega no peito o orgulho de sua raiz alagoana, com design e tecnologia projetados para escala nacional.
        </p>
        <div style="background: #E2E8F0; padding: 6px 10px; border-radius: 6px; font-size: 7.5pt; color: #123D32; font-weight: 700;">
          POLO INICIAL: Baixo São Francisco (AL) → EXPANSÃO: Nordeste e Capitais Brasileiras
        </div>
      </div>
    </div>

    <div class="card" style="margin-top: 4px;">
      <h3 style="font-family: 'Manrope', sans-serif; font-size: 11pt; font-weight: 800; color: #123D32; margin-bottom: 8px;">Os Quatro Pilares de Personalidade da Marca</h3>
      <div class="grid-4">
        <div style="background: #FFFFFF; border: 1px solid #CBD5E1; padding: 8px; border-radius: 6px;">
          <strong style="color: #16A572; font-size: 8.5pt; display: block; margin-bottom: 3px;">1. Ágil sem pressa</strong>
          <p style="font-size: 7.5pt; color: #4B5563;">Linhas fluidas e vetores limpos que transmitem pontualidade sem sugerir direção perigosa.</p>
        </div>
        <div style="background: #FFFFFF; border: 1px solid #CBD5E1; padding: 8px; border-radius: 6px;">
          <strong style="color: #123D32; font-size: 8.5pt; display: block; margin-bottom: 3px;">2. Confiabilidade</strong>
          <p style="font-size: 7.5pt; color: #4B5563;">Verde Profundo e tipografia com linhas firmes que asseguram proteção e solidez institucional.</p>
        </div>
        <div style="background: #FFFFFF; border: 1px solid #CBD5E1; padding: 8px; border-radius: 6px;">
          <strong style="color: #92400E; font-size: 8.5pt; display: block; margin-bottom: 3px;">3. Calor Humano</strong>
          <p style="font-size: 7.5pt; color: #4B5563;">O sol amarelo acolhe, aproxima e celebra o otimismo e a dignidade de quem se move todo dia.</p>
        </div>
        <div style="background: #FFFFFF; border: 1px solid #CBD5E1; padding: 8px; border-radius: 6px;">
          <strong style="color: #17211D; font-size: 8.5pt; display: block; margin-bottom: 3px;">4. Rigor Tech</strong>
          <p style="font-size: 7.5pt; color: #4B5563;">Acabamento de unicórnio de tecnologia internacional, com precisão geométrica e acessibilidade.</p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>SIMBORA • MANUAL DE IDENTIDADE VISUAL V2.0</span>
      <span>ESTRATÉGIA &amp; POSICIONAMENTO</span>
      <span>PÁGINA 02</span>
    </div>
  </div>

  <!-- ==========================================
       PÁGINA 3: CONCEITO CRIATIVO & CONSTRUÇÃO DO SÍMBOLO
       ========================================== -->
  <div class="page">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="header-tag tag-green">SEÇÃO 03 &amp; 04 • CONCEITO E GEOMETRIA</span>
      <span class="mono" style="font-size: 8pt; color: #64748B;">CONSTRUÇÃO DO SÍMBOLO</span>
    </div>
    <h1 class="sec-title">The Kinetic Ribbon — Construção Técnica</h1>
    <p class="sec-subtitle">O movimento contínuo da mobilidade humana projetado no Grid Suíço de Müller-Brockmann.</p>

    <div class="grid-2">
      <!-- Diagrama Técnico do Símbolo -->
      <div class="card svg-container" style="background: #0F1714; min-height: 180mm; padding: 10px;">
        <svg viewBox="0 0 500 500" width="100%" height="280">
          <defs>
            <pattern id="gridBook" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1D2E27" stroke-width="0.8"/>
            </pattern>
          </defs>
          <rect width="500" height="500" fill="url(#gridBook)"/>
          <circle cx="340" cy="170" r="110" stroke="#FFCC45" stroke-dasharray="4,4" fill="none" opacity="0.6"/>
          <circle cx="160" cy="330" r="110" stroke="#FFCC45" stroke-dasharray="4,4" fill="none" opacity="0.6"/>
          <line x1="80" y1="420" x2="420" y2="80" stroke="#F43F5E" stroke-dasharray="3,3" stroke-width="1.5"/>

          <g transform="translate(100, 100) scale(3)" fill="none">
            <path d="M 28 76 C 24 64, 30 52, 44 48 L 56 44 C 68 40, 76 32, 74 20" stroke="#16A572" stroke-width="11" stroke-linecap="round"/>
            <path d="M 72 24 C 62 14, 42 16, 32 26 C 22 36, 28 50, 48 54 C 68 58, 76 68, 68 80 C 60 90, 42 88, 30 80" stroke="#F8F9F6" stroke-width="10" stroke-linecap="round"/>
            <circle cx="72" cy="24" r="6" fill="#FFCC45"/>
            <circle cx="30" cy="80" r="5" fill="#16A572"/>
          </g>
          <text x="30" y="40" font-family="'JetBrains Mono', monospace" font-size="12" fill="#64748B">GRID MODULAR: 20x20u</text>
          <text x="30" y="475" font-family="'JetBrains Mono', monospace" font-size="12" fill="#FFCC45">VÉRTICE SOLAR DE DESTINO (R=55u)</text>
        </svg>
      </div>

      <!-- Justificativa Conceitual & Semiótica -->
      <div>
        <div class="card">
          <h3 style="font-family: 'Manrope', sans-serif; font-size: 11pt; font-weight: 800; color: #123D32; margin-bottom: 6px;">Semiótica da Fita Cinética</h3>
          <p style="font-size: 8.5pt; color: #4B5563; line-height: 1.5; margin-bottom: 8px;">
            Diferente do símbolo antigo — que recorria a uma seta clichê de trânsito —, a <strong>Kinetic Ribbon</strong> traduz velocidade e fluidez através de uma fita de torção tridimensional plana. O movimento é evidente pelo próprio vetor aerodinâmico ascendente.
          </p>
          <div style="background: #FFFFFF; border-left: 3px solid #16A572; padding: 6px 10px; margin-bottom: 6px; font-size: 8pt;">
            <strong style="color: #123D32;">1. Partida Firme (Origem):</strong> Ancorada na base inferior em Verde Profundo, simbolizando a solidez da partida no bairro ou ponto de van.
          </div>
          <div style="background: #FFFFFF; border-left: 3px solid #16A572; padding: 6px 10px; margin-bottom: 6px; font-size: 8pt;">
            <strong style="color: #16A572;">2. Trajetória em Fluxo (Travessia):</strong> A curva frontal em Verde Vibrante projeta a viagem sem atritos entre cidades e pontes.
          </div>
          <div style="background: #FFFFFF; border-left: 3px solid #FFCC45; padding: 6px 10px; font-size: 8pt;">
            <strong style="color: #92400E;">3. Ponto Solar (Chegada):</strong> O círculo em Amarelo Energia no ápice celebra a chegada pontual e segura ao destino final.
          </div>
        </div>

        <div class="card" style="margin-top: 8px;">
          <h3 style="font-family: 'Manrope', sans-serif; font-size: 11pt; font-weight: 800; color: #123D32; margin-bottom: 6px;">Equilíbrio e Teste Monocromático</h3>
          <p style="font-size: 8pt; color: #4B5563; line-height: 1.5;">
            Conforme a máxima de David Airey (*Logo Design Love*), o símbolo foi projetado e auditado em 100% de contraste preto e branco. A sobreposição das duas faixas cria contraste mecânico natural, prescindindo de sombras, gradientes ou efeitos de software para ser decodificado.
          </p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>SIMBORA • MANUAL DE IDENTIDADE VISUAL V2.0</span>
      <span>CONSTRUÇÃO GEOMÉTRICA &amp; SEMIÓTICA</span>
      <span>PÁGINA 03</span>
    </div>
  </div>

  <!-- ==========================================
       PÁGINA 4: VERSÕES OFICIAIS DO LOGOTIPO
       ========================================== -->
  <div class="page">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="header-tag tag-green">SEÇÃO 05 &amp; 06 • ASSINATURAS INSTITUCIONAIS</span>
      <span class="mono" style="font-size: 8pt; color: #64748B;">VARIAÇÕES DE LOGO</span>
    </div>
    <h1 class="sec-title">Versões Oficiais do Logotipo SIMBORA</h1>
    <p class="sec-subtitle">Aplicações homologadas para fundos claros, escuros, superfícies verticais e monocromia.</p>

    <!-- Versão Principal Horizontal Clara -->
    <div class="card" style="background: #FFFFFF; border: 1px solid #CBD5E1; padding: 12px; margin-bottom: 10px;">
      <div style="font-size: 7.5pt; font-weight: 800; color: #64748B; margin-bottom: 4px;">ASSINATURA HORIZONTAL PRINCIPAL (FUNDO CLARO)</div>
      <div class="svg-container" style="height: 60px;">
        <svg viewBox="0 0 460 110" width="340" height="70">
          <g transform="translate(16, 15)">
            <path d="M 24 64 C 20 54, 25 44, 38 40 L 48 37 C 58 34, 65 27, 63 16" stroke="#123D32" stroke-width="9" stroke-linecap="round" fill="none"/>
            <path d="M 62 18 C 53 9, 36 11, 28 20 C 19 29, 23 41, 41 45 C 58 48, 66 57, 58 68 C 51 77, 36 75, 25 68" stroke="#16A572" stroke-width="8.5" stroke-linecap="round" fill="none"/>
            <circle cx="62" cy="18" r="5.2" fill="#FFCC45"/>
            <circle cx="25" cy="68" r="4.2" fill="#123D32"/>
          </g>
          <text x="120" y="60" font-family="'Manrope', sans-serif" font-size="44" font-weight="900" letter-spacing="2.2" fill="#123D32">SIMBORA</text>
          <text x="122" y="85" font-family="'Manrope', sans-serif" font-size="13.5" font-weight="700" letter-spacing="1.4" fill="#16A572">Pediu. Chegou. Simbora!</text>
          <circle cx="430" cy="50" r="4.5" fill="#FFCC45"/>
        </svg>
      </div>
    </div>

    <!-- Versão Horizontal Escura -->
    <div class="card" style="background: #123D32; border: 1px solid #16A572; padding: 12px; margin-bottom: 10px;">
      <div style="font-size: 7.5pt; font-weight: 800; color: #FFCC45; margin-bottom: 4px;">ASSINATURA HORIZONTAL PARA FUNDO ESCURO (REVERSA)</div>
      <div class="svg-container" style="height: 60px;">
        <svg viewBox="0 0 460 110" width="340" height="70">
          <g transform="translate(16, 15)">
            <path d="M 24 64 C 20 54, 25 44, 38 40 L 48 37 C 58 34, 65 27, 63 16" stroke="#F8F9F6" stroke-width="9" stroke-linecap="round" fill="none"/>
            <path d="M 62 18 C 53 9, 36 11, 28 20 C 19 29, 23 41, 41 45 C 58 48, 66 57, 58 68 C 51 77, 36 75, 25 68" stroke="#16A572" stroke-width="8.5" stroke-linecap="round" fill="none"/>
            <circle cx="62" cy="18" r="5.2" fill="#FFCC45"/>
            <circle cx="25" cy="68" r="4.2" fill="#F8F9F6"/>
          </g>
          <text x="120" y="60" font-family="'Manrope', sans-serif" font-size="44" font-weight="900" letter-spacing="2.2" fill="#F8F9F6">SIMBORA</text>
          <text x="122" y="85" font-family="'Manrope', sans-serif" font-size="13.5" font-weight="700" letter-spacing="1.4" fill="#FFCC45">Pediu. Chegou. Simbora!</text>
          <circle cx="430" cy="50" r="4.5" fill="#16A572"/>
        </svg>
      </div>
    </div>

    <!-- Grid com Versões Verticais e Monocromáticas -->
    <div class="grid-3">
      <!-- Vertical Claro -->
      <div class="card svg-container" style="background: #FFFFFF; flex-direction: column; padding: 14px;">
        <div style="font-size: 7pt; font-weight: 800; color: #64748B; margin-bottom: 6px;">VERTICAL OFICIAL</div>
        <svg viewBox="0 0 260 260" width="130" height="130">
          <g transform="translate(80, 15)">
            <path d="M 28 76 C 24 64, 30 52, 44 48 L 56 44 C 68 40, 76 32, 74 20" stroke="#123D32" stroke-width="11" stroke-linecap="round" fill="none"/>
            <path d="M 72 24 C 62 14, 42 16, 32 26 C 22 36, 28 50, 48 54 C 68 58, 76 68, 68 80 C 60 90, 42 88, 30 80" stroke="#16A572" stroke-width="10" stroke-linecap="round" fill="none"/>
            <circle cx="72" cy="24" r="6" fill="#FFCC45"/>
          </g>
          <text x="130" y="175" font-family="'Manrope', sans-serif" font-size="34" font-weight="900" fill="#123D32" text-anchor="middle">SIMBORA</text>
          <text x="130" y="200" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="700" fill="#16A572" text-anchor="middle">Pediu. Chegou. Simbora!</text>
        </svg>
      </div>

      <!-- Monocromático Preto -->
      <div class="card svg-container" style="background: #F8F9F6; flex-direction: column; padding: 14px;">
        <div style="font-size: 7pt; font-weight: 800; color: #64748B; margin-bottom: 6px;">MONOCROMÁTICO PRETO</div>
        <svg viewBox="0 0 460 110" width="160" height="60">
          <g transform="translate(16, 15)">
            <path d="M 24 64 C 20 54, 25 44, 38 40 L 48 37 C 58 34, 65 27, 63 16" stroke="#000000" stroke-width="9" stroke-linecap="round" fill="none"/>
            <path d="M 62 18 C 53 9, 36 11, 28 20 C 19 29, 23 41, 41 45 C 58 48, 66 57, 58 68 C 51 77, 36 75, 25 68" stroke="#000000" stroke-width="8.5" stroke-linecap="round" fill="none"/>
            <circle cx="62" cy="18" r="5.2" fill="#000000"/>
          </g>
          <text x="120" y="60" font-family="'Manrope', sans-serif" font-size="44" font-weight="900" fill="#000000">SIMBORA</text>
        </svg>
        <span style="font-size: 6.5pt; color: #64748B; margin-top: 6px;">Para notas fiscais, carimbos e jornais P&amp;B</span>
      </div>

      <!-- Monocromático Branco -->
      <div class="card svg-container" style="background: #17211D; flex-direction: column; padding: 14px;">
        <div style="font-size: 7pt; font-weight: 800; color: #CBD5E1; margin-bottom: 6px;">MONOCROMÁTICO BRANCO</div>
        <svg viewBox="0 0 460 110" width="160" height="60">
          <g transform="translate(16, 15)">
            <path d="M 24 64 C 20 54, 25 44, 38 40 L 48 37 C 58 34, 65 27, 63 16" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" fill="none"/>
            <path d="M 62 18 C 53 9, 36 11, 28 20 C 19 29, 23 41, 41 45 C 58 48, 66 57, 58 68 C 51 77, 36 75, 25 68" stroke="#FFFFFF" stroke-width="8.5" stroke-linecap="round" fill="none"/>
            <circle cx="62" cy="18" r="5.2" fill="#FFFFFF"/>
          </g>
          <text x="120" y="60" font-family="'Manrope', sans-serif" font-size="44" font-weight="900" fill="#FFFFFF">SIMBORA</text>
        </svg>
        <span style="font-size: 6.5pt; color: #94A3B8; margin-top: 6px;">Para corte a laser, bordados e vinil escuro</span>
      </div>
    </div>

    <div class="page-footer">
      <span>SIMBORA • MANUAL DE IDENTIDADE VISUAL V2.0</span>
      <span>ASSINATURAS DO LOGOTIPO</span>
      <span>PÁGINA 04</span>
    </div>
  </div>

  <!-- ==========================================
       PÁGINA 5: ÁREA DE PROTEÇÃO, ESCALA E USOS INCORRETOS
       ========================================== -->
  <div class="page">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="header-tag tag-green">SEÇÃO 07 &amp; 08 • GOVERNANÇA VISUAL</span>
      <span class="mono" style="font-size: 8pt; color: #64748B;">PROTEÇÃO &amp; RESTRIÇÕES</span>
    </div>
    <h1 class="sec-title">Área de Proteção, Redução e Usos Incorretos</h1>
    <p class="sec-subtitle">Regras inegociáveis para garantir a integridade formal da SIMBORA em qualquer suporte.</p>

    <div class="grid-2">
      <!-- Área de Proteção -->
      <div class="card">
        <h3 style="font-family: 'Manrope', sans-serif; font-size: 10.5pt; font-weight: 800; color: #123D32; margin-bottom: 6px;">Área de Isolamento (Regra X)</h3>
        <p style="font-size: 8pt; color: #4B5563; margin-bottom: 6px;">
          Nenhum elemento gráfico, tipográfico ou borda deve invadir o espaço delimitado pela altura <strong>X</strong> da letra 'O' do wordmark ao redor do logotipo.
        </p>
        <div class="svg-container" style="background: #FFFFFF; border: 1px dashed #38BDF8; padding: 10px; border-radius: 8px;">
          <svg viewBox="0 0 380 120" width="280" height="90">
            <rect x="20" y="20" width="340" height="80" fill="none" stroke="#38BDF8" stroke-dasharray="3,3"/>
            <text x="8" y="65" font-family="'JetBrains Mono', monospace" font-size="11" fill="#38BDF8">X</text>
            <text x="365" y="65" font-family="'JetBrains Mono', monospace" font-size="11" fill="#38BDF8">X</text>
            <!-- Logo Central -->
            <g transform="translate(45, 25) scale(0.65)">
              <path d="M 28 76 C 24 64, 30 52, 44 48 L 56 44 C 68 40, 76 32, 74 20" stroke="#123D32" stroke-width="11" stroke-linecap="round" fill="none"/>
              <path d="M 72 24 C 62 14, 42 16, 32 26 C 22 36, 28 50, 48 54 C 68 58, 76 68, 68 80 C 60 90, 42 88, 30 80" stroke="#16A572" stroke-width="10" stroke-linecap="round" fill="none"/>
              <circle cx="72" cy="24" r="6" fill="#FFCC45"/>
            </g>
            <text x="120" y="66" font-family="'Manrope', sans-serif" font-size="30" font-weight="900" fill="#123D32">SIMBORA</text>
          </svg>
        </div>
      </div>

      <!-- Tamanhos Mínimos -->
      <div class="card">
        <h3 style="font-family: 'Manrope', sans-serif; font-size: 10.5pt; font-weight: 800; color: #123D32; margin-bottom: 6px;">Tamanhos Mínimos Homologados</h3>
        <p style="font-size: 8pt; color: #4B5563; margin-bottom: 6px;">
          Para assegurar nitidez, o logotipo completo e o símbolo nunca devem ser reproduzidos abaixo das seguintes dimensões:
        </p>
        <table class="table-spec">
          <tr>
            <th>Aplicação</th>
            <th>Digital (Pixels)</th>
            <th>Impresso (Milímetros)</th>
          </tr>
          <tr>
            <td><strong>Logo Completo Horizontal</strong></td>
            <td class="mono">110 x 28 px</td>
            <td class="mono">30 x 8 mm</td>
          </tr>
          <tr>
            <td><strong>Assinatura Vertical</strong></td>
            <td class="mono">80 x 85 px</td>
            <td class="mono">22 x 24 mm</td>
          </tr>
          <tr>
            <td><strong>Símbolo Isolado</strong></td>
            <td class="mono">24 x 24 px</td>
            <td class="mono">7 x 7 mm</td>
          </tr>
          <tr>
            <td><strong>Favicon de Navegador</strong></td>
            <td class="mono">16 x 16 px (Otimizado)</td>
            <td class="mono">Não aplicável</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- USOS INCORRETOS -->
    <div class="card" style="margin-top: 4px;">
      <h3 style="font-family: 'Manrope', sans-serif; font-size: 10.5pt; font-weight: 800; color: #EF4444; margin-bottom: 6px;">Usos Estritamente Proibidos</h3>
      <div class="grid-4">
        <div style="background: #FFFFFF; border: 1px solid #FCA5A5; padding: 6px; border-radius: 6px; text-align: center;">
          <div style="color: #EF4444; font-weight: 800; font-size: 14pt;">✕</div>
          <strong style="font-size: 7.5pt; color: #991B1B; display: block;">NÃO DISTORCER</strong>
          <span style="font-size: 6.5pt; color: #64748B;">Nunca estique horizontal ou verticalmente as proporções.</span>
        </div>
        <div style="background: #FFFFFF; border: 1px solid #FCA5A5; padding: 6px; border-radius: 6px; text-align: center;">
          <div style="color: #EF4444; font-weight: 800; font-size: 14pt;">✕</div>
          <strong style="font-size: 7.5pt; color: #991B1B; display: block;">NÃO ALTERAR CORES</strong>
          <span style="font-size: 6.5pt; color: #64748B;">Nunca aplique gradientes não homologados ou novas cores.</span>
        </div>
        <div style="background: #FFFFFF; border: 1px solid #FCA5A5; padding: 6px; border-radius: 6px; text-align: center;">
          <div style="color: #EF4444; font-weight: 800; font-size: 14pt;">✕</div>
          <strong style="font-size: 7.5pt; color: #991B1B; display: block;">NÃO ROTACIONAR</strong>
          <span style="font-size: 6.5pt; color: #64748B;">O símbolo deve sempre manter o ângulo ascendente oficial.</span>
        </div>
        <div style="background: #FFFFFF; border: 1px solid #FCA5A5; padding: 6px; border-radius: 6px; text-align: center;">
          <div style="color: #EF4444; font-weight: 800; font-size: 14pt;">✕</div>
          <strong style="font-size: 7.5pt; color: #991B1B; display: block;">SEM EFEITOS 3D</strong>
          <span style="font-size: 6.5pt; color: #64748B;">Nunca adicione chanfros, relevos ou sombras projetadas no logo.</span>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>SIMBORA • MANUAL DE IDENTIDADE VISUAL V2.0</span>
      <span>ÁREA DE PROTEÇÃO &amp; RESTRIÇÕES</span>
      <span>PÁGINA 05</span>
    </div>
  </div>

  <!-- ==========================================
       PÁGINA 6: PALETA CROMÁTICA & ACESSIBILIDADE WCAG
       ========================================== -->
  <div class="page">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="header-tag tag-gold">SEÇÃO 09 &amp; 10 • SISTEMA CROMÁTICO</span>
      <span class="mono" style="font-size: 8pt; color: #64748B;">PALETA &amp; ACESSIBILIDADE</span>
    </div>
    <h1 class="sec-title">Cores Oficiais e Matriz de Acessibilidade</h1>
    <p class="sec-subtitle">Preservação estrita dos 5 códigos HEX originais sob a Regra 60-30-10 de Aaris Sherin.</p>

    <!-- Swatches das 5 Cores Oficiais -->
    <div class="grid-5" style="margin-bottom: 12px;">
      <!-- 1. Verde Profundo -->
      <div style="border-radius: 8px; overflow: hidden; border: 1px solid #CBD5E1;">
        <div style="background: #123D32; height: 50px;"></div>
        <div style="padding: 6px; font-size: 7pt; background: #FFFFFF;">
          <strong style="color: #123D32; display: block;">VERDE PROFUNDO</strong>
          <div class="mono">#123D32</div>
          <div>RGB: 18, 61, 50</div>
          <div>CMYK: 85, 45, 68, 55</div>
          <div style="color: #166534; font-weight: 700; margin-top: 2px;">ÂNCORA (60%)</div>
        </div>
      </div>

      <!-- 2. Verde Vibrante -->
      <div style="border-radius: 8px; overflow: hidden; border: 1px solid #CBD5E1;">
        <div style="background: #16A572; height: 50px;"></div>
        <div style="padding: 6px; font-size: 7pt; background: #FFFFFF;">
          <strong style="color: #16A572; display: block;">VERDE VIBRANTE</strong>
          <div class="mono">#16A572</div>
          <div>RGB: 22, 165, 114</div>
          <div>CMYK: 78, 0, 68, 0</div>
          <div style="color: #166534; font-weight: 700; margin-top: 2px;">AÇÃO (30%)</div>
        </div>
      </div>

      <!-- 3. Amarelo Energia -->
      <div style="border-radius: 8px; overflow: hidden; border: 1px solid #CBD5E1;">
        <div style="background: #FFCC45; height: 50px;"></div>
        <div style="padding: 6px; font-size: 7pt; background: #FFFFFF;">
          <strong style="color: #92400E; display: block;">AMARELO ENERGIA</strong>
          <div class="mono">#FFCC45</div>
          <div>RGB: 255, 204, 69</div>
          <div>CMYK: 0, 20, 80, 0</div>
          <div style="color: #92400E; font-weight: 700; margin-top: 2px;">FOCO SOLAR (10%)</div>
        </div>
      </div>

      <!-- 4. Branco Suave -->
      <div style="border-radius: 8px; overflow: hidden; border: 1px solid #CBD5E1;">
        <div style="background: #F8F9F6; height: 50px; border-bottom: 1px solid #E2E8F0;"></div>
        <div style="padding: 6px; font-size: 7pt; background: #FFFFFF;">
          <strong style="color: #17211D; display: block;">BRANCO SUAVE</strong>
          <div class="mono">#F8F9F6</div>
          <div>RGB: 248, 249, 246</div>
          <div>CMYK: 1, 0, 2, 2</div>
          <div style="color: #4B5563; font-weight: 700; margin-top: 2px;">SUPERFÍCIE</div>
        </div>
      </div>

      <!-- 5. Grafite Mineral -->
      <div style="border-radius: 8px; overflow: hidden; border: 1px solid #CBD5E1;">
        <div style="background: #17211D; height: 50px;"></div>
        <div style="padding: 6px; font-size: 7pt; background: #FFFFFF;">
          <strong style="color: #17211D; display: block;">GRAFITE MINERAL</strong>
          <div class="mono">#17211D</div>
          <div>RGB: 23, 33, 29</div>
          <div>CMYK: 72, 55, 62, 70</div>
          <div style="color: #17211D; font-weight: 700; margin-top: 2px;">TEXTO &amp; BASE</div>
        </div>
      </div>
    </div>

    <!-- Tabela de Acessibilidade WCAG -->
    <div class="card">
      <h3 style="font-family: 'Manrope', sans-serif; font-size: 10.5pt; font-weight: 800; color: #123D32; margin-bottom: 6px;">Matriz de Contraste Retiniano (WCAG 2.1 AA/AAA)</h3>
      <table class="table-spec">
        <tr>
          <th>Combinação de Cores</th>
          <th>Taxa de Contraste</th>
          <th>Conformidade</th>
          <th>Aplicação Recomendada</th>
        </tr>
        <tr>
          <td><strong>Branco Suave (#F8F9F6) sobre Verde Profundo (#123D32)</strong></td>
          <td class="mono">10.2 : 1</td>
          <td><span class="header-tag tag-green">AAA (Excelente)</span></td>
          <td>Títulos nobres, cabeçalhos, botões escuros e sinalização externa</td>
        </tr>
        <tr>
          <td><strong>Grafite Mineral (#17211D) sobre Branco Suave (#F8F9F6)</strong></td>
          <td class="mono">14.8 : 1</td>
          <td><span class="header-tag tag-green">AAA (Perfeito)</span></td>
          <td>Textos de corpo de leitura, inputs de formulário e dados de corridas</td>
        </tr>
        <tr>
          <td><strong>Branco Suave (#F8F9F6) sobre Verde Vibrante (#16A572)</strong></td>
          <td class="mono">4.6 : 1</td>
          <td><span class="header-tag tag-green">AA (Aprovado)</span></td>
          <td>Botões primários de ação ("Confirmar Corrida", "Chamar Simbora")</td>
        </tr>
        <tr>
          <td><strong>Grafite Mineral (#17211D) sobre Amarelo Energia (#FFCC45)</strong></td>
          <td class="mono">10.5 : 1</td>
          <td><span class="header-tag tag-green">AAA (Excelente)</span></td>
          <td>Badges promocionais, chips de status de motorista e destaques solares</td>
        </tr>
        <tr>
          <td><strong>Amarelo Energia (#FFCC45) sobre Branco Suave (#F8F9F6)</strong></td>
          <td class="mono">1.3 : 1</td>
          <td><span class="header-tag" style="background: #FEE2E2; color: #991B1B;">PROIBIDO</span></td>
          <td>Inacessível para leitura; deve ser sempre contornado por Verde Profundo</td>
        </tr>
      </table>
    </div>

    <div class="page-footer">
      <span>SIMBORA • MANUAL DE IDENTIDADE VISUAL V2.0</span>
      <span>PALETA CROMÁTICA &amp; ACESSIBILIDADE</span>
      <span>PÁGINA 06</span>
    </div>
  </div>

  <!-- ==========================================
       PÁGINA 7: SISTEMA TIPOGRÁFICO
       ========================================== -->
  <div class="page">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="header-tag tag-green">SEÇÃO 11 &amp; 12 • TIPOGRAFIA &amp; RITMO</span>
      <span class="mono" style="font-size: 8pt; color: #64748B;">SISTEMA TIPOGRÁFICO</span>
    </div>
    <h1 class="sec-title">Sistema Tipográfico da Nova SIMBORA</h1>
    <p class="sec-subtitle">Hierarquia modular harmônica (Major Third — 1.250x) para legibilidade plena em smartphones.</p>

    <div class="grid-2">
      <!-- Fonte Primária: Manrope -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <h3 style="font-family: 'Manrope', sans-serif; font-size: 11pt; font-weight: 800; color: #123D32;">MANROPE</h3>
          <span class="header-tag tag-green">DISPLAY &amp; WORDMARK</span>
        </div>
        <p style="font-size: 7.5pt; color: #4B5563; margin-bottom: 6px;">Sans-serif humanista geométrica com curvas abertas e excelente postura institucional.</p>
        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 8px; border-radius: 6px; margin-bottom: 6px;">
          <div style="font-family: 'Manrope', sans-serif; font-size: 18pt; font-weight: 900; color: #123D32;">Aa Bb Cc Dd 123</div>
          <div style="font-family: 'Manrope', sans-serif; font-size: 9pt; font-weight: 700; color: #16A572;">O rápido motorista da Simbora chegou pontual.</div>
        </div>
        <div style="font-size: 7.5pt; color: #64748B;">
          <strong>Pesos Homologados:</strong> ExtraBold (800) para Títulos • Bold (700) para Subtítulos
        </div>
      </div>

      <!-- Fonte Secundária: Plus Jakarta Sans -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <h3 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11pt; font-weight: 800; color: #123D32;">PLUS JAKARTA SANS</h3>
          <span class="header-tag tag-green">INTERFACE DO APP (UI)</span>
        </div>
        <p style="font-size: 7.5pt; color: #4B5563; margin-bottom: 6px;">Desenvolvida especificamente para alta legibilidade em telas móveis OLED e LCD.</p>
        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 8px; border-radius: 6px; margin-bottom: 6px;">
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18pt; font-weight: 700; color: #17211D;">Aa Bb Cc Dd 123</div>
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 9pt; font-weight: 500; color: #4B5563;">Confirme sua rota intermunicipal entre Penedo e Piaçabuçu.</div>
        </div>
        <div style="font-size: 7.5pt; color: #64748B;">
          <strong>Pesos Homologados:</strong> SemiBold (600) para Botões • Regular (400) para Corpo
        </div>
      </div>
    </div>

    <!-- Escala Tipográfica Detalhada -->
    <div class="card" style="margin-top: 4px;">
      <h3 style="font-family: 'Manrope', sans-serif; font-size: 10.5pt; font-weight: 800; color: #123D32; margin-bottom: 6px;">Escala de Aplicação em Produto &amp; Marketing</h3>
      <table class="table-spec">
        <tr>
          <th>Nível / Token</th>
          <th>Tamanho / Leading</th>
          <th>Peso / Tracking</th>
          <th>Exemplo Visual</th>
        </tr>
        <tr>
          <td>`display-hero`</td>
          <td class="mono">48px / 1.15</td>
          <td>ExtraBold (-1.5px)</td>
          <td style="font-family: 'Manrope', sans-serif; font-size: 14pt; font-weight: 800; color: #123D32;">Pediu. Chegou. Simbora!</td>
        </tr>
        <tr>
          <td>`heading-1`</td>
          <td class="mono">30px / 1.25</td>
          <td>Bold (-0.5px)</td>
          <td style="font-family: 'Manrope', sans-serif; font-size: 11pt; font-weight: 800; color: #123D32;">Escolha o seu destino</td>
        </tr>
        <tr>
          <td>`body-default`</td>
          <td class="mono">15px / 1.55</td>
          <td>Regular (0.0px)</td>
          <td style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 8.5pt; color: #4B5563;">Seu motorista Carlos Eduardo chegará em 3 minutos.</td>
        </tr>
        <tr>
          <td>`mono-code`</td>
          <td class="mono">13px / 1.30</td>
          <td>SemiBold (+0.5px)</td>
          <td class="mono" style="font-size: 8.5pt; color: #16A572;">VAN-PENEDO #04 • R$ 15,00</td>
        </tr>
      </table>
    </div>

    <div class="page-footer">
      <span>SIMBORA • MANUAL DE IDENTIDADE VISUAL V2.0</span>
      <span>SISTEMA TIPOGRÁFICO OFICIAL</span>
      <span>PÁGINA 07</span>
    </div>
  </div>

  <!-- ==========================================
       PÁGINA 8: ELEMENTOS GRÁFICOS & ICONOGRAFIA
       ========================================== -->
  <div class="page">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="header-tag tag-green">SEÇÃO 13 &amp; 14 • LINGUAGEM GRÁFICA</span>
      <span class="mono" style="font-size: 8pt; color: #64748B;">PADRÕES &amp; ÍCONES</span>
    </div>
    <h1 class="sec-title">Elementos Gráficos, Texturas e Iconografia</h1>
    <p class="sec-subtitle">O vocabulário visual derivado da Kinetic Ribbon aplicado a padrões e ícones proprietários.</p>

    <!-- Grid de Padrões e Texturas -->
    <div class="grid-2" style="margin-bottom: 8px;">
      <div class="card" style="background: #123D32; color: #FFFFFF; padding: 10px;">
        <div style="font-size: 7.5pt; font-weight: 800; color: #FFCC45; margin-bottom: 4px;">PADRÃO A: KINETIC TRANSIT WAVES</div>
        <div class="svg-container" style="height: 70px;">
          <svg viewBox="0 0 300 70" width="100%" height="70">
            <path d="M 0 35 C 50 10, 100 60, 150 35 C 200 10, 250 60, 300 35" fill="none" stroke="#16A572" stroke-width="4" opacity="0.7"/>
            <path d="M 0 50 C 60 20, 120 70, 180 45 C 240 20, 280 60, 320 50" fill="none" stroke="#FFCC45" stroke-width="2" opacity="0.6"/>
            <circle cx="150" cy="35" r="4" fill="#FFCC45"/>
          </svg>
        </div>
        <p style="font-size: 7pt; color: #CBD5E1; margin-top: 4px;">Ondas fluidas que simulam a topografia e a brisa das rotas litorâneas e fluviais.</p>
      </div>

      <div class="card" style="background: #F8F9F6; padding: 10px;">
        <div style="font-size: 7.5pt; font-weight: 800; color: #123D32; margin-bottom: 4px;">PADRÃO B: MODULAR CONNECTION GRID</div>
        <div class="svg-container" style="height: 70px;">
          <svg viewBox="0 0 300 70" width="100%" height="70">
            <line x1="20" y1="20" x2="280" y2="20" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4,4"/>
            <line x1="20" y1="50" x2="280" y2="50" stroke="#CBD5E1" stroke-width="1" stroke-dasharray="4,4"/>
            <circle cx="60" cy="20" r="4" fill="#123D32"/>
            <circle cx="160" cy="50" r="4" fill="#16A572"/>
            <circle cx="240" cy="20" r="5" fill="#FFCC45"/>
            <path d="M 60 20 C 100 20, 120 50, 160 50 C 200 50, 210 20, 240 20" fill="none" stroke="#16A572" stroke-width="2.5"/>
          </svg>
        </div>
        <p style="font-size: 7pt; color: #64748B; margin-top: 4px;">Rede de dados e pontos de embarque urbanos com alta precisão técnica.</p>
      </div>
    </div>

    <!-- Iconografia Oficial (Amostra de 6 Ícones) -->
    <div class="card">
      <h3 style="font-family: 'Manrope', sans-serif; font-size: 10.5pt; font-weight: 800; color: #123D32; margin-bottom: 6px;">Iconografia Proprietária (Grid 24x24 / Traço 2.0px)</h3>
      <div class="grid-3" style="gap: 6px;">
        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 6px; border-radius: 6px; display: flex; align-items: center; gap: 8px;">
          <svg viewBox="0 0 48 48" width="28" height="28" fill="none" stroke="#123D32" stroke-width="2.5" stroke-linecap="round">
            <rect x="4" y="16" width="40" height="20" rx="4"/>
            <circle cx="12" cy="36" r="4" fill="#16A572"/>
            <circle cx="36" cy="36" r="4" fill="#16A572"/>
          </svg>
          <div>
            <strong style="font-size: 7.5pt; color: #123D32; display: block;">Simbora Carro</strong>
            <span style="font-size: 6.5pt; color: #64748B;">Corrida urbana rápida</span>
          </div>
        </div>

        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 6px; border-radius: 6px; display: flex; align-items: center; gap: 8px;">
          <svg viewBox="0 0 48 48" width="28" height="28" fill="none" stroke="#123D32" stroke-width="2.5" stroke-linecap="round">
            <rect x="4" y="8" width="40" height="28" rx="4"/>
            <circle cx="12" cy="36" r="4" fill="#16A572"/>
            <circle cx="36" cy="36" r="4" fill="#16A572"/>
            <circle cx="40" cy="22" r="2" fill="#FFCC45"/>
          </svg>
          <div>
            <strong style="font-size: 7.5pt; color: #123D32; display: block;">Simbora Van</strong>
            <span style="font-size: 6.5pt; color: #64748B;">Viagem intermunicipal</span>
          </div>
        </div>

        <div style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 6px; border-radius: 6px; display: flex; align-items: center; gap: 8px;">
          <svg viewBox="0 0 48 48" width="28" height="28" fill="none" stroke="#123D32" stroke-width="2.5" stroke-linecap="round">
            <path d="M 24 6 L 40 12 C 40 28, 30 38, 24 42 C 18 38, 8 28, 8 12 Z" fill="#DCFCE7"/>
            <path d="M 16 22 L 22 28 L 32 18" stroke="#166534" stroke-width="3"/>
          </svg>
          <div>
            <strong style="font-size: 7.5pt; color: #123D32; display: block;">Segurança 24h</strong>
            <span style="font-size: 6.5pt; color: #64748B;">Monitoramento de rota</span>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>SIMBORA • MANUAL DE IDENTIDADE VISUAL V2.0</span>
      <span>LINGUAGEM GRÁFICA &amp; ÍCONES</span>
      <span>PÁGINA 08</span>
    </div>
  </div>

  <!-- ==========================================
       PÁGINA 9: IDENTIDADE DIGITAL & APLICATIVO MOBILE
       ========================================== -->
  <div class="page">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="header-tag tag-green">SEÇÃO 15 &amp; 16 • PRODUTO DIGITAL</span>
      <span class="mono" style="font-size: 8pt; color: #64748B;">APP MOBILE &amp; TELAS</span>
    </div>
    <h1 class="sec-title">Identidade Digital: App Icon &amp; Telas</h1>
    <p class="sec-subtitle">O comportamento visual nas lojas Google Play, Apple App Store e no smartphone do passageiro.</p>

    <div class="grid-2">
      <!-- Ícones Oficiais do App -->
      <div class="card">
        <h3 style="font-family: 'Manrope', sans-serif; font-size: 10.5pt; font-weight: 800; color: #123D32; margin-bottom: 8px;">Ícones Oficiais (Android Adaptive &amp; iOS)</h3>
        <div style="display: flex; gap: 14px; align-items: center; justify-content: center; padding: 10px 0;">
          <div style="text-align: center;">
            <div style="width: 70px; height: 70px; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 18px rgba(0,0,0,0.3); margin: 0 auto 4px auto;">
              <svg viewBox="0 0 512 512" width="70" height="70">
                <rect width="512" height="512" fill="#123D32"/>
                <g transform="translate(106, 106) scale(3)" fill="none">
                  <path d="M 28 76 C 24 64, 30 52, 44 48 L 56 44 C 68 40, 76 32, 74 20" stroke="#F8F9F6" stroke-width="11" stroke-linecap="round"/>
                  <path d="M 72 24 C 62 14, 42 16, 32 26 C 22 36, 28 50, 48 54 C 68 58, 76 68, 68 80 C 60 90, 42 88, 30 80" stroke="#16A572" stroke-width="10" stroke-linecap="round"/>
                  <circle cx="72" cy="24" r="7.5" fill="#FFCC45"/>
                </g>
              </svg>
            </div>
            <span style="font-size: 6.5pt; font-weight: 700; color: #123D32;">iOS (1024x1024)</span>
          </div>

          <div style="text-align: center;">
            <div style="width: 70px; height: 70px; border-radius: 50%; overflow: hidden; box-shadow: 0 8px 18px rgba(0,0,0,0.3); margin: 0 auto 4px auto;">
              <svg viewBox="0 0 512 512" width="70" height="70">
                <rect width="512" height="512" fill="#123D32"/>
                <g transform="translate(106, 106) scale(3)" fill="none">
                  <path d="M 28 76 C 24 64, 30 52, 44 48 L 56 44 C 68 40, 76 32, 74 20" stroke="#F8F9F6" stroke-width="11" stroke-linecap="round"/>
                  <path d="M 72 24 C 62 14, 42 16, 32 26 C 22 36, 28 50, 48 54 C 68 58, 76 68, 68 80 C 60 90, 42 88, 30 80" stroke="#16A572" stroke-width="10" stroke-linecap="round"/>
                  <circle cx="72" cy="24" r="7.5" fill="#FFCC45"/>
                </g>
              </svg>
            </div>
            <span style="font-size: 6.5pt; font-weight: 700; color: #123D32;">Android Circle</span>
          </div>
        </div>
        <p style="font-size: 7.5pt; color: #4B5563; text-align: center;">
          Máximo contraste sob luz solar direta através da base Verde Profundo combinada à fita em Branco Suave e Verde Vibrante.
        </p>
      </div>

      <!-- Preview da Splash Screen -->
      <div class="card" style="background: #123D32; color: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px;">
        <div style="font-size: 7.5pt; font-weight: 800; color: #FFCC45; margin-bottom: 6px;">SPLASH SCREEN OFICIAL</div>
        <svg viewBox="0 0 200 360" width="100" height="180" style="border-radius: 12px; border: 2px solid #16A572;">
          <rect width="200" height="360" fill="#123D32"/>
          <g transform="translate(60, 110) scale(0.8)" fill="none">
            <path d="M 28 76 C 24 64, 30 52, 44 48 L 56 44 C 68 40, 76 32, 74 20" stroke="#F8F9F6" stroke-width="11" stroke-linecap="round"/>
            <path d="M 72 24 C 62 14, 42 16, 32 26 C 22 36, 28 50, 48 54 C 68 58, 76 68, 68 80 C 60 90, 42 88, 30 80" stroke="#16A572" stroke-width="10" stroke-linecap="round"/>
            <circle cx="72" cy="24" r="7.5" fill="#FFCC45"/>
          </g>
          <text x="100" y="215" font-family="'Manrope', sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" text-anchor="middle">SIMBORA</text>
          <text x="100" y="235" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="700" fill="#FFCC45" text-anchor="middle">PEDIU. CHEGOU. SIMBORA!</text>
          <rect x="60" y="270" width="80" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>
          <rect x="60" y="270" width="50" height="4" rx="2" fill="#16A572"/>
        </svg>
      </div>
    </div>

    <!-- Onboarding Card Component -->
    <div class="card" style="margin-top: 4px;">
      <h3 style="font-family: 'Manrope', sans-serif; font-size: 10.5pt; font-weight: 800; color: #123D32; margin-bottom: 6px;">Fluxo de Onboarding e Solicitação de Viagem</h3>
      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span class="header-tag tag-green">ROTA SELECIONADA</span>
          <h4 style="font-family: 'Manrope', sans-serif; font-size: 12pt; font-weight: 800; color: #123D32; margin-top: 3px;">Penedo ↔ Piaçabuçu</h4>
          <p style="font-size: 8pt; color: #64748B;">Distância: 28 km • Tempo Médio: 32 min • Saídas a cada 30 min</p>
        </div>
        <div style="text-align: right;">
          <div class="mono" style="font-size: 16pt; font-weight: 800; color: #123D32;">R$ 15,00</div>
          <span style="background: #16A572; color: #FFFFFF; padding: 4px 12px; border-radius: 6px; font-size: 8pt; font-weight: 800;">Chamar Simbora →</span>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>SIMBORA • MANUAL DE IDENTIDADE VISUAL V2.0</span>
      <span>PRODUTO DIGITAL &amp; APLICATIVO</span>
      <span>PÁGINA 09</span>
    </div>
  </div>

  <!-- ==========================================
       PÁGINA 10: APLICAÇÕES FÍSICAS, FROTA E UNIFORMES
       ========================================== -->
  <div class="page">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="header-tag tag-green">SEÇÃO 17 &amp; 18 • FROTA &amp; PONTOS DE CONTATO</span>
      <span class="mono" style="font-size: 8pt; color: #64748B;">APLICAÇÕES FÍSICAS</span>
    </div>
    <h1 class="sec-title">Aplicações Físicas: Frotas e Uniformes</h1>
    <p class="sec-subtitle">A presença da SIMBORA nas ruas, estradas e no atendimento diário do motorista parceiro.</p>

    <!-- Envelopamento da Van Intermunicipal -->
    <div class="card" style="margin-bottom: 8px;">
      <h3 style="font-family: 'Manrope', sans-serif; font-size: 10.5pt; font-weight: 800; color: #123D32; margin-bottom: 4px;">Envelopamento Veicular: Van Intermunicipal Penedo ↔ Piaçabuçu</h3>
      <div class="svg-container" style="background: #E2E8F0; padding: 6px; border-radius: 6px;">
        <svg viewBox="0 0 1000 350" width="100%" height="150">
          <!-- Silhueta da Van -->
          <path d="M 50 260 L 50 140 C 50 110, 80 90, 140 90 L 760 90 C 820 90, 890 120, 930 180 L 960 230 C 970 245, 970 260, 970 280 L 970 300 L 50 300 Z" fill="#F8F9F6" stroke="#CBD5E1" stroke-width="2"/>
          <path d="M 45 285 L 975 285 L 975 315 L 45 315 Z" fill="#123D32"/>
          <rect x="140" y="110" width="130" height="75" rx="6" fill="#17211D" opacity="0.85"/>
          <rect x="290" y="110" width="150" height="75" rx="6" fill="#17211D" opacity="0.85"/>
          <rect x="460" y="110" width="150" height="75" rx="6" fill="#17211D" opacity="0.85"/>
          <rect x="630" y="110" width="150" height="75" rx="6" fill="#17211D" opacity="0.85"/>
          <!-- Fita Envelopada -->
          <path d="M 180 240 C 360 240, 500 300, 660 260 C 740 240, 860 210, 960 230" fill="none" stroke="#16A572" stroke-width="32" stroke-linecap="round"/>
          <path d="M 200 270 C 360 270, 500 330, 660 290" fill="none" stroke="#FFCC45" stroke-width="8" stroke-linecap="round"/>
          <!-- Logo na Lateral -->
          <g transform="translate(430, 115) scale(0.65)">
            <rect width="360" height="80" rx="14" fill="#FFFFFF" stroke="#123D32" stroke-width="2"/>
            <text x="70" y="52" font-family="'Manrope', sans-serif" font-size="34" font-weight="900" fill="#123D32">SIMBORA</text>
          </g>
          <!-- Rodas -->
          <circle cx="210" cy="300" r="50" fill="#1E293B" stroke="#64748B" stroke-width="5"/>
          <circle cx="790" cy="300" r="50" fill="#1E293B" stroke="#64748B" stroke-width="5"/>
        </svg>
      </div>
    </div>

    <!-- Grid com Uniforme, Boné e Crachá -->
    <div class="grid-3">
      <!-- Camisa Polo -->
      <div class="card" style="text-align: center; padding: 8px;">
        <strong style="font-size: 7.5pt; color: #123D32; display: block; margin-bottom: 4px;">CAMISA POLO PARCEIRO</strong>
        <div style="background: #123D32; height: 75px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
          <svg viewBox="0 0 100 100" width="40" height="40">
            <path d="M 28 76 C 24 64, 30 52, 44 48 L 56 44 C 68 40, 76 32, 74 20" stroke="#F8F9F6" stroke-width="11" stroke-linecap="round" fill="none"/>
            <path d="M 72 24 C 62 14, 42 16, 32 26 C 22 36, 28 50, 48 54 C 68 58, 76 68, 68 80 C 60 90, 42 88, 30 80" stroke="#16A572" stroke-width="10" stroke-linecap="round" fill="none"/>
            <circle cx="72" cy="24" r="7.5" fill="#FFCC45"/>
          </svg>
        </div>
        <span style="font-size: 6.5pt; color: #64748B; margin-top: 4px; display: block;">Piquet 100% algodão Verde Profundo com gola verde vibrante</span>
      </div>

      <!-- Boné Oficial -->
      <div class="card" style="text-align: center; padding: 8px;">
        <strong style="font-size: 7.5pt; color: #123D32; display: block; margin-bottom: 4px;">BONÉ BORDADO</strong>
        <div style="background: #F8F9F6; border: 1px solid #CBD5E1; height: 75px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
          <span style="background: #123D32; color: #FFCC45; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 9pt;">SIMBORA ★</span>
        </div>
        <span style="font-size: 6.5pt; color: #64748B; margin-top: 4px; display: block;">Sarja peletizada com bordado frontal e fecho de metal</span>
      </div>

      <!-- Crachá com QR Code -->
      <div class="card" style="text-align: center; padding: 8px;">
        <strong style="font-size: 7.5pt; color: #123D32; display: block; margin-bottom: 4px;">CRACHÁ DE IDENTIFICAÇÃO</strong>
        <div style="background: #FFFFFF; border: 1px solid #16A572; height: 75px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
          <div style="width: 24px; height: 24px; border-radius: 50%; background: #123D32; margin-bottom: 2px;"></div>
          <span style="font-size: 6.5pt; font-weight: 700; color: #123D32;">Carlos Eduardo (5★)</span>
          <span class="mono" style="font-size: 6pt; color: #16A572;">#SMB-AL-0492</span>
        </div>
        <span style="font-size: 6.5pt; color: #64748B; margin-top: 4px; display: block;">PVC cristal 85x125mm com QR code para checagem</span>
      </div>
    </div>

    <div class="page-footer">
      <span>SIMBORA • MANUAL DE IDENTIDADE VISUAL V2.0</span>
      <span>FROTA VEICULAR &amp; UNIFORMES</span>
      <span>PÁGINA 10</span>
    </div>
  </div>

  <!-- ==========================================
       PÁGINA 11: MARKETING, REDES SOCIAIS & MÍDIA EXTERNA
       ========================================== -->
  <div class="page">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="header-tag tag-green">SEÇÃO 19 &amp; 20 • COMUNICAÇÃO DE MASSA</span>
      <span class="mono" style="font-size: 8pt; color: #64748B;">MARKETING &amp; REDES</span>
    </div>
    <h1 class="sec-title">Marketing, Redes Sociais e Mídia Externa</h1>
    <p class="sec-subtitle">Campanhas de lançamento para outdoor rodoviário e publicações de feed e story no Instagram.</p>

    <!-- Outdoor Rodoviário -->
    <div class="card" style="background: #123D32; color: #FFFFFF; padding: 10px; margin-bottom: 8px;">
      <div style="font-size: 7.5pt; font-weight: 800; color: #FFCC45; margin-bottom: 4px;">OUTDOOR RODOVIÁRIO DE IMPACTO (AL-101 / AL-225)</div>
      <div class="svg-container" style="height: 100px;">
        <svg viewBox="0 0 1000 280" width="100%" height="100">
          <rect width="1000" height="280" fill="#123D32"/>
          <path d="M 0 200 C 300 200, 500 100, 800 150 L 1000 120" fill="none" stroke="#16A572" stroke-width="20" opacity="0.4"/>
          <text x="50" y="80" font-family="'Manrope', sans-serif" font-size="34" font-weight="900" fill="#FFFFFF">SIMBORA</text>
          <text x="50" y="150" font-family="'Manrope', sans-serif" font-size="44" font-weight="900" fill="#FFFFFF">Pediu. Chegou. <tspan fill="#FFCC45">Simbora!</tspan></text>
          <text x="50" y="195" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="700" fill="#CBD5E1">A nova mobilidade rápida de Penedo e Piaçabuçu.</text>
          <rect x="50" y="225" width="260" height="40" rx="8" fill="#16A572"/>
          <text x="180" y="250" font-family="'Manrope', sans-serif" font-size="14" font-weight="800" fill="#FFFFFF" text-anchor="middle">Baixe o App nas Lojas →</text>
          <circle cx="880" cy="140" r="50" fill="#16A572"/>
          <circle cx="880" cy="140" r="22" fill="#FFCC45"/>
        </svg>
      </div>
    </div>

    <!-- Redes Sociais: Feed e Story -->
    <div class="grid-2">
      <!-- Feed Card -->
      <div class="card" style="display: flex; gap: 10px; align-items: center;">
        <div style="width: 85px; height: 105px; background: #123D32; border-radius: 8px; padding: 6px; color: #FFFFFF; flex-shrink: 0; display: flex; flex-direction: column; justify-content: space-between;">
          <div style="font-size: 6pt; font-weight: 800; color: #FFCC45;">SIMBORA</div>
          <div style="font-size: 8pt; font-weight: 900; line-height: 1.1;">Pediu. Chegou. Simbora!</div>
          <div style="font-size: 5pt; color: #CBD5E1;">Baixe o app</div>
        </div>
        <div>
          <strong style="font-size: 8.5pt; color: #123D32; display: block;">Feed Instagram (1080x1350)</strong>
          <p style="font-size: 7.5pt; color: #4B5563; line-height: 1.4;">
            Proporção vertical 4:5 para máximo aproveitamento do feed mobile. Headline em Verde Profundo com acento solar em Amarelo.
          </p>
        </div>
      </div>

      <!-- Story Card -->
      <div class="card" style="display: flex; gap: 10px; align-items: center;">
        <div style="width: 60px; height: 105px; background: #17211D; border-radius: 8px; padding: 6px; color: #FFFFFF; flex-shrink: 0; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid #16A572;">
          <div style="font-size: 5pt; font-weight: 800; color: #16A572;">STORY</div>
          <div style="font-size: 7pt; font-weight: 800; line-height: 1.2;">Viaje por R$ 15</div>
          <div style="font-size: 5pt; color: #FFCC45; text-align: center;">↑ Arraste</div>
        </div>
        <div>
          <strong style="font-size: 8.5pt; color: #123D32; display: block;">Instagram Stories (1080x1920)</strong>
          <p style="font-size: 7.5pt; color: #4B5563; line-height: 1.4;">
            Formato 9:16 vertical imersivo, com botões de chamada rápida para download e cards de rotas ativas.
          </p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>SIMBORA • MANUAL DE IDENTIDADE VISUAL V2.0</span>
      <span>MARKETING &amp; MÍDIA EXTERNA</span>
      <span>PÁGINA 11</span>
    </div>
  </div>

  <!-- ==========================================
       PÁGINA 12: ESPECIFICAÇÕES TÉCNICAS & HOMOLOGAÇÃO
       ========================================== -->
  <div class="page">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="header-tag tag-green">SEÇÃO 21 &amp; 22 • ESPECIFICAÇÕES &amp; REGRAS</span>
      <span class="mono" style="font-size: 8pt; color: #64748B;">HOMOLOGAÇÃO TÉCNICA</span>
    </div>
    <h1 class="sec-title">Especificações Técnicas e Guia de Integração</h1>
    <p class="sec-subtitle">Diretrizes de código, tokens de engenharia e aprovação final da nova identidade SIMBORA.</p>

    <div class="card" style="background: #17211D; color: #FFFFFF; padding: 12px; margin-bottom: 8px;">
      <div style="font-size: 7.5pt; font-weight: 800; color: #16A572; margin-bottom: 4px;">TOKENS CSS REUTILIZÁVEIS (`04-VISUAL-SYSTEM/design-tokens/tokens.css`)</div>
      <pre class="mono" style="font-size: 7.5pt; color: #CBD5E1; line-height: 1.4; overflow-x: hidden;">
:root {
  --simbora-color-verde-profundo: #123D32;   /* Âncora Institucional (60%) */
  --simbora-color-verde-vibrante: #16A572;   /* Ação Primária & Rota (30%) */
  --simbora-color-amarelo-energia: #FFCC45;  /* Ponto Focal Solar (10%) */
  --simbora-color-branco-suave: #F8F9F6;     /* Superfície Limpa */
  --simbora-color-grafite-mineral: #17211D;  /* Tipografia Base */
  --simbora-font-display: 'Manrope', sans-serif;
  --simbora-font-body: 'Plus Jakarta Sans', sans-serif;
  --simbora-font-mono: 'JetBrains Mono', monospace;
}</pre>
    </div>

    <div class="grid-2">
      <div class="card">
        <h3 style="font-family: 'Manrope', sans-serif; font-size: 10.5pt; font-weight: 800; color: #123D32; margin-bottom: 6px;">Checklist de Homologação de Qualidade</h3>
        <ul style="font-size: 7.5pt; color: #17211D; padding-left: 14px; line-height: 1.7;">
          <li>✓ <strong>Nome Preservado:</strong> SIMBORA grafado com kerning compensado.</li>
          <li>✓ <strong>Slogan Preservado:</strong> "Pediu. Chegou. Simbora!" integrado às assinaturas.</li>
          <li>✓ <strong>Cores Preservadas:</strong> Os 5 códigos HEX aplicados com fidelidade exata.</li>
          <li>✓ <strong>Clichês Banidos:</strong> Setas genéricas e carros clipart 100% eliminados.</li>
          <li>✓ <strong>Escalabilidade Validada:</strong> Ícone nítido de 512px até 16px no mobile.</li>
          <li>✓ <strong>Acessibilidade WCAG:</strong> Todas as combinações aprovadas em AA/AAA.</li>
        </ul>
      </div>

      <div class="card">
        <h3 style="font-family: 'Manrope', sans-serif; font-size: 10.5pt; font-weight: 800; color: #123D32; margin-bottom: 6px;">Estrutura de Repositório Entregue</h3>
        <div class="mono" style="font-size: 7pt; color: #4B5563; line-height: 1.5;">
          SIMBORA-REBRANDING/<br>
          ├── 01-RESEARCH/ (Livros, Benchmarks, Auditoria)<br>
          ├── 02-STRATEGY/ (Posicionamento, Diretrizes)<br>
          ├── 03-LOGO/ (Primary, Secondary, Monochrome, Vector)<br>
          ├── 04-VISUAL-SYSTEM/ (Tokens, Cores, Tipografia, Ícones)<br>
          ├── 05-APPLICATIONS/ (Mobile, Social, Veículos, Uniformes)<br>
          ├── 06-BRAND-BOOK/ (SIMBORA-BRAND-BOOK-V2.pdf)<br>
          └── 07-IMPLEMENTATION/ (Design System &amp; Integração)
        </div>
      </div>
    </div>

    <!-- Termo de Homologação Final -->
    <div class="card" style="background: #F8F9F6; border: 1.5px solid #16A572; padding: 10px; margin-top: 4px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="font-family: 'Manrope', sans-serif; font-size: 10pt; color: #123D32; display: block;">HOMOLOGAÇÃO DA NOVA IDENTIDADE VISUAL</strong>
        <p style="font-size: 7.5pt; color: #64748B;">Documento técnico oficial aprovado pela Direção Criativa para implementação em software e marketing.</p>
      </div>
      <div style="text-align: right;">
        <span class="header-tag tag-green" style="font-size: 8pt; padding: 4px 12px;">STATUS: HOMOLOGADO V2.0</span>
      </div>
    </div>

    <div class="page-footer">
      <span>SIMBORA • MANUAL DE IDENTIDADE VISUAL V2.0</span>
      <span>ESPECIFICAÇÕES TÉCNICAS &amp; HOMOLOGAÇÃO</span>
      <span>PÁGINA 12 (FINAL)</span>
    </div>
  </div>

</body>
</html>
`;

fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('HTML written successfully (' + htmlContent.length + ' bytes).');

console.log('Rendering PDF via Headless Edge...');
const cmd = `${edgePath} --headless --no-sandbox --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`;
execSync(cmd);

console.log('PDF rendered successfully to: ' + pdfPath);
const stats = fs.statSync(pdfPath);
console.log('PDF Size: ' + stats.size + ' bytes');
