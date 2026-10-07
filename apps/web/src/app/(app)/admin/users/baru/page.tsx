'use client';

import { ApiError, apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { USER_ROLE_LABELS, UserRole } from '@dapursari/types';
import { FormEvent, useState } from 'react';
import Link from 'next/link';

export default function TambahUserPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN_GUDANG);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      });
      router.push('/admin/users');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="mx-auto flex max-w-sm flex-col">
      <h1 className="mb-4 text-2xl font-semibold">Tambah User</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          required
          placeholder="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-stone-300 ps-3 py-2"
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-stone-300 ps-3 py-2"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border border-stone-300 ps-3 py-2"
        />
        <select
          required
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="rounded-md border border-stone-300 ps-3 py-2"
        >
          {Object.values(UserRole).map((r) => (
            <option key={r} value={r}>
              {USER_ROLE_LABELS[r]}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-teal-700 px-3 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Tambah User'}
        </button>
        <Link
          href="/admin/users"
          className="bg-stone-200 text-stone-700 hover:bg-stone-300 rounded-md px-3 py-2 text-center text-sm"
        >
          Batal
        </Link>
      </form>
    </div>
  );
}
