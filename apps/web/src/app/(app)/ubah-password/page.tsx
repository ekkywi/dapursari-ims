'use client';

import { useState, type FormEvent } from 'react';
import { ApiError, apiFetch } from '@/lib/api';
import { PasswordInput } from '@/components/password-input';

export default function UbahPasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmNewPassword) {
      setError('Konfirmasi password baru tidak cocok');
      return;
    }

    setLoading(true);
    try {
      const result = await apiFetch<{ message: string }>('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword }),
      });
      setSuccess(result.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm justify-center mx-auto flex flex-col">
      <h1 className="mb-4 text-2xl font-semibold">Ubah Password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <PasswordInput
          required
          minLength={6}
          placeholder="Password lama"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <PasswordInput
          required
          minLength={6}
          placeholder="Password baru"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <PasswordInput
          required
          minLength={6}
          placeholder="Ulangi password baru"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-teal-700">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-teal-700 px-3 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}
