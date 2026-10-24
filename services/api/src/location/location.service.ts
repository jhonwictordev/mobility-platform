import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverLocation } from '../database/entities';
import { DriversService } from '../drivers/drivers.service';
import { MobilityWebSocketGateway } from '../websocket/websocket.gateway';
import { haversineDistance, estimateTravelTime } from '../common/utils/haversine';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(
    @InjectRepository(DriverLocation)
    private readonly locationRepo: Repository<DriverLocation>,
    private readonly driversService: DriversService,
    private readonly wsGateway: MobilityWebSocketGateway,
  ) {}

  async recordLocation(
    driverId: string,
    lat: number,
    lng: number,
    heading?: number,
    speed?: number,
    tripId?: string,
  ): Promise<DriverLocation> {
    // Save history
    const entry = this.locationRepo.create({
      driverId,
      lat,
      lng,
      heading,
      speed,
    });
    const saved = await this.locationRepo.save(entry);

    // Update driver's current position
    await this.driversService.updateLocation(driverId, lat, lng);

    // Broadcast realtime event
    const payload = {
      driverId,
      lat,
      lng,
      heading,
      speed,
      tripId,
      timestamp: new Date().toISOString(),
    };

    if (tripId) {
      this.wsGateway.emitToTrip(tripId, 'driver:location_update', payload);
    }
    this.wsGateway.broadcastAdmin('admin:driver_location', payload);

    return saved;
  }

  calculateDistanceAndEta(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
  ) {
    const distanceKm = haversineDistance(fromLat, fromLng, toLat, toLng);
    const durationMin = estimateTravelTime(distanceKm, 30); // 30 km/h average
    return {
      distanceKm: Math.round(distanceKm * 100) / 100,
      durationMin: Math.max(1, Math.round(durationMin)),
    };
  }
}
