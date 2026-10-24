import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateLocation(
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
}
