import { IsEnum } from 'class-validator';
import { UserRole } from '@dapursari/types';

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role!: UserRole;
}