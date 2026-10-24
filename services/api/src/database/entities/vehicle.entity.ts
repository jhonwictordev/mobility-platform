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

  @Column({ length: 50 })
  make!: string;

  @Column({ length: 50 })
  model!: string;

  @Column()
  year!: number;

  @Column({ length: 30 })
  color!: string;

  @Column({ length: 20, unique: true })
  plateNumber!: string;

  @Column({ type: 'varchar', default: VehicleCategory.ECONOMY })
  category!: VehicleCategory;

  @Column({ default: 4 })
  seats!: number;

  @Column({ default: false })
  approved!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
