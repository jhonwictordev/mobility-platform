// ============================================================
// Entity: ChatMessage
// Represents in-ride chat messages between passenger and driver
// ============================================================
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Trip } from './trip.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36 })
  tripId!: string;

  @ManyToOne(() => Trip, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tripId' })
  trip?: Trip;

  @Column({ type: 'varchar', length: 36 })
  senderId!: string;

  @Column({ type: 'varchar', length: 20 })
  senderRole!: 'passenger' | 'driver' | 'admin';

  @Column({ type: 'varchar', length: 1000 })
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
