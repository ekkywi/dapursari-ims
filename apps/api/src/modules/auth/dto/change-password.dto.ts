import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'Admin123!',
    description: 'Password saat ini',
  })
  @IsString()
  @MinLength(6)
  oldPassword!: string;

  @ApiProperty({
    example: 'Admin1234!',
    minLength: 6,
    description: 'Password baru',
  })
  @IsString()
  @MinLength(6)
  newPassword!: string;

  @ApiProperty({
    example: 'Admin1234!',
    minLength: 6,
    description: 'Ulangi password baru (harus sama dengan newPassword)',
  })
  @IsString()
  @MinLength(6)
  confirmNewPassword!: string;
}
