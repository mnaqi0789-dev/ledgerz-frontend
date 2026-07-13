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
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-serif text-2xl text-slate-900 mb-8">Dashboard</h1>
      <DashboardContent />
    </main>
  );
}