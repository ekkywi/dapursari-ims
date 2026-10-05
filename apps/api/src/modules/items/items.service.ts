import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, prisma } from '@dapursari/database';
import type { CreateItemDto } from './dto/create-item.dto';
import type { QueryItemDto } from './dto/query-item.dto';
import type { UpdateItemDto } from './dto/update-item.dto';

const itemInclude = {
  category: { select: { id: true, name: true } },
  unit: { select: { id: true, name: true } },
} satisfies Prisma.ItemInclude;

export type ItemWithRelations = Prisma.ItemGetPayload<{ include: typeof itemInclude }>;

@Injectable()
export class ItemsService {
  findAll(query: QueryItemDto): Promise<ItemWithRelations[]> {
    const search = query.search?.trim();
    return prisma.item.findMany({
      where: {
        isActive: query.isActive,
        categoryId: query.categoryId,
        unitId: query.unitId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: itemInclude,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<ItemWithRelations> {
    const item = await prisma.item.findUnique({ where: { id }, include: itemInclude });
    if (!item) {
      throw new NotFoundException('Barang tidak ditemukan');
    }
    return item;
  }

  async create(dto: CreateItemDto): Promise<ItemWithRelations> {
    await this.assertRelations(dto.categoryId, dto.unitId);
    return this.handleUnique(
      prisma.item.create({
        data: {
          code: dto.code.trim(),
          name: dto.name.trim(),
          categoryId: dto.categoryId,
          unitId: dto.unitId,
          minStock: dto.minStock ?? 0,
        },
        include: itemInclude,
      }),
    );
  }

  async update(id: string, dto: UpdateItemDto): Promise<ItemWithRelations> {
    await this.findOne(id);
    await this.assertRelations(dto.categoryId, dto.unitId);
    return this.handleUnique(
      prisma.item.update({
        where: { id },
        data: {
          code: dto.code?.trim(),
          name: dto.name?.trim(),
          categoryId: dto.categoryId,
          unitId: dto.unitId,
          minStock: dto.minStock,
        },
        include: itemInclude,
      }),
    );
  }

  async updateStatus(id: string, isActive: boolean): Promise<ItemWithRelations> {
    await this.findOne(id);
    return prisma.item.update({ where: { id }, data: { isActive }, include: itemInclude });
  }

  /** Category & unit must exist and be active when assigned to an item. */
  private async assertRelations(categoryId?: string, unitId?: string): Promise<void> {
    if (categoryId) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category || !category.isActive) {
        throw new BadRequestException('Kategori tidak ditemukan atau tidak aktif');
      }
    }
    if (unitId) {
      const unit = await prisma.unit.findUnique({ where: { id: unitId } });
      if (!unit || !unit.isActive) {
        throw new BadRequestException('Satuan tidak ditemukan atau tidak aktif');
      }
    }
  }

  private async handleUnique(op: Promise<ItemWithRelations>): Promise<ItemWithRelations> {
    try {
      return await op;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Kode barang sudah digunakan');
      }
      throw e;
    }
  }
}
