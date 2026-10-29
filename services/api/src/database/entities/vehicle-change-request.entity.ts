import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Driver } from './driver.entity';
import { Vehicle, VehicleCategory } from './vehicle.entity';

export enum VehicleChangeRequestStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

@Entity('vehicle_change_requests')
export class VehicleChangeRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  driverId!: string;

  @ManyToOne(() => Driver, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driverId' })
  driver!: Driver;

  @Column({ nullable: true })
  currentVehicleId?: string;

  @ManyToOne(() => Vehicle, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'currentVehicleId' })
  currentVehicle?: Vehicle;

  @Column()
  requestedMake!: string;

  @Column()
  requestedModel!: string;

  @Column()
  requestedYear!: number;

  @Column()
  requestedColor!: string;

  @Column()
  requestedPlate!: string;

  @Column({ nullable: true })
  requestedRenavam?: string;

  @Column({
    type: 'text',
    default: VehicleCategory.ECONOMY,
  })
  requestedCategory!: VehicleCategory;

  @Column({ default: 4 })
  requestedSeats!: number;

  @Column({ type: 'text' })
  reason!: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({
    type: 'text',
    default: VehicleChangeRequestStatus.PENDING,
  })
  status!: VehicleChangeRequestStatus;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ nullable: true })
  reviewedBy?: string;

  @Column({ type: 'datetime', nullable: true })
  reviewedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
