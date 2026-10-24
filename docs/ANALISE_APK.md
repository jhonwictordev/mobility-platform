# Análise de APK — Aplicativo de Mobilidade Urbana (Uber)

> [!IMPORTANT]
> **Nenhum APK foi fornecido para esta análise.** Toda a documentação contida neste relatório é baseada exclusivamente em fontes públicas: blog de engenharia do Uber, documentação de APIs públicas, descrições na Google Play Store, projetos open-source, artigos técnicos publicados e comportamento observável como usuário final.

---

## 1. Resumo Executivo

Este documento apresenta uma análise técnica do aplicativo Uber para Android, baseada inteiramente em informações publicamente disponíveis. A análise abrange arquitetura mobile, componentes Android, fluxos de usuário, infraestrutura de backend e práticas de engenharia documentadas pela equipe do Uber.

### Classificação de Evidências

Cada descoberta é classificada conforme o seguinte sistema:

| Classificação | Significado | Símbolo |
|---|---|---|
| **OBSERVADA** | Diretamente verificável através de fontes públicas (docs oficiais, Play Store, blog de engenharia, APIs públicas) | 🟢 |
| **INFERIDA** | Razoavelmente deduzida a partir de evidências disponíveis (padrões de arquitetura, comportamento do app, fontes secundárias) | 🟡 |
| **DESCONHECIDA** | Impossível determinar sem acesso ao APK, código-fonte ou engenharia reversa | 🔴 |

---

## 2. Fontes Públicas Utilizadas

### 2.1 Fontes Primárias (Oficiais do Uber)
- **Uber Engineering Blog** (eng.uber.com) — Arquitetura RIBs, DOMA, infraestrutura de dados
- **GitHub uber/** — Projetos open-source: RIBs, H3, Cadence, uReplicator, Chaperone
- **Uber Developer Portal** (developer.uber.com) — API REST v1.2, Deep Links, Ride Request Button
- **Google Play Store** — Permissões do app, descrição, screenshots
- **Uber Safety Center** — Funcionalidades de segurança documentadas

### 2.2 Fontes Secundárias
- Artigos técnicos e palestras de engenheiros do Uber
- Análises de system design (High Scalability, Medium, dev.to)
- Documentação do Android sobre permissões e componentes

---

## 3. O que FOI Possível Analisar (Sem APK)

| Aspecto | Viabilidade | Fonte |
|---|---|---|
| Arquitetura mobile (RIBs) | 🟢 Completa | Blog de engenharia + GitHub open-source |
| Permissões Android | 🟢 Completa | Google Play Store |
| Fluxos de usuário (passageiro/motorista) | 🟢 Completa | Documentação oficial + uso do app |
| APIs públicas REST | 🟢 Completa | developer.uber.com |
| Infraestrutura de backend | 🟢 Parcial | Blog de engenharia |
| Projetos open-source | 🟢 Completa | GitHub |
| Funcionalidades de segurança | 🟢 Completa | Uber Safety Center |
| Precificação dinâmica (surge) | 🟡 Inferida | Documentação pública + comportamento |
| Protocolos de comunicação em tempo real | 🟡 Inferida | Blog de engenharia + padrões de mercado |

---

## 4. O que NÃO Foi Possível Analisar (Requer APK)

| Aspecto | Status | Motivo |
|---|---|---|
| Código-fonte Java/Kotlin específico | 🔴 DESCONHECIDO | Requer descompilação do APK |
| Manifest XML completo | 🔴 DESCONHECIDO | Requer extração do APK |
| Activities, Services, BroadcastReceivers declarados | 🔴 DESCONHECIDO | Requer AndroidManifest.xml |
| Bibliotecas de terceiros (SDKs de analytics, crash reporting) | 🔴 DESCONHECIDO | Requer análise de dependências |
| Configurações de ProGuard/R8 (ofuscação) | 🔴 DESCONHECIDO | Requer APK |
| Endpoints internos de API não documentados | 🔴 DESCONHECIDO | Requer interceptação de tráfego |
| Implementação de criptografia local | 🔴 DESCONHECIDO | Requer código-fonte |
| Schemas de banco de dados local (Room/SQLite) | 🔴 DESCONHECIDO | Requer análise do APK |
| Content Providers internos | 🔴 DESCONHECIDO | Requer AndroidManifest.xml |
| Lógica de geofencing detalhada | 🔴 DESCONHECIDO | Requer código-fonte |

---

## 5. Resumo da Arquitetura Identificada

### 5.1 Arquitetura Mobile — Framework RIBs 🟢

O Uber utiliza o framework **RIBs (Router, Interactor, Builder, [View])**, open-source no GitHub, como padrão arquitetural para seus aplicativos móveis iOS e Android. Este framework:

- Separa lógica de negócios da camada de apresentação
- Organiza o app em uma **árvore de estados** (não de telas)
- Suporta centenas de desenvolvedores no mesmo repositório
- Utiliza injeção de dependência hierárquica
- Permite RIBs sem UI (apenas lógica de negócio/estado)

### 5.2 Backend — Microsserviços + DOMA 🟢

O Uber evoluiu de um monolito Python/Postgres para milhares de microsserviços, organizados sob a **DOMA (Domain-Oriented Microservice Architecture)**:

- **Supply Service**: gerencia estado e localização dos motoristas
- **Demand Service**: gerencia requisições dos passageiros
- **DISCO (Dispatch Optimization)**: motor de matching oferta/demanda
- **Apache Kafka**: backbone de streaming (trilhões de mensagens/dia)
- **Schemaless/Docstore**: armazenamento transacional distribuído

### 5.3 Projetos Open-Source Relevantes 🟢

| Projeto | Domínio | Descrição |
|---|---|---|
| **RIBs** | Mobile | Framework de arquitetura cross-platform |
| **H3** | Geoespacial | Indexação hexagonal hierárquica |
| **Cadence** | Workflows | Orquestração de processos distribuídos |
| **uReplicator** | Streaming | Replicação cross-region de Kafka |
| **Chaperone** | Auditoria | Verificação de integridade de dados em Kafka |

---

## 6. Documentos Complementares

Este relatório é complementado pelos seguintes documentos detalhados:

1. **[COMPONENTES_ANDROID.md](./COMPONENTES_ANDROID.md)** — Análise de componentes Android
2. **[FLUXOS_PASSAGEIRO.md](./FLUXOS_PASSAGEIRO.md)** — Fluxos do passageiro
3. **[FLUXOS_MOTORISTA.md](./FLUXOS_MOTORISTA.md)** — Fluxos do motorista
4. **[ARQUITETURA_OBSERVADA.md](./ARQUITETURA_OBSERVADA.md)** — Arquitetura observada
5. **[MATRIZ_EVIDENCIAS.md](./MATRIZ_EVIDENCIAS.md)** — Matriz completa de evidências

---

## 7. Conclusão

Mesmo sem acesso ao APK, foi possível documentar extensivamente a arquitetura, os componentes, os fluxos de usuário e a infraestrutura do Uber graças à cultura de transparência técnica da empresa (blog de engenharia, open-source, APIs públicas). No entanto, detalhes de implementação específicos — como o manifesto Android completo, SDKs de terceiros integrados e lógica de negócio proprietária — permanecem classificados como **DESCONHECIDOS** e só podem ser determinados através de análise direta do APK.

---

*Documento gerado em outubro de 2026. Baseado exclusivamente em informações publicamente disponíveis.*
