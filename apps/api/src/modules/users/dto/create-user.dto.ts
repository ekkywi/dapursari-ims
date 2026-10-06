import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '@dapursari/types';

export class CreateUserDto {
  @ApiProperty({ example: 'gudang@dapursari.local' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Admin Gudang', minLength: 2 })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'Gudang123!', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.ADMIN_GUDANG,
    description: 'Role yang akan diberikan ke user baru',
  })
  @IsEnum(UserRole)
  role!: UserRole;
}
