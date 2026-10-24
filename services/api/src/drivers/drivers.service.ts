import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver, DriverStatus, ApprovalStatus } from '../database/entities';
import { MobilityWebSocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,
    private readonly wsGateway: MobilityWebSocketGateway,
  ) {}

  async create(data: Partial<Driver>): Promise<Driver> {
    const driver = this.driverRepo.create(data);
    return this.driverRepo.save(driver);
  }

  async findByUserId(userId: string): Promise<Driver | null> {
    return this.driverRepo.findOne({
      where: { userId },
      relations: { user: true, vehicles: true },
    });
  }

  async findById(id: string): Promise<Driver> {
    const driver = await this.driverRepo.findOne({
      where: { id },
      relations: { user: true, vehicles: true },
    });
    if (!driver) throw new NotFoundException('Motorista não encontrado');
    return driver;
  }

  async setStatus(id: string, status: DriverStatus): Promise<Driver> {
    const driver = await this.findById(id);
    driver.status = status;
    const updated = await this.driverRepo.save(driver);

    // Notify realtime
    this.wsGateway.emitToDriver(id, 'driver:status_changed', { status });
    this.wsGateway.broadcastAdmin('admin:driver_status', { driverId: id, status });

    return updated;
  }

  async updateLocation(
    id: string,
    lat: number,
    lng: number,
  ): Promise<Driver> {
    const driver = await this.findById(id);
    driver.currentLat = lat;
    driver.currentLng = lng;
    return this.driverRepo.save(driver);
  }

  async setApproval(
    id: string,
    approvalStatus: ApprovalStatus,
  ): Promise<Driver> {
    const driver = await this.findById(id);
    driver.approvalStatus = approvalStatus;
    return this.driverRepo.save(driver);
  }

  async findOnlineDrivers(): Promise<Driver[]> {
    return this.driverRepo.find({
      where: {
        status: DriverStatus.ONLINE,
        approvalStatus: ApprovalStatus.APPROVED,
      },
      relations: { user: true, vehicles: true },
    });
  }

  async findAll(): Promise<Driver[]> {
    return this.driverRepo.find({
      relations: { user: true, vehicles: true },
    });
  }

  async count(): Promise<number> {
    return this.driverRepo.count();
  }

  async countOnline(): Promise<number> {
    return this.driverRepo.count({
      where: { status: DriverStatus.ONLINE },
    });
  }
}
