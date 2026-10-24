# 🧩 DESIGN SYSTEM — SIMBORA (SDS v1.0)
## Simbora Design System: Tokens, Componentes e Padrões Reutilizáveis

O **Simbora Design System (SDS)** é o arcabouço unificado de UI/UX que governa a consistência em todas as aplicações da plataforma: Passageiro (React Native/Expo), Motorista (React Native/Expo), SIMBORA Studio e SIMBORA Admin (Next.js/Tailwind).

---

## 1. Tokens Globais

### 1.1 Espaçamento (Spacing Scale)
Baseado em grade de 4px e 8px:

```css
--space-1:  4px;   /* micro-espaços, gaps de badges */
--space-2:  8px;   /* padding interno de tags e pílulas */
--space-3:  12px;  /* espaçamento entre inputs e ícones */
--space-4:  16px;  /* padding padrão de cartões mobile */
--space-5:  20px;  /* respiro entre blocos de conteúdo */
--space-6:  24px;  /* margens laterais de telas mobile */
--space-8:  32px;  /* separação de seções principais */
--space-10: 40px;  /* respiros hero */
--space-12: 48px;  /* altura mínima de botões acessíveis */
```

### 1.2 Border Radius
```css
--radius-sm:   6px;   /* badges numéricos, tags de status */
--radius-md:   12px;  /* inputs de texto, seletores de veículos */
--radius-lg:   18px;  /* cartões de corrida, modais */
--radius-xl:   24px;  /* bottom sheets, cartões hero */
--radius-full: 9999px;/* botões pílula, avatares, status online */
```

### 1.3 Elevação e Sombras (Elevation)
```css
--shadow-subtle: 0 1px 3px rgba(18, 61, 50, 0.08);
--shadow-card:   0 4px 12px rgba(18, 61, 50, 0.10);
--shadow-sheet:  0 -8px 24px rgba(18, 61, 50, 0.16);
--shadow-glow:   0 0 20px rgba(22, 165, 114, 0.35);
```

### 1.4 Curvas de Movimento e Animação
- `transition-fast`: `150ms cubic-bezier(0.4, 0, 0.2, 1)` (toques e feedback de botão).
- `transition-sheet`: `320ms cubic-bezier(0.2, 0.8, 0.2, 1)` (entrada e saída de bottom sheets).
- `transition-radar`: `1600ms ease-in-out infinite` (pulso de busca de motoristas no mapa).

---

## 2. Catálogo de Componentes de Interface

### 2.1 Botão Primário ("Pedir Simbora")
- **Fundo:** Verde Vibrante (`#16A572`) ou Amarelo Energia (`#FFCC45`).
- **Texto:** Branco Suave (`#F8F9F6`) em fundo verde; Verde Profundo (`#123D32`) em fundo amarelo.
- **Altura mínima:** `52px` (área de toque segura).
- **Border radius:** `16px` ou `9999px` (pílula).
- **Tipografia:** `Plus Jakarta Sans`, 16px, `Bold 700`, `letter-spacing: 0.5px`.
- **Estados:**
  - *Normal:* Sombra suave, 100% opacidade.
  - *Pressionado:* Escala `0.97`, opacidade `0.9`.
  - *Carregando:* Texto substituído por spinner circular suave.
  - *Desabilitado:* Fundo `#E2E8F0`, texto `#94A3B8`, cursor `not-allowed`.

### 2.2 Seletor de Categorias de Veículos
O seletor apresenta 3 opções claras e intuitivas:
1. **Simbora Econômico:** Ícone 🚗 • Carros compactos, melhor preço para o dia a dia.
2. **Simbora Conforto:** Ícone 🚙 • Sedans e SUVs novos, ar condicionado garantido e mais espaço.
3. **Simbora Intermunicipal:** Ícone ✨ • Viagens entre Penedo e Piaçabuçu com porta-malas espaçoso.

### 2.3 Bottom Sheet de Corrida em Andamento
- **Header:** Placa Mercosul com PIN de embarque em destaque dourado (`#FFCC45`).
- **Foto do Motorista:** Avatar circular com badge de verificação verde e nota ⭐.
- **Barra de Progresso da Rota:** Linha animada conectando origem ao destino com ETA dinâmico.
- **Botão de Segurança:** Botão discreto de emergência e compartilhamento de rota em tempo real.

### 2.4 Cockpit HUD do Motorista
- **Tema:** Dark mode de alto contraste com fundo `#17211D`.
- **Instruções de Navegação:** Tipografia em 28px no topo da tela com setas em Amarelo Energia (`#FFCC45`).
- **Alerta de Nova Corrida:** Card modal deslizante com contagem regressiva visual de 25s e botões gigantes de `ACEITAR (Verde)` e `RECUSAR (Grafite)`.

### 2.5 Badges de Status da Corrida
| Status | Rótulo | Fundo | Cor do Texto |
| :--- | :--- | :--- | :--- |
| `SEARCHING` | 🔍 Buscando Motorista | `#FEF3C7` (Amarelo claro) | `#92400E` |
| `ACCEPTED` | ✅ Corrida Aceita | `#DCFCE7` (Verde claro) | `#166534` |
| `DRIVER_ARRIVING`| 🚗 Motorista a Caminho | `#E0E7FF` (Lavanda suave)| `#3730A3` |
| `DRIVER_ARRIVED` | 📍 Aguardando Embarque | `#ECFDF5` | `#047857` |
| `IN_PROGRESS` | 🛣️ Viagem em Andamento | `#E0F2FE` (Azul céu) | `#0369A1` |
| `COMPLETED` | 🎉 Concluída | `#DCFCE7` | `#166534` |
| `CANCELLED` | ❌ Cancelada | `#FEE2E2` (Vermelho) | `#991B1B` |
