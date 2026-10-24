import {
  Controller,
  Get,
  Patch,
  Put,
  Delete,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from '../database/entities';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, Roles } from '../common/decorators';
import * as bcrypt from 'bcrypt';

function sanitizeUser(user: any) {
  if (!user) return user;
  const { password, otpCode, otpExpiresAt, resetToken, resetTokenExpiresAt, ...safe } = user;
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
  @Patch('me')
  async updateProfile(
    @CurrentUser() user: any,
    @Body()
    body: {
      name?: string;
      phone?: string;
      avatar?: string;
      preferences?: any;
    },
  ) {
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.phone !== undefined) updateData.phone = body.phone.trim();
    if (body.avatar !== undefined) updateData.avatar = body.avatar.trim();
    if (body.preferences !== undefined) {
      updateData.preferences =
        typeof body.preferences === 'string'
          ? body.preferences
          : JSON.stringify(body.preferences);
    }

    const updated = await this.usersService.update(user.userId, updateData);
    return sanitizeUser(updated);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put('me/password')
  async changePassword(
    @CurrentUser() user: any,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    if (!body.currentPassword || !body.newPassword) {
      throw new BadRequestException('Senha atual e nova senha são obrigatórias');
    }
    if (body.newPassword.length < 6) {
      throw new BadRequestException('A nova senha deve ter no mínimo 6 caracteres');
    }

    const record = await this.usersService.findById(user.userId);
    const isMatch = await bcrypt.compare(body.currentPassword, record.password);
    if (!isMatch) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    const hashed = await bcrypt.hash(body.newPassword, 10);
    await this.usersService.update(user.userId, { password: hashed });
    return { success: true, message: 'Senha alterada com sucesso' };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('me')
  async deleteAccount(@CurrentUser() user: any) {
    await this.usersService.deactivate(user.userId);
    return { success: true, message: 'Conta desativada com sucesso' };
  }

  // ============================================================
  // Saved Places (Minha Conta)
  // ============================================================
  @UseGuards(JwtAuthGuard)
  @Get('me/places')
  async getSavedPlaces(@CurrentUser() user: any) {
    return this.usersService.getSavedPlaces(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/places')
  async addSavedPlace(
    @CurrentUser() user: any,
    @Body() body: { label: string; address: string; lat: number; lng: number },
  ) {
    if (!body.label || !body.address || body.lat === undefined || body.lng === undefined) {
      throw new BadRequestException('Rótulo, endereço e coordenadas são obrigatórios');
    }
    return this.usersService.createSavedPlace(user.userId, {
      label: body.label.trim(),
      address: body.address.trim(),
      lat: Number(body.lat),
      lng: Number(body.lng),
    });
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('me/places/:id')
  async deleteSavedPlace(@CurrentUser() user: any, @Param('id') placeId: string) {
    await this.usersService.deleteSavedPlace(user.userId, placeId);
    return { success: true, message: 'Endereço removido com sucesso' };
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
