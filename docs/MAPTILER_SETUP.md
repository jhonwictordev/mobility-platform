# MapTiler Cloud Setup & Integration Guide

**Document:** `docs/MAPTILER_SETUP.md`  
**Platform:** SIMBORA Mobility Platform  

---

## 1. Overview

MapTiler Cloud provides vector tile services, font glyphs, and styling assets for MapLibre GL JS clients in SIMBORA. This document outlines how to obtain, configure, and secure MapTiler API credentials for local development and production environments.

---

## 2. Obtaining an API Key

1. Register for an account on [MapTiler Cloud](https://cloud.maptiler.com/).
2. Navigate to **Account** → **Keys**.
3. Create a new key with access to **Maps** (specifically `streets-v2`).
4. Note your public key (alphanumeric string).

---

## 3. Configuring the Environment

### 3.1 Local Environment File (`.env.local`)
Create or edit `.env.local` in the project root:

```env
# MapTiler Cloud Public API Key
VITE_MAPTILER_KEY=your_actual_maptiler_key_here
NEXT_PUBLIC_MAPTILER_KEY=your_actual_maptiler_key_here
MAPTILER_API_KEY=your_actual_maptiler_key_here
```

*Note: `.env.local` is included in `.gitignore` and must never be committed to source control.*

### 3.2 Dynamic Configuration Ingestion
The NestJS backend API reads `.env.local` on startup and serves the client configuration at:
```http
GET http://localhost:3001/location/config
```
Response format:
```json
{
  "maptilerKey": "...",
  "hasKey": true,
  "routingProfile": "driving-car",
  "activeCorridor": "Piaçabuçu -> Penedo",
  "state": "Alagoas"
}
```

SIMBORA Studio automatically checks this endpoint upon initialization and configures both mobile viewports.

---

## 4. Key Security & Domain Restrictions

Because browser-based map renderers transmit the API key in tile requests, apply the following security practices:

1. **Domain Whitelisting**:
   In the MapTiler Cloud console, configure **Allowed HTTP Origins**:
   * For local testing: `http://localhost:3000`, `http://localhost:3001`, `http://localhost:8080`, `http://127.0.0.1:*`
   * For production: `https://*.yourdomain.com`
2. **Never Use MapTiler Keys for Backend Routing**:
   MapTiler keys should only authenticate raster/vector tile and style downloads. Server-side highway routing uses OpenRouteService keys stored strictly within private backend environment variables.
3. **Key Rotation**:
   If a client key is accidentally committed or exposed publicly, rotate the key in the MapTiler dashboard immediately and update `.env.local`.
