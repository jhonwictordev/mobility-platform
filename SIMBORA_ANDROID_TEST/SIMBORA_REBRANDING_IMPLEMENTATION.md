# SIMBORA 3.5 — Relatório de Implementação da Identidade Visual Oficial
**Brand Book Definitivo • Tokens Cromáticos • Tipografia • Vetores SVG • UI/UX Design System**

---

## 1. Fonte da Verdade e Ativos Oficiais

A reconstrução visual do ecossistema SIMBORA foi realizada com base no manual de marca oficial localizado em:
`C:\SIMBORA IDV\SIMBORA_BRAND_BOOK_DEFINITIVO.html`

Todos os ativos vetoriais oficiais (SVG), logotipos e matrizes de cores foram importados para o projeto:
- `brand/VETORES-OFICIAIS-SVG/simbora-app-icon.svg`
- `brand/VETORES-OFICIAIS-SVG/simbora-logo-horizontal-dark.svg`
- `brand/VETORES-OFICIAIS-SVG/simbora-logo-horizontal-light.svg`
- `brand/VETORES-OFICIAIS-SVG/simbora-symbol-isolated.svg`
- `brand/VETORES-OFICIAIS-SVG/simbora-logo-vertical.svg`
- `brand/VETORES-OFICIAIS-SVG/simbora-logo-monochrome-black.svg`
- `public/brand/`
- `apps/admin/public/brand/`
- `apps/passenger/assets/`
- `apps/driver/assets/`

---

## 2. Paleta de Cores e Tokens Oficiais (Design Tokens)

As cores oficiais do SIMBORA foram parametrizadas em Tailwind CSS, CSS Custom Properties e configurações de apps:

| Token | Nome Oficial | Código HEX | Aplicação Principal |
|---|---|---|---|
| `--color-deep` | Verde Profundo | `#123D32` | Cor primária institucional, headers, cartões de destaque |
| `--color-vibrant` | Verde Vibrante | `#16A572` | Cor de ação, CTAs primários, estados de sucesso e pulso |
| `--color-energy` | Amarelo Energia | `#FFCC45` | Destaques, badges de categoria, estrelas e acentos |
| `--color-clean` | Branco Suave | `#F8F9F6` | Fundo principal da interface clara e textos sobre verde |
| `--color-dark` | Grafite Mineral / Petróleo | `#17211D` | Fundo dark mode, chassis dos celulares, superfícies de suporte |
| `--color-accent` | Verde Noite Profunda | `#0D2821` | Sombras, bordas escuras e fundos de alta profundidade |

---

## 3. Tipografia Oficial

A tipografia do projeto foi unificada em torno da família tipográfica oficial:
**Plus Jakarta Sans** (Google Fonts)
- Pesos carregados: `300 (Light)`, `400 (Regular)`, `500 (Medium)`, `600 (SemiBold)`, `700 (Bold)`, `800 (ExtraBold)`, `900 (Black)`.
- Aplicada globalmente:
  - No SIMBORA Studio (`mobility_interactive_studio.html`) via Google Fonts CDN e Tailwind `fontFamily.sans`.
  - No Painel Administrativo (`apps/admin/src/app/globals.css`) via `@import` e variáveis CSS.
  - Nos aplicativos mobile React Native/Expo (`apps/passenger` e `apps/driver`).

---

## 4. Slogan Institucional e Identidade Verbal

- **Slogan Oficial**: `"Pediu. Chegou. Simbora!"`
- **Assinatura**: *"Plataforma de Mobilidade Urbana e Intermunicipal de Alagoas"*
- Integrado na barra superior do SIMBORA Studio, no Brand Book e nos cabeçalhos dos aplicativos móveis.

---

## 5. Implementações Realizadas nos Canais da Plataforma

### 5.1 SIMBORA Studio (`mobility_interactive_studio.html`)
1. **Header do Estúdio**:
   - Substituição do "S" genérico pelo logotipo oficial `simbora-app-icon.svg`.
   - Adição do slogan oficial `"Pediu. Chegou. Simbora!"`.
   - Badges estilizados em Verde Profundo (`#123D32`) e Amarelo Energia (`#FFCC45`).
2. **Molduras dos Celulares (Chassis 390×844)**:
   - Adicionado símbolo oficial isolado (`simbora-symbol-isolated.svg`) nos cabeçalhos de ambos os simuladores.
   - Identificação visual clara: `SIMBORA Passageiro` (Marina Silva) e `SIMBORA Motorista` (Carlos Oliveira).
3. **Novos Modais de Marca**:
   - `#receipt-modal`: Comprovante Fiscal Oficial com divisão 85% motorista (R$ 57,80) e 15% SIMBORA (R$ 10,21).
   - `#sos-modal`: Central de Segurança SIMBORA 24h e integração de emergência 190 Alagoas.
   - `#pix-payout-modal`: Comprovante de Saque Instantâneo PIX autenticado pelo Banco Central (SPI).

### 5.2 Painel Administrativo Next.js (`apps/admin`)
1. Variáveis globais em `src/app/globals.css` configuradas com as cores oficiais e `font-family: 'Plus Jakarta Sans'`.
2. Favicon e metadados em `src/app/layout.tsx` vinculados a `/brand/icons/favicon.svg`.
3. Todos os logotipos vetoriais disponíveis em `public/brand/`.

### 5.3 Aplicativos Android (`apps/passenger` e `apps/driver`)
1. `apps/passenger/app.json`:
   - Nome: `"SIMBORA Passageiro"`
   - Package: `com.simbora.passenger`
   - Primary Color: `#123D32`
   - Ícone: `assets/simbora-app-icon.svg`
2. `apps/driver/app.json`:
   - Nome: `"SIMBORA Motorista"`
   - Package: `com.simbora.driver`
   - Primary Color: `#123D32`
   - Ícone: `assets/simbora-app-icon.svg`

---

## 6. Conclusão
A identidade visual do SIMBORA 3.5 está plenamente alinhada com as diretrizes do Brand Book oficial, garantindo coerência estética, elegância profissional e fidelidade aos valores regionais de Alagoas.
