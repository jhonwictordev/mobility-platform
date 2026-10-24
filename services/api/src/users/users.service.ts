import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { User, UserRole, SavedPlace } from '../database/entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(SavedPlace)
    private readonly placeRepo: Repository<SavedPlace>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { phone } });
  }

  async findByEmailOrPhone(val: string): Promise<User | null> {
    const trimmed = val.trim();
    const userByEmail = await this.userRepo.findOne({ where: { email: trimmed } });
    if (userByEmail) return userByEmail;
    return this.userRepo.findOne({ where: { phone: trimmed } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { savedPlaces: true },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: {
        resetToken: token,
        resetTokenExpiresAt: MoreThan(new Date()),
      },
    });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.userRepo.update(id, data);
    return this.findById(id);
  }

  async deactivate(id: string): Promise<void> {
    await this.userRepo.update(id, { isActive: false });
  }

  async findAll(role?: UserRole): Promise<User[]> {
    if (role) {
      return this.userRepo.find({ where: { role } });
    }
    return this.userRepo.find();
  }

  async count(): Promise<number> {
    return this.userRepo.count();
  }

  // ============================================================
  // Saved Places (Minha Conta)
  // ============================================================
  async getSavedPlaces(userId: string): Promise<SavedPlace[]> {
    return this.placeRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createSavedPlace(
    userId: string,
    data: { label: string; address: string; lat: number; lng: number },
  ): Promise<SavedPlace> {
    const place = this.placeRepo.create({
      userId,
      label: data.label,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
    });
    return this.placeRepo.save(place);
  }

  async deleteSavedPlace(userId: string, placeId: string): Promise<void> {
    const place = await this.placeRepo.findOne({ where: { id: placeId } });
    if (!place) {
      throw new NotFoundException('Endereço salvo não encontrado');
    }
    if (place.userId !== userId) {
      throw new ForbiddenException('Acesso negado para excluir este endereço');
    }
    await this.placeRepo.delete(placeId);
  }
}
