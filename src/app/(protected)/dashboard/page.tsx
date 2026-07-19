"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { MakerDashboard } from "@/components/dashboard/MakerDashboard";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

function DashboardContent() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;
  if (user.role === "maker") return <MakerDashboard />;
  if (user.role === "manager") return <ManagerDashboard />;
  return <AdminDashboard />;
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <main className="relative min-h-screen px-6 pb-20 pt-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(37,99,235,0.10),transparent_70%)]"
      />
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/70 px-3 py-1 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                {user?.role} console
              </span>
            </div>
            <h1 className="mt-3 font-serif text-4xl tracking-tight text-slate-900 sm:text-5xl">
              Dashboard
            </h1>
            <p className="mt-2 truncate text-sm text-slate-500">
              Signed in as <span className="font-medium text-slate-800">{user?.name}</span>
            </p>
          </div>
        </header>
        <DashboardContent />
      </div>
    </main>
  );
}
