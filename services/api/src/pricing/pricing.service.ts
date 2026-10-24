import { Injectable } from '@nestjs/common';
import { VehicleCategory } from '../database/entities';
import { haversineDistance, estimateTravelTime } from '../common/utils/haversine';

export interface CategoryFareConfig {
  baseFare: number;
  perKmRate: number;
  perMinRate: number;
  minimumFare: number;
}

export const FARE_CONFIG: Record<VehicleCategory, CategoryFareConfig> = {
  [VehicleCategory.ECONOMY]: {
    baseFare: 5.0,
    perKmRate: 1.5,
    perMinRate: 0.25,
    minimumFare: 8.0,
  },
  [VehicleCategory.COMFORT]: {
    baseFare: 7.0,
    perKmRate: 2.2,
    perMinRate: 0.35,
    minimumFare: 12.0,
  },
  [VehicleCategory.PREMIUM]: {
    baseFare: 10.0,
    perKmRate: 3.5,
    perMinRate: 0.5,
    minimumFare: 18.0,
  },
};

@Injectable()
export class PricingService {
  private surgeMultiplier = 1.0;

  setSurgeMultiplier(multiplier: number) {
    this.surgeMultiplier = Math.max(1.0, multiplier);
  }

  getSurgeMultiplier(): number {
    return this.surgeMultiplier;
  }

  calculateFare(
    category: VehicleCategory,
    distanceKm: number,
    durationMin: number,
  ): {
    baseFare: number;
    distanceFare: number;
    timeFare: number;
    surgeMultiplier: number;
    totalFare: number;
  } {
    const config = FARE_CONFIG[category] || FARE_CONFIG[VehicleCategory.ECONOMY];
    const distanceFare = distanceKm * config.perKmRate;
    const timeFare = durationMin * config.perMinRate;
    const subtotal = (config.baseFare + distanceFare + timeFare) * this.surgeMultiplier;
    const totalFare = Math.max(config.minimumFare, Math.round(subtotal * 100) / 100);

    return {
      baseFare: config.baseFare,
      distanceFare: Math.round(distanceFare * 100) / 100,
      timeFare: Math.round(timeFare * 100) / 100,
      surgeMultiplier: this.surgeMultiplier,
      totalFare,
    };
  }

  estimateFares(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
  ) {
    const distanceKm = haversineDistance(fromLat, fromLng, toLat, toLng);
    const durationMin = estimateTravelTime(distanceKm, 30);

    const categories = [
      VehicleCategory.ECONOMY,
      VehicleCategory.COMFORT,
      VehicleCategory.PREMIUM,
    ];

    return categories.map((cat) => {
      const breakdown = this.calculateFare(cat, distanceKm, durationMin);
      return {
        category: cat,
        distanceKm: Math.round(distanceKm * 100) / 100,
        durationMin: Math.max(1, Math.round(durationMin)),
        ...breakdown,
        currency: 'BRL',
      };
    });
  }
}
