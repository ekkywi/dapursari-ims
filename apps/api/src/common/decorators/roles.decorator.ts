import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@dapursari/types';

export const ROLES_KEY = 'roles';

/**
 * Restrict a controller or handler to the given roles.
 * SUPER_ADMIN always passes (see RolesGuard).
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
