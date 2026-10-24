# Local Development & Engineering Guide

This guide describes how to configure, run, debug, and test the **SIMBORA Mobility Platform** in a local development environment.

---

## 1. Monorepo Organization

```
mobility-platform/
├── apps/
│   ├── admin/             # Next.js 14 Administrative Dashboard (Port 3000)
│   ├── studio/            # SIMBORA Studio 2.0 (Dual Mobile Simulator Canvas)
│   └── mobile/            # React Native Client Foundations
├── services/
│   └── api/               # NestJS 12 REST API & WebSocket Gateway (Port 3001)
├── packages/              # Shared data packages and road topology caches
├── infrastructure/        # Docker and deployment configurations
├── tests/                 # Automated testing and verification suites
├── brand/                 # Brand identity assets, logos, and style guidelines
├── .github/               # CI/CD workflows and automated security scanning
├── .env.example           # Root sanitized environment template
└── package.json           # Monorepo workspaces manifest
```

---

## 2. Prerequisites

Ensure your development machine has the following tools installed:
* **Node.js**: `v18.0.0` or higher (`v24.20.0` recommended)
* **npm**: `v9.0.0` or higher
* **Git**: `2.30+`

Verify your local installation:
```bash
node -v
npm -v
git --version
```

---

## 3. Quick Start Setup

### Step 1: Install Dependencies
From the repository root, install workspace dependencies:
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy the sanitized environment templates:
```bash
# Root environment
cp .env.example .env

# Backend API environment
cp services/api/.env.example services/api/.env

# Admin Dashboard environment
cp apps/admin/.env.example apps/admin/.env.local
```

### Step 3: Compile and Seed Backend
```bash
cd services/api
npm run build
npm run seed
```
*The database seed provisions synthetic demo accounts (passengers, approved drivers, verified vehicles, and sample completed trips).*

---

## 4. Running the Platform Services

### Running the Backend API (Port 3001)
```bash
cd services/api
npm run start
# For auto-reloading during development:
npm run start:dev
```
* Output:
  ```
  🚗 Mobility Platform API running on http://localhost:3001
  ⚡ WebSocket Server listening on ws://localhost:3001
  ```

### Running the Admin Dashboard (Port 3000)
In a separate terminal window:
```bash
cd apps/admin
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Running SIMBORA Studio 2.0
Open `apps/studio/index.html` directly in any web browser, or launch an HTTP file server:
```bash
npx serve apps/studio -p 8080
```
Then navigate to [http://localhost:8080](http://localhost:8080).

---

## 5. Automated Testing Suites

SIMBORA maintains focused automated test suites located in `tests/`:

### 1. Security & Hardening Suite
Verifies OWASP security response headers, authentication guards on administrative endpoints, privilege escalation protection on registration, and rate limiting:
```bash
node tests/test_security_hardening.js
```

### 2. Geographic Simulation & Alagoas Routing
Verifies the Piaçabuçu → Penedo corridor, AL-101/AL-225 road node density, non-straight line geometry, and Turf.js bearing calculation:
```bash
node tests/test_penedo_piacabucu.js
```

### 3. Cartography & Tile Compliance Suite
Verifies that no OpenStreetMap volunteer tile servers are directly queried and confirms MapTiler/CartoDB compliance:
```bash
node tests/test_simbora_maps_and_routing.js
```

### 4. Secret & PII Audit Scanner
Verifies zero hardcoded private credentials or real personal data exist across the codebase:
```bash
node tests/audit_scanner.js
```

---

## 6. Troubleshooting & Common Issues

### Issue 1: `better-sqlite3` Native Binding Resolution
* **Symptom**: `Error: Could not locate the bindings file. Tried: ... better_sqlite3.node`
* **Resolution**: Rebuild native modules against your current Node.js runtime:
  ```bash
  npm rebuild better-sqlite3
  ```

### Issue 2: Map HTTP 403 Forbidden Error
* **Symptom**: `Access blocked — App is not following the tile usage policy...`
* **Resolution**: Ensure you are not requesting tiles directly from `tile.openstreetmap.org`. Use the pre-configured CartoDB Voyager baseline or provide a valid `VITE_MAPTILER_KEY` in your environment.

### Issue 3: Port 3001 or 3000 Already in Use
* **Resolution**: Terminate orphaned Node processes:
  * On Windows: `Stop-Process -Name node -Force`
  * On Linux/macOS: `pkill -f node`
