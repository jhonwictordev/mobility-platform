import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Trip,
  TripStatus,
  VehicleCategory,
  DriverStatus,
  UserRole,
  ChatMessage,
} from '../database/entities';
import { isValidTransition } from '../common/utils/trip-state-machine';
import { haversineDistance, estimateTravelTime } from '../common/utils/haversine';
import { PricingService } from '../pricing/pricing.service';
import { DispatchService } from '../dispatch/dispatch.service';
import { DriversService } from '../drivers/drivers.service';
import { PaymentsService } from '../payments/payments.service';
import { MobilityWebSocketGateway } from '../websocket/websocket.gateway';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class TripsService {
  private readonly logger = new Logger(TripsService.name);

  constructor(
    @InjectRepository(Trip)
    private readonly tripRepo: Repository<Trip>,
    @InjectRepository(ChatMessage)
    private readonly chatRepo: Repository<ChatMessage>,
    private readonly pricingService: PricingService,
    private readonly dispatchService: DispatchService,
    private readonly driversService: DriversService,
    private readonly paymentsService: PaymentsService,
    private readonly wsGateway: MobilityWebSocketGateway,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Request a new trip
   */
  async requestTrip(data: {
    passengerId: string;
    originLat: number;
    originLng: number;
    originAddress: string;
    destLat: number;
    destLng: number;
    destAddress: string;
    category?: VehicleCategory;
    pinCode?: string;
  }): Promise<Trip> {
    const category = data.category || VehicleCategory.ECONOMY;
    const distanceKm = haversineDistance(
      data.originLat,
      data.originLng,
      data.destLat,
      data.destLng,
    );
    const durationMin = Math.max(1, Math.round(estimateTravelTime(distanceKm, 30)));
    const fareDetails = this.pricingService.calculateFare(
      category,
      distanceKm,
      durationMin,
    );

    const trip = this.tripRepo.create({
      passengerId: data.passengerId,
      originLat: data.originLat,
      originLng: data.originLng,
      originAddress: data.originAddress,
      destLat: data.destLat,
      destLng: data.destLng,
      destAddress: data.destAddress,
      distanceKm: Math.round(distanceKm * 100) / 100,
      durationMin,
      fare: fareDetails.totalFare,
      category,
      pinCode: data.pinCode || '4821',
      status: TripStatus.REQUESTED,
      requestedAt: new Date(),
    });

    const saved: Trip = await this.tripRepo.save(trip);

    // Transition immediately to SEARCHING
    saved.status = TripStatus.SEARCHING;
    const searchingTrip: Trip = await this.tripRepo.save(saved);

    // Notify passenger and admin
    this.wsGateway.emitToPassenger(data.passengerId, 'trip:searching', {
      tripId: searchingTrip.id,
      status: searchingTrip.status,
    });
    this.wsGateway.broadcastAdmin('admin:trip_created', searchingTrip);

    await this.auditService.log(
      'Trip',
      searchingTrip.id,
      'TRIP_REQUESTED',
      data.passengerId,
      { fare: searchingTrip.fare, category },
    );

    // Trigger dispatch asynchronously
    this.dispatchService.dispatchTrip(searchingTrip).catch((err) => {
      this.logger.error(`Dispatch failed for trip ${searchingTrip.id}: ${err.message}`);
    });

    return searchingTrip;
  }

  /**
   * Transition state safely with validation and role-based ownership checks
   */
  async updateStatus(
    tripId: string,
    newStatus: TripStatus,
    currentUser?: any,
    cancelReason?: string,
    pinCode?: string,
  ): Promise<Trip> {
    const trip = await this.tripRepo.findOne({
      where: { id: tripId },
      relations: { passenger: true, driver: { user: true, vehicles: true }, vehicle: true },
    });

    if (!trip) throw new NotFoundException('Corrida não encontrada');

    if (!isValidTransition(trip.status, newStatus)) {
      throw new BadRequestException(
        `Transição inválida de ${trip.status} para ${newStatus}`,
      );
    }

    // Role-based ownership verification
    if (currentUser) {
      const isPassenger = trip.passengerId === currentUser.userId;
      const isDriver = trip.driver && trip.driver.userId === currentUser.userId;
      const isAdmin = currentUser.role === UserRole.ADMIN;

      if (!isPassenger && !isDriver && !isAdmin) {
        throw new ForbiddenException('Não autorizado a alterar o status desta corrida');
      }

      const driverActions = [
        TripStatus.DRIVER_ARRIVING,
        TripStatus.DRIVER_ARRIVED,
        TripStatus.IN_PROGRESS,
        TripStatus.COMPLETED,
        TripStatus.CANCELLED_BY_DRIVER,
      ];
      if (driverActions.includes(newStatus) && !isDriver && !isAdmin) {
        throw new ForbiddenException('Apenas o motorista atribuído ou um administrador pode realizar esta transição');
      }

      if (newStatus === TripStatus.CANCELLED_BY_PASSENGER && !isPassenger && !isAdmin) {
        throw new ForbiddenException('Apenas o passageiro titular ou um administrador pode cancelar como passageiro');
      }
    }

    const previousStatus = trip.status;

    if (newStatus === TripStatus.IN_PROGRESS) {
      const requiredPin = trip.pinCode || '4821';
      if (!pinCode || pinCode.trim() !== requiredPin) {
        throw new BadRequestException(
          'Código PIN de segurança inválido. Confirme o código de 4 dígitos informado pelo passageiro para iniciar a viagem.',
        );
      }
      trip.startedAt = new Date();
    }

    trip.status = newStatus;

    if (newStatus === TripStatus.DRIVER_ARRIVING) {
      // Driver on way
    } else if (newStatus === TripStatus.DRIVER_ARRIVED) {
      // Driver arrived at pickup
    } else if (newStatus === TripStatus.COMPLETED) {
      trip.completedAt = new Date();

      if (trip.driverId) {
        await this.driversService.setStatus(trip.driverId, DriverStatus.ONLINE);
      }

      await this.paymentsService.processTestPayment(trip.id, Number(trip.fare || 0));
    } else if (
      newStatus === TripStatus.CANCELLED_BY_PASSENGER ||
      newStatus === TripStatus.CANCELLED_BY_DRIVER
    ) {
      trip.cancelledAt = new Date();
      trip.cancelReason = cancelReason || 'Cancelado pelo usuário';

      if (trip.driverId) {
        await this.driversService.setStatus(trip.driverId, DriverStatus.ONLINE);
      }
    }

    const saved: Trip = await this.tripRepo.save(trip);

    this.wsGateway.emitToTrip(tripId, 'trip:status_change', {
      tripId,
      status: newStatus,
      previousStatus,
    });
    this.wsGateway.emitToPassenger(trip.passengerId, `trip:${newStatus.toLowerCase()}`, saved);
    if (trip.driverId) {
      this.wsGateway.emitToDriver(trip.driverId, `trip:${newStatus.toLowerCase()}`, saved);
    }
    this.wsGateway.broadcastAdmin('admin:trip_updated', saved);

    const auditUserId = currentUser?.userId || (typeof currentUser === 'string' ? currentUser : undefined);
    await this.auditService.log(
      'Trip',
      tripId,
      `STATUS_${newStatus}`,
      auditUserId,
      { previousStatus, newStatus, cancelReason },
    );

    return saved;
  }

  async acceptTrip(tripId: string, driverId: string): Promise<Trip> {
    return this.dispatchService.acceptTrip(tripId, driverId);
  }

  async declineTrip(tripId: string, driverId: string) {
    return this.dispatchService.declineTrip(tripId, driverId);
  }

  async rateTrip(
    tripId: string,
    rating: number,
    review?: string,
  ): Promise<Trip> {
    const trip = await this.tripRepo.findOne({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Corrida não encontrada');
    if (trip.status !== TripStatus.COMPLETED) {
      throw new BadRequestException('Somente corridas finalizadas podem ser avaliadas');
    }

    trip.rating = Math.min(5, Math.max(1, rating));
    trip.review = review || null;

    const saved: Trip = await this.tripRepo.save(trip);

    if (trip.driverId) {
      const tripsWithRating = await this.tripRepo.find({
        where: { driverId: trip.driverId, status: TripStatus.COMPLETED },
      });
      const validRatings = tripsWithRating.filter((t) => t.rating != null);
      if (validRatings.length > 0) {
        const avg =
          validRatings.reduce((sum, t) => sum + (t.rating || 5), 0) /
          validRatings.length;
        const driver = await this.driversService.findById(trip.driverId);
        driver.rating = Math.round(avg * 10) / 10;
        driver.totalTrips = validRatings.length;
        await this.driversService.create(driver);
      }
    }

    return saved;
  }

  async findById(id: string): Promise<Trip> {
    const trip = await this.tripRepo.findOne({
      where: { id },
      relations: { passenger: true, driver: { user: true, vehicles: true }, vehicle: true },
    });
    if (!trip) throw new NotFoundException('Corrida não encontrada');
    return trip;
  }

  async findByPassenger(passengerId: string): Promise<Trip[]> {
    return this.tripRepo.find({
      where: { passengerId },
      order: { requestedAt: 'DESC' },
      relations: { driver: { user: true, vehicles: true }, vehicle: true },
    });
  }

  async findByDriver(driverId: string): Promise<Trip[]> {
    return this.tripRepo.find({
      where: { driverId },
      order: { requestedAt: 'DESC' },
      relations: { passenger: true, vehicle: true },
    });
  }

  async findAll(status?: TripStatus): Promise<Trip[]> {
    if (status) {
      return this.tripRepo.find({
        where: { status },
        order: { requestedAt: 'DESC' },
        relations: { passenger: true, driver: { user: true, vehicles: true }, vehicle: true },
      });
    }
    return this.tripRepo.find({
      order: { requestedAt: 'DESC' },
      relations: { passenger: true, driver: { user: true, vehicles: true }, vehicle: true },
    });
  }

  async sendChatMessage(
    tripId: string,
    senderId: string,
    senderRole: 'passenger' | 'driver' | 'admin',
    message: string,
  ): Promise<ChatMessage> {
    const trip = await this.findById(tripId);
    const chat = this.chatRepo.create({
      tripId,
      senderId,
      senderRole,
      message: message.trim(),
    });
    const saved = await this.chatRepo.save(chat);

    this.wsGateway.emitToTrip(tripId, 'chat:message', saved);
    if (senderRole === 'passenger' && trip.driverId) {
      this.wsGateway.emitToDriver(trip.driverId, 'chat:message', saved);
    } else if (senderRole === 'driver') {
      this.wsGateway.emitToPassenger(trip.passengerId, 'chat:message', saved);
    }

    return saved;
  }

  async getChatMessages(tripId: string): Promise<ChatMessage[]> {
    return this.chatRepo.find({
      where: { tripId },
      order: { createdAt: 'ASC' },
    });
  }

  async triggerSosAlert(tripId: string, triggeredBy: string, reason?: string) {
    const trip = await this.findById(tripId);

    const alertPayload = {
      tripId,
      passenger: { id: trip.passengerId, name: trip.passenger?.name, phone: trip.passenger?.phone },
      driver: trip.driver
        ? { id: trip.driver.id, name: trip.driver.user?.name, phone: trip.driver.user?.phone, vehicle: trip.driver.vehicle }
        : null,
      currentLocation: {
        origin: trip.originAddress,
        destination: trip.destAddress,
        driverLat: trip.driver?.currentLat,
        driverLng: trip.driver?.currentLng,
      },
      triggeredBy,
      reason: reason || 'Botão do Pânico (SOS) acionado durante a corrida',
      timestamp: new Date().toISOString(),
    };

    this.wsGateway.broadcastAdmin('admin:sos_alert', alertPayload);
    await this.auditService.log('Trip', tripId, 'SOS_PANIC_TRIGGERED', triggeredBy, alertPayload);

    return {
      success: true,
      alert: 'SOS Acionado. Central de Segurança SIMBORA Alagoas notificada.',
      emergencyContacts: {
        police: '190',
        samu: '192',
        firefighters: '193',
        simboraSafetyDesk: '+55 82 3551-0000',
      },
    };
  }

  async count(): Promise<number> {
    return this.tripRepo.count();
  }

  async countActive(): Promise<number> {
    return this.tripRepo.count({
      where: [
        { status: TripStatus.SEARCHING },
        { status: TripStatus.ACCEPTED },
        { status: TripStatus.DRIVER_ARRIVING },
        { status: TripStatus.DRIVER_ARRIVED },
        { status: TripStatus.IN_PROGRESS },
      ],
    });
  }
}
