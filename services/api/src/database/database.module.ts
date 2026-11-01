import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import {
  User,
  Driver,
  Vehicle,
  Trip,
  DriverLocation,
  Payment,
  AuditLog,
  Document,
  SavedPlace,
  ChatMessage,
  VehicleChangeRequest,
  CarpoolTrip,
  CarpoolReservation,
  CarpoolAlert,
  CarpoolMessage,
  CarpoolReview,
  CarpoolRecurringSchedule,
  CarpoolFinancialTransaction,
} from './entities';

const ALL_ENTITIES = [
  User,
  Driver,
  Vehicle,
  Trip,
  DriverLocation,
  Payment,
  AuditLog,
  Document,
  SavedPlace,
  ChatMessage,
  VehicleChangeRequest,
  CarpoolTrip,
  CarpoolReservation,
  CarpoolAlert,
  CarpoolMessage,
  CarpoolReview,
  CarpoolRecurringSchedule,
  CarpoolFinancialTransaction,
];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: path.resolve(__dirname, '../../../../mobility.sqlite'),
      entities: ALL_ENTITIES,
      synchronize: true, // Auto schema sync in dev
      logging: false,
    }),
    TypeOrmModule.forFeature(ALL_ENTITIES),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

