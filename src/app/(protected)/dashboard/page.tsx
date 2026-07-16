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
    <main className="min-h-screen px-6 pb-16 pt-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-emerald-600" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-700">
                {user?.role} console
              </span>
            </div>
            <h1 className="mt-2 font-serif text-4xl tracking-tight text-slate-900 sm:text-5xl">
              Dashboard
            </h1>
            <p className="mt-2 truncate text-sm text-slate-500">
              Signed in as <span className="font-medium text-slate-700">{user?.name}</span>
            </p>
          </div>
        </header>
        <DashboardContent />
      </div>
    </main>
  );
}
