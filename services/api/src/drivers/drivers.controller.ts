import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriverStatus, ApprovalStatus } from '../database/entities';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyDriverProfile(@CurrentUser() user: any) {
    return this.driversService.findByUserId(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async registerDriver(
    @CurrentUser() user: any,
    @Body('licenseNumber') licenseNumber: string,
  ) {
    return this.driversService.create({
      userId: user.userId,
      licenseNumber,
      status: DriverStatus.OFFLINE,
      approvalStatus: ApprovalStatus.PENDING,
      rating: 5.0,
      totalTrips: 0,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: DriverStatus,
  ) {
    return this.driversService.setStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/approval')
  async updateApproval(
    @Param('id') id: string,
    @Body('approvalStatus') approvalStatus: ApprovalStatus,
  ) {
    return this.driversService.setApproval(id, approvalStatus);
  }

  @Get('online')
  async getOnlineDrivers() {
    return this.driversService.findOnlineDrivers();
  }

  @Get(':id')
  async getDriver(@Param('id') id: string) {
    return this.driversService.findById(id);
  }

  @Get()
  async getAllDrivers() {
    return this.driversService.findAll();
  }
}
