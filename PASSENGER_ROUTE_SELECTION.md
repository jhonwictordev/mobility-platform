# SIMBORA 3.4 — EXPERIÊNCIA DO PASSAGEIRO E SELEÇÃO DE ROTAS (102 MUNICÍPIOS)
## Tela Inicial Limpa, Autocompletar Geográfico e Tarifação Dinâmica em Alagoas

---

### 1. Visão Geral e Princípios de UX

Na versão 3.4, o SIMBORA Passageiro elimina o comportamento anterior de carregar uma corrida predefinida (Piaçabuçu ⇄ Penedo) logo na abertura do aplicativo. 

A nova arquitetura oferece:
- **Tela Inicial Desimpedida (Clean Initial State)**: Foco imediato na intenção de deslocamento do usuário.
- **Cobertura Estadual Integral**: Suporte aos 102 municípios de Alagoas no sistema de busca.
- **Previsibilidade Tarifária Transparente**: Valores calculados com base na distância rodoviária real e tempo estimado antes de solicitar o motorista.
- **Opção de Demonstração Mantida**: Botão explícito para acionar o cenário de teste intermunicipal clássico com um único toque.

---

### 2. Tela Inicial Limpa (`#p-state-initial`)

Quando o passageiro abre o aplicativo e não possui corrida ativa no backend:
1. O mapa exibe a visualização local centralizada em Piaçabuçu sem traçado de rota.
2. Não há motorista atribuído previamente, nem ETA ou cronômetro fictício.
3. O card inferior apresenta:
   - **Gatilho de Busca Superior**: *"Para onde vamos?"* com indicação dos 102 municípios de Alagoas.
   - **Atalhos Rápidos de Viagem**:
     - 📍 **Atual**: Piaçabuçu (Praça São Francisco).
     - 🏠 **Casa**: Penedo (Centro Histórico).
     - 💼 **Trabalho**: Arapiraca (Centro Comercial).
   - **Botão de Modo Demonstração**: *"🚗 Modo Demonstração (Piaçabuçu ⇄ Penedo — 28,2 km)"* permitindo testes rápidos em homologação.
4. Ao clicar em *"Trocar Rota"* em qualquer momento durante a seleção de categorias, a função `resetToInitialSearch()` restaura a visualização inicial limpa.

---

### 3. Mecanismo de Busca dos 102 Municípios de Alagoas

O modal interativo `#p-modal-municipality-search` permite pesquisar tanto o local de embarque quanto o destino:

- **Base de Dados Geográfica**: Array `ALAGOAS_102_MUNICIPALITIES` contendo todos os 102 municípios de Alagoas com coordenadas oficiais (latitude/longitude) e microrregiões (ex: *Metropolitana de Maceió, Baixo São Francisco, Agreste Alagoano, Sertão Alagoano, Costa dos Corais, Litoral Sul*).
- **Filtro Sem Diferenciação de Acentos (Normalização Unicode)**:
  ```javascript
  function normalizeText(str) {
    return (str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
  ```
  Permite que o usuário digite `maceio`, `penedo`, `piacabucu`, `palmeira`, `sao miguel` ou o nome da região e encontre instantaneamente o município correto.
- **Seleção Dinâmica**: Ao escolher um município, o sistema atualiza os cartões de embarque/destino e dispara o cálculo rodoviário automático.

---

### 4. Algoritmo de Distância Rodoviária e Interpolação Curva

Como as rotas intermunicipais alagoanas seguem rodovias sinuosas (como AL-101 Sul, AL-110, AL-220 e BR-101), o sistema não utiliza linhas retas euclidianas.

1. **Distância Base (Fórmula de Haversine)**:
   $$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos\phi_1\cos\phi_2\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
2. **Fator de Sinuosidade Rodoviária de Alagoas (1,28)**:
   $$\text{Distância Rodoviária (km)} = \max\left(3.2, \text{round}\left(d \times 1.28 \times 10\right) / 10\right)$$
3. **Tempo Estimado de Viagem**:
   $$\text{Duração Estimada (min)} = \max\left(6, \text{round}\left(\text{Distância} \times 1.35\right)\right)$$
4. **Interpolação de Curvatura Geográfica**:
   O sistema gera 30 nós intermediários com fator senoidal perpendicular para simular a sinuosidade real do relevo e da malha viária, permitindo que o Turf.js anime o veículo de forma realista na pista.

---

### 5. Tabela Tarifária Dinâmica por Categoria

Com base na distância e no tempo calculados:

| Categoria | Tarifa Base | Por km | Por min | Exemplo (Piaçabuçu ➔ Penedo, 28,2 km) |
|---|---|---|---|---|
| **Simbora Pop** | R$ 10,00 | R$ 2,20 | R$ 0,40 | R$ 47,07 |
| **Simbora Conforto** | R$ 14,00 | R$ 2,70 | R$ 0,50 | R$ 68,01 |
| **Simbora Executivo** | R$ 22,00 | R$ 3,80 | R$ 0,70 | R$ 104,66 |

- Ao alternar entre as categorias, o botão inferior atualiza instantaneamente seu texto para refletir a categoria e o preço exato selecionado.
- Os dados de telemetria no topo do estúdio (Origem, Destino, Distância Total, Tempo Estimado) sincronizam em tempo real.

---

### 6. Garantia de Preservação do Cenário de Demonstração

O cenário clássico **Piaçabuçu ⇄ Penedo (28,2 km)** permanece disponível tanto no topo da interface através do botão de ação rápida (*"TESTAR PIAÇABUÇU ➔ PENEDO"*) quanto no chip de teste rápido da tela inicial do passageiro.
O acionamento deste modo configura automaticamente as rotas rodoviárias de 485 nós, as tarifas e os marcadores de forma imediata.
