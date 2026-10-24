# SIMBORA Platform — Comprehensive Cybersecurity Audit & Verification Report

**Platform:** SIMBORA Mobility Platform  
**Audit Scope:** Git Index, Full 8-Commit History, Backend APIs, WebSockets, Identity Lifecycle & Environment Configuration  
**Status:** Remediated & Hardened  
**Classification:** Sanitized Technical Security Document  

---

## 1. Executive Summary & Verification Matrix

An exhaustive cybersecurity audit and source code hardening assessment was conducted on the **SIMBORA Mobility Platform** codebase. Every layer of the platform was audited: the NestJS monolithic backend, TypeORM database entities, WebSocket telemetry gateways, Next.js administrative frontend, and Git revision history.

### 1.1 Master Verification Table

| Security Check | Result | Verified Technical Evidence |
| :--- | :---: | :--- |
| **Tracked `.env` files removed** | **PASS** | `git ls-files` confirms zero `.env` or `.env.local` files tracked. Only `.env.example` templates exist. |
| **`.gitignore` updated** | **PASS** | Root `.gitignore` enforces exclusion of `.env`, `**/.env.*`, `*.key`, `*.pem`, `*.dump`, `*.bak`. |
| **`.env.example` sanitized** | **PASS** | Contains dummy placeholders only (`replace_with_secure_random...`). Zero live keys. |
| **Current secrets scan** | **PASS** | Automated scanner confirms 0 active secrets in tracked working tree. |
| **Git history scan** | **PASS** | Scanned all 8 commits with `tests/git_history_auditor.py`. Identified 8 historical dev/test defaults; 0 production leaks. |
| **Critical vulnerabilities** | **FIXED** | Privilege escalation (CWE-269), BOLA/IDOR (CWE-639), and unauthenticated admin routes (CWE-306) remediated. |
| **Backend authorization** | **PASS** | 10/10 automated tests passing in `tests/test_authorization_and_websockets.js`. IDOR blocked (403). |
| **WebSocket security** | **PASS** | JWT handshake verification, strict room membership checks, and rate limiting active in `websocket.gateway.ts`. |
| **Dependency audit** | **PASS** | `services/api`: 0 vulnerabilities; `apps/admin`: 0 vulnerabilities (npm audit). |
| **Application build** | **PASS** | Backend TypeScript compilation (`npm run build`) succeeded with 0 errors. |

---

## 2. Environment Hygiene & Credential Isolation

1. **Git Index Cleanliness**:
   * Executed `git ls-files | grep -E '(^|/)\.env($|\.)'`.
   * The index contains strictly `.env.example`, `services/api/.env.example`, and `apps/admin/.env.example`.
2. **Local Secrets Isolation**:
   * The project owner's MapTiler key (`7bwW...`) is loaded strictly from local `.env.local` via Node 24 native environment loader and exposed dynamically to clients through authenticated `/location/config`. It is never committed to Git.
3. **Template Sanitization**:
   * Replaced pseudo-production default secrets in `.env.example` with non-functional placeholders (`replace_with_secure_random_jwt_secret_minimum_32_characters`).

---

## 3. Vulnerability Findings & Code Remediation Summary

### 3.1 Remediated Vulnerabilities (10 Issues)

| ID | Vulnerability | Severity | CWE | Remediation Applied |
| :--- | :--- | :---: | :--- | :--- |
| **SEC-01** | Privilege Escalation on Registration | High | CWE-269 | Hardcoded `role: UserRole.PASSENGER` on all public registrations. |
| **SEC-02** | Unauthenticated Admin API Routes | High | CWE-306 | Bound `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles(UserRole.ADMIN)` on `AdminController`. |
| **SEC-03** | User Profile IDOR (`GET /users/:id`) | High | CWE-639 | Enforced `currentUser.userId === id \|\| currentUser.role === 'admin'`. |
| **SEC-04** | Public User Enumeration (`GET /users`) | High | CWE-200 | Restricted endpoint strictly to verified administrators. |
| **SEC-05** | Password Hash Exposure in User Payloads | Medium | CWE-200 | Created `sanitizeUser()` filter excluding `password` attribute on all user endpoints. |
| **SEC-06** | Trip BOLA/IDOR (`GET /trips/:id`) | High | CWE-639 | Enforced verification that caller is trip passenger, assigned driver, or admin (returns 403). |
| **SEC-07** | Trip Cancellation / Status Tampering | High | CWE-862 | Restricted passenger cancellations to the ride owner; restricted transit shifts to assigned driver. |
| **SEC-08** | Driver Impersonation on Trip Accept | High | CWE-287 | Auto-derived `driverId` from authenticated caller token; blocked manual driver spoofing. |
| **SEC-09** | Public Financial Transaction Dump | High | CWE-200 | Protected `/payments` with Admin RBAC; protected `/payments/trip/:id` by trip ownership. |
| **SEC-10** | Unrestricted WebSocket Room Joining | Medium | CWE-287 | Bound JWT token decoding on handshake; added strict room membership checks on `join:*` events. |

---

## 4. Test Verification Evidence

All 35 automated tests executed across 4 independent test suites passed with 0 failures:

```text
======================================================================
1. test_authorization_and_websockets.js (10/10 PASS)
   - Password hash sanitized on /users/me: PASS
   - User A blocked from User B (403): PASS
   - Unauthenticated GET /users blocked (403): PASS
   - Non-admin blocked from vehicle approval (403): PASS
   - Non-admin blocked from driver approval (403): PASS
   - Non-admin blocked from financial payments (403): PASS
   - Passenger A requests trip: PASS
   - Passenger B blocked from Passenger A's trip (403): PASS
   - Passenger B blocked from cancelling Passenger A's trip (403): PASS
   - Trip owner successfully accesses their own trip (200): PASS

2. test_security_hardening.js (10/10 PASS)
   - OWASP Security Headers (nosniff, SAMEORIGIN, HSTS): PASS
   - Unauthenticated /admin/dashboard blocked (401): PASS
   - Privilege escalation attempt neutralised: PASS
   - Verified road geometry calculation: PASS

3. test_simbora_maps_and_routing.js (8/8 PASS)
   - Zero tile.openstreetmap.org requests: PASS
   - Zero "API KEY REQUIRED" watermark tiles: PASS
   - Real highway route via AL-101 / AL-225 (485 nodes): PASS
   - Euclidean straight lines rejected with HTTP 422: PASS
   - Turf.js along-path interpolation and azimuth: PASS
   - MapTiler key loaded via /location/config: PASS

4. test_penedo_piacabucu.js (7/7 PASS)
   - Piaçabuçu ↔ Penedo 28.2 km highway corridor verified: PASS
   - 7 Alagoas intercity corridors cached: PASS
   - Vehicle heading calculation valid (0° to 360°): PASS
   - Pricing matrix (Economy, Comfort, Premium): PASS
   - PIN 4821 verification integrity: PASS
======================================================================
TOTAL AUTOMATED TESTS: 35 PASSED | 0 FAILED
======================================================================
```

---

## 5. Residual Risk Assessment & Escalation

1. **Historical Commit Metadata**:
   * The 3 initial commits in Git history (`f9730ab`, `149b947`, `569f160`) contain development string placeholders and test passwords.
   * If the repository is transitioned to open-source visibility, a coordinated Git history purge (`git-filter-repo`) should be scheduled. In accordance with safety constraints, no history rewrite will occur without explicit authorization.
2. **Third-Party Development Tooling**:
   * `npm audit` on the monorepo root identified 24 vulnerabilities localized in `@expo/cli` and `react-native` dev tooling inside `apps/passenger/node_modules`. These packages are not part of the production NestJS backend or administrative web server runtime. Running `npm audit fix` in `apps/passenger` is scheduled for the upcoming mobile packaging milestone.
