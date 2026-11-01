# GUIA DE TESTE END-TO-END EM DOIS CELULARES FÍSICOS
## SIMBORA — Mobilidade Urbana & Intermunicipal de Alagoas

Este documento apresenta o roteiro completo de testes práticos utilizando dois celulares Android físicos conectados ao backend local rodando em seu computador Windows (`192.168.3.5:3001`).

---

### ARQUITETURA DO TESTE

```
┌────────────────────────────────┐         ┌────────────────────────────────┐
│      CELULAR 1 (FÍSICO)        │         │      CELULAR 2 (FÍSICO)        │
│      SIMBORA Passageiro        │         │      SIMBORA Motorista         │
│  (com.simbora.passenger)       │         │    (com.simbora.driver)        │
│  Passageira: Marina Silva      │         │    Motorista: Carlos Oliveira  │
└───────────────┬────────────────┘         └────────────────┬───────────────┘
                │                                           │
                │        Rede Wi-Fi Local (192.168.3.x)     │
                └─────────────────┬─────────────────────────┘
                                  ▼
                ┌───────────────────────────────────┐
                │        COMPUTADOR WINDOWS         │
                │   NestJS API + WebSockets + DB    │
                │     http://192.168.3.5:3001       │
                └───────────────────────────────────┘
```

---

## FASE 1 — PREPARAÇÃO E DIAGNÓSTICO INICIAL

Antes de iniciar o fluxo da corrida, verifique se ambos os aparelhos estão comunicando com o computador:

1. **Conecte os 2 celulares no mesmo Wi-Fi** onde o seu computador está conectado.
2. Abra o app **SIMBORA** no Celular 1 (Passageiro).
3. Abra o app **SIMBORA Motorista** no Celular 2 (Motorista).
4. No topo de cada aplicativo, observe o indicador de conexão:
   - Uma bolinha verde pulsante indica conexão estabelecida com `192.168.3.5:3001`.
   - Se estiver amarela ou vermelha, toque no ícone de engrenagem no topo, confira o IP do seu computador e toque em **"Testar Conexão"**.
   - O teste fará uma requisição HTTP real ao endpoint `/auth/terms` e `/health` e exibirá a latência em milissegundos (ex: `18 ms`).

---

## FASE 2 — ROTEIRO DA CORRIDA: PIAÇABUÇU ➔ PENEDO (28,2 km)

### Passo 1: Motorista fica ONLINE
1. No **Celular 2 (Motorista)**, observe o botão no canto superior direito:
   - Se estiver vermelho ("OFFLINE"), toque nele.
   - O botão mudará imediatamente para **"ONLINE"** com pulso verde neon luminoso.
   - O aparelho emitirá uma vibração tátil nativa confirmando a disponibilidade.
   - O status no mapa passa a exibir: *"Aguardando Corridas"*.

### Passo 2: Passageiro configura a rota
1. No **Celular 1 (Passageiro)**:
   - Toque no botão de atalho no mapa: **"⭐ ROTA FAVORITA ALAGOAS: Piaçabuçu ➔ Penedo (28,2 km)"**.
   - Ou toque em "Trocar" e pesquise por qualquer um dos 102 municípios de Alagoas no modal interativo.
   - Selecione a categoria desejada:
     - **SIMBORA Comum**: R$ 42,50 (4 passageiros)
     - **SIMBORA Mulher**: R$ 44,00 (motoristas mulheres)
     - **SIMBORA Moto**: R$ 22,00 (econômico)
     - **SIMBORA Comfort**: R$ 55,00 (ar-condicionado premium)
   - Escolha a forma de pagamento (PIX no App, Cartão ou Dinheiro).

### Passo 3: Solicitação da Corrida
1. No **Celular 1 (Passageiro)**:
   - Toque no botão grande dourado: **"PEDIR SIMBORA — R$ 42,50"**.
   - A tela transita para o **Radar de Busca Animado** com ondas sonares concêntricas transmitindo o chamado em Piaçabuçu e região.
   - O aplicativo dispara o evento para a API local em `192.168.3.5:3001`.

### Passo 4: Recebimento do Chamado no Motorista
1. No **Celular 2 (Motorista)**:
   - O aparelho vibra e exibe o modal de alta prioridade **"NOVA CORRIDA DISPONÍVEL"**.
   - Inicia-se a **contagem regressiva circular de 15 segundos**.
   - Exibe os dados completos:
     - Valor líquido do motorista: **R$ 36,12**
     - Ponto de embarque: *Praça São Francisco de Borja, Piaçabuçu (1,2 km / 3 min)*
     - Ponto de destino: *Centro Histórico / Cais do Rio São Francisco, Penedo (28,2 km)*
     - Passageira: *Marina Silva (Nota 4.9 ⭐)*

### Passo 5: Aceitação da Corrida
1. No **Celular 2 (Motorista)**:
   - Toque no botão verde vibrante: **"ACEITAR CORRIDA"**.
   - A contagem regressiva para e a interface entra no modo HUD: *"A caminho do passageiro (1,2 km / 3 min)"*.
2. No **Celular 1 (Passageiro)**:
   - A tela do radar se fecha automaticamente.
   - Surge o cartão com os dados oficiais do motorista:
     - **Carlos Oliveira** (Nota 4.98 ⭐)
     - **Fiat Cronos Precision 2023 • Prata**
     - **Placa: QTT-4A82**
     - **CÓDIGO DE EMBARQUE (PIN): 4821** em destaque dourado com a instrução: *"Informe verbalmente ao motorista ao embarcar"*.

### Passo 6: Chegada ao Local e Validação do PIN 4821
1. No **Celular 2 (Motorista)**:
   - Toque no botão: **"CHEGUEI AO LOCAL"**.
   - O aplicativo abre a tela de segurança com teclado numérico: *"Código de Segurança — Digite o PIN de 4 dígitos informado pela passageira"*.
   - Digite os 4 dígitos: **4 - 8 - 2 - 1** (ou use o botão rápido de teste "PIN 4821").
   - O sistema valida a segurança instantaneamente e emite pulso tátil verde.

### Passo 7: Início e Execução da Viagem
1. Após a validação do PIN:
   - O Celular 2 (Motorista) entra no modo de navegação com velocímetro virtual (ex: *74 km/h* na Rodovia AL-101 Sul) e mapa em tempo real.
   - O Celular 1 (Passageiro) exibe o veículo se deslocando dinamicamente pelo mapa em direção a Penedo com telemetria ativa.

### Passo 8: Conclusão da Corrida e Repasse Instantâneo via PIX
1. No **Celular 2 (Motorista)**:
   - Toque no botão verde: **"FINALIZAR CORRIDA (CHEGAMOS AO DESTINO)"**.
   - O aplicativo exibe a tela de celebração com recibo financeiro:
     - *Valor Bruto: R$ 42,50*
     - *Taxa SIMBORA (15%): - R$ 6,38*
     - *Ganho Líquido: + R$ 36,12 (Creditado via PIX)*
   - O total do dia no cabeçalho sobe dinamicamente de **R$ 248,50** para **R$ 284,62**!
2. No **Celular 1 (Passageiro)**:
   - O aplicativo exibe: *"Você chegou ao seu destino! Piaçabuçu ➔ Penedo concluído com sucesso."*
   - Toque nas estrelas para avaliar o motorista Carlos Oliveira (5 estrelas).
   - Toque em *"Concluir e Nova Corrida"* para retornar ao estado inicial pronto para a próxima viagem.

---

## FASE 3 — TESTE DAS FUNCIONALIDADES ADICIONAIS

### 1. Teste do Chat em Tempo Real (Aba 3)
- No Celular 1 (Passageiro), vá na aba **"Chat"**.
- Toque nas mensagens rápidas como *"Estou aqui fora!"* ou digite uma mensagem personalizada.
- A mensagem é enviada com horário e balão estilizado.

### 2. Teste da Central de Segurança / SOS (Aba 4)
- No Celular 1 (Passageiro), vá na aba **"Segurança"**.
- Teste o botão **"Compartilhar Rota em Tempo Real"** (aciona o menu nativo do Android para envio via WhatsApp ou SMS).
- Observe o botão de chamada de emergência direta para o **190 (Polícia Militar de Alagoas)**.

### 3. Teste do Gráfico Semanal de Ganhos (Celular do Motorista - Aba 2)
- No Celular 2 (Motorista), toque na aba **"Ganhos"**.
- Visualize as 7 barras animadas com alturas proporcionais aos ganhos de cada dia (Segunda a Domingo).
- Toque em cada coluna (ex: Sábado ou Quinta) para ver o balão interativo com o valor do dia e o total de corridas.
- Teste o botão **"Sacar PIX"** para solicitar transferência instantânea.

### 4. Teste de Troca de Veículo (Celular do Motorista - Aba 4)
- No Celular 2 (Motorista), toque na aba **"Veículo"**.
- Visualize os dados do Fiat Cronos aprovado.
- Toque em **"SOLICITAR TROCA DE VEÍCULO"**.
- Preencha o modelo de um novo carro (ex: *Toyota Yaris 2024*), placa e anexe uma foto da galeria/câmera.
- Toque em **"Enviar para Aprovação"** e confirme a geração do protocolo de vistoria `AL-2026-9812`.

---

## DÚVIDAS OU SUPORTE RÁPIDO

Se houver qualquer divergência de comunicação:
1. Verifique se o comando `node dist/main.js` continua rodando no computador (porta 3001).
2. Abra o navegador do celular e acesse `http://192.168.3.5:3001/health` para checar se o roteador não está bloqueando conexões locais entre dispositivos.
3. Se o IP do seu computador mudar, use o botão de engrenagem no topo de qualquer um dos APKs para atualizar o IP na hora!
