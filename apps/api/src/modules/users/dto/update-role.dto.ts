import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from '@dapursari/types';

export class UpdateRoleDto {
  @ApiProperty({
    enum: UserRole,
    example: UserRole.ADMIN_KITCHEN,
    description: 'Role baru untuk user',
  })
  @IsEnum(UserRole)
  role!: UserRole;
}
