import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Put,
  UseGuards,
  ForbiddenException,
  BadRequestException,
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
  @Get('me/earnings/weekly')
  async getMyWeeklyEarnings(@CurrentUser() user: any): Promise<any> {
    const driver = await this.driversService.findByUserId(user.userId);
    if (!driver) {
      throw new BadRequestException('Perfil de motorista não encontrado.');
    }
    return this.driversService.getWeeklyEarnings(driver.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/status')
  async updateMyStatus(
    @CurrentUser() user: any,
    @Body('status') status: DriverStatus,
  ) {
    const driver = await this.driversService.findByUserId(user.userId);
    if (!driver) {
      throw new BadRequestException('Perfil de motorista não encontrado.');
    }
    return this.driversService.setStatus(driver.id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMyDriverProfile(
    @CurrentUser() user: any,
    @Body()
    body: {
      licenseNumber?: string;
      cnhCategory?: string;
      pixKey?: string;
      pixKeyType?: string;
    },
  ) {
    return this.driversService.updateProfile(user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async registerDriver(
    @CurrentUser() user: any,
    @Body('licenseNumber') licenseNumber: string,
    @Body('cnhCategory') cnhCategory?: string,
  ) {
    return this.driversService.create({
      userId: user.userId,
      licenseNumber: licenseNumber || 'PENDING_CNH',
      cnhCategory: cnhCategory || 'B',
      status: DriverStatus.OFFLINE,
      approvalStatus: ApprovalStatus.PENDING,
      rating: 5.0,
      totalTrips: 0,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('online')
  async getOnlineDrivers() {
    return this.driversService.findOnlineDrivers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/earnings/weekly')
  async getWeeklyEarningsById(@Param('id') id: string, @CurrentUser() user: any): Promise<any> {
    const driver = await this.driversService.findById(id);
    if (driver.userId !== user.userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Não autorizado a consultar ganhos de outro motorista');
    }
    return this.driversService.getWeeklyEarnings(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/public')
  async getPublicProfile(@Param('id') id: string) {
    return this.driversService.getPublicProfile(id);
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
    @Body('rejectionReason') rejectionReason?: string,
  ) {
    if (!approvalStatus) {
      throw new BadRequestException('Status de aprovação é obrigatório');
    }
    return this.driversService.setApproval(id, approvalStatus, rejectionReason);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getDriver(@Param('id') id: string, @CurrentUser() user: any) {
    const driver = await this.driversService.findById(id);
    // Public safe view for other users, full view for owner/admin
    if (driver.userId !== user.userId && user.role !== UserRole.ADMIN) {
      return this.driversService.getPublicProfile(id);
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
