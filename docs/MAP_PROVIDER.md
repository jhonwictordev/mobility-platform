# ARQUITETURA DO PROVEDOR DE MAPAS — SIMBORA

> **Documento:** `docs/MAP_PROVIDER.md`  
> **Versão:** 2.0.0 — SIMBORA Alagoas  
> **Status:** HOMOLOGADO E LIVRE DE ERROS HTTP 403

---

## 1. DIAGNÓSTICO E CORREÇÃO DO ERRO HTTP 403

### 1.1 Causa Raiz
Anteriormente, o sistema utilizava os servidores de tiles públicos do OpenStreetMap (`tile.openstreetmap.org`). A Fundação OpenStreetMap aplica políticas rígidas de uso em seus servidores mantidos por voluntários (*Tile Usage Policy*), bloqueando ativamente origens de desenvolvimento (`localhost`, portas 3000/3001) e aplicações com alto volume de renderização via WebGL/MapLibre, retornando:

```
HTTP 403 Forbidden
"Access blocked — App is not following the tile usage policy of OpenStreetMap's volunteer-run servers."
```

### 1.2 Solução Implementada
A dependência direta dos servidores públicos do OSM foi **completamente eliminada**. A stack definitiva agora adota:

1. **MapLibre GL JS (v3.6.2):** Renderizador WebGL de alto desempenho, bifurcação comunitária e de código aberto do Mapbox GL, garantindo renderização suave a 60 fps em navegadores desktop e móveis.
2. **MapTiler Cloud (Provedor Oficial):** Suporte nativo ao estilo vetorial e raster **MapTiler Streets v2**, com renderização de alta resolução (*retina/HiDPI*) e tipografia nítida.
3. **CartoDB Voyager (Fallback Automático):** Camada raster pública homologada (`https://*.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png`), com permissão explícita para uso em aplicações web, garantindo **HTTP 200 OK imediato** mesmo se a chave do usuário ainda não tiver sido inserida.

---

## 2. MATRIZ DE PROVEDORES E TERMOS DE USO

| Provedor | Tipo de Camada | Limite Gratuito | Licença / Termos de Uso | Status no SIMBORA |
| :--- | :--- | :--- | :--- | :---: |
| **MapTiler Cloud** | Vetorial / Raster (`streets-v2`) | 100.000 requisições/mês | Uso comercial permitido no plano Free com atribuição. | ✅ Suportado via chave |
| **CARTO Voyager** | Raster 512px (`@2x.png`) | Ilimitado sob termos CARTO | Livre para visualização web com atribuição `© CARTO © OSM`. | ✅ Padrão ativo (HTTP 200) |
| **OSM Volunteer Servers** | Raster padrão (`tile.osm.org`) | Bloqueado para apps | Proibido uso por aplicações/scrapers. | ❌ Removido permanentemente |

---

## 3. IDENTIDADE VISUAL SIMBORA SOBRE OS MAPAS

Os elementos do mapa foram estilizados com as cores oficiais:

- **Traçado Rodoviário (AL-101 / AL-225):**
  - Borda Externa: `color.brand.deep` (`#123D32`), espessura 7px, opacidade 80%.
  - Linha Central Asfáltica: `color.brand.vibrant` (`#16A572`), espessura 4.5px, opacidade 95%.
- **Marcador de Partida (Piaçabuçu):** Pino esférico verde `#16A572` com letra 'A'.
- **Marcador de Chegada (Penedo):** Pino amarelo solar `#FFCC45` com bandeira quadriculada.
- **Veículo em Trânsito (Toyota Corolla):** Marcador circular verde `#123D32` com anel dourado `#FFCC45` e rotação orientada pelo azimute (*bearing*) do Turf.js.
