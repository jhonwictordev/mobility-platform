# ENGENHARIA REVERSA FUNCIONAL: BLABLACAR BRASIL & MÓDULO CARONAS
## Análise Pública, Regras de Negócio e Adaptação Original para o SIMBORA 4.0

---

### 1. OBJETIVO DA ANÁLISE FUNCIONAL

Este documento registra a análise funcional e de regras de negócio publicamente observáveis da plataforma **BlaBlaCar Brasil** (disponível em `blablacar.com.br`, `blablacar.com.br/carpool` e `blablacar.com.br/offer-seats`), servindo como base conceitual para o desenvolvimento do **SIMBORA CARONAS** — módulo original de viagens intermunicipais e caronas compartilhadas adaptado à realidade do estado de Alagoas.

> **Nota de Conformidade:** Esta análise foi conduzida estritamente sobre fluxos públicos de usuários e passageiros. Não foram utilizadas APIs proprietárias não autorizadas, engenharia reversa de binários ou acesso a sistemas restritos. Toda a implementação no SIMBORA é 100% original e licenciada para o projeto.

---

### 2. CARACTERÍSTICAS PUBLICAMENTE OBSERVADAS NA BLABLACAR

| Recurso | Comportamento Observado na BlaBlaCar | Equivalente Original SIMBORA 4.0 |
| :--- | :--- | :--- |
| **Natureza do Serviço** | Carona solidária e compartilhamento de custos em médias e longas distâncias (intermunicipal/interestadual). Não é táxi nem corrida imediata. | **SIMBORA Caronas:** Viagens intermunicipais programadas com rateio de custos entre condutor e passageiros em Alagoas. |
| **Origem e Destino** | Pesquisa por municípios ou pontos de interesse conhecidos. | Pesquisa abrangendo os **102 municípios de Alagoas** com pontos de referência locais (praças, rodoviárias, trevos). |
| **Paradas Intermediárias** | O condutor adiciona cidades ou cruzamentos ao longo do trajeto (ex: ao ir de São Paulo a Curitiba, pode parar em Registro). Passageiros de trechos parciais encontram a viagem. | **Trechos Segmentados Alagoas:** Ex: Rota Penedo ➔ Maceió permite paradas em Igreja Nova, São Sebastião, Junqueiro e São Miguel dos Campos. |
| **Gestão de Assentos** | O condutor define 1 a 4 vagas disponíveis. Os assentos são decrementados por trecho percorrido. | **Controle de Capacidade por Segmento:** Garantia de que a reserva em um trecho intermediário não sobrecarregue o veículo nem permita overbooking. |
| **Preço / Contribuição** | Sugestão de valor com teto máximo baseado em custos de combustível e pedágio para evitar caracterização de transporte clandestino com fins lucrativos. | **Teto de Compartilhado Solidário:** Valores fixados em faixas justas de rateio de despesas de combustível e manutenção. |
| **Modos de Reserva** | 1. **Reserva Instantânea** (confirmação imediata).<br>2. **Aprovação Manual** (o condutor tem prazo para aceitar ou recusar). | **Aprovação Flexível:** O condutor escolhe entre Confirmação Instantânea ou Aprovação Manual por solicitação. |
| **Comunicação** | Chat interno vinculado à viagem para acertar detalhes de bagagem, ponto de encontro e pontualidade. | **Chat Integrado SIMBORA Carona:** Mensagens seguras entre condutor e passageiros vinculadas ao identificador da carona. |
| **Preferências** | Fumo, animais de estimação, porte de bagagem (P, M, G), ar-condicionado e nível de conversa. | **Preferências de Bordo Alagoas:** Bagagem, ar-condicionado, música, tolerância a pets e volume de bagagens. |
| **Perfis e Confiança** | Documento verificado, foto de rosto, telefone confirmado, nota e avaliações de viagens anteriores. | **Selo Condutor Verificado SIMBORA:** Validação de CNH com EAR, CRLV do veículo e histórico de pontualidade. |
| **Viagens Recorrentes** | Publicação de caronas repetidas em dias fixos da semana (ex: estudantes ou trabalhadores que viajam seg/sex). | **Agenda Recorrente SIMBORA:** Criação automática de viagens semanais para servidores e estudantes intermunicipais. |
| **Alertas de Viagens** | O passageiro cria um alerta para ser notificado se surgir uma carona em data e trajeto específicos. | **"Avisar Quando Surgir Carona":** Notificação push e em tela quando um motorista publicar a rota desejada. |

---

### 3. MATRIZ DE DIFERENCIAÇÃO: SIMBORA CORRIDAS vs SIMBORA CARONAS

| Aspecto | Modalidade 1: SIMBORA CORRIDAS (Atual) | Modalidade 2: SIMBORA CARONAS (Novo Módulo) |
| :--- | :--- | :--- |
| **Finalidade** | Transporte urbano imediato sob demanda (porta a porta). | Viagens intermunicipais programadas e compartilhadas. |
| **Tempo de Resposta** | Partida imediata (motorista chega em 3 a 10 min). | Partida agendada (horas, dias ou semanas de antecedência). |
| **Modelo de Precificação**| Tarifa dinâmica/km/tempo por veículo exclusivo. | Contribuição fixa de compartilhamento de custos **por assento**. |
| **Relação de Passageiros**| 1 passageiro (ou grupo fechado) ocupa o carro todo. | Até 4 passageiros independentes dividindo o mesmo veículo. |
| **Estado do Motorista** | Precisa estar **ONLINE** em tempo real no mapa. | Pode publicar carona futura mesmo estando **OFF-LINE** para corridas imediatas. |
| **Algoritmo de Match** | Busca por proximidade de raio radar (GPS ao vivo). | Busca por compatibilidade de data, horário e rota linear. |
| **Pontos de Embarque** | No local exato onde o passageiro chamou (GPS). | Em pontos de encontro pré-acordados (praças, postos, rodoviárias). |

---

### 4. REQUISITOS REGULATÓRIOS E LEGAIS NO BRASIL

1. **Marco Legal da Carona Solidária (Lei Federal nº 12.587/2012 e jurisprudência pacificada dos Tribunais Superiores):**
   - O compartilhamento de despesas de viagem sem objetivo de lucro profissional por parte do condutor particular não se confunde com transporte público clandestino remunerado.
   - O sistema SIMBORA implementa tetos de contribuição por assento e limitação de passageiros por veículo para manter estrita conformidade legal.
2. **Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018):**
   - Telefone e documentos do passageiro e condutor são mantidos criptografados e não são expostos publicamente antes da confirmação da reserva.
3. **Segurança de Bordo:**
   - Exigência de CNH válida e CRLV em dia para o condutor publicar viagens.
