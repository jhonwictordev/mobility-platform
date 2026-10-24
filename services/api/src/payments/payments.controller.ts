import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentMethod } from '../database/entities';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('process')
  async processPayment(
    @Body()
    body: {
      tripId: string;
      amount: number;
      method?: PaymentMethod;
    },
  ) {
    return this.paymentsService.processTestPayment(
      body.tripId,
      body.amount,
      body.method,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('trip/:tripId')
  async getPaymentByTrip(@Param('tripId') tripId: string) {
    return this.paymentsService.findByTripId(tripId);
  }

  @Get()
  async getAll() {
    return this.paymentsService.findAll();
  }
}
