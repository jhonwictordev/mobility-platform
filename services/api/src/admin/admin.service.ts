import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { DriversService } from '../drivers/drivers.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { TripsService } from '../trips/trips.service';
import { PaymentsService } from '../payments/payments.service';
import { AuditService } from '../audit/audit.service';
import { ApprovalStatus } from '../database/entities';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly driversService: DriversService,
    private readonly vehiclesService: VehiclesService,
    private readonly tripsService: TripsService,
    private readonly paymentsService: PaymentsService,
    private readonly auditService: AuditService,
  ) {}

  async getDashboardMetrics() {
    const [
      totalUsers,
      totalDrivers,
      onlineDrivers,
      totalTrips,
      activeTrips,
      totalRevenue,
      recentLogs,
    ] = await Promise.all([
      this.usersService.count(),
      this.driversService.count(),
      this.driversService.countOnline(),
      this.tripsService.count(),
      this.tripsService.countActive(),
      this.paymentsService.getTotalRevenue(),
      this.auditService.getRecentLogs(10),
    ]);

    return {
      totalUsers,
      totalDrivers,
      onlineDrivers,
      totalTrips,
      activeTrips,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      recentLogs,
    };
  }

  async approveDriver(driverId: string) {
    return this.driversService.setApproval(driverId, ApprovalStatus.APPROVED);
  }

  async rejectDriver(driverId: string) {
    return this.driversService.setApproval(driverId, ApprovalStatus.REJECTED);
  }

  async approveVehicle(vehicleId: string) {
    return this.vehiclesService.updateApproval(vehicleId, true);
  }
}
