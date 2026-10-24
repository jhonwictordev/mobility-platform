// ============================================================
// Entity: DriverLocation
// Tracks driver location history for real-time updates
// ============================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Driver } from './driver.entity';

@Entity('driver_locations')
@Index(['driverId', 'timestamp'])
export class DriverLocation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  driverId!: string;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driverId' })
  driver!: Driver;

  @Column({ type: 'float' })
  lat!: number;

  @Column({ type: 'float' })
  lng!: number;

  @Column({ type: 'float', nullable: true })
  heading!: number | null;

  @Column({ type: 'float', nullable: true })
  speed!: number | null;

  @CreateDateColumn()
  timestamp!: Date;
}
