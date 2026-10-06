import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, prisma } from '@dapursari/database';
import type { QueryWarehouseStockDto } from './dto/query-warehouse-stock.dto';

const stockSelect = {
  id: true,
  code: true,
  name: true,
  minStock: true,
  warehouseStock: true,
  isActive: true,
  updatedAt: true,
  category: { select: { id: true, name: true } },
  unit: { select: { id: true, name: true } },
} satisfies Prisma.ItemSelect;

type StockRow = Prisma.ItemGetPayload<{ select: typeof stockSelect }>;

export type WarehouseStockRow = StockRow & { isBelowMinimum: boolean };

const RECENT_STOCK_IN_LIMIT = 20;

const recentStockInSelect = {
  id: true,
  quantity: true,
  date: true,
  note: true,
  createdAt: true,
  supplier: { select: { id: true, name: true } },
  createdBy: { select: { id: true, name: true } },
} satisfies Prisma.StockInSelect;

export type WarehouseStockDetail = WarehouseStockRow & {
  recentStockIns: Prisma.StockInGetPayload<{ select: typeof recentStockInSelect }>[];
};

const withMinimumFlag = (row: StockRow): WarehouseStockRow => ({
  ...row,
  isBelowMinimum: row.warehouseStock.lte(row.minStock),
});

@Injectable()
export class WarehouseStockService {
  async findAll(query: QueryWarehouseStockDto): Promise<WarehouseStockRow[]> {
    const search = query.search?.trim();
    const rows = await prisma.item.findMany({
      where: {
        isActive: query.isActive ?? true,
        categoryId: query.categoryId,
        ...(query.lowStock && { warehouseStock: { lte: prisma.item.fields.minStock } }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      select: stockSelect,
      orderBy: { name: 'asc' },
    });
    return rows.map(withMinimumFlag);
  }

  async findOne(itemId: string): Promise<WarehouseStockDetail> {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: {
        ...stockSelect,
        stockIns: {
          select: recentStockInSelect,
          orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
          take: RECENT_STOCK_IN_LIMIT,
        },
      },
    });
    if (!item) {
      throw new NotFoundException('Barang tidak ditemukan');
    }
    const { stockIns, ...row } = item;
    return { ...withMinimumFlag(row), recentStockIns: stockIns };
  }
}
