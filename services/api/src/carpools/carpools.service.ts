import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CarpoolTrip,
  CarpoolReservation,
  CarpoolAlert,
  CarpoolMessage,
  CarpoolReview,
  CarpoolRecurringSchedule,
  CarpoolFinancialTransaction,
  CarpoolStatus,
  BookingMode,
  ReservationStatus,
  LuggageSize,
} from '../database/entities';
import { MobilityWebSocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class CarpoolsService implements OnModuleInit {
  constructor(
    @InjectRepository(CarpoolTrip)
    private readonly carpoolRepo: Repository<CarpoolTrip>,
    @InjectRepository(CarpoolReservation)
    private readonly resRepo: Repository<CarpoolReservation>,
    @InjectRepository(CarpoolAlert)
    private readonly alertRepo: Repository<CarpoolAlert>,
    @InjectRepository(CarpoolMessage)
    private readonly msgRepo: Repository<CarpoolMessage>,
    @InjectRepository(CarpoolReview)
    private readonly reviewRepo: Repository<CarpoolReview>,
    @InjectRepository(CarpoolRecurringSchedule)
    private readonly scheduleRepo: Repository<CarpoolRecurringSchedule>,
    @InjectRepository(CarpoolFinancialTransaction)
    private readonly finRepo: Repository<CarpoolFinancialTransaction>,
    private readonly wsGateway: MobilityWebSocketGateway,
  ) {}


  async onModuleInit() {
    await this.seedDefaultCarpools();
  }

  private async seedDefaultCarpools() {
    const count = await this.carpoolRepo.count();
    if (count === 0) {
      // Seed classic Alagoas Carpools
      const defaultCarpool = this.carpoolRepo.create({
        id: 'cp_piacabucu_penedo_sample',
        driverId: 'carlos-oliveira',
        driverName: 'Carlos Oliveira',
        vehicleModel: 'Fiat Cronos Precision 1.3 AT',
        vehiclePlate: 'QTT-4A82',
        originCity: 'Piaçabuçu',
        originAddress: 'Praça São Francisco de Borja, 100',
        destinationCity: 'Penedo',
        destinationAddress: 'Centro Histórico / Cais do São Francisco',
        departureDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        departureTime: '07:30',
        estimatedDurationMin: 32,
        totalSeats: 3,
        availableSeats: 3,
        pricePerSeat: 25.0,
        bookingMode: BookingMode.MANUAL,
        status: CarpoolStatus.PUBLISHED,
        notes: 'Saída pontual na frente da matriz. Ar-condicionado ligado e porta-malas livre.',
        intermediateStopsJson: JSON.stringify([
          { cityName: 'Pontal do Peba', stopName: 'Trevo do Peba', price: 12.0 },
        ]),
        luggageSize: LuggageSize.MEDIUM,
        allowSmoking: false,
        allowPets: false,
        hasAirConditioning: true,
      });

      const maceioCarpool = this.carpoolRepo.create({
        id: 'cp_penedo_maceio_sample',
        driverId: 'carlos-oliveira',
        driverName: 'Carlos Oliveira',
        vehicleModel: 'Fiat Cronos Precision 1.3 AT',
        vehiclePlate: 'QTT-4A82',
        originCity: 'Penedo',
        originAddress: 'Avenida Beira Rio, 50',
        destinationCity: 'Maceió',
        destinationAddress: 'Terminal Rodoviário / Centro',
        departureDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        departureTime: '06:00',
        estimatedDurationMin: 120,
        totalSeats: 3,
        availableSeats: 3,
        pricePerSeat: 45.0,
        bookingMode: BookingMode.INSTANT,
        status: CarpoolStatus.PUBLISHED,
        notes: 'Viagem tranquila via AL-101 Sul. Paradas em São Miguel dos Campos.',
        intermediateStopsJson: JSON.stringify([
          { cityName: 'Igreja Nova', stopName: 'Entrada da Cidade', price: 15.0 },
          { cityName: 'São Miguel dos Campos', stopName: 'Posto Trevo', price: 30.0 },
        ]),
        luggageSize: LuggageSize.LARGE,
        allowSmoking: false,
        allowPets: false,
        hasAirConditioning: true,
      });

      await this.carpoolRepo.save([defaultCarpool, maceioCarpool]);
      console.log('[CarpoolsService] Seeded default Alagoas Carpools.');
    }
  }

  // 1. Create / Publish Carpool
  async createCarpool(data: any): Promise<CarpoolTrip> {
    const totalSeats = Number(data.totalSeats) || 3;
    const pricePerSeat = Number(data.pricePerSeat) || 25.0;

    const carpool = this.carpoolRepo.create({
      driverId: data.driverId || 'carlos-oliveira',
      driverName: data.driverName || 'Carlos Oliveira',
      vehicleModel: data.vehicleModel || 'Fiat Cronos Precision 2023',
      vehiclePlate: data.vehiclePlate || 'QTT-4A82',
      originCity: data.originCity,
      originAddress: data.originAddress || '',
      destinationCity: data.destinationCity,
      destinationAddress: data.destinationAddress || '',
      departureDate: data.departureDate,
      departureTime: data.departureTime,
      estimatedDurationMin: Number(data.estimatedDurationMin) || 35,
      totalSeats: totalSeats,
      availableSeats: totalSeats,
      pricePerSeat: pricePerSeat,
      bookingMode: data.bookingMode === 'INSTANT' ? BookingMode.INSTANT : BookingMode.MANUAL,
      status: CarpoolStatus.PUBLISHED,
      notes: data.notes || '',
      intermediateStopsJson: typeof data.intermediateStops === 'string' ? data.intermediateStops : JSON.stringify(data.intermediateStops || []),
      luggageSize: data.luggageSize || LuggageSize.MEDIUM,
      allowSmoking: !!data.allowSmoking,
      allowPets: !!data.allowPets,
      hasAirConditioning: data.hasAirConditioning !== false,
    });

    const saved = await this.carpoolRepo.save(carpool);

    // Notify connected clients via WebSocket
    this.wsGateway.broadcastEvent('carpool:published', {
      carpoolId: saved.id,
      origin: saved.originCity,
      destination: saved.destinationCity,
      date: saved.departureDate,
      time: saved.departureTime,
      driverName: saved.driverName,
      price: saved.pricePerSeat,
      seats: saved.availableSeats,
    });

    return saved;
  }

  // 2. Search Carpools (with Waypoints / Intermediate City matching)
  async searchCarpools(params: {
    origin?: string;
    destination?: string;
    date?: string;
    seats?: number;
  }): Promise<{ total: number; carpools: any[] }> {
    const query = this.carpoolRepo.createQueryBuilder('cp')
      .where('cp.status = :status', { status: CarpoolStatus.PUBLISHED })
      .andWhere('cp.availableSeats >= :seats', { seats: Number(params.seats) || 1 });

    if (params.date) {
      query.andWhere('cp.departureDate = :date', { date: params.date });
    }

    const allPublished = await query.getMany();

    // Filter using route matching (direct or intermediate stops)
    const reqOrigin = (params.origin || '').toLowerCase().trim();
    const reqDest = (params.destination || '').toLowerCase().trim();

    const matches = allPublished.filter((cp) => {
      const stops: Array<{ cityName: string }> = cp.intermediateStopsJson ? JSON.parse(cp.intermediateStopsJson) : [];
      const fullRoute = [cp.originCity.toLowerCase(), ...stops.map(s => s.cityName.toLowerCase()), cp.destinationCity.toLowerCase()];

      if (!reqOrigin && !reqDest) return true;

      const originIdx = reqOrigin ? fullRoute.findIndex(c => c.includes(reqOrigin) || reqOrigin.includes(c)) : 0;
      const destIdx = reqDest ? fullRoute.findIndex(c => c.includes(reqDest) || reqDest.includes(c)) : fullRoute.length - 1;

      if (originIdx !== -1 && destIdx !== -1 && originIdx < destIdx) {
        return true;
      }
      return false;
    });

    return {
      total: matches.length,
      carpools: matches.map((m) => ({
        ...m,
        intermediateStops: m.intermediateStopsJson ? JSON.parse(m.intermediateStopsJson) : [],
        driver: {
          id: m.driverId,
          name: m.driverName,
          rating: 4.98,
          isVerified: true,
          completedTrips: 1420,
        },
        vehicle: {
          model: m.vehicleModel,
          plate: m.vehiclePlate,
        },
      })),
    };
  }

  // 3. Get Carpool by ID
  async getCarpoolById(id: string): Promise<any> {
    const cp = await this.carpoolRepo.findOne({ where: { id } });
    if (!cp) throw new NotFoundException('Carona não encontrada');

    const reservations = await this.resRepo.find({ where: { carpoolTripId: id } });
    const messages = await this.msgRepo.find({ where: { carpoolTripId: id }, order: { sentAt: 'ASC' } });

    return {
      ...cp,
      intermediateStops: cp.intermediateStopsJson ? JSON.parse(cp.intermediateStopsJson) : [],
      reservations,
      messages,
      driver: {
        id: cp.driverId,
        name: cp.driverName,
        rating: 4.98,
        isVerified: true,
        completedTrips: 1420,
      },
    };
  }

  // 4. Create Reservation Request
  async requestReservation(carpoolId: string, dto: any): Promise<CarpoolReservation> {
    const cp = await this.carpoolRepo.findOne({ where: { id: carpoolId } });
    if (!cp) throw new NotFoundException('Carona não encontrada');

    const seats = Number(dto.seatsCount) || 1;
    if (cp.availableSeats < seats) {
      throw new BadRequestException('Não há assentos suficientes disponíveis nesta carona');
    }

    const isInstant = cp.bookingMode === BookingMode.INSTANT;
    const initialStatus = isInstant ? ReservationStatus.ACCEPTED : ReservationStatus.PENDING;

    const reservation = this.resRepo.create({
      carpoolTripId: carpoolId,
      passengerId: dto.passengerId || 'marina-silva',
      passengerName: dto.passengerName || 'Marina Silva',
      passengerPhone: dto.passengerPhone || '(82) 99876-5432',
      pickupCity: dto.pickupCity || cp.originCity,
      dropoffCity: dto.dropoffCity || cp.destinationCity,
      seatsCount: seats,
      totalPrice: seats * cp.pricePerSeat,
      status: initialStatus,
      passengerNotes: dto.passengerNotes || '',
    });

    const saved = await this.resRepo.save(reservation);

    if (isInstant) {
      cp.availableSeats -= seats;
      await this.carpoolRepo.save(cp);
    }

    // Emit WebSocket event
    this.wsGateway.broadcastEvent('carpool:reservation_requested', {
      reservationId: saved.id,
      carpoolId: cp.id,
      driverId: cp.driverId,
      passengerName: saved.passengerName,
      seats: saved.seatsCount,
      totalPrice: saved.totalPrice,
      isInstant: isInstant,
    });

    return saved;
  }

  // 5. Accept Reservation (Driver)
  async acceptReservation(reservationId: string, driverId?: string): Promise<CarpoolReservation> {
    const res = await this.resRepo.findOne({ where: { id: reservationId } });
    if (!res) throw new NotFoundException('Reserva não encontrada');

    if (res.status === ReservationStatus.ACCEPTED) {
      return res;
    }

    const cp = await this.carpoolRepo.findOne({ where: { id: res.carpoolTripId } });
    if (!cp) throw new NotFoundException('Carona associada não encontrada');

    if (cp.availableSeats < res.seatsCount) {
      throw new BadRequestException('Assentos esgotados para esta confirmação');
    }

    res.status = ReservationStatus.ACCEPTED;
    await this.resRepo.save(res);

    cp.availableSeats -= res.seatsCount;
    await this.carpoolRepo.save(cp);

    // Emit event
    this.wsGateway.broadcastEvent('carpool:reservation_confirmed', {
      reservationId: res.id,
      carpoolId: cp.id,
      passengerId: res.passengerId,
      passengerName: res.passengerName,
      remainingSeats: cp.availableSeats,
    });

    return res;
  }

  // 6. Reject Reservation (Driver)
  async rejectReservation(reservationId: string, reason?: string): Promise<CarpoolReservation> {
    const res = await this.resRepo.findOne({ where: { id: reservationId } });
    if (!res) throw new NotFoundException('Reserva não encontrada');

    res.status = ReservationStatus.REJECTED;
    res.rejectionReason = reason || 'O condutor não pôde aceitar a solicitação';
    await this.resRepo.save(res);

    this.wsGateway.broadcastEvent('carpool:reservation_rejected', {
      reservationId: res.id,
      passengerId: res.passengerId,
      reason: res.rejectionReason,
    });

    return res;
  }

  // 7. Cancel Reservation
  async cancelReservation(reservationId: string): Promise<CarpoolReservation> {
    const res = await this.resRepo.findOne({ where: { id: reservationId } });
    if (!res) throw new NotFoundException('Reserva não encontrada');

    if (res.status === ReservationStatus.ACCEPTED) {
      const cp = await this.carpoolRepo.findOne({ where: { id: res.carpoolTripId } });
      if (cp) {
        cp.availableSeats += res.seatsCount;
        await this.carpoolRepo.save(cp);
      }
    }

    res.status = ReservationStatus.CANCELLED;
    return this.resRepo.save(res);
  }

  // 8. Driver: Start Carpool Trip
  async startCarpool(carpoolId: string): Promise<CarpoolTrip> {
    const cp = await this.carpoolRepo.findOne({ where: { id: carpoolId } });
    if (!cp) throw new NotFoundException('Carona não encontrada');

    cp.status = CarpoolStatus.IN_PROGRESS;
    const saved = await this.carpoolRepo.save(cp);

    this.wsGateway.broadcastEvent('carpool:started', {
      carpoolId: cp.id,
      origin: cp.originCity,
      destination: cp.destinationCity,
    });

    return saved;
  }

  // 9. Driver: Complete Carpool Trip
  async completeCarpool(carpoolId: string): Promise<any> {
    const cp = await this.carpoolRepo.findOne({ where: { id: carpoolId } });
    if (!cp) throw new NotFoundException('Carona não encontrada');

    cp.status = CarpoolStatus.COMPLETED;
    await this.carpoolRepo.save(cp);

    // Calculate simulated cost-sharing payout
    const confirmedRes = await this.resRepo.find({
      where: { carpoolTripId: carpoolId, status: ReservationStatus.ACCEPTED },
    });

    const grossTotal = confirmedRes.reduce((acc, r) => acc + r.totalPrice, 0);
    const serviceFee = grossTotal * 0.15;
    const driverNet = grossTotal - serviceFee;

    // Create financial transaction record
    const fin = this.finRepo.create({
      carpoolTripId: carpoolId,
      reservationId: confirmedRes[0]?.id || 'res_payout',
      payerId: 'simbora_escrow',
      receiverId: cp.driverId,
      grossAmount: grossTotal,
      serviceFee: serviceFee,
      netAmount: driverNet,
      paymentMethod: 'PIX_SIMULATED',
      status: 'CREDITED_VIA_PIX',
    });
    await this.finRepo.save(fin);

    this.wsGateway.broadcastEvent('carpool:completed', {
      carpoolId: cp.id,
      grossTotal,
      driverNet,
      passengersCount: confirmedRes.length,
    });

    return {
      carpoolId: cp.id,
      status: 'COMPLETED',
      grossTotal,
      serviceFee,
      driverNet,
      payoutStatus: 'CREDITED_VIA_PIX',
    };
  }

  // 10. List Carpools for Driver
  async getDriverCarpools(driverId: string): Promise<any[]> {
    const trips = await this.carpoolRepo.find({
      where: { driverId },
      order: { createdAt: 'DESC' },
    });

    const result: any[] = [];
    for (const t of trips) {
      const reservations = await this.resRepo.find({ where: { carpoolTripId: t.id } });
      result.push({
        ...t,
        intermediateStops: t.intermediateStopsJson ? JSON.parse(t.intermediateStopsJson) : [],
        reservations,
      });
    }
    return result;
  }

  // 11. List Passenger Reservations
  async getPassengerReservations(passengerId: string): Promise<any[]> {
    const reservations = await this.resRepo.find({
      where: { passengerId },
      order: { createdAt: 'DESC' },
    });

    const result: any[] = [];
    for (const r of reservations) {

      const trip = await this.carpoolRepo.findOne({ where: { id: r.carpoolTripId } });
      result.push({
        ...r,
        trip,
      });
    }
    return result;
  }

  // 12. Carpool Messages (Chat)
  async getMessages(carpoolId: string): Promise<CarpoolMessage[]> {
    return this.msgRepo.find({
      where: { carpoolTripId: carpoolId },
      order: { sentAt: 'ASC' },
    });
  }

  async sendMessage(carpoolId: string, dto: any): Promise<CarpoolMessage> {
    const msg = this.msgRepo.create({
      carpoolTripId: carpoolId,
      senderId: dto.senderId || 'marina-silva',
      senderName: dto.senderName || 'Marina Silva',
      message: dto.message,
    });
    const saved = await this.msgRepo.save(msg);

    this.wsGateway.broadcastEvent('carpool:message', {
      carpoolId,
      message: saved,
    });

    return saved;
  }

  // 13. Carpool Alerts
  async createAlert(dto: any): Promise<CarpoolAlert> {
    const alert = this.alertRepo.create({
      passengerId: dto.passengerId || 'marina-silva',
      originCity: dto.originCity,
      destinationCity: dto.destinationCity,
      desiredDate: dto.desiredDate,
      seatsNeeded: Number(dto.seatsNeeded) || 1,
      isActive: true,
    });
    return this.alertRepo.save(alert);
  }

  async getPassengerAlerts(passengerId: string): Promise<CarpoolAlert[]> {
    return this.alertRepo.find({
      where: { passengerId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  // 14. Reviews
  async createReview(carpoolId: string, dto: any): Promise<CarpoolReview> {
    const review = this.reviewRepo.create({
      carpoolTripId: carpoolId,
      reviewerId: dto.reviewerId,
      reviewedUserId: dto.reviewedUserId,
      rating: Number(dto.rating) || 5,
      comment: dto.comment || '',
    });
    return this.reviewRepo.save(review);
  }

  // 15. Admin Summary Metrics
  async getAdminCarpoolMetrics(): Promise<any> {
    const totalCarpools = await this.carpoolRepo.count();
    const activeCarpools = await this.carpoolRepo.count({ where: { status: CarpoolStatus.PUBLISHED } });
    const inProgress = await this.carpoolRepo.count({ where: { status: CarpoolStatus.IN_PROGRESS } });
    const completed = await this.carpoolRepo.count({ where: { status: CarpoolStatus.COMPLETED } });
    const totalReservations = await this.resRepo.count();
    const confirmedReservations = await this.resRepo.count({ where: { status: ReservationStatus.ACCEPTED } });
    const pendingReservations = await this.resRepo.count({ where: { status: ReservationStatus.PENDING } });

    return {
      totalCarpools,
      activeCarpools,
      inProgress,
      completed,
      totalReservations,
      confirmedReservations,
      pendingReservations,
      occupancyRatePct: totalCarpools > 0 ? Math.round((confirmedReservations / (totalCarpools * 3)) * 100) : 0,
      topRoutes: [
        { route: 'Penedo ➔ Maceió', count: 18, avgPrice: 45.0 },
        { route: 'Piaçabuçu ➔ Penedo', count: 14, avgPrice: 25.0 },
        { route: 'Arapiraca ➔ Maceió', count: 12, avgPrice: 40.0 },
      ],
    };
  }
}
