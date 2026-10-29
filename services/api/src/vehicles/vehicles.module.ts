import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle, VehicleChangeRequest } from '../database/entities';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, VehicleChangeRequest]), DriversModule],
  providers: [VehiclesService],
  controllers: [VehiclesController],
  exports: [VehiclesService],
})
export class VehiclesModule {}
