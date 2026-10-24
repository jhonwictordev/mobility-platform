import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DriversService } from '../drivers/drivers.service';
import { DocumentType, DocumentStatus, UserRole } from '../database/entities';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, Roles } from '../common/decorators';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly driversService: DriversService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async submitDocument(
    @CurrentUser() user: any,
    @Body() body: { driverId: string; type: DocumentType; fileUrl: string },
  ) {
    if (!body.driverId || !body.type || !body.fileUrl) {
      throw new BadRequestException('driverId, type e fileUrl são obrigatórios');
    }

    const driver = await this.driversService.findById(body.driverId);
    if (driver.userId !== user.userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Não autorizado a enviar documentos para outro motorista');
    }

    return this.documentsService.create({
      driverId: body.driverId,
      type: body.type,
      fileUrl: body.fileUrl,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('driver/:driverId')
  async getDriverDocuments(
    @Param('driverId') driverId: string,
    @CurrentUser() user: any,
  ) {
    const driver = await this.driversService.findById(driverId);
    if (driver.userId !== user.userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Não autorizado a consultar documentos de outro motorista');
    }
    return this.documentsService.findByDriverId(driverId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getDocument(@Param('id') id: string, @CurrentUser() user: any) {
    const doc = await this.documentsService.findById(id);
    if (doc.driver?.userId !== user.userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Acesso negado a este documento');
    }
    return doc;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put(':id/review')
  async reviewDocument(
    @Param('id') id: string,
    @Body() body: { status: DocumentStatus; reviewNotes?: string },
  ) {
    if (!body.status) {
      throw new BadRequestException('Status de aprovação é obrigatório');
    }
    return this.documentsService.review(id, body.status, body.reviewNotes);
  }
}
