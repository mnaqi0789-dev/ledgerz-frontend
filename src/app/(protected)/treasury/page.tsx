"use client";

import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTreasury, TreasuryHoldingFull, TreasuryHoldingSimple } from "@/lib/api/treasury";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { useAuthStore } from "@/lib/stores/authStore";

export default function TreasuryPage() {
  const user = useAuthStore((state) => state.user);
  const isManager = user?.role === "manager";
  const { data: holdings, isLoading, isError } = useQuery({
    queryKey: ["treasury", isManager ? "full" : "simple"],
    queryFn: () => (isManager ? getTreasury<TreasuryHoldingFull>() : getTreasury<TreasuryHoldingSimple>()),
  });

  return (
    <main className="min-h-screen px-6 pb-16 pt-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-emerald-600" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                Portfolio
              </span>
            </div>
            <h1 className="mt-2 font-serif text-3xl tracking-tight text-slate-900 sm:text-4xl">
              Treasury
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Current positions are refreshed from the configured market-price source.
            </p>
          </div>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  {isManager && (
                    <>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Cost basis</TableHead>
                      <TableHead>Current price</TableHead>
                    </>
                  )}
                  <TableHead>Current value</TableHead>
                  <TableHead>Gain / loss</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={isManager ? 6 : 3} className="h-28 text-center text-slate-500">
                      Loading treasury...
                    </TableCell>
                  </TableRow>
                )}
                {isError && (
                  <TableRow>
                    <TableCell colSpan={isManager ? 6 : 3} className="h-28 text-center text-rose-600">
                      Treasury could not be loaded.
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && !isError && holdings?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isManager ? 6 : 3} className="h-28 text-center text-slate-500">
                      No treasury holdings recorded.
                    </TableCell>
                  </TableRow>
                )}
                {holdings?.map((holding) => {
                  const full = holding as TreasuryHoldingFull;
                  return (
                    <TableRow key={holding.assetName}>
                      <TableCell className="font-medium capitalize text-slate-900">{holding.assetName}</TableCell>
                      {isManager && (
                        <>
                          <TableCell>{full.quantity}</TableCell>
                          <TableCell>{formatCurrency(full.buyPrice)}</TableCell>
                          <TableCell>{formatCurrency(full.currentPrice)}</TableCell>
                        </>
                      )}
                      <TableCell className="font-medium">{formatCurrency(holding.currentValue)}</TableCell>
                      <TableCell className={holding.gainLossPercent >= 0 ? "text-emerald-700" : "text-rose-700"}>
                        {formatPercent(holding.gainLossPercent)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  );
}