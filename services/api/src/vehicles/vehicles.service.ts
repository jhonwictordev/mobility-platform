import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Vehicle,
  VehicleCategory,
  VehicleChangeRequest,
  VehicleChangeRequestStatus,
} from '../database/entities';
import { MobilityWebSocketGateway } from '../websocket/websocket.gateway';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(VehicleChangeRequest)
    private readonly changeRequestRepo: Repository<VehicleChangeRequest>,
    private readonly wsGateway: MobilityWebSocketGateway,
    private readonly auditService: AuditService,
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

  // ============================================================
  // VEHICLE CHANGE REQUEST WORKFLOW (SIMBORA 3.4)
  // ============================================================

  async createChangeRequest(
    driverId: string,
    currentVehicleId: string | null,
    data: {
      requestedMake: string;
      requestedModel: string;
      requestedYear: number;
      requestedColor: string;
      requestedPlate: string;
      requestedRenavam?: string;
      requestedCategory?: VehicleCategory;
      requestedSeats?: number;
      reason: string;
      notes?: string;
    },
  ): Promise<VehicleChangeRequest> {
    if (!data.requestedMake || !data.requestedModel || !data.requestedPlate || !data.reason) {
      throw new BadRequestException('Fabricante, modelo, placa e motivo são obrigatórios.');
    }

    const request = this.changeRequestRepo.create({
      driverId,
      currentVehicleId: currentVehicleId || undefined,
      requestedMake: data.requestedMake.trim(),
      requestedModel: data.requestedModel.trim(),
      requestedYear: Number(data.requestedYear) || new Date().getFullYear(),
      requestedColor: data.requestedColor ? data.requestedColor.trim() : 'Branco',
      requestedPlate: data.requestedPlate.trim().toUpperCase(),
      requestedRenavam: data.requestedRenavam ? data.requestedRenavam.trim() : undefined,
      requestedCategory: data.requestedCategory || VehicleCategory.ECONOMY,
      requestedSeats: Number(data.requestedSeats) || 4,
      reason: data.reason.trim(),
      notes: data.notes ? data.notes.trim() : undefined,
      status: VehicleChangeRequestStatus.PENDING,
    });

    const saved = await this.changeRequestRepo.save(request);

    // Broadcast real-time notification to SIMBORA Admin
    this.wsGateway.broadcastAdmin('admin:vehicle_change_requested', {
      requestId: saved.id,
      driverId,
      requestedMake: saved.requestedMake,
      requestedModel: saved.requestedModel,
      requestedPlate: saved.requestedPlate,
      createdAt: saved.createdAt,
    });

    await this.auditService.log(
      'VehicleChangeRequest',
      saved.id,
      'CREATE_VEHICLE_CHANGE_REQUEST',
      driverId,
      {
        requestedPlate: saved.requestedPlate,
        reason: saved.reason,
      },
    );

    return saved;
  }

  async findAllChangeRequests(status?: VehicleChangeRequestStatus): Promise<VehicleChangeRequest[]> {
    if (status) {
      return this.changeRequestRepo.find({
        where: { status },
        order: { createdAt: 'DESC' },
        relations: { driver: { user: true }, currentVehicle: true },
      });
    }
    return this.changeRequestRepo.find({
      order: { createdAt: 'DESC' },
      relations: { driver: { user: true }, currentVehicle: true },
    });
  }

  async findChangeRequestsByDriverId(driverId: string): Promise<VehicleChangeRequest[]> {
    return this.changeRequestRepo.find({
      where: { driverId },
      order: { createdAt: 'DESC' },
      relations: { currentVehicle: true },
    });
  }

  async findChangeRequestById(id: string): Promise<VehicleChangeRequest> {
    const request = await this.changeRequestRepo.findOne({
      where: { id },
      relations: { driver: { user: true }, currentVehicle: true },
    });
    if (!request) {
      throw new NotFoundException('Solicitação de troca de veículo não encontrada');
    }
    return request;
  }

  async approveChangeRequest(
    id: string,
    reviewerId?: string,
    notes?: string,
  ): Promise<{ request: VehicleChangeRequest; vehicle: Vehicle }> {
    const request = await this.findChangeRequestById(id);

    if (request.status !== VehicleChangeRequestStatus.PENDING && request.status !== VehicleChangeRequestStatus.IN_REVIEW) {
      throw new BadRequestException(`Esta solicitação já foi processada (Status: ${request.status}).`);
    }

    let targetVehicle: Vehicle;
    if (request.currentVehicleId) {
      targetVehicle = await this.findById(request.currentVehicleId);
      targetVehicle.make = request.requestedMake;
      targetVehicle.model = request.requestedModel;
      targetVehicle.year = request.requestedYear;
      targetVehicle.color = request.requestedColor;
      targetVehicle.plateNumber = request.requestedPlate;
      targetVehicle.category = request.requestedCategory;
      targetVehicle.seats = request.requestedSeats;
      if (request.requestedRenavam) targetVehicle.renavam = request.requestedRenavam;
      targetVehicle.approved = true;
      targetVehicle.isActive = true;
      targetVehicle.inspectionNotes = notes || 'Aprovado via Solicitação de Troca de Veículo';
      targetVehicle = await this.vehicleRepo.save(targetVehicle);
    } else {
      targetVehicle = await this.create({
        driverId: request.driverId,
        make: request.requestedMake,
        model: request.requestedModel,
        year: request.requestedYear,
        color: request.requestedColor,
        plateNumber: request.requestedPlate,
        category: request.requestedCategory,
        seats: request.requestedSeats,
        renavam: request.requestedRenavam,
        approved: true,
        isActive: true,
        inspectionNotes: notes || 'Aprovado via Solicitação de Troca de Veículo',
      });
    }

    request.status = VehicleChangeRequestStatus.APPROVED;
    request.reviewedBy = reviewerId || 'ADMIN';
    request.reviewedAt = new Date();
    if (notes) request.notes = notes;
    const savedRequest = await this.changeRequestRepo.save(request);

    // Notify Driver via WebSocket
    this.wsGateway.emitToDriver(request.driverId, 'driver:vehicle_change_approved', {
      requestId: savedRequest.id,
      vehicle: {
        id: targetVehicle.id,
        make: targetVehicle.make,
        model: targetVehicle.model,
        year: targetVehicle.year,
        color: targetVehicle.color,
        plateNumber: targetVehicle.plateNumber,
        category: targetVehicle.category,
      },
      message: 'Sua solicitação de alteração de veículo foi aprovada com sucesso!',
    });

    await this.auditService.log(
      'VehicleChangeRequest',
      savedRequest.id,
      'APPROVE_VEHICLE_CHANGE_REQUEST',
      reviewerId || 'ADMIN',
      {
        vehicleId: targetVehicle.id,
        plateNumber: targetVehicle.plateNumber,
      },
    );

    return { request: savedRequest, vehicle: targetVehicle };
  }

  async rejectChangeRequest(
    id: string,
    rejectionReason: string,
    reviewerId?: string,
  ): Promise<VehicleChangeRequest> {
    if (!rejectionReason || !rejectionReason.trim()) {
      throw new BadRequestException('A justificativa de reprovação é obrigatória.');
    }

    const request = await this.findChangeRequestById(id);

    if (request.status !== VehicleChangeRequestStatus.PENDING && request.status !== VehicleChangeRequestStatus.IN_REVIEW) {
      throw new BadRequestException(`Esta solicitação já foi processada (Status: ${request.status}).`);
    }

    request.status = VehicleChangeRequestStatus.REJECTED;
    request.rejectionReason = rejectionReason.trim();
    request.reviewedBy = reviewerId || 'ADMIN';
    request.reviewedAt = new Date();
    const savedRequest = await this.changeRequestRepo.save(request);

    // Notify Driver via WebSocket
    this.wsGateway.emitToDriver(request.driverId, 'driver:vehicle_change_rejected', {
      requestId: savedRequest.id,
      rejectionReason: savedRequest.rejectionReason,
      message: 'Sua solicitação de alteração de veículo foi rejeitada.',
    });

    await this.auditService.log(
      'VehicleChangeRequest',
      savedRequest.id,
      'REJECT_VEHICLE_CHANGE_REQUEST',
      reviewerId || 'ADMIN',
      {
        rejectionReason: savedRequest.rejectionReason,
      },
    );

    return savedRequest;
  }
}
