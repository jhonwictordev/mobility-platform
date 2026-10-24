import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { DriversService } from '../drivers/drivers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';
import { UserRole } from '../database/entities';

@Controller('location')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private readonly driversService: DriversService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateLocation(
    @CurrentUser() user: any,
    @Body()
    body: {
      driverId: string;
      lat: number;
      lng: number;
      heading?: number;
      speed?: number;
      tripId?: string;
    },
  ) {
    if (user.role !== UserRole.ADMIN) {
      const driver = await this.driversService.findByUserId(user.userId);
      if (!driver || driver.id !== body.driverId) {
        throw new ForbiddenException('Não autorizado a atualizar localização de outro motorista');
      }
    }
    return this.locationService.recordLocation(
      body.driverId,
      body.lat,
      body.lng,
      body.heading,
      body.speed,
      body.tripId,
    );
  }

  @Get('eta')
  async getEta(
    @Query('fromLat') fromLat: number,
    @Query('fromLng') fromLng: number,
    @Query('toLat') toLat: number,
    @Query('toLng') toLng: number,
  ) {
    return this.locationService.calculateDistanceAndEta(
      Number(fromLat),
      Number(fromLng),
      Number(toLat),
      Number(toLng),
    );
  }

  @Get('route')
  async getRoute(
    @Query('originLat') originLat: number,
    @Query('originLng') originLng: number,
    @Query('destLat') destLat: number,
    @Query('destLng') destLng: number,
  ) {
    return this.locationService.getRoadRoute(
      Number(originLat),
      Number(originLng),
      Number(destLat),
      Number(destLng),
    );
  }

  @Get('config')
  getMapConfig() {
    const key =
      process.env.VITE_MAPTILER_KEY ||
      process.env.MAPTILER_API_KEY ||
      process.env.NEXT_PUBLIC_MAPTILER_KEY ||
      '';
    return {
      maptilerKey: key,
      hasKey: key.trim().length > 0,
      routingProfile: 'driving-car',
      activeCorridor: 'Piaçabuçu -> Penedo',
      state: 'Alagoas',
    };
  }
}
