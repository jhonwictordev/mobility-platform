import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentType, DocumentStatus } from '../database/entities';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly docRepo: Repository<Document>,
  ) {}

  async create(data: {
    driverId: string;
    type: DocumentType;
    fileUrl: string;
  }): Promise<Document> {
    const doc = this.docRepo.create({
      driverId: data.driverId,
      type: data.type,
      fileUrl: data.fileUrl,
      status: DocumentStatus.PENDING,
    });
    return this.docRepo.save(doc);
  }

  async findByDriverId(driverId: string): Promise<Document[]> {
    return this.docRepo.find({
      where: { driverId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Document> {
    const doc = await this.docRepo.findOne({
      where: { id },
      relations: { driver: true },
    });
    if (!doc) throw new NotFoundException('Documento não encontrado');
    return doc;
  }

  async review(
    id: string,
    status: DocumentStatus,
    reviewNotes?: string,
  ): Promise<Document> {
    const doc = await this.findById(id);
    doc.status = status;
    if (reviewNotes !== undefined) {
      doc.reviewNotes = reviewNotes;
    }
    return this.docRepo.save(doc);
  }

  async countPending(): Promise<number> {
    return this.docRepo.count({
      where: { status: DocumentStatus.PENDING },
    });
  }
}
