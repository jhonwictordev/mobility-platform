import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentsService } from './payments.service';
import { PaymentMethod, UserRole, Trip } from '../database/entities';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, Roles } from '../common/decorators';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    @InjectRepository(Trip)
    private readonly tripRepo: Repository<Trip>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('process')
  async processPayment(
    @CurrentUser() user: any,
    @Body()
    body: {
      tripId: string;
      amount: number;
      method?: PaymentMethod;
    },
  ) {
    const trip = await this.tripRepo.findOne({
      where: { id: body.tripId },
      relations: { driver: true },
    });
    if (!trip) throw new NotFoundException('Corrida não encontrada');

    // Only the trip passenger, assigned driver, or admin can trigger payment
    const isPassenger = trip.passengerId === user.userId;
    const isDriver = trip.driver && trip.driver.userId === user.userId;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isPassenger && !isDriver && !isAdmin) {
      throw new ForbiddenException('Não autorizado a processar pagamento desta corrida');
    }

    return this.paymentsService.processTestPayment(
      body.tripId,
      body.amount,
      body.method,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('trip/:tripId')
  async getPaymentByTrip(
    @Param('tripId') tripId: string,
    @CurrentUser() user: any,
  ) {
    const trip = await this.tripRepo.findOne({
      where: { id: tripId },
      relations: { driver: true },
    });
    if (!trip) throw new NotFoundException('Corrida não encontrada');

    const isPassenger = trip.passengerId === user.userId;
    const isDriver = trip.driver && trip.driver.userId === user.userId;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isPassenger && !isDriver && !isAdmin) {
      throw new ForbiddenException('Acesso negado aos detalhes financeiros desta corrida');
    }

    return this.paymentsService.findByTripId(tripId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async getAll() {
    return this.paymentsService.findAll();
  }
}
