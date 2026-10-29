import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  UseGuards,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import {
  Vehicle,
  VehicleCategory,
  VehicleChangeRequestStatus,
  UserRole,
} from '../database/entities';
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

  // ============================================================
  // VEHICLE CHANGE REQUESTS (SIMBORA 3.4)
  // Must be declared before :id route
  // ============================================================

  @UseGuards(JwtAuthGuard)
  @Post('change-requests')
  async createChangeRequest(
    @CurrentUser() user: any,
    @Body()
    body: {
      driverId?: string;
      currentVehicleId?: string;
      requestedMake?: string;
      requestedModel?: string;
      requestedYear?: number;
      requestedColor?: string;
      requestedPlate?: string;
      requestedRenavam?: string;
      requestedCategory?: VehicleCategory;
      requestedSeats?: number;
      make?: string;
      model?: string;
      year?: number;
      color?: string;
      plate?: string;
      renavam?: string;
      category?: VehicleCategory;
      seats?: number;
      reason: string;
      notes?: string;
    },
  ) {
    let driverId = body.driverId;
    if (!driverId) {
      const driver = await this.driversService.findByUserId(user.userId);
      if (!driver) {
        throw new BadRequestException('Motorista não localizado para este usuário.');
      }
      driverId = driver.id;
    } else if (user.role !== UserRole.ADMIN) {
      const driver = await this.driversService.findById(driverId);
      if (driver.userId !== user.userId) {
        throw new ForbiddenException('Não autorizado a solicitar alteração para outro motorista.');
      }
    }

    const normalizedData = {
      requestedMake: body.requestedMake || body.make || '',
      requestedModel: body.requestedModel || body.model || '',
      requestedYear: body.requestedYear || body.year || new Date().getFullYear(),
      requestedColor: body.requestedColor || body.color || 'Branco',
      requestedPlate: body.requestedPlate || body.plate || '',
      requestedRenavam: body.requestedRenavam || body.renavam,
      requestedCategory: body.requestedCategory || body.category || VehicleCategory.ECONOMY,
      requestedSeats: body.requestedSeats || body.seats || 4,
      reason: body.reason,
      notes: body.notes,
    };

    return this.vehiclesService.createChangeRequest(
      driverId,
      body.currentVehicleId || null,
      normalizedData,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('change-requests/my')
  async getMyChangeRequests(@CurrentUser() user: any) {
    const driver = await this.driversService.findByUserId(user.userId);
    if (!driver) return [];
    return this.vehiclesService.findChangeRequestsByDriverId(driver.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('change-requests')
  async listChangeRequests(
    @CurrentUser() user: any,
    @Query('status') status?: VehicleChangeRequestStatus,
  ) {
    if (user.role !== UserRole.ADMIN) {
      const driver = await this.driversService.findByUserId(user.userId);
      if (!driver) return [];
      return this.vehiclesService.findChangeRequestsByDriverId(driver.id);
    }
    return this.vehiclesService.findAllChangeRequests(status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('change-requests/:id')
  async getChangeRequestById(@Param('id') id: string) {
    return this.vehiclesService.findChangeRequestById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('change-requests/:id/approve')
  async approveChangeRequest(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('notes') notes?: string,
  ) {
    return this.vehiclesService.approveChangeRequest(id, user.userId, notes);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('change-requests/:id/reject')
  async rejectChangeRequest(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('rejectionReason') rejectionReason: string,
  ) {
    if (!rejectionReason || !rejectionReason.trim()) {
      throw new BadRequestException('A justificativa de reprovação é obrigatória.');
    }
    return this.vehiclesService.rejectChangeRequest(id, rejectionReason, user.userId);
  }

  // ============================================================
  // VEHICLE RETRIEVAL & INSPECTION
  // ============================================================

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
