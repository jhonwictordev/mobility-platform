const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const studioDir = 'C:\\Users\\winc\\Desktop\\SIMBORA-CREATIVE-STUDIO';
const artifactDir = 'C:\\Users\\winc\\.gemini\\antigravity\\brain\\b5a5ba79-6e91-45b2-8392-8c29d8da9dcc';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

console.log('Building Creative Studio Master Dossier HTML & PDF...');

// Base64 helper for embedding images
function toBase64(filePath) {
  const fileData = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,${fileData.toString('base64')}`;
}

const ref1_b64 = toBase64(path.join(artifactDir, '.user_uploaded', 'media_1793418883409_d78b38c2.png'));
const ref2_b64 = toBase64(path.join(artifactDir, '.user_uploaded', 'media_1793418946644_ed07c79c.png'));
const ref3_b64 = toBase64(path.join(artifactDir, '.user_uploaded', 'media_1793419045954_187d9c1b.png'));
const ref4_b64 = toBase64(path.join(artifactDir, '.user_uploaded', 'media_1793419101649_f0568dec.jpg'));
const ref5_b64 = toBase64(path.join(artifactDir, '.user_uploaded', 'media_1793419145543_31a03555.png'));

const art1_b64 = toBase64(path.join(artifactDir, 'simbora-mockup-veiculo-eletrico-3d.png'));
const art2_b64 = toBase64(path.join(artifactDir, 'simbora-mockup-lateral-hatchback.png'));
const art3_b64 = toBase64(path.join(artifactDir, 'simbora-campanha-seguranca-urbana-feed.png'));
const art4_b64 = toBase64(path.join(artifactDir, 'simbora-post-motorista-parceiro-gps.png'));
const art5_b64 = toBase64(path.join(artifactDir, 'simbora-card-story-descubra-simbora.png'));

const masterHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SIMBORA! Creative Brand Studio — Dossiê de Expansão &amp; Produção de Campanhas</title>
<style>
  :root {
    --verde-profundo: #123D32;
    --verde-vibrante: #16A572;
    --amarelo-energia: #FFCC45;
    --branco-suave: #F8F9F6;
    --grafite-mineral: #17211D;
    --cinza-bg: #F4F7F5;
    --borda: #E2E8E4;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    background: #0B110E;
    color: #17211D;
    line-height: 1.45;
    padding: 30px 20px 80px;
    -webkit-font-smoothing: antialiased;
  }
  .container { max-width: 1360px; margin: 0 auto; }

  /* HERO */
  .hero-card {
    background: linear-gradient(135deg, #123D32 0%, #08211A 100%);
    border-radius: 24px;
    padding: 48px;
    color: #FFFFFF;
    margin-bottom: 36px;
    border: 1px solid rgba(22, 165, 114, 0.35);
  }
  .badge-studio {
    background: #FFCC45;
    color: #123D32;
    font-size: 11px;
    font-weight: 900;
    padding: 6px 18px;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 2px;
    display: inline-block;
    margin-bottom: 16px;
  }
  .hero-title { font-size: 44px; font-weight: 900; line-height: 1.1; margin-bottom: 14px; }
  .hero-title span { color: #FFCC45; }
  .hero-subtitle { font-size: 17px; color: #A3C9BC; max-width: 860px; line-height: 1.5; }

  /* AUDIT BAR */
  .tokens-strip {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.12);
  }
  .token-swatch {
    border-radius: 12px;
    height: 70px;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    font-size: 11px;
    font-weight: 800;
  }

  /* SECTION CARDS */
  .section-card {
    background: #FFFFFF;
    border-radius: 20px;
    padding: 40px;
    margin-bottom: 36px;
    box-shadow: 0 16px 40px rgba(0,0,0,0.3);
    page-break-inside: avoid;
  }
  .section-badge {
    font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;
    color: var(--verde-vibrante); margin-bottom: 6px;
  }
  .section-title {
    font-size: 26px; font-weight: 900; color: var(--verde-profundo); margin-bottom: 8px;
  }
  .section-desc { font-size: 14.5px; color: #52635B; margin-bottom: 28px; max-width: 840px; }

  /* COMPARISON GRID (REFERENCE VS SIMBORA ART) */
  .comp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    margin-bottom: 24px;
  }
  .comp-panel {
    background: var(--cinza-bg);
    border: 1.5px solid var(--borda);
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .comp-header {
    padding: 14px 20px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .comp-header.ref { background: #E6EDE9; color: #556B61; }
  .comp-header.simbora { background: var(--verde-profundo); color: #FFCC45; }

  .comp-img-wrapper {
    flex: 1;
    min-height: 280px;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    overflow: hidden;
  }
  .comp-img-wrapper img {
    max-width: 100%;
    max-height: 380px;
    object-fit: contain;
    border-radius: 10px;
  }

  /* 4-DIMENSIONS ANALYSIS TABLE */
  .audit-box {
    background: #F8FAF9;
    border: 1px solid var(--borda);
    border-radius: 14px;
    padding: 22px 26px;
    margin-top: 16px;
  }
  .audit-row {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 16px;
    padding: 10px 0;
    border-bottom: 1px solid #E2EAE5;
    font-size: 13.5px;
  }
  .audit-row:last-child { border-bottom: none; }
  .audit-label { font-weight: 800; color: var(--verde-profundo); text-transform: uppercase; font-size: 11.5px; letter-spacing: 1px; }
  .audit-text { color: #35473F; line-height: 1.5; }

  @media print {
    body { background: #FFFFFF; padding: 0; }
    .hero-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .section-card { box-shadow: none; border: 1px solid #CCD4D0; page-break-after: always; }
    .comp-header.simbora { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>

<div class="container">

  <!-- HERO -->
  <header class="hero-card">
    <div class="badge-studio">SIMBORA CREATIVE BRAND STUDIO &bull; EXPANSÃO VISUAL</div>
    <h1 class="hero-title">Estúdio de Arte &amp; <span>Campanhas Publicitárias</span></h1>
    <p class="hero-subtitle">
      Ecossistema oficial de direção de arte, análise de referências e geração de peças publicitárias.
      A identidade visual homologada (<strong>Stencil Speed Cut</strong>) é preservada com fidelidade matemática absoluta,
      aplicando os arquivos vetoriais oficiais com proporções, tipografia Plus Jakarta Sans e paleta WCAG AA intactas.
    </p>

    <!-- TOKENS OFICIAIS -->
    <div class="tokens-strip">
      <div class="token-swatch" style="background: #123D32; color: #FFFFFF;">
        <span>#123D32</span>
        <span>Verde Profundo</span>
      </div>
      <div class="token-swatch" style="background: #16A572; color: #FFFFFF;">
        <span>#16A572</span>
        <span>Verde Vibrante</span>
      </div>
      <div class="token-swatch" style="background: #FFCC45; color: #17211D;">
        <span>#FFCC45</span>
        <span>Amarelo Energia</span>
      </div>
      <div class="token-swatch" style="background: #F8F9F6; color: #17211D; border: 1px solid rgba(0,0,0,0.1);">
        <span>#F8F9F6</span>
        <span>Branco Suave</span>
      </div>
      <div class="token-swatch" style="background: #17211D; color: #FFFFFF;">
        <span>#17211D</span>
        <span>Grafite Mineral</span>
      </div>
    </div>
  </header>

  <!-- ==================== PEÇA 1: VEHICLE MOCKUP 3D FRONT 3/4 ==================== -->
  <section class="section-card">
    <div class="section-badge">Peça 01 &bull; Frota &amp; Adesivagem Automotiva</div>
    <h2 class="section-title">Mockup 3D Frontal (3/4): Hatchback Elétrico Urbano</h2>
    <p class="section-desc">
      Adaptação da referência de mockup automotivo para a frota oficial da SIMBORA.
      Adesivagem de portas dianteiras e traseiras com a faixa dinâmica Stencil Speed Cut em Verde Vibrante e Amarelo Energia.
    </p>

    <div class="comp-grid">
      <!-- Imagem de Referência -->
      <div class="comp-panel">
        <div class="comp-header ref">
          <span>Referência Recebida #1</span>
          <span>Hatchback 3/4 Blue</span>
        </div>
        <div class="comp-img-wrapper">
          <img src="${ref1_b64}" alt="Referência 1">
        </div>
      </div>

      <!-- Arte Final SIMBORA -->
      <div class="comp-panel">
        <div class="comp-header simbora">
          <span>Arte Produzida SIMBORA!</span>
          <span>1920x1080 Full HD</span>
        </div>
        <div class="comp-img-wrapper">
          <img src="${art1_b64}" alt="Mockup Veículo Elétrico SIMBORA">
        </div>
      </div>
    </div>

    <!-- Análise das 4 Dimensões -->
    <div class="audit-box">
      <div class="audit-row">
        <div class="audit-label">1. Composição</div>
        <div class="audit-text">Enquadramento frontal 3/4 com piso neutro e sombra suave de contato de estúdio. Hierarquia focada na lateral da carroceria e dianteira do veículo.</div>
      </div>
      <div class="audit-row">
        <div class="audit-label">2. Estética</div>
        <div class="audit-text">Iluminação de estúdio automotivo, reflexos na lataria metálica Verde Profundo (#123D32) e rodas modernas com detalhes em amarelo.</div>
      </div>
      <div class="audit-row">
        <div class="audit-label">3. Comunicação</div>
        <div class="audit-text">Profissionalismo, sustentabilidade e inovação. A frota transmite que o aplicativo atende com veículos novos, seguros e confortáveis.</div>
      </div>
      <div class="audit-row">
        <div class="audit-label">4. Aplicação SIMBORA</div>
        <div class="audit-text">Badge S! em Verde Profundo aplicado na porta dianteira, wordmark SIMBORA! com exclamação amarela, faixa Stencil e placa oficial customizada "SIMBORA".</div>
      </div>
    </div>
  </section>

  <!-- ==================== PEÇA 2: VEHICLE PROFILE MOCKUP ==================== -->
  <section class="section-card">
    <div class="section-badge">Peça 02 &bull; Especificação Técnica 1:1</div>
    <h2 class="section-title">Mockup Perfil Lateral: Envelopamento de Lataria</h2>
    <p class="section-desc">
      Adaptação da referência lateral para manual técnico de adesivagem de parceiros em vinil polimérico automotivo.
    </p>

    <div class="comp-grid">
      <div class="comp-panel">
        <div class="comp-header ref">
          <span>Referência Recebida #2</span>
          <span>Car Side Profile</span>
        </div>
        <div class="comp-img-wrapper">
          <img src="${ref2_b64}" alt="Referência 2">
        </div>
      </div>

      <div class="comp-panel">
        <div class="comp-header simbora">
          <span>Arte Produzida SIMBORA!</span>
          <span>1920x1080 Full HD</span>
        </div>
        <div class="comp-img-wrapper">
          <img src="${art2_b64}" alt="Mockup Lateral SIMBORA">
        </div>
      </div>
    </div>

    <div class="audit-box">
      <div class="audit-row">
        <div class="audit-label">1. Composição</div>
        <div class="audit-text">Visão lateral ortográfica 2D pura (perfil 1:1), perfeita para guias de plotagem, adesivação de frotas e aprovação com frotistas.</div>
      </div>
      <div class="audit-row">
        <div class="audit-label">2. Estética</div>
        <div class="audit-text">Acabamento clean sobre carroceria Branco Suave (#F8F9F6) com vidros escurecidos e faixa dinâmica de aceleração com corte em 12°.</div>
      </div>
      <div class="audit-row">
        <div class="audit-label">3. Comunicação</div>
        <div class="audit-text">Clareza operacional e identificação imediata nas ruas por passageiros ao embarcar.</div>
      </div>
      <div class="audit-row">
        <div class="audit-label">4. Aplicação SIMBORA</div>
        <div class="audit-text">Selo vetorial S! na porta do motorista e passageiro com proteção UV, slogan "Pediu. Chegou. Simbora!" e especificações técnicas de materiais.</div>
      </div>
    </div>
  </section>

  <!-- ==================== PEÇA 3: FEED POST URBAN MOBILITY ==================== -->
  <section class="section-card">
    <div class="section-badge">Peça 03 &bull; Campanha de Aquisição &amp; Segurança</div>
    <h2 class="section-title">Feed Post (1080x1350): "A forma mais segura de se locomover"</h2>
    <p class="section-desc">
      Recriação completa da referência de anúncio da concorrência adaptada para o universo SIMBORA. Foco em conversão, segurança e cupom de 30% OFF.
    </p>

    <div class="comp-grid">
      <div class="comp-panel">
        <div class="comp-header ref">
          <span>Referência Recebida #3</span>
          <span>Uber Ad Post</span>
        </div>
        <div class="comp-img-wrapper">
          <img src="${ref3_b64}" alt="Referência 3">
        </div>
      </div>

      <div class="comp-panel">
        <div class="comp-header simbora">
          <span>Arte Produzida SIMBORA!</span>
          <span>1080x1350 Vertical Feed</span>
        </div>
        <div class="comp-img-wrapper">
          <img src="${art3_b64}" alt="Campanha Segurança Urbana SIMBORA">
        </div>
      </div>
    </div>

    <div class="audit-box">
      <div class="audit-row">
        <div class="audit-label">1. Composição</div>
        <div class="audit-text">Layout vertical 4:5 otimizado para o feed do Instagram. Headline no quadrante superior esquerdo, card promocional no canto superior direito e sedã escuro em destaque na base.</div>
      </div>
      <div class="audit-row">
        <div class="audit-label">2. Estética</div>
        <div class="audit-text">Paleta escura de alto luxo baseada no Verde Profundo (#123D32) com chevrons gráficos em Verde Vibrante e balão de conversa humanizado.</div>
      </div>
      <div class="audit-row">
        <div class="audit-label">3. Comunicação</div>
        <div class="audit-text">Gatilho de segurança e economia com o cupom SIMBORA30 (30% OFF) para passageiros de primeira viagem em Penedo, Piaçabuçu e região.</div>
      </div>
      <div class="audit-row">
        <div class="audit-label">4. Aplicação SIMBORA</div>
        <div class="audit-text">Logo SIMBORA! oficial no rodapé, selos oficiais da Google Play e App Store, QR code funcional e tipografia Plus Jakarta Sans 900.</div>
      </div>
    </div>
  </section>

  <!-- ==================== PEÇA 4: DRIVER PARTNER FEED POST ==================== -->
  <section class="section-card">
    <div class="section-badge">Peça 04 &bull; Humanização &amp; Confiança do Motorista</div>
    <h2 class="section-title">Feed Quadrado (1080x1080): "Chame suas corridas pelo celular"</h2>
    <p class="section-desc">
      Recriação da referência do motorista parceiro (José de Oliveira) com GPS integrado na tela do celular e canal direto de atendimento.
    </p>

    <div class="comp-grid">
      <div class="comp-panel">
        <div class="comp-header ref">
          <span>Referência Recebida #4</span>
          <span>Motorista com GPS</span>
        </div>
        <div class="comp-img-wrapper">
          <img src="${ref4_b64}" alt="Referência 4">
        </div>
      </div>

      <div class="comp-panel">
        <div class="comp-header simbora">
          <span>Arte Produzida SIMBORA!</span>
          <span>1080x1080 Feed Quadrado</span>
        </div>
        <div class="comp-img-wrapper">
          <img src="${art4_b64}" alt="Post Motorista Parceiro SIMBORA">
        </div>
      </div>
    </div>

    <div class="audit-box">
      <div class="audit-row">
        <div class="audit-label">1. Composição</div>
        <div class="audit-text">Divisão equilibrada: smartphone com GPS na esquerda, mensagem de valor e perfil do motorista parceiro na direita.</div>
      </div>
      <div class="audit-row">
        <div class="audit-label">2. Estética</div>
        <div class="audit-text">Circuito de linhas de rota e nós de conexão em Verde Vibrante e Amarelo sobre fundo escuro institucional.</div>
      </div>
      <div class="audit-row">
        <div class="audit-label">3. Comunicação</div>
        <div class="audit-text">Proximidade popular, confiança no motorista parceiro e facilidade de pedir pelo celular sem burocracia.</div>
      </div>
      <div class="audit-row">
        <div class="audit-label">4. Aplicação SIMBORA</div>
        <div class="audit-text">Ícone S! no topo, tag regional "Penedo &bull; Piaçabuçu &bull; Alagoas", interface mobile proprietária e selo de motorista avaliado em 4.98 estrelas.</div>
      </div>
    </div>
  </section>

  <!-- ==================== PEÇA 5: VERTICAL STORY BRAND CARD ==================== -->
  <section class="section-card">
    <div class="section-badge">Peça 05 &bull; Stories 9:16 &amp; Lançamento</div>
    <h2 class="section-title">Card Story (1080x1920): "Descubra uma nova forma de se locomover"</h2>
    <p class="section-desc">
      Adaptação da referência com moldura dourada e mensagem institucional de conforto, praticidade e segurança para Stories do Instagram e WhatsApp Status.
    </p>

    <div class="comp-grid">
      <div class="comp-panel">
        <div class="comp-header ref">
          <span>Referência Recebida #5</span>
          <span>Driver Door Story</span>
        </div>
        <div class="comp-img-wrapper">
          <img src="${ref5_b64}" alt="Referência 5">
        </div>
      </div>

      <div class="comp-panel">
        <div class="comp-header simbora">
          <span>Arte Produzida SIMBORA!</span>
          <span>1080x1920 Stories</span>
        </div>
        <div class="comp-img-wrapper">
          <img src="${art5_b64}" alt="Story Card SIMBORA">
        </div>
      </div>
    </div>

    <div class="audit-box">
      <div class="audit-row">
        <div class="audit-label">1. Composição</div>
        <div class="audit-text">Enquadramento vertical 9:16 com moldura arredondada em destaque central, títulos em hierarquia decrescente e botão CTA de largura total.</div>
      </div>
      <div class="audit-row">
        <div class="audit-label">2. Estética</div>
        <div class="audit-text">Moldura em Amarelo Energia (#FFCC45) com efeito de brilho e glassmorphism suave sobre fundo Verde Profundo (#123D32).</div>
      </div>
      <div class="audit-row">
        <div class="audit-label">3. Comunicação</div>
        <div class="audit-text">3 pilares fundamentais comprovados em cards métricos: 100% Motoristas Verificados, Atendimento Local 24h e Preço Transparente.</div>
      </div>
      <div class="audit-row">
        <div class="audit-label">4. Aplicação SIMBORA</div>
        <div class="audit-text">Logo Stencil Speed Cut com exclamação amarela no cabeçalho, botão "Baixar Aplicativo Agora" em Amarelo Energia e assinatura de slogan.</div>
      </div>
    </div>
  </section>

</div>

</body>
</html>
`;

const htmlOutPath = path.join(studioDir, 'SIMBORA_CREATIVE_STUDIO_CAMPANHAS.html');
fs.writeFileSync(htmlOutPath, masterHtml, 'utf8');
console.log('HTML dossier saved at:', htmlOutPath);

// Copy HTML to artifact directory
fs.writeFileSync(path.join(artifactDir, 'SIMBORA_CREATIVE_STUDIO_CAMPANHAS.html'), masterHtml, 'utf8');

// Render PDF with Edge
const pdfOutPath = path.join(studioDir, 'SIMBORA_CREATIVE_STUDIO_CAMPANHAS.pdf');
const pdfArtifactPath = path.join(artifactDir, 'SIMBORA_CREATIVE_STUDIO_CAMPANHAS.pdf');

try {
  console.log('Rendering Master Creative Studio PDF via Edge...');
  const cmd = `"${edgePath}" --headless --no-sandbox --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfOutPath}" "${htmlOutPath}"`;
  execSync(cmd);
  console.log('PDF generated at:', pdfOutPath);
  fs.copyFileSync(pdfOutPath, pdfArtifactPath);
  console.log('PDF copied to Artifacts:', pdfArtifactPath);
} catch (e) {
  console.error('Edge print error:', e.message);
}
