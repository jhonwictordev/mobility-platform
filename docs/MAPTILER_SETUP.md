# GUIA DE CONFIGURAÇÃO DO MAPTILER CLOUD — SIMBORA

> **Documento:** `docs/MAPTILER_SETUP.md`  
> **Finalidade:** Passo a passo para obtenção e configuração de chaves do MapTiler Cloud

---

## 1. COMO OBTER UMA CHAVE GRATUITA NO MAPTILER

1. Acesse o portal oficial do provedor:  
   👉 **[https://cloud.maptiler.com/account/keys/](https://cloud.maptiler.com/account/keys/)**
2. Clique em **"Sign in"** ou **"Create a free account"** (pode utilizar login social com Google ou GitHub).
3. Após o login, vá até a aba **"API keys"**.
4. Copie a chave padrão gerada ou clique em **"Create a new key"** (exemplo de nome: `SIMBORA Mobility Web`).

> [!TIP]
> **Limite do Plano Gratuito:** O plano Free do MapTiler oferece **100.000 requisições de mapas por mês**, o que é mais do que suficiente para todo o ciclo de desenvolvimento, testes e simulação contínua.

---

## 2. BOAS PRÁTICAS DE SEGURANÇA (RESTRIÇÃO DE DOMÍNIOS)

No painel do MapTiler, clique sobre a sua chave e configure as **"Key restrictions"**:
- **Allowed HTTP referrers:**
  - `http://localhost:*`
  - `http://127.0.0.1:*`
  - `file://*` (para abertura local de arquivos HTML no navegador)

Dessa forma, sua chave pública de mapa não poderá ser consumida por sites de terceiros caso seja visualizada no código frontend.

---

## 3. CONFIGURAÇÃO NO PROJETO

### Opção A: No SIMBORA Studio (Direto no Navegador)
1. Abra o arquivo `mobility_interactive_studio.html` no Brave.
2. No topo da tela, clique no botão **"Chaves API"**.
3. Cole sua chave no campo `VITE_MAPTILER_KEY (MapTiler Cloud)`.
4. Clique em **"Salvar e Aplicar"**.
5. O estúdio recarregará instantaneamente o estilo vetorial **MapTiler Streets v2** e salvará a chave com segurança no `localStorage` do seu navegador.

### Opção B: Via Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```
E preencha com a sua chave:
```env
VITE_MAPTILER_KEY=sua_chave_maptiler_aqui
NEXT_PUBLIC_MAPTILER_KEY=sua_chave_maptiler_aqui
```

---

## 4. O QUE ACONTECE SE A CHAVE NÃO FOR INFORMADA?

A plataforma **SIMBORA** foi arquitetada com resiliência de produção:
- Se nenhuma chave do MapTiler for informada, o sistema ativa automaticamente o fallback **CartoDB Voyager**.
- O mapa carrega perfeitamente em alta definição, sem telas em branco, sem travamentos e com **zero erros HTTP 403**.
