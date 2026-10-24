# SIMBORA Platform — Secrets Exposure & Git History Audit Report

**Platform:** SIMBORA Mobility Platform  
**Audit Scope:** Git Index Tracking, Commit History (All 8 Commits), Working Tree, and Local Environments  
**Status:** Remediated in Working Tree • Git History Assessment Complete  
**Classification:** Sanitized Technical Security Report  

---

## 1. Environment Files & Git Index Verification

### 1.1 Tracked Files in Git Index
A strict verification was executed against the Git index using:
```bash
git ls-files | grep -E '(^|/)\.env($|\.)'
```

**Observed Index Status:**
```
.env.example
apps/admin/.env.example
services/api/.env.example
```
* **Result**: **PASS**
* **Verification**: Zero sensitive environment files (`.env`, `.env.local`, `.env.production`) are tracked in the Git index. Only the sanitized `.env.example` templates are tracked.

### 1.2 Gitignore Enforcement
The root [`.gitignore`](.gitignore) file was updated and verified using `git check-ignore`:
```gitignore
# Environment files
.env
.env.*
**/.env
**/.env.*

# Safe templates
!.env.example
!**/.env.example

# Private keys and credentials
*.pem
*.p12
*.pfx
*.key
secrets/
credentials/

# Sensitive backups
*.sql.gz
*.dump
*.bak
```

All local environment files (`.env.local`, `services/api/.env.local`, `apps/admin/.env.local`) are strictly ignored and will never be tracked by subsequent commits.

---

## 2. Git Commit History Audit (All 8 Commits)

A deep-scan script ([`tests/git_history_auditor.py`](tests/git_history_auditor.py)) was executed over the full commit history (`git log -p --full-history --no-textconv`).

### 2.1 Commit Inventory
| Commit Hash | Commit Subject | Author / Date |
| :--- | :--- | :--- |
| `079702d` | `design(brand): include typography proposal in brand assets` | 2026-10-24 |
| `3520479` | `docs(readme): rewrite README in professional English and update security workflow` | 2026-10-24 |
| `394c0ee` | `chore(tools): add lightweight local static server for SIMBORA Studio` | 2026-10-24 |
| `c634e95` | `feat(map-engine): upgrade MapLibre to MapTiler Cloud Streets v2 with zero-watermark HD fallback` | 2026-10-24 |
| `1cb3c44` | `feat(security): complete repository audit, backend hardening, and documentation overhaul` | 2026-10-24 |
| `569f160` | `feat: SIMBORA final release - fix HTTP 403, MapTiler, openrouteservice, Turf.js and Piacabucu -> Penedo simulation` | 2026-10-24 |
| `149b947` | `chore: finalize release files` | 2026-10-24 |
| `f9730ab` | `feat: release Mobility Platform 2.0 - Alagoas Intermunicipal Simulation (Piacabucu -> Penedo)` | 2026-10-24 |

---

## 3. Historical Findings & Remediation Matrix

The scan identified 8 historical occurrences across earlier commits. All findings represent development defaults, test passwords, or documentation examples:

| Finding ID | Commit | File Path | Secret Type | Redacted Match | Severity | Exposure Status | Revocation Required? |
| :--- | :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| **SEC-HIST-01** | `c634e95` | `docs/ROUTING_SETUP.md` | API Key (Doc Example) | `5b********************48` | Low | Public in Git | **No** (Generic ORS documentation prefix) |
| **SEC-HIST-02** | `1cb3c44` | `infrastructure/docker/docker-compose.yml` | JWT Secret Fallback | `${************************************************d}` | Medium | Remediated in current tree | **No** (Template variable fallback) |
| **SEC-HIST-03** | `1cb3c44` | `tests/test_security_hardening.js` | Test User Password | `St**************3!` | Low | Public in test script | **No** (Ephemeral test fixture `testpass@example.com`) |
| **SEC-HIST-04** | `569f160` | `.env.example` | Template JWT Secret | `si************************************26` | Low | Replaced with placeholder | **No** (Replaced by `replace_with_secure_random...`) |
| **SEC-HIST-05** | `569f160` | `services/api/.env.example` | Template JWT Secret | `si************************************26` | Low | Replaced with placeholder | **No** (Replaced by `replace_with_secure_random...`) |
| **SEC-HIST-06** | `f9730ab` | `infrastructure/docker/docker-compose.yml` | Default Postgres Password | `mo***********et` | Medium | Replaced by env variable | **No** (Local Docker development default) |
| **SEC-HIST-07** | `f9730ab` | `infrastructure/docker/docker-compose.yml` | Dev JWT Secret | `mo*********************************re` | Medium | Replaced by env variable | **No** (Local development string) |
| **SEC-HIST-08** | `f9730ab` | `tests/e2e-simulation.ts` | Test Fixture Password | `Se*****3!` | Low | Public in test script | **No** (Fictitious seed user password) |

---

## 4. Current Working Tree Status vs. Historical Status

* **Current Working Tree**:
  * **Zero Real Credentials Tracked**: Verified.
  * **MapTiler Key (`7bwW...`)**: Stored exclusively in `.env.local` files, which are strictly ignored by Git. Never committed.
  * **OpenRouteService Key**: None committed.
  * **Database Credentials**: SQLite embedded database locally; Docker compose configured to ingest `$DB_PASSWORD` from environment.
* **Historical Commits**:
  * Historical commits contain development placeholders and documentation example keys.
  * **Git History Rewriting Recommendation**: If the repository owner intends to make this repository completely public for open-source audit, a coordinated history scrub (using `git-filter-repo` or BFG Repo-Cleaner) can be performed to rewrite the 3 older commits (`f9730ab`, `149b947`, `569f160`).
  * > [!CAUTION]
    > In accordance with Mandatory Safety Rule #23, **no automatic history rewrite or force-push will be performed without explicit authorization from the repository owner**.

---

## 5. Credential Rotation Guidance

If any production API key or database password was ever utilized in earlier testing outside this sandbox:
1. **MapTiler Cloud**: Verify domain whitelisting in [cloud.maptiler.com](https://cloud.maptiler.com/) restricting usage to authorized origins (`localhost`, `*.yourdomain.com`).
2. **JWT Secret**: In production environments, generate a 64-character cryptographically random secret (`openssl rand -hex 32`) and inject it solely via server environment variables.
3. **Database Passwords**: Ensure production PostgreSQL instances utilize generated credentials distinct from any development defaults.
