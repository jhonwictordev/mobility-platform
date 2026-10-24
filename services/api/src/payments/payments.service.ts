import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentMethod, PaymentStatus, Trip } from '../database/entities';
import { AuditService } from '../audit/audit.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Trip)
    private readonly tripRepo: Repository<Trip>,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Process payment with platform fee deduction and driver payout calculation
   */
  async processPayment(
    tripId: string,
    amount: number,
    method: PaymentMethod = PaymentMethod.CREDIT_CARD,
    tip = 0,
    pixCopyPaste?: string,
  ): Promise<Payment> {
    const platformFeeRate = 0.15; // 15% SIMBORA commission
    const platformFee = Math.round(amount * platformFeeRate * 100) / 100;
    const driverPayout = Math.round((amount - platformFee + (Number(tip) || 0)) * 100) / 100;

    let payment = await this.paymentRepo.findOne({ where: { tripId } });
    if (!payment) {
      payment = this.paymentRepo.create({
        tripId,
        amount,
        platformFee,
        driverPayout,
        tip: tip || 0,
        method,
        status: PaymentStatus.COMPLETED,
        pixCopyPaste: pixCopyPaste || null,
        transactionId: `tx_simbora_${uuidv4().substring(0, 8)}`,
      });
    } else {
      payment.amount = amount;
      payment.platformFee = platformFee;
      payment.driverPayout = driverPayout;
      payment.tip = tip || 0;
      payment.method = method;
      payment.status = PaymentStatus.COMPLETED;
      if (pixCopyPaste) payment.pixCopyPaste = pixCopyPaste;
    }

    const saved = await this.paymentRepo.save(payment);

    await this.auditService.log(
      'Payment',
      saved.id,
      'PAYMENT_PROCESSED',
      undefined,
      { tripId, amount, platformFee, driverPayout, method, status: PaymentStatus.COMPLETED },
    );

    return saved;
  }

  // Backwards compatibility alias
  async processTestPayment(
    tripId: string,
    amount: number,
    method: PaymentMethod = PaymentMethod.CREDIT_CARD,
  ): Promise<Payment> {
    return this.processPayment(tripId, amount, method);
  }

  /**
   * Generate Dynamic PIX payload for trip
   */
  async generatePixPayload(tripId: string, amount: number) {
    const txId = uuidv4().replace(/-/g, '').slice(0, 25);
    const formattedAmount = Number(amount).toFixed(2);
    const pixCopyPaste = `00020126580014br.gov.bcb.pix0136${uuidv4()}520400005303986540${formattedAmount.length}${formattedAmount}5802BR5916SIMBORA ALAGOAS6007PENEDO62070503${txId}6304`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCopyPaste)}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    return {
      tripId,
      amount: Number(amount),
      currency: 'BRL',
      pixCopyPaste,
      qrCodeUrl,
      expiresAt,
    };
  }

  /**
   * Get detailed receipt with itemized breakdown
   */
  async getDetailedReceipt(tripId: string) {
    const trip = await this.tripRepo.findOne({
      where: { id: tripId },
      relations: {
        passenger: true,
        driver: { user: true, vehicles: true },
        vehicle: true,
      },
    });

    if (!trip) throw new NotFoundException('Corrida não encontrada para emissão de recibo');

    const payment = await this.paymentRepo.findOne({ where: { tripId } });

    return {
      receiptNumber: `REC-${trip.id.slice(0, 8).toUpperCase()}`,
      tripId: trip.id,
      date: trip.completedAt || trip.requestedAt,
      passenger: {
        id: trip.passengerId,
        name: trip.passenger?.name || 'Passageiro SIMBORA',
      },
      driver: trip.driver
        ? {
            name: trip.driver.user?.name || 'Motorista Parceiro',
            vehicle: trip.driver.vehicle
              ? `${trip.driver.vehicle.make} ${trip.driver.vehicle.model} (${trip.driver.vehicle.plateNumber})`
              : 'Veículo Homologado',
          }
        : null,
      origin: trip.originAddress,
      destination: trip.destAddress,
      distanceKm: trip.distanceKm,
      durationMin: trip.durationMin,
      category: trip.category,
      financial: {
        totalFare: Number(trip.fare || 0),
        tip: payment?.tip || 0,
        platformFee: payment?.platformFee || Math.round(Number(trip.fare || 0) * 0.15 * 100) / 100,
        driverNetPayout: payment?.driverPayout || Math.round(Number(trip.fare || 0) * 0.85 * 100) / 100,
        paymentMethod: payment?.method || PaymentMethod.CASH,
        paymentStatus: payment?.status || PaymentStatus.COMPLETED,
        transactionId: payment?.transactionId || 'PENDING',
      },
    };
  }

  async findByTripId(tripId: string): Promise<Payment | null> {
    return this.paymentRepo.findOne({ where: { tripId } });
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepo.find({ order: { createdAt: 'DESC' } });
  }

  async getTotalRevenue(): Promise<number> {
    const payments = await this.paymentRepo.find({
      where: { status: PaymentStatus.COMPLETED },
    });
    return payments.reduce((sum, p) => sum + Number(p.amount), 0);
  }
}
