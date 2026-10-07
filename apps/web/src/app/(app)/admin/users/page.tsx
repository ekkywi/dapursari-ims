'use client';
import { useEffect, useState } from 'react';
import { USER_ROLE_LABELS, UserRole } from '@dapursari/types';
import { ApiError, apiFetch } from '@/lib/api';
import { useUser } from '@/lib/auth-context';

interface ManagedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
}

function errorMessage(err: unknown) {
  return err instanceof ApiError ? err.message : 'Gagal terhubung ke server';
}

export default function KelolaUserPage() {
  const me = useUser();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null); // gagal
  const [actionError, setActionError] = useState<string | null>(null); // gagal
  const [busyId, setBusyId] = useState<string | null>(null); // loading

  useEffect(() => {
    apiFetch<ManagedUser[]>('/users')
      .then(setUsers)
      .catch((err) => setLoadError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);
  async function handleDeactivate(user: ManagedUser) {
    if (!window.confirm(`Nonaktifkan ${user.name}?`)) return;

    setActionError(null);
    setBusyId(user.id);
    try {
      const updated = await apiFetch<ManagedUser>(`/users/${user.id}/deactivate`, {
        method: 'PATCH',
      });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p>Memuat...</p>;
  if (loadError) return <p className="text-red-500">{loadError}</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Kelola User</h1>
      {actionError && <p className="mb-2 text-sm text-red-500">{actionError}</p>}
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="py-2">Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-stone-100">
              <td className="py-2">{u.name}</td>
              <td>{u.email}</td>
              <td>{USER_ROLE_LABELS[u.role]}</td>
              <td>{u.isActive ? 'Aktif' : 'Nonaktif'}</td>
              <td>
                {u.isActive && u.id !== me.id && (
                  <button
                    onClick={() => handleDeactivate(u)}
                    disabled={busyId === u.id}
                    className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {busyId === u.id ? 'Memproses...' : 'Nonaktifkan'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
