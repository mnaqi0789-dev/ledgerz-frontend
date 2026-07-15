"use client";

import { useAuthStore } from "@/lib/stores/authStore";
import { MakerDashboard } from "@/components/dashboard/MakerDashboard";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";

function DashboardContent() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  if (user.role === "maker") {
    return <MakerDashboard />;
  }

  if (user.role === "manager") {
    return <ManagerDashboard />;
  }

  return <AdminDashboard />;
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <main className="min-h-screen px-6 pb-16 pt-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-emerald-600" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                {user?.role} console
              </span>
            </div>
            <h1 className="mt-2 font-serif text-3xl tracking-tight text-slate-900 sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-1 truncate text-sm text-slate-500">
              Signed in as <span className="font-medium text-slate-700">{user?.name}</span>
            </p>
          </div>
        </header>
        <DashboardContent />
      </div>
    </main>
  );
}