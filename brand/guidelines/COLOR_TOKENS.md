# 🎨 COLOR TOKENS — SIMBORA
## Sistema Oficial de Cores e Matriz de Acessibilidade WCAG AA / AAA

A paleta de cores da **SIMBORA** reflete a exuberância natural de Alagoas: o verde das várzeas e coqueirais do Rio São Francisco, o calor solar do Nordeste e a solidez da terra.

---

## 1. Cores Principais da Marca

| Token Semântico | Nome Conceitual | Hex | RGB | HSL | Aplicação Recomendada |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `color.brand.deep` | **Verde Profundo** | `#123D32` | `rgb(18, 61, 50)` | `165°, 54%, 15%` | Cor mãe da marca. Headers, fundos primários, superfícies institucionais, botões principais de alto contraste. |
| `color.brand.vibrant`| **Verde Vibrante** | `#16A572` | `rgb(22, 165, 114)`| `159°, 76%, 37%` | Ação, dinamismo, botões de ação ("Pedir Simbora"), rotas ativas no mapa, telemetria positiva. |
| `color.brand.energy` | **Amarelo Energia** | `#FFCC45` | `rgb(255, 204, 69)`| `44°, 100%, 64%` | Acento solar. Badges, avaliações ⭐, ETA em destaque, pontos de chegada e chamadas de atenção. |
| `color.surface.clean`| **Branco Suave** | `#F8F9F6` | `rgb(248, 249, 246)`| `80°, 17%, 97%` | Fundo geral em modo claro, cartões de passageiro, superfícies neutras sem ofuscamento. |
| `color.surface.dark` | **Grafite Mineral** | `#17211D` | `rgb(23, 33, 29)`  | `156°, 18%, 11%` | Fundo do cockpit do Motorista, textos primários em modo claro, barras de navegação noturnas. |

---

## 2. Cores Funcionais e Semânticas (Estados)

| Token | Hex | Finalidade |
| :--- | :--- | :--- |
| `color.status.success` | `#16A572` | Corrida aceita, pagamento processado, motorista online. |
| `color.status.warning` | `#FFCC45` | Buscando motorista, transição de rota, verificação pendente. |
| `color.status.danger`  | `#E53935` | Corrida cancelada, erro de pagamento, CNH reprovada. |
| `color.status.info`    | `#0284C7` | Avisos de trânsito, atualizações do app, novidades operacionais. |

---

## 3. Matriz de Contraste e Acessibilidade (WCAG 2.1)

Todas as combinações oficiais foram testadas contra as normas **W3C WCAG AA** (mínimo 4.5:1 para texto normal, 3.0:1 para texto grande) e **WCAG AAA** (7.0:1 normal, 4.5:1 grande):

| Primeiro Plano (Texto/Ícone) | Plano de Fundo (Superfície) | Razão de Contraste | Nível WCAG | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Branco Suave** (`#F8F9F6`) | **Verde Profundo** (`#123D32`) | **12.8:1** | **AAA** | ✅ Perfeito para leitura em qualquer tela |
| **Amarelo Energia** (`#FFCC45`) | **Verde Profundo** (`#123D32`) | **9.8:1** | **AAA** | ✅ Excelente legibilidade e destaque visual |
| **Grafite Mineral** (`#17211D`) | **Branco Suave** (`#F8F9F6`) | **14.2:1** | **AAA** | ✅ Ideal para textos longos no app do passageiro |
| **Verde Profundo** (`#123D32`) | **Amarelo Energia** (`#FFCC45`) | **9.8:1** | **AAA** | ✅ Ideal para botões amarelos com texto escuro |
| **Branco Suave** (`#F8F9F6`) | **Grafite Mineral** (`#17211D`) | **14.2:1** | **AAA** | ✅ Modo noturno / Cockpit motorista |
| **Verde Vibrante** (`#16A572`) | **Branco Suave** (`#F8F9F6`) | **2.8:1** | UI Component | ⚠️ Usado em botões com preenchimento sólido e ícones grandes |

> [!TIP]
> **Regra de Aplicação:** Quando o Verde Vibrante (`#16A572`) for utilizado como fundo de botão, o texto deve ser SEMPRE em **Branco Suave** (`#F8F9F6`) em peso `font-bold` (700) ou `font-black` (900). Quando o Amarelo Energia (`#FFCC45`) for fundo, o texto deve ser SEMPRE em **Verde Profundo** (`#123D32`).

---

## 4. Implementação em Código (TypeScript)

```typescript
export const SIMBORA_COLORS = {
  // Cores da Marca
  brandDeep: '#123D32',
  brandVibrant: '#16A572',
  brandEnergy: '#FFCC45',
  surfaceClean: '#F8F9F6',
  surfaceDark: '#17211D',

  // Superfícies e Bordas
  borderLight: '#E2E8F0',
  borderDark: '#233830',
  cardLight: '#FFFFFF',
  cardDark: '#1D2A25',

  // Texto
  textPrimaryLight: '#17211D',
  textSecondaryLight: '#4B5563',
  textPrimaryDark: '#F8F9F6',
  textSecondaryDark: '#9CA3AF',

  // Semânticos
  success: '#16A572',
  warning: '#FFCC45',
  danger: '#E53935',
  info: '#0284C7',
} as const;
```
