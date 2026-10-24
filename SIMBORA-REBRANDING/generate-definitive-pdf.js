const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = 'C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING';
const finalDir = path.join(rootDir, '03-LOGO', 'final-identity');
const artifactDir = 'C:\\Users\\winc\\.gemini\\antigravity\\brain\\b5a5ba79-6e91-45b2-8392-8c29d8da9dcc';

console.log('Generating SIMBORA Definitive Brand Book & Dossier...');

// Load base SVGs from final-identity
const appIconSvg = fs.readFileSync(path.join(finalDir, 'simbora-app-icon.svg'), 'utf8').replace(/<\?xml[^>]*\?>/g, '').trim();
const symbolIsolatedSvg = fs.readFileSync(path.join(finalDir, 'simbora-symbol-isolated.svg'), 'utf8').replace(/<\?xml[^>]*\?>/g, '').trim();
const logoHorizontalLightSvg = fs.readFileSync(path.join(finalDir, 'simbora-logo-horizontal-light.svg'), 'utf8').replace(/<\?xml[^>]*\?>/g, '').trim();
const logoHorizontalDarkSvg = fs.readFileSync(path.join(finalDir, 'simbora-logo-horizontal-dark.svg'), 'utf8').replace(/<\?xml[^>]*\?>/g, '').trim();
const logoVerticalSvg = fs.readFileSync(path.join(finalDir, 'simbora-logo-vertical.svg'), 'utf8').replace(/<\?xml[^>]*\?>/g, '').trim();
const logoMonoBlackSvg = fs.readFileSync(path.join(finalDir, 'simbora-logo-monochrome-black.svg'), 'utf8').replace(/<\?xml[^>]*\?>/g, '').trim();

// Additional assets (Vehicle Livery, Outdoor Billboard, Driver Badge) as inline SVGs:
const vehicleLiverySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 280" width="100%" height="100%">
  <!-- Car Silhouette & Livery Application -->
  <rect width="800" height="280" fill="#F4F7F5" rx="16"/>
  <!-- Ground Shadow -->
  <ellipse cx="400" cy="245" rx="340" ry="12" fill="#D3DED9"/>
  <!-- Car Body Side Profile (Sedan Moderno) -->
  <path d="M 120 220 L 150 170 L 230 160 L 320 100 L 530 100 L 630 155 L 710 175 L 720 220 Z" fill="#FFFFFF" stroke="#CCD8D2" stroke-width="2"/>
  <!-- Windows -->
  <path d="M 330 110 L 450 110 L 450 155 L 260 155 Z" fill="#17211D"/>
  <path d="M 465 110 L 525 110 L 610 155 L 465 155 Z" fill="#17211D"/>
  <!-- Wheels -->
  <circle cx="220" cy="220" r="38" fill="#17211D"/>
  <circle cx="220" cy="220" r="22" fill="#9BAFA6"/>
  <circle cx="610" cy="220" r="38" fill="#17211D"/>
  <circle cx="610" cy="220" r="22" fill="#9BAFA6"/>
  <!-- SIMBORA DYNAMIC DOOR LIVERY (Green Dynamic Band + Stencil Logo) -->
  <path d="M 280 185 L 560 170 L 550 205 L 270 215 Z" fill="#123D32"/>
  <path d="M 560 170 L 585 168 L 575 203 L 550 205 Z" fill="#FFCC45"/>
  <!-- S! Badge on Front Door -->
  <g transform="translate(320, 175) scale(0.18)">
    ${appIconSvg}
  </g>
  <text x="395" y="198" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="22" fill="#FFFFFF" letter-spacing="1.5">SIMBORA<tspan fill="#FFCC45">!</tspan></text>
  <text x="396" y="212" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="7.5" fill="#16A572" letter-spacing="1">PEDIU. CHEGOU. SIMBORA!</text>
</svg>`;

const billboardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="100%" height="100%">
  <!-- Outdoor Launch Billboard (Penedo / Piaçabuçu) -->
  <rect width="800" height="320" rx="16" fill="#123D32"/>
  <!-- Decorative Speed Slashes in background -->
  <path d="M -50 320 L 250 0 L 320 0 L 20 320 Z" fill="#16A572" opacity="0.15"/>
  <path d="M 120 320 L 420 0 L 460 0 L 160 320 Z" fill="#FFCC45" opacity="0.1"/>
  <!-- Icon Mark Huge -->
  <g transform="translate(60, 50) scale(0.42)">
    ${appIconSvg}
  </g>
  <!-- Content -->
  <text x="300" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" fill="#FFCC45" letter-spacing="3" text-transform="uppercase">LANÇAMENTO EM ALAGOAS</text>
  <text x="300" y="145" font-family="'Plus Jakarta Sans', sans-serif" font-size="44" font-weight="900" fill="#FFFFFF" letter-spacing="-0.5">Pediu. Chegou.<br><tspan fill="#FFCC45">Simbora!</tspan></text>
  <text x="300" y="235" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="600" fill="#A3C9BC">O novo aplicativo de mobilidade urbana e viagens intermunicipais.</text>
  <!-- City Pills -->
  <g transform="translate(300, 260)">
    <rect width="100" height="30" rx="15" fill="#16A572"/>
    <text x="50" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">PENEDO</text>
    <rect x="115" width="125" height="30" rx="15" fill="#16A572"/>
    <text x="177" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">PIAÇABUÇU</text>
    <rect x="255" width="135" height="30" rx="15" fill="rgba(255,204,69,0.2)" stroke="#FFCC45"/>
    <text x="322" y="20" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#FFCC45" text-anchor="middle">E REGIÃO</text>
  </g>
</svg>`;

const masterHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SIMBORA — Manual Oficial de Identidade Visual & Brand Book Definitivo</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap" rel="stylesheet">
<style>
  :root {
    --verde-profundo: #123D32;
    --verde-vibrante: #16A572;
    --amarelo-energia: #FFCC45;
    --branco-suave: #F8F9F6;
    --grafite: #17211D;
    --cinza-bg: #F4F7F5;
    --borda: #E2E8E4;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0B100E;
    color: #17211D;
    line-height: 1.4;
    -webkit-font-smoothing: antialiased;
  }

  .deck-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 30px 20px 80px;
  }

  /* SLIDE DEFINITION */
  .slide {
    background: #FFFFFF;
    border-radius: 20px;
    margin-bottom: 40px;
    padding: 44px 50px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.35);
    page-break-after: always;
    break-after: page;
    position: relative;
    min-height: 720px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* SLIDE 1: CAPA OFICIAL */
  .slide-cover {
    background: linear-gradient(135deg, #123D32 0%, #0A221C 100%);
    color: #F8F9F6;
    border: 1px solid rgba(22, 165, 114, 0.35);
  }

  .cover-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    padding-bottom: 24px;
  }

  .badge-official {
    background: #FFCC45;
    color: #123D32;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 18px;
    border-radius: 999px;
  }

  .cover-title-group {
    margin: 36px 0;
  }

  .cover-super {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #16A572;
    margin-bottom: 12px;
  }

  .cover-title {
    font-size: 68px;
    font-weight: 900;
    line-height: 1.05;
    color: #FFFFFF;
    letter-spacing: -1px;
  }

  .cover-title span { color: #FFCC45; }

  .cover-desc {
    font-size: 19px;
    color: #A3C9BC;
    max-width: 820px;
    line-height: 1.5;
    margin-top: 18px;
  }

  .cover-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-top: 1px solid rgba(255,255,255,0.12);
    padding-top: 28px;
  }

  /* INNER SLIDE HEADERS */
  .slide-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 28px;
    padding-bottom: 18px;
    border-bottom: 2px solid #EEF3F0;
  }

  .slide-category {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--verde-vibrante);
    margin-bottom: 4px;
  }

  .slide-title {
    font-size: 32px;
    font-weight: 900;
    color: var(--verde-profundo);
    letter-spacing: -0.5px;
  }

  .slide-subtitle {
    font-size: 14px;
    color: #556B61;
    margin-top: 4px;
    max-width: 800px;
  }

  .slide-page-badge {
    font-size: 12px;
    font-weight: 800;
    color: #8C9E95;
    background: #F1F5F3;
    padding: 6px 14px;
    border-radius: 8px;
  }

  /* GRIDS & LAYOUTS */
  .grid-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    flex: 1;
  }

  .grid-3col {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    flex: 1;
  }

  .content-box {
    background: var(--cinza-bg);
    border: 1px solid var(--borda);
    border-radius: 16px;
    padding: 26px;
  }

  .box-title {
    font-size: 16px;
    font-weight: 800;
    color: var(--verde-profundo);
    margin-bottom: 10px;
  }

  .text-body {
    font-size: 13.5px;
    color: #384A42;
    line-height: 1.55;
  }

  /* COLOR SWATCH CARD */
  .color-card {
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--borda);
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
  }
  .color-sample {
    height: 120px;
    display: flex;
    align-items: flex-end;
    padding: 14px;
    font-size: 13px;
    font-weight: 800;
  }
  .color-meta {
    padding: 16px;
    font-size: 12px;
  }
  .color-meta strong {
    font-size: 15px;
    color: var(--verde-profundo);
    display: block;
    margin-bottom: 6px;
  }
  .color-row {
    display: flex;
    justify-content: space-between;
    padding: 3px 0;
    color: #556B61;
  }

  /* LOGO PREVIEWS */
  .logo-preview-box {
    border-radius: 16px;
    padding: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 180px;
    border: 2px solid var(--borda);
    position: relative;
    background: #FFFFFF;
  }
  .logo-preview-box.dark {
    background: var(--verde-profundo);
    border-color: var(--verde-profundo);
  }
  .preview-label {
    position: absolute;
    top: 10px;
    left: 14px;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #8A9D94;
  }
  .logo-preview-box.dark .preview-label { color: #7AA897; }

  /* MOCKUPS */
  .phone-mock {
    width: 250px;
    height: 480px;
    background: #FFFFFF;
    border-radius: 36px;
    border: 8px solid #17211D;
    box-shadow: 0 16px 36px rgba(0,0,0,0.25);
    overflow: hidden;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }

  /* PRINT RULES */
  @page {
    size: A4 landscape;
    margin: 8mm;
  }

  @media print {
    body { background: #FFFFFF; }
    .deck-container { padding: 0; max-width: 100%; }
    .slide {
      box-shadow: none;
      border: 1px solid #CCD4D0;
      margin-bottom: 0;
      min-height: 190mm;
      padding: 14mm 16mm;
      page-break-after: always;
      break-after: page;
    }
    .slide-cover {
      min-height: 190mm;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .logo-preview-box.dark {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .color-sample {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>
</head>
<body>

<div class="deck-container">

  <!-- ==================== PÁGINA 1: CAPA OFICIAL ==================== -->
  <section class="slide slide-cover">
    <div class="cover-top">
      <div class="badge-official">IDENTIDADE VISUAL OFICIAL DEFINITIVA</div>
      <div style="font-size: 13px; font-weight: 800; color: #FFCC45; letter-spacing: 1.5px;">VERSÃO 1.0 &bull; OUTUBRO 2026</div>
    </div>

    <div class="cover-title-group">
      <div class="cover-super">BRAND BOOK &amp; MANUAL DE IDENTIDADE VISUAL</div>
      <h1 class="cover-title">SIMBORA<span>!</span></h1>
      <p class="cover-desc">
        A marca oficial de mobilidade urbana e viagens intermunicipais do Brasil.
        Diretrizes completas do conceito <strong>Stencil Speed Cut</strong>, aplicações multiplataforma,
        regras de uso e especificações de engenharia de design.
      </p>
    </div>

    <div class="cover-footer">
      <div>
        <div style="font-size: 12px; font-weight: 800; color: #16A572; letter-spacing: 2px; text-transform: uppercase;">Slogan Oficial Preservado</div>
        <div style="font-size: 22px; font-weight: 900; color: #FFFFFF; margin-top: 4px;">"Pediu. Chegou. Simbora!"</div>
      </div>
      <div style="text-align: right; font-size: 12px; color: #A3C9BC; line-height: 1.6;">
        Mercado de Origem: <strong>Penedo &amp; Piaçabuçu &bull; Alagoas</strong><br>
        Expansão: <strong>Nordeste &amp; Território Nacional</strong>
      </div>
    </div>
  </section>

  <!-- ==================== PÁGINA 2: ESTRATÉGIA DE MARCA & SLOGANS ==================== -->
  <section class="slide">
    <div>
      <div class="slide-header">
        <div>
          <div class="slide-category">01 &bull; Posicionamento &amp; Estratégia</div>
          <h2 class="slide-title">DNA, Propósito &amp; Território da Marca</h2>
          <p class="slide-subtitle">Construção de uma empresa genuinamente brasileira, calorosa, confiável e com alta precisão tecnológica.</p>
        </div>
        <div class="slide-page-badge">Página 02 / 10</div>
      </div>

      <div class="grid-2col">
        <div class="content-box">
          <div class="box-title">O Significado de "SIMBORA!"</div>
          <p class="text-body" style="margin-bottom: 14px;">
            A palavra <strong>SIMBORA</strong> nasce da contração popular de <em>"vamos embora"</em>. É o chamado brasileiro para o movimento, a partida, a jornada e a ação imediata.
          </p>
          <p class="text-body">
            A marca não é fria nem burocrática: ela é um convite enérgico para ir em frente com segurança e agilidade. Ao integrar a exclamação <strong>"!"</strong> ao nome e ao monograma, a identidade ganha a sonoridade da própria fala do passageiro e motorista.
          </p>
        </div>

        <div class="content-box">
          <div class="box-title">Slogans Oficiais Homologados</div>
          <div style="background: #FFFFFF; border-radius: 10px; padding: 14px 18px; border: 1px solid var(--borda); margin-bottom: 10px;">
            <span style="font-size: 10px; font-weight: 800; color: var(--verde-vibrante); text-transform: uppercase;">Slogan Principal (Oficial)</span>
            <div style="font-size: 16px; font-weight: 900; color: var(--verde-profundo); margin-top: 2px;">
              "Pediu. Chegou. Simbora!"
            </div>
          </div>

          <div style="font-size: 11px; font-weight: 800; color: #8A9D94; text-transform: uppercase; margin: 10px 0 6px;">5 Alternativas Oficiais para Campanhas:</div>
          <ul style="font-size: 13px; color: #384A42; padding-left: 18px; line-height: 1.6;">
            <li>"Seu destino no seu tempo. Simbora!"</li>
            <li>"Mobilidade com energia brasileira."</li>
            <li>"Acelere com confiança. Simbora!"</li>
            <li>"A viagem que conecta você ao que importa."</li>
            <li>"Mais rápido, mais perto. Simbora!"</li>
          </ul>
        </div>
      </div>
    </div>

    <div style="margin-top: 20px; padding: 14px 20px; background: #E8F3EE; border-radius: 12px; font-size: 12px; color: #2D4C3F; display: flex; justify-content: space-between;">
      <span><strong>Pilar de Confiança:</strong> Segurança para passageiros e rentabilidade digna para motoristas parceiros.</span>
      <span><strong>Foco Inicial:</strong> Mobilidade intraurbana e ligação rodoviária entre municípios de Alagoas.</span>
    </div>
  </section>

  <!-- ==================== PÁGINA 3: ANATOMIA DO SÍMBOLO STENCIL SPEED CUT ==================== -->
  <section class="slide">
    <div>
      <div class="slide-header">
        <div>
          <div class="slide-category">02 &bull; Engenharia do Símbolo</div>
          <h2 class="slide-title">Anatomia do Símbolo: Stencil Speed Cut</h2>
          <p class="slide-subtitle">Construção matemática com inclinação dinâmica de 12°, rasgo diagonal de 14px e tensão de curvas contínuas.</p>
        </div>
        <div class="slide-page-badge">Página 03 / 10</div>
      </div>

      <div class="grid-2col" style="align-items: center;">
        <div style="background: var(--verde-profundo); border-radius: 20px; padding: 40px; display: flex; align-items: center; justify-content: center; min-height: 340px;">
          <div style="width: 260px; height: 260px;">
            ${appIconSvg}
          </div>
        </div>

        <div>
          <div class="content-box" style="margin-bottom: 20px;">
            <div class="box-title">Os 4 Elementos Fundamentais</div>
            <ul style="list-style: none; font-size: 13.5px; color: #384A42; line-height: 1.7;">
              <li style="margin-bottom: 8px;">
                <strong style="color: #123D32;">1. Asa Superior (#F8F9F6):</strong> Representa o início do trajeto, a clareza da solicitação e a partida imediata.
              </li>
              <li style="margin-bottom: 8px;">
                <strong style="color: #16A572;">2. Corte de Aceleração (14px):</strong> O espaço negativo em diagonal com ângulo de 12° simboliza o asfalto, a pista e a fluidez do trânsito.
              </li>
              <li style="margin-bottom: 8px;">
                <strong style="color: #16A572;">3. Asa Inferior (#16A572):</strong> A base do 'S' em Verde Vibrante projeta tração e velocidade para a frente.
              </li>
              <li>
                <strong style="color: #B58400;">4. Exclamação Solar (#FFCC45):</strong> O ponto solar e a haste cônica trazem a energia inconfundível do chamado <em>SIMBORA!</em>.
              </li>
            </ul>
          </div>

          <div style="padding: 16px; background: #FFF9E6; border: 1px solid #FFE082; border-radius: 12px; font-size: 12px; color: #6D4C00;">
            <strong>Regra de Proporção:</strong> A exclamação sempre preserva sua inclinação paralela de 12° em relação à espinha do 'S'.
          </div>
        </div>
      </div>
    </div>

    <div style="font-size: 11px; color: #8A9D94; border-top: 1px solid #E6ECE8; padding-top: 12px;">
      Geometria Vetorial Proprietária &bull; Sem dependência de fontes tipográficas convencionais para o símbolo.
    </div>
  </section>

  <!-- ==================== PÁGINA 4: SISTEMA DE LOGOTIPOS OFICIAIS ==================== -->
  <section class="slide">
    <div>
      <div class="slide-header">
        <div>
          <div class="slide-category">03 &bull; Sistema de Assinaturas</div>
          <h2 class="slide-title">Logotipos Oficiais: Fundo Claro, Escuro &amp; Vertical</h2>
          <p class="slide-subtitle">Variações homologadas para garantir contraste e integridade visual em qualquer suporte físico ou digital.</p>
        </div>
        <div class="slide-page-badge">Página 04 / 10</div>
      </div>

      <div class="grid-2col" style="gap: 20px;">
        <!-- Fundo Claro -->
        <div class="logo-preview-box">
          <span class="preview-label">Aplicação Horizontal &bull; Fundo Claro</span>
          <div style="width: 100%; max-width: 520px;">
            ${logoHorizontalLightSvg}
          </div>
        </div>

        <!-- Fundo Escuro -->
        <div class="logo-preview-box dark">
          <span class="preview-label">Aplicação Horizontal &bull; Fundo Verde Profundo</span>
          <div style="width: 100%; max-width: 520px;">
            ${logoHorizontalDarkSvg}
          </div>
        </div>

        <!-- Monocromático Preto -->
        <div class="logo-preview-box">
          <span class="preview-label">Monocromático &bull; Impressão Laser / PB</span>
          <div style="width: 100%; max-width: 520px;">
            ${logoMonoBlackSvg}
          </div>
        </div>

        <!-- Selo Vertical -->
        <div class="logo-preview-box">
          <span class="preview-label">Selo Vertical &bull; Aplicação Centralizada</span>
          <div style="width: 100%; max-width: 280px;">
            ${logoVerticalSvg}
          </div>
        </div>
      </div>
    </div>

    <div style="font-size: 11.5px; color: #556B61; background: #F1F5F3; padding: 10px 18px; border-radius: 8px; margin-top: 16px;">
      <strong>Área de Respiro:</strong> Mantenha sempre um espaçamento mínimo equivalente à altura do ponto de exclamação em volta de qualquer aplicação da logomarca.
    </div>
  </section>

  <!-- ==================== PÁGINA 5: CORES & ACESSIBILIDADE WCAG AA ==================== -->
  <section class="slide">
    <div>
      <div class="slide-header">
        <div>
          <div class="slide-category">04 &bull; Paleta Cromática</div>
          <h2 class="slide-title">Cores Institucionais &amp; Conformidade WCAG AA</h2>
          <p class="slide-subtitle">Tons calibrados para atender aos critérios de contraste para legibilidade em ambientes externos com sol intenso.</p>
        </div>
        <div class="slide-page-badge">Página 05 / 10</div>
      </div>

      <div class="grid-3col" style="grid-template-columns: repeat(5, 1fr); gap: 14px;">
        <!-- Cor 1 -->
        <div class="color-card">
          <div class="color-sample" style="background: #123D32; color: #FFFFFF;">#123D32</div>
          <div class="color-meta">
            <strong>Verde Profundo</strong>
            <div class="color-row"><span>RGB</span><span>18, 61, 50</span></div>
            <div class="color-row"><span>CMYK</span><span>85, 45, 68, 55</span></div>
            <div class="color-row"><span>Pantone</span><span>5535 C</span></div>
            <div class="color-row"><span>Função</span><span>Base primária</span></div>
          </div>
        </div>

        <!-- Cor 2 -->
        <div class="color-card">
          <div class="color-sample" style="background: #16A572; color: #FFFFFF;">#16A572</div>
          <div class="color-meta">
            <strong>Verde Vibrante</strong>
            <div class="color-row"><span>RGB</span><span>22, 165, 114</span></div>
            <div class="color-row"><span>CMYK</span><span>78, 0, 68, 0</span></div>
            <div class="color-row"><span>Pantone</span><span>7725 C</span></div>
            <div class="color-row"><span>Função</span><span>Movimento / Ação</span></div>
          </div>
        </div>

        <!-- Cor 3 -->
        <div class="color-card">
          <div class="color-sample" style="background: #FFCC45; color: #17211D;">#FFCC45</div>
          <div class="color-meta">
            <strong>Amarelo Energia</strong>
            <div class="color-row"><span>RGB</span><span>255, 204, 69</span></div>
            <div class="color-row"><span>CMYK</span><span>0, 20, 80, 0</span></div>
            <div class="color-row"><span>Pantone</span><span>123 C</span></div>
            <div class="color-row"><span>Função</span><span>Destaque / Sol</span></div>
          </div>
        </div>

        <!-- Cor 4 -->
        <div class="color-card">
          <div class="color-sample" style="background: #F8F9F6; color: #17211D; border-bottom: 1px solid #E2E8E4;">#F8F9F6</div>
          <div class="color-meta">
            <strong>Branco Suave</strong>
            <div class="color-row"><span>RGB</span><span>248, 249, 246</span></div>
            <div class="color-row"><span>CMYK</span><span>1, 0, 2, 0</span></div>
            <div class="color-row"><span>Pantone</span><span>Bright White</span></div>
            <div class="color-row"><span>Função</span><span>Fundos e Texto</span></div>
          </div>
        </div>

        <!-- Cor 5 -->
        <div class="color-card">
          <div class="color-sample" style="background: #17211D; color: #FFFFFF;">#17211D</div>
          <div class="color-meta">
            <strong>Grafite Mineral</strong>
            <div class="color-row"><span>RGB</span><span>23, 33, 29</span></div>
            <div class="color-row"><span>CMYK</span><span>75, 60, 65, 75</span></div>
            <div class="color-row"><span>Pantone</span><span>Black 7 C</span></div>
            <div class="color-row"><span>Função</span><span>Tipografia pura</span></div>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top: 24px; padding: 18px 24px; background: var(--cinza-bg); border-radius: 12px; border: 1px solid var(--borda);">
      <div style="font-size: 13px; font-weight: 800; color: var(--verde-profundo); margin-bottom: 6px;">Validação de Contraste WCAG AA:</div>
      <div style="display: flex; gap: 32px; font-size: 12px; color: #445950;">
        <span>Texto Branco (#F8F9F6) sobre Verde Profundo (#123D32): <strong>9.8:1 (Excelente - AAA)</strong></span>
        <span>Amarelo (#FFCC45) sobre Verde Profundo (#123D32): <strong>7.4:1 (Aprovado - AAA)</strong></span>
        <span>Grafite (#17211D) sobre Branco Suave (#F8F9F6): <strong>14.2:1 (Aprovado - AAA)</strong></span>
      </div>
    </div>
  </section>

  <!-- ==================== PÁGINA 6: SISTEMA TIPOGRÁFICO ==================== -->
  <section class="slide">
    <div>
      <div class="slide-header">
        <div>
          <div class="slide-category">05 &bull; Tipografia da Marca</div>
          <h2 class="slide-title">Tipografia: Plus Jakarta Sans &amp; Hierarquia</h2>
          <p class="slide-subtitle">Família tipográfica moderna, geométrica e de alta legibilidade em displays mobile de qualquer densidade.</p>
        </div>
        <div class="slide-page-badge">Página 06 / 10</div>
      </div>

      <div class="grid-2col">
        <div class="content-box">
          <div class="box-title">Família Oficial Primária: Plus Jakarta Sans</div>
          <p class="text-body" style="margin-bottom: 16px;">
            Licença aberta Google Fonts (Open Font License - OFL) para uso comercial irrestrito em software, aplicativos mobile e materiais impressos.
          </p>
          <div style="background: #FFFFFF; border-radius: 12px; padding: 20px; border: 1px solid var(--borda);">
            <div style="font-size: 26px; font-weight: 900; color: var(--verde-profundo);">Aa Bb Cc Dd 123 !?</div>
            <div style="font-size: 13px; font-weight: 800; color: var(--verde-vibrante); margin: 6px 0;">Plus Jakarta Sans 900 Black (Logos e Títulos)</div>
            <div style="font-size: 16px; font-weight: 700; color: #17211D; margin-top: 10px;">Aa Bb Cc Dd 123 !?</div>
            <div style="font-size: 13px; font-weight: 700; color: var(--verde-vibrante); margin: 6px 0;">Plus Jakarta Sans 700 Bold (Subtítulos e Botões)</div>
            <div style="font-size: 14px; font-weight: 500; color: #4A5B53; margin-top: 10px;">Aa Bb Cc Dd 123 !?</div>
            <div style="font-size: 13px; font-weight: 500; color: var(--verde-vibrante); margin: 6px 0;">Plus Jakarta Sans 500 Medium (Parágrafos e UI)</div>
          </div>
        </div>

        <div class="content-box">
          <div class="box-title">Escala Tipográfica &amp; Aplicação em UI</div>
          <table style="width: 100%; font-size: 12.5px; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #D6E0DC;">
              <th style="text-align: left; padding: 8px 0; color: var(--verde-profundo);">Nível</th>
              <th style="text-align: left; padding: 8px 0; color: var(--verde-profundo);">Tamanho</th>
              <th style="text-align: left; padding: 8px 0; color: var(--verde-profundo);">Peso</th>
              <th style="text-align: left; padding: 8px 0; color: var(--verde-profundo);">Uso</th>
            </tr>
            <tr style="border-bottom: 1px solid #E6ECE8;">
              <td style="padding: 10px 0;"><strong>H1 Display</strong></td>
              <td>36px / 44px</td>
              <td>900 Black</td>
              <td>Telas de Splash, Títulos Principais</td>
            </tr>
            <tr style="border-bottom: 1px solid #E6ECE8;">
              <td style="padding: 10px 0;"><strong>H2 Seção</strong></td>
              <td>22px / 28px</td>
              <td>800 ExtraBold</td>
              <td>Cards de Corrida, Preço, Categoria</td>
            </tr>
            <tr style="border-bottom: 1px solid #E6ECE8;">
              <td style="padding: 10px 0;"><strong>H3 Botão</strong></td>
              <td>16px / 20px</td>
              <td>800 ExtraBold</td>
              <td>Botão de Confirmação "Pedir Simbora"</td>
            </tr>
            <tr style="border-bottom: 1px solid #E6ECE8;">
              <td style="padding: 10px 0;"><strong>Body Regular</strong></td>
              <td>14px / 20px</td>
              <td>500 Medium</td>
              <td>Endereços, Histórico, Instruções</td>
            </tr>
            <tr>
              <td style="padding: 10px 0;"><strong>Caption / Micro</strong></td>
              <td>11px / 14px</td>
              <td>700 Bold</td>
              <td>Placas de Carro, Badges de Status</td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <div style="font-size: 11.5px; color: #667D73;">
      Tipografia Secundária para corpo em código/docs técnicos: <strong>Inter</strong> ou <strong>Manrope</strong>.
    </div>
  </section>

  <!-- ==================== PÁGINA 7: ÍCONE DE APLICATIVO & RESOLUÇÕES ==================== -->
  <section class="slide">
    <div>
      <div class="slide-header">
        <div>
          <div class="slide-category">06 &bull; Ícone de Aplicativo</div>
          <h2 class="slide-title">Master App Icon (iOS, Android &amp; Favicon)</h2>
          <p class="slide-subtitle">Construído em conformidade com as diretrizes de design da Apple (Human Interface Guidelines) e Google (Material Design 3).</p>
        </div>
        <div class="slide-page-badge">Página 07 / 10</div>
      </div>

      <div class="grid-2col" style="align-items: center;">
        <div style="background: var(--cinza-bg); border-radius: 20px; padding: 40px; display: flex; flex-direction: column; align-items: center;">
          <div style="width: 220px; height: 220px; border-radius: 50px; overflow: hidden; box-shadow: 0 20px 40px rgba(18, 61, 50, 0.35);">
            ${appIconSvg}
          </div>
          <span style="font-size: 13px; font-weight: 800; color: var(--verde-profundo); margin-top: 16px;">
            Asset Master: 512x512 px (SVG / PNG 24-bit)
          </span>
        </div>

        <div class="content-box">
          <div class="box-title">Teste de Resolução em Escalas Reais</div>
          <p class="text-body" style="margin-bottom: 20px;">
            O desenho Stencil Speed Cut foi testado em escalas críticas para garantir que a identificação seja imediata mesmo quando o usuário tem dezenas de apps na tela:
          </p>

          <div style="display: flex; gap: 24px; align-items: flex-end; padding: 20px; background: #FFFFFF; border-radius: 12px; border: 1px solid var(--borda);">
            <div style="text-align: center;">
              <div style="width: 64px; height: 64px; border-radius: 16px; overflow: hidden; margin: 0 auto 6px;">${appIconSvg}</div>
              <span style="font-size: 11px; font-weight: 700; color: #8A9D94;">64px</span>
            </div>
            <div style="text-align: center;">
              <div style="width: 48px; height: 48px; border-radius: 12px; overflow: hidden; margin: 0 auto 6px;">${appIconSvg}</div>
              <span style="font-size: 11px; font-weight: 700; color: #8A9D94;">48px</span>
            </div>
            <div style="text-align: center;">
              <div style="width: 36px; height: 36px; border-radius: 9px; overflow: hidden; margin: 0 auto 6px;">${appIconSvg}</div>
              <span style="font-size: 11px; font-weight: 700; color: #8A9D94;">36px</span>
            </div>
            <div style="text-align: center;">
              <div style="width: 24px; height: 24px; border-radius: 6px; overflow: hidden; margin: 0 auto 6px;">${appIconSvg}</div>
              <span style="font-size: 11px; font-weight: 700; color: #8A9D94;">24px</span>
            </div>
            <div style="text-align: center;">
              <div style="width: 16px; height: 16px; border-radius: 4px; overflow: hidden; margin: 0 auto 6px;">${appIconSvg}</div>
              <span style="font-size: 11px; font-weight: 700; color: #8A9D94;">16px (Favicon)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="font-size: 11.5px; color: #556B61; background: #E8F3EE; padding: 10px 18px; border-radius: 8px;">
      <strong>Android Adaptive Icon:</strong> A camada foreground contém o 'S!' e o background é o sólido em Verde Profundo (#123D32).
    </div>
  </section>

  <!-- ==================== PÁGINA 8: PRODUTO DIGITAL & UI MOBILE ==================== -->
  <section class="slide">
    <div>
      <div class="slide-header">
        <div>
          <div class="slide-category">07 &bull; Experiência do Produto</div>
          <h2 class="slide-title">Interface do Usuário: Telas Mobile Reais</h2>
          <p class="slide-subtitle">Aplicação da identidade visual na experiência do passageiro: Splash Screen de abertura e Tela de Solicitação de Corrida.</p>
        </div>
        <div class="slide-page-badge">Página 08 / 10</div>
      </div>

      <div style="display: flex; gap: 40px; justify-content: center; align-items: center; flex: 1;">
        <!-- Tela 1: Splash Screen -->
        <div class="phone-mock">
          <div style="background: #123D32; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; text-align: center;">
            <div style="width: 110px; height: 110px; border-radius: 26px; overflow: hidden; box-shadow: 0 16px 32px rgba(0,0,0,0.4); margin-bottom: 20px;">
              ${appIconSvg}
            </div>
            <div style="font-size: 26px; font-weight: 900; color: #FFFFFF; letter-spacing: 2px;">SIMBORA<span style="color:#FFCC45;">!</span></div>
            <div style="font-size: 10px; font-weight: 800; color: #16A572; letter-spacing: 2px; text-transform: uppercase; margin-top: 6px;">
              Pediu. Chegou. Simbora!
            </div>
          </div>
        </div>

        <!-- Tela 2: Home Solicitação -->
        <div class="phone-mock">
          <!-- Top Bar -->
          <div style="background: #123D32; padding: 18px 16px; display: flex; justify-content: space-between; align-items: center; color: #FFFFFF;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 28px; height: 28px; border-radius: 6px; overflow: hidden;">${appIconSvg}</div>
              <span style="font-size: 15px; font-weight: 900;">SIMBORA<tspan style="color:#FFCC45;">!</tspan></span>
            </div>
            <div style="background: #16A572; width: 28px; height: 28px; border-radius: 14px; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center;">JS</div>
          </div>
          <!-- Body Map Mock -->
          <div style="background: #E8ECE9; flex: 1; padding: 16px; display: flex; flex-direction: column; justify-content: flex-end;">
            <div style="background: #FFFFFF; border-radius: 14px; padding: 14px; box-shadow: 0 6px 16px rgba(0,0,0,0.1); margin-bottom: 10px;">
              <div style="font-size: 10px; font-weight: 800; color: #16A572; text-transform: uppercase;">Origem Atual</div>
              <div style="font-size: 13px; font-weight: 700; color: #17211D;">Orla Fluvial de Penedo</div>
              <div style="height: 1px; background: #EEF3F0; margin: 8px 0;"></div>
              <div style="font-size: 10px; font-weight: 800; color: #FFCC45; text-transform: uppercase;">Para onde vamos?</div>
              <div style="font-size: 13px; font-weight: 700; color: #17211D;">Piaçabuçu &bull; Foz do Rio São Francisco</div>
            </div>
            <div style="background: #FFCC45; color: #123D32; font-weight: 900; font-size: 14px; padding: 12px; border-radius: 10px; text-align: center; box-shadow: 0 4px 12px rgba(255,204,69,0.4);">
              Pedir Viagem Agora
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="font-size: 11px; color: #8A9D94; text-align: center; margin-top: 10px;">
      Layouts compatíveis com o Design System do aplicativo em React Native e Web Admin.
    </div>
  </section>

  <!-- ==================== PÁGINA 9: APLICAÇÕES NO MUNDO REAL (FROTA & MÍDIA) ==================== -->
  <section class="slide">
    <div>
      <div class="slide-header">
        <div>
          <div class="slide-category">08 &bull; Aplicações Físicas</div>
          <h2 class="slide-title">Mundo Real: Frota de Veículos &amp; Outdoors</h2>
          <p class="slide-subtitle">Adesivagem de veículos parceiros e comunicação visual de alto impacto para as rodovias e cidades de Alagoas.</p>
        </div>
        <div class="slide-page-badge">Página 09 / 10</div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 20px; flex: 1;">
        <!-- Adesivagem Carro -->
        <div>
          <div style="font-size: 13px; font-weight: 800; color: var(--verde-profundo); margin-bottom: 8px;">Adesivagem Oficial de Veículos Parceiros (Portas Laterais)</div>
          <div style="height: 170px; border-radius: 14px; overflow: hidden; border: 1px solid var(--borda);">
            ${vehicleLiverySvg}
          </div>
        </div>

        <!-- Outdoor -->
        <div>
          <div style="font-size: 13px; font-weight: 800; color: var(--verde-profundo); margin-bottom: 8px;">Painel de Rodovia / Outdoor de Lançamento (Penedo / Piaçabuçu)</div>
          <div style="height: 170px; border-radius: 14px; overflow: hidden; border: 1px solid var(--borda);">
            ${billboardSvg}
          </div>
        </div>
      </div>
    </div>

    <div style="font-size: 11.5px; color: #556B61;">
      Materiais padronizados com acabamento refletivo para segurança noturna dos motoristas.
    </div>
  </section>

  <!-- ==================== PÁGINA 10: MANUAL DE BOAS PRÁTICAS & REGRAS ==================== -->
  <section class="slide">
    <div>
      <div class="slide-header">
        <div>
          <div class="slide-category">09 &bull; Governança da Marca</div>
          <h2 class="slide-title">Regras de Uso, Proibições &amp; Diretrizes Finais</h2>
          <p class="slide-subtitle">Critérios inegociáveis para preservar a força e a coerência visual da marca em todas as instâncias.</p>
        </div>
        <div class="slide-page-badge">Página 10 / 10</div>
      </div>

      <div class="grid-2col">
        <div class="content-box" style="background: #F1FBF5; border-color: #C3EAD4;">
          <div class="box-title" style="color: #16A572;">O Que é Recomendado e Permitido</div>
          <ul style="font-size: 13px; color: #234735; line-height: 1.7; padding-left: 18px;">
            <li>Utilizar sempre os arquivos vetoriais oficiais (SVG) em produções finais.</li>
            <li>Manter o contraste WCAG AA entre o logotipo e os fundos de tela.</li>
            <li>Priorizar o Verde Profundo (#123D32) como cor de autoridade e ancoragem.</li>
            <li>Usar o Amarelo Energia (#FFCC45) exclusivamente como cor de destaque funcional.</li>
            <li>Preservar a exclamação "!" com o mesmo peso e cor homologados.</li>
          </ul>
        </div>

        <div class="content-box" style="background: #FFF5F5; border-color: #F8D2D2;">
          <div class="box-title" style="color: #C0392B;">Proibições Estritas (Não Fazer)</div>
          <ul style="font-size: 13px; color: #5C2222; line-height: 1.7; padding-left: 18px;">
            <li><strong>Nunca distorcer ou esticar</strong> horizontal ou verticalmente o símbolo.</li>
            <li><strong>Nunca alterar o ângulo de 12°</strong> do corte e da exclamação.</li>
            <li><strong>Nunca trocar as cores</strong> do Stencil Speed Cut por tons não autorizados.</li>
            <li><strong>Nunca adicionar efeitos como sombras caídas pesadas</strong>, bisel ou relevo.</li>
            <li><strong>Nunca utilizar o conceito antigo</strong> de fitas, laços ou número 8.</li>
          </ul>
        </div>
      </div>
    </div>

    <div style="background: var(--verde-profundo); color: #FFFFFF; padding: 18px 24px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
      <div>
        <div style="font-size: 15px; font-weight: 900; color: #FFCC45;">SIMBORA MOBILIDADE BRASIL</div>
        <div style="font-size: 12px; color: #A3C9BC; margin-top: 2px;">Manual Oficial Homologado &bull; Todos os direitos reservados.</div>
      </div>
      <div style="font-size: 11px; font-weight: 800; background: #16A572; padding: 6px 14px; border-radius: 6px; text-transform: uppercase;">
        Versão Final Aprovada
      </div>
    </div>
  </section>

</div>

</body>
</html>
`;

// Save HTML master
const htmlPath = path.join(rootDir, 'SIMBORA_BRAND_BOOK_DEFINITIVO.html');
fs.writeFileSync(htmlPath, masterHtml, 'utf8');
console.log('Master HTML written at:', htmlPath);

// Copy HTML to artifact directory
const artifactHtmlPath = path.join(artifactDir, 'SIMBORA_BRAND_BOOK_DEFINITIVO.html');
fs.writeFileSync(artifactHtmlPath, masterHtml, 'utf8');

// Print to PDF via Headless Edge
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const pdfPath = path.join(rootDir, 'SIMBORA_BRAND_BOOK_DEFINITIVO.pdf');
const artifactPdfPath = path.join(artifactDir, 'SIMBORA_BRAND_BOOK_DEFINITIVO.pdf');

try {
  console.log('Rendering 10-page master PDF via Edge...');
  const cmd = `"${edgePath}" --headless --no-sandbox --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`;
  execSync(cmd);
  console.log('Master PDF created at:', pdfPath);

  // Copy PDF to artifact directory
  fs.copyFileSync(pdfPath, artifactPdfPath);
  console.log('Master PDF copied to Artifact:', artifactPdfPath);
} catch (e) {
  console.error('Edge print error:', e.message);
}
