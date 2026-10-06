import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@dapursari/types';

export class AuthUserResponseDto {
  @ApiProperty({ example: 'cmumvo6480000jaf072todh63' })
  id!: string;

  @ApiProperty({ example: 'admin@dapursari.local' })
  email!: string;

  @ApiProperty({ example: 'Super Admin' })
  name!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.SUPER_ADMIN })
  role!: UserRole;

  @ApiProperty({ example: true })
  isActive!: boolean;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token — dipakai di header Authorization',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({ type: AuthUserResponseDto })
  user!: AuthUserResponseDto;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Logout berhasil' })
  message!: string;
}

export class AdminCheckResponseDto {
  @ApiProperty({ example: true })
  ok!: boolean;

  @ApiProperty({ example: 'Hanya Super Admin' })
  message!: string;
}

export class UserPublicResponseDto extends AuthUserResponseDto {
  @ApiProperty({ example: '2026-09-29T16:15:31.833Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-09-29T16:15:31.833Z' })
  updatedAt!: string;
}
