"use client";

import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useOverview } from "@/lib/hooks/useOverview";
import { useTreasury } from "@/lib/hooks/useTreasury";
import { TreasuryHoldingSimple } from "@/lib/api/treasury";
import { formatCurrency } from "@/lib/formatters";

const PIE_COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#047857"];

export default function OverviewPage() {
  const { data, isLoading, isError } = useOverview();
  const { data: holdings } = useTreasury<TreasuryHoldingSimple>("simple");

  const categories = Object.entries(data?.categoryTotals ?? {}).sort(([, a], [, b]) => b - a);
  const categoryChartData = categories.map(([category, amount]) => ({
    category: category.replaceAll("_", " "),
    amount,
  }));
  const treasuryChartData = (holdings ?? []).map((h) => ({ name: h.assetName, value: h.currentValue }));

  if (isLoading)
    return <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 text-sm text-slate-500 sm:px-6">Loading overview...</main>;
  if (isError || !data)
    return <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 text-sm text-rose-600 sm:px-6">Overview could not be loaded.</main>;

  const metrics = [
    ["Cash in", data.cashIn, "Approved income this month"],
    ["Cash out", data.cashOut, "Approved expenses this month"],
    ["Net cash flow", data.netCashFlow, "Income less expenses"],
    ["Treasury value", data.treasuryValue, "Current market value"],
  ] as const;

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-700">Company position</p>
          <h1 className="mt-2 font-serif text-4xl tracking-tight text-slate-900">Overview</h1>
        </div>
        <p className="text-sm text-slate-500">Current month</p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, detail]) => (
          <Card
            key={label}
            className="gap-1 rounded-2xl border border-slate-200/70 bg-white/80 p-5 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.10)] backdrop-blur-xl"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
            <p
              className={
                label === "Net cash flow" && Number(value) < 0
                  ? "font-serif text-3xl text-rose-700"
                  : "font-serif text-3xl text-slate-900"
              }
            >
              {formatCurrency(Number(value))}
            </p>
            <p className="text-xs text-slate-500">{detail}</p>
          </Card>
        ))}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <Card className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.10)] backdrop-blur-xl">
          <h2 className="font-serif text-2xl text-slate-900">Expense and income by category</h2>
          <div className="mt-5 h-72">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="category" width={140} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Bar dataKey="amount" fill="#059669" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-sm text-slate-500">No approved entries this month.</p>
            )}
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.10)] backdrop-blur-xl">
          <h2 className="font-serif text-2xl text-slate-900">Treasury allocation</h2>
          <div className="mt-5 h-72">
            {treasuryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={treasuryChartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                    {treasuryChartData.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-8 text-sm text-slate-500">No treasury holdings recorded.</p>
            )}
          </div>
        </Card>
      </section>

      <section className="mt-6">
        <Card className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.10)] backdrop-blur-xl">
          <h2 className="font-serif text-2xl text-slate-900">Operational status</h2>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-slate-500">Pending entries</dt>
              <dd className="mt-1 font-medium text-slate-900">{data.pendingEntries}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Approved entries</dt>
              <dd className="mt-1 font-medium text-slate-900">{data.approvedEntryCount}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Treasury cost</dt>
              <dd className="mt-1 font-medium text-slate-900">{formatCurrency(data.treasuryCost)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Unrealized gain / loss</dt>
              <dd
                className={
                  data.unrealizedGainLoss >= 0
                    ? "mt-1 font-medium text-emerald-700"
                    : "mt-1 font-medium text-rose-700"
                }
              >
                {formatCurrency(data.unrealizedGainLoss)}
              </dd>
            </div>
          </dl>
        </Card>
      </section>
    </main>
  );
}