const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = 'C:\\Users\\winc\\.gemini\\antigravity\\scratch\\mobility-platform\\SIMBORA-REBRANDING\\03-LOGO\\refinement-s-exclamation';

console.log('Generating refined S! vector assets...');

// SVGs for the variations:

// 1. VARIATION A: KINETIC VELOCITY (Slanted 10°, Pure Contrast White + Yellow on Deep Green)
const varA_icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- VAR A: KINETIC VELOCITY S! -->
  <rect width="512" height="512" rx="112" fill="#123D32"/>
  <g transform="translate(110, 86)">
    <!-- Slanted container for forward velocity (skewX -11deg) -->
    <g transform="skewX(-11)">
      <!-- Custom S Path -->
      <path d="M 185 24 C 185 8, 168 0, 130 0 C 65 0, 15 32, 10 92 C 6 142, 50 162, 105 178 C 160 194, 185 210, 185 250 C 185 298, 145 324, 95 324 C 42 324, 8 296, 2 245 L 64 238 C 67 265, 82 278, 102 278 C 122 278, 136 266, 136 248 C 136 226, 115 212, 70 198 C 22 182, 0 155, 0 102 C 0 44, 48 0, 125 0 C 182 0, 228 32, 235 90 L 178 98 C 174 72, 158 52, 130 52 C 108 52, 92 64, 92 84 C 92 102, 110 114, 145 125 C 195 142, 235 170, 235 235 C 235 292, 195 340, 105 340 C 35 340, 0 295, 0 230" fill="none"/>
      
      <!-- SOLID SCULPTED S (Geometric bezier outline) -->
      <path d="M 195 32 L 140 32 C 135 22, 122 14, 102 14 C 70 14, 48 34, 48 64 C 48 90, 68 106, 112 118 C 168 134, 206 162, 206 224 C 206 288, 156 328, 92 328 C 36 328, 2 294, 0 238 L 56 232 C 58 266, 76 282, 98 282 C 124 282, 144 264, 144 232 C 144 204, 126 190, 80 176 C 28 160, 0 134, 0 74 C 0 26, 44 0, 104 0 C 162 0, 194 28, 195 32 Z" fill="#F8F9F6"/>

      <!-- BESPOKE EXCLAMATION STEM (Tapered dynamic wedge) -->
      <path d="M 236 12 L 282 12 L 272 216 L 246 216 Z" fill="#FFCC45"/>

      <!-- BESPOKE EXCLAMATION SOLAR DOT -->
      <circle cx="258" cy="285" r="28" fill="#FFCC45"/>
    </g>
  </g>
</svg>`;

// 2. VARIATION B: DUOTONE VIBRANT (Verde Vibrante S + Amarelo Energia ! on Deep Green)
const varB_icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- VAR B: DUOTONE VIBRANT S! (Emerald & Sun) -->
  <rect width="512" height="512" rx="112" fill="#123D32"/>
  <g transform="translate(110, 86)">
    <g transform="skewX(-11)">
      <!-- Sculpted S in Verde Vibrante -->
      <path d="M 195 32 L 140 32 C 135 22, 122 14, 102 14 C 70 14, 48 34, 48 64 C 48 90, 68 106, 112 118 C 168 134, 206 162, 206 224 C 206 288, 156 328, 92 328 C 36 328, 2 294, 0 238 L 56 232 C 58 266, 76 282, 98 282 C 124 282, 144 264, 144 232 C 144 204, 126 190, 80 176 C 28 160, 0 134, 0 74 C 0 26, 44 0, 104 0 C 162 0, 194 28, 195 32 Z" fill="#16A572"/>

      <!-- Exclamation in Amarelo Energia -->
      <path d="M 236 12 L 282 12 L 272 216 L 246 216 Z" fill="#FFCC45"/>
      <circle cx="258" cy="285" r="28" fill="#FFCC45"/>
    </g>
  </g>
</svg>`;

// 3. VARIATION C: PURE GEOMETRIC MONOLITH (Upright 0°, Ultra-clean Squircles, High-Tech)
const varC_icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- VAR C: PURE GEOMETRIC MONOLITH (Vertical, High-Tech Modern) -->
  <rect width="512" height="512" rx="112" fill="#123D32"/>
  <g transform="translate(100, 92)">
    <!-- Monolithic S: Pure geometric contours, squircle ends, balanced mass -->
    <path d="M 190 40 C 172 14, 144 0, 104 0 C 44 0, 2 36, 2 86 C 2 140, 48 166, 108 180 C 158 192, 184 212, 184 250 C 184 290, 150 324, 94 324 C 44 324, 12 296, 4 246 L 58 240 C 62 268, 76 280, 98 280 C 122 280, 138 264, 138 244 C 138 214, 114 198, 64 184 C 20 170, 0 142, 0 88 C 0 34, 40 0, 104 0 C 150 0, 182 22, 194 44 Z" fill="#F8F9F6"/>

    <!-- Geometric Capsule Exclamation Stem -->
    <rect x="228" y="10" width="44" height="196" rx="22" fill="#FFCC45"/>

    <!-- Pure Solar Circle Dot -->
    <circle cx="250" cy="280" r="26" fill="#FFCC45"/>
  </g>
</svg>`;

// 4. VARIATION D: THE PIN-EXCLAMATION (S + Location Node Integration)
const varD_icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- VAR D: THE TRANSIT PIN-EXCLAMATION (Mobility beacon) -->
  <rect width="512" height="512" rx="112" fill="#123D32"/>
  <g transform="translate(100, 86)">
    <g transform="skewX(-9)">
      <!-- S Lettermark -->
      <path d="M 195 32 L 140 32 C 135 22, 122 14, 102 14 C 70 14, 48 34, 48 64 C 48 90, 68 106, 112 118 C 168 134, 206 162, 206 224 C 206 288, 156 328, 92 328 C 36 328, 2 294, 0 238 L 56 232 C 58 266, 76 282, 98 282 C 124 282, 144 264, 144 232 C 144 204, 126 190, 80 176 C 28 160, 0 134, 0 74 C 0 26, 44 0, 104 0 C 162 0, 194 28, 195 32 Z" fill="#F8F9F6"/>

      <!-- Tapered Exclamation Stem aiming down to destination -->
      <path d="M 234 10 L 284 10 L 268 200 L 250 200 Z" fill="#16A572"/>

      <!-- Destination Target Node (Solar Ring + Dot) -->
      <circle cx="259" cy="275" r="32" fill="#FFCC45"/>
      <circle cx="259" cy="275" r="14" fill="#123D32"/>
    </g>
  </g>
</svg>`;

// 5. VARIATION E: SOLID NEGATIVE-SPACE BADGE (Shield/Tile with embedded S!)
const varE_icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- VAR E: SOLID EMBEDDED BADGE S! -->
  <rect width="512" height="512" rx="112" fill="#123D32"/>
  <!-- Inner Energetic Plate in Verde Vibrante -->
  <rect x="56" y="56" width="400" height="400" rx="72" fill="#16A572"/>
  <g transform="translate(130, 100)">
    <g transform="skewX(-10)">
      <!-- S in Pure White -->
      <path d="M 175 28 L 128 28 C 124 18, 112 12, 94 12 C 64 12, 44 30, 44 58 C 44 82, 62 96, 102 108 C 154 122, 188 148, 188 204 C 188 262, 142 300, 84 300 C 32 300, 2 268, 0 216 L 50 212 C 52 242, 68 258, 88 258 C 112 258, 130 242, 130 212 C 130 186, 114 174, 72 160 C 24 146, 0 122, 0 68 C 0 24, 40 0, 94 0 C 146 0, 174 24, 175 28 Z" fill="#FFFFFF"/>
      
      <!-- ! in Amarelo Energia with sharp white halo -->
      <path d="M 216 10 L 256 10 L 246 195 L 226 195 Z" fill="#FFCC45"/>
      <circle cx="236" cy="258" r="26" fill="#FFCC45"/>
    </g>
  </g>
</svg>`;

fs.writeFileSync(path.join(outDir, 'var-a-kinetic-velocity.svg'), varA_icon, 'utf8');
fs.writeFileSync(path.join(outDir, 'var-b-duotone-vibrant.svg'), varB_icon, 'utf8');
fs.writeFileSync(path.join(outDir, 'var-c-geometric-monolith.svg'), varC_icon, 'utf8');
fs.writeFileSync(path.join(outDir, 'var-d-pin-mobility.svg'), varD_icon, 'utf8');
fs.writeFileSync(path.join(outDir, 'var-e-embedded-badge.svg'), varE_icon, 'utf8');

console.log('All 5 icon variations written.');

// Now create the Horizontal Master Lockups for the top 3 contenders (A, B, C)
function createLockup(symbolSvg, title, filename) {
  const content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 220" width="100%" height="100%">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800;900&amp;display=swap');
      .lockup-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 64px; font-weight: 900; letter-spacing: 3px; fill: #123D32; }
      .lockup-slogan { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14.5px; font-weight: 800; letter-spacing: 2.2px; text-transform: uppercase; fill: #16A572; }
    </style>
  </defs>
  <rect width="760" height="220" fill="#FFFFFF"/>
  <!-- Icon Symbol (150x150) -->
  <g transform="translate(35, 35) scale(0.293)">
    ${symbolSvg}
  </g>
  <!-- Full Brand Name & Slogan -->
  <g transform="translate(225, 115)">
    <text x="0" y="0" class="lockup-title">SIMBORA<tspan fill="#FFCC45">!</tspan></text>
    <text x="3" y="38" class="lockup-slogan">Pediu. Chegou. Simbora!</text>
  </g>
</svg>`;
  fs.writeFileSync(path.join(outDir, filename), content, 'utf8');
}

createLockup(varA_icon, 'SIMBORA', 'lockup-var-a-velocity.svg');
createLockup(varB_icon, 'SIMBORA', 'lockup-var-b-duotone.svg');
createLockup(varC_icon, 'SIMBORA', 'lockup-var-c-monolith.svg');

console.log('Lockups written successfully.');
