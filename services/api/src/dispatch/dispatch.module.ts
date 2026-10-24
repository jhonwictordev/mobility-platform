import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip, Driver } from '../database/entities';
import { DispatchService } from './dispatch.service';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Driver]), DriversModule],
  providers: [DispatchService],
  exports: [DispatchService],
})
export class DispatchModule {}
