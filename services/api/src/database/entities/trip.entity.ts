// ============================================================
// Entity: Trip
// Core entity with full state machine support
// ============================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Driver } from './driver.entity';
import { Vehicle } from './vehicle.entity';
import { VehicleCategory } from './vehicle.entity';

export enum TripStatus {
  REQUESTED = 'REQUESTED',
  SEARCHING = 'SEARCHING',
  ACCEPTED = 'ACCEPTED',
  DRIVER_ARRIVING = 'DRIVER_ARRIVING',
  DRIVER_ARRIVED = 'DRIVER_ARRIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED_BY_PASSENGER = 'CANCELLED_BY_PASSENGER',
  CANCELLED_BY_DRIVER = 'CANCELLED_BY_DRIVER',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
}

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  passengerId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'passengerId' })
  passenger!: User;

  @Column({ type: 'varchar', nullable: true })
  driverId!: string | null;

  @ManyToOne(() => Driver, { nullable: true })
  @JoinColumn({ name: 'driverId' })
  driver!: Driver | null;

  @Column({ type: 'varchar', nullable: true })
  vehicleId!: string | null;

  @ManyToOne(() => Vehicle, { nullable: true })
  @JoinColumn({ name: 'vehicleId' })
  vehicle!: Vehicle | null;

  @Column({ type: 'varchar', default: TripStatus.REQUESTED })
  status!: TripStatus;

  @Column({ type: 'float' })
  originLat!: number;

  @Column({ type: 'float' })
  originLng!: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  originAddress!: string | null;

  @Column({ type: 'float' })
  destLat!: number;

  @Column({ type: 'float' })
  destLng!: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  destAddress!: string | null;

  @Column({ type: 'float', nullable: true })
  distanceKm!: number | null;

  @Column({ type: 'float', nullable: true })
  durationMin!: number | null;

  @Column({ type: 'float', nullable: true })
  fare!: number | null;

  @Column({ type: 'varchar', default: VehicleCategory.ECONOMY })
  category!: VehicleCategory;

  @Column({ type: 'float', default: 1.0 })
  surgeMultiplier!: number;

  @CreateDateColumn()
  requestedAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  acceptedAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  startedAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  completedAt!: Date | null;

  @Column({ type: 'datetime', nullable: true })
  cancelledAt!: Date | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  cancelReason!: string | null;

  @Column({ type: 'float', nullable: true })
  rating!: number | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  review!: string | null;

  @UpdateDateColumn()
  updatedAt!: Date;
}
