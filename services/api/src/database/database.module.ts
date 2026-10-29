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
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: path.resolve(__dirname, '../../../../mobility.sqlite'),
      entities: [
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
      ],
      synchronize: true, // Auto schema sync in dev
      logging: false,
    }),
    TypeOrmModule.forFeature([
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
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
