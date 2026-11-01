# SIMBORA 3.5 — Relatório de Testes Automatizados End-to-End (E2E)
**QA Automation • Validação de Concorrência • Máquina de Estados • Integridade Visual**

---

## 1. Resumo Executivo da Execução de Testes

- **Data de Execução**: 29 de Outubro de 2026
- **Ambiente de Testes**: Localhost (Windows 11)
- **Serviços Ativos e Monitorados**:
  - SIMBORA Studio: `http://localhost:8080/` (Processo Daemon 3897)
  - NestJS API & WebSocket Gateway: `http://localhost:3001/` & `ws://localhost:3001` (Processo Daemon 4401)
  - Next.js Admin Panel: `http://localhost:3000/` (Processo Daemon 3901)
  - Banco de Dados: SQLite (`mobility.sqlite`)
- **Total de Testes Executados**: 47
- **Testes com Sucesso ([PASS])**: 47
- **Testes com Falha ([FAIL])**: 0
- **Taxa de Sucesso**: **100%**

---

## 2. Detalhamento dos Grupos de Teste

### Grupo 1: Ativos de Marca e Integridade de Arquivos (8/8 PASS)
Verificação da presença e legibilidade dos ativos vetoriais oficiais SVG e PNG nos diretórios do projeto:
- `[PASS]` `brand/VETORES-OFICIAIS-SVG/simbora-app-icon.svg`
- `[PASS]` `brand/VETORES-OFICIAIS-SVG/simbora-logo-horizontal-dark.svg`
- `[PASS]` `brand/VETORES-OFICIAIS-SVG/simbora-logo-horizontal-light.svg`
- `[PASS]` `brand/VETORES-OFICIAIS-SVG/simbora-symbol-isolated.svg`
- `[PASS]` `public/brand/VETORES-OFICIAIS-SVG/simbora-app-icon.svg`
- `[PASS]` `apps/admin/public/brand/simbora-app-icon.svg`
- `[PASS]` `apps/passenger/assets/simbora-app-icon.svg`
- `[PASS]` `apps/driver/assets/simbora-app-icon.svg`

### Grupo 2: Elementos de Interface do Estúdio & Tokens SIMBORA (9/9 PASS)
Validação do DOM de `mobility_interactive_studio.html`:
- `[PASS]` Família tipográfica `Plus Jakarta Sans` vinculada via Google Fonts
- `[PASS]` Biblioteca cliente Socket.IO presente e ativa
- `[PASS]` Modal de Comprovante Fiscal `#receipt-modal` implementado
- `[PASS]` Modal da Central de Segurança `#sos-modal` implementado
- `[PASS]` Modal de Saque Instantâneo PIX `#pix-payout-modal` implementado
- `[PASS]` Botão de Aceitação com identificador unívoco `id="btn-driver-accept-ride"`
- `[PASS]` Botão de Recusa com identificador unívoco `id="btn-driver-decline-ride"`
- `[PASS]` Logotipo oficial SVG renderizado no cabeçalho
- `[PASS]` Slogan oficial `"Pediu. Chegou. Simbora!"` renderizado no cabeçalho

### Grupo 3: Análise Estática de Handlers Onclick no Studio (17/17 PASS)
Validação de que todas as 61 funções chamadas nos atributos `onclick` do HTML estão declaradas e implementadas no `<script>`:
- `[PASS]` Todas as 61 funções chamadas em HTML possuem declaração válida
- `[PASS]` `driverAcceptRide`
- `[PASS]` `driverDeclineRide`
- `[PASS]` `driverArrivedAtPickup`
- `[PASS]` `driverConfirmPinAndStart`
- `[PASS]` `driverFinishTrip`
- `[PASS]` `passengerRequestRide`
- `[PASS]` `passengerCancelRequest`
- `[PASS]` `passengerFinishRating`
- `[PASS]` `openReceiptModal`
- `[PASS]` `closeReceiptModal`
- `[PASS]` `triggerSOSModal`
- `[PASS]` `closeSOSModal`
- `[PASS]` `requestPixPayout`
- `[PASS]` `closePixModal`
- `[PASS]` `sendPassengerMessage`
- `[PASS]` `sendQuickPassengerReply`

### Grupo 4: Ciclo de Vida da Viagem & Concorrência via REST API (10/10 PASS)
Teste dinâmico de integração na porta 3001 contra o banco SQLite:
- `[PASS]` Autenticação Mariana Silva via `POST /auth/login` (Status 200 OK, JWT ativo)
- `[PASS]` Autenticação Carlos Oliveira via `POST /auth/login` (Status 200 OK, JWT ativo)
- `[PASS]` Motorista configurado como ONLINE em Piaçabuçu via `PUT /drivers/me/status` (Status 200 OK)
- `[PASS]` Solicitação de viagem Piaçabuçu → Penedo via `POST /trips` (Status 201 Created, Status `SEARCHING`)
- `[PASS]` Aceitação atômica pelo motorista via `PUT /trips/:id/accept` (Status 200 OK, Status `ACCEPTED`)
- `[PASS]` **Proteção contra corrida concorrente**: Segunda tentativa de aceitação retorna `400 Bad Request` com a mensagem `"Corrida já atribuída a outro motorista parceiro"`
- `[PASS]` Chegada ao ponto de embarque via `PUT /trips/:id/status` (Status 200 OK, Status `DRIVER_ARRIVED`)
- `[PASS]` Validação do PIN 4821 e início da viagem via `PUT /trips/:id/status` (Status 200 OK, Status `IN_PROGRESS`)
- `[PASS]` Conclusão da viagem em Penedo via `PUT /trips/:id/status` (Status 200 OK, Status `COMPLETED`)
- `[PASS]` Avaliação da passageira de 5 estrelas via `POST /trips/:id/rate` (Status 201 Created)

### Grupo 5: Disponibilidade de Servidores Web (3/3 PASS)
- `[PASS]` SIMBORA Studio acessível em `http://localhost:8080/` (Status 200 OK)
- `[PASS]` Vetor SVG oficial servido em `http://localhost:8080/brand/VETORES-OFICIAIS-SVG/simbora-app-icon.svg` (Status 200 OK)
- `[PASS]` Painel Administrativo acessível em `http://localhost:3000/` (Status 200 OK / 307 Redirect)

---

## 3. URLs de Acesso Rápido

- **SIMBORA Studio Interativo (Passageiro + Motorista + Mapa Alagoas)**:
  `http://localhost:8080/`
- **Painel Administrativo SIMBORA**:
  `http://localhost:3000/`
- **API NestJS (Health & Rotas)**:
  `http://localhost:3001/location/route?originLat=-10.4056&originLng=-36.4344&destLat=-10.2897&destLng=-36.5864`
- **Brand Book Definitivo**:
  `http://localhost:8080/brand/SIMBORA_BRAND_BOOK_DEFINITIVO.html`

---

## 4. Conclusão da Validação de QA
Todos os critérios de aceitação foram cumpridos com rigor técnico, garantindo uma experiência operacional estável, fluida e com padrão comercial premium para a mobilidade em Alagoas.
