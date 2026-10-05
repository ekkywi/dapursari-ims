import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, prisma } from '@dapursari/database';
import type { CreateStockInDto } from './dto/create-stock-in.dto';
import type { QueryStockInDto } from './dto/query-stock-in.dto';

const stockInInclude = {
  supplier: { select: { id: true, name: true } },
  item: {
    select: { id: true, code: true, name: true, unit: { select: { id: true, name: true } } },
  },
  createdBy: { select: { id: true, name: true } },
} satisfies Prisma.StockInInclude;

export type StockInWithRelations = Prisma.StockInGetPayload<{ include: typeof stockInInclude }>;

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

@Injectable()
export class StockInService {
  findAll(query: QueryStockInDto): Promise<StockInWithRelations[]> {
    let endDate: Date | undefined;
    if (query.endDate) {
      endDate = new Date(query.endDate);
      if (DATE_ONLY.test(query.endDate)) {
        endDate.setUTCHours(23, 59, 59, 999);
      }
    }

    return prisma.stockIn.findMany({
      where: {
        supplierId: query.supplierId,
        itemId: query.itemId,
        date: {
          gte: query.startDate ? new Date(query.startDate) : undefined,
          lte: endDate,
        },
      },
      include: stockInInclude,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string): Promise<StockInWithRelations> {
    const stockIn = await prisma.stockIn.findUnique({ where: { id }, include: stockInInclude });
    if (!stockIn) {
      throw new NotFoundException('Transaksi stok masuk tidak ditemukan');
    }
    return stockIn;
  }

  /** Records the transaction and adds the quantity to warehouse stock atomically. */
  async create(dto: CreateStockInDto, userId: string): Promise<StockInWithRelations> {
    const [supplier, item] = await Promise.all([
      prisma.supplier.findUnique({ where: { id: dto.supplierId } }),
      prisma.item.findUnique({ where: { id: dto.itemId } }),
    ]);
    if (!supplier || !supplier.isActive) {
      throw new BadRequestException('Supplier tidak ditemukan atau tidak aktif');
    }
    if (!item || !item.isActive) {
      throw new BadRequestException('Barang tidak ditemukan atau tidak aktif');
    }

    // Batch transaction: both writes commit together or not at all.
    const [stockIn] = await prisma.$transaction([
      prisma.stockIn.create({
        data: {
          supplierId: dto.supplierId,
          itemId: dto.itemId,
          quantity: dto.quantity,
          date: new Date(dto.date),
          note: dto.note?.trim() || null,
          createdById: userId,
        },
        include: stockInInclude,
      }),
      prisma.item.update({
        where: { id: dto.itemId },
        data: { warehouseStock: { increment: dto.quantity } },
      }),
    ]);

    return stockIn;
  }
}
