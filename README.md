# 🚗 Mobility Platform 2.0 — Plataforma de Transporte & Simulação Intermunicipal (Alagoas)

Plataforma completa de mobilidade urbana e intermunicipal estilo Uber, construída sob o paradigma de **engenharia limpa (Clean-Room Design)** com cartografia vetorial real do Estado de Alagoas (OpenStreetMap + MapLibre GL JS), roteamento rodoviário (OSRM) e simulação de física veicular com rotação por azimute (*bearing*).

---

## 🌟 Destaques da Versão 2.0

- 🛣️ **Cenário Prioritário Homologado:** Viagem rodoviária real de **Piaçabuçu (Centro) até Penedo (Centro Histórico)** pela AL-101 e AL-225 (28,2 km, 485 nós rodoviários).
- 🚫 **Proibição Estrita de Linhas Retas:** O veículo e a rota acompanham com exatidão a geometria do asfalto das rodovias alagoanas (+33,9% de extensão sobre a reta teórica).
- 🗺️ **Cartografia Real de Alagoas:** MapLibre GL JS + OpenStreetMap cobrindo 7 corredores rodoviários (Penedo, Piaçabuçu, Igreja Nova, Porto Real do Colégio, Coruripe, Arapiraca, Maceió).
- 📱 **Dual Mobile Simulators (390×844):** Simuladores com dinâmica de ilha/notch, status bar 5G, fluxo completo de estados para Passageiro (Marina Silva) e Motorista (Carlos Oliveira / Corolla BRA2E19).
- 🏎️ **Motor de Simulação Geográfica:** Controles de reprodução (Play, Pause, Reset), multiplicadores de velocidade (1×, 2×, 5×, 10×, 20×) e cálculo dinâmico de tangente de curva (*bearing*).
- 🔐 **Código PIN de Segurança:** Início de viagem validado estritamente por PIN numérico de 4 dígitos (`4 8 2 1`).
- 📊 **Painel Administrativo Next.js 16:** Dashboard em tempo real na porta 3000 com monitoramento da frota de Alagoas e auditoria de viagens.

---

## 🏗️ Estrutura do Projeto

```
mobility-platform/
├── apps/
│   ├── passenger/     # App Mobile do Passageiro (React Native + Expo)
│   ├── driver/        # App Mobile do Motorista (React Native + Expo)
│   └── admin/         # Painel Web de Operações (Next.js 16 + Tailwind CSS)
├── services/
│   └── api/           # Backend API (NestJS 11 + TypeScript + SQLite + WebSockets)
├── packages/
│   ├── alagoas_routes.json # Geometria GeoJSON OSRM das 7 rotas de Alagoas
│   └── shared/        # Tipos, Enums, Máquina de Estados e Utilitários compartilhados
├── docs/              # 11 Relatórios técnicos de engenharia reversa e cartografia
│   ├── AUDITORIA_UI.md
│   ├── ARQUITETURA.md
│   ├── MAPAS_ALAGOAS.md
│   ├── SIMULADOR_INTERMUNICIPAL.md
│   └── TESTES_PENEDO_PIACABUCU.md
├── tests/             # Suíte de testes unitários e validação Alagoas (7/7 Passou)
├── mobility_interactive_studio.html # Estúdio Interativo com MapLibre GL JS
└── mobility.sqlite    # Banco de dados operacional SQLite (8 tabelas)
```

---

## ⚡ Como Executar e Testar

### 1. Abrir o Mobility Studio 2.0
Basta abrir o arquivo [`mobility_interactive_studio.html`](file:///C:/Users/winc/.gemini/antigravity/scratch/mobility-platform/mobility_interactive_studio.html) no seu navegador ou através do artefato gerado no Antigravity.

### 2. Painel Administrativo Web
Disponível em `http://localhost:3000` (Dev server Next.js ativo).

### 3. Backend API REST & WebSockets
Disponível em `http://localhost:3001` (NestJS ativo):
- Métricas executivas: `http://localhost:3001/admin/dashboard`
- Estimativa tarifária: `http://localhost:3001/pricing/estimate?fromLat=-10.4056&fromLng=-36.4344&toLat=-10.2897&toLng=-36.5864`

### 4. Executar Testes Automatizados
```bash
node tests/test_penedo_piacabucu.js
```
Resultado: **7/7 Testes Aprovados**.
