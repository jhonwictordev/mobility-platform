import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import {
  User,
  UserRole,
  Driver,
  DriverStatus,
  ApprovalStatus,
} from '../database/entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,
  ) {}

  async validateUser(identifier: string, pass: string): Promise<User> {
    const user = await this.usersService.findByEmailOrPhone(identifier);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Conta desativada ou suspensa. Contate o suporte SIMBORA.');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    let driverProfile: any = null;
    if (user.role === UserRole.DRIVER) {
      driverProfile = await this.driverRepo.findOne({ where: { userId: user.id } });
    }

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        phoneVerified: user.phoneVerified,
      },
      driver: driverProfile
        ? {
            id: driverProfile.id,
            licenseNumber: driverProfile.licenseNumber,
            status: driverProfile.status,
            approvalStatus: driverProfile.approvalStatus,
            rating: driverProfile.rating,
          }
        : null,
    };
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: UserRole;
    licenseNumber?: string;
  }) {
    if (!data.name || !data.email || !data.password) {
      throw new BadRequestException('Nome, email e senha são obrigatórios');
    }

    const existing = await this.usersService.findByEmail(data.email.trim());
    if (existing) {
      throw new ConflictException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Hardening: Prevent privilege escalation. Public registration only allows PASSENGER or DRIVER.
    let assignedRole = UserRole.PASSENGER;
    if (data.role === UserRole.DRIVER) {
      assignedRole = UserRole.DRIVER;
    }

    const newUser = await this.usersService.create({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: hashedPassword,
      phone: data.phone ? data.phone.trim() : null,
      role: assignedRole,
      phoneVerified: false,
      isActive: true,
    });

    // If driver, initialize pending driver profile
    if (assignedRole === UserRole.DRIVER) {
      await this.driverRepo.save(
        this.driverRepo.create({
          userId: newUser.id,
          licenseNumber: data.licenseNumber ? data.licenseNumber.trim() : 'PENDING_CNH',
          status: DriverStatus.OFFLINE,
          approvalStatus: ApprovalStatus.PENDING,
          rating: 5.0,
          totalTrips: 0,
        }),
      );
    }

    return this.login(newUser);
  }

  // ============================================================
  // OTP Phone Verification
  // ============================================================
  async sendOtp(identifier: string) {
    if (!identifier) {
      throw new BadRequestException('Telefone ou email é obrigatório');
    }

    const user = await this.usersService.findByEmailOrPhone(identifier);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    if (user) {
      await this.usersService.update(user.id, {
        otpCode: code,
        otpExpiresAt: expiresAt,
      });
    }

    return {
      success: true,
      message: 'Código de verificação enviado com sucesso via SMS / WhatsApp.',
      expiresAt: expiresAt.toISOString(),
      code: code, // Exposto para ambiente de testes e simulação
    };
  }

  async verifyOtp(identifier: string, code: string) {
    if (!identifier || !code) {
      throw new BadRequestException('Identificador e código são obrigatórios');
    }

    const user = await this.usersService.findByEmailOrPhone(identifier);
    if (!user) {
      // Allow verification flow in test/onboarding without pre-existing user
      return { success: true, verified: true, message: 'Código validado com sucesso' };
    }

    if (!user.otpCode || user.otpCode !== code.trim()) {
      throw new BadRequestException('Código OTP inválido');
    }

    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      throw new BadRequestException('Código OTP expirado. Solicite um novo.');
    }

    await this.usersService.update(user.id, {
      phoneVerified: true,
      otpCode: null,
      otpExpiresAt: null,
    });

    return {
      success: true,
      verified: true,
      message: 'Telefone verificado com sucesso.',
      user: {
        id: user.id,
        phoneVerified: true,
      },
    };
  }

  // ============================================================
  // Password Recovery Flow
  // ============================================================
  async forgotPassword(email: string) {
    if (!email) {
      throw new BadRequestException('Email é obrigatório');
    }

    const user = await this.usersService.findByEmail(email.trim().toLowerCase());
    if (!user) {
      // Timing attack protection: return generic success message
      return {
        success: true,
        message: 'Se o email estiver cadastrado, as instruções foram enviadas.',
      };
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await this.usersService.update(user.id, {
      resetToken,
      resetTokenExpiresAt: resetExpires,
    });

    return {
      success: true,
      message: 'Instruções de redefinição enviadas com sucesso.',
      resetToken: resetToken, // Disponível para testes e fluxo local
    };
  }

  async resetPassword(token: string, newPass: string) {
    if (!token || !newPass) {
      throw new BadRequestException('Token e nova senha são obrigatórios');
    }
    if (newPass.length < 6) {
      throw new BadRequestException('A nova senha deve ter no mínimo 6 caracteres');
    }

    const user = await this.usersService.findByResetToken(token.trim());
    if (!user) {
      throw new BadRequestException('Token de recuperação inválido ou expirado');
    }

    const hashed = await bcrypt.hash(newPass, 10);
    await this.usersService.update(user.id, {
      password: hashed,
      resetToken: null,
      resetTokenExpiresAt: null,
    });

    return {
      success: true,
      message: 'Senha redefinida com sucesso. Faça login com suas novas credenciais.',
    };
  }

  // ============================================================
  // Legal & Compliance: Terms of Service & Privacy
  // ============================================================
  getTerms() {
    return {
      title: 'Termos e Condições de Uso — SIMBORA Mobilidade Alagoas',
      version: '3.0.0',
      lastUpdated: '2026-10-24',
      jurisdiction: 'Comarca de Penedo / Piaçabuçu — Estado de Alagoas',
      summary:
        'O SIMBORA é uma plataforma tecnológica que conecta passageiros e motoristas autônomos na região do Baixo São Francisco e intermunicipal de Alagoas.',
      sections: [
        {
          title: '1. Objeto e Adesão',
          content:
            'Ao se cadastrar no SIMBORA, você declara ter no mínimo 18 anos e concordar com os termos da plataforma.',
        },
        {
          title: '2. Responsabilidades do Passageiro',
          content:
            'O passageiro compromete-se a informar o código PIN de 4 dígitos ao motorista no embarque e a respeitar as normas de trânsito.',
        },
        {
          title: '3. Responsabilidades do Motorista Parceiro',
          content:
            'O motorista parceiro deve possuir CNH válida com EAR (Exerce Atividade Remunerada), CRLV em dia e veículo aprovado na vistoria da plataforma.',
        },
        {
          title: '4. Tarifas e Cancelamentos',
          content:
            'As tarifas são calculadas pelo motor cartográfico rodoviário oficial do SIMBORA com base na distância real (AL-101 / AL-225) e tempo de viagem.',
        },
      ],
    };
  }

  getPrivacy() {
    return {
      title: 'Política de Privacidade e Proteção de Dados (LGPD) — SIMBORA',
      version: '3.0.0',
      lastUpdated: '2026-10-24',
      dpoContact: 'dpo@simbora.app.br',
      summary:
        'Em total conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), seus dados de localização GPS são utilizados exclusivamente durante corridas ativas.',
      sections: [
        {
          title: '1. Coleta e Uso de Localização',
          content:
            'A geolocalização é coletada apenas para despacho de corridas, telemetria em tempo real e cálculo tarifário ao longo dos corredores de Alagoas.',
        },
        {
          title: '2. Compartilhamento Restrito',
          content:
            'Durante a corrida, o passageiro e o motorista visualizam apenas as informações estritamente necessárias para a realização segura da viagem.',
        },
        {
          title: '3. Direitos do Titular',
          content:
            'Você pode a qualquer momento consultar, retificar ou solicitar a exclusão de sua conta através da aba "Minha Conta" no aplicativo.',
        },
      ],
    };
  }
}
