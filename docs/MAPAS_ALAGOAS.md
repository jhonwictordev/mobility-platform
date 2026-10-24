# CARTOGRAFIA E SISTEMA GEOESPACIAL DE ALAGOAS — MOBILITY PLATFORM 2.0

> **Escopo:** Integração cartográfica, roteamento rodoviário real e georreferenciamento dos municípios de Alagoas.  
> **Status:** CARTOGRAFIA VALIDADA E HOMOLOGADA  
> **Motor Cartográfico:** MapLibre GL JS v3.6.2 + OpenStreetMap + OSRM Driving Engine

---

## 1. VISÃO CARTOGRÁFICA DO ESTADO DE ALAGOAS

A plataforma de transporte opera com geolocalização de alta fidelidade para o Estado de Alagoas, cobrindo prioritariamente o **Litoral Sul e o Baixo São Francisco**, interligando municípios históricos e polos agrícolas e turísticos.

### 1.1 Coordenadas Geográficas Homologadas

| Município | Região Geográfica | Latitude | Longitude | Marco de Referência |
| :--- | :--- | :---: | :---: | :--- |
| **Piaçabuçu** | Litoral Sul / Foz do São Francisco | `-10.4056` | `-36.4344` | Praça São Francisco / Centro Urbano |
| **Penedo** | Baixo São Francisco | `-10.2897` | `-36.5864` | Centro Histórico / Convento Franciscanos |
| **Igreja Nova** | Agreste / Baixo São Francisco | `-10.1256` | `-36.6622` | Centro Administrativo |
| **Porto Real do Colégio** | Divisa AL/SE / Rio São Francisco | `-10.1856` | `-36.8394` | Orla do Rio São Francisco |
| **Coruripe** | Litoral Sul | `-10.1256` | `-36.1756` | Centro / Praça Castro Azevedo |
| **Arapiraca** | Agreste Alagoano (Polo Central) | `-9.7517` | `-36.6606` | Bosque das Arapiracas |
| **Maceió** | Capital / Litoral Central | `-9.6658` | `-35.7350` | Orla de Pajuçara |

---

## 2. O CORREDOR PRIORITÁRIO: PIAÇABUÇU ↔ PENEDO

A viagem rodoviária de Piaçabuçu até Penedo constitui a espinha dorsal de validação da plataforma.

```
Piaçabuçu (Centro) 
      ↓ [Saída via AL-101 Sul]
Entroncamento AL-101 / AL-225 (Povoado Pontal do Peba)
      ↓ [Rodovia AL-225 - Engenheiro Joaquim Gonçalves]
Acesso a Penedo (Av. Wanderley)
      ↓
Penedo (Centro Histórico / Praça Barão de Penedo)
```

### 2.1 Comparação Rigorosa: Reta vs. Rodovia Real

> [!IMPORTANT]
> **A plataforma proíbe estritamente a representação de trajetos intermunicipais por linhas retas.**  
> O relevo, áreas de várzea e a calha do Rio São Francisco exigem que o deslocamento veicular acompanhe o asfalto das rodovias estaduais.

- **Distância Euclidiana / Linha Reta Teórica:** `21,06 km`
- **Distância Rodoviária Real (OSRM):** `28,20 km` (28.196,9 metros)
- **Fator de Sinuosidade Rodoviária:** `+33,9%`
- **Vértices de Curvatura (Waypoints GeoJSON):** `485 nós rodoviários`
- **Tempo Médio de Condução:** `28 minutos a 35 minutos`
- **Velocidade Média em Trânsito:** `60 a 80 km/h`

---

## 3. CORREDORES INTERMUNICIPAIS SECUNDÁRIOS MAPEADOS

A plataforma possui 7 corredores rodoviários integrados e precificados em Alagoas:

| Identificador | Rota Intermunicipal | Rodovias Utilizadas | Distância Real | Duração Típica | Nós GeoJSON |
| :--- | :--- | :--- | :---: | :---: | :---: |
| `piacabucu_penedo` | **Piaçabuçu → Penedo (Prioritária)** | AL-101 Sul + AL-225 | **28,20 km** | **~28 min** | **485** |
| `penedo_igreja_nova` | Penedo → Igreja Nova | AL-110 | 31,90 km | ~31 min | 381 |
| `penedo_colegio` | Penedo → Porto Real do Colégio | AL-225 + BR-101 | 58,26 km | ~53 min | 744 |
| `penedo_coruripe` | Penedo → Coruripe | AL-101 Sul | 58,52 km | ~56 min | 599 |
| `penedo_arapiraca` | Penedo → Arapiraca | AL-110 | 72,33 km | ~72 min | 816 |
| `penedo_maceio` | Penedo → Maceió | AL-101 Sul | 146,63 km | ~139 min | 1.838 |
| `piacabucu_coruripe`| Piaçabuçu → Coruripe | AL-101 Sul | 48,87 km | ~46 min | 755 |

---

## 4. INTEGRAÇÃO TÉCNICA COM MAPLIBRE GL JS

O **Mobility Studio 2.0** executa instâncias simultâneas do MapLibre GL JS em ambos os simuladores móveis:

```javascript
// Configuração do Estilo com OpenStreetMap Standard Raster Tiles
const osmStyle = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};
```

### 4.1 Renderização da Geometria da Rodovia
A polilinha rodoviária é injetada no MapLibre como uma camada GeoJSON composta por duas passagens de renderização:
1. **Linha de Casing (Borda Externa):** Espessura de 7px na cor Indigo 900 (`#312e81`) com opacidade de 70%, gerando relevo visual sobre o mapa.
2. **Linha Central (Traçado Asfáltico):** Espessura de 5px na cor Indigo 600 (`#4f46e5`) com pontas arredondadas (*line-cap: round*) e junções suavizadas (*line-join: round*).

---

## 5. RESILIÊNCIA E CACHING GEOESPACIAL

Para garantir alta disponibilidade independente de instabilidades na internet:
1. **Cache Local em Alta Velocidade:** Todas as 7 geometrias estão serializadas em `packages/alagoas_routes.json` e incorporadas diretamente ao código do estúdio.
2. **Fallback Automático:** Caso o endpoint online do OSRM apresente *rate limit*, o sistema consome instantaneamente o vetor local sem interromper a experiência do usuário.
3. **Precisão Submétrica:** As coordenadas dos pontos de embarque e desembarque utilizam 6 casas decimais, oferecendo precisão inferior a 1 metro.
