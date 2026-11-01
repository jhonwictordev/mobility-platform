const fs = require('fs');
const path = require('path');
const puppeteer = require('C:\\Users\\winc\\.gemini\\antigravity\\scratch\\flow-automation\\node_modules\\puppeteer-core');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const studioDir = 'C:\\Users\\winc\\Desktop\\SIMBORA-CREATIVE-STUDIO';
const exportsDir = path.join(studioDir, 'SIMBORA_BRAND_ASSETS', 'EXPORTS');
const campaignsDir = path.join(studioDir, 'SIMBORA_BRAND_ASSETS', 'CAMPAIGNS');
const socialDir = path.join(studioDir, 'SIMBORA_BRAND_ASSETS', 'SOCIAL_MEDIA');
const mockupsDir = path.join(studioDir, 'SIMBORA_BRAND_ASSETS', 'VEHICLE_MOCKUPS');

// Ensure output dirs exist
[exportsDir, campaignsDir, socialDir, mockupsDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

console.log('Rendering 5 SIMBORA Production Campaign Pieces based on User References...');

// Read base official vector logos
const finalDir = 'C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING\\03-LOGO\\final-identity';
const appIconSvg = fs.readFileSync(path.join(finalDir, 'simbora-app-icon.svg'), 'utf8').replace(/<\?xml[^>]*\?>/g, '').trim();
const logoDarkSvg = fs.readFileSync(path.join(finalDir, 'simbora-logo-horizontal-dark.svg'), 'utf8').replace(/<\?xml[^>]*\?>/g, '').trim();
const logoLightSvg = fs.readFileSync(path.join(finalDir, 'simbora-logo-horizontal-light.svg'), 'utf8').replace(/<\?xml[^>]*\?>/g, '').trim();
const symbolSvg = fs.readFileSync(path.join(finalDir, 'simbora-symbol-isolated.svg'), 'utf8').replace(/<\?xml[^>]*\?>/g, '').trim();

// HTML for PEÇA 1: Vehicle Mockup 3D Front 3/4 (Ref 1)
// White background, realistic compact electric hatchback with SIMBORA Stencil Speed Cut dynamic wrap
const piece1Html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width: 1920px; height: 1080px; background: #FFFFFF; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; overflow: hidden; }
  .canvas { position: relative; width: 1920px; height: 1080px; background: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; }

  /* Studio Lighting floor */
  .floor-grid {
    position: absolute; bottom: 0; width: 100%; height: 350px;
    background: radial-gradient(ellipse at 50% 80%, rgba(18, 61, 50, 0.08) 0%, rgba(255,255,255,0) 70%);
  }

  .car-container { position: relative; width: 1400px; height: 750px; display: flex; align-items: center; justify-content: center; }

  .spec-badge {
    position: absolute; top: 60px; left: 80px;
    display: flex; align-items: center; gap: 14px;
    background: #F8F9F6; border: 1.5px solid #E2E8E4; padding: 12px 24px; border-radius: 999px;
  }
  .spec-title { font-size: 14px; font-weight: 800; color: #123D32; letter-spacing: 1.5px; text-transform: uppercase; }

  .meta-tag {
    position: absolute; bottom: 60px; right: 80px;
    font-size: 12px; font-weight: 800; color: #16A572; letter-spacing: 2px; text-transform: uppercase;
  }
</style></head><body>
<div class="canvas">
  <div class="floor-grid"></div>
  <div class="spec-badge">
    <div style="width: 12px; height: 12px; border-radius: 6px; background: #16A572;"></div>
    <span class="spec-title">MOCKUP OFICIAL DE VEÍCULO PARCEIRO &bull; FROTA ELÉTRICA &amp; COMPACTOS</span>
  </div>

  <div class="car-container">
    <svg viewBox="0 0 1200 650" width="100%" height="100%">
      <!-- Ground Contact Shadow -->
      <ellipse cx="600" cy="540" rx="520" ry="24" fill="#17211D" opacity="0.22"/>
      <ellipse cx="600" cy="540" rx="380" ry="12" fill="#17211D" opacity="0.35"/>

      <!-- CAR BODY PROFILE 3/4 (Modern Electric Compact Hatchback) -->
      <!-- Wheels Behind -->
      <g>
        <!-- Rear Wheel -->
        <ellipse cx="980" cy="460" rx="82" ry="86" fill="#17211D"/>
        <ellipse cx="980" cy="460" rx="54" ry="56" fill="#8C9E95"/>
        <ellipse cx="980" cy="460" rx="36" ry="38" fill="#17211D"/>
        <!-- Spokes -->
        <line x1="980" y1="406" x2="980" y2="514" stroke="#FFFFFF" stroke-width="8"/>
        <line x1="926" y1="460" x2="1034" y2="460" stroke="#FFFFFF" stroke-width="8"/>
      </g>

      <!-- Main Body Chassis (Deep Forest Green / Metallic finish) -->
      <!-- Lower Sill & Shadow -->
      <path d="M 180 470 L 480 495 L 940 485 L 1050 440 L 1080 370 L 980 230 L 680 210 L 360 290 L 180 360 L 140 430 Z" fill="#0D2D24"/>

      <!-- Main Painted Panels (Verde Profundo #123D32) -->
      <path d="M 180 450 Q 280 480 480 485 L 940 475 L 1050 430 L 1070 360 L 960 240 L 680 220 L 380 300 L 190 370 L 150 430 Z" fill="#123D32" stroke="#16A572" stroke-width="2"/>

      <!-- SIMBORA DYNAMIC LIVERY ACCENT: Stencil Speed Band in Verde Vibrante & Amarelo Energia -->
      <!-- Large dynamic wrap along side panels -->
      <path d="M 280 410 Q 520 440 920 380 L 1030 350 L 1010 395 L 900 425 Q 520 485 270 450 Z" fill="#16A572"/>
      <!-- Solar Energy Accent Slash -->
      <path d="M 880 340 L 960 325 L 930 365 L 860 375 Z" fill="#FFCC45"/>
      <path d="M 390 400 L 480 390 L 450 420 L 370 425 Z" fill="#FFCC45"/>

      <!-- Front Hood & Fascia -->
      <path d="M 150 430 L 220 455 L 380 400 L 340 330 L 190 370 Z" fill="#16A572" opacity="0.15"/>

      <!-- Front Grille & Aerodynamic Air Dam -->
      <path d="M 160 435 L 260 460 L 340 445 L 350 420 L 220 410 Z" fill="#17211D"/>
      <!-- LED Headlights -->
      <polygon points="190,380 300,370 280,395 180,410" fill="#E6FFF5" stroke="#FFFFFF" stroke-width="2"/>
      <line x1="200" y1="390" x2="280" y2="380" stroke="#FFCC45" stroke-width="4"/>

      <!-- Windshield & Glass House -->
      <path d="M 370 300 L 670 230 L 820 230 L 940 330 L 650 330 Z" fill="#17211D" stroke="#0D2D24" stroke-width="3"/>
      <!-- Glass reflection highlights -->
      <path d="M 440 285 L 640 240 L 650 320 L 480 320 Z" fill="#FFFFFF" opacity="0.18"/>

      <!-- Front Wheel 3/4 -->
      <g>
        <ellipse cx="370" cy="480" rx="90" ry="95" fill="#17211D"/>
        <ellipse cx="370" cy="480" rx="60" ry="62" fill="#8C9E95"/>
        <ellipse cx="370" cy="480" rx="40" ry="42" fill="#17211D"/>
        <line x1="370" y1="420" x2="370" y2="540" stroke="#FFFFFF" stroke-width="9"/>
        <line x1="310" y1="480" x2="430" y2="480" stroke="#FFFFFF" stroke-width="9"/>
        <line x1="328" y1="438" x2="412" y2="522" stroke="#FFCC45" stroke-width="7"/>
      </g>

      <!-- Side Mirror -->
      <path d="M 460 330 L 520 325 C 530 325, 535 340, 520 345 L 470 350 Z" fill="#FFCC45"/>

      <!-- OFFICIAL SIMBORA STENCIL SPEED LOGO ON FRONT DOOR (Crisp & Scaled) -->
      <g transform="translate(560, 310) scale(0.48)">
        <!-- Badge Background -->
        <rect width="140" height="140" rx="32" fill="#0D2D24" stroke="rgba(22, 165, 114, 0.6)" stroke-width="2"/>
        <g transform="translate(27, 23) scale(0.27) skewX(-12)">
          <path d="M 188 28 L 138 28 C 130 16, 116 10, 94 10 C 58 10, 36 30, 36 60 C 36 86, 56 102, 102 114 L 140 126 L 40 162 C 15 146, 0 120, 0 70 C 0 22, 42 0, 100 0 C 158 0, 186 24, 188 28 Z" fill="#F8F9F6"/>
          <path d="M 198 214 C 198 284, 150 326, 88 326 C 34 326, 2 292, 0 236 L 56 230 C 58 262, 74 278, 96 278 C 122 278, 142 260, 142 228 C 142 200, 124 186, 78 172 L 68 168 L 168 132 C 188 152, 198 180, 198 214 Z" fill="#16A572"/>
          <polygon points="238,8 288,8 274,212 248,212" fill="#FFCC45"/>
          <circle cx="260" cy="282" r="28" fill="#FFCC45"/>
        </g>
        <!-- Wordmark alongside badge on vehicle door -->
        <text x="165" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" letter-spacing="2">SIMBORA<tspan fill="#FFCC45">!</tspan></text>
        <text x="168" y="122" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="14" fill="#16A572" letter-spacing="2">PEDIU. CHEGOU. SIMBORA!</text>
      </g>

      <!-- License Plate: SIMBORA Official -->
      <g transform="translate(190, 460)">
        <rect width="110" height="28" rx="4" fill="#F8F9F6" stroke="#17211D" stroke-width="2"/>
        <rect width="110" height="7" rx="2" fill="#16A572"/>
        <text x="55" y="23" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="900" fill="#17211D" text-anchor="middle" letter-spacing="1.5">SIMBORA</text>
      </g>
    </svg>
  </div>

  <div class="meta-tag">PADRÃO VISUAL HOMOLOGADO &bull; ALAGOAS &bull; BRASIL</div>
</div>
</body></html>`;

// HTML for PEÇA 2: Side Profile Vehicle Mockup (Ref 2)
const piece2Html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width: 1920px; height: 1080px; background: #FFFFFF; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; overflow: hidden; }
  .canvas { position: relative; width: 1920px; height: 1080px; background: #FFFFFF; display: flex; flex-direction: column; align-items: center; justify-content: center; }

  .header-card {
    position: absolute; top: 50px; left: 80px;
    display: flex; flex-direction: column; gap: 4px;
  }
  .header-tag { font-size: 13px; font-weight: 800; color: #16A572; letter-spacing: 2px; text-transform: uppercase; }
  .header-title { font-size: 28px; font-weight: 900; color: #123D32; }

  .footer-specs {
    position: absolute; bottom: 50px; width: calc(100% - 160px);
    display: flex; justify-content: space-between; align-items: center;
    border-top: 1.5px solid #E2E8E4; padding-top: 20px;
    font-size: 13px; font-weight: 700; color: #6D8278;
  }
</style></head><body>
<div class="canvas">
  <div class="header-card">
    <span class="header-tag">MOCKUP LATERAL EM ESCALA REAL (1:1)</span>
    <h1 class="header-title">Adesivagem Oficial de Portas &amp; Lataria Lateral</h1>
  </div>

  <div style="width: 1500px; height: 600px; display: flex; align-items: center; justify-content: center;">
    <svg viewBox="0 0 1400 550" width="100%" height="100%">
      <!-- Ground Shadow -->
      <ellipse cx="700" cy="480" rx="580" ry="18" fill="#17211D" opacity="0.2"/>
      <ellipse cx="700" cy="480" rx="420" ry="9" fill="#17211D" opacity="0.3"/>

      <!-- CAR SILHOUETTE (Hatchback Side Profile) -->
      <!-- Wheels (Rear and Front) -->
      <g>
        <circle cx="340" cy="430" r="76" fill="#17211D"/>
        <circle cx="340" cy="430" r="48" fill="#8C9E95"/>
        <circle cx="340" cy="430" r="28" fill="#17211D"/>
        <line x1="340" y1="382" x2="340" y2="478" stroke="#FFFFFF" stroke-width="7"/>
        <line x1="292" y1="430" x2="388" y2="430" stroke="#FFFFFF" stroke-width="7"/>

        <circle cx="1060" cy="430" r="76" fill="#17211D"/>
        <circle cx="1060" cy="430" r="48" fill="#8C9E95"/>
        <circle cx="1060" cy="430" r="28" fill="#17211D"/>
        <line x1="1060" y1="382" x2="1060" y2="478" stroke="#FFFFFF" stroke-width="7"/>
        <line x1="1012" y1="430" x2="1108" y2="430" stroke="#FFFFFF" stroke-width="7"/>
      </g>

      <!-- Main Body Panels (Pure White / Soft Platinum) -->
      <path d="M 180 430 L 230 350 L 320 330 L 480 210 L 880 205 L 1050 310 L 1220 350 L 1240 430 L 1150 435 L 980 435 L 430 435 L 260 435 Z" fill="#F8F9F6" stroke="#D3DDD7" stroke-width="2"/>

      <!-- Roof Pillars & Tinted Windows -->
      <path d="M 490 220 L 680 220 L 680 320 L 360 320 Z" fill="#123D32"/>
      <path d="M 700 220 L 870 220 L 1010 320 L 700 320 Z" fill="#123D32"/>
      <!-- Window reflection line -->
      <line x1="520" y1="230" x2="620" y2="310" stroke="#FFFFFF" stroke-width="4" opacity="0.3"/>
      <line x1="730" y1="230" x2="830" y2="310" stroke="#FFFFFF" stroke-width="4" opacity="0.3"/>

      <!-- SIMBORA SPEED LIVERY: Dynamic Swoosh Across Both Doors -->
      <path d="M 400 380 Q 700 330 1140 370 L 1120 425 Q 700 395 380 425 Z" fill="#123D32"/>
      <path d="M 400 380 Q 700 330 1140 370 L 1150 350 Q 700 310 400 360 Z" fill="#16A572"/>
      <polygon points="1110,345 1160,340 1140,375 1090,375" fill="#FFCC45"/>

      <!-- Door Handles -->
      <rect x="580" y="335" width="46" height="8" rx="4" fill="#CCD8D1"/>
      <rect x="800" y="335" width="46" height="8" rx="4" fill="#CCD8D1"/>

      <!-- Official Logo On Front Door -->
      <g transform="translate(520, 360) scale(0.42)">
        <rect width="140" height="140" rx="32" fill="#0D2D24" stroke="rgba(22, 165, 114, 0.5)" stroke-width="2"/>
        <g transform="translate(27, 23) scale(0.27) skewX(-12)">
          <path d="M 188 28 L 138 28 C 130 16, 116 10, 94 10 C 58 10, 36 30, 36 60 C 36 86, 56 102, 102 114 L 140 126 L 40 162 C 15 146, 0 120, 0 70 C 0 22, 42 0, 100 0 C 158 0, 186 24, 188 28 Z" fill="#F8F9F6"/>
          <path d="M 198 214 C 198 284, 150 326, 88 326 C 34 326, 2 292, 0 236 L 56 230 C 58 262, 74 278, 96 278 C 122 278, 142 260, 142 228 C 142 200, 124 186, 78 172 L 68 168 L 168 132 C 188 152, 198 180, 198 214 Z" fill="#16A572"/>
          <polygon points="238,8 288,8 274,212 248,212" fill="#FFCC45"/>
          <circle cx="260" cy="282" r="28" fill="#FFCC45"/>
        </g>
        <text x="165" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-weight="900" font-size="64" fill="#FFFFFF" letter-spacing="2">SIMBORA<tspan fill="#FFCC45">!</tspan></text>
        <text x="168" y="122" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="14" fill="#16A572" letter-spacing="2">PEDIU. CHEGOU. SIMBORA!</text>
      </g>
    </svg>
  </div>

  <div class="footer-specs">
    <span>APLICAÇÃO: VINIL POLIMÉRICO AUTOMOTIVO COM LAMINAÇÃO UV</span>
    <span>PADRÃO: PORTA DIANTEIRA + LATERAL TRASEIRA</span>
    <span>CORES: #123D32 &bull; #16A572 &bull; #FFCC45</span>
  </div>
</div>
</body></html>`;

// HTML for PEÇA 3: Social Media Ad "A forma mais segura de se locomover pela cidade" (Ref 3)
// 1080x1350 vertical feed post
const piece3Html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width: 1080px; height: 1350px; background: #0A120F; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #F8F9F6; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .post-card { position: relative; width: 1080px; height: 1350px; background: radial-gradient(circle at 75% 25%, #123D32 0%, #0A120F 70%); padding: 70px 60px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }

  /* Background Chevron Speed Accents */
  .speed-chevron { position: absolute; right: -80px; top: 400px; width: 450px; height: 450px; pointer-events: none; opacity: 0.18; }

  /* Top Section */
  .top-row { display: flex; justify-content: space-between; align-items: flex-start; z-index: 2; }
  .headline-group { max-width: 540px; }
  .headline { font-size: 54px; font-weight: 900; line-height: 1.15; color: #FFFFFF; letter-spacing: -0.5px; }
  .headline span { color: #FFCC45; }
  .sub-headline { font-size: 20px; font-weight: 600; color: #A3C9BC; margin-top: 18px; line-height: 1.4; }

  /* Conversion Offer Card (Top Right) */
  .offer-card { background: rgba(18, 61, 50, 0.7); border: 1.5px solid rgba(22, 165, 114, 0.5); backdrop-filter: blur(10px); border-radius: 20px; padding: 22px; width: 340px; display: flex; flex-direction: column; gap: 14px; box-shadow: 0 16px 32px rgba(0,0,0,0.4); }
  .offer-badge { display: flex; align-items: center; justify-content: space-between; }
  .discount-tag { font-size: 42px; font-weight: 900; color: #FFCC45; line-height: 1; }
  .discount-tag span { font-size: 22px; color: #16A572; }

  /* Chat Bubble floating over car */
  .chat-bubble { position: absolute; left: 80px; top: 580px; background: #FFFFFF; color: #17211D; padding: 18px 26px; border-radius: 24px; border-bottom-left-radius: 4px; box-shadow: 0 20px 40px rgba(0,0,0,0.35); font-size: 19px; font-weight: 800; z-index: 5; display: flex; align-items: center; gap: 10px; }
  .chat-bubble::after { content: ''; position: absolute; bottom: -10px; left: 0; width: 0; height: 0; border-top: 10px solid #FFFFFF; border-right: 14px solid transparent; }

  /* Center Vehicle Showcase */
  .car-hero { position: absolute; bottom: 180px; left: 50%; transform: translateX(-50%); width: 920px; z-index: 3; }

  /* Bottom Bar */
  .bottom-bar { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.12); padding-top: 24px; z-index: 4; }
  .store-badges { display: flex; gap: 14px; align-items: center; }
  .store-pill { background: #123D32; border: 1px solid rgba(22, 165, 114, 0.4); padding: 10px 18px; border-radius: 12px; font-size: 13px; font-weight: 800; color: #FFFFFF; }
</style></head><body>
<div class="post-card">
  <!-- Speed Chevron Background Vector -->
  <div class="speed-chevron">
    <svg viewBox="0 0 300 300" width="100%" height="100%">
      <path d="M 50 20 L 220 150 L 50 280 L 110 280 L 280 150 L 110 20 Z" fill="#16A572"/>
      <path d="M 0 50 L 140 150 L 0 250 L 40 250 L 180 150 L 40 50 Z" fill="#FFCC45"/>
    </svg>
  </div>

  <!-- Top Row Content -->
  <div class="top-row">
    <div class="headline-group">
      <div style="font-size: 13px; font-weight: 800; color: #16A572; letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 12px;">MOBILIDADE COM SEGURANÇA</div>
      <h1 class="headline">A forma mais segura de se locomover <span>pela cidade.</span></h1>
      <p class="sub-headline">Viagens rápidas no seu município e entre cidades de Alagoas. Motoristas verificados e preço justo.</p>
    </div>

    <!-- Promo Card -->
    <div class="offer-card">
      <div class="offer-badge">
        <span style="font-size: 12px; font-weight: 800; letter-spacing: 1.5px; color: #A3C9BC; text-transform: uppercase;">PRIMEIRA VIAGEM</span>
        <div class="discount-tag">30% <span>OFF</span></div>
      </div>
      <div style="font-size: 13px; color: #F8F9F6; line-height: 1.3;">Use o cupom <strong>SIMBORA30</strong> no app e aproveite seu desconto!</div>
      <div style="display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 10px;">
        <!-- QR Code placeholder -->
        <div style="width: 36px; height: 36px; background: #FFFFFF; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: #123D32;">QR</div>
        <span style="font-size: 12px; font-weight: 700; color: #FFCC45;">Aponte a câmera e baixe agora</span>
      </div>
    </div>
  </div>

  <!-- Floating Chat Bubble -->
  <div class="chat-bubble">
    Precisando de uma viagem rápida? <strong>Simbora! 🚕</strong>
  </div>

  <!-- Vehicle Illustration (Glossy Dark Sedan with Emerald Reflections) -->
  <div class="car-hero">
    <svg viewBox="0 0 900 420" width="100%" height="100%">
      <ellipse cx="450" cy="380" rx="420" ry="24" fill="#000000" opacity="0.6"/>
      <!-- Sedan Silhouette Front-Quarter -->
      <path d="M 160 340 L 220 280 L 320 250 L 460 170 L 660 170 L 780 250 L 860 290 L 880 340 L 780 360 L 680 360 L 320 360 L 220 360 Z" fill="#17211D" stroke="#16A572" stroke-width="2"/>
      <path d="M 280 310 L 450 290 L 650 290 L 780 310 L 850 340 L 190 340 Z" fill="#123D32" opacity="0.8"/>
      <!-- Headlights LED Glow -->
      <polygon points="210,310 290,300 270,330 200,335" fill="#FFCC45" opacity="0.9"/>
      <polygon points="760,300 840,310 850,335 780,330" fill="#FFCC45" opacity="0.9"/>
      <line x1="200" y1="335" x2="850" y2="335" stroke="#16A572" stroke-width="3"/>
      <!-- Wheels -->
      <circle cx="280" cy="360" r="48" fill="#000000" stroke="#8C9E95" stroke-width="6"/>
      <circle cx="760" cy="360" r="48" fill="#000000" stroke="#8C9E95" stroke-width="6"/>
    </svg>
  </div>

  <!-- Bottom Bar: Brand Logo & App Store Badges -->
  <div class="bottom-bar">
    <div style="display: flex; align-items: center; gap: 16px;">
      <div style="width: 54px; height: 54px; border-radius: 14px; overflow: hidden;">
        ${appIconSvg}
      </div>
      <div>
        <div style="font-size: 26px; font-weight: 900; letter-spacing: 1.5px; color: #FFFFFF;">SIMBORA<span style="color:#FFCC45;">!</span></div>
        <div style="font-size: 11px; font-weight: 800; color: #16A572; letter-spacing: 2px; text-transform: uppercase;">Pediu. Chegou. Simbora!</div>
      </div>
    </div>

    <div class="store-badges">
      <div class="store-pill">Google Play</div>
      <div class="store-pill">App Store</div>
    </div>
  </div>
</div>
</body></html>`;

// HTML for PEÇA 4: Driver Partner Post "Chame suas corridas pelo celular" (Ref 4)
// 1080x1080 square Instagram feed post
const piece4Html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width: 1080px; height: 1080px; background: #0E1A16; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #F8F9F6; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .square-post { position: relative; width: 1080px; height: 1080px; background: radial-gradient(circle at 30% 70%, #123D32 0%, #0E1A16 80%); padding: 60px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }

  /* Circuit & Route Lines in Background */
  .route-circuit { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0.25; }

  /* Top Bar */
  .top-brand { display: flex; justify-content: space-between; align-items: center; z-index: 5; }

  /* Main Split: Left Phone GPS Mockup, Right Content & Driver */
  .content-stage { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; z-index: 4; flex: 1; }

  /* Smartphone Mockup */
  .phone-mock {
    width: 290px; height: 570px; background: #FFFFFF; border-radius: 44px;
    border: 9px solid #17211D; box-shadow: 0 30px 60px rgba(0,0,0,0.5);
    overflow: hidden; display: flex; flex-direction: column; position: relative;
  }
  .phone-screen {
    background: #E8ECE9; height: 100%; display: flex; flex-direction: column;
  }
  .phone-nav-bar { background: #123D32; padding: 14px; color: #FFFFFF; font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 8px; }
  .phone-map-view { flex: 1; position: relative; background: #DCE5E0; overflow: hidden; }

  /* Right Column Copy & Driver Profile */
  .right-column { max-width: 580px; display: flex; flex-direction: column; gap: 24px; }
  .main-pitch { font-size: 46px; font-weight: 900; line-height: 1.15; color: #FFFFFF; }
  .main-pitch span.highlight { color: #FFCC45; }

  /* Driver Trust Card */
  .driver-card {
    background: rgba(18, 61, 50, 0.6); border: 1.5px solid rgba(22, 165, 114, 0.4);
    backdrop-filter: blur(8px); border-radius: 20px; padding: 22px 28px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .driver-info { display: flex; align-items: center; gap: 16px; }
  .driver-avatar { width: 64px; height: 64px; border-radius: 32px; background: #16A572; border: 3px solid #FFCC45; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 900; color: #FFFFFF; }
  .driver-name { font-size: 19px; font-weight: 900; color: #FFFFFF; }
  .driver-sub { font-size: 12px; font-weight: 800; color: #FFCC45; text-transform: uppercase; letter-spacing: 1px; }

  .whatsapp-cta {
    background: #16A572; color: #FFFFFF; padding: 12px 20px; border-radius: 12px;
    font-size: 14px; font-weight: 800; display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 20px rgba(22, 165, 114, 0.4);
  }

  /* Bottom Trust Strip */
  .bottom-trust { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; font-size: 13px; font-weight: 700; color: #8A9D94; z-index: 5; }
</style></head><body>
<div class="square-post">
  <!-- Circuit routes background -->
  <svg class="route-circuit" viewBox="0 0 1000 1000">
    <path d="M 100 200 L 400 200 L 600 400 L 900 400" fill="none" stroke="#16A572" stroke-width="2"/>
    <circle cx="600" cy="400" r="6" fill="#FFCC45"/>
    <path d="M 200 800 L 500 800 L 700 600 L 950 600" fill="none" stroke="#FFCC45" stroke-width="2"/>
    <circle cx="500" cy="800" r="6" fill="#16A572"/>
  </svg>

  <!-- Top Bar -->
  <div class="top-brand">
    <div style="display: flex; align-items: center; gap: 14px;">
      <div style="width: 48px; height: 48px; border-radius: 12px; overflow: hidden;">${appIconSvg}</div>
      <div style="font-size: 24px; font-weight: 900; color: #FFFFFF; letter-spacing: 1px;">SIMBORA<span style="color:#FFCC45;">!</span></div>
    </div>
    <div style="background: rgba(22, 165, 114, 0.2); border: 1px solid #16A572; padding: 6px 16px; border-radius: 999px; font-size: 11px; font-weight: 800; color: #FFCC45; letter-spacing: 1.5px; text-transform: uppercase;">
      PENEDO &bull; PIAÇABUÇU &bull; ALAGOAS
    </div>
  </div>

  <!-- Content Stage -->
  <div class="content-stage">
    <!-- Smartphone with App Route Mockup -->
    <div class="phone-mock">
      <div class="phone-screen">
        <div class="phone-nav-bar">
          <div style="width: 8px; height: 8px; border-radius: 4px; background: #FFCC45;"></div>
          <span>SIMBORA MOBILIDADE</span>
        </div>
        <div class="phone-map-view">
          <!-- Stylized Map Streets -->
          <svg viewBox="0 0 290 420" width="100%" height="100%">
            <!-- Street grid -->
            <path d="M 30 0 L 30 420 M 120 0 L 120 420 M 210 0 L 210 420" stroke="#CBD8D1" stroke-width="8"/>
            <path d="M 0 80 L 290 80 M 0 190 L 290 190 M 0 310 L 290 310" stroke="#CBD8D1" stroke-width="8"/>
            <!-- Active Route Line in Verde Vibrante -->
            <path d="M 60 350 L 120 190 L 210 120" fill="none" stroke="#16A572" stroke-width="8" stroke-linecap="round"/>
            <!-- Origin Pin -->
            <circle cx="60" cy="350" r="10" fill="#123D32"/>
            <circle cx="60" cy="350" r="4" fill="#FFFFFF"/>
            <!-- Destination Pin -->
            <circle cx="210" cy="120" r="12" fill="#FFCC45"/>
            <circle cx="210" cy="120" r="5" fill="#123D32"/>
          </svg>
          <!-- Trip Bottom Card inside phone -->
          <div style="position: absolute; bottom: 12px; left: 12px; right: 12px; background: #FFFFFF; border-radius: 14px; padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <div style="font-size: 10px; font-weight: 800; color: #16A572; text-transform: uppercase;">Corrida em 3 min</div>
            <div style="font-size: 13px; font-weight: 800; color: #17211D; margin-top: 2px;">Centro Histórico &rarr; Orla</div>
            <div style="margin-top: 6px; background: #FFCC45; color: #123D32; font-weight: 900; font-size: 11px; padding: 6px; border-radius: 6px; text-align: center;">
              Motorista a caminho
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Copy & Action -->
    <div class="right-column">
      <h2 class="main-pitch">
        Chame suas corridas de forma <span class="highlight">fácil e rápida</span> pelo celular.
      </h2>
      <p style="font-size: 18px; color: #A3C9BC; line-height: 1.4;">
        Sem burocracia, com motoristas da nossa terra e atendimento humanizado. Pediu. Chegou. Simbora!
      </p>

      <!-- Driver Identification Card -->
      <div class="driver-card">
        <div class="driver-info">
          <div class="driver-avatar">JO</div>
          <div>
            <div class="driver-name">José de Oliveira</div>
            <div class="driver-sub">&starf; 4.98 &bull; Motorista Parceiro Oficial</div>
          </div>
        </div>
        <div class="whatsapp-cta">
          <span>(82) 9999-SIMBORA</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Trust -->
  <div class="bottom-trust">
    <span>DISPONÍVEL PARA ANDROID E IOS</span>
    <span style="color: #FFCC45;">PEDIU. CHEGOU. SIMBORA!</span>
    <span>ACESSE NOSSAS REDES: @SIMBORAMOBILIDADE</span>
  </div>
</div>
</body></html>`;

// HTML for PEÇA 5: Vertical Story / Card "Descubra uma nova forma de se locomover" (Ref 5)
// 1080x1920 vertical Story format
const piece5Html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width: 1080px; height: 1920px; background: #0A120E; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #F8F9F6; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .story-canvas { position: relative; width: 1080px; height: 1920px; background: radial-gradient(circle at 50% 30%, #123D32 0%, #0A120E 85%); padding: 80px 70px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }

  /* Golden/Emerald Border Frame (Inspired by Reference 5) */
  .story-frame {
    position: relative; flex: 1; border: 3px solid #FFCC45; border-radius: 44px;
    padding: 70px 60px; display: flex; flex-direction: column; justify-content: space-between;
    box-shadow: 0 0 50px rgba(255, 204, 69, 0.2), inset 0 0 40px rgba(22, 165, 114, 0.15);
    background: rgba(18, 61, 50, 0.45); backdrop-filter: blur(12px);
  }

  .badge-tag {
    background: #FFCC45; color: #123D32; font-size: 13px; font-weight: 900;
    padding: 8px 22px; border-radius: 999px; letter-spacing: 2px; text-transform: uppercase;
    display: inline-block; align-self: flex-start;
  }

  .story-headline {
    font-size: 64px; font-weight: 900; line-height: 1.15; color: #FFFFFF; margin-top: 36px;
  }
  .story-headline span { color: #FFCC45; }

  .story-sub {
    font-size: 24px; font-weight: 600; color: #A3C9BC; line-height: 1.5; margin-top: 24px; max-width: 780px;
  }

  /* Values Icons */
  .values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 40px 0; }
  .val-box { background: rgba(255,255,255,0.06); border: 1px solid rgba(22, 165, 114, 0.3); border-radius: 18px; padding: 24px; text-align: center; }
  .val-num { font-size: 28px; font-weight: 900; color: #FFCC45; }
  .val-title { font-size: 13px; font-weight: 800; color: #FFFFFF; margin-top: 4px; text-transform: uppercase; }

  /* Bottom Actions */
  .footer-action {
    display: flex; flex-direction: column; gap: 20px; align-items: center; text-align: center;
  }
  .cta-button {
    width: 100%; background: #FFCC45; color: #123D32; font-size: 24px; font-weight: 900;
    padding: 24px; border-radius: 20px; text-transform: uppercase; letter-spacing: 2px;
    box-shadow: 0 16px 36px rgba(255, 204, 69, 0.35);
  }
</style></head><body>
<div class="story-canvas">
  <div class="story-frame">
    <!-- Top Brand & Tag -->
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 60px; height: 60px; border-radius: 16px; overflow: hidden;">${appIconSvg}</div>
          <div style="font-size: 30px; font-weight: 900; color: #FFFFFF;">SIMBORA<span style="color:#FFCC45;">!</span></div>
        </div>
        <div class="badge-tag">NOVIDADE EM ALAGOAS</div>
      </div>

      <h1 class="story-headline">
        Descubra uma nova forma de se locomover pela cidade com o <span>SIMBORA!</span>
      </h1>
      <p class="story-sub">
        Conforto, praticidade e segurança estão a apenas um toque de distância. Conectando Penedo, Piaçabuçu e toda a região com agilidade e preço justo.
      </p>

      <!-- Values Grid -->
      <div class="values-grid">
        <div class="val-box">
          <div class="val-num">100%</div>
          <div class="val-title">Motoristas Verificados</div>
        </div>
        <div class="val-box">
          <div class="val-num">24h</div>
          <div class="val-title">Atendimento Local</div>
        </div>
        <div class="val-box">
          <div class="val-num">R$</div>
          <div class="val-title">Preço Transparente</div>
        </div>
      </div>
    </div>

    <!-- Bottom Call To Action -->
    <div class="footer-action">
      <div class="cta-button">Baixar Aplicativo Agora</div>
      <div style="font-size: 16px; font-weight: 700; color: #A3C9BC;">
        Siga no Instagram: <strong>@simboramobilidade</strong> &bull; www.simboraapp.com.br
      </div>
      <div style="font-size: 13px; font-weight: 800; color: #16A572; letter-spacing: 2px; text-transform: uppercase;">
        Pediu. Chegou. Simbora!
      </div>
    </div>
  </div>
</div>
</body></html>`;

// Array of render jobs
const jobs = [
  { html: piece1Html, w: 1920, h: 1080, name: 'simbora-mockup-veiculo-eletrico-3d', targetDir: mockupsDir },
  { html: piece2Html, w: 1920, h: 1080, name: 'simbora-mockup-lateral-hatchback', targetDir: mockupsDir },
  { html: piece3Html, w: 1080, h: 1350, name: 'simbora-campanha-seguranca-urbana-feed', targetDir: campaignsDir },
  { html: piece4Html, w: 1080, h: 1080, name: 'simbora-post-motorista-parceiro-gps', targetDir: socialDir },
  { html: piece5Html, w: 1080, h: 1920, name: 'simbora-card-story-descubra-simbora', targetDir: socialDir }
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage();

  for (const job of jobs) {
    console.log('Rendering:', job.name, `(${job.w}x${job.h})...`);
    await page.setViewport({ width: job.w, height: job.h, deviceScaleFactor: 1 });
    await page.setContent(job.html, { waitUntil: 'load' });

    // Output paths
    const pngPath = path.join(job.targetDir, job.name + '.png');
    const jpgPath = path.join(job.targetDir, job.name + '.jpg');
    const exportPngPath = path.join(exportsDir, job.name + '.png');
    const exportJpgPath = path.join(exportsDir, job.name + '.jpg');

    // Screenshot PNG
    await page.screenshot({ path: pngPath, type: 'png' });
    fs.copyFileSync(pngPath, exportPngPath);

    // Screenshot JPG
    await page.screenshot({ path: jpgPath, type: 'jpeg', quality: 95 });
    fs.copyFileSync(jpgPath, exportJpgPath);

    console.log('Successfully saved to:', pngPath);
  }

  await browser.close();
  console.log('\nAll 5 campaign pieces rendered and saved to exports successfully!');
}

run().catch(console.error);
