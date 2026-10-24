import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
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

  async getRoadRoute(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
  ) {
    const orsApiKey = process.env.OPENROUTESERVICE_API_KEY;

    // 1. Tentar openrouteservice se a chave estiver configurada
    if (orsApiKey && orsApiKey.trim().length > 0) {
      try {
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsApiKey.trim()}&start=${originLng},${originLat}&end=${destLng},${destLat}`;
        const res = await fetch(url, {
          headers: {
            'Accept': 'application/json, application/geo+json',
            'User-Agent': 'SIMBORA-Mobility/2.0'
          }
        });
        if (res.ok) {
          const data: any = await res.json();
          if (data.features && data.features[0]) {
            const feat = data.features[0];
            const summary = feat.properties.summary;
            return {
              provider: 'openrouteservice',
              profile: 'driving-car',
              distanceKm: Math.round((summary.distance / 1000) * 100) / 100,
              durationMin: Math.round(summary.duration / 60),
              coordinates: feat.geometry.coordinates,
              status: 'OK',
            };
          }
        }
        this.logger.warn(`openrouteservice falhou com status ${res.status}. Usando fallback geoespacial de Alagoas.`);
      } catch (err: any) {
        this.logger.warn(`Erro ao conectar ao openrouteservice: ${err.message}. Usando fallback.`);
      }
    }

    // 2. Fallback de alta fidelidade para corredores homologados de Alagoas
    try {
      const candidates = [
        path.join(__dirname, '..', 'common', 'alagoas_routes.json'),
        path.join(__dirname, '..', '..', 'src', 'common', 'alagoas_routes.json'),
        path.join(__dirname, '..', '..', '..', '..', 'packages', 'alagoas_routes.json'),
        path.join(__dirname, '..', '..', '..', 'packages', 'alagoas_routes.json'),
        path.join(process.cwd(), 'packages', 'alagoas_routes.json'),
        path.join(process.cwd(), '..', 'packages', 'alagoas_routes.json'),
        path.join(process.cwd(), '..', '..', 'packages', 'alagoas_routes.json'),
      ];
      let routesData: any = null;
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          routesData = JSON.parse(fs.readFileSync(p, 'utf8'));
          break;
        }
      }

      if (routesData) {
        for (const key of Object.keys(routesData)) {
          const r = routesData[key];
          const dOrigin = haversineDistance(originLat, originLng, r.origin.lat, r.origin.lng);
          const dDest = haversineDistance(destLat, destLng, r.destination.lat, r.destination.lng);
          // Tolerância de 5 km em relação aos marcos municipais
          if (dOrigin < 5.0 && dDest < 5.0) {
            return {
              provider: 'simbora_alagoas_verified',
              profile: 'driving-car',
              routeKey: key,
              name: r.name,
              highways: r.highways,
              distanceKm: r.distanceKm,
              durationMin: r.durationMinutes,
              coordinates: r.coordinates,
              pointsCount: r.pointsCount,
              status: 'OK',
            };
          }
        }
      }
    } catch (err: any) {
      this.logger.error(`Erro ao carregar rotas de Alagoas: ${err.message}`);
    }

    // 3. Regra de Negócio SIMBORA: Se a rota não puder ser calculada, apresente erro claro (NÃO RETORNE LINHA RETA)
    throw new HttpException(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'ROUTING_FAILED',
        message: 'Não foi possível calcular a rota rodoviária entre os pontos informados. A plataforma SIMBORA não utiliza linhas retas.',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
