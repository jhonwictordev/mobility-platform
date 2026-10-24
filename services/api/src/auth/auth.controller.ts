import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../database/entities';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: { email?: string; phone?: string; identifier?: string; password: string }) {
    const ident = body.identifier || body.email || body.phone || '';
    const user = await this.authService.validateUser(ident, body.password);
    return this.authService.login(user);
  }

  @Post('register')
  async register(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      phone: string;
      role?: UserRole;
      licenseNumber?: string;
    },
  ) {
    return this.authService.register(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('send-otp')
  async sendOtp(@Body() body: { phone?: string; email?: string; identifier?: string }) {
    const ident = body.identifier || body.phone || body.email || '';
    return this.authService.sendOtp(ident);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  async verifyOtp(@Body() body: { phone?: string; email?: string; identifier?: string; code: string }) {
    const ident = body.identifier || body.phone || body.email || '';
    return this.authService.verifyOtp(ident, body.code);
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Get('terms')
  getTerms() {
    return this.authService.getTerms();
  }

  @Get('privacy')
  getPrivacy() {
    return this.authService.getPrivacy();
  }
}
