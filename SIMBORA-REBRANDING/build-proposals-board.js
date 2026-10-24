const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const proposalsDir = 'C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING\\03-LOGO\\new-proposals';
const outputHtml = 'C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING\\03-LOGO\\simbora-6-propostas-board.html';
const outputPdf = 'C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING\\03-LOGO\\SIMBORA_6_PROPOSTAS_VISUAIS.pdf';
const artifactDir = 'C:\\Users\\winc\\.gemini\\antigravity\\brain\\b5a5ba79-6e91-45b2-8392-8c29d8da9dcc';

console.log('Building 6 Proposals Master Comparison Board...');

// Helper to read SVG content cleaned of XML declaration if any
function getSvg(filename) {
  const fullPath = path.join(proposalsDir, filename);
  let content = fs.readFileSync(fullPath, 'utf8');
  return content.replace(/<\?xml[^>]*\?>/g, '').trim();
}

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SIMBORA — Prancha Comparativa de Identidade Visual (6 Propostas)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@600;700;800;900&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --verde-profundo: #123D32;
    --verde-vibrante: #16A572;
    --amarelo-energia: #FFCC45;
    --branco-suave: #F8F9F6;
    --grafite: #17211D;
    --cinza-borda: #E2E8E4;
    --cinza-bg: #F1F4F2;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0B110E;
    color: #17211D;
    line-height: 1.4;
    -webkit-font-smoothing: antialiased;
  }

  .deck-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 30px 20px 80px;
  }

  /* SLIDE / CARD STYLING */
  .slide {
    background: #FFFFFF;
    border-radius: 20px;
    margin-bottom: 40px;
    padding: 40px 48px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.35);
    page-break-after: always;
    break-after: page;
    position: relative;
    overflow: hidden;
  }

  /* COVER SLIDE */
  .slide-cover {
    background: linear-gradient(135deg, #123D32 0%, #0D2B23 100%);
    color: #F8F9F6;
    min-height: 620px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid rgba(22, 165, 114, 0.3);
  }

  .cover-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    padding-bottom: 24px;
  }

  .brand-pill {
    background: rgba(22, 165, 114, 0.2);
    border: 1px solid #16A572;
    color: #FFCC45;
    padding: 6px 16px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .cover-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 54px;
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -1px;
    color: #FFFFFF;
    margin: 30px 0 16px;
  }

  .cover-title span {
    color: #FFCC45;
  }

  .cover-subtitle {
    font-size: 20px;
    color: #A3C9BC;
    max-width: 850px;
    line-height: 1.5;
  }

  .palette-bar {
    display: flex;
    gap: 16px;
    margin-top: 40px;
    padding-top: 30px;
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .swatch {
    flex: 1;
    height: 70px;
    border-radius: 12px;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    font-size: 11px;
    font-weight: 700;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }

  /* PROPOSAL HEADER */
  .proposal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 2px solid var(--cinza-bg);
  }

  .proposal-badge {
    background: var(--verde-profundo);
    color: var(--amarelo-energia);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 6px;
    display: inline-block;
    margin-bottom: 8px;
  }

  .proposal-title {
    font-size: 32px;
    font-weight: 900;
    color: var(--verde-profundo);
    letter-spacing: -0.5px;
  }

  .proposal-concept {
    font-size: 15px;
    color: #4A5B53;
    max-width: 680px;
    margin-top: 6px;
  }

  .proposal-tagline {
    background: #E8F5EE;
    color: var(--verde-vibrante);
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    border: 1px solid #C4E3D2;
    text-align: right;
  }

  /* PROPOSAL GRID LAYOUT */
  .proposal-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }

  .main-showcase {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .logo-box {
    background: #FFFFFF;
    border: 2px solid var(--cinza-borda);
    border-radius: 16px;
    padding: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    position: relative;
  }

  .logo-box.dark {
    background: var(--verde-profundo);
    border-color: var(--verde-profundo);
  }

  .box-label {
    position: absolute;
    top: 12px;
    left: 16px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #8C9E95;
  }

  .logo-box.dark .box-label {
    color: #7AA897;
  }

  .side-showcase {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .app-icon-card {
    background: var(--cinza-bg);
    border: 1px solid var(--cinza-borda);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .app-icon-wrapper {
    width: 140px;
    height: 140px;
    border-radius: 32px;
    box-shadow: 0 16px 32px rgba(18, 61, 50, 0.25);
    overflow: hidden;
    margin: 10px 0 14px;
    transition: transform 0.2s;
  }

  .micro-test-row {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-top: 10px;
    padding: 8px 16px;
    background: #FFFFFF;
    border-radius: 8px;
    border: 1px solid var(--cinza-borda);
  }

  .mono-box {
    background: #FFFFFF;
    border: 1px solid var(--cinza-borda);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 140px;
    position: relative;
  }

  /* COMPARISON MATRIX SLIDE */
  .matrix-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 24px;
  }

  .matrix-card {
    border: 2px solid var(--cinza-borda);
    border-radius: 14px;
    padding: 20px;
    background: #FFFFFF;
    text-align: center;
    transition: border-color 0.2s;
  }

  .matrix-card:hover {
    border-color: var(--verde-vibrante);
  }

  .matrix-card .p-num {
    font-size: 11px;
    font-weight: 800;
    color: var(--verde-vibrante);
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .matrix-card .p-name {
    font-size: 18px;
    font-weight: 800;
    color: var(--verde-profundo);
    margin: 4px 0 14px;
  }

  .matrix-icon {
    width: 90px;
    height: 90px;
    border-radius: 20px;
    margin: 0 auto 14px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    overflow: hidden;
  }

  .matrix-logo-preview {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    border-top: 1px solid var(--cinza-bg);
    padding-top: 10px;
  }

  /* PRINT RULES FOR LANDSCAPE PDF */
  @page {
    size: A4 landscape;
    margin: 8mm;
  }

  @media print {
    body { background: #FFFFFF; }
    .deck-container { padding: 0; max-width: 100%; }
    .slide {
      box-shadow: none;
      border: 1px solid #D0D8D4;
      margin-bottom: 0;
      min-height: 190mm;
      padding: 16mm;
      page-break-after: always;
      break-after: page;
    }
    .slide-cover {
      min-height: 190mm;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .logo-box.dark {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>
</head>
<body>

<div class="deck-container">

  <!-- ==================== SLIDE 0: CAPA DA APRESENTAÇÃO ==================== -->
  <section class="slide slide-cover">
    <div class="cover-header">
      <div class="brand-pill">SIMBORA MOBILIDADE BRASIL</div>
      <div style="font-size: 13px; font-weight: 700; color: #FFCC45; letter-spacing: 1px;">DIREÇÃO DE ARTE &amp; BRANDING</div>
    </div>

    <div>
      <h1 class="cover-title">Prancha Comparativa<br><span>6 Propostas de Marca</span></h1>
      <p class="cover-subtitle">
        Estudo visual estrito desenvolvido sob novas lógicas formais independentes.
        Descarte completo do conceito de fita / 8 / loop infinito. Apresentação padronizada
        para validação e escolha formal.
      </p>
    </div>

    <div>
      <div style="font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #7AA897; margin-bottom: 12px;">
        Paleta Oficial Preservada &amp; Slogan Oficial: "Pediu. Chegou. Simbora!"
      </div>
      <div class="palette-bar">
        <div class="swatch" style="background: #123D32; color: #FFFFFF;">
          <span>#123D32</span>
          <span>Verde Profundo</span>
        </div>
        <div class="swatch" style="background: #16A572; color: #FFFFFF;">
          <span>#16A572</span>
          <span>Verde Vibrante</span>
        </div>
        <div class="swatch" style="background: #FFCC45; color: #17211D;">
          <span>#FFCC45</span>
          <span>Amarelo Energia</span>
        </div>
        <div class="swatch" style="background: #F8F9F6; color: #17211D; border: 1px solid rgba(0,0,0,0.1);">
          <span>#F8F9F6</span>
          <span>Branco Suave</span>
        </div>
        <div class="swatch" style="background: #17211D; color: #FFFFFF;">
          <span>#17211D</span>
          <span>Grafite Mineral</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== PROPOSTA 1: WORDMARK PERSONALIZADO ==================== -->
  <section class="slide">
    <div class="proposal-header">
      <div>
        <div class="proposal-badge">Proposta 01 &bull; Tipografia Proprietária</div>
        <h2 class="proposal-title">Wordmark Solar Personalizado (Sem Símbolo)</h2>
        <p class="proposal-concept">
          Lettering geométrico com corte angular no 'M' e ponto solar de energia perfeitamente centralizado no 'O'.
          Identidade limpa, madura e imponente, sem necessidade de ícone externo.
        </p>
      </div>
      <div class="proposal-tagline">
        Slogan: Pediu. Chegou. Simbora!
      </div>
    </div>

    <div class="proposal-grid">
      <div class="main-showcase">
        <!-- Logo Principal Fundo Claro -->
        <div class="logo-box">
          <span class="box-label">Aplicação Principal &bull; Fundo Claro</span>
          <div style="width: 100%; max-width: 580px;">
            ${getSvg('proposal-1-wordmark.svg')}
          </div>
        </div>

        <!-- Logo Versão Monocromática / Fundo Escuro -->
        <div class="logo-box dark">
          <span class="box-label">Aplicação Invertida &bull; Verde Profundo (#123D32)</span>
          <div style="width: 100%; max-width: 580px; filter: brightness(0) invert(1);">
            ${getSvg('proposal-1-wordmark.svg')}
          </div>
        </div>
      </div>

      <div class="side-showcase">
        <!-- App Icon -->
        <div class="app-icon-card">
          <span class="box-label" style="position: static; margin-bottom: 8px;">Ícone de Aplicativo (iOS / Android)</span>
          <div class="app-icon-wrapper">
            ${getSvg('proposal-1-app-icon.svg')}
          </div>
          <span style="font-size: 12px; font-weight: 700; color: #4A5B53;">Lettermark S. + Ponto Solar</span>

          <!-- Teste 24px -->
          <div class="micro-test-row">
            <span style="font-size: 11px; font-weight: 700; color: #8C9E95;">24px:</span>
            <div style="width: 24px; height: 24px; border-radius: 5px; overflow: hidden;">
              ${getSvg('proposal-1-app-icon.svg')}
            </div>
            <span style="font-size: 11px; font-weight: 700; color: #8C9E95;">36px:</span>
            <div style="width: 36px; height: 36px; border-radius: 8px; overflow: hidden;">
              ${getSvg('proposal-1-app-icon.svg')}
            </div>
          </div>
        </div>

        <!-- Monocromático Puro -->
        <div class="mono-box">
          <span class="box-label">Validação Monocromática P&amp;B</span>
          <div style="width: 100%; max-width: 260px; filter: grayscale(1) contrast(200%);">
            ${getSvg('proposal-1-app-icon.svg')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== PROPOSTA 2: SÍMBOLO ABSTRATO INDEPENDENTE ==================== -->
  <section class="slide">
    <div class="proposal-header">
      <div>
        <div class="proposal-badge">Proposta 02 &bull; Abstração Geométrica Pura</div>
        <h2 class="proposal-title">The Quadrant Aperture (Símbolo Abstrato)</h2>
        <p class="proposal-concept">
          4 quadrantes sólidos em oposição geométrica convergindo para uma abertura solar central.
          Lógica modernista no estilo Chermayeff &amp; Geismar e Pentagram. Memorabilidade imediata.
        </p>
      </div>
      <div class="proposal-tagline">
        Slogan: Pediu. Chegou. Simbora!
      </div>
    </div>

    <div class="proposal-grid">
      <div class="main-showcase">
        <div class="logo-box">
          <span class="box-label">Aplicação Horizontal &bull; Fundo Claro</span>
          <div style="width: 100%; max-width: 600px;">
            ${getSvg('proposal-2-abstract-aperture.svg')}
          </div>
        </div>

        <div class="logo-box dark">
          <span class="box-label">Aplicação Invertida &bull; Verde Profundo (#123D32)</span>
          <div style="width: 100%; max-width: 600px; filter: brightness(0) invert(1);">
            ${getSvg('proposal-2-abstract-aperture.svg')}
          </div>
        </div>
      </div>

      <div class="side-showcase">
        <div class="app-icon-card">
          <span class="box-label" style="position: static; margin-bottom: 8px;">Ícone de Aplicativo (iOS / Android)</span>
          <div class="app-icon-wrapper">
            ${getSvg('proposal-2-app-icon.svg')}
          </div>
          <span style="font-size: 12px; font-weight: 700; color: #4A5B53;">Abertura Central Quadrante</span>

          <div class="micro-test-row">
            <span style="font-size: 11px; font-weight: 700; color: #8C9E95;">24px:</span>
            <div style="width: 24px; height: 24px; border-radius: 5px; overflow: hidden;">
              ${getSvg('proposal-2-app-icon.svg')}
            </div>
            <span style="font-size: 11px; font-weight: 700; color: #8C9E95;">36px:</span>
            <div style="width: 36px; height: 36px; border-radius: 8px; overflow: hidden;">
              ${getSvg('proposal-2-app-icon.svg')}
            </div>
          </div>
        </div>

        <div class="mono-box">
          <span class="box-label">Validação Monocromática P&amp;B</span>
          <div style="width: 100%; max-width: 260px; filter: grayscale(1) contrast(200%);">
            ${getSvg('proposal-2-app-icon.svg')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== PROPOSTA 3: MONOGRAMA GEOMÉTRICO ORIGINAL ==================== -->
  <section class="slide">
    <div class="proposal-header">
      <div>
        <div class="proposal-badge">Proposta 03 &bull; Geometria Construtivista</div>
        <h2 class="proposal-title">The Architectural Monogram (Chanfro 45°)</h2>
        <p class="proposal-concept">
          Construção monolítica e arquitetônica em 45 graus. Zero curvas, zero fitas, zero infinito.
          Força estrutural de alta solidez, inspirada na arquitetura brutalista e modular contemporânea.
        </p>
      </div>
      <div class="proposal-tagline">
        Slogan: Pediu. Chegou. Simbora!
      </div>
    </div>

    <div class="proposal-grid">
      <div class="main-showcase">
        <div class="logo-box">
          <span class="box-label">Aplicação Horizontal &bull; Fundo Claro</span>
          <div style="width: 100%; max-width: 600px;">
            ${getSvg('proposal-3-architectural-monogram.svg')}
          </div>
        </div>

        <div class="logo-box dark">
          <span class="box-label">Aplicação Invertida &bull; Verde Profundo (#123D32)</span>
          <div style="width: 100%; max-width: 600px; filter: brightness(0) invert(1);">
            ${getSvg('proposal-3-architectural-monogram.svg')}
          </div>
        </div>
      </div>

      <div class="side-showcase">
        <div class="app-icon-card">
          <span class="box-label" style="position: static; margin-bottom: 8px;">Ícone de Aplicativo (iOS / Android)</span>
          <div class="app-icon-wrapper">
            ${getSvg('proposal-3-app-icon.svg')}
          </div>
          <span style="font-size: 12px; font-weight: 700; color: #4A5B53;">Monograma Construtivista 45°</span>

          <div class="micro-test-row">
            <span style="font-size: 11px; font-weight: 700; color: #8C9E95;">24px:</span>
            <div style="width: 24px; height: 24px; border-radius: 5px; overflow: hidden;">
              ${getSvg('proposal-3-app-icon.svg')}
            </div>
            <span style="font-size: 11px; font-weight: 700; color: #8C9E95;">36px:</span>
            <div style="width: 36px; height: 36px; border-radius: 8px; overflow: hidden;">
              ${getSvg('proposal-3-app-icon.svg')}
            </div>
          </div>
        </div>

        <div class="mono-box">
          <span class="box-label">Validação Monocromática P&amp;B</span>
          <div style="width: 100%; max-width: 260px; filter: grayscale(1) contrast(200%);">
            ${getSvg('proposal-3-app-icon.svg')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== PROPOSTA 4: IDENTIDADE TIPOGRÁFICA EXPRESSIVA ==================== -->
  <section class="slide">
    <div class="proposal-header">
      <div>
        <div class="proposal-badge">Proposta 04 &bull; Tipografia Expressiva &amp; Display</div>
        <h2 class="proposal-title">The Energetic Display &bull; SIMBORA!</h2>
        <p class="proposal-concept">
          Tipografia ultra-bold, calorosa e vibrante com ponto de exclamação em Amarelo Energia.
          Captura a espontaneidade brasileira do chamado "Simbora!". Alta proximidade e energia popular.
        </p>
      </div>
      <div class="proposal-tagline">
        Slogan: Pediu. Chegou. Simbora!
      </div>
    </div>

    <div class="proposal-grid">
      <div class="main-showcase">
        <div class="logo-box">
          <span class="box-label">Aplicação Horizontal &bull; Fundo Claro</span>
          <div style="width: 100%; max-width: 600px;">
            ${getSvg('proposal-4-expressive-type.svg')}
          </div>
        </div>

        <div class="logo-box dark">
          <span class="box-label">Aplicação Invertida &bull; Verde Profundo (#123D32)</span>
          <div style="width: 100%; max-width: 600px; filter: brightness(0) invert(1);">
            ${getSvg('proposal-4-expressive-type.svg')}
          </div>
        </div>
      </div>

      <div class="side-showcase">
        <div class="app-icon-card">
          <span class="box-label" style="position: static; margin-bottom: 8px;">Ícone de Aplicativo (iOS / Android)</span>
          <div class="app-icon-wrapper">
            ${getSvg('proposal-4-app-icon.svg')}
          </div>
          <span style="font-size: 12px; font-weight: 700; color: #4A5B53;">Lettermark S! Expressivo</span>

          <div class="micro-test-row">
            <span style="font-size: 11px; font-weight: 700; color: #8C9E95;">24px:</span>
            <div style="width: 24px; height: 24px; border-radius: 5px; overflow: hidden;">
              ${getSvg('proposal-4-app-icon.svg')}
            </div>
            <span style="font-size: 11px; font-weight: 700; color: #8C9E95;">36px:</span>
            <div style="width: 36px; height: 36px; border-radius: 8px; overflow: hidden;">
              ${getSvg('proposal-4-app-icon.svg')}
            </div>
          </div>
        </div>

        <div class="mono-box">
          <span class="box-label">Validação Monocromática P&amp;B</span>
          <div style="width: 100%; max-width: 260px; filter: grayscale(1) contrast(200%);">
            ${getSvg('proposal-4-app-icon.svg')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== PROPOSTA 5: CONEXÃO E MOBILIDADE ABSTRATA ==================== -->
  <section class="slide">
    <div class="proposal-header">
      <div>
        <div class="proposal-badge">Proposta 05 &bull; Conexão &amp; Mobilidade Não-Literal</div>
        <h2 class="proposal-title">The Transit Nexus (Lente de Encontro)</h2>
        <p class="proposal-concept">
          Dois nós de trânsito (Origem e Destino) em intersecção geométrica pura (Vesica Piscis), gerando
          o ponto de conexão solar em Amarelo Energia. Zero setas literais, zero carros, sofisticação pura.
        </p>
      </div>
      <div class="proposal-tagline">
        Slogan: Pediu. Chegou. Simbora!
      </div>
    </div>

    <div class="proposal-grid">
      <div class="main-showcase">
        <div class="logo-box">
          <span class="box-label">Aplicação Horizontal &bull; Fundo Claro</span>
          <div style="width: 100%; max-width: 600px;">
            ${getSvg('proposal-5-transit-nexus.svg')}
          </div>
        </div>

        <div class="logo-box dark">
          <span class="box-label">Aplicação Invertida &bull; Verde Profundo (#123D32)</span>
          <div style="width: 100%; max-width: 600px; filter: brightness(0) invert(1);">
            ${getSvg('proposal-5-transit-nexus.svg')}
          </div>
        </div>
      </div>

      <div class="side-showcase">
        <div class="app-icon-card">
          <span class="box-label" style="position: static; margin-bottom: 8px;">Ícone de Aplicativo (iOS / Android)</span>
          <div class="app-icon-wrapper">
            ${getSvg('proposal-5-app-icon.svg')}
          </div>
          <span style="font-size: 12px; font-weight: 700; color: #4A5B53;">Nexo de Trânsito &amp; Lente Solar</span>

          <div class="micro-test-row">
            <span style="font-size: 11px; font-weight: 700; color: #8C9E95;">24px:</span>
            <div style="width: 24px; height: 24px; border-radius: 5px; overflow: hidden;">
              ${getSvg('proposal-5-app-icon.svg')}
            </div>
            <span style="font-size: 11px; font-weight: 700; color: #8C9E95;">36px:</span>
            <div style="width: 36px; height: 36px; border-radius: 8px; overflow: hidden;">
              ${getSvg('proposal-5-app-icon.svg')}
            </div>
          </div>
        </div>

        <div class="mono-box">
          <span class="box-label">Validação Monocromática P&amp;B</span>
          <div style="width: 100%; max-width: 260px; filter: grayscale(1) contrast(200%);">
            ${getSvg('proposal-5-app-icon.svg')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== PROPOSTA 6: CONCEITO BRASILEIRO CONTEMPORÂNEO ==================== -->
  <section class="slide">
    <div class="proposal-header">
      <div>
        <div class="proposal-badge">Proposta 06 &bull; Concretismo Brasileiro Contemporâneo</div>
        <h2 class="proposal-title">O Azulejo Modernista (Athos Bulcão &amp; Wollner)</h2>
        <p class="proposal-concept">
          Inspirado na azulejaria e cobogós modernistas brasileiros. Um mosaico geométrico rítmico que une
          herança arquitetônica nacional, rigor técnico e sol nordestino integrado.
        </p>
      </div>
      <div class="proposal-tagline">
        Slogan: Pediu. Chegou. Simbora!
      </div>
    </div>

    <div class="proposal-grid">
      <div class="main-showcase">
        <div class="logo-box">
          <span class="box-label">Aplicação Horizontal &bull; Fundo Claro</span>
          <div style="width: 100%; max-width: 600px;">
            ${getSvg('proposal-6-modernist-tile.svg')}
          </div>
        </div>

        <div class="logo-box dark">
          <span class="box-label">Aplicação Invertida &bull; Verde Profundo (#123D32)</span>
          <div style="width: 100%; max-width: 600px; filter: brightness(0) invert(1);">
            ${getSvg('proposal-6-modernist-tile.svg')}
          </div>
        </div>
      </div>

      <div class="side-showcase">
        <div class="app-icon-card">
          <span class="box-label" style="position: static; margin-bottom: 8px;">Ícone de Aplicativo (iOS / Android)</span>
          <div class="app-icon-wrapper">
            ${getSvg('proposal-6-app-icon.svg')}
          </div>
          <span style="font-size: 12px; font-weight: 700; color: #4A5B53;">Azulejo Modernista Brasileiro</span>

          <div class="micro-test-row">
            <span style="font-size: 11px; font-weight: 700; color: #8C9E95;">24px:</span>
            <div style="width: 24px; height: 24px; border-radius: 5px; overflow: hidden;">
              ${getSvg('proposal-6-app-icon.svg')}
            </div>
            <span style="font-size: 11px; font-weight: 700; color: #8C9E95;">36px:</span>
            <div style="width: 36px; height: 36px; border-radius: 8px; overflow: hidden;">
              ${getSvg('proposal-6-app-icon.svg')}
            </div>
          </div>
        </div>

        <div class="mono-box">
          <span class="box-label">Validação Monocromática P&amp;B</span>
          <div style="width: 100%; max-width: 260px; filter: grayscale(1) contrast(200%);">
            ${getSvg('proposal-6-app-icon.svg')}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== SLIDE FINAL: MATRIZ DE COMPARAÇÃO DIRETA ==================== -->
  <section class="slide" style="min-height: 600px;">
    <div class="proposal-header">
      <div>
        <div class="proposal-badge" style="background: #16A572; color: #FFFFFF;">Matriz Comparativa Final</div>
        <h2 class="proposal-title">Visão Lado a Lado &bull; As 6 Direções Visuais</h2>
        <p class="proposal-concept">
          Avalie e compare diretamente o impacto visual, memorabilidade e legibilidade de cada ícone e marca.
          Aguardando sua escolha para seguirmos com o Brand Book e implementação final.
        </p>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 12px; font-weight: 800; color: #16A572; text-transform: uppercase;">Aguardando Seleção</span>
      </div>
    </div>

    <div class="matrix-grid">
      <!-- 1 -->
      <div class="matrix-card">
        <span class="p-num">Proposta 01</span>
        <h3 class="p-name">Wordmark Solar</h3>
        <div class="matrix-icon">${getSvg('proposal-1-app-icon.svg')}</div>
        <div class="matrix-logo-preview">${getSvg('proposal-1-wordmark.svg')}</div>
      </div>

      <!-- 2 -->
      <div class="matrix-card">
        <span class="p-num">Proposta 02</span>
        <h3 class="p-name">The Quadrant Aperture</h3>
        <div class="matrix-icon">${getSvg('proposal-2-app-icon.svg')}</div>
        <div class="matrix-logo-preview">${getSvg('proposal-2-abstract-aperture.svg')}</div>
      </div>

      <!-- 3 -->
      <div class="matrix-card">
        <span class="p-num">Proposta 03</span>
        <h3 class="p-name">Architectural Monogram</h3>
        <div class="matrix-icon">${getSvg('proposal-3-app-icon.svg')}</div>
        <div class="matrix-logo-preview">${getSvg('proposal-3-architectural-monogram.svg')}</div>
      </div>

      <!-- 4 -->
      <div class="matrix-card">
        <span class="p-num">Proposta 04</span>
        <h3 class="p-name">The Energetic Display</h3>
        <div class="matrix-icon">${getSvg('proposal-4-app-icon.svg')}</div>
        <div class="matrix-logo-preview">${getSvg('proposal-4-expressive-type.svg')}</div>
      </div>

      <!-- 5 -->
      <div class="matrix-card">
        <span class="p-num">Proposta 05</span>
        <h3 class="p-name">The Transit Nexus</h3>
        <div class="matrix-icon">${getSvg('proposal-5-app-icon.svg')}</div>
        <div class="matrix-logo-preview">${getSvg('proposal-5-transit-nexus.svg')}</div>
      </div>

      <!-- 6 -->
      <div class="matrix-card">
        <span class="p-num">Proposta 06</span>
        <h3 class="p-name">O Azulejo Modernista</h3>
        <div class="matrix-icon">${getSvg('proposal-6-app-icon.svg')}</div>
        <div class="matrix-logo-preview">${getSvg('proposal-6-modernist-tile.svg')}</div>
      </div>
    </div>

    <div style="margin-top: 30px; padding: 20px 24px; background: #E8F5EE; border-radius: 12px; border: 1px solid #C4E3D2; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="color: #123D32; font-size: 15px;">Próximo Passo Decisório:</strong>
        <p style="color: #335347; font-size: 13px; margin-top: 2px;">
          Qual das 6 propostas melhor representa a nova fase do SIMBORA? Responda indicando o número desejado (ou eventuais refinamentos pontuais).
        </p>
      </div>
      <div style="background: #123D32; color: #FFCC45; font-weight: 800; font-size: 13px; padding: 10px 20px; border-radius: 8px;">
        DECISÃO HUMANA PENDENTE
      </div>
    </div>
  </section>

</div>

</body>
</html>
`;

fs.writeFileSync(outputHtml, htmlContent, 'utf8');
console.log('HTML generated at:', outputHtml);

// Copy to artifact directory as well
const artifactHtml = path.join(artifactDir, 'SIMBORA_6_PROPOSTAS_VISUAIS.html');
fs.writeFileSync(artifactHtml, htmlContent, 'utf8');
console.log('HTML copied to Artifact directory:', artifactHtml);

// Print to PDF via Edge Headless
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactPdf = path.join(artifactDir, 'SIMBORA_6_PROPOSTAS_VISUAIS.pdf');

try {
  console.log('Rendering PDF via Headless Edge...');
  const cmd = `"${edgePath}" --headless --no-sandbox --disable-gpu --no-pdf-header-footer --print-to-pdf="${outputPdf}" "${outputHtml}"`;
  execSync(cmd);
  console.log('PDF successfully created at:', outputPdf);

  // Copy PDF to artifact directory
  fs.copyFileSync(outputPdf, artifactPdf);
  console.log('PDF copied to Artifact directory:', artifactPdf);
} catch (err) {
  console.error('Error rendering PDF with Edge:', err.message);
}
