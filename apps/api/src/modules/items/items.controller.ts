import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@dapursari/types';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateItemDto } from './dto/create-item.dto';
import { QueryItemDto } from './dto/query-item.dto';
import { UpdateItemStatusDto } from './dto/update-item-status.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsService, type ItemWithRelations } from './items.service';

@Controller('items')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN_GUDANG)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(@Query() query: QueryItemDto): Promise<ItemWithRelations[]> {
    return this.itemsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ItemWithRelations> {
    return this.itemsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateItemDto): Promise<ItemWithRelations> {
    return this.itemsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateItemDto): Promise<ItemWithRelations> {
    return this.itemsService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateItemStatusDto,
  ): Promise<ItemWithRelations> {
    return this.itemsService.updateStatus(id, dto.isActive);
  }
}
