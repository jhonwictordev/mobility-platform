// ============================================================
// Entity: User
// Represents passengers, drivers, and admin users
// ============================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SavedPlace } from './saved-place.entity';

export enum UserRole {
  PASSENGER = 'passenger',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', unique: true, length: 255 })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', default: UserRole.PASSENGER })
  role!: UserRole;

  @Column({ type: 'varchar', nullable: true })
  avatar!: string | null;

  @Column({ type: 'boolean', default: false })
  phoneVerified!: boolean;

  @Column({ type: 'varchar', length: 10, nullable: true })
  otpCode!: string | null;

  @Column({ type: 'datetime', nullable: true })
  otpExpiresAt!: Date | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  resetToken!: string | null;

  @Column({ type: 'datetime', nullable: true })
  resetTokenExpiresAt!: Date | null;

  @Column({ type: 'text', nullable: true })
  preferences!: string | null; // JSON: { preferredCategory, accessibility, emergencyContact }

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => SavedPlace, (place) => place.user)
  savedPlaces?: SavedPlace[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
