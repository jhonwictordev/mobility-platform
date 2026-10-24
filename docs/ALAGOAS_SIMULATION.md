# SIMULAÇÃO GEOGRÁFICA INTERMUNICIPAL — ALAGOAS (SIMBORA)

> **Documento:** `docs/ALAGOAS_SIMULATION.md`  
> **Cenário Oficial:** SIMBORA — TESTE INTERMUNICIPAL 01  
> **Motor de Análise Espacial:** Turf.js v6.5.0 + MapLibre GL JS

---

## 1. DADOS DO CENÁRIO PRIORITÁRIO

| Parâmetro | Definição Oficial |
| :--- | :--- |
| **Origem** | Praça São Francisco, Centro de Piaçabuçu — AL (`-10.4056, -36.4344`) |
| **Destino** | Centro Histórico de Penedo — AL (`-10.2897, -36.5864`) |
| **Passageiro** | Marina Silva (Nota: 4.95 ⭐) |
| **Motorista** | Carlos Oliveira (Nota: 4.90 ⭐) |
| **Veículo** | Toyota Corolla Hybrid 2023, Prata, Placa `BRA2E19` |
| **Rodovias** | AL-101 Sul + AL-225 (Rod. Eng. Joaquim Gonçalves) |
| **Extensão Rodoviária Real** | **28,20 km** |
| **Nós Geográficos da Rota** | **485 pontos GeoJSON** |
| **Tempo de Condução Real** | **~28 minutos** |
| **Código PIN de Segurança** | **`4 8 2 1`** |

---

## 2. ARQUITETURA DE SIMULAÇÃO BASEADA EM TURF.JS

Ao contrário de aproximações ingênuas baseadas em interpolação linear entre vértices ou linhas retas, a plataforma SIMBORA utiliza a biblioteca geoespacial **Turf.js** para calcular distâncias geodésicas e posicionamento sobre a curva acumulada da linha:

```javascript
// 1. Criação do objeto LineString Turf a partir dos 485 nós
const turfLineString = turf.lineString(routeCoordinates);
const totalDistanceKm = turf.length(turfLineString, { units: 'kilometers' });

// 2. Interpolação física exata sobre a rodovia baseada na distância percorrida
const currentPoint = turf.along(turfLineString, currentTraveledKm, { units: 'kilometers' });

// 3. Ponto de mira (lookahead) 50 metros à frente para cálculo da tangente de curva
const lookaheadPoint = turf.along(turfLineString, currentTraveledKm + 0.05, { units: 'kilometers' });

// 4. Cálculo do Azimute (Bearing) de rotação da carroceria do veículo
let bearing = turf.bearing(currentPoint, lookaheadPoint);
bearing = (bearing + 360) % 360;

// 5. Aplicação direta no marcador CSS do veículo
carMarkerElement.style.transform = 'rotate(' + bearing + 'deg)';
```

---

## 3. CONTROLES DA SIMULAÇÃO NO SIMBORA STUDIO

O estúdio oferece controle total sobre o ciclo de execução:

1. **Botão Prioritário "TESTAR PIAÇABUÇU → PENEDO":**  
   Prepara o cenário, carrega os pontos, consulta a rota no backend, posiciona os simuladores móveis e aguarda o comando de início sem disparar a corrida automaticamente.
2. **Iniciar / Pausar / Continuar:** Inicia ou suspende o deslocamento do veículo instantaneamente.
3. **Reiniciar:** Restaura o veículo para a Praça São Francisco (km 0.0) e limpa o progresso.
4. **Avançar / Retroceder (+/- 10%):** Pula instantaneamente 10% da rota rodoviária (~2,82 km) mantendo a sincronia visual.
5. **Barra de Progresso Interativa (Scrubber):**  
   Um controle deslizante de 0% a 100% permite arrastar o carro para qualquer quilômetro da AL-101 ou AL-225 em tempo real, atualizando instantaneamente os dois aplicativos e a telemetria.
6. **Aceleração Temporal (1×, 2×, 5×, 10×, 20×):**  
   Altera a frequência do relógio da simulação sem falsificar a velocidade física instantânea do carro (que permanece entre 60 e 85 km/h).
