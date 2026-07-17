"use client";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TreasuryHoldingFull, TreasuryHoldingSimple } from "@/lib/api/treasury";
import { useTreasury } from "@/lib/hooks/useTreasury";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { useAuthStore } from "@/lib/stores/authStore";

export default function TreasuryPage() {
  const user = useAuthStore((s) => s.user);
  const isManager = user?.role === "manager";
  const { data: holdings, isLoading, isError } = useTreasury<TreasuryHoldingFull | TreasuryHoldingSimple>(
    isManager ? "full" : "simple",
  );

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-700">Portfolio</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight text-slate-900">Treasury</h1>
      <p className="mt-2 text-sm text-slate-500">
        Current positions are refreshed from the configured market-price source.
      </p>

      <Card className="mt-8 gap-0 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-0 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.10)] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Browse</TableHead>
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
                <TableRow><TableCell colSpan={isManager ? 7 : 4} className="h-28 text-center text-slate-500">Loading treasury...</TableCell></TableRow>
              )}
              {isError && (
                <TableRow><TableCell colSpan={isManager ? 7 : 4} className="h-28 text-center text-rose-600">Treasury could not be loaded.</TableCell></TableRow>
              )}
              {!isLoading && !isError && holdings?.length === 0 && (
                <TableRow><TableCell colSpan={isManager ? 7 : 4} className="h-28 text-center text-slate-500">No treasury holdings recorded.</TableCell></TableRow>
              )}
              {holdings?.map((holding) => {
                const full = holding as TreasuryHoldingFull;
                return (
                  <TableRow key={holding.assetName}>
                    <TableCell className="font-medium text-slate-900">{holding.assetName}</TableCell>
                    <TableCell>
                      
                       <a href={`https://finance.yahoo.com/quote/${holding.assetName}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-emerald-700 hover:text-emerald-800"
                      >
                        View
                      </a>
                    </TableCell>
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
      </Card>
    </main>
  );
}