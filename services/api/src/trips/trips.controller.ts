import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripStatus, VehicleCategory, UserRole } from '../database/entities';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, Roles } from '../common/decorators';
import { DriversService } from '../drivers/drivers.service';

@Controller('trips')
export class TripsController {
  constructor(
    private readonly tripsService: TripsService,
    private readonly driversService: DriversService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async requestTrip(
    @CurrentUser() user: any,
    @Body()
    body: {
      originLat: number;
      originLng: number;
      originAddress: string;
      destLat: number;
      destLng: number;
      destAddress: string;
      category?: VehicleCategory;
    },
  ) {
    const trip = await this.tripsService.requestTrip({
      passengerId: user.userId,
      ...body,
    });
    return { success: true, data: trip };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/accept')
  async acceptTrip(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('driverId') explicitDriverId?: string,
  ) {
    let targetDriverId = explicitDriverId;
    if (user.role !== UserRole.ADMIN) {
      const driver = await this.driversService.findByUserId(user.userId);
      if (!driver) {
        throw new ForbiddenException('Usuário não possui perfil de motorista cadastrado');
      }
      targetDriverId = driver.id;
    } else if (!targetDriverId) {
      const driver = await this.driversService.findByUserId(user.userId);
      targetDriverId = driver ? driver.id : explicitDriverId;
    }

    if (!targetDriverId) {
      throw new BadRequestException('ID do motorista não especificado');
    }

    const trip = await this.tripsService.acceptTrip(id, targetDriverId);
    return { success: true, data: trip };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('status') status: TripStatus,
    @Body('reason') reason?: string,
  ) {
    const trip = await this.tripsService.updateStatus(
      id,
      status,
      user,
      reason,
    );
    return { success: true, data: trip };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  async cancelTrip(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('reason') reason?: string,
  ) {
    const trip = await this.tripsService.updateStatus(
      id,
      TripStatus.CANCELLED_BY_PASSENGER,
      user,
      reason,
    );
    return { success: true, data: trip };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/rate')
  async rateTrip(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('rating') rating: number,
    @Body('review') review?: string,
  ) {
    const trip = await this.tripsService.findById(id);
    if (trip.passengerId !== user.userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Apenas o passageiro titular pode avaliar a corrida');
    }
    const updated = await this.tripsService.rateTrip(id, Number(rating), review);
    return { success: true, data: updated };
  }

  @UseGuards(JwtAuthGuard)
  @Get('passenger/history')
  async getPassengerTrips(@CurrentUser() user: any) {
    return this.tripsService.findByPassenger(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('driver/history')
  async getDriverTrips(
    @CurrentUser() user: any,
    @Query('driverId') queryDriverId?: string,
  ) {
    let targetDriverId = queryDriverId;
    if (user.role !== UserRole.ADMIN) {
      const driver = await this.driversService.findByUserId(user.userId);
      if (!driver) {
        throw new ForbiddenException('Usuário não possui perfil de motorista cadastrado');
      }
      if (queryDriverId && queryDriverId !== driver.id) {
        throw new ForbiddenException('Não autorizado a consultar histórico de outro motorista');
      }
      targetDriverId = driver.id;
    }
    if (!targetDriverId) {
      throw new BadRequestException('ID do motorista não especificado');
    }
    return this.tripsService.findByDriver(targetDriverId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getTrip(@Param('id') id: string, @CurrentUser() user: any) {
    const trip = await this.tripsService.findById(id);
    const isPassenger = trip.passengerId === user.userId;
    const isDriver = trip.driver && trip.driver.userId === user.userId;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isPassenger && !isDriver && !isAdmin) {
      throw new ForbiddenException('Acesso negado aos detalhes desta corrida');
    }
    return trip;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async getAllTrips(@Query('status') status?: TripStatus) {
    return this.tripsService.findAll(status);
  }
}
