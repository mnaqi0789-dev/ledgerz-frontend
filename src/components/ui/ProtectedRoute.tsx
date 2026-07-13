"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, AuthUser } from "@/lib/stores/authStore";

const DASHBOARD_PATH_BY_ROLE: Record<AuthUser["role"], string> = {
  maker: "/dashboard",
  manager: "/dashboard",
  admin: "/dashboard",
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AuthUser["role"][];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, token, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!token || !user) {
      router.push("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push(DASHBOARD_PATH_BY_ROLE[user.role]);
    }
  }, [hasHydrated, token, user, allowedRoles, router]);

  if (!hasHydrated || !token || !user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
