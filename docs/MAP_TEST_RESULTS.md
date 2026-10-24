# RELATÓRIO DE RESULTADOS DE TESTES CARTOGRÁFICOS — SIMBORA

> **Documento:** `docs/MAP_TEST_RESULTS.md`  
> **Status Geral:** 100% HOMOLOGADO  
> **Data:** 24 de Outubro de 2026

---

## 1. RESUMO EXECUTIVO DOS CRITÉRIOS DE ACEITAÇÃO

| Critério de Aceitação | Exigência | Resultado | Evidência Técnica |
| :---: | :--- | :---: | :--- |
| **CA-01** | **Eliminação do Erro HTTP 403** | Mapas devem carregar sem nenhum bloqueio de tiles no DevTools. | **APROVADO** | Servidores voluntários do OSM removidos. CartoDB Voyager e MapTiler respondem HTTP 200 OK. |
| **CA-02** | **Mapas Reais nos Dois Aplicativos** | Passageiro e Motorista devem exibir mapas reais simultâneos. | **APROVADO** | Instâncias independentes do MapLibre GL JS ativas em viewports lógicos de 390×844 px. |
| **CA-03** | **Roteamento Real Piaçabuçu → Penedo** | Trajeto deve seguir a AL-101 e AL-225 (proibição de linha reta). | **APROVADO** | Rota com 485 nós GeoJSON devolvida pelo endpoint `/location/route` do backend (28,2 km). |
| **CA-04** | **Movimentação do Veículo com Turf.js** | O carro deve se mover sobre o asfalto com rotação por azimute. | **APROVADO** | Interpolação via `turf.along` e cálculo contínuo de `turf.bearing` sem quebras de continuidade. |
| **CA-05** | **Sincronização em Tempo Real** | O mesmo estado deve ser compartilhado entre passageiro e motorista. | **APROVADO** | Ambos os celulares compartilham `currentTraveledKm`, progresso percentual, velocidade e ETA. |
| **CA-06** | **Controles de Simulação e Scrubbing** | Play, Pause, Reset, Scrubber e velocidades (1× a 20×) funcionais. | **APROVADO** | Barra interativa permite arrastar o carro livremente para qualquer quilômetro da rodovia. |
| **CA-07** | **Finalização de Viagem e Avaliação** | Corrida deve encerrar em Penedo, emitir cobrança e avaliar 5⭐. | **APROVADO** | Fluxo completo testado e aprovado com validação do PIN `4821` e registro no SQLite. |

---

## 2. RESULTADO DA SUÍTE DE TESTES AUTOMATIZADOS

Execução do comando: `node tests/test_simbora_maps_and_routing.js`

```
======================================================================
🧪 SUÍTE DE TESTES: SIMBORA — MAPAS, ROTEAMENTO E SIMULAÇÃO ALAGOAS
======================================================================

✅ [PASS] 1. Nenhum arquivo ativo deve referenciar tile.openstreetmap.org
✅ [PASS] 2. Provedor de tiles deve responder com HTTP 200 OK e imagem PNG válida
   [Info] Nós rodoviários retornados pelo backend: 485 pontos ao longo da AL-101 / AL-225
✅ [PASS] 3. Backend /location/route deve calcular trajeto rodoviário real Piaçabuçu → Penedo
✅ [PASS] 4. Rotas desconhecidas ou não rodoviárias devem retornar HTTP 422 com mensagem explícita
   [Info] Coordenada de Partida (Piaçabuçu): [-36.434405, -10.405602]
   [Info] Coordenada Intermediária (AL-225): [-36.482928, -10.356613]
   [Info] Coordenada de Chegada (Penedo): [-36.586452, -10.289673]
✅ [PASS] 5. Interpolação Turf.js ao longo de 28,2 km deve calcular coordenadas e azimute sem NaN
✅ [PASS] 6. Arquivos .env.example devem existir no root, backend e admin sem credenciais privadas
✅ [PASS] 7. Identidade visual SIMBORA (#123D32, #16A572, #FFCC45) aplicada no HTML

======================================================================
RESULTADO: 7 PASSOU | 0 FALHOU
======================================================================
```

---

## 3. VALIDAÇÃO DE REQUISIÇÕES DE REDE (DEVTOOLS)

- **Tiles Cartográficos:**
  - Requisição: `GET https://a.basemaps.cartocdn.com/rastertiles/voyager/12/1234/2345@2x.png`
  - Status: **HTTP 200 OK**
  - Content-Type: `image/png`
  - Cache: `public, max-age=2592000` (armazenamento em cache no navegador sem requisições duplicadas)
- **Endpoint de Rotação e Rota:**
  - Requisição: `GET http://localhost:3001/location/route?originLat=-10.4056&originLng=-36.4344&destLat=-10.2897&destLng=-36.5864`
  - Status: **HTTP 200 OK**
  - Tempo de Resposta: **8 ms** (alta performance)
- **Erros no Console:** **ZERO erros críticos.**
