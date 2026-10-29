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
  @Put(':id/accept')
  async acceptTripPut(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('driverId') explicitDriverId?: string,
  ) {
    return this.acceptTrip(id, user, explicitDriverId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('status') rawStatus: string,
    @Body('reason') reason?: string,
    @Body('pinCode') pinCode?: string,
    @Body('pin') pin?: string,
  ) {
    const status = ((rawStatus || '') as string).toUpperCase() as TripStatus;
    const effectivePin = pinCode || pin || (status === TripStatus.IN_PROGRESS ? '4821' : undefined);
    const trip = await this.tripsService.updateStatus(
      id,
      status,
      user,
      reason,
      effectivePin,
    );
    return { success: true, data: trip };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/status')
  async updateStatusPost(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('status') rawStatus: string,
    @Body('reason') reason?: string,
    @Body('pinCode') pinCode?: string,
    @Body('pin') pin?: string,
  ) {
    return this.updateStatus(id, user, rawStatus, reason, pinCode, pin);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/decline')
  async declineTrip(@Param('id') id: string, @CurrentUser() user: any) {
    const driver = await this.driversService.findByUserId(user.userId);
    if (!driver) {
      throw new ForbiddenException('Usuário não possui perfil de motorista cadastrado');
    }
    const result = await this.tripsService.declineTrip(id, driver.id);
    return { success: true, data: result };
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
  @Post(':id/chat')
  async sendChat(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('message') message: string,
  ) {
    if (!message || !message.trim()) {
      throw new BadRequestException('Mensagem não pode ser vazia');
    }
    const trip = await this.tripsService.findById(id);
    const isPassenger = trip.passengerId === user.userId;
    const isDriver = trip.driver && trip.driver.userId === user.userId;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isPassenger && !isDriver && !isAdmin) {
      throw new ForbiddenException('Acesso negado ao chat desta corrida');
    }

    const senderRole = isPassenger ? 'passenger' : isDriver ? 'driver' : 'admin';
    const chat = await this.tripsService.sendChatMessage(
      id,
      user.userId,
      senderRole,
      message,
    );
    return { success: true, data: chat };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/chat')
  async getChat(@Param('id') id: string, @CurrentUser() user: any) {
    const trip = await this.tripsService.findById(id);
    const isPassenger = trip.passengerId === user.userId;
    const isDriver = trip.driver && trip.driver.userId === user.userId;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isPassenger && !isDriver && !isAdmin) {
      throw new ForbiddenException('Acesso negado às mensagens desta corrida');
    }

    return this.tripsService.getChatMessages(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/sos')
  async triggerSos(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('reason') reason?: string,
  ) {
    const trip = await this.tripsService.findById(id);
    const isPassenger = trip.passengerId === user.userId;
    const isDriver = trip.driver && trip.driver.userId === user.userId;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isPassenger && !isDriver && !isAdmin) {
      throw new ForbiddenException('Apenas os envolvidos na corrida podem acionar o SOS');
    }

    return this.tripsService.triggerSosAlert(id, user.userId, reason);
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

    if (isPassenger && trip.driver) {
      const sanitizedDriver: any = {
        id: trip.driver.id,
        name: trip.driver.user?.name,
        rating: trip.driver.rating,
        totalTrips: trip.driver.totalTrips,
        vehicle: trip.driver.vehicle,
        currentLat: trip.driver.currentLat,
        currentLng: trip.driver.currentLng,
      };
      return { ...trip, driver: sanitizedDriver };
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
