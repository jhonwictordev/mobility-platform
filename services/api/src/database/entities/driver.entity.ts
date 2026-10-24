// ============================================================
// Entity: Driver
// Represents driver profiles with status and location tracking
// ============================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Vehicle } from './vehicle.entity';
import { Document } from './document.entity';

export enum DriverStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  BUSY = 'busy',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  userId!: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'varchar', length: 50 })
  licenseNumber!: string;

  @Column({ type: 'varchar', length: 10, default: 'B' })
  cnhCategory!: string; // 'B' | 'C' | 'D' | 'AB'

  @Column({ type: 'varchar', length: 100, nullable: true })
  pixKey!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  pixKeyType!: string | null; // 'CPF' | 'EMAIL' | 'PHONE' | 'RANDOM'

  @Column({ type: 'varchar', default: DriverStatus.OFFLINE })
  status!: DriverStatus;

  @Column({ type: 'float', default: 5.0 })
  rating!: number;

  @Column({ type: 'integer', default: 0 })
  totalTrips!: number;

  @Column({ type: 'float', nullable: true })
  currentLat!: number | null;

  @Column({ type: 'float', nullable: true })
  currentLng!: number | null;

  @Column({ type: 'varchar', default: ApprovalStatus.PENDING })
  approvalStatus!: ApprovalStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  rejectionReason!: string | null;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.driver)
  vehicles!: Vehicle[];

  @OneToMany(() => Document, (doc) => doc.driver)
  documents?: Document[];

  get vehicle(): Vehicle | undefined {
    return this.vehicles && this.vehicles.length > 0 ? this.vehicles[0] : undefined;
  }

  set vehicle(v: Vehicle | undefined) {
    if (v) {
      this.vehicles = [v];
    }
  }

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
