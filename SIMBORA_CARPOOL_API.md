# ESPECIFICAÇÃO DE APIS E WEBSOCKETS (CARPOOL API)
## SIMBORA 4.0 — Endpoints REST e Eventos em Tempo Real

---

### 1. ENDPOINTS REST

#### 1.1 Publicar Nova Carona (Condutor)
- **Método:** `POST`
- **Rota:** `/carpools`
- **Payload:**
```json
{
  "driverId": "carlos-oliveira",
  "vehicleId": "fiat-cronos-qtt4a82",
  "originCity": "Piaçabuçu",
  "originAddress": "Praça São Francisco de Borja, 100",
  "destinationCity": "Penedo",
  "destinationAddress": "Centro Histórico / Cais do São Francisco",
  "departureDate": "2026-11-02",
  "departureTime": "07:30",
  "totalSeats": 3,
  "pricePerSeat": 25.00,
  "bookingMode": "MANUAL",
  "intermediateStops": [
    { "cityName": "Pontal do Peba", "stopName": "Trevo do Peba", "sequenceOrder": 1, "priceFromOrigin": 10.00 }
  ],
  "preferences": {
    "luggageSize": "MEDIUM",
    "allowSmoking": false,
    "allowPets": false,
    "hasAirConditioning": true,
    "chatLevel": "FRIENDLY"
  },
  "notes": "Saída pontual na frente da igreja matriz. Ar-condicionado ligado."
}
```
- **Resposta (201 Created):**
```json
{
  "id": "cp_pia_pen_001",
  "status": "PUBLISHED",
  "availableSeats": 3,
  "message": "Carona publicada com sucesso no SIMBORA Alagoas!"
}
```

---

#### 1.2 Pesquisar Caronas Disponíveis (Passageiro)
- **Método:** `GET`
- **Rota:** `/carpools/search?origin=Piaçabuçu&destination=Penedo&date=2026-11-02&seats=1`
- **Resposta (200 OK):**
```json
{
  "total": 1,
  "carpools": [
    {
      "id": "cp_pia_pen_001",
      "driver": {
        "id": "carlos-oliveira",
        "name": "Carlos Oliveira",
        "avatar": "CO",
        "rating": 4.98,
        "isVerified": true,
        "completedTrips": 1420
      },
      "vehicle": {
        "model": "Fiat Cronos Precision 1.3 AT",
        "color": "Prata",
        "plate": "QTT-4A82"
      },
      "originCity": "Piaçabuçu",
      "originAddress": "Praça São Francisco de Borja",
      "destinationCity": "Penedo",
      "destinationAddress": "Centro Histórico / Cais",
      "departureDate": "2026-11-02",
      "departureTime": "07:30",
      "estimatedDurationMin": 32,
      "pricePerSeat": 25.00,
      "availableSeats": 3,
      "bookingMode": "MANUAL",
      "intermediateStops": ["Trevo do Peba"],
      "hasAirConditioning": true,
      "luggageSize": "MEDIUM"
    }
  ]
}
```

---

#### 1.3 Solicitar Reserva de Assento (Passageiro)
- **Método:** `POST`
- **Rota:** `/carpools/:id/reservations`
- **Payload:**
```json
{
  "passengerId": "marina-silva",
  "passengerName": "Marina Silva",
  "seatsCount": 1,
  "pickupCity": "Piaçabuçu",
  "dropoffCity": "Penedo",
  "passengerNotes": "Estarei com uma mochila média."
}
```
- **Resposta (201 Created):**
```json
{
  "reservationId": "res_cp_001_marina",
  "status": "PENDING",
  "seatsCount": 1,
  "totalPrice": 25.00,
  "bookingMode": "MANUAL",
  "message": "Solicitação enviada ao condutor Carlos Oliveira. Aguardando aprovação."
}
```

---

#### 1.4 Aprovar Reserva (Condutor)
- **Método:** `POST`
- **Rota:** `/carpool-reservations/:id/accept`
- **Payload:** `{ "driverId": "carlos-oliveira" }`
- **Resposta (200 OK):**
```json
{
  "reservationId": "res_cp_001_marina",
  "status": "ACCEPTED",
  "availableSeatsRemaining": 2,
  "message": "Reserva confirmada com sucesso!"
}
```

---

#### 1.5 Recusar Reserva (Condutor)
- **Método:** `POST`
- **Rota:** `/carpool-reservations/:id/reject`
- **Payload:** `{ "driverId": "carlos-oliveira", "reason": "Veículo já sem espaço no porta-malas" }`

---

#### 1.6 Iniciar Viagem de Carona (Condutor)
- **Método:** `POST`
- **Rota:** `/carpools/:id/start`

---

#### 1.7 Finalizar Viagem de Carona & Repasse Financeiro (Condutor)
- **Método:** `POST`
- **Rota:** `/carpools/:id/complete`
- **Resposta (200 OK):**
```json
{
  "carpoolId": "cp_pia_pen_001",
  "status": "COMPLETED",
  "grossTotal": 25.00,
  "platformFee": 3.75,
  "driverNet": 21.25,
  "payoutStatus": "CREDITED_VIA_PIX"
}
```

---

#### 1.8 Cadastrar Alerta de Carona (Passageiro)
- **Método:** `POST`
- **Rota:** `/carpool-alerts`
- **Payload:**
```json
{
  "passengerId": "marina-silva",
  "originCity": "Penedo",
  "destinationCity": "Maceió",
  "desiredDate": "2026-11-05",
  "seatsNeeded": 1
}
```

---

### 2. EVENTOS WEBSOCKET EM TEMPO REAL

O gateway de WebSocket (`/events`) emite e escuta os seguintes tópicos de carona:

| Evento | Emitido por | Recebido por | Descrição |
| :--- | :--- | :--- | :--- |
| `carpool:published` | Backend | Todos os passageiros | Nova viagem cadastrada compatível com alertas. |
| `carpool:reservation_requested` | Passageiro | Condutor da carona | Notificação de solicitação de assento para aprovação. |
| `carpool:reservation_confirmed` | Condutor | Passageiro que reservou | Notificação com confirmação e ponto de encontro. |
| `carpool:reservation_rejected` | Condutor | Passageiro | Notificação de recusa com motivo. |
| `carpool:started` | Condutor | Todos os passageiros confirmados | Condutor iniciou a rota no ponto de partida. |
| `carpool:completed` | Condutor | Todos os passageiros | Viagem finalizada com liberação de avaliação mútua. |
| `carpool:message` | Qualquer participante | Participantes da carona | Nova mensagem no chat da viagem. |
