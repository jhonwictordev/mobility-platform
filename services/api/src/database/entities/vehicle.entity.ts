// ============================================================
// Entity: Vehicle
// Represents vehicles registered by drivers
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
import { Driver } from './driver.entity';

export enum VehicleCategory {
  ECONOMY = 'economy',
  COMFORT = 'comfort',
  PREMIUM = 'premium',
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  driverId!: string;

  @ManyToOne(() => Driver, (driver) => driver.vehicles)
  @JoinColumn({ name: 'driverId' })
  driver!: Driver;

  @Column({ type: 'varchar', length: 50 })
  make!: string;

  @Column({ type: 'varchar', length: 50 })
  model!: string;

  @Column({ type: 'integer' })
  year!: number;

  @Column({ type: 'varchar', length: 30 })
  color!: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  plateNumber!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  renavam!: string | null;

  @Column({ type: 'varchar', default: VehicleCategory.ECONOMY })
  category!: VehicleCategory;

  @Column({ type: 'integer', default: 4 })
  seats!: number;

  @Column({ type: 'boolean', default: false })
  approved!: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  inspectionNotes!: string | null;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
