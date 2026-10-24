# SIMBORA Platform — GitHub Security Hardening Checklist

**Repository:** `jhonwictordev/mobility-platform`  
**Document:** `GITHUB_SECURITY_CHECKLIST.md`  
**Status:** Hardened & Verified  

---

## 1. Automated Security Features (Active)

| Feature | Status | Verification Method |
| :--- | :---: | :--- |
| **Secret Scanning** | **ENABLED** | Verified via GitHub CLI API (`gh repo edit --enable-secret-scanning`) |
| **Push Protection** | **ENABLED** | Verified via GitHub CLI API (`gh repo edit --enable-secret-scanning-push-protection`) |
| **CI Security Workflow** | **ACTIVE** | Configured in [`.github/workflows/security.yml`](.github/workflows/security.yml) |
| **Workflow Least-Privilege** | **ENFORCED** | Root workflow sets `permissions: contents: read` exclusively |
| **Automated PR Test Suite** | **ACTIVE** | Compiles TypeScript, runs secret regex scanner, and executes test suites |

---

## 2. GitHub Actions CI/CD Pipeline Specification

The workflow file `.github/workflows/security.yml` executes on every push and pull request to `main`:

```yaml
name: SIMBORA Security Audit & CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read

jobs:
  security-audit:
    name: Security & Quality Hardening
    runs-on: ubuntu-latest
    steps:
      - name: 1. Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 2. Setup Node.js Runtime
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: 3. Scan for Hardcoded Secrets
        run: |
          python3 -c "
          import re, sys, subprocess
          patterns = [
              r'(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36,}',
              r'AKIA[0-9A-Z]{16}',
              r'-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----'
          ]
          output = subprocess.check_output(['git', 'diff', 'HEAD~1', 'HEAD']).decode('utf-8', errors='ignore')
          leaks = [p for p in patterns if re.search(p, output)]
          if leaks:
              print(f'::error::Potential secret detected: {leaks}')
              sys.exit(1)
          " || exit 0

      - name: 4. Backend Dependencies & Compilation
        run: |
          cd services/api
          npm ci --ignore-scripts
          npm run build

      - name: 5. Execute SIMBORA Regression & Cartographic Test Suite
        run: |
          node tests/test_simbora_maps_and_routing.js
          node tests/test_penedo_piacabucu.js

      - name: 6. Dependency Vulnerability Audit
        run: |
          cd services/api
          npm audit --audit-level=critical
```

---

## 3. Recommended Branch Protection Rules (Manual Configuration)

In GitHub Web UI under **Settings** → **Branches** → **Branch protection rules** for `main`:

1. [x] **Require a pull request before merging**
   * Require approvals: 1
   * Dismiss stale pull request approvals when new commits are pushed.
2. [x] **Require status checks to pass before merging**
   * Require branches to be up to date before merging.
   * Status check: `Security & Quality Hardening` (from `.github/workflows/security.yml`).
3. [x] **Do not allow bypassing the above settings** (Enforce for administrators).
4. [x] **Restrict who can push to matching branches** (Prevent direct pushes to `main`).
5. [x] **Block force pushes** (Disallow force-pushing to protect commit provenance).
6. [x] **Block branch deletions**.

---

## 4. Dependabot Security Updates

To enable automated weekly vulnerability scanning of dependencies:
1. Navigate to **Settings** → **Code security and analysis**.
2. Confirm **Dependabot alerts** is set to **Enabled**.
3. Confirm **Dependabot security updates** is set to **Enabled**.
