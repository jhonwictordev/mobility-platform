import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle, VehicleCategory } from '../database/entities';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
  ) {}

  async create(data: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = this.vehicleRepo.create(data);
    return this.vehicleRepo.save(vehicle);
  }

  async findByDriverId(driverId: string): Promise<Vehicle[]> {
    return this.vehicleRepo.find({
      where: { driverId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id },
      relations: { driver: true },
    });
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');
    return vehicle;
  }

  async updateApproval(id: string, approved: boolean, notes?: string): Promise<Vehicle> {
    const vehicle = await this.findById(id);
    vehicle.approved = approved;
    if (notes !== undefined) {
      vehicle.inspectionNotes = notes;
    }
    return this.vehicleRepo.save(vehicle);
  }

  async updateCategory(id: string, category: VehicleCategory): Promise<Vehicle> {
    const vehicle = await this.findById(id);
    vehicle.category = category;
    return this.vehicleRepo.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepo.find({
      relations: { driver: true },
    });
  }

  async count(): Promise<number> {
    return this.vehicleRepo.count();
  }
}
