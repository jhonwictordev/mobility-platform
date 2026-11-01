# RELATÓRIO TÉCNICO DE COMPILAÇÃO ANDROID (BUILD REPORT)
## SIMBORA — Pacote de Distribuição de Testes em Aparelhos Reais

**Data de Compilação:** 31 de Outubro de 2026  
**Ambiente de Build:** Windows 11 x64  
**Java JDK:** Microsoft OpenJDK 17.0.12 LTS (`C:\Users\winc\jdk-17`)  
**Android SDK:** Android API Level 34 (Android 14) (`C:\Users\winc\android-sdk`)  
**Build-Tools:** Android SDK Build-Tools 34.0.0  
**Compilador de Recursos:** AAPT2 2.19-10229193  
**Compilador Dex:** D8 8.2.2-dev  
**Alinhamento de Memória:** Zipalign (4-byte page-aligned)  
**Assinatura Criptográfica:** Apksigner v0.9 (Esquemas v2 + v3 ativos)  

---

### 1. RESUMO DOS EXECUTÁVEIS GERADOS

| Especificação | APK 1 — Passageiro | APK 2 — Motorista |
| :--- | :--- | :--- |
| **Nome do Arquivo** | `SIMBORA-PASSAGEIRO-TEST.apk` | `SIMBORA-MOTORISTA-TEST.apk` |
| **Nome Exibido na Tela** | `SIMBORA` | `SIMBORA Motorista` |
| **Package ID Único** | `com.simbora.passenger` | `com.simbora.driver` |
| **Versão / Código** | `1.0.0` (versionCode `1`) | `1.0.0` (versionCode `1`) |
| **Target SDK / Compilação** | API 34 (Android 14) | API 34 (Android 14) |
| **Min SDK** | API 24 (Android 7.0 Nougat) | API 24 (Android 7.0 Nougat) |
| **Tamanho do Arquivo** | `107.135 bytes` (~105 KB) | `107.133 bytes` (~105 KB) |
| **Assinatura v2 (APK Scheme)** | ✅ Válida e Verificada | ✅ Válida e Verificada |
| **Assinatura v3 (Key Rotation)** | ✅ Válida e Verificada | ✅ Válida e Verificada |
| **Tráfego HTTP/WS Livre** | ✅ `usesCleartextTraffic="true"` | ✅ `usesCleartextTraffic="true"` |
| **Hardware Acceleration** | ✅ Ativada (`true`) | ✅ Ativada (`true`) |
| **Bridge GPS / Localização** | ✅ Integrada nativamente | ✅ Integrada nativamente |
| **Bridge Feedback Tátil** | ✅ Motor de vibração integrado | ✅ Motor de vibração integrado |

---

### 2. AUDITORIA DE PERMISSÕES DO MANIFEST

Ambos os aplicativos foram compilados com todas as permissões essenciais para execução e teste no mundo real:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

---

### 3. SEGURANÇA DE REDE ANDROID 9+ (CLEARTEXT TRAFFIC)

O Android versão 9 em diante bloqueia tráfego HTTP desprotegido por padrão. Para garantir que os celulares consigam se comunicar diretamente com o backend local do seu computador (`http://192.168.3.5:3001` e `ws://192.168.3.5:3001`), foi incorporado o arquivo `network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">192.168.3.5</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">127.0.0.1</domain>
    </domain-config>
</network-security-config>
```

---

### 4. AUDITORIA DA VERIFICAÇÃO DO APKSIGNER

A execução de validação via `apksigner verify -v` retornou:

```
Verifies
Verified using v1 scheme (JAR signing): false
Verified using v2 scheme (APK Signature Scheme v2): true
Verified using v3 scheme (APK Signature Scheme v3): true
Verified using v3.1 scheme (APK Signature Scheme v3.1): false
Verified using v4 scheme (APK Signature Scheme v4): false
Verified for SourceStamp: false
Number of signers: 1
```

A assinatura atende 100% aos requisitos de segurança do sistema operacional Android para instalação direta sem erros de integridade.

---

### 5. CHECKLIST DE QUALIDADE DO PROJETO

- [x] Dois APKs independentes com Package IDs exclusivos (`com.simbora.passenger` e `com.simbora.driver`).
- [x] Podem ser instalados juntos ou em celulares separados sem conflito.
- [x] Identidade visual oficial SIMBORA 3.5 com paleta Verde Profundo (`#123D32`), Verde Vibrante (`#16A572`) e Amarelo Energia (`#FFCC45`).
- [x] Botão ONLINE/OFFLINE neon funcional no aplicativo do motorista.
- [x] Oferta de corrida com contagem regressiva circular de 15 segundos.
- [x] Trajeto intermunicipal real Piaçabuçu ➔ Penedo (28,2 km) pré-configurado.
- [x] Validação obrigatória de segurança com o código PIN 4821.
- [x] Gráfico animado semanal de ganhos PIX com 7 colunas interativas.
- [x] Aba Meu Veículo e solicitação de troca de veículo com upload de fotos.
- [x] Seletor com os 102 municípios de Alagoas.
- [x] Modal de diagnóstico embutido em ambos os apps para troca de IP em tempo real.
- [x] Pacote ZIP gerado para upload simplificado no Google Drive.
