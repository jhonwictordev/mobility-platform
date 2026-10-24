import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators';
import { UserRole } from '../database/entities';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('logs')
  async getLogs(@Query('limit') limit?: number) {
    const take = limit ? Math.min(Number(limit), 200) : 50;
    return this.auditService.getRecentLogs(take);
  }
}
