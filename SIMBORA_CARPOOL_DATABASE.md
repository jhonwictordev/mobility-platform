# MODELO DE DADOS E ESQUEMA DO BANCO (CARPOOL DATABASE)
## SIMBORA 4.0 — Estruturas de Banco de Dados Relacional (SQLite / TypeORM)

Este documento define o esquema das tabelas integradas ao banco de dados `mobility.sqlite` para suportar o módulo de Caronas Intermunicipais sem conflitar com o esquema de Corridas sob demanda.

---

### 1. DIAGRAMA ENTIDADE-RELACIONAMENTO

```
┌──────────────┐          ┌───────────────────┐          ┌─────────────────────────┐
│     User     │◄─────────┤    CarpoolTrip    ├─────────►│         Vehicle         │
└──────┬───────┘          └─────────┬─────────┘          └─────────────────────────┘
       │                            │
       │                            ├──► CarpoolStops (1:N)
       │                            ├──► CarpoolSegments (1:N)
       │                            ├──► CarpoolPreferences (1:1)
       │                            ├──► CarpoolMessages (1:N)
       │                            ├──► CarpoolReviews (1:N)
       │                            └──► CarpoolFinancialTransactions (1:N)
       ▼
┌──────────────────────┐
│  CarpoolReservation  │
└──────────┬───────────┘
           │
           └──► CarpoolPassengers (1:N)
```

---

### 2. DEFINIÇÃO DETALHADA DAS TABELAS

#### 2.1 `CarpoolTrip` (Viagens de Carona Publicadas)
- `id`: string (UUID / CUID, Primary Key)
- `driverId`: string (FK -> User.id / Driver.id)
- `vehicleId`: string (FK -> Vehicle.id)
- `originCity`: string (ex: "Piaçabuçu", "Penedo", "Maceió")
- `originAddress`: string (ex: "Praça São Francisco de Borja, 100")
- `originLat`: float
- `originLng`: float
- `destinationCity`: string (ex: "Penedo", "Maceió", "Arapiraca")
- `destinationAddress`: string (ex: "Centro Histórico / Cais do São Francisco")
- `destinationLat`: float
- `destinationLng`: float
- `departureDate`: string (ISO 8601: YYYY-MM-DD)
- `departureTime`: string (HH:MM)
- `estimatedDurationMin`: integer
- `totalSeats`: integer (1 a 4)
- `availableSeats`: integer (assentos restantes)
- `pricePerSeat`: decimal(10,2) (valor de contribuição por assento)
- `bookingMode`: enum ('INSTANT', 'MANUAL')
- `status`: enum ('PUBLISHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')
- `notes`: text (observações do condutor)
- `createdAt`: datetime
- `updatedAt`: datetime

#### 2.2 `CarpoolStop` (Paradas Intermediárias)
- `id`: string (PK)
- `carpoolTripId`: string (FK -> CarpoolTrip.id)
- `cityName`: string
- `stopName`: string (ex: "Trevo de Igreja Nova", "Posto São Miguel")
- `stopLat`: float
- `stopLng`: float
- `sequenceOrder`: integer (0 = origem, 1 = parada 1, ..., N = destino)
- `estimatedTime`: string (HH:MM)
- `priceFromOrigin`: decimal(10,2)

#### 2.3 `CarpoolSegment` (Controle de Assentos por Trecho)
- `id`: string (PK)
- `carpoolTripId`: string (FK -> CarpoolTrip.id)
- `fromStopIndex`: integer
- `toStopIndex`: integer
- `fromCity`: string
- `toCity`: string
- `availableSeats`: integer
- `segmentPrice`: decimal(10,2)

#### 2.4 `CarpoolReservation` (Reservas Solicitadas por Passageiros)
- `id`: string (PK)
- `carpoolTripId`: string (FK -> CarpoolTrip.id)
- `passengerId`: string (FK -> User.id)
- `pickupStopId`: string (FK -> CarpoolStop.id)
- `dropoffStopId`: string (FK -> CarpoolStop.id)
- `seatsCount`: integer (ex: 1, 2)
- `totalPrice`: decimal(10,2)
- `status`: enum ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED')
- `passengerNotes`: text
- `rejectionReason`: text
- `createdAt`: datetime
- `updatedAt`: datetime

#### 2.5 `CarpoolPassenger` (Passageiros Vinculados à Reserva)
- `id`: string (PK)
- `reservationId`: string (FK -> CarpoolReservation.id)
- `fullName`: string
- `documentNumber`: string
- `isPrimaryBooker`: boolean

#### 2.6 `CarpoolPreference` (Regras de Bordo)
- `id`: string (PK)
- `carpoolTripId`: string (FK -> CarpoolTrip.id)
- `luggageSize`: enum ('NONE', 'SMALL', 'MEDIUM', 'LARGE')
- `allowSmoking`: boolean (default false)
- `allowPets`: boolean (default false)
- `hasAirConditioning`: boolean (default true)
- `chatLevel`: enum ('QUIET', 'FRIENDLY', 'TALKATIVE')

#### 2.7 `CarpoolMessage` (Chat da Carona)
- `id`: string (PK)
- `carpoolTripId`: string (FK -> CarpoolTrip.id)
- `senderId`: string (FK -> User.id)
- `senderName`: string
- `message`: text
- `sentAt`: datetime
- `isRead`: boolean

#### 2.8 `CarpoolReview` (Avaliações Mútuas Pós-Viagem)
- `id`: string (PK)
- `carpoolTripId`: string (FK -> CarpoolTrip.id)
- `reviewerId`: string (FK -> User.id)
- `reviewedUserId`: string (FK -> User.id)
- `role`: enum ('DRIVER_TO_PASSENGER', 'PASSENGER_TO_DRIVER')
- `rating`: integer (1 a 5)
- `comment`: text
- `createdAt`: datetime

#### 2.9 `CarpoolAlert` (Alertas de Viagens Solicitadas)
- `id`: string (PK)
- `passengerId`: string (FK -> User.id)
- `originCity`: string
- `destinationCity`: string
- `desiredDate`: string (YYYY-MM-DD)
- `desiredTime`: string
- `seatsNeeded`: integer
- `isActive`: boolean
- `createdAt`: datetime

#### 2.10 `CarpoolRecurringSchedule` (Viagens Recorrentes)
- `id`: string (PK)
- `driverId`: string (FK -> User.id)
- `originCity`: string
- `destinationCity`: string
- `departureTime`: string (HH:MM)
- `daysOfWeek`: string (ex: "MON,WED,FRI")
- `validFrom`: date
- `validUntil`: date
- `seats`: integer
- `pricePerSeat`: decimal(10,2)
- `isActive`: boolean

#### 2.11 `CarpoolFinancialTransaction` (Auditoria Financeira)
- `id`: string (PK)
- `carpoolTripId`: string
- `reservationId`: string
- `payerId`: string
- `receiverId`: string
- `grossAmount`: decimal(10,2)
- `serviceFee`: decimal(10,2)
- `netAmount`: decimal(10,2)
- `paymentMethod`: string (ex: "PIX_SIMULATED")
- `status`: enum ('HELD_IN_ESCROW', 'RELEASED_TO_DRIVER', 'REFUNDED')
- `createdAt`: datetime
