const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = 'C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING\\03-LOGO\\refinement-s-exclamation';
const artifactDir = 'C:\\Users\\winc\\.gemini\\antigravity\\brain\\b5a5ba79-6e91-45b2-8392-8c29d8da9dcc';

console.log('Crafting precision S! variations...');

// 1. VAR 1: KINETIC VELOCITY (12° slant, aerodynamic terminals, pure white S + yellow !)
const var1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="112" fill="#123D32"/>
  <g transform="translate(100, 85) skewX(-12)">
    <!-- Bespoke Speed S -->
    <path d="M 188 28 L 138 28 C 130 16, 116 10, 94 10 C 58 10, 36 30, 36 60 C 36 86, 56 102, 102 114 C 160 130, 198 158, 198 220 C 198 284, 150 326, 88 326 C 34 326, 2 292, 0 236 L 56 230 C 58 262, 74 278, 96 278 C 122 278, 142 260, 142 228 C 142 200, 124 186, 78 172 C 26 156, 0 130, 0 70 C 0 22, 42 0, 100 0 C 158 0, 186 24, 188 28 Z" fill="#F8F9F6"/>
    <!-- Velocity Exclamation Wedge -->
    <polygon points="238,8 288,8 274,212 248,212" fill="#FFCC45"/>
    <!-- Solar Energy Dot -->
    <circle cx="260" cy="282" r="28" fill="#FFCC45"/>
  </g>
</svg>`;

// 2. VAR 2: DUOTONE BRASIL (Emerald Green S + Yellow ! on Deep Green)
const var2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="112" fill="#123D32"/>
  <g transform="translate(100, 85) skewX(-12)">
    <!-- Emerald Green S -->
    <path d="M 188 28 L 138 28 C 130 16, 116 10, 94 10 C 58 10, 36 30, 36 60 C 36 86, 56 102, 102 114 C 160 130, 198 158, 198 220 C 198 284, 150 326, 88 326 C 34 326, 2 292, 0 236 L 56 230 C 58 262, 74 278, 96 278 C 122 278, 142 260, 142 228 C 142 200, 124 186, 78 172 C 26 156, 0 130, 0 70 C 0 22, 42 0, 100 0 C 158 0, 186 24, 188 28 Z" fill="#16A572"/>
    <!-- Solar Yellow Wedge & Dot -->
    <polygon points="238,8 288,8 274,212 248,212" fill="#FFCC45"/>
    <circle cx="260" cy="282" r="28" fill="#FFCC45"/>
  </g>
</svg>`;

// 3. VAR 3: CHUNKY FRIENDLY TECH (Ultra-bold, warm rounded corners, maximum pop)
const var3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="112" fill="#123D32"/>
  <g transform="translate(85, 85)">
    <!-- Chunky S with rounded pill terminals -->
    <path d="M 185 55 C 168 20, 138 4, 98 4 C 42 4, 0 42, 0 98 C 0 156, 48 184, 112 198 C 162 210, 184 228, 184 256 C 184 290, 150 318, 98 318 C 48 318, 14 292, 4 246 L 62 238 C 66 262, 80 274, 98 274 C 120 274, 134 260, 134 242 C 134 216, 110 202, 60 188 C 18 174, 0 144, 0 94 C 0 38, 42 0, 100 0 C 150 0, 182 22, 196 46 Z" fill="#F8F9F6"/>
    <!-- Chunky rounded exclamation stem -->
    <rect x="230" y="8" width="56" height="198" rx="28" fill="#FFCC45"/>
    <!-- Chunky round dot -->
    <circle cx="258" cy="274" r="32" fill="#FFCC45"/>
  </g>
</svg>`;

// 4. VAR 4: MOBILITY BEACON / PIN (The exclamation is a destination beacon)
const var4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="112" fill="#123D32"/>
  <g transform="translate(95, 80) skewX(-10)">
    <!-- Speed S -->
    <path d="M 188 28 L 138 28 C 130 16, 116 10, 94 10 C 58 10, 36 30, 36 60 C 36 86, 56 102, 102 114 C 160 130, 198 158, 198 220 C 198 284, 150 326, 88 326 C 34 326, 2 292, 0 236 L 56 230 C 58 262, 74 278, 96 278 C 122 278, 142 260, 142 228 C 142 200, 124 186, 78 172 C 26 156, 0 130, 0 70 C 0 22, 42 0, 100 0 C 158 0, 186 24, 188 28 Z" fill="#F8F9F6"/>
    <!-- Downward beacon vector -->
    <polygon points="236,12 284,12 268,198 252,198" fill="#16A572"/>
    <!-- Arrival Ring / Node in Yellow -->
    <circle cx="260" cy="276" r="34" fill="#FFCC45"/>
    <circle cx="260" cy="276" r="15" fill="#123D32"/>
  </g>
</svg>`;

// 5. VAR 5: STENCIL SPEED CUT (Precision diagonal slash cut through the S)
const var5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="112" fill="#123D32"/>
  <g transform="translate(100, 85) skewX(-12)">
    <!-- S Top Wing -->
    <path d="M 188 28 L 138 28 C 130 16, 116 10, 94 10 C 58 10, 36 30, 36 60 C 36 86, 56 102, 102 114 L 140 126 L 40 162 C 15 146, 0 120, 0 70 C 0 22, 42 0, 100 0 C 158 0, 186 24, 188 28 Z" fill="#F8F9F6"/>
    <!-- S Bottom Wing (Separated by dynamic 14px speed cut) -->
    <path d="M 198 214 C 198 284, 150 326, 88 326 C 34 326, 2 292, 0 236 L 56 230 C 58 262, 74 278, 96 278 C 122 278, 142 260, 142 228 C 142 200, 124 186, 78 172 L 68 168 L 168 132 C 188 152, 198 180, 198 214 Z" fill="#16A572"/>
    <!-- Exclamation in Yellow -->
    <polygon points="238,8 288,8 274,212 248,212" fill="#FFCC45"/>
    <circle cx="260" cy="282" r="28" fill="#FFCC45"/>
  </g>
</svg>`;

// Save each SVG
fs.writeFileSync(path.join(outDir, 'opt-1-kinetic-velocity.svg'), var1, 'utf8');
fs.writeFileSync(path.join(outDir, 'opt-2-duotone-brasil.svg'), var2, 'utf8');
fs.writeFileSync(path.join(outDir, 'opt-3-chunky-friendly.svg'), var3, 'utf8');
fs.writeFileSync(path.join(outDir, 'opt-4-mobility-beacon.svg'), var4, 'utf8');
fs.writeFileSync(path.join(outDir, 'opt-5-stencil-speed.svg'), var5, 'utf8');

// Build the HTML Presentation Dossier
const htmlDossier = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SIMBORA — Dossiê de Refinamento S! (The Energetic Display)</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Outfit:wght@700;800;900&display=swap" rel="stylesheet">
<style>
  :root {
    --verde-profundo: #123D32;
    --verde-vibrante: #16A572;
    --amarelo-energia: #FFCC45;
    --branco-suave: #F8F9F6;
    --grafite: #17211D;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #0A0F0D;
    color: #17211D;
    padding: 30px 20px 80px;
  }
  .container { max-width: 1300px; margin: 0 auto; }

  .header-card {
    background: linear-gradient(135deg, #123D32 0%, #0A261F 100%);
    border-radius: 20px;
    padding: 40px 48px;
    color: #FFFFFF;
    margin-bottom: 30px;
    border: 1px solid rgba(22, 165, 114, 0.3);
  }
  .badge {
    background: rgba(22, 165, 114, 0.25);
    border: 1px solid #16A572;
    color: #FFCC45;
    font-size: 12px;
    font-weight: 800;
    padding: 5px 14px;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 2px;
    display: inline-block;
    margin-bottom: 12px;
  }
  h1 { font-size: 38px; font-weight: 900; line-height: 1.15; margin-bottom: 12px; }
  h1 span { color: #FFCC45; }
  p.subtitle { color: #A3C9BC; font-size: 16px; max-width: 820px; line-height: 1.5; }

  .quote-box {
    margin-top: 24px;
    background: rgba(0,0,0,0.3);
    border-left: 4px solid #FFCC45;
    padding: 14px 20px;
    border-radius: 0 10px 10px 0;
    font-size: 14px;
    color: #E2ECE7;
  }
  .quote-box strong { color: #FFCC45; }

  /* CARDS GRID */
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
    margin-bottom: 40px;
  }

  .card {
    background: #FFFFFF;
    border-radius: 18px;
    padding: 32px;
    box-shadow: 0 16px 36px rgba(0,0,0,0.35);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 2px solid #F1F4F2;
  }
  .opt-num {
    font-size: 12px;
    font-weight: 800;
    color: var(--verde-vibrante);
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }
  .opt-title { font-size: 22px; font-weight: 900; color: var(--verde-profundo); }
  .opt-desc { font-size: 13.5px; color: #4A5B53; margin-top: 4px; line-height: 1.4; }

  /* ICON DISPLAY */
  .icon-showcase {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 24px 0;
    background: #F8FAF9;
    border-radius: 14px;
    margin-bottom: 20px;
  }
  .icon-hero {
    width: 150px;
    height: 150px;
    border-radius: 34px;
    box-shadow: 0 16px 30px rgba(18, 61, 50, 0.28);
    overflow: hidden;
  }

  .micro-column {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
  .micro-label { font-size: 11px; font-weight: 700; color: #8C9E95; text-transform: uppercase; }

  /* LOCKUP PREVIEW */
  .lockup-preview {
    background: #FFFFFF;
    border: 1px solid #E2E8E4;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .lockup-mini-icon { width: 50px; height: 50px; border-radius: 12px; overflow: hidden; flex-shrink: 0; }
  .lockup-text-group { display: flex; flex-direction: column; }
  .lockup-brand { font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 900; letter-spacing: 1.5px; color: var(--verde-profundo); }
  .lockup-brand span { color: var(--amarelo-energia); }
  .lockup-sub { font-size: 10px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: var(--verde-vibrante); }

  /* DECISION BANNER */
  .decision-banner {
    background: linear-gradient(135deg, #FFCC45 0%, #FFB800 100%);
    border-radius: 16px;
    padding: 28px 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #17211D;
  }
  .decision-banner h3 { font-size: 22px; font-weight: 900; }
  .decision-banner p { font-size: 14px; font-weight: 600; margin-top: 4px; color: #2B2E24; }

  @media print {
    body { background: #FFFFFF; padding: 0; }
    .card { box-shadow: none; border: 1px solid #CCD4D0; page-break-inside: avoid; }
    .header-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .icon-hero { box-shadow: none; border: 1px solid #CCD4D0; }
  }
</style>
</head>
<body>

<div class="container">

  <!-- HEADER -->
  <div class="header-card">
    <div class="badge">Direcionamento Estratégico &bull; Etapa 2</div>
    <h1>Evolução Focada: <span>O Monograma "S!"</span></h1>
    <p class="subtitle">
      Você selecionou a essência de <strong>"The Energetic Display (S!)"</strong> como o único caminho com verdadeiro potencial.
      Eliminamos completamente o desenho rudimentar e recriamos 5 variações vetoriais sob medida, com proporções profissionais,
      tensão de curvas, cinética de aceleração e tipografia brasileira de alto impacto.
    </p>

    <div class="quote-box">
      <strong>Diagnóstico da sua escolha:</strong> A exclamação <strong>"!"</strong> traduz a própria voz do brasileiro ao dizer <em>"SIMBORA!"</em>. O desafio era transformar uma letra comum digitada em uma <strong>marca icônica com acabamento de grande startup tech de mobilidade</strong>.
    </div>
  </div>

  <!-- GRID DE 5 OPÇÕES REFINADAS -->
  <div class="grid">

    <!-- OPÇÃO 1 -->
    <div class="card">
      <div>
        <div class="card-header">
          <div>
            <div class="opt-num">Opção 01 &bull; O Favorito Tech</div>
            <h2 class="opt-title">Kinetic Velocity</h2>
            <p class="opt-desc">
              Inclinação esportiva de 12°, cantos chanfrados e contraste puro entre o S em Branco Suave e a cunha de aceleração Amarelo Energia.
            </p>
          </div>
        </div>

        <div class="icon-showcase">
          <div class="icon-hero">${var1}</div>
          <div class="micro-column">
            <span class="micro-label">App 36px</span>
            <div style="width:36px; height:36px; border-radius:9px; overflow:hidden;">${var1}</div>
            <span class="micro-label">App 24px</span>
            <div style="width:24px; height:24px; border-radius:6px; overflow:hidden;">${var1}</div>
          </div>
        </div>
      </div>

      <div class="lockup-preview">
        <div class="lockup-mini-icon">${var1}</div>
        <div class="lockup-text-group">
          <div class="lockup-brand">SIMBORA<span>!</span></div>
          <div class="lockup-sub">Pediu. Chegou. Simbora!</div>
        </div>
      </div>
    </div>

    <!-- OPÇÃO 2 -->
    <div class="card">
      <div>
        <div class="card-header">
          <div>
            <div class="opt-num">Opção 02 &bull; Identidade Cromática</div>
            <h2 class="opt-title">Duotone Brasil</h2>
            <p class="opt-desc">
              O 'S' em Verde Vibrante (#16A572) e o '!' em Amarelo Energia (#FFCC45). Fundo Verde Profundo. Uma assinatura de cores proprietária e inconfundível.
            </p>
          </div>
        </div>

        <div class="icon-showcase">
          <div class="icon-hero">${var2}</div>
          <div class="micro-column">
            <span class="micro-label">App 36px</span>
            <div style="width:36px; height:36px; border-radius:9px; overflow:hidden;">${var2}</div>
            <span class="micro-label">App 24px</span>
            <div style="width:24px; height:24px; border-radius:6px; overflow:hidden;">${var2}</div>
          </div>
        </div>
      </div>

      <div class="lockup-preview">
        <div class="lockup-mini-icon">${var2}</div>
        <div class="lockup-text-group">
          <div class="lockup-brand">SIMBORA<span>!</span></div>
          <div class="lockup-sub">Pediu. Chegou. Simbora!</div>
        </div>
      </div>
    </div>

    <!-- OPÇÃO 3 -->
    <div class="card">
      <div>
        <div class="card-header">
          <div>
            <div class="opt-num">Opção 03 &bull; Popular &amp; Amigável</div>
            <h2 class="opt-title">Chunky Friendly Tech</h2>
            <p class="opt-desc">
              Linhas ultra-bold com cantos squircles arredondados. Caloroso, popular, extremamente legível em qualquer distância (estilo iFood / Waze).
            </p>
          </div>
        </div>

        <div class="icon-showcase">
          <div class="icon-hero">${var3}</div>
          <div class="micro-column">
            <span class="micro-label">App 36px</span>
            <div style="width:36px; height:36px; border-radius:9px; overflow:hidden;">${var3}</div>
            <span class="micro-label">App 24px</span>
            <div style="width:24px; height:24px; border-radius:6px; overflow:hidden;">${var3}</div>
          </div>
        </div>
      </div>

      <div class="lockup-preview">
        <div class="lockup-mini-icon">${var3}</div>
        <div class="lockup-text-group">
          <div class="lockup-brand">SIMBORA<span>!</span></div>
          <div class="lockup-sub">Pediu. Chegou. Simbora!</div>
        </div>
      </div>
    </div>

    <!-- OPÇÃO 4 -->
    <div class="card">
      <div>
        <div class="card-header">
          <div>
            <div class="opt-num">Opção 04 &bull; Mobilidade Urbana</div>
            <h2 class="opt-title">The Mobility Beacon</h2>
            <p class="opt-desc">
              A exclamação funciona como um feixe de direção que desce até um alvo/marcador de chegada solar. O símbolo expressa o destino alcançado.
            </p>
          </div>
        </div>

        <div class="icon-showcase">
          <div class="icon-hero">${var4}</div>
          <div class="micro-column">
            <span class="micro-label">App 36px</span>
            <div style="width:36px; height:36px; border-radius:9px; overflow:hidden;">${var4}</div>
            <span class="micro-label">App 24px</span>
            <div style="width:24px; height:24px; border-radius:6px; overflow:hidden;">${var4}</div>
          </div>
        </div>
      </div>

      <div class="lockup-preview">
        <div class="lockup-mini-icon">${var4}</div>
        <div class="lockup-text-group">
          <div class="lockup-brand">SIMBORA<span>!</span></div>
          <div class="lockup-sub">Pediu. Chegou. Simbora!</div>
        </div>
      </div>
    </div>

    <!-- OPÇÃO 5 -->
    <div class="card" style="grid-column: span 2;">
      <div>
        <div class="card-header">
          <div>
            <div class="opt-num">Opção 05 &bull; Velocidade &amp; Engenharia</div>
            <h2 class="opt-title">Stencil Speed Cut</h2>
            <p class="opt-desc">
              O 'S' é seccionado por um corte diagonal dinâmico que divide a asa superior (branca) da asa inferior (verde vibrante), evocando pista e aceleração.
            </p>
          </div>
        </div>

        <div class="icon-showcase" style="justify-content: center; gap: 60px;">
          <div class="icon-hero" style="width: 170px; height: 170px;">${var5}</div>
          <div class="micro-column">
            <span class="micro-label">App 48px</span>
            <div style="width:48px; height:48px; border-radius:12px; overflow:hidden;">${var5}</div>
            <span class="micro-label">App 32px</span>
            <div style="width:32px; height:32px; border-radius:8px; overflow:hidden;">${var5}</div>
            <span class="micro-label">App 24px</span>
            <div style="width:24px; height:24px; border-radius:6px; overflow:hidden;">${var5}</div>
          </div>
          <div class="lockup-preview" style="min-width: 380px;">
            <div class="lockup-mini-icon" style="width: 60px; height: 60px;">${var5}</div>
            <div class="lockup-text-group">
              <div class="lockup-brand" style="font-size: 32px;">SIMBORA<span>!</span></div>
              <div class="lockup-sub" style="font-size: 11px;">Pediu. Chegou. Simbora!</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- DECISION BANNER -->
  <div class="decision-banner">
    <div>
      <h3>Qual dessas 5 evoluções atinge o nível que você quer?</h3>
      <p>Indique a Opção (1, 2, 3, 4 ou 5) ou o que falta para chegar exatamente no seu ideal.</p>
    </div>
    <div style="font-size: 13px; font-weight: 900; background: #123D32; color: #FFCC45; padding: 12px 24px; border-radius: 8px; text-transform: uppercase;">
      DECISÃO EM ANDAMENTO
    </div>
  </div>

</div>

</body>
</html>
`;

const htmlPath = path.join(outDir, 'simbora-s-exclamation-dossie.html');
fs.writeFileSync(htmlPath, htmlDossier, 'utf8');
console.log('HTML dossier written at:', htmlPath);

// Copy to artifact directory
const artifactHtml = path.join(artifactDir, 'SIMBORA_S_EXCLAMATION_REFINAMENTO.html');
fs.writeFileSync(artifactHtml, htmlDossier, 'utf8');

// Print to PDF
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const pdfPath = path.join(outDir, 'SIMBORA_S_EXCLAMATION_REFINAMENTO.pdf');
const artifactPdf = path.join(artifactDir, 'SIMBORA_S_EXCLAMATION_REFINAMENTO.pdf');

try {
  console.log('Rendering PDF via Headless Edge...');
  const cmd = `"${edgePath}" --headless --no-sandbox --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`;
  execSync(cmd);
  console.log('PDF rendered at:', pdfPath);
  fs.copyFileSync(pdfPath, artifactPdf);
  console.log('PDF copied to Artifact:', artifactPdf);
} catch (e) {
  console.error('Edge print error:', e.message);
}
