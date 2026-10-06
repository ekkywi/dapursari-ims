import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Nama Baru',
    minLength: 2,
    description: 'Nama tampilan user (opsional)',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;
}
