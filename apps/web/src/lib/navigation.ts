import { UserRole } from '@dapursari/types';
export interface NavItem {
  label: string;
  href: string;
  roles: UserRole[];
}
const GUDANG = [UserRole.SUPER_ADMIN, UserRole.ADMIN_GUDANG];
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', roles: Object.values(UserRole) },
  { label: 'Supplier', href: '/gudang/supplier', roles: GUDANG },
  { label: 'Barang', href: '/gudang/barang', roles: GUDANG },
  { label: 'Stok Masuk', href: '/gudang/stok-masuk', roles: GUDANG },
  { label: 'Stok Gudang', href: '/gudang/stok', roles: GUDANG },
  { label: 'Kelola User', href: '/admin/users', roles: [UserRole.SUPER_ADMIN] },
];

export function getNavForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export function canAccess(role: UserRole, pathname: string): boolean {
  const item = NAV_ITEMS.find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`));
  // Path not in nav (e.g. future Super Admin pages) — allow; backend still enforces roles.
  if (!item) return true;
  return item.roles.includes(role);
}
