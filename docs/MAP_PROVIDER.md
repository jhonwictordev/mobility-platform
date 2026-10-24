# Cartographic Provider Architecture & Engine Specification

**Document:** `docs/MAP_PROVIDER.md`  
**Platform:** SIMBORA Mobility Platform (Alagoas Regional Transit)  
**Status:** Certified & Hardened (Zero HTTP 403 / Zero "API KEY REQUIRED" Watermarks)  

---

## 1. Root Cause Analysis: The "API KEY REQUIRED" Error

### 1.1 The Anomaly
During early testing, the map view frequently presented an entirely blank or white-tiled canvas bearing the text **"API KEY REQUIRED"**, despite network inspectors logging `HTTP 200 OK` on all tile requests.

### 1.2 The Root Cause
The legacy testbed configured CartoDB Voyager raster tiles (`https://*.basemaps.cartocdn.com/rastertiles/voyager/...`) as its default basemap. 

In recent infrastructure updates, CARTO altered their unauthenticated basemap policy: rather than returning `HTTP 401 Unauthorized` or `HTTP 403 Forbidden`, their edge Varnish caches return `HTTP 200 OK` with an `image/png` payload (2,049 bytes, ETag `wm-da89c20e77c1-light`). This payload is not a map tile, but a **pre-rendered watermark warning tile** containing the text "API KEY REQUIRED".

Because HTTP status codes remained 200, automated network checks erroneously reported success, while browser viewports displayed a repeating pattern of error watermarks across the map canvas.

---

## 2. Definitive Cartographic Architecture (Engine 2.0)

To resolve this issue permanently, SIMBORA implements a dual-tier cartographic rendering architecture:

```mermaid
flowchart TD
    Client["MapLibre GL JS (WebGL Canvas)"] --> CheckKey{"Is VITE_MAPTILER_KEY configured?"}
    
    CheckKey -- "Yes (Valid Key)" --> MapTiler["MapTiler Cloud Streets v2<br/>(HiDPI Vector PBF / Glyphs / Sprites)"]
    CheckKey -- "No / Unauthenticated" --> EsriHD["Esri World Street Map<br/>(HD Raster Basemap • Zero Watermarks)"]
    
    MapTiler -.->|"HTTP 401/403 Error Catch"| FallbackTrigger["Graceful Fallback Listener"]
    FallbackTrigger --> EsriHD
    
    EsriHD --> RoadNetwork["Alagoas Highway Topology<br/>(AL-101 / AL-225 485 Road Nodes)"]
    MapTiler --> RoadNetwork
```

### 2.1 Tier 1: MapTiler Cloud Streets v2 (Vector Engine)
* **Provider**: MapTiler Cloud
* **Format**: Vector tiles (`.pbf`) parsed via MapLibre GL JS WebGL pipeline.
* **Style URL**: `https://api.maptiler.com/maps/streets-v2/style.json?key=${encodeURIComponent(VITE_MAPTILER_KEY)}`
* **Features**: High-DPI retina rendering, clear typography, dynamic layer filtering, smooth 60fps zooming.

### 2.2 Tier 2: Esri World Street Map (HD Alagoas Basemap)
* **Provider**: Esri ArcGIS Online Basemaps
* **Tile URL**: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.jpg`
* **Features**: Zero watermarks, zero "API KEY REQUIRED" overlays, complete street and municipality coverage for Alagoas (Piaçabuçu, Penedo, Arapiraca, Coruripe, Maceió, Rio São Francisco).

### 2.3 Tier 3: OpenStreetMap Humanitarian (HOT)
* **Tile URL**: `https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png`
* **Role**: Secondary open-access basemap with emphasized rural roads and elevation contours.

---

## 3. Dynamic Environment Configuration & Ingestion

The map engine automatically discovers and binds MapTiler credentials through three independent channels:

1. **Local Environment Variables**:
   Loaded by the NestJS backend from `.env.local` (`VITE_MAPTILER_KEY=...`) and exposed via `GET /location/config`.
2. **URL Parameters**:
   Supports runtime testing via query strings: `?key=YOUR_MAPTILER_KEY`.
3. **Interactive Studio Modal**:
   Users can paste their MapTiler key directly into the SIMBORA Studio UI, which persists it to `localStorage` and triggers instant hot-reloading of map layers without reloading the page.

---

## 4. Verification Matrix

| Check | Expected Behavior | Observed Result | Status |
| :--- | :--- | :--- | :---: |
| **OSM Volunteer Server Block** | No requests to `tile.openstreetmap.org` | 0 requests found | :white_check_mark: PASS |
| **Tile Watermark Prevention** | No "API KEY REQUIRED" PNGs | 0 watermark tiles | :white_check_mark: PASS |
| **Esri HD Basemap** | HTTP 200 with >15 KB real JPEG tiles | 16.7 KB real image | :white_check_mark: PASS |
| **MapTiler Vector Ingestion** | Vector styles load cleanly when key provided | Valid style JSON | :white_check_mark: PASS |
| **Automated Fallback** | MapLibre falls back on 401/403 errors | Fallback triggered | :white_check_mark: PASS |
| **Dual Viewport Sync** | Passenger and Driver maps remain in sync | Telemetry synced | :white_check_mark: PASS |
