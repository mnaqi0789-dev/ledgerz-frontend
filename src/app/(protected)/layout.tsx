"use client";

import { ProtectedRoute } from "@/components/ui/ProtectedRoute";
import { AppNav } from "@/components/ui/AppNav";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <AppNav />
        {children}
      </div>
    </ProtectedRoute>
  );
}
