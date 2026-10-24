import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Driver,
  DriverStatus,
  Trip,
  TripStatus,
  VehicleCategory,
} from '../database/entities';
import { DriversService } from '../drivers/drivers.service';
import { MobilityWebSocketGateway } from '../websocket/websocket.gateway';
import { haversineDistance } from '../common/utils/haversine';
import { AuditService } from '../audit/audit.service';

interface DispatchOffer {
  tripId: string;
  driverId: string;
  offeredAt: number;
  timeoutHandle: any;
}

@Injectable()
export class DispatchService {
  private readonly logger = new Logger(DispatchService.name);

  // In-memory atomic locking structures
  private activeOffers = new Map<string, DispatchOffer>(); // tripId -> offer
  private driverPendingOffers = new Set<string>(); // driverId set
  private tripLocks = new Set<string>(); // tripId set for atomic acceptance

  constructor(
    @InjectRepository(Trip)
    private readonly tripRepo: Repository<Trip>,
    private readonly driversService: DriversService,
    private readonly wsGateway: MobilityWebSocketGateway,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Find nearest available drivers filtered by category
   */
  async findEligibleDrivers(
    originLat: number,
    originLng: number,
    category: VehicleCategory,
    radiusKm = 10,
  ): Promise<Array<{ driver: Driver; distanceKm: number }>> {
    const onlineDrivers = await this.driversService.findOnlineDrivers();

    const eligible: Array<{ driver: Driver; distanceKm: number }> = [];

    for (const driver of onlineDrivers) {
      if (this.driverPendingOffers.has(driver.id)) continue;
      if (driver.status !== DriverStatus.ONLINE) continue;
      if (driver.currentLat == null || driver.currentLng == null) continue;

      const primaryVehicle = driver.vehicle;
      if (primaryVehicle && primaryVehicle.category !== category) {
        if (category !== VehicleCategory.ECONOMY) {
          continue;
        }
      }

      const dist = haversineDistance(
        originLat,
        originLng,
        driver.currentLat,
        driver.currentLng,
      );

      if (dist <= radiusKm) {
        eligible.push({ driver, distanceKm: dist });
      }
    }

    return eligible.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  /**
   * Start dispatching a trip to drivers
   */
  async dispatchTrip(trip: Trip): Promise<boolean> {
    this.logger.log(`Starting dispatch for trip ${trip.id}`);

    const eligible = await this.findEligibleDrivers(
      trip.originLat,
      trip.originLng,
      trip.category,
    );

    if (eligible.length === 0) {
      this.logger.warn(`No eligible drivers found for trip ${trip.id}`);
      return false;
    }

    const target = eligible[0];
    return this.offerTripToDriver(trip, target.driver, eligible.slice(1));
  }

  private offerTripToDriver(
    trip: Trip,
    driver: Driver,
    remainingQueue: Array<{ driver: Driver; distanceKm: number }>,
  ): boolean {
    this.driverPendingOffers.add(driver.id);

    const payload = {
      tripId: trip.id,
      passengerId: trip.passengerId,
      originAddress: trip.originAddress,
      destAddress: trip.destAddress,
      originLat: trip.originLat,
      originLng: trip.originLng,
      destLat: trip.destLat,
      destLng: trip.destLng,
      fare: trip.fare,
      category: trip.category,
      timeoutSeconds: 25,
    };

    this.wsGateway.emitToDriver(driver.id, 'driver:trip_request', payload);

    const timeoutHandle = setTimeout(async () => {
      this.logger.log(`Driver ${driver.id} timeout on trip ${trip.id}`);
      this.releaseDriverOffer(driver.id, trip.id);

      const currentTrip = await this.tripRepo.findOne({ where: { id: trip.id } });
      if (currentTrip && currentTrip.status === TripStatus.SEARCHING) {
        if (remainingQueue.length > 0) {
          const next = remainingQueue[0];
          this.offerTripToDriver(trip, next.driver, remainingQueue.slice(1));
        } else {
          this.wsGateway.emitToPassenger(trip.passengerId, 'trip:expired', {
            tripId: trip.id,
            message: 'Nenhum motorista disponível no momento. Tente novamente.',
          });
          currentTrip.status = TripStatus.EXPIRED;
          await this.tripRepo.save(currentTrip);
        }
      }
    }, 25000);

    this.activeOffers.set(trip.id, {
      tripId: trip.id,
      driverId: driver.id,
      offeredAt: Date.now(),
      timeoutHandle,
    });

    return true;
  }

  async acceptTrip(tripId: string, driverId: string): Promise<Trip> {
    if (this.tripLocks.has(tripId)) {
      throw new Error('Esta corrida já está sendo processada por outro motorista');
    }
    this.tripLocks.add(tripId);

    try {
      const trip = await this.tripRepo.findOne({
        where: { id: tripId },
        relations: { passenger: true },
      });

      if (!trip) throw new Error('Corrida não encontrada');
      if (trip.status !== TripStatus.SEARCHING) {
        throw new Error(`Corrida não disponível para aceite (status: ${trip.status})`);
      }

      const driver = await this.driversService.findById(driverId);
      if (driver.status !== DriverStatus.ONLINE) {
        throw new Error('Motorista não está online');
      }

      const offer = this.activeOffers.get(tripId);
      if (offer) {
        clearTimeout(offer.timeoutHandle);
        this.activeOffers.delete(tripId);
      }
      this.driverPendingOffers.delete(driverId);

      trip.driverId = driverId;
      trip.driver = driver;
      if (driver.vehicle) {
        trip.vehicleId = driver.vehicle.id;
        trip.vehicle = driver.vehicle;
      }
      trip.status = TripStatus.ACCEPTED;
      trip.acceptedAt = new Date();

      const savedTrip = await this.tripRepo.save(trip);

      await this.driversService.setStatus(driverId, DriverStatus.BUSY);

      const eventPayload = {
        tripId: savedTrip.id,
        driver: {
          id: driver.id,
          name: driver.user?.name,
          phone: driver.user?.phone,
          rating: driver.rating,
          vehicle: driver.vehicle,
          currentLat: driver.currentLat,
          currentLng: driver.currentLng,
        },
        status: savedTrip.status,
      };

      this.wsGateway.emitToPassenger(trip.passengerId, 'trip:accepted', eventPayload);
      this.wsGateway.emitToDriver(driverId, 'trip:accepted', { tripId: savedTrip.id });
      this.wsGateway.emitToTrip(tripId, 'trip:status_change', { status: TripStatus.ACCEPTED });

      await this.auditService.log(
        'Trip',
        tripId,
        'DISPATCH_ACCEPTED',
        driverId,
        { driverId, status: TripStatus.ACCEPTED },
      );

      return savedTrip;
    } finally {
      this.tripLocks.delete(tripId);
    }
  }

  async declineTrip(tripId: string, driverId: string) {
    this.releaseDriverOffer(driverId, tripId);
    this.logger.log(`Driver ${driverId} declined trip ${tripId}`);
    return { success: true };
  }

  private releaseDriverOffer(driverId: string, tripId: string) {
    this.driverPendingOffers.delete(driverId);
    const offer = this.activeOffers.get(tripId);
    if (offer && offer.driverId === driverId) {
      clearTimeout(offer.timeoutHandle);
      this.activeOffers.delete(tripId);
    }
  }
}
