import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, prisma, type Category } from '@dapursari/database';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { QueryCategoryDto } from './dto/query-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  findAll(query: QueryCategoryDto): Promise<Category[]> {
    const search = query.search?.trim();
    return prisma.category.findMany({
      where: {
        isActive: query.isActive,
        ...(search && { name: { contains: search, mode: 'insensitive' } }),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }
    return category;
  }

  create(dto: CreateCategoryDto): Promise<Category> {
    return this.handleUnique(prisma.category.create({ data: { name: dto.name.trim() } }));
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    await this.findOne(id);
    return this.handleUnique(
      prisma.category.update({ where: { id }, data: { name: dto.name?.trim() } }),
    );
  }

  async updateStatus(id: string, isActive: boolean): Promise<Category> {
    await this.findOne(id);
    return prisma.category.update({ where: { id }, data: { isActive } });
  }

  private async handleUnique(op: Promise<Category>): Promise<Category> {
    try {
      return await op;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Nama kategori sudah digunakan');
      }
      throw e;
    }
  }
}
