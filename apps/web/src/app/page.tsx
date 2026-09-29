import { USER_ROLE_LABELS, UserRole } from '@dapursari/types';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6">
      <p className="text-sm font-medium tracking-wide text-teal-700 uppercase">Dapursari IMS</p>
      <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
        Inventory Management System
      </h1>
      <p className="max-w-xl text-lg text-stone-600">
        Operational inventory for warehouse and kitchen, with role-based access control.
      </p>
      <ul className="space-y-2 text-stone-700">
        {Object.values(UserRole).map((role) => (
          <li key={role} className="rounded-md bg-white/70 px-3 py-2 ring-1 ring-stone-200">
            {USER_ROLE_LABELS[role]}
          </li>
        ))}
      </ul>
    </main>
  );
}
