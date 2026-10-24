# Contributing to SIMBORA

Thank you for your interest in contributing to **SIMBORA**! We welcome technical contributions, documentation improvements, architectural proposals, and bug reports from the developer community.

---

## Code of Conduct

We are dedicated to providing a respectful, harassment-free environment for everyone. All contributors and maintainers are expected to uphold standards of professional communication, constructive technical critique, and mutual respect.

---

## Development Workflow

### 1. Fork and Branching
1. Fork the repository to your own GitHub account.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/mobility-platform.git
   cd mobility-platform
   ```
3. Create a feature or fix branch from `main`:
   ```bash
   git checkout -b feature/intercity-corridor-expansion
   # or
   git checkout -b fix/websocket-reconnect-backoff
   ```

### 2. Branch Naming Conventions
* `feature/<short-description>`: New functional capabilities or integrations.
* `fix/<short-description>`: Bug fixes and performance patches.
* `security/<short-description>`: Security remediations or hardening tasks.
* `docs/<short-description>`: Documentation, architecture updates, or guides.
* `refactor/<short-description>`: Structural code improvements without behavioral changes.

### 3. Commit Message Guidelines
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
* `feat(backend): implement PostGIS spatial queries for driver dispatch`
* `fix(admin): resolve pagination calculation on driver approvals table`
* `security(api): enforce strict JWT guard on trip history endpoint`
* `docs(readme): add detailed highway topology diagram for Alagoas`
* `test(routing): add automated regression checks for AL-101 node density`

---

## Coding Standards & Quality Verification

Before submitting a Pull Request, verify that all automated quality checks pass:

### 1. Secret Scanning
Ensure you have not added real API keys, credentials, or private secrets:
```bash
node tests/audit_scanner.js
```

### 2. TypeScript Compilation & Linting
Ensure all workspaces compile without errors:
```bash
cd services/api && npm run build
cd ../../apps/admin && npm run build
```

### 3. Automated Test Suites
Run all regression and security test suites:
```bash
node tests/test_simbora_maps_and_routing.js
node tests/test_penedo_piacabucu.js
node tests/test_security_hardening.js
```

---

## Pull Request Guidelines

1. **Keep Pull Requests Focused**: Target a single feature or bug fix per PR to facilitate code review.
2. **Include Tests**: Add unit or integration tests that prove your bug fix or demonstrate your new feature.
3. **Preserve Synthetic Data Integrity**: Never include real phone numbers, real CPF/CNH identifiers, or personal data in test fixtures. Use reserved demo patterns (`user@example.com`, `BRA2E19`).
4. **CI/CD Checks**: Ensure all checks in `.github/workflows/security.yml` pass.

---

## Questions and Support

For technical inquiries or architecture discussions, please open a GitHub Discussion or submit an issue describing your query.
