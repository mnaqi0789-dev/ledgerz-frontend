"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListFilter, LogOut, ReceiptText } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { cn } from "@/lib/utils";

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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/dashboard" className="shrink-0 font-serif text-xl text-slate-900">LedgerZ</Link>
        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto" aria-label="Main navigation">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn("inline-flex h-9 shrink-0 items-center gap-2 border-b-2 px-2.5 text-sm transition-colors", active ? "border-emerald-600 text-slate-950" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900")}>
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-right text-xs text-slate-500 sm:block"><span className="block font-medium text-slate-800">{user?.name}</span><span className="capitalize">{user?.role}</span></span>
          <button type="button" onClick={logout} className="inline-flex size-8 items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Log out" title="Log out"><LogOut className="size-4" aria-hidden="true" /></button>
        </div>
      </div>
    </header>
  );
}