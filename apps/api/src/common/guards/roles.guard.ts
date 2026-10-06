import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, type AuthUser } from '@dapursari/types';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Must run after AuthGuard('jwt') so that req.user is populated.
 * Usage: @UseGuards(AuthGuard('jwt'), RolesGuard) + @Roles(UserRole.ADMIN_GUDANG)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    if (!user) {
      throw new ForbiddenException('Akses ditolak');
    }

    if (user.role === UserRole.SUPER_ADMIN || requiredRoles.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException('Anda tidak memiliki akses ke fitur ini');
  }
}
