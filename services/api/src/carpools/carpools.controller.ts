import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { CarpoolsService } from './carpools.service';

@Controller()
export class CarpoolsController {
  constructor(private readonly carpoolsService: CarpoolsService) {}

  // 1. Publish Carpool
  @Post('carpools')
  async createCarpool(@Body() dto: any) {
    return this.carpoolsService.createCarpool(dto);
  }

  // 2. Search Carpools
  @Get('carpools/search')
  async searchCarpools(
    @Query('origin') origin?: string,
    @Query('destination') destination?: string,
    @Query('date') date?: string,
    @Query('seats') seats?: number,
  ) {
    return this.carpoolsService.searchCarpools({ origin, destination, date, seats });
  }

  // 3. Get Carpool Details
  @Get('carpools/:id')
  async getCarpoolById(@Param('id') id: string) {
    return this.carpoolsService.getCarpoolById(id);
  }

  // 4. Request Reservation
  @Post('carpools/:id/reservations')
  async requestReservation(
    @Param('id') carpoolId: string,
    @Body() dto: any,
  ) {
    return this.carpoolsService.requestReservation(carpoolId, dto);
  }

  // 5. Driver Accept Reservation
  @Post('carpool-reservations/:id/accept')
  async acceptReservation(
    @Param('id') reservationId: string,
    @Body('driverId') driverId?: string,
  ) {
    return this.carpoolsService.acceptReservation(reservationId, driverId);
  }

  // 6. Driver Reject Reservation
  @Post('carpool-reservations/:id/reject')
  async rejectReservation(
    @Param('id') reservationId: string,
    @Body('reason') reason?: string,
  ) {
    return this.carpoolsService.rejectReservation(reservationId, reason);
  }

  // 7. Cancel Reservation
  @Post('carpool-reservations/:id/cancel')
  async cancelReservation(@Param('id') reservationId: string) {
    return this.carpoolsService.cancelReservation(reservationId);
  }

  // 8. Driver: Start Trip
  @Post('carpools/:id/start')
  async startCarpool(@Param('id') carpoolId: string) {
    return this.carpoolsService.startCarpool(carpoolId);
  }

  // 9. Driver: Complete Trip & Payout
  @Post('carpools/:id/complete')
  async completeCarpool(@Param('id') carpoolId: string) {
    return this.carpoolsService.completeCarpool(carpoolId);
  }

  // 10. List Driver Carpools
  @Get('driver/carpools')
  async getDriverCarpools(@Query('driverId') driverId: string = 'carlos-oliveira') {
    return this.carpoolsService.getDriverCarpools(driverId);
  }

  // 11. List Passenger Reservations
  @Get('passenger/carpool-reservations')
  async getPassengerReservations(@Query('passengerId') passengerId: string = 'marina-silva') {
    return this.carpoolsService.getPassengerReservations(passengerId);
  }

  // 12. Chat Messages
  @Get('carpools/:id/messages')
  async getMessages(@Param('id') carpoolId: string) {
    return this.carpoolsService.getMessages(carpoolId);
  }

  @Post('carpools/:id/messages')
  async sendMessage(
    @Param('id') carpoolId: string,
    @Body() dto: any,
  ) {
    return this.carpoolsService.sendMessage(carpoolId, dto);
  }

  // 13. Carpool Alerts
  @Post('carpool-alerts')
  async createAlert(@Body() dto: any) {
    return this.carpoolsService.createAlert(dto);
  }

  @Get('carpool-alerts')
  async getPassengerAlerts(@Query('passengerId') passengerId: string = 'marina-silva') {
    return this.carpoolsService.getPassengerAlerts(passengerId);
  }

  // 14. Reviews
  @Post('carpools/:id/reviews')
  async createReview(
    @Param('id') carpoolId: string,
    @Body() dto: any,
  ) {
    return this.carpoolsService.createReview(carpoolId, dto);
  }

  // 15. Admin Metrics
  @Get('admin/carpools/metrics')
  async getAdminCarpoolMetrics() {
    return this.carpoolsService.getAdminCarpoolMetrics();
  }
}
