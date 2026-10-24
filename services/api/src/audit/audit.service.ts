import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../database/entities';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async log(
    entityType: string,
    entityId: string,
    action: string,
    userId?: string,
    details?: any,
  ): Promise<AuditLog> {
    const entry = this.auditRepo.create({
      entityType,
      entityId,
      action,
      userId,
      details: details ? JSON.stringify(details) : undefined,
    });
    return this.auditRepo.save(entry);
  }

  async getRecentLogs(limit = 100): Promise<AuditLog[]> {
    return this.auditRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
