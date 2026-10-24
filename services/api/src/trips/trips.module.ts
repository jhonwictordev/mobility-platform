import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip, ChatMessage } from '../database/entities';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { PricingModule } from '../pricing/pricing.module';
import { DispatchModule } from '../dispatch/dispatch.module';
import { DriversModule } from '../drivers/drivers.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trip, ChatMessage]),
    PricingModule,
    DispatchModule,
    DriversModule,
    PaymentsModule,
  ],
  providers: [TripsService],
  controllers: [TripsController],
  exports: [TripsService],
})
export class TripsModule {}
