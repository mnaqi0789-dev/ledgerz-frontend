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
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="inline-flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          {user ? `${user.role} dashboard` : "Dashboard"}
        </span>
      </div>
      <h1 className="mt-3 font-serif text-3xl text-slate-900">
        Welcome back{user ? `, ${user.name}` : ""}
      </h1>
      <div className="mt-10">
        <DashboardContent />
      </div>
    </main>
  );
}