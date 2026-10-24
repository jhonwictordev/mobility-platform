# Comprehensive Security Audit & Hardening Report

**Platform**: SIMBORA Mobility Platform  
**Audit Date**: October 2026  
**Status**: Remediated & Hardened  
**Classification**: Sanitized Public Technical Document  

---

## 1. Executive Summary

A comprehensive application security audit and code hardening assessment was conducted on the **SIMBORA Mobility Platform** repository. The scope encompassed the backend API services (NestJS), administrative frontend (Next.js), interactive simulation testbed (SIMBORA Studio), Docker infrastructure files, and Git commit metadata history.

The primary objective was to detect and eliminate any exposed credentials, personal identifiable information (PII), unauthenticated administrative interfaces, and authorization bypasses, ensuring the repository meets industry standards for secure software development and public technical evaluation.

### Key Audit Metrics
* **Total Commits Inspected**: 3 (Complete Git history from inception)
* **Secret Leaks in Source Code**: 0 (Zero live secrets or third-party private keys detected)
* **High/Critical Vulnerabilities Identified & Remediated**: 4
* **Medium/Low Vulnerabilities Remediated**: 3
* **Third-Party Dependency Vulnerabilities**: 0 high/critical issues in active backend or frontend manifests.
* **Automated Security Pipeline**: Integrated via GitHub Actions (`.github/workflows/security.yml`).

---

## 2. Audit Scope & Methodology

The security assessment utilized a multi-layered hybrid methodology comprising automated static analysis and manual deep-code review:

1. **Secret Scanning**:
   * Evaluated Git commit history and working tree using automated entropy pattern matching and regex heuristics for AWS tokens, private keys, JWT secrets, and API credentials.
2. **Static Application Security Testing (SAST)**:
   * Analyzed NestJS controllers, services, guards, and middleware for authorization flaws, injection patterns, and unvalidated inputs.
3. **Dependency Vulnerability Analysis**:
   * Executed package vulnerability scans (`npm audit`) against `services/api` and `apps/admin`.
4. **Data Privacy & PII Verification**:
   * Inspected database seeds, test fixtures, and logs to ensure strict adherence to synthetic data requirements.
5. **Runtime Transport & WebSocket Security**:
   * Inspected handshake protocol negotiation, CORS policies, and room authorization checks in Socket.IO gateways.

---

## 3. Vulnerability Findings Matrix

| Finding ID | Title | CWE Classification | Initial Severity | Remediation Status |
| :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Privilege Escalation via User Registration | [CWE-269](https://cwe.mitre.org/data/definitions/269.html) | High | **RESOLVED** |
| **SEC-02** | Unauthenticated Administrative Endpoints | [CWE-306](https://cwe.mitre.org/data/definitions/306.html) / [CWE-862](https://cwe.mitre.org/data/definitions/862.html) | High | **RESOLVED** |
| **SEC-03** | Public Trip Data Exposure | [CWE-200](https://cwe.mitre.org/data/definitions/200.html) / [CWE-639](https://cwe.mitre.org/data/definitions/639.html) | Medium | **RESOLVED** |
| **SEC-04** | Unrestricted Admin WebSocket Room Access | [CWE-287](https://cwe.mitre.org/data/definitions/287.html) | Medium | **RESOLVED** |
| **SEC-05** | Missing Security Response Headers | [CWE-693](https://cwe.mitre.org/data/definitions/693.html) | Low | **RESOLVED** |
| **SEC-06** | Lack of In-Memory Rate Limiting | [CWE-770](https://cwe.mitre.org/data/definitions/770.html) | Low | **RESOLVED** |
| **SEC-07** | Hardcoded Defaults in Docker Configuration | [CWE-798](https://cwe.mitre.org/data/definitions/798.html) | Low | **RESOLVED** |

---

## 4. Detailed Vulnerability Analyses & Remediations

### SEC-01: Privilege Escalation via User Registration (CWE-269)
* **Vulnerability Description**: The authentication service previously accepted a user-supplied `role` parameter during registration:
  ```typescript
  // Vulnerable pattern
  role: data.role || UserRole.PASSENGER
  ```
  An unauthenticated attacker could supply `{ role: 'admin' }` in the POST payload and immediately acquire full platform administrative privileges.
* **Remediation**:
  The `AuthService.register()` method was updated to strictly enforce `UserRole.PASSENGER`. Any administrative accounts must be provisioned through dedicated database seeding or internal maintenance scripts:
  ```typescript
  // Remediated pattern
  const user = this.userRepository.create({
    ...data,
    password: hashedPassword,
    role: UserRole.PASSENGER, // Strictly enforced; prevents self-assignment
  });
  ```
* **Verification**: Verified via automated integration test `tests/test_security_hardening.js`. Registration requests with `{ role: 'admin' }` persist strictly as `role: 'passenger'`.

---

### SEC-02: Unauthenticated Administrative Endpoints (CWE-306 / CWE-862)
* **Vulnerability Description**: In `AdminController`, endpoints for reviewing metrics and approving/rejecting drivers and vehicles were missing controller or method-level guards.
* **Remediation**: Applied `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles(UserRole.ADMIN)` across all administrative routes:
  * `GET /admin/dashboard`
  * `PUT /admin/drivers/:id/approve`
  * `PUT /admin/drivers/:id/reject`
  * `PUT /admin/vehicles/:id/approve`
* **Verification**: Requests without valid bearer JWT tokens or with passenger tokens receive `HTTP 401 Unauthorized` or `HTTP 403 Forbidden`.

---

### SEC-03: Public Trip Data Exposure (CWE-200 / CWE-639)
* **Vulnerability Description**: The `TripsController` endpoints (`GET /trips` and `GET /trips/:id`) permitted unauthenticated callers to enumerate trip histories, pickup coordinates, fares, and user references.
* **Remediation**: Guarded `GET /trips` with `Roles(UserRole.ADMIN)` and `GET /trips/:id` with `JwtAuthGuard`.

---

### SEC-04: Unrestricted Admin WebSocket Room Access (CWE-287)
* **Vulnerability Description**: The WebSocket Gateway allowed clients to join the `admin` room simply by emitting `{ event: 'join:admin' }`, receiving real-time passenger ride requests and driver telemetry broadcasts without token validation.
* **Remediation**: Injected `JwtService` into `MobilityWebSocketGateway`. Clients connecting to the WebSocket must pass their JWT via the handshake query or authorization header. Subscribing to the `admin` room validates the user's role and disconnects unauthorized sockets.

---

### SEC-05 & SEC-06: Security Response Headers & Rate Limiting (CWE-693, CWE-770)
* **Remediation**: Implemented `SecurityHeadersMiddleware` applying OWASP recommended HTTP response headers:
  * `X-Content-Type-Options: nosniff`
  * `X-Frame-Options: SAMEORIGIN`
  * `X-XSS-Protection: 1; mode=block`
  * `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  * `Referrer-Policy: strict-origin-when-cross-origin`
  * `Permissions-Policy: geolocation=(self), camera=(), microphone=()`
* An in-memory sliding-window rate limiter was added, restricting authentication attempts to 25 requests per minute per IP and general API calls to 300 requests per minute per IP.

---

### SEC-07: Hardcoded Defaults in Docker Configuration (CWE-798)
* **Remediation**: Replaced static credentials in `infrastructure/docker/docker-compose.yml` with parameterized environment variables (`${POSTGRES_PASSWORD:-simbora_dev_placeholder}` and `${JWT_SECRET:-simbora_dev_jwt_placeholder}`).

---

## 5. Secret & PII Scanning Summary

### Credential Scan
* **Git History**: Clean. Zero historical private keys, AWS tokens, or production API secrets.
* **Current Workspace**: Clean. All secret tokens reside exclusively in local `.env` files explicitly ignored by `.gitignore`.
* **Routing Keys**: OpenRouteService tokens are stored solely in backend environment variables and accessed via backend proxy endpoints; no private routing keys are embedded in frontend client bundles.

### Synthetic Data Verification
* All database seed users in `services/api/src/database/seed.ts` use fictional names ("Demo Passenger 01", "Demo Driver 01"), `@example.com` domains, fictional telephone numbers (`+55 11 99999-0001`), and standardized dummy license plates (`BRA2E19`).
* Zero real-world customer or driver telemetry exists in the codebase.

---

## 6. Automated CI/CD Pipeline

A GitHub Actions workflow is established at `.github/workflows/security.yml` to automate continuous security verification on all incoming pull requests and commits to `main`:
1. **Secret Pattern Scanning**: Re-scans the repository for accidental credential commits.
2. **TypeScript Compilation & Unit Tests**: Enforces strict type compliance and runs security test suites.
3. **Dependency Auditing**: Halts builds on high/critical dependency vulnerabilities.

---

## 7. Residual Risks & Operational Recommendations

For production deployment beyond the demonstration environment, the following infrastructure measures should be instituted:

1. **Edge TLS Termination**: Terminate TLS at the reverse proxy (e.g., NGINX, Cloudflare, or AWS ALB) using modern cipher suites and automated certificate renewal.
2. **Distributed Rate Limiting**: Transition the current in-memory rate limiter to a shared Redis instance when scaling to multi-node backend clusters.
3. **Database Migration to PostGIS**: Transition from embedded SQLite to managed PostgreSQL with PostGIS for native spatial indexing and high-concurrency throughput.
