'use client';

import { USER_ROLE_LABELS } from '@dapursari/types';
import { useRequiredAuth } from '@/lib/use-auth';

export default function DashboardPage() {
  const { user, loading, error, logout } = useRequiredAuth();
  if (loading) return <p>Memuat...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return null;

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">{user.name}</h1>
      <p className="text-sm text-stone-500">Role: {USER_ROLE_LABELS[user.role]}</p>
      <button onClick={logout} className="rounded-md bg-stone-800 px-3 py-2 text-white">
        Keluar
      </button>
    </main>
  );
}
