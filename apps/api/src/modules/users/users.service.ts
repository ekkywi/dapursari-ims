import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole, prisma } from '@dapursari/database';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const userPublicSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UsersService {
  async findAll() {
    return prisma.user.findMany({
      select: userPublicSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateUserDto) {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email sudah digunakan');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash,
        role: dto.role,
        isActive: true,
      },
      select: userPublicSelect,
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.ensureExists(id);
    return prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
      },
      select: userPublicSelect,
    });
  }


  async updateRole(id: string, role: UserRole) {
    await this.ensureExists(id);
    return prisma.user.update({
      where: { id },
      data: { role },
      select: userPublicSelect,
    });
  }

  async deactivate(id: string) {
    await this.ensureExists(id);
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: userPublicSelect,
    });
  }
  private async ensureExists(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
    return user;
  }
}