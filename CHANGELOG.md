# Changelog

All notable changes to the **SIMBORA Mobility Platform** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-10-24

### Security & Hardening
* **Privilege Escalation Neutralization (CWE-269)**: Fixed vulnerability in `AuthService.register()` where clients could pass arbitrary roles; registration now strictly enforces `UserRole.PASSENGER`.
* **Administrative RBAC Enforcement (CWE-306 / CWE-862)**: Added `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles(UserRole.ADMIN)` to `AdminController` endpoints (`getDashboard`, `approveDriver`, `rejectDriver`, `approveVehicle`).
* **Trip History Access Control (CWE-200 / CWE-639)**: Restricted unauthenticated access to `GET /trips` and `GET /trips/:id` with strict JWT and Admin role guards.
* **WebSocket Handshake Authentication**: Implemented JWT signature decoding on WebSocket handshake; restricted the `admin` telemetry room strictly to users with administrative roles.
* **OWASP Security Response Headers**: Added `SecurityHeadersMiddleware` injecting `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`, `Strict-Transport-Security`, and `Referrer-Policy`.
* **In-Memory Rate Limiting**: Added sliding-window rate limiter (25 req/min on `/auth`, 300 req/min general API).
* **Docker Secrets Sanitization**: Parameterized default credentials in `infrastructure/docker/docker-compose.yml`.
* **Automated CI/CD Pipeline**: Added GitHub Actions workflow (`.github/workflows/security.yml`) for automated secret scanning, type-checking, and security test execution.

---

## [2.0.0] - 2026-10-24

### Added
* **SIMBORA Studio 2.0**: Completely redesigned interactive simulation environment with dual side-by-side mobile device mockups (390×844 logical viewport).
* **MapLibre GL JS Cartography**: Replaced legacy prototype maps with MapLibre GL JS and MapTiler Cloud Streets v2 styling.
* **Piaçabuçu → Penedo Highway Corridor**: Implemented high-density highway network routing (485 road nodes along AL-101 and AL-225, 28.2 km).
* **Turf.js Spatial Dynamics**: Integrated Turf.js 6.5 for geodesic distance calculation, along-path coordinate interpolation, and dynamic vehicle heading (azimuth) orientation.
* **Backend Routing Proxy**: Added `GET /location/route` endpoint proxying OpenRouteService with built-in corridor caching, returning `HTTP 422 Unprocessable Entity` for invalid paths.
* **SIMBORA Brand Identity**: Applied official brand colors (`#123D32` Deep Green, `#16A572` Mint, `#FFCC45` Accent Yellow) across Studio, Admin, and client layouts.

### Fixed
* **OSM Tile Block (HTTP 403 Forbidden)**: Completely eliminated direct requests to volunteer-run OpenStreetMap tile servers, resolving usage policy blocks.

---

## [1.0.0] - 2026-10-24

### Added
* **NestJS API Foundation**: Initialized modular backend architecture with SQLite/TypeORM storage.
* **Trip State Machine**: Core state transitions (`REQUESTED`, `SEARCHING`, `ACCEPTED`, `DRIVER_ARRIVING`, `DRIVER_ARRIVED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
* **Dynamic Pricing Engine**: Category-based fare calculations (Economy, Comfort, Premium) with base fares, per-km, and per-minute rates.
* **Next.js 14 Admin Portal**: Dashboard with operational metrics, driver review queue, and vehicle approval management.
* **Synthetic Test Fixtures**: Initial database seed with demo passengers, drivers, and vehicles.
