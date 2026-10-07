'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { USER_ROLE_LABELS } from '@dapursari/types';
import { useRequiredAuth } from '@/lib/use-auth';
import { AuthProvider } from '@/lib/auth-context';
import { canAccess, getNavForRole } from '@/lib/navigation';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading, error, logout } = useRequiredAuth();
  const pathname = usePathname();
  const router = useRouter();

  const allowed = user ? canAccess(user.role, pathname) : true;

  useEffect(() => {
    if (user && !allowed) router.replace('/dashboard');
  }, [user, allowed, router]);
  if (loading) return <p className="p-6">Memuat...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!user || !allowed) return null;

  return (
    <AuthProvider value={user}>
      <div className="flex min-h-screen">
        <aside className="w-56 shrink-0 border-r border-stone-200 bg-white p-4">
          <p className="mb-4 text-sm font-semibold text-teal-700">Dapursari IMS</p>
          <nav className="flex flex-col gap-1">
            {getNavForRole(user.role).map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm ${
                    active
                      ? 'bg-teal-50 font-medium text-teal-800'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex flex-1 flex-col">
          <header className="flex items-center justify-end gap-4 border-b border-stone-200 px-6 py-3">
            <span className="text-sm text-stone-600">
              {user.name} · {USER_ROLE_LABELS[user.role]}
            </span>
            <Link href="/ubah-password" className="text-sm text-teal-700 hover:text-teal-900">
              Ubah Password
            </Link>
            <button
              onClick={logout}
              className="rounded-md bg-stone-800 px-3 py-1.5 text-sm text-white hover:bg-stone-600"
            >
              Keluar
            </button>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
