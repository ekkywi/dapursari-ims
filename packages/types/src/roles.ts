/**
 * User roles for Dapursari IMS RBAC.
 * Super Admin  -> full access
 * Admin Gudang -> warehouse features
 * Admin Kitchen -> kitchen/stock features
 */
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN_GUDANG = 'ADMIN_GUDANG',
  ADMIN_KITCHEN = 'ADMIN_KITCHEN',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.ADMIN_GUDANG]: 'Admin Gudang',
  [UserRole.ADMIN_KITCHEN]: 'Admin Stok/Kitchen',
};
