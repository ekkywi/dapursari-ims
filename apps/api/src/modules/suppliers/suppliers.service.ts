import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, type Supplier } from '@dapursari/database';
import type { CreateSupplierDto } from './dto/create-supplier.dto';
import type { QuerySupplierDto } from './dto/query-supplier.dto';
import type { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  findAll(query: QuerySupplierDto): Promise<Supplier[]> {
    const search = query.search?.trim();
    return prisma.supplier.findMany({
      where: {
        isActive: query.isActive,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await prisma.supplier.findUnique({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Supplier tidak ditemukan');
    }
    return supplier;
  }

  create(dto: CreateSupplierDto): Promise<Supplier> {
    return prisma.supplier.create({ data: dto });
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<Supplier> {
    await this.findOne(id);
    return prisma.supplier.update({ where: { id }, data: dto });
  }

  async updateStatus(id: string, isActive: boolean): Promise<Supplier> {
    await this.findOne(id);
    return prisma.supplier.update({ where: { id }, data: { isActive } });
  }
}
