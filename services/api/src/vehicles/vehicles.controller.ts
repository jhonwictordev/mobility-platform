import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicle, UserRole } from '../database/entities';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, Roles } from '../common/decorators';
import { DriversService } from '../drivers/drivers.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly driversService: DriversService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@CurrentUser() user: any, @Body() body: Partial<Vehicle>) {
    if (body.driverId) {
      const driver = await this.driversService.findById(body.driverId);
      if (driver.userId !== user.userId && user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Não autorizado a cadastrar veículos para outro motorista');
      }
    }
    // Prevent client from self-approving vehicle
    return this.vehiclesService.create({
      ...body,
      approved: false,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('driver/:driverId')
  getByDriver(@Param('driverId') driverId: string) {
    return this.vehiclesService.findByDriverId(driverId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  list() {
    return this.vehiclesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id/approve')
  approve(@Param('id') id: string, @Body('approved') approved: boolean) {
    return this.vehiclesService.updateApproval(id, approved);
  }
}
