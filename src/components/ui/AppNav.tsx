"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Landmark, ListFilter, LogOut, ReceiptText } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/treasury", label: "Treasury", icon: Landmark },
  { href: "/overview", label: "Overview", icon: ListFilter },
];

export function AppNav() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div className="flex items-center gap-3 rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.15)] backdrop-blur-xl">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 font-serif text-sm font-semibold text-white shadow-sm">
            L
          </span>
          <span className="hidden text-[13px] font-semibold tracking-[0.18em] text-emerald-800 sm:inline">
            LEDGERZ
          </span>
        </Link>

        <nav
          className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-sm font-medium"
          aria-label="Main navigation"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 transition-colors",
                  active
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-emerald-700"
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3 pl-2">
          <span className="hidden text-right text-xs leading-tight text-slate-500 md:block">
            <span className="block font-medium text-slate-800">{user?.name}</span>
            <span className="capitalize">{user?.role}</span>
          </span>
          <button
            type="button"
            onClick={logout}
            className="inline-flex size-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
