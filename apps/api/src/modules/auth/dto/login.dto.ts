import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@dapursari.local',
    description: 'Email terdaftar di sistem',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Admin123!',
    minLength: 6,
    description: 'Password akun (minimal 6 karakter)',
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
