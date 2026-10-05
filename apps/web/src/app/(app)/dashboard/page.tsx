'use client';
import { useUser } from '@/lib/auth-context';

export default function DashboardPage() {
  const user = useUser();
  return <h1 className="p-6 text-2xl font-semibold">{user.name}</h1>;
}
