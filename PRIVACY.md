# Privacy Policy & Data Protection Practices

This document outlines the technical privacy architecture, data minimization standards, and compliance frameworks implemented in the **SIMBORA Mobility Platform**.

---

## 1. Synthetic Test Data Disclaimer

> [!IMPORTANT]
> **All personal, driver, vehicle, and trip information present in this repository, including database seeds, documentation, screenshots, and test scripts, is strictly synthetic and fictitious.**

* **Names & Profiles**: All accounts (e.g., "Demo Passenger 01", "Demo Driver 01") are artificial test personas.
* **Email Addresses**: All email addresses utilize the Internet Assigned Numbers Authority (IANA) reserved domain `@example.com` (RFC 2606 / RFC 6761).
* **Telephone Numbers**: All contact numbers use reserved fictional prefix blocks (e.g., `+55 11 99999-0001`).
* **Vehicles & Identifiers**: License plates adhere to standardized demonstration formats (`BRA2E19`, `RIO4A22`) and do not correspond to registered vehicles.
* **Geographic Telemetry**: Coordinates represent public highway routes and regional landmarks in the State of Alagoas, Brazil; they do not reflect real user location histories.

---

## 2. Technical Privacy Architecture & Data Minimization

SIMBORA adheres to the core principle of **privacy by design and default**:

### Location Telemetry Ephemerality
* **Real-time Ephemeral Tracking**: Driver GPS coordinates transmitted via WebSocket events are consumed for active trip interpolation and passenger map updates. They are not permanently appended to high-frequency persistent log stores.
* **Offline Privacy Protection**: When a driver changes status to `OFFLINE`, location transmission stops immediately. Background tracking is strictly prohibited when drivers are off-duty.

### Credential Protection
* **Salted Password Hashing**: All authentication passwords are encrypted using **BCrypt** with high-cost salt factors prior to persistence. Plaintext passwords never enter log streams.
* **Token Expiration**: JSON Web Tokens (JWT) enforce short lifecycles with strict signature verification.

---

## 3. Compliance with Brazilian General Data Protection Law (LGPD)

SIMBORA's data handling architecture aligns with the principles of the Brazilian General Data Protection Law (**Lei Geral de Proteção de Dados — Lei nº 13.709/2018**):

| LGPD Principle | Architectural Implementation |
| :--- | :--- |
| **Finalidade (Purpose)** | Location and vehicle data are collected solely for dispatching rides and calculating fares. |
| **Adequação (Adequacy)** | Data fields are constrained strictly to what is required to execute transit operations. |
| **Necessidade (Necessity)** | Telemetry data retention is minimized; testbed instances operate on local ephemeral storage. |
| **Livre Acesso (Free Access)** | Endpoints provide passengers and drivers complete transparency over their active and completed trips. |
| **Segurança (Security)** | Role-based access controls (RBAC), OWASP security headers, and rate limiting protect against unauthorized access. |

---

## 4. Rights of Data Subjects

In production deployments of SIMBORA, users retain full statutory rights regarding their personal information:
* **Confirmation & Access**: Request confirmation of data processing and obtain copies of stored account records.
* **Correction**: Update incomplete, inaccurate, or outdated registration details.
* **Anonymization & Deletion**: Request erasure of account data and trip history, subject to statutory retention obligations for financial and transportation audits.

---

## 5. Contact & Data Protection Officer (DPO)

For inquiries concerning platform privacy practices, data protection safeguards, or compliance verification, contact the repository maintainers via the security disclosure channels described in [SECURITY.md](SECURITY.md).
