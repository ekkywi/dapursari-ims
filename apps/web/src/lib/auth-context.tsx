'use client';

import { createContext, useContext } from 'react';
import type { AuthUser } from '@dapursari/types';

const AuthContext = createContext<AuthUser | null>(null);

export const AuthProvider = AuthContext.Provider;

export function useUser(): AuthUser {
  const user = useContext(AuthContext);
  if (!user) throw new Error('useUser harus dipakai di dalam AuthProvider');
  return user;
}
