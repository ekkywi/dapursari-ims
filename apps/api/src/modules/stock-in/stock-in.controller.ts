import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole, type AuthUser } from '@dapursari/types';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateStockInDto } from './dto/create-stock-in.dto';
import { QueryStockInDto } from './dto/query-stock-in.dto';
import { StockInService, type StockInWithRelations } from './stock-in.service';

@Controller('stock-in')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN_GUDANG)
export class StockInController {
  constructor(private readonly stockInService: StockInService) {}

  @Get()
  findAll(@Query() query: QueryStockInDto): Promise<StockInWithRelations[]> {
    return this.stockInService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<StockInWithRelations> {
    return this.stockInService.findOne(id);
  }

  @Post()
  create(
    @Body() dto: CreateStockInDto,
    @Req() req: { user: AuthUser },
  ): Promise<StockInWithRelations> {
    return this.stockInService.create(dto, req.user.id);
  }
}
