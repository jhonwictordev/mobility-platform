// ============================================================
// Entity: Document
// Driver documents for verification (license, insurance, etc.)
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

export enum DocumentType {
  DRIVERS_LICENSE = 'drivers_license',
  VEHICLE_INSURANCE = 'vehicle_insurance',
  VEHICLE_REGISTRATION = 'vehicle_registration',
  BACKGROUND_CHECK = 'background_check',
  PROFILE_PHOTO = 'profile_photo',
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  driverId!: string;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driverId' })
  driver!: Driver;

  @Column({ type: 'varchar' })
  type!: DocumentType;

  @Column({ type: 'varchar' })
  fileUrl!: string;

  @Column({ type: 'varchar', default: DocumentStatus.PENDING })
  status!: DocumentStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  reviewNotes!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
