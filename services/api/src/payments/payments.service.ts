import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentMethod, PaymentStatus } from '../database/entities';
import { AuditService } from '../audit/audit.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    private readonly auditService: AuditService,
  ) {}

  async processTestPayment(
    tripId: string,
    amount: number,
    method: PaymentMethod = PaymentMethod.CREDIT_CARD,
  ): Promise<Payment> {
    const payment = this.paymentRepo.create({
      tripId,
      amount,
      method,
      status: PaymentStatus.COMPLETED,
      transactionId: `test_tx_${uuidv4().substring(0, 8)}`,
    });

    const saved = await this.paymentRepo.save(payment);

    await this.auditService.log(
      'Payment',
      saved.id,
      'PAYMENT_PROCESSED',
      undefined,
      { tripId, amount, method, status: PaymentStatus.COMPLETED },
    );

    return saved;
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
