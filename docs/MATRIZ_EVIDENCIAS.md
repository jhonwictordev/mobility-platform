# Matriz de Evidências Técnicas

> [!IMPORTANT]
> Esta matriz documenta a rastreabilidade de cada decisão técnica tomada no desenvolvimento da plataforma independente.
> Nenhum APK proprietário foi fornecido ou adulterado. Todas as evidências derivam de fontes públicas ou deduções técnicas explícitas.

---

## 1. Critérios de Classificação

- 🟢 **OBSERVADA:** Informação documentada publicamente de forma oficial pela Uber (Eng Blog, patentes públicas, documentação de desenvolvedores, Play Store ou repositórios open-source) ou verificável empiricamente no uso regular do serviço.
- 🟡 **INFERIDA:** Conclusão técnica deduzida a partir de boas práticas de engenharia de software distribuído, restrições matemáticas e padrões consolidados da indústria de mobilidade.
- 🔴 **DESCONHECIDA:** Detalhes internos privados, segredos comerciais, ofuscação de código ou chaves de criptografia inacessíveis sem descompilação de APK ou acesso privilegiado.

---

## 2. Matriz Completa de Componentes e Heurísticas

| ID | Área / Componente | Descoberta / Comportamento | Classificação | Fonte de Evidência | Aplicação na Mobility Platform |
|---|---|---|---|---|---|
| E-01 | Mobile Arch | Uso do padrão RIBs com árvore de estados desacoplada da UI | 🟢 OBSERVADA | Uber Eng Blog & GitHub `uber/RIBs` | Adotamos arquitetura desacoplada com Zustand + Navigation State |
| E-02 | Geo Indexing | Particionamento espacial hierárquico em hexágonos H3 | 🟢 OBSERVADA | `uber/h3` no GitHub | Implementamos busca espacial Haversine compatível com PostGIS |
| E-03 | Dispatch | Algoritmo de batching e otimização global em vez de greedy puro | 🟢 OBSERVADA | Uber Eng Blog: "How Uber Optimizes Dispatch" | Motor de busca e fila de tentativas atômica com timeout |
| E-04 | Precificação | Tarifa dinâmica baseada em descompasso oferta vs. demanda | 🟢 OBSERVADA | Documentação de passageiros & patentes de Dynamic Pricing | Algoritmo no `PricingModule` com cálculo de km, tempo e multiplicador |
| E-05 | Telemetria | Envio de localização do motorista a cada ~3-4 segundos | 🟢 OBSERVADA | Observação do tráfego e latência de animação de carrinhos | WebSocket Gateway com evento `driver:location_update` a cada 3s |
| E-06 | Trip Lifecycle | Máquina de estados estrita: REQUESTED → SEARCHING → ACCEPTED... | 🟢 OBSERVADA | API pública v1.2 (`/v1.2/requests/current`) | `trip-state-machine.ts` com validação estrita de transições válidas |
| E-07 | Segurança | Código PIN de 4 dígitos para validação de início da viagem | 🟢 OBSERVADA | Divulgação oficial "U-Código" no Safety Center | Campo de validação e confirmação segura no início da viagem |
| E-08 | Prevenção Concorrência | Travamento atômico para evitar que 2 motoristas aceitem a mesma corrida | 🟡 INFERIDA | Padrão arquitetural indispensável contra Race Conditions | Trava atômica em memória e transação em banco de dados |
| E-09 | Buffer Offline | Fila local de eventos em SQLite quando há perda de sinal 4G/5G | 🟡 INFERIDA | Comportamento ao atravessar túneis sem perda de telemetria | Buffer in-memory com retentativas nos clientes mobile |
| E-10 | Chaves de Criptografia | Criptografia ponta a ponta e chaves privadas do app nativo | 🔴 DESCONHECIDA | Privado / Inacessível sem APK descompilado | Utilização de padrões abertos (TLS 1.3, JWT, bcrypt) |
| E-11 | Ofuscação / Anti-Tamper | Regras de ProGuard, DexGuard, detecção de Root e Magisk | 🔴 DESCONHECIDA | Privado / Inacessível sem análise de binário | Plataforma independente não necessita de cópia dessas proteções |
| E-12 | Roteador Interno ETA | Heurísticas proprietárias de machine learning de previsão de tráfego | 🔴 DESCONHECIDA | Modelos neurais privados da Uber (DeepETA) | Estimativa baseada em velocidade média parametrizada por horário |

---

## 3. Conformidade Legal e de Integridade

- **Separação Limpa (Clean Room Design):** Todo o código-fonte desenvolvido na pasta `services/api`, `apps/passenger`, `apps/driver`, `apps/admin` e `packages/` é de autoria original e independente.
- **Zero Vazamento de Segredos:** Nenhuma chave, credencial, endpoint interno da Uber ou asset proprietário (ícones, logos) foi utilizado. A identidade visual adotada é 100% autônoma.
