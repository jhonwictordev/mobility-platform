# Security Policy

The SIMBORA team takes the security of our platform, APIs, mobile clients, and user data seriously. This document outlines our vulnerability disclosure process, supported versions, and security commitments.

---

## Supported Versions

Security fixes and patches are applied to the active development branch (`main`) and released versions according to the matrix below:

| Version | Supported | Security Maintenance Level |
| :--- | :--- | :--- |
| **2.1.x** (Current) | :white_check_mark: Yes | Active security hardening & real-time patching |
| **2.0.x** | :white_check_mark: Yes | Critical security backports only |
| **1.0.x** | :x: No | Deprecated prototype version |

---

## Reporting a Vulnerability

If you discover a security vulnerability or believe you have identified a security weakness within SIMBORA, **please do not disclose it publicly** (e.g., in public GitHub issues, discussions, or social media).

### Disclosure Steps
1. **Report via Security Advisory**: Use GitHub's private vulnerability reporting feature on this repository:
   * Navigate to the **Security** tab of the repository.
   * Click **Report a vulnerability** to open a private disclosure draft.
2. **Alternative Contact**: If GitHub private advisories are unavailable, send an encrypted report to the maintainers via the contact email listed on the repository owner's GitHub profile.

### Information to Include
To help us triage and resolve the issue quickly, please provide:
* A descriptive title and summary of the suspected vulnerability.
* The affected component(s) (e.g., API endpoint, WebSocket gateway, client component).
* Step-by-step reproduction instructions or a minimal proof-of-concept (PoC).
* Potential impact of exploitation (e.g., privilege escalation, unauthorized data access, denial of service).
* Any recommended remediations or workarounds.

---

## Response SLA & Process

* **Initial Acknowledgment**: Within **48 hours** of receiving your report, a maintainer will review the disclosure and confirm receipt.
* **Triage & Assessment**: Within **5 business days**, we will assess the validity, determine severity (CVSS score), and communicate an estimated remediation timeline.
* **Fix & Verification**: A patch will be authored in a private branch, reviewed for regressions, and verified against our automated test suites.
* **Coordinated Public Release**: Once the patch is merged into `main` and deployed, a security advisory will be published crediting the reporter (unless anonymity is requested).

---

## Security Practices & Safeguards

SIMBORA maintains proactive defense-in-depth measures:
* **Zero Hardcoded Secrets**: Automated secret scanning on every pull request.
* **Role-Based Access Control**: Strict segregation between passenger, driver, and administrative capabilities.
* **OWASP Compliance**: Automated application of HTTP security headers and IP rate limiting.
* **Synthetic Test Data**: Complete elimination of real personal identifiable information (PII) from source code and public fixtures.
