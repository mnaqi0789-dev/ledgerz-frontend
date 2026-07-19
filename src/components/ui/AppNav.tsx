"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListFilter, LogOut, ReceiptText } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/overview", label: "Overview", icon: ListFilter },
];

export function AppNav() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2 px-4">
      <div className="flex items-center justify-between gap-4 rounded-full border border-slate-200/70 bg-white/70 px-4 py-2.5 shadow-[0_8px_30px_-12px_rgba(37,99,235,0.15)] backdrop-blur-xl">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-serif text-sm font-semibold text-white">L</span>
          <span className="hidden text-[15px] font-semibold tracking-[0.18em] text-blue-600 sm:inline">LEDGERZ</span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto text-sm font-medium">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 transition-colors ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-right text-xs text-slate-500 lg:block">
            <span className="block font-medium text-slate-800">{user?.name}</span>
            <span className="capitalize">{user?.role}</span>
          </span>
          <button
            type="button"
            onClick={logout}
            className="inline-flex size-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </nav>
  );
}
