import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@dapursari/types';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { QueryWarehouseStockDto } from './dto/query-warehouse-stock.dto';
import {
  WarehouseStockService,
  type WarehouseStockDetail,
  type WarehouseStockRow,
} from './warehouse-stock.service';

@Controller('warehouse-stock')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN_GUDANG)
export class WarehouseStockController {
  constructor(private readonly warehouseStockService: WarehouseStockService) {}

  @Get()
  findAll(@Query() query: QueryWarehouseStockDto): Promise<WarehouseStockRow[]> {
    return this.warehouseStockService.findAll(query);
  }

  @Get(':itemId')
  findOne(@Param('itemId') itemId: string): Promise<WarehouseStockDetail> {
    return this.warehouseStockService.findOne(itemId);
  }
}
