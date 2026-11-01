# ARQUITETURA GERAL DO SISTEMA SIMBORA 4.0
## Módulo de Caronas Intermunicipais + Corridas Particulares

---

### 1. PRINCÍPIO ESTRUTURAL: 2 APPS & 2 MODALIDADES

A plataforma SIMBORA 4.0 é composta por **exatamente dois aplicativos Android**, compartilhando o mesmo ecossistema de backend, banco de dados e inteligência de mapas, sem fragmentar os usuários:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PLATAFORMA SIMBORA 4.0                          │
├───────────────────────────────────┬────────────────────────────────────┤
│       1. SIMBORA PASSAGEIRO       │        2. SIMBORA MOTORISTA        │
│   (com.simbora.passenger)         │    (com.simbora.driver)            │
├─────────────────┬─────────────────┼──────────────────┬─────────────────┤
│  MODALIDADE A:  │  MODALIDADE B:  │  MODALIDADE A:   │  MODALIDADE B:  │
│  CORRIDA AGORA  │     CARONAS     │     CORRIDAS     │ MINHAS CARONAS  │
│                 │                 │                  │                 │
│  - Chamar já    │ - Buscar carona │ - Ficar ONLINE   │ - Publicar rota │
│  - Radar motor. │ - 102 cidades   │ - Oferta 15 seg  │ - Paradas AL    │
│  - Tarifa dinâm.│ - Reservar vaga │ - Navegar pickup │ - Aprovar vaga  │
│  - PIN 4821     │ - Chat condutor │ - Validar PIN    │ - Iniciar rota  │
│  - Rota ao vivo │ - Rateio custos │ - Concluir PIX   │ - Rateio custos │
└─────────────────┴─────────────────┴──────────────────┴─────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                BACKEND COMPARTILHADO (NestJS + SQLite)                 │
│                 http://192.168.3.5:3001 | ws://...                     │
├────────────────────────┬───────────────────────┬───────────────────────┤
│  SERVIÇO DE CORRIDAS   │  SERVIÇO DE CARONAS   │ SERVIÇOS COMPARTILH.  │
│  - TripsService        │  - CarpoolsService    │ - Users & Auth        │
│  - DispatchService     │  - Stops & Segments   │ - Vehicles & Approval │
│  - DriverAvailability  │  - SeatInventory      │ - WebSockets Gateway  │
│  - Realtime Telemetry  │  - RecurringSchedules │ - Payments / Wallet   │
│  - Dynamic Pricing     │  - CarpoolAlerts      │ - Admin Dashboard     │
└────────────────────────┴───────────────────────┴───────────────────────┘
```

---

### 2. O ALGORITMO DE CORRESPONDÊNCIA DE TRECHOS (CIDADES INTERMEDIÁRIAS)

O grande diferencial técnico do módulo de Caronas é permitir que uma viagem intermunicipal atenda passageiros que viajam apenas em trechos intermediários:

#### Exemplo Real em Alagoas:
- **Viagem Publicada pelo Condutor:**
  - Ponto 0 (Origem): **Penedo** (Saída 06:30)
  - Ponto 1 (Parada 1): **Igreja Nova** (Passagem ~06:55)
  - Ponto 2 (Parada 2): **São Sebastião** (Passagem ~07:20)
  - Ponto 3 (Parada 3): **São Miguel dos Campos** (Passagem ~08:00)
  - Ponto 4 (Destino): **Maceió** (Chegada ~09:00)
  - Assentos do Carro: 3 vagas

#### Regras de Validação de Segmentos:
1. **Ordem Estrita dos Pontos (`SequenceIndex`):**
   - Um passageiro pesquisando `Igreja Nova ➔ Maceió` é atendido porque `Index(Igreja Nova) < Index(Maceió)`.
   - Um passageiro pesquisando `Maceió ➔ Penedo` **não** é atendido nesta publicação porque a direção do tráfego é inversa.
2. **Disponibilidade Atômica de Assentos por Segmento (`SegmentSeats`):**
   - Segmento 1: Penedo ➔ Igreja Nova
   - Segmento 2: Igreja Nova ➔ São Sebastião
   - Segmento 3: São Sebastião ➔ São Miguel dos Campos
   - Segmento 4: São Miguel dos Campos ➔ Maceió
   - Se o Passageiro A reservar `Penedo ➔ Igreja Nova`, 1 vaga fica ocupada no Segmento 1.
   - Os Segmentos 2, 3 e 4 continuam com 3 vagas livres para outro passageiro que embarque em Igreja Nova!
   - Essa técnica maximiza a taxa de ocupação do veículo e garante a integridade de assentos sem overbooking.

---

### 3. MÁQUINA DE ESTADOS DA RESERVA DE CARONA

```
[ Passageiro Solicita ]
           │
           ▼
[ Modo de Reserva da Carona ]
    ├──► Se Instantânea ─────────► [ CONFIRMADA ] ──► [ Em Viagem ] ──► [ Concluída ]
    └──► Se Manual ──────────────► [ PENDENTE ]
                                       │
                         ┌─────────────┴─────────────┐
                         ▼                           ▼
                 [ Motorista Aceita ]        [ Motorista Recusa ]
                         │                           │
                         ▼                           ▼
                   [ CONFIRMADA ]              [ RECUSADA ]
```

---

### 4. INDEPENDÊNCIA OPERACIONAL DO MOTORISTA

- **Corridas Imediatas (Sob Demanda):** O motorista só recebe ofertas se estiver **ONLINE** (com o botão verde neon ativado e geolocalização transmitindo).
- **Caronas Agendadas (Intermunicipais):** O motorista pode publicar viagens para o final de semana ou para a próxima semana a qualquer momento, mesmo estando **OFF-LINE** para corridas imediatas.
- Uma atividade não interrompe nem sobrecarrega a outra.
