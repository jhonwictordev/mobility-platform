# RELATÓRIO DE RESTAURAÇÃO VISUAL E CARTOGRÁFICA — SIMBORA 4.0
## Reversão Seletiva do Redesign Indevido + Preservação Integral do Módulo de Caronas (BlaBlaCar Engine)

**Data da Entrega:** 01 de Novembro de 2026  
**Status do Projeto:** Restaurado com Sucesso (100% de Conformidade)  
**Ambiente:** Web Studio (`localhost:8080`) + Backend NestJS (`localhost:3001`) + 2 APKs Nativos Android v2/v3

---

## 1. RESUMO EXECUTIVO DA CORREÇÃO

Em atenção estrita à diretriz **"PRESERVE BY DEFAULT"**, todas as modificações visuais e cartográficas não autorizadas foram **completamente revertidas**. O mapa estático simplificado em SVG/Canvas foi removido e o sistema original de cartografia vetorial **MapLibre GL JS v3.6.2** foi restaurado em sua totalidade, preservando integralmente o banco de dados, os endpoints REST/WebSocket e a lógica de caronas compartilhadas (BlaBlaCar Functional Engine).

---

## 2. COMPARAÇÃO VISUAL: ANTES vs. DEPOIS DA RESTAURAÇÃO

| Elemento | Versão Alterada Indevidamente (Rejeitada) | Versão Restaurada e Aprovada (SIMBORA 4.0) |
|---|---|---|
| **Motor de Mapas** | SVG estático com linhas abstratas e fundo verde-escuro | **MapLibre GL JS v3.6.2 WebGL Real** com MapTiler Streets v2 e Esri World Street HD |
| **Geografia Real** | Sem ruas, bairros ou rio; representação fictícia | **Ruas, rodovias (AL-101 Sul, AL-225), Rio São Francisco, bairros de Piaçabuçu e Penedo** |
| **Interatividade** | Mapa travado sem zoom real nem camadas | **Zoom fluido, pan, rotação, centralização no GPS e ajuste de bounds** |
| **Layout Passageiro** | Redesign não autorizado dos cards | **Layout original aprovado**: Floating Card de embarque/destino, categorias (Comum, Conforto, Mulher) e PIN 4821 |
| **Acesso a Caronas** | Substituição radical da tela inicial | **Seletor discreto e elegante**: Segmented control `[ ⚡ Corrida Agora ]` e `[ 🚗 Caronas Intermunicipais ]` integrado ao Design System oficial |
| **Layout Motorista** | Painel desconfigurado sem o HUD original | **Layout original aprovado**: HUD de navegação em tempo real, switch ONLINE/OFF-LINE, radar e botão "Aceitar Corrida" |
| **Minhas Caronas (Driver)** | Fora do fluxo padrão | **Aba dedicada "Caronas"** na barra inferior e atalho no topo, funcionando mesmo com motorista OFF-LINE |
| **APKs Android** | Empacotavam SVGs simplificados | **Empacotam o motor real MapLibre GL JS** com hardware acceleration via WebView ART |

---

## 3. ARQUIVOS RESTAURADOS E MODIFICADOS

### 3.1. Interface Web e Studio
- `mobility_interactive_studio.html`: Restaurado a partir da versão aprovada em commit `036b7b3`, reintegrando cirurgicamente o seletor discreto de serviços no passageiro e a aba "Minhas Caronas" no motorista.
- `tests/serve_studio.js`: Servidor local em porta 8080 servindo o Studio restaurado (`/`), app do Passageiro (`/passageiro`) e app do Motorista (`/motorista`).

### 3.2. Aplicativos Android Nativos
- `android-build/passenger/assets/www/index.html`: Reconstruído com **MapLibre GL JS real**, rota Piaçabuçu ➔ Penedo, seletor discreto entre Corridas Imediatas e Caronas Intermunicipais.
- `android-build/driver/assets/www/index.html`: Reconstruído com **MapLibre GL JS real**, HUD de navegação, radar, botão Aceitar Corrida, PIN 4821 e aba Minhas Caronas.
- `build-apks.ps1`: Executado com sucesso gerando os APKs assinados com v2 e v3 scheme.

### 3.3. Backend e Dados (100% Preservados)
- `services/api/src/carpools/`: Módulo NestJS com 15 endpoints REST mantido intacto.
- `services/api/src/database/entities/carpool.entity.ts`: Entidades TypeORM/SQLite mantidas intactas.
- Viagens cadastradas mantidas: *Penedo ➔ Maceió* (R$ 45,00) e *Piaçabuçu ➔ Penedo* (R$ 25,00).

---

## 4. TESTES FUNCIONAIS REALIZADOS

1. **Cartografia Real:**
   - Mapa carrega tiles reais de Alagoas (ruas, rodovias e rios).
   - Traçado vetorial em verde `#16A572` com casing `#123D32` sobre a rodovia AL-101.
   - Marcadores de início (Piaçabuçu), fim (Penedo) e veículo em tempo real.
2. **Passageiro — Corrida Agora:**
   - Seleção de categorias (Comum / Conforto / Mulher) operacional.
   - Solicitação de corrida e exibição do PIN de segurança `4821`.
3. **Passageiro — Caronas Intermunicipais:**
   - Alternância suave sem recarregar o mapa.
   - Busca por municípios de Alagoas.
   - Listagem de viagens com paradas intermediárias (Igreja Nova, São Miguel dos Campos, Trevo do Peba).
   - Reserva de assento com decremento no backend.
4. **Motorista — Corridas Urbanas:**
   - Alternância ONLINE/OFF-LINE com pulso visual `#00FF9C`.
   - Simulação e recepção de chamado com botões "Recusar" e "Aceitar Corrida".
   - Validação do PIN `4821` para finalização e crédito PIX.
5. **Motorista — Minhas Caronas:**
   - Acesso irrestrito mesmo quando o motorista está OFF-LINE para corridas urbanas.
   - Consulta de viagens publicadas e passageiros confirmados.
6. **Compilação Android:**
   - Ambos os APKs gerados com código de saída 0 e verificados via `apksigner`.

---

## 5. LOCALIZAÇÃO DOS ENTREGÁVEIS

* **Studio Interativo Web:**  
  🌐 `http://localhost:8080/`
* **SIMBORA Passageiro (Tela Cheia):**  
  📱 `http://localhost:8080/passageiro`
* **SIMBORA Motorista (Tela Cheia):**  
  🚗 `http://localhost:8080/motorista`
* **APKs Prontos para Teste em Dispositivos Físicos:**  
  📂 `C:\Users\winc\Desktop\SIMBORA_APKs\`
  - `SIMBORA-PASSAGEIRO-TEST.apk`
  - `SIMBORA-MOTORISTA-TEST.apk`
  - `SIMBORA_ANDROID_TEST.zip`
