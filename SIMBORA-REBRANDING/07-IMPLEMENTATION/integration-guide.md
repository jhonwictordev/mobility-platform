# GUIA DE INTEGRAÇÃO TÉCNICA DA NOVA IDENTIDADE SIMBORA
## Orientações para Engenharia de Software, Frontend e Design System
**Data:** Outubro de 2026  
**Versão:** 2.0.0 (Homologada)  
**Status:** Fase 8 — Entrega e Integração Técnica  
**Direção:** Conceito B — The Kinetic Ribbon

---

## 1. VISÃO GERAL DE ENGENHARIA

A nova identidade visual da **SIMBORA** foi arquitetada como um sistema de design atômico e agnóstico de plataforma. Ela pode ser consumida diretamente por:
- Aplicações Web (Next.js, React, Tailwind CSS);
- Aplicativos Mobile Híbridos e Nativos (React Native, Flutter, Swift, Kotlin);
- Materiais Gráficos Vetoriais e Interfaces no Figma.

> [!IMPORTANT]
> **REGRAS DE SEGURANÇA TÉCNICA DO PROJETO:**
> Nenhuma mudança visual deve alterar a integridade dos serviços operacionais existentes:
> - O backend NestJS em execução na porta 3001 permanece intocado;
> - A base de dados SQLite (`mobility.sqlite`), autenticação e fluxos financeiros permanecem preservados;
> - O motor de geolocalização e cálculo de rotas OSRM (Penedo ↔ Piaçabuçu) opera normalmente.

---

## 2. MAPEAMENTO DE TOKENS DE DESIGN

### 2.1 Integração em Tailwind CSS (`tailwind.config.js`)
Para incorporar as cores e tipografia oficiais da SIMBORA ao Tailwind CSS do painel administrativo (`apps/admin`) ou landing page, adicione a extensão ao arquivo de configuração:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        simbora: {
          deep: '#123D32',       // Verde Profundo (Âncora institucional 60%)
          vibrant: '#16A572',    // Verde Vibrante (Ação e traçado de rotas 30%)
          energy: '#FFCC45',     // Amarelo Energia (Sotaque solar e foco 10%)
          softWhite: '#F8F9F6',  // Branco Suave (Superfícies e textos negativos)
          graphite: '#17211D',   // Grafite Mineral (Tipografia de leitura)
        }
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'simbora-card': '16px',
        'simbora-button': '12px',
        'simbora-badge': '8px',
      },
      boxShadow: {
        'simbora-card': '0 4px 16px rgba(18, 61, 50, 0.08)',
        'simbora-sheet': '0 -8px 24px rgba(18, 61, 50, 0.15)',
        'simbora-floating': '0 12px 28px rgba(0, 0, 0, 0.25)',
      }
    }
  }
}
```

### 2.2 Tema para React Native / Mobile
Para aplicativos móveis de motoristas e passageiros, exporte o tema em TypeScript:

```typescript
// theme.ts
export const SimboraTheme = {
  colors: {
    verdeProfundo: '#123D32',
    verdeVibrante: '#16A572',
    amareloEnergia: '#FFCC45',
    brancoSuave: '#F8F9F6',
    grafiteMineral: '#17211D',
    background: '#F8F9F6',
    surfaceDark: '#123D32',
    primaryButton: '#16A572',
    highlightBadge: '#FFCC45',
  },
  typography: {
    display: 'Manrope-ExtraBold',
    heading: 'Manrope-Bold',
    body: 'PlusJakartaSans-Regular',
    bodyBold: 'PlusJakartaSans-SemiBold',
    mono: 'JetBrainsMono-Bold',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  roundness: {
    card: 16,
    button: 14,
    input: 12,
  }
} as const;
```

---

## 3. ÍNDICE DE ATIVOS VETORIAIS ENTREGUES

Todos os arquivos estão organizados em formato vetorial SVG puro e acessíveis em `SIMBORA-REBRANDING/`:

| Finalidade | Caminho do Arquivo | Descrição |
| :--- | :--- | :--- |
| **Logo Horizontal (Claro)** | `03-LOGO/primary/simbora-logo-horizontal-color.svg` | Uso principal em cabeçalhos web, faturas e telas claras |
| **Logo Horizontal (Escuro)**| `03-LOGO/primary/simbora-logo-horizontal-dark.svg` | Uso em splash screens, footers escuros e modo noturno |
| **Assinatura Vertical** | `03-LOGO/primary/simbora-logo-vertical-color.svg` | Embalagens, crachás e sinalização vertical |
| **Símbolo Isolado** | `03-LOGO/secondary/simbora-symbol.svg` | Favicon de abas e botões de retorno ao início |
| **Logo Reduzido** | `03-LOGO/secondary/simbora-logo-reduced.svg` | Otimizado com traço espesso para tamanhos menores que 90px |
| **Ícone iOS (1024px)** | `05-APPLICATIONS/mobile/ios-app-icon.svg` | Ícone oficial App Store e retina display |
| **Ícone Android Adaptive** | `05-APPLICATIONS/mobile/android-adaptive-icon.svg` | Ícone adaptativo com camada segura de 260px |
| **Splash Screen Mobile** | `05-APPLICATIONS/mobile/splash-screen.svg` | Tela de inicialização mobile (1080x2400) |
| **Manual Completo (PDF)** | `06-BRAND-BOOK/SIMBORA-BRAND-BOOK-V2.pdf` | Manual oficial diagramado em 12 páginas (1.14 MB) |

---

## 4. CHECKLIST DE HOMOLOGAÇÃO DE INTERFACE

Ao atualizar ou desenvolver novas telas, certifique-se de cumprir o seguinte checklist de qualidade:

1. **Hierarquia 60-30-10:**
   - 60% da tela deve respirar com Branco Suave (#F8F9F6) ou Verde Profundo (#123D32) no Dark Mode;
   - Verde Vibrante (#16A572) deve ser exclusivo para ações positivas (botões principais, traçado de rota);
   - Amarelo Energia (#FFCC45) deve ser usado apenas em pontos solares de chegada, estrelas e badges.
2. **Contraste Acessível:**
   - Nunca coloque texto amarelo sobre fundo branco puro (taxa 1.3:1 é inacessível);
   - Use sempre Branco Suave (#F8F9F6) sobre Verde Profundo (#123D32) ou Verde Vibrante (#16A572).
3. **Slogan Oficial:**
   - A frase oficial deve ser sempre grafada com pontuação exata: **"Pediu. Chegou. Simbora!"**.

---
*Documento arquivado em `SIMBORA-REBRANDING/07-IMPLEMENTATION/integration-guide.md`.*
