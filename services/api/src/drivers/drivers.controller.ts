import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { DriverStatus, ApprovalStatus, UserRole } from '../database/entities';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, Roles } from '../common/decorators';

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
    @CurrentUser() user: any,
    @Body('status') status: DriverStatus,
  ) {
    const driver = await this.driversService.findById(id);
    if (driver.userId !== user.userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Não autorizado a alterar o status deste motorista');
    }
    return this.driversService.setStatus(id, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id/approval')
  async updateApproval(
    @Param('id') id: string,
    @Body('approvalStatus') approvalStatus: ApprovalStatus,
  ) {
    return this.driversService.setApproval(id, approvalStatus);
  }

  @UseGuards(JwtAuthGuard)
  @Get('online')
  async getOnlineDrivers() {
    return this.driversService.findOnlineDrivers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getDriver(@Param('id') id: string, @CurrentUser() user: any) {
    const driver = await this.driversService.findById(id);
    // Public safe view for passengers, full view for owner/admin
    if (driver.userId !== user.userId && user.role !== UserRole.ADMIN) {
      return {
        id: driver.id,
        rating: driver.rating,
        totalTrips: driver.totalTrips,
        status: driver.status,
        approvalStatus: driver.approvalStatus,
        vehicles: driver.vehicles?.filter((v) => v.approved),
      };
    }
    return driver;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async getAllDrivers() {
    return this.driversService.findAll();
  }
}
