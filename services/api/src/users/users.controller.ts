import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from '../database/entities';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, Roles } from '../common/decorators';

function sanitizeUser(user: any) {
  if (!user) return user;
  const { password, ...safe } = user;
  return safe;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    const record = await this.usersService.findById(user.userId);
    return sanitizeUser(record);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string, @CurrentUser() currentUser: any) {
    // IDOR Defense: Only the account owner or an admin may view full user profile
    if (currentUser.userId !== id && currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Acesso negado aos dados deste usuário');
    }
    const record = await this.usersService.findById(id);
    return sanitizeUser(record);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async listUsers(@Query('role') role?: UserRole) {
    const users = await this.usersService.findAll(role);
    return users.map(sanitizeUser);
  }
}
