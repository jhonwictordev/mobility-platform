import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CarpoolTrip,
  CarpoolReservation,
  CarpoolAlert,
  CarpoolMessage,
  CarpoolReview,
  CarpoolRecurringSchedule,
  CarpoolFinancialTransaction,
} from '../database/entities';
import { CarpoolsService } from './carpools.service';
import { CarpoolsController } from './carpools.controller';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CarpoolTrip,
      CarpoolReservation,
      CarpoolAlert,
      CarpoolMessage,
      CarpoolReview,
      CarpoolRecurringSchedule,
      CarpoolFinancialTransaction,
    ]),
    WebSocketModule,
  ],
  controllers: [CarpoolsController],
  providers: [CarpoolsService],
  exports: [CarpoolsService],
})
export class CarpoolsModule {}
