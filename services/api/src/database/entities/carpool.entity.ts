import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum CarpoolStatus {
  PUBLISHED = 'PUBLISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum BookingMode {
  INSTANT = 'INSTANT',
  MANUAL = 'MANUAL',
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum LuggageSize {
  NONE = 'NONE',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

@Entity('carpool_trips')
export class CarpoolTrip {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  driverId!: string;

  @Column({ type: 'varchar', nullable: true })
  driverName!: string;

  @Column({ type: 'varchar', nullable: true })
  vehicleModel!: string;

  @Column({ type: 'varchar', nullable: true })
  vehiclePlate!: string;

  @Column({ type: 'varchar' })
  originCity!: string;

  @Column({ type: 'varchar', default: '' })
  originAddress!: string;

  @Column({ type: 'varchar' })
  destinationCity!: string;

  @Column({ type: 'varchar', default: '' })
  destinationAddress!: string;

  @Column({ type: 'varchar' })
  departureDate!: string; // YYYY-MM-DD

  @Column({ type: 'varchar' })
  departureTime!: string; // HH:MM

  @Column({ type: 'integer', default: 35 })
  estimatedDurationMin!: number;

  @Column({ type: 'integer', default: 3 })
  totalSeats!: number;

  @Column({ type: 'integer', default: 3 })
  availableSeats!: number;

  @Column({ type: 'float', default: 25.0 })
  pricePerSeat!: number;

  @Column({ type: 'varchar', default: BookingMode.MANUAL })
  bookingMode!: BookingMode;

  @Column({ type: 'varchar', default: CarpoolStatus.PUBLISHED })
  status!: CarpoolStatus;

  @Column({ type: 'text', nullable: true })
  notes!: string;

  @Column({ type: 'text', nullable: true })
  intermediateStopsJson!: string; // JSON array of stops

  @Column({ type: 'varchar', default: LuggageSize.MEDIUM })
  luggageSize!: LuggageSize;

  @Column({ type: 'boolean', default: false })
  allowSmoking!: boolean;

  @Column({ type: 'boolean', default: false })
  allowPets!: boolean;

  @Column({ type: 'boolean', default: true })
  hasAirConditioning!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity('carpool_reservations')
export class CarpoolReservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  carpoolTripId!: string;

  @Column({ type: 'varchar' })
  passengerId!: string;

  @Column({ type: 'varchar' })
  passengerName!: string;

  @Column({ type: 'varchar', default: '' })
  passengerPhone!: string;

  @Column({ type: 'varchar', nullable: true })
  pickupCity!: string;

  @Column({ type: 'varchar', nullable: true })
  dropoffCity!: string;

  @Column({ type: 'integer', default: 1 })
  seatsCount!: number;

  @Column({ type: 'float', default: 25.0 })
  totalPrice!: number;

  @Column({ type: 'varchar', default: ReservationStatus.PENDING })
  status!: ReservationStatus;

  @Column({ type: 'text', nullable: true })
  passengerNotes!: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity('carpool_alerts')
export class CarpoolAlert {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  passengerId!: string;

  @Column({ type: 'varchar' })
  originCity!: string;

  @Column({ type: 'varchar' })
  destinationCity!: string;

  @Column({ type: 'varchar', nullable: true })
  desiredDate!: string;

  @Column({ type: 'integer', default: 1 })
  seatsNeeded!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity('carpool_messages')
export class CarpoolMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  carpoolTripId!: string;

  @Column({ type: 'varchar' })
  senderId!: string;

  @Column({ type: 'varchar' })
  senderName!: string;

  @Column({ type: 'text' })
  message!: string;

  @CreateDateColumn()
  sentAt!: Date;
}

@Entity('carpool_reviews')
export class CarpoolReview {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  carpoolTripId!: string;

  @Column({ type: 'varchar' })
  reviewerId!: string;

  @Column({ type: 'varchar' })
  reviewedUserId!: string;

  @Column({ type: 'integer', default: 5 })
  rating!: number;

  @Column({ type: 'text', nullable: true })
  comment!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity('carpool_recurring_schedules')
export class CarpoolRecurringSchedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  driverId!: string;

  @Column({ type: 'varchar' })
  originCity!: string;

  @Column({ type: 'varchar' })
  destinationCity!: string;

  @Column({ type: 'varchar' })
  departureTime!: string;

  @Column({ type: 'varchar' }) // e.g. "MON,WED,FRI"
  daysOfWeek!: string;

  @Column({ type: 'integer', default: 3 })
  seats!: number;

  @Column({ type: 'float', default: 25.0 })
  pricePerSeat!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity('carpool_financial_transactions')
export class CarpoolFinancialTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  carpoolTripId!: string;

  @Column({ type: 'varchar' })
  reservationId!: string;

  @Column({ type: 'varchar' })
  payerId!: string;

  @Column({ type: 'varchar' })
  receiverId!: string;

  @Column({ type: 'float' })
  grossAmount!: number;

  @Column({ type: 'float', default: 3.75 })
  serviceFee!: number;

  @Column({ type: 'float' })
  netAmount!: number;

  @Column({ type: 'varchar', default: 'PIX_SIMULATED' })
  paymentMethod!: string;

  @Column({ type: 'varchar', default: 'CREDITED_VIA_PIX' })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
