"use client";

import { ProtectedRoute } from "@/components/ui/ProtectedRoute";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}