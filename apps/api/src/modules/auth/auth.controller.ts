import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserRole } from '@dapursari/types';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  AdminCheckResponseDto,
  AuthUserResponseDto,
  LoginResponseDto,
  MessageResponseDto,
} from '../../common/dto/swagger-responses.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';

type AuthRequestUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description:
      'Autentikasi dengan email & password. Jika berhasil, kembalikan accessToken JWT dan data user.',
  })
  @ApiResponse({ status: 200, description: 'Login berhasil', type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Email/password salah atau user nonaktif' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Profil user saat ini',
    description: 'Mengambil data user dari JWT yang dikirim di header Authorization.',
  })
  @ApiResponse({ status: 200, type: AuthUserResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token hilang, invalid, atau kedaluwarsa' })
  me(@Req() req: { user: AuthRequestUser }) {
    return req.user;
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Ubah password',
    description:
      'Memerlukan password lama. Password baru dan konfirmasi harus sama. Semua role yang login boleh memakai endpoint ini.',
  })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token tidak valid' })
  changePassword(
    @Req() req: { user: AuthRequestUser },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.id, dto);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Logout',
    description:
      'Konfirmasi logout di server. Karena JWT stateless, client tetap harus menghapus token di browser/localStorage.',
  })
  @ApiResponse({ status: 200, type: MessageResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token tidak valid' })
  logout() {
    return this.authService.logout();
  }

  @Get('admin-check')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Cek akses Super Admin',
    description: 'Endpoint uji RolesGuard. Hanya SUPER_ADMIN yang mendapat 200.',
  })
  @ApiResponse({ status: 200, type: AdminCheckResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token tidak valid' })
  @ApiResponse({ status: 403, description: 'Role bukan Super Admin' })
  adminCheck() {
    return { ok: true, message: 'Hanya Super Admin' };
  }
}
