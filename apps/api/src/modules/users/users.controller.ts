import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserRole } from '@dapursari/types';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserPublicResponseDto } from '../../common/dto/swagger-responses.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Daftar semua user',
    description: 'Hanya Super Admin. Response tidak menyertakan passwordHash.',
  })
  @ApiResponse({ status: 200, type: [UserPublicResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Token tidak valid' })
  @ApiResponse({ status: 403, description: 'Bukan Super Admin' })
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Buat user baru',
    description: 'Membuat akun dengan role tertentu. Email harus unik.',
  })
  @ApiResponse({ status: 201, type: UserPublicResponseDto })
  @ApiResponse({ status: 409, description: 'Email sudah digunakan' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update data user', description: 'Saat ini hanya nama yang bisa diubah.' })
  @ApiParam({ name: 'id', description: 'ID user (cuid)' })
  @ApiResponse({ status: 200, type: UserPublicResponseDto })
  @ApiResponse({ status: 404, description: 'User tidak ditemukan' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/role')
  @ApiOperation({
    summary: 'Atur role user',
    description: 'Mengganti role menjadi SUPER_ADMIN, ADMIN_GUDANG, atau ADMIN_KITCHEN.',
  })
  @ApiParam({ name: 'id', description: 'ID user (cuid)' })
  @ApiResponse({ status: 200, type: UserPublicResponseDto })
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.usersService.updateRole(id, dto.role);
  }

  @Patch(':id/deactivate')
  @ApiOperation({
    summary: 'Nonaktifkan user',
    description:
      'Set isActive = false. User tidak dihapus dari database, tetapi tidak bisa login.',
  })
  @ApiParam({ name: 'id', description: 'ID user (cuid)' })
  @ApiResponse({ status: 200, type: UserPublicResponseDto })
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }
}
