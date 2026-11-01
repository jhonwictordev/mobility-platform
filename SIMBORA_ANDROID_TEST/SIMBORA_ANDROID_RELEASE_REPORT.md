# GOOGLE ANTIGRAVITY — SIMBORA ANDROID TEST RELEASE
## RELATÓRIO OFICIAL DE ENTREGA DOS 2 APKs NATIVOS E AMBIENTE DE TESTES

---

### 1. DIRETÓRIO DE ENTREGA COMPLETO

Todos os arquivos solicitados foram gerados e organizados na pasta:
`C:\Users\winc\.gemini\antigravity\scratch\mobility-platform\SIMBORA_ANDROID_TEST\`

```
SIMBORA_ANDROID_TEST/
  ├── SIMBORA-PASSAGEIRO-TEST.apk      (APK nativo assinado com package com.simbora.passenger)
  ├── SIMBORA-MOTORISTA-TEST.apk       (APK nativo assinado com package com.simbora.driver)
  ├── SIMBORA_ANDROID_TEST.zip         (Pacote ZIP completo contendo os 2 APKs e documentações)
  ├── README-INSTALACAO.txt            (Instruções rápidas de instalação no Android e fontes desconhecidas)
  ├── GUIA-TESTE-2-CELULARES.md        (Roteiro passo a passo do teste conjunto entre 2 celulares)
  ├── BACKEND-LOCAL-SETUP.md           (Guia de rede Wi-Fi, firewall, IPs e alternativa de túnel)
  └── BUILD-REPORT.md                  (Relatório técnico de compilação, SDK 34, AAPT2, D8 e assinaturas)
```

---

### 2. ESPECIFICAÇÕES DOS DOIS APKs GERADOS

| Item | CELULAR 1: SIMBORA Passageiro | CELULAR 2: SIMBORA Motorista |
| :--- | :--- | :--- |
| **Nome do App** | `SIMBORA` | `SIMBORA Motorista` |
| **Arquivo** | [SIMBORA-PASSAGEIRO-TEST.apk](file:///C:/Users/winc/.gemini/antigravity/scratch/mobility-platform/SIMBORA_ANDROID_TEST/SIMBORA-PASSAGEIRO-TEST.apk) | [SIMBORA-MOTORISTA-TEST.apk](file:///C:/Users/winc/.gemini/antigravity/scratch/mobility-platform/SIMBORA_ANDROID_TEST/SIMBORA-MOTORISTA-TEST.apk) |
| **Identificador (Package)**| `com.simbora.passenger` | `com.simbora.driver` |
| **Versão / Code** | `1.0.0` (versionCode `1`) | `1.0.0` (versionCode `1`) |
| **Compilação / Target** | Android 14 (API 34) | Android 14 (API 34) |
| **Compatibilidade Mínima** | Android 7.0 (API 24) | Android 7.0 (API 24) |
| **Assinatura Criptográfica**| APK Signature Scheme v2 + v3 (Verificado) | APK Signature Scheme v2 + v3 (Verificado) |
| **Conexão Padrão** | `http://192.168.3.5:3001` | `http://192.168.3.5:3001` |
| **Área de Diagnóstico** | Integrada (HUD com troca de IP em tempo real) | Integrada (HUD com troca de IP em tempo real) |

---

### 3. PRINCIPAIS DESTAQUES E REQUISITOS IMPLEMENTADOS

#### APK 1 — SIMBORA Passageiro:
- Interface completa com a paleta oficial: Verde Profundo (`#123D32`), Verde Vibrante (`#16A572`) e Amarelo Energia (`#FFCC45`).
- Mapa interativo com suporte a GPS real integrado via bridge Android nativo.
- Modal de busca inteligente com todos os **102 municípios de Alagoas**.
- Rota clássica pré-configurada em um toque: **Piaçabuçu ➔ Penedo (28,2 km)**.
- 4 categorias de corrida com cálculo tarifário dinâmico (**SIMBORA Comum R$ 42,50**, **Mulher R$ 44,00**, **Moto R$ 22,00**, **Comfort R$ 55,00**).
- Radar de busca animado com ondas sonares concêntricas.
- Cartão do motorista aceito: **Carlos Oliveira**, **Fiat Cronos Prata QTT-4A82**, Nota 4.98 ⭐.
- **PIN 4821** em destaque dourado com orientação ao passageiro.
- 5 abas funcionais: Início, Atividades com recibos, Chat em tempo real, Segurança com SOS 190, e Minha Conta com Carteira de testes PIX.

#### APK 2 — SIMBORA Motorista:
- Botão **ONLINE / OFFLINE** com pulso luminoso verde neon (`#16A572`) e vermelho neon (`#EF4444`) e vibração tátil nativa.
- Tela de oferta com **contagem regressiva circular de 15 segundos**, valor líquido em destaque (**R$ 36,12**), som de alerta e botões Recusar / Aceitar Corrida.
- HUD de navegação até o passageiro e botão *"Cheguei ao Local"*.
- Modal de validação de segurança solicitando o **PIN 4821** com teclado numérico integrado.
- Telemetria de viagem com velocímetro virtual e limite de via.
- Conclusão da corrida com repasse financeiro instantâneo e saldo atualizado na hora.
- Gráfico semanal animado de ganhos (Seg a Dom) com detalhamento interativo de cada dia.
- Aba **"Meu Veículo"** com dados aprovados do Fiat Cronos e formulário completo para **"Solicitar Troca de Veículo"** com fotos.
- Aba de documentação com CNH EAR e CRLV aprovados.

---

### 4. STATUS DO BACKEND LOCAL

- **Servidor NestJS:** Rodando em segundo plano na porta `3001` (`http://192.168.3.5:3001`).
- **Endpoint de Teste:** `http://192.168.3.5:3001/auth/terms` respondendo HTTP 200 OK.
- **Firewall:** Instruções de liberação documentadas em `BACKEND-LOCAL-SETUP.md`.
- **Túnel Externo:** Se o roteador Wi-Fi bloquear comunicação direta entre aparelhos, ambos os aplicativos possuem campo na engrenagem superior para alterar o host (ex: para uma URL Cloudflare ou Ngrok) sem reinstalar os APKs.
