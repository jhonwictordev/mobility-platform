# 🚗 SIMBORA — Plataforma de Mobilidade Urbana & Intermunicipal (Alagoas)

Plataforma completa e autônoma de transporte estilo Uber com identidade oficial **SIMBORA**, desenvolvida sob o paradigma de engenharia limpa com renderização cartográfica via **MapLibre GL JS**, **MapTiler Cloud**, **openrouteservice** (com proxy seguro no backend NestJS) e motor de física geoespacial **Turf.js**.

---

## 🌟 Principais Recursos da Versão 2.0 (SIMBORA)

- 🚫 **Zero Erros HTTP 403:** Servidores voluntários do OpenStreetMap removidos. Suporte integrado ao **MapTiler Cloud Streets v2** e **CartoDB Voyager** nativo (HTTP 200 OK).
- 🛣️ **Cenário Homologado:** Viagem rodoviária real entre **Praça São Francisco (Piaçabuçu)** e o **Centro Histórico de Penedo** (28,2 km, 485 nós GeoJSON pela AL-101 e AL-225).
- 📐 **Motor de Simulação com Turf.js:** Deslocamento com interpolação precisa ao longo da distância acumulada (`turf.along`) e rotação da carroceria pelo azimute geodésico da curva (`turf.bearing`).
- 🎛️ **Controles de Reprodução e Scrubber:** Iniciar, Pausar, Continuar, Reiniciar, Avançar 10%, Retroceder 10%, velocidades de **1×, 2×, 5×, 10× e 20×** e slider de progresso interativo.
- 📱 **Dual Mobile Simulators (390×844):** App do Passageiro (Marina Silva) e App do Motorista (Carlos Oliveira / Corolla `BRA2E19`), com PIN de segurança (`4821`) e avaliação 5⭐.
- 🔒 **Segurança de Credenciais:** Chave do openrouteservice protegida no backend (`GET /location/route`) e `.env.example` padronizado.
- 🎨 **Identidade SIMBORA:** Verde principal (`#123D32`), Verde vibrante (`#16A572`), Amarelo destaque (`#FFCC45`), Branco suave (`#F8F9F6`) e Grafite (`#17211D`).

---

## ⚡ Como Executar e Testar

### 1. SIMBORA Studio (Simulador Web com Mapas Reais)
Abra o arquivo [`mobility_interactive_studio.html`](file:///C:/Users/winc/.gemini/antigravity/scratch/mobility-platform/mobility_interactive_studio.html) no seu navegador ou acesse o artefato no Antigravity.

### 2. Painel Administrativo Web
Disponível em `http://localhost:3000` (Next.js 16 em execução).

### 3. Backend API REST & WebSockets
Disponível em `http://localhost:3001` (NestJS 11 em execução):
- Rota rodoviária: `http://localhost:3001/location/route?originLat=-10.4056&originLng=-36.4344&destLat=-10.2897&destLng=-36.5864`
- Estimativa tarifária: `http://localhost:3001/pricing/estimate?fromLat=-10.4056&fromLng=-36.4344&destLat=-10.2897&destLng=-36.5864`

### 4. Executar Testes Automatizados
```bash
node tests/test_simbora_maps_and_routing.js
```
Resultado: **7/7 Testes Aprovados**.
