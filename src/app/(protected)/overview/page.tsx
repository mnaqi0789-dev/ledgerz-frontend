"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { getOverview } from "@/lib/api/overview";
import { formatCurrency } from "@/lib/formatters";

export default function OverviewPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["overview"], queryFn: getOverview });
  const categories = Object.entries(data?.categoryTotals ?? {}).sort(([, left], [, right]) => right - left);

  if (isLoading) return <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 text-sm text-slate-500 sm:px-6">Loading overview...</main>;
  if (isError || !data) return <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 text-sm text-rose-600 sm:px-6">Overview could not be loaded.</main>;

  const metrics = [
    ["Cash in", data.cashIn, "Approved income this month"],
    ["Cash out", data.cashOut, "Approved expenses this month"],
    ["Net cash flow", data.netCashFlow, "Income less expenses"],
    ["Treasury value", data.treasuryValue, "Current market value"],
  ];

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Company position</p><h1 className="mt-1 font-serif text-3xl text-slate-950">Overview</h1></div><p className="text-sm text-slate-500">Current month</p></div>
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value, detail]) => <Card key={label as string} className="gap-1 rounded-md border border-slate-200 p-5 shadow-none"><p className="text-sm text-slate-500">{label}</p><p className={(label === "Net cash flow" && Number(value) < 0) ? "font-serif text-2xl text-rose-700" : "font-serif text-2xl text-slate-950"}>{formatCurrency(Number(value))}</p><p className="text-xs text-slate-500">{detail}</p></Card>)}</section>
      <section className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <Card className="rounded-md border border-slate-200 p-5 shadow-none"><h2 className="font-serif text-xl text-slate-950">Expense and income by category</h2><div className="mt-5 space-y-3">{categories.length > 0 ? categories.map(([category, amount]) => <div key={category} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0"><span className="capitalize text-slate-600">{category.replaceAll("_", " ")}</span><span className="font-medium text-slate-900">{formatCurrency(amount)}</span></div>) : <p className="py-8 text-sm text-slate-500">No approved entries this month.</p>}</div></Card>
        <Card className="rounded-md border border-slate-200 p-5 shadow-none"><h2 className="font-serif text-xl text-slate-950">Operational status</h2><dl className="mt-5 space-y-4 text-sm"><div className="flex justify-between gap-3"><dt className="text-slate-500">Pending entries</dt><dd className="font-medium text-slate-900">{data.pendingEntries}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Approved entries</dt><dd className="font-medium text-slate-900">{data.approvedEntryCount}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Treasury cost</dt><dd className="font-medium text-slate-900">{formatCurrency(data.treasuryCost)}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Unrealized gain / loss</dt><dd className={data.unrealizedGainLoss >= 0 ? "font-medium text-emerald-700" : "font-medium text-rose-700"}>{formatCurrency(data.unrealizedGainLoss)}</dd></div></dl></Card>
      </section>
    </main>
  );
}
