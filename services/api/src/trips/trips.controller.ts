import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripStatus, VehicleCategory } from '../database/entities';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async requestTrip(
    @CurrentUser() user: any,
    @Body()
    body: {
      originLat: number;
      originLng: number;
      originAddress: string;
      destLat: number;
      destLng: number;
      destAddress: string;
      category?: VehicleCategory;
    },
  ) {
    const trip = await this.tripsService.requestTrip({
      passengerId: user.userId,
      ...body,
    });
    return { success: true, data: trip };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/accept')
  async acceptTrip(@Param('id') id: string, @Body('driverId') driverId: string) {
    const trip = await this.tripsService.acceptTrip(id, driverId);
    return { success: true, data: trip };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('status') status: TripStatus,
    @Body('reason') reason?: string,
  ) {
    const trip = await this.tripsService.updateStatus(
      id,
      status,
      user?.userId,
      reason,
    );
    return { success: true, data: trip };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  async cancelTrip(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body('reason') reason?: string,
  ) {
    const trip = await this.tripsService.updateStatus(
      id,
      TripStatus.CANCELLED_BY_PASSENGER,
      user?.userId,
      reason,
    );
    return { success: true, data: trip };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/rate')
  async rateTrip(
    @Param('id') id: string,
    @Body('rating') rating: number,
    @Body('review') review?: string,
  ) {
    const trip = await this.tripsService.rateTrip(id, Number(rating), review);
    return { success: true, data: trip };
  }

  @UseGuards(JwtAuthGuard)
  @Get('passenger/history')
  async getPassengerTrips(@CurrentUser() user: any) {
    return this.tripsService.findByPassenger(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('driver/history')
  async getDriverTrips(@Query('driverId') driverId: string) {
    return this.tripsService.findByDriver(driverId);
  }

  @Get(':id')
  async getTrip(@Param('id') id: string) {
    return this.tripsService.findById(id);
  }

  @Get()
  async getAllTrips(@Query('status') status?: TripStatus) {
    return this.tripsService.findAll(status);
  }
}
