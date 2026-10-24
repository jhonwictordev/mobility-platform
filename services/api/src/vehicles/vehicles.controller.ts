import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from '../database/entities';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: Partial<Vehicle>) {
    return this.vehiclesService.create(body);
  }

  @Get('driver/:driverId')
  getByDriver(@Param('driverId') driverId: string) {
    return this.vehiclesService.findByDriverId(driverId);
  }

  @Get()
  list() {
    return this.vehiclesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/approve')
  approve(@Param('id') id: string, @Body('approved') approved: boolean) {
    return this.vehiclesService.updateApproval(id, approved);
  }
}
