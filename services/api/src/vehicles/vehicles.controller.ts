import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicle, VehicleCategory, UserRole } from '../database/entities';
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
    let targetDriverId = body.driverId;

    if (!targetDriverId) {
      const driver = await this.driversService.findByUserId(user.userId);
      if (!driver) {
        throw new BadRequestException('Usuário não possui perfil de motorista cadastrado');
      }
      targetDriverId = driver.id;
    } else {
      const driver = await this.driversService.findById(targetDriverId);
      if (driver.userId !== user.userId && user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Não autorizado a cadastrar veículos para outro motorista');
      }
    }

    if (!body.make || !body.model || !body.plateNumber) {
      throw new BadRequestException('Marca, modelo e placa são obrigatórios');
    }

    // Security Hardening: New vehicles start as approved = false until inspected
    return this.vehiclesService.create({
      driverId: targetDriverId,
      make: body.make.trim(),
      model: body.model.trim(),
      year: Number(body.year) || 2022,
      color: body.color ? body.color.trim() : 'Branco',
      plateNumber: body.plateNumber.trim().toUpperCase(),
      renavam: body.renavam ? body.renavam.trim() : null,
      category: body.category || VehicleCategory.ECONOMY,
      seats: Number(body.seats) || 4,
      approved: false,
      isActive: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyVehicles(@CurrentUser() user: any) {
    const driver = await this.driversService.findByUserId(user.userId);
    if (!driver) return [];
    return this.vehiclesService.findByDriverId(driver.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('driver/:driverId')
  async getByDriver(@Param('driverId') driverId: string, @CurrentUser() user: any) {
    const driver = await this.driversService.findById(driverId);
    if (driver.userId !== user.userId && user.role !== UserRole.ADMIN) {
      // Passengers can only see approved active vehicles
      const vehicles = await this.vehiclesService.findByDriverId(driverId);
      return vehicles.filter((v) => v.approved && v.isActive);
    }
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
  approve(
    @Param('id') id: string,
    @Body('approved') approved: boolean,
    @Body('notes') notes?: string,
  ) {
    return this.vehiclesService.updateApproval(id, approved, notes);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id/category')
  updateCategory(
    @Param('id') id: string,
    @Body('category') category: VehicleCategory,
  ) {
    return this.vehiclesService.updateCategory(id, category);
  }
}
