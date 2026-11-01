# SIMBORA 3.4 — DASHBOARD E GRÁFICO ANIMADO DE GANHOS SEMANAIS
## Especificação Técnica, Design de Movimento e Integração de Dados

---

### 1. Visão Geral e Propósito

O módulo de **Ganhos Semanais** do SIMBORA Motorista foi projetado para oferecer transparência financeira total, engajamento e clareza operacional para os motoristas parceiros em Alagoas. 

O componente substitui visualizações estáticas por um gráfico dinâmico de 7 colunas (Segunda-feira a Domingo) com animação suave de crescimento, escala proporcional contínua, destaque luminoso no dia de maior produtividade e tooltip flutuante detalhado.

---

### 2. Arquitetura de Dados (Backend `GET /drivers/me/earnings/weekly`)

O endpoint no NestJS (`DriversController` e `DriversService`) calcula automaticamente a semana vigente no fuso horário oficial de Alagoas (`America/Maceio`, UTC-3):

```typescript
export interface DayEarning {
  dayCode: string;          // 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'
  dayName: string;          // 'Segunda-feira', 'Terça-feira', etc.
  date: string;             // '2026-10-20'
  isToday: boolean;
  tripsCount: number;       // Quantidade de corridas concluídas
  grossEarnings: number;    // Faturamento bruto total
  netEarnings: number;      // Repasse líquido (85% do bruto)
  averagePerTrip: number;   // Média por corrida
  isMax: boolean;           // True se for o maior faturamento líquido da semana
  isMin: boolean;           // True se for o menor dia com faturamento > 0
}
```

O endpoint consolida o resumo semanal:
- `weeklyTotalGross`: Faturamento bruto acumulado.
- `weeklyTotalNet`: Repasse líquido acumulado (85%).
- `platformFeeRate`: Taxa da plataforma (15%).
- `weeklyTrips`: Total de viagens realizadas na semana.
- `weeklyAveragePerTrip`: Ticket médio por corrida.

---

### 3. Escala Linear e Hierarquia Visual

Para garantir legibilidade mesmo em dias de alta disparidade de ganhos:

1. **Cálculo da Altura Relativa**:
   $$\text{Height Percentage} = \max\left(8\%, \text{round}\left(\frac{\text{day.netEarnings}}{\max(\text{weekMaxNet}, 100)} \times 100\right)\right)$$
2. **Dias Sem Faturamento (R$ 0,00)**:
   - Altura mínima de base: `5%` (aproximadamente 6px).
   - Estilização neutra: `bg-slate-700/40 border-t border-slate-600`.
   - Rótulo esmaecido: `text-slate-600`.
3. **Dia de Maior Faturamento (`isMax`)**:
   - Destaque neon: Gradiente `#16A572` para `#00FF9C`.
   - Borda iluminada: `border-2 border-[#00FF9C]`.
   - Resplendor luminoso: `box-shadow: 0 0 14px rgba(0, 255, 156, 0.6)`.
   - Rótulo em destaque: `text-[#00FF9C] font-black`.
4. **Dia de Menor Faturamento (`isMin`)**:
   - Tonalidade suavizada em âmbar: `bg-gradient-to-t from-[#123D32] to-[#FFCC45]/60 border-t border-[#FFCC45]`.
   - Rótulo: `text-[#FFCC45]`.

---

### 4. Motion Design e Animação CSS (`@keyframes earningsBarGrow`)

As barras não aparecem de forma instantânea ou abrupta. Elas utilizam uma curva cúbica natural de desaceleração (*ease-out*):

```css
@keyframes earningsBarGrow {
  0% {
    transform: scaleY(0);
    opacity: 0;
  }
  60% {
    opacity: 0.9;
  }
  100% {
    transform: scaleY(1);
    opacity: 1;
  }
}
```

- **Origem da Transformação**: `transform-origin: bottom;`
- **Duração**: `0.7s`
- **Função de Temporização**: `cubic-bezier(0.16, 1, 0.3, 1)` (resposta ágil e desaceleração suave).
- **Atraso em Cascata (Stagger)**: Cada barra possui `animation-delay: ${idx * 90}ms`, gerando uma onda visual progressiva da esquerda para a direita (Segunda a Domingo).

---

### 5. Tooltip Interativo Flutuante (`#d-chart-tooltip`)

Ao tocar ou passar o cursor sobre qualquer barra do gráfico:

1. O container do tooltip (`#d-chart-tooltip`) é posicionado dinamicamente.
2. Os dados específicos do dia selecionado são exibidos:
   - **Cabeçalho**: Nome do dia e data formatada (ex: `Sexta-feira (24/10)`).
   - **Faturamento Bruto**: Valor monetário (ex: `R$ 290,00`).
   - **Repasse Líquido (85%)**: Em verde neon com destaque tipográfico (ex: `R$ 246,50`).
   - **Viagens Realizadas**: Contagem de corridas (ex: `7 viagens`).
   - **Ticket Médio**: Média por corrida (ex: `R$ 35,21 / corrida`).
3. Ao afastar o cursor (`mouseleave`), o tooltip desaparece suavemente.

---

### 6. Validação e Testes Automatizados

O módulo foi coberto com sucesso por testes automatizados em `tests/test_simbora_3_4_features.js`:
- `GET /drivers/me/earnings/weekly` retornou HTTP 200.
- A lista de dias contém exatamente 7 itens ordenados cronologicamente de SEG a DOM.
- As propriedades `isMax` e `isMin` foram computadas e correspondidas com os valores reais da semana.
- A soma total do faturamento líquido foi validada contra o somatório das corridas.
