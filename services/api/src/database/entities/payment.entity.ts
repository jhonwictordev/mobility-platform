// ============================================================
// Entity: Payment
// Represents payment transactions for completed trips
// ============================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Trip } from './trip.entity';

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  WALLET = 'wallet',
  PIX = 'pix',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  tripId!: string;

  @OneToOne(() => Trip)
  @JoinColumn({ name: 'tripId' })
  trip!: Trip;

  @Column({ type: 'float' })
  amount!: number;

  @Column({ type: 'float', default: 0 })
  platformFee!: number;

  @Column({ type: 'float', default: 0 })
  driverPayout!: number;

  @Column({ type: 'varchar', default: PaymentMethod.CASH })
  method!: PaymentMethod;

  @Column({ type: 'varchar', default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ type: 'varchar', nullable: true })
  transactionId!: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  pixCopyPaste!: string | null;

  @Column({ type: 'float', nullable: true })
  tip!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
