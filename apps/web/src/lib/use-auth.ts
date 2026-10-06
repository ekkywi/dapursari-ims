'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser } from '@dapursari/types';
import { ApiError, apiFetch } from '@/lib/api';
import { clearToken, getToken } from '@/lib/auth-storage';

export function useRequiredAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    apiFetch<AuthUser>('/auth/me')
      .then(setUser)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
          router.replace('/login');
          return;
        }
        setError('Gagal terhubung ke server');
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function logout() {
    try {
      await apiFetch<{ message: string }>('/auth/logout', { method: 'POST' });
    } catch {
      // JWT is stateless — still clear local token even if the call fails.
    }
    clearToken();
    router.replace('/login');
  }
  return { user, loading, error, logout };
}
