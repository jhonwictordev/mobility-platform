import { Controller, Get, Query, Put, Body, UseGuards } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators';
import { UserRole } from '../database/entities';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('categories')
  getCategories() {
    return this.pricingService.getCategoriesConfig();
  }

  @Get('estimate')
  getEstimate(
    @Query('fromLat') fromLat: number,
    @Query('fromLng') fromLng: number,
    @Query('toLat') toLat: number,
    @Query('toLng') toLng: number,
  ) {
    return this.pricingService.estimateFares(
      Number(fromLat),
      Number(fromLng),
      Number(toLat),
      Number(toLng),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('surge')
  setSurge(@Body('multiplier') multiplier: number) {
    this.pricingService.setSurgeMultiplier(Number(multiplier));
    return { surgeMultiplier: this.pricingService.getSurgeMultiplier() };
  }
}
