# Project Progress & Engineering Milestones

**Document:** `docs/PROGRESS.md`  
**Platform:** SIMBORA Mobility Platform  
**Current Milestone:** Version 2.1.0 — Security Hardening, Cartographic Engine 2.0 & Alagoas Simulation  

---

## 1. Completed Milestones

### Milestone 1: Core Ride-Hailing Foundation (v1.0.0)
* [x] Monorepo structure with NestJS API and Next.js Admin portal.
* [x] SQLite + TypeORM embedded database for zero-dependency local development.
* [x] Deterministic Trip State Machine (`REQUESTED` → `COMPLETED`).
* [x] Dynamic category pricing engine (Economy, Comfort, Premium).
* [x] Synthetic demonstration fixtures (demo passengers, approved drivers, verified vehicles).

### Milestone 2: Cartographic Engine 2.0 & Alagoas Regional Simulation (v2.0.0)
* [x] Complete elimination of OpenStreetMap volunteer server blocks (HTTP 403 Forbidden).
* [x] Integration of MapLibre GL JS WebGL rendering pipeline.
* [x] High-density road network extraction for Alagoas (485 road nodes along AL-101 and AL-225).
* [x] Geodesic calculations and smooth heading (azimuth) orientation via Turf.js 6.5.
* [x] SIMBORA Studio 2.0 dual mobile viewport simulator (390×844).
* [x] OpenRouteService highway proxy with strict HTTP 422 error handling for invalid trajectories.

### Milestone 3: Security Hardening & Repository Rebranding (v2.1.0)
* [x] Resolved Privilege Escalation in user registration (CWE-269).
* [x] Enforced Role-Based Access Control on administrative and trip endpoints (CWE-306, CWE-639).
* [x] Handshake JWT verification on WebSocket gateway and room isolation (CWE-287).
* [x] OWASP security response headers (`nosniff`, `SAMEORIGIN`, `HSTS`) and IP rate limiting.
* [x] Sanitized Docker infrastructure environment templates.
* [x] Integrated automated GitHub Actions security pipeline (`.github/workflows/security.yml`).
* [x] Resolved CARTO "API KEY REQUIRED" watermark error by establishing MapTiler Cloud Streets v2 + Esri World Street HD zero-watermark architecture.
* [x] Dynamic local environment key ingestion via `GET /location/config` and `.env.local`.
* [x] Complete technical documentation rewrite in fluent English.

---

## 2. In Progress & Upcoming Milestones

### Milestone 4: Production Scalability & Native Mobile
* [ ] PostgreSQL + PostGIS spatial indexing migration.
* [ ] Redis adapter integration for Socket.IO horizontal clustering.
* [ ] Native Brazilian Instant Payment (Pix) dynamic QR code generation.
* [ ] Standalone mobile bundle compilation for iOS and Android via Expo EAS.
