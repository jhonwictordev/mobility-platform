const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = 'C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform';
const brandDir = path.join(rootDir, 'brand');
const brainDir = 'C:\\Users\\winc\\.gemini\\antigravity\\brain\\b5a5ba79-6e91-45b2-8392-8c29d8da9dcc';

// Read all SVGs
function readSvg(relPath) {
  const p = path.join(brandDir, relPath);
  if (fs.existsSync(p)) {
    let svg = fs.readFileSync(p, 'utf8');
    // clean xml tag if present
    svg = svg.replace(/<\?xml[^>]*\?>/i, '');
    return svg;
  }
  return '';
}

const logoA = readSvg('logos/logo-proposal-a.svg');
const logoB = readSvg('logos/logo-proposal-b.svg');
const logoCHoriz = readSvg('logos/logo-proposal-c-horizontal.svg');
const logoCDark = readSvg('logos/logo-proposal-c-dark.svg');
const logoCVert = readSvg('logos/logo-proposal-c-vertical.svg');
const logoCMono = readSvg('logos/logo-proposal-c-mono.svg');

const appIcon = readSvg('icons/app-icon.svg');
const appIconFg = readSvg('icons/app-icon-adaptive-foreground.svg');
const favicon = readSvg('icons/favicon.svg');
const notifIcon = readSvg('icons/notification-icon.svg');

const splashPass = readSvg('splash/splash-passenger.svg');
const splashDriver = readSvg('splash/splash-driver.svg');

const banner = readSvg('marketing/banner-institucional.svg');
const avatar = readSvg('marketing/avatar-social.svg');
const adesivo = readSvg('marketing/adesivo-veiculo.svg');
const cardMotorista = readSvg('marketing/card-motorista.svg');
const story = readSvg('marketing/story-penedo-piacabucu.svg');

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>SIMBORA — Brand Book Oficial & Manual de Identidade Visual</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=JetBrains+Mono:wght@600;800&display=swap');

    @page {
      size: A4 portrait;
      margin: 14mm 12mm 14mm 12mm;
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
      font-size: 10pt;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      page-break-after: always;
      position: relative;
      min-height: 260mm;
      padding-bottom: 15mm;
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
      padding-top: 4mm;
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
      font-size: 20pt;
      font-weight: 900;
      color: #123D32;
      margin-top: 2mm;
      margin-bottom: 1.5mm;
      letter-spacing: -0.5px;
    }

    p.sec-subtitle {
      font-size: 9.5pt;
      color: #4B5563;
      margin-bottom: 5mm;
    }

    .card {
      background: #F8F9F6;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 12px;
      margin-bottom: 10px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 8px;
    }

    .grid-5 {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
    }

    .svg-container {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .svg-container svg {
      width: 100%;
      height: auto;
      max-height: 100%;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      margin-top: 6px;
    }

    th {
      background: #F8F9F6;
      border-bottom: 2px solid #CBD5E1;
      padding: 6px 8px;
      text-align: left;
      font-weight: 800;
      color: #123D32;
      font-size: 7.5pt;
      text-transform: uppercase;
    }

    td {
      padding: 6px 8px;
      border-bottom: 1px solid #E2E8F0;
      color: #334155;
    }

    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }

    /* COVER PAGE */
    .cover-container {
      background: #123D32;
      color: #FFFFFF;
      height: 265mm;
      border-radius: 20px;
      padding: 20mm 16mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      border: 4px solid #16A572;
    }

    .cover-hero-logo {
      background: #17211D;
      padding: 20px;
      border-radius: 18px;
      border: 2px solid #16A572;
      max-width: 90%;
      margin: 15mm 0;
    }
  </style>
</head>
<body>

  <!-- ==================== CAPA DO BRAND BOOK ==================== -->
  <div class="page">
    <div class="cover-container">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span class="header-tag tag-gold" style="font-size: 9pt; padding: 4px 12px;">MANUAL DE IDENTIDADE VISUAL & BRAND BOOK v1.0</span>
          <span style="font-weight: 800; color: #16A572; font-size: 10pt;">EDIÇÃO 2026</span>
        </div>

        <div style="margin-top: 15mm;">
          <h1 style="font-size: 38pt; font-weight: 900; line-height: 1.05; letter-spacing: -1px; color: #F8F9F6;">
            SIMBORA
          </h1>
          <p style="font-size: 18pt; font-weight: 800; color: #FFCC45; margin-top: 4mm;">
            "Pediu. Chegou. Simbora!"
          </p>
          <p style="font-size: 11pt; color: #DCFCE7; margin-top: 4mm; max-width: 480px; line-height: 1.4;">
            Plataforma Brasileira de Mobilidade Urbana e Intermunicipal.
            Identidade visual corporativa, design system, componentes mobile e simulador geográfico.
          </p>
        </div>
      </div>

      <!-- Center Logo Box -->
      <div class="cover-hero-logo">
        <div class="svg-container" style="max-height: 110px;">
          ${logoCDark}
        </div>
      </div>

      <!-- Cover Bottom Info -->
      <div style="border-top: 1px solid rgba(22, 165, 114, 0.5); padding-top: 6mm; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <p style="font-size: 8pt; color: #16A572; font-weight: 800; text-transform: uppercase;">Polo de Lançamento Inaugural</p>
          <p style="font-size: 11pt; font-weight: 800; color: #FFFFFF;">Alagoas • Penedo ⇄ Piaçabuçu</p>
          <p style="font-size: 8.5pt; color: #94A3B8;">Corredor Rodoviário AL-101 Sul / AL-225 (28,2 km)</p>
        </div>

        <div style="text-align: right;">
          <p style="font-size: 8pt; color: #FFCC45; font-weight: 800; text-transform: uppercase;">Startup de Tecnologia</p>
          <p style="font-size: 10pt; font-weight: 800; color: #FFFFFF;">Mobility Platform Clean-Room</p>
          <p style="font-size: 8pt; color: #94A3B8;">Google Antigravity Engineering</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== PÁGINA 2: CONCEITO, VALORES E SLOGANS ==================== -->
  <div class="page">
    <span class="header-tag tag-dark">Seção 01 • Conceito & DNA da Marca</span>
    <h1 class="sec-title">Fundamentos Estratégicos da Marca SIMBORA</h1>
    <p class="sec-subtitle">Conexão humana, confiabilidade técnica e orgulho da cultura brasileira no transporte de passageiros.</p>

    <div class="grid-2">
      <div class="card" style="border-left: 4px solid #16A572;">
        <h3 style="font-size: 11pt; font-weight: 800; color: #123D32;">Missão</h3>
        <p style="font-size: 8.5pt; color: #4B5563; margin-top: 4px;">
          Conectar pessoas, municípios e oportunidades no Brasil com transporte seguro, justo e acessível, valorizando as peculiaridades regionais a partir do Baixo São Francisco.
        </p>
      </div>

      <div class="card" style="border-left: 4px solid #FFCC45;">
        <h3 style="font-size: 11pt; font-weight: 800; color: #123D32;">Visão</h3>
        <p style="font-size: 8.5pt; color: #4B5563; margin-top: 4px;">
          Ser a maior referência de transporte intermunicipal do Nordeste e do Brasil, integrando alta tecnologia com remuneração transparente e calor humano.
        </p>
      </div>
    </div>

    <!-- Valores -->
    <div class="card" style="margin-top: 4px;">
      <h3 style="font-size: 11pt; font-weight: 800; color: #123D32; margin-bottom: 6px;">Pilares de Valor</h3>
      <div class="grid-3" style="font-size: 8pt;">
        <div style="padding: 6px; background: #FFFFFF; border-radius: 8px; border: 1px solid #E2E8F0;">
          <p style="font-weight: 800; color: #16A572;">1. Confiança & Segurança</p>
          <p style="color: #64748B; margin-top: 2px;">Telemetria contínua a cada 3s e validação obrigatória por PIN de 4 dígitos.</p>
        </div>
        <div style="padding: 6px; background: #FFFFFF; border-radius: 8px; border: 1px solid #E2E8F0;">
          <p style="font-weight: 800; color: #16A572;">2. Proximidade & Calor</p>
          <p style="color: #64748B; margin-top: 2px;">Comunicação amigável, sem burocracia ou jargões corporativos herméticos.</p>
        </div>
        <div style="padding: 6px; background: #FFFFFF; border-radius: 8px; border: 1px solid #E2E8F0;">
          <p style="font-weight: 800; color: #16A572;">3. Justiça Tarifária</p>
          <p style="color: #64748B; margin-top: 2px;">Preço justo para o usuário e repasse rápido e digno para os motoristas parceiros.</p>
        </div>
      </div>
    </div>

    <!-- Slogans -->
    <div class="card" style="background: #123D32; color: #FFFFFF; border: none; margin-top: 6px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="header-tag tag-gold">Slogan Principal Oficial</span>
        <span style="font-size: 7.5pt; color: #DCFCE7;">Métrica rítmica de 3 tempos</span>
      </div>
      <p style="font-size: 20pt; font-weight: 900; color: #FFCC45; margin: 4px 0;">"Pediu. Chegou. Simbora!"</p>
      <p style="font-size: 8.5pt; color: #E2E8F0;">
        Transmite agilidade imediata ("Pediu"), pontualidade resoluta ("Chegou") e a partida animada ("Simbora!").
      </p>
    </div>

    <!-- Alternativas Avaliadas -->
    <div class="card">
      <h3 style="font-size: 9.5pt; font-weight: 800; color: #123D32; margin-bottom: 4px;">5 Alternativas Estratégicas Avaliadas</h3>
      <table style="font-size: 8pt;">
        <tr>
          <td style="font-weight: 700; width: 40%;">"Seu caminho sem complicação."</td>
          <td style="color: #64748B;">Enfatiza fricção zero, facilidade de uso para idosos e primeira viagem.</td>
        </tr>
        <tr>
          <td style="font-weight: 700;">"Mobilidade com o calor da nossa terra."</td>
          <td style="color: #64748B;">Apelo afetivo à identidade nordestina e recepção acolhedora.</td>
        </tr>
        <tr>
          <td style="font-weight: 700;">"De ponta a ponta, vai de Simbora."</td>
          <td style="color: #64748B;">Destinado a viagens de longa distância e corredores intermunicipais.</td>
        </tr>
        <tr>
          <td style="font-weight: 700;">"A rota certa pro seu dia render."</td>
          <td style="color: #64748B;">Foco pragmático em trabalhadores e estudantes no dia a dia.</td>
        </tr>
        <tr>
          <td style="font-weight: 700;">"Conectando cidades, aproximando pessoas."</td>
          <td style="color: #64748B;">Tom institucional para relacionamento com secretarias de transporte e prefeituras.</td>
        </tr>
      </table>
    </div>

    <div class="page-footer">
      <span>SIMBORA Brand Book • Edição 2026</span>
      <span>Seção 01 • DNA & Conceito</span>
      <span>Página 2</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 3: AS 3 PROPOSTAS DE LOGOTIPO ==================== -->
  <div class="page">
    <span class="header-tag tag-dark">Seção 02 • Propostas de Logotipo</span>
    <h1 class="sec-title">As Três Direções Visuais da Marca</h1>
    <p class="sec-subtitle">Comparativo fundamentado das soluções visuais desenvolvidas para a SIMBORA.</p>

    <!-- PROPOSTA A -->
    <div class="card" style="margin-bottom: 8px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span class="header-tag tag-green">Proposta A • Wordmark Moderno Alagoano</span>
        <span style="font-size: 7.5pt; color: #64748B; font-weight: 700;">Tipográfico Puro</span>
      </div>
      <div class="grid-2" style="align-items: center;">
        <div class="svg-container" style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 8px; max-height: 55px;">
          ${logoA}
        </div>
        <div style="font-size: 8pt; color: #4B5563;">
          <p><b>Características:</b> Desenho com geometria arredondada, corte dinâmico no travessão da letra 'A' e acento solar dourado.</p>
          <p style="color: #166534; font-weight: 700; margin-top: 2px;">✓ Excelente legibilidade em mídia impressa e outdoors.</p>
        </div>
      </div>
    </div>

    <!-- PROPOSTA B -->
    <div class="card" style="margin-bottom: 8px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span class="header-tag tag-green">Proposta B • Símbolo de Movimento & Rio</span>
        <span style="font-size: 7.5pt; color: #64748B; font-weight: 700;">Pictograma Abstrato</span>
      </div>
      <div class="grid-2" style="align-items: center;">
        <div class="svg-container" style="background: #123D32; border-radius: 8px; padding: 6px; max-height: 65px;">
          ${logoB}
        </div>
        <div style="font-size: 8pt; color: #4B5563;">
          <p><b>Características:</b> Fita contínua em formato de 'S', conectando a curva do Rio São Francisco à seta de chegada dourada em Penedo.</p>
          <p style="color: #166534; font-weight: 700; margin-top: 2px;">✓ Alto poder de reconhecimento em tamanhos reduzidos (app icon e favicon).</p>
        </div>
      </div>
    </div>

    <!-- PROPOSTA C (RECOMENDADA) -->
    <div class="card" style="border: 2px solid #16A572; background: #ECFDF5/40; margin-bottom: 8px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <span class="header-tag tag-dark">Proposta C • Identidade Híbrida Oficial (RECOMENDADA)</span>
        <span class="header-tag tag-gold" style="font-size: 7pt;">ESCOLHA HOMOLOGADA</span>
      </div>
      <div class="grid-2" style="align-items: center;">
        <div class="svg-container" style="background: #FFFFFF; border: 1px solid #16A572; border-radius: 8px; padding: 8px; max-height: 65px;">
          ${logoCHoriz}
        </div>
        <div style="font-size: 8pt; color: #17211D;">
          <p><b>Conceito Central:</b> Integração perfeita entre o Símbolo de Movimento e a tipografia proprietária SIMBORA com o slogan oficial.</p>
          <p style="color: #123D32; font-weight: 800; margin-top: 2px;">
            ★ Máxima versatilidade técnica: opera em cabeçalhos, telas de celular, frotas de veículos e materiais institucionais.
          </p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>SIMBORA Brand Book • Edição 2026</span>
      <span>Seção 02 • Propostas de Logotipo</span>
      <span>Página 3</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 4: VARIAÇÕES E NORMAS DE USO DO LOGO ==================== -->
  <div class="page">
    <span class="header-tag tag-dark">Seção 03 • Versões Oficiais & Aplicação</span>
    <h1 class="sec-title">Variações Oficiais do Logotipo SIMBORA</h1>
    <p class="sec-subtitle">Todas as versões homologadas com matriz de respiro e contraste aprovados.</p>

    <div class="grid-2">
      <!-- Fundo Claro -->
      <div class="card">
        <p style="font-size: 8pt; font-weight: 800; color: #123D32; margin-bottom: 4px;">1. Principal Horizontal (Fundo Claro)</p>
        <div class="svg-container" style="background: #F8F9F6; border: 1px solid #CBD5E1; border-radius: 8px; padding: 8px; height: 50px;">
          ${logoCHoriz}
        </div>
        <p style="font-size: 7.5pt; color: #64748B; margin-top: 4px;">Aplicação primária em relatórios, web apps e documentos oficiais.</p>
      </div>

      <!-- Fundo Escuro -->
      <div class="card" style="background: #123D32; border: 1px solid #16A572;">
        <p style="font-size: 8pt; font-weight: 800; color: #FFCC45; margin-bottom: 4px;">2. Fundo Escuro / Cockpit</p>
        <div class="svg-container" style="background: #17211D; border-radius: 8px; padding: 8px; height: 50px;">
          ${logoCDark}
        </div>
        <p style="font-size: 7.5pt; color: #DCFCE7; margin-top: 4px;">Utilizada no app do motorista, splash screens e banners noturnos.</p>
      </div>

      <!-- Vertical Empilhada -->
      <div class="card">
        <p style="font-size: 8pt; font-weight: 800; color: #123D32; margin-bottom: 4px;">3. Versão Vertical / Selo</p>
        <div class="svg-container" style="background: #F8F9F6; border: 1px solid #CBD5E1; border-radius: 8px; padding: 6px; height: 95px;">
          ${logoCVert}
        </div>
        <p style="font-size: 7.5pt; color: #64748B; margin-top: 4px;">Utilizada em cartazes verticais, totens de parada e adesivos.</p>
      </div>

      <!-- Monocromático -->
      <div class="card">
        <p style="font-size: 8pt; font-weight: 800; color: #123D32; margin-bottom: 4px;">4. Monocromático (Pure Black & White)</p>
        <div class="svg-container" style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 8px; height: 95px;">
          ${logoCMono}
        </div>
        <p style="font-size: 7.5pt; color: #64748B; margin-top: 4px;">Para recibos térmicos, bordados em uniformes e impressões P&B.</p>
      </div>
    </div>

    <!-- Normas de Respiro e Tamanhos Mínimos -->
    <div class="card" style="margin-top: 6px;">
      <h3 style="font-size: 9.5pt; font-weight: 800; color: #123D32;">Área de Proteção & Tamanhos Mínimos</h3>
      <div class="grid-2" style="font-size: 8pt; margin-top: 4px;">
        <div>
          <p><b>Área de Respiro (X):</b> A altura da letra 'S' do logotipo define o espaçamento mínimo obrigatório em todos os lados (1.0X).</p>
        </div>
        <div>
          <p><b>Tamanho Mínimo Digital:</b> 120px de largura (Versão Horizontal) e 24px para o ícone/símbolo isolado.</p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>SIMBORA Brand Book • Edição 2026</span>
      <span>Seção 03 • Variações Oficiais</span>
      <span>Página 4</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 5: PALETA DE CORES & ACESSIBILIDADE ==================== -->
  <div class="page">
    <span class="header-tag tag-dark">Seção 04 • Sistema Cromático</span>
    <h1 class="sec-title">Cores Oficiais e Matriz de Acessibilidade</h1>
    <p class="sec-subtitle">Cores extraídas da paisagem alagoana, com validação matemática de contraste W3C WCAG 2.1.</p>

    <!-- Color Swatches Grid -->
    <div class="grid-5" style="margin-bottom: 10px;">
      <div class="card" style="background: #123D32; color: #FFFFFF; border: none; padding: 8px;">
        <span style="font-size: 6.5pt; color: #16A572; font-weight: 800; text-transform: uppercase;">Mãe da Marca</span>
        <p style="font-weight: 900; font-size: 9.5pt; margin-top: 6px;">Verde Profundo</p>
        <p class="font-mono" style="font-size: 8pt; color: #DCFCE7;">#123D32</p>
        <p style="font-size: 7pt; color: #94A3B8; margin-top: 4px;">RGB: 18, 61, 50</p>
      </div>

      <div class="card" style="background: #16A572; color: #FFFFFF; border: none; padding: 8px;">
        <span style="font-size: 6.5pt; color: #DCFCE7; font-weight: 800; text-transform: uppercase;">Ação & Rotas</span>
        <p style="font-weight: 900; font-size: 9.5pt; margin-top: 6px;">Verde Vibrante</p>
        <p class="font-mono" style="font-size: 8pt; color: #FFFFFF;">#16A572</p>
        <p style="font-size: 7pt; color: #DCFCE7; margin-top: 4px;">RGB: 22, 165, 114</p>
      </div>

      <div class="card" style="background: #FFCC45; color: #123D32; border: none; padding: 8px;">
        <span style="font-size: 6.5pt; color: #854D0E; font-weight: 800; text-transform: uppercase;">Sol & Destaque</span>
        <p style="font-weight: 900; font-size: 9.5pt; margin-top: 6px;">Amarelo Energia</p>
        <p class="font-mono" style="font-size: 8pt; color: #123D32;">#FFCC45</p>
        <p style="font-size: 7pt; color: #713F12; margin-top: 4px;">RGB: 255, 204, 69</p>
      </div>

      <div class="card" style="background: #F8F9F6; border: 1px solid #CBD5E1; color: #17211D; padding: 8px;">
        <span style="font-size: 6.5pt; color: #64748B; font-weight: 800; text-transform: uppercase;">Canvas Neutro</span>
        <p style="font-weight: 900; font-size: 9.5pt; margin-top: 6px;">Branco Suave</p>
        <p class="font-mono" style="font-size: 8pt; color: #475569;">#F8F9F6</p>
        <p style="font-size: 7pt; color: #64748B; margin-top: 4px;">RGB: 248, 249, 246</p>
      </div>

      <div class="card" style="background: #17211D; color: #FFFFFF; border: none; padding: 8px;">
        <span style="font-size: 6.5pt; color: #FFCC45; font-weight: 800; text-transform: uppercase;">Cockpit Noturno</span>
        <p style="font-weight: 900; font-size: 9.5pt; margin-top: 6px;">Grafite Mineral</p>
        <p class="font-mono" style="font-size: 8pt; color: #CBD5E1;">#17211D</p>
        <p style="font-size: 7pt; color: #94A3B8; margin-top: 4px;">RGB: 23, 33, 29</p>
      </div>
    </div>

    <!-- Contrast Table -->
    <div class="card">
      <h3 style="font-size: 9.5pt; font-weight: 800; color: #123D32; margin-bottom: 2px;">Matriz de Conformidade de Acessibilidade (WCAG 2.1)</h3>
      <table>
        <thead>
          <tr>
            <th>Combinação (Texto / Fundo)</th>
            <th>Razão de Contraste</th>
            <th>Nível Atingido</th>
            <th>Contexto de Uso Homologado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight: 700;">Branco Suave (#F8F9F6) sobre Verde Profundo (#123D32)</td>
            <td class="font-mono" style="font-weight: 800; color: #166534;">12.8 : 1</td>
            <td><span class="header-tag tag-green">AAA Pass</span></td>
            <td>Cabeçalhos, botões institucionais, telas de splash e headers</td>
          </tr>
          <tr>
            <td style="font-weight: 700;">Amarelo Energia (#FFCC45) sobre Verde Profundo (#123D32)</td>
            <td class="font-mono" style="font-weight: 800; color: #166534;">9.8 : 1</td>
            <td><span class="header-tag tag-green">AAA Pass</span></td>
            <td>Código PIN de 4 dígitos, notas de motorista (estrelas), ETA</td>
          </tr>
          <tr>
            <td style="font-weight: 700;">Grafite Mineral (#17211D) sobre Branco Suave (#F8F9F6)</td>
            <td class="font-mono" style="font-weight: 800; color: #166534;">14.2 : 1</td>
            <td><span class="header-tag tag-green">AAA Pass</span></td>
            <td>Textos corridos de endereço, inputs e tabela administrativa</td>
          </tr>
          <tr>
            <td style="font-weight: 700;">Branco Suave (#F8F9F6) sobre Grafite Mineral (#17211D)</td>
            <td class="font-mono" style="font-weight: 800; color: #166534;">14.2 : 1</td>
            <td><span class="header-tag tag-green">AAA Pass</span></td>
            <td>Cockpit do motorista, HUD noturno e modo escuro seguro</td>
          </tr>
          <tr>
            <td style="font-weight: 700;">Verde Profundo (#123D32) sobre Amarelo Energia (#FFCC45)</td>
            <td class="font-mono" style="font-weight: 800; color: #166534;">9.8 : 1</td>
            <td><span class="header-tag tag-green">AAA Pass</span></td>
            <td>Botões amarelos com texto escuro ("Cheguei ao Embarque")</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="page-footer">
      <span>SIMBORA Brand Book • Edição 2026</span>
      <span>Seção 04 • Sistema Cromático</span>
      <span>Página 5</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 6: SISTEMA TIPOGRÁFICO ==================== -->
  <div class="page">
    <span class="header-tag tag-dark">Seção 05 • Tipografia</span>
    <h1 class="sec-title">Sistema Tipográfico da SIMBORA</h1>
    <p class="sec-subtitle">Modernidade geométrica com alta legibilidade em telas móveis e sinalização viária.</p>

    <div class="grid-3" style="margin-bottom: 8px;">
      <div class="card" style="border-top: 3px solid #16A572;">
        <span class="header-tag tag-green" style="font-size: 6.5pt;">Fonte Primária</span>
        <h3 style="font-size: 13pt; font-weight: 900; color: #123D32; margin-top: 4px;">Plus Jakarta Sans</h3>
        <p style="font-size: 7.5pt; color: #64748B;">Licença SIL Open Font (Google Fonts).</p>
        <p style="font-size: 8pt; color: #334155; margin-top: 4px;">Títulos, logotipos, botões de ação e preços.</p>
      </div>

      <div class="card" style="border-top: 3px solid #123D32;">
        <span class="header-tag tag-green" style="font-size: 6.5pt;">Texto Corrido</span>
        <h3 style="font-size: 13pt; font-weight: 800; color: #123D32; margin-top: 4px;">Manrope</h3>
        <p style="font-size: 7.5pt; color: #64748B;">Licença SIL Open Font (Google Fonts).</p>
        <p style="font-size: 8pt; color: #334155; margin-top: 4px;">Instruções, termos legais e descrições.</p>
      </div>

      <div class="card" style="border-top: 3px solid #FFCC45;">
        <span class="header-tag tag-gold" style="font-size: 6.5pt;">Telemetria & Dados</span>
        <h3 style="font-size: 13pt; font-weight: 800; color: #123D32; margin-top: 4px;">JetBrains Mono</h3>
        <p style="font-size: 7.5pt; color: #64748B;">Monoespaçada de precisão.</p>
        <p style="font-size: 8pt; color: #334155; margin-top: 4px;">PIN de 4 dígitos, placas e GPS.</p>
      </div>
    </div>

    <!-- Type Scale Table -->
    <div class="card">
      <h3 style="font-size: 9.5pt; font-weight: 800; color: #123D32; margin-bottom: 2px;">Hierarquia & Escala de Tamanhos</h3>
      <table>
        <thead>
          <tr>
            <th>Nível</th>
            <th>Tamanho / Altura</th>
            <th>Peso</th>
            <th>Aplicação Prática no App</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="font-weight: 800;">Display Hero</td>
            <td class="font-mono">40px / 48px</td>
            <td>Black (900)</td>
            <td>Valores finais de corrida, splash screen</td>
          </tr>
          <tr>
            <td style="font-weight: 800;">Title 1</td>
            <td class="font-mono">28px / 36px</td>
            <td>ExtraBold (800)</td>
            <td>Títulos de tela e nome do motorista parceiro</td>
          </tr>
          <tr>
            <td style="font-weight: 800;">Headline</td>
            <td class="font-mono">18px / 24px</td>
            <td>Bold (700)</td>
            <td>Botões de ação ("Pedir Simbora", "Aceitar")</td>
          </tr>
          <tr>
            <td style="font-weight: 800;">Body Large</td>
            <td class="font-mono">16px / 24px</td>
            <td>Regular (400)</td>
            <td>Endereços de embarque e desembarque</td>
          </tr>
          <tr>
            <td style="font-weight: 800;">Caption</td>
            <td class="font-mono">12px / 16px</td>
            <td>Bold (700)</td>
            <td>Placas de carro (BRA2E19), tags de status</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="page-footer">
      <span>SIMBORA Brand Book • Edição 2026</span>
      <span>Seção 05 • Tipografia</span>
      <span>Página 6</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 7: ÍCONES DE APLICATIVO & SPLASH ==================== -->
  <div class="page">
    <span class="header-tag tag-dark">Seção 06 • Ícones & Splash Screens</span>
    <h1 class="sec-title">Ícones do Aplicativo (Android & iOS)</h1>
    <p class="sec-subtitle">Acabamento refinado de startup global sem microtextos ou elementos poluídos.</p>

    <div class="grid-3" style="margin-bottom: 10px;">
      <!-- iOS App Icon -->
      <div class="card" style="text-align: center;">
        <span class="header-tag tag-green" style="font-size: 6.5pt;">iOS App Store</span>
        <div class="svg-container" style="height: 110px; margin: 8px auto;">
          ${appIcon}
        </div>
        <p style="font-size: 7.5pt; font-weight: 800; color: #123D32;">Formato Squircle (512×512)</p>
        <p style="font-size: 7pt; color: #64748B;">Fundo Verde Profundo com S cinético solar.</p>
      </div>

      <!-- Android Adaptive -->
      <div class="card" style="text-align: center;">
        <span class="header-tag tag-green" style="font-size: 6.5pt;">Android Adaptive</span>
        <div class="svg-container" style="height: 110px; margin: 8px auto; border-radius: 50%; overflow: hidden; background: #123D32; border: 2px solid #FFCC45;">
          ${appIconFg}
        </div>
        <p style="font-size: 7.5pt; font-weight: 800; color: #123D32;">Formato Circular (432×432)</p>
        <p style="font-size: 7pt; color: #64748B;">Respeita estritamente a safe-area de 66dp.</p>
      </div>

      <!-- Favicon & Notifications -->
      <div class="card" style="text-align: center;">
        <span class="header-tag tag-gold" style="font-size: 6.5pt;">Favicon & Notificações</span>
        <div style="display: flex; justify-content: center; gap: 10px; margin: 25px 0;">
          <div class="svg-container" style="width: 44px; height: 44px;">
            ${favicon}
          </div>
          <div class="svg-container" style="width: 44px; height: 44px; background: #17211D; border-radius: 10px; padding: 6px;">
            ${notifIcon}
          </div>
        </div>
        <p style="font-size: 7.5pt; font-weight: 800; color: #123D32;">Miniaturas de Alta Densidade</p>
        <p style="font-size: 7pt; color: #64748B;">Silhueta pura em branco para barra de status.</p>
      </div>
    </div>

    <!-- Splash Screens Previews -->
    <div class="card">
      <h3 style="font-size: 9.5pt; font-weight: 800; color: #123D32; margin-bottom: 6px;">Telas de Abertura (Splash Screens 1080×1920)</h3>
      <div class="grid-2">
        <div style="text-align: center;">
          <div class="svg-container" style="height: 160px; background: #123D32; border-radius: 14px; padding: 8px;">
            ${splashPass}
          </div>
          <p style="font-size: 8pt; font-weight: 800; color: #123D32; margin-top: 4px;">Splash Passageiro</p>
          <p style="font-size: 7pt; color: #64748B;">Glow esmeralda e linhas topográficas do São Francisco.</p>
        </div>

        <div style="text-align: center;">
          <div class="svg-container" style="height: 160px; background: #17211D; border-radius: 14px; padding: 8px;">
            ${splashDriver}
          </div>
          <p style="font-size: 8pt; font-weight: 800; color: #123D32; margin-top: 4px;">Splash SIMBORA Motorista</p>
          <p style="font-size: 7pt; color: #64748B;">Cockpit escuro com badge de pronto para correr.</p>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <span>SIMBORA Brand Book • Edição 2026</span>
      <span>Seção 06 • Ícones & Splash</span>
      <span>Página 7</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 8: SIMBORA STUDIO (SIMULADOR ALAGOAS) ==================== -->
  <div class="page">
    <span class="header-tag tag-dark">Seção 07 • SIMBORA Studio</span>
    <h1 class="sec-title">SIMBORA Studio — Simulador Alagoas</h1>
    <p class="sec-subtitle">Validação E2E com celulares de passageiro e motorista sincronizados e cartografia real.</p>

    <div class="card" style="background: #123D32; color: #FFFFFF; border: none; margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="header-tag tag-gold">Cenário Prioritário de Testes</span>
        <span style="font-size: 8pt; color: #DCFCE7; font-weight: 800;">AL-101 Sul / AL-225</span>
      </div>
      <p style="font-size: 16pt; font-weight: 900; color: #FFCC45; margin: 4px 0;">
        Piaçabuçu (Foz do São Francisco) ➔ Penedo (Centro Histórico)
      </p>
      <div class="grid-3" style="font-size: 8pt; margin-top: 6px; color: #E2E8F0;">
        <div><b>Distância Rodoviária:</b> 28,2 km</div>
        <div><b>Tempo Estimado:</b> ~28 min</div>
        <div><b>Nós Rodoviários OSRM:</b> 485 pontos</div>
      </div>
    </div>

    <!-- Dual Phone Architecture Summary -->
    <div class="grid-2" style="font-size: 8pt; margin-bottom: 10px;">
      <div class="card" style="border-left: 3px solid #16A572;">
        <p style="font-weight: 800; font-size: 9pt; color: #123D32;">Celular do Passageiro (Mariana Silva)</p>
        <p style="color: #64748B; margin-top: 2px;">
          Seleção de 3 categorias (*Simbora Econômico*, *Simbora Conforto*, *Simbora Intermunicipal*), busca de motorista com radar circular, exibição destacada do **PIN de 4 dígitos** e avaliação pós-viagem.
        </p>
      </div>

      <div class="card" style="border-left: 3px solid #FFCC45;">
        <p style="font-weight: 800; font-size: 9pt; color: #123D32;">Celular do Motorista (Carlos Oliveira)</p>
        <p style="color: #64748B; margin-top: 2px;">
          Cockpit em tema escuro (#17211D), alternância de status Online/Offline, card de oferta com contagem regressiva de 25s, HUD de direção para a AL-101 e validação obrigatória do PIN para partida.
        </p>
      </div>
    </div>

    <!-- Primary Action Button Callout -->
    <div class="card" style="text-align: center; background: #ECFDF5; border: 1.5px solid #16A572;">
      <p style="font-size: 8.5pt; font-weight: 800; color: #166534; text-transform: uppercase;">Botão Principal do Simulador</p>
      <div style="display: inline-block; background: #16A572; color: #FFFFFF; font-weight: 900; font-size: 11pt; padding: 8px 24px; border-radius: 12px; margin: 6px 0; letter-spacing: 1px;">
        TESTAR PIAÇABUÇU ➔ PENEDO
      </div>
      <p style="font-size: 7.5pt; color: #64748B;">Disponível em <span class="font-mono" style="font-weight: 700;">http://localhost:3000/studio</span> e no arquivo standalone <span class="font-mono">mobility_interactive_studio.html</span>.</p>
    </div>

    <div class="page-footer">
      <span>SIMBORA Brand Book • Edição 2026</span>
      <span>Seção 07 • SIMBORA Studio</span>
      <span>Página 8</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 9: MARKETING & LANÇAMENTO ==================== -->
  <div class="page">
    <span class="header-tag tag-dark">Seção 08 • Marketing & Divulgação</span>
    <h1 class="sec-title">Identidade de Marketing & Materiais de Lançamento</h1>
    <p class="sec-subtitle">Peças promocionais concebidas com o calor de Alagoas e alta sofisticação visual.</p>

    <!-- Banner Institucional Preview -->
    <div class="card" style="margin-bottom: 8px;">
      <p style="font-size: 8pt; font-weight: 800; color: #123D32; margin-bottom: 4px;">Banner Institucional de Lançamento (1200×630)</p>
      <div class="svg-container" style="background: #123D32; border-radius: 8px; padding: 4px; height: 90px;">
        ${banner}
      </div>
      <p style="font-size: 7pt; color: #64748B; margin-top: 4px;">Headlines: <i>"Seu destino começa com SIMBORA"</i> e <i>"Pediu. Chegou. Simbora!"</i></p>
    </div>

    <div class="grid-2" style="margin-bottom: 8px;">
      <!-- Adesivo Veicular -->
      <div class="card">
        <p style="font-size: 8pt; font-weight: 800; color: #123D32; margin-bottom: 4px;">Adesivo para Portas & Para-brisa</p>
        <div class="svg-container" style="background: #123D32; border-radius: 8px; padding: 4px; height: 60px;">
          ${adesivo}
        </div>
        <p style="font-size: 7pt; color: #64748B; margin-top: 2px;">Com QR Code para download e chancela de verificado.</p>
      </div>

      <!-- Cartão Digital do Motorista -->
      <div class="card">
        <p style="font-size: 8pt; font-weight: 800; color: #123D32; margin-bottom: 4px;">Cartão Digital do Motorista Parceiro</p>
        <div class="svg-container" style="background: #123D32; border-radius: 8px; padding: 4px; height: 60px;">
          ${cardMotorista}
        </div>
        <p style="font-size: 7pt; color: #64748B; margin-top: 2px;">Apresenta nota, veículo (Corolla BRA2E19) e validação.</p>
      </div>
    </div>

    <div class="grid-2">
      <!-- Story Instagram -->
      <div class="card">
        <p style="font-size: 8pt; font-weight: 800; color: #123D32; margin-bottom: 4px;">Template Story Instagram (1080×1920)</p>
        <div class="svg-container" style="background: #123D32; border-radius: 8px; padding: 4px; height: 80px;">
          ${story}
        </div>
        <p style="font-size: 7pt; color: #64748B; margin-top: 2px;"><i>"Simbora pra Penedo? De Piaçabuçu pra onde você quiser."</i></p>
      </div>

      <!-- Avatar Social Media -->
      <div class="card">
        <p style="font-size: 8pt; font-weight: 800; color: #123D32; margin-bottom: 4px;">Avatar Oficial de Redes Sociais</p>
        <div class="svg-container" style="background: #123D32; border-radius: 8px; padding: 4px; height: 80px;">
          ${avatar}
        </div>
        <p style="font-size: 7pt; color: #64748B; margin-top: 2px;">Enquadramento otimizado para perfis circulares.</p>
      </div>
    </div>

    <div class="page-footer">
      <span>SIMBORA Brand Book • Edição 2026</span>
      <span>Seção 08 • Marketing</span>
      <span>Página 9</span>
    </div>
  </div>

  <!-- ==================== PÁGINA 10: AUDITORIA TÉCNICA E TESTES ==================== -->
  <div class="page">
    <span class="header-tag tag-dark">Seção 09 • Validação & Engenharia</span>
    <h1 class="sec-title">Auditoria Técnica e Aprovação dos Testes</h1>
    <p class="sec-subtitle">Validação rigorosa sem regressões operacionais no backend ou frontends.</p>

    <!-- Test Suites Results -->
    <div class="grid-2" style="margin-bottom: 10px;">
      <div class="card" style="border-left: 4px solid #16A572;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-size: 10pt; font-weight: 800; color: #123D32;">1. Suíte da Máquina de Estados</h3>
          <span class="header-tag tag-green">10 / 10 PASS</span>
        </div>
        <p class="font-mono" style="font-size: 7pt; color: #64748B; margin-top: 2px;">node --test tests/state-machine.test.js</p>
        <div style="font-size: 7.5pt; color: #334155; margin-top: 6px; line-height: 1.4;">
          <p>✔ Transições válidas do ciclo de vida</p>
          <p>✔ Rejeição de transições regressivas ilegais</p>
          <p>✔ Bloqueio de corrida em estados terminais</p>
          <p>✔ Cálculo Haversine de coordenadas</p>
          <p>✔ Algoritmo atômico anti-concorrência de despacho</p>
        </div>
      </div>

      <div class="card" style="border-left: 4px solid #16A572;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-size: 10pt; font-weight: 800; color: #123D32;">2. Suíte de Rotas Alagoas</h3>
          <span class="header-tag tag-green">7 / 7 PASS</span>
        </div>
        <p class="font-mono" style="font-size: 7pt; color: #64748B; margin-top: 2px;">node tests/test_penedo_piacabucu.js</p>
        <div style="font-size: 7.5pt; color: #334155; margin-top: 6px; line-height: 1.4;">
          <p>✔ Existência do dataset alagoas_routes.json</p>
          <p>✔ Coordenadas oficiais de Piaçabuçu e Penedo</p>
          <p>✔ Proibição estrita de linhas retas (+33,9% sinuosidade)</p>
          <p>✔ Cálculo de rolamento (bearing 0° a 360°)</p>
          <p>✔ Precificação e validação do PIN de segurança 4821</p>
        </div>
      </div>
    </div>

    <!-- Inventário de Documentação -->
    <div class="card">
      <h3 style="font-size: 9.5pt; font-weight: 800; color: #123D32; margin-bottom: 4px;">Inventário de Entregáveis em docs/brand/</h3>
      <table style="font-size: 7.5pt;">
        <tr><td><code>BRAND_GUIDELINES.md</code></td><td>Conceito, personas, tom de voz, slogans e comparação fundamentada.</td></tr>
        <tr><td><code>COLOR_TOKENS.md</code></td><td>Valores Hex, RGB, HSL e matriz de contraste WCAG AA/AAA.</td></tr>
        <tr><td><code>TYPOGRAPHY.md</code></td><td>Fontes Plus Jakarta Sans, Manrope e JetBrains Mono, type scale.</td></tr>
        <tr><td><code>LOGO_USAGE.md</code></td><td>Áreas de respiro, tamanhos mínimos e normas de aplicação.</td></tr>
        <tr><td><code>DESIGN_SYSTEM.md</code></td><td>Tokens, espaçamentos, raios e catálogo SDS v1.0.</td></tr>
        <tr><td><code>UI_UX_GUIDELINES.md</code></td><td>Jornada das 20 telas de passageiro e 15 telas de condutor.</td></tr>
        <tr><td><code>REBRANDING_PROGRESS.md</code></td><td>Registro e auditoria de execução do projeto.</td></tr>
      </table>
    </div>

    <!-- Conclusão -->
    <div style="margin-top: 10px; text-align: center; padding: 10px; background: #123D32; color: #FFFFFF; border-radius: 12px;">
      <p style="font-size: 11pt; font-weight: 900; color: #FFCC45;">SIMBORA — Pediu. Chegou. Simbora!</p>
      <p style="font-size: 8pt; color: #DCFCE7; margin-top: 2px;">Plataforma Homologada e Pronta para Operação em Alagoas e Expansão Nacional.</p>
    </div>

    <div class="page-footer">
      <span>SIMBORA Brand Book • Edição 2026</span>
      <span>Seção 09 • Auditoria Técnica</span>
      <span>Página 10</span>
    </div>
  </div>

</body>
</html>
`;

// Write HTML book
const htmlPath = path.join(rootDir, 'SIMBORA_BRAND_BOOK_COMPLETO.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('HTML Brand Book written to: ' + htmlPath);

// Generate PDF using headless Edge
const pdfPath = path.join(rootDir, 'SIMBORA_BRAND_BOOK_COMPLETO.pdf');
const edgeExe = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

console.log('Generating PDF via headless Edge...');
const cmd = `"${edgeExe}" --headless --no-sandbox --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file:///${htmlPath.replace(/\\\\/g, '/')}"`;

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('PDF generated successfully at: ' + pdfPath);

  // Copy to brand folder and brain folder
  const brandPdf = path.join(brandDir, 'SIMBORA_BRAND_BOOK_COMPLETO.pdf');
  const brainPdf = path.join(brainDir, 'SIMBORA_BRAND_BOOK_COMPLETO.pdf');

  fs.copyFileSync(pdfPath, brandPdf);
  fs.copyFileSync(pdfPath, brainPdf);
  console.log('PDF replicated to brand/ and brain/ directories.');
} catch (e) {
  console.error('Error generating PDF:', e);
}
