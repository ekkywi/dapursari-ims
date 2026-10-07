'use client';
import { useEffect, useState } from 'react';
import { USER_ROLE_LABELS, UserRole } from '@dapursari/types';
import { ApiError, apiFetch } from '@/lib/api';

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
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<ManagedUser[]>('/users')
      .then(setUsers)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Memuat...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Kelola User</h1>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="py-2">Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-stone-100">
              <td className="py-2">{u.name}</td>
              <td>{u.email}</td>
              <td>{USER_ROLE_LABELS[u.role]}</td>
              <td>{u.isActive ? 'Aktif' : 'Nonaktif'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
