import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, prisma, type Unit } from '@dapursari/database';
import type { CreateUnitDto } from './dto/create-unit.dto';
import type { QueryUnitDto } from './dto/query-unit.dto';
import type { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
  findAll(query: QueryUnitDto): Promise<Unit[]> {
    const search = query.search?.trim();
    return prisma.unit.findMany({
      where: {
        isActive: query.isActive,
        ...(search && { name: { contains: search, mode: 'insensitive' } }),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<Unit> {
    const unit = await prisma.unit.findUnique({ where: { id } });
    if (!unit) {
      throw new NotFoundException('Satuan tidak ditemukan');
    }
    return unit;
  }

  create(dto: CreateUnitDto): Promise<Unit> {
    return this.handleUnique(prisma.unit.create({ data: { name: dto.name.trim() } }));
  }

  async update(id: string, dto: UpdateUnitDto): Promise<Unit> {
    await this.findOne(id);
    return this.handleUnique(
      prisma.unit.update({ where: { id }, data: { name: dto.name?.trim() } }),
    );
  }

  async updateStatus(id: string, isActive: boolean): Promise<Unit> {
    await this.findOne(id);
    return prisma.unit.update({ where: { id }, data: { isActive } });
  }

  private async handleUnique(op: Promise<Unit>): Promise<Unit> {
    try {
      return await op;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Nama satuan sudah digunakan');
      }
      throw e;
    }
  }
}
