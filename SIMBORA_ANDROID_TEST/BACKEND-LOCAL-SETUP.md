# BACKEND LOCAL SETUP & REDE WI-FI
## SIMBORA — Configuração do Servidor no Computador Windows

Este documento descreve como manter, verificar e solucionar problemas de conectividade no backend local para que os aplicativos Android físicos comuniquem-se sem falhas.

---

### 1. ENDEREÇO IP E PORTA DO BACKEND

- **IP Local do Computador:** `192.168.3.5`
- **Porta da API HTTP:** `3001`
- **Porta dos WebSockets:** `3001`
- **URL Base:** `http://192.168.3.5:3001`
- **URL de Diagnóstico:** `http://192.168.3.5:3001/health`
- **URL dos Termos de Uso:** `http://192.168.3.5:3001/auth/terms`

---

### 2. COMO INICIAR O BACKEND CASO ELE ESTEJA PARADO

O backend NestJS do SIMBORA já está em execução em segundo plano no computador. No entanto, caso você reinicie o computador ou feche o processo, execute os seguintes passos no PowerShell:

```powershell
# Navegue até a pasta da API
cd "C:\Users\winc\.gemini\antigravity\scratch\mobility-platform\services\api"

# Inicie o servidor compilado
node dist/main.js
```

Ou, se desejar iniciar com hot-reload de desenvolvimento:

```powershell
npm run start:dev
```

Saída esperada no console:
```
[Nest] LOG [NestApplication] Nest application successfully started
[Nest] LOG [RoutesResolver] HealthController {/health}: +1ms
[Nest] LOG [RoutesResolver] AuthController {/auth}: +1ms
[Nest] LOG [RoutesResolver] RidesController {/rides}: +1ms
[Nest] LOG [RoutesResolver] DriversController {/drivers}: +1ms
[Nest] LOG Server running on http://localhost:3001 and http://192.168.3.5:3001
```

---

### 3. CONFIGURAÇÃO DO FIREWALL DO WINDOWS

Para permitir que outros aparelhos na rede Wi-Fi acessem a porta 3001 do seu computador, execute o comando abaixo em um PowerShell aberto como **Administrador**:

```powershell
New-NetFirewallRule -DisplayName "SIMBORA Backend (Porta 3001)" `
    -Direction Inbound `
    -LocalPort 3001 `
    -Protocol TCP `
    -Action Allow
```

Para verificar se a regra está ativa:
```powershell
Get-NetFirewallRule -DisplayName "*SIMBORA Backend*"
```

---

### 4. TESTANDO A CONECTIVIDADE DO CELULAR COM O COMPUTADOR

Para confirmar se o celular consegue enxergar o computador antes mesmo de abrir o aplicativo:

1. Pegue o celular Android conectado na mesma rede Wi-Fi.
2. Abra o navegador Google Chrome no celular.
3. Digite o endereço:
   ```
   http://192.168.3.5:3001/auth/terms
   ```
4. Se o navegador exibir o JSON com os termos de uso do SIMBORA (`{"title":"Termos de Uso SIMBORA","version":"3.5",...}`), a rede está 100% livre e funcionando!

---

### 5. ALTERNATIVA EXTERNA: CLOUDFLARE TUNNEL OU NGROK (SE HOUVER ISOLAMENTO DE WI-FI)

Alguns roteadores de operadoras (ex: Claro, Vivo) possuem um recurso de segurança chamado **"Isolamento de Ponto de Acesso (AP Isolation)"** ativado por padrão, o que impede que dois dispositivos conectados no mesmo Wi-Fi se comuniquem diretamente pelo IP local.

Se você notar que o celular não consegue alcançar o IP `192.168.3.5`:

#### Opção A: Usar Cloudflare Tunnel (Gratuito e sem instalar nada)
```powershell
# Baixe ou execute cloudflared
cloudflared tunnel --url http://localhost:3001
```
O Cloudflare gerará uma URL segura pública (ex: `https://meu-simbora-teste.trycloudflare.com`).

#### Opção B: Usar Ngrok
```powershell
ngrok http 3001
```

**Como aplicar a URL nos aplicativos:**
1. Abra o aplicativo no celular.
2. Toque no ícone de engrenagem no canto superior direito.
3. No campo "Host do Servidor Backend", apague `http://192.168.3.5:3001` e cole a URL pública do túnel (ex: `https://meu-simbora-teste.trycloudflare.com`).
4. Toque no botão **"Salvar"**.
5. Pronto! O app passará a comunicar-se através da internet sem qualquer restrição de roteador local, sem precisar reinstalar o APK!
