import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
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
      relations: { user: true, vehicles: true, documents: true },
    });
  }

  async findById(id: string): Promise<Driver> {
    const driver = await this.driverRepo.findOne({
      where: { id },
      relations: { user: true, vehicles: true, documents: true },
    });
    if (!driver) throw new NotFoundException('Motorista não encontrado');
    return driver;
  }

  async updateProfile(
    userId: string,
    data: {
      licenseNumber?: string;
      cnhCategory?: string;
      pixKey?: string;
      pixKeyType?: string;
    },
  ): Promise<Driver> {
    const driver = await this.findByUserId(userId);
    if (!driver) throw new NotFoundException('Perfil de motorista não encontrado');

    if (data.licenseNumber !== undefined) driver.licenseNumber = data.licenseNumber.trim();
    if (data.cnhCategory !== undefined) driver.cnhCategory = data.cnhCategory.trim();
    if (data.pixKey !== undefined) driver.pixKey = data.pixKey.trim();
    if (data.pixKeyType !== undefined) driver.pixKeyType = data.pixKeyType.trim();

    return this.driverRepo.save(driver);
  }

  async setStatus(id: string, status: DriverStatus): Promise<Driver> {
    const driver = await this.findById(id);

    // Business Logic: Unapproved or suspended drivers cannot go online
    if (status === DriverStatus.ONLINE && driver.approvalStatus !== ApprovalStatus.APPROVED) {
      throw new ForbiddenException(
        'Cadastro em análise ou suspenso. Somente motoristas aprovados pela vistoria SIMBORA podem ficar ONLINE.',
      );
    }

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
    rejectionReason?: string,
  ): Promise<Driver> {
    const driver = await this.findById(id);
    driver.approvalStatus = approvalStatus;
    if (rejectionReason !== undefined) {
      driver.rejectionReason = rejectionReason;
    }
    if (approvalStatus !== ApprovalStatus.APPROVED) {
      driver.status = DriverStatus.OFFLINE;
    }
    const updated = await this.driverRepo.save(driver);

    // Notify driver in real time
    this.wsGateway.emitToDriver(id, 'driver:approval_updated', {
      approvalStatus,
      rejectionReason: driver.rejectionReason,
    });

    return updated;
  }

  async getPublicProfile(id: string) {
    const driver = await this.findById(id);
    const approvedVehicle = driver.vehicles?.find((v) => v.approved && v.isActive);

    return {
      id: driver.id,
      name: driver.user?.name || 'Motorista Parceiro',
      avatar: driver.user?.avatar || null,
      rating: driver.rating,
      totalTrips: driver.totalTrips,
      status: driver.status,
      approvalStatus: driver.approvalStatus,
      verifiedPartner: driver.approvalStatus === ApprovalStatus.APPROVED,
      vehicle: approvedVehicle
        ? {
            make: approvedVehicle.make,
            model: approvedVehicle.model,
            year: approvedVehicle.year,
            color: approvedVehicle.color,
            plateNumber: approvedVehicle.plateNumber,
            category: approvedVehicle.category,
          }
        : null,
    };
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
      relations: { user: true, vehicles: true, documents: true },
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
