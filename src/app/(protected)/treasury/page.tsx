"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTreasury, TreasuryHoldingFull, TreasuryHoldingSimple } from "@/lib/api/treasury";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { useAuthStore } from "@/lib/stores/authStore";

export default function TreasuryPage() {
  const user = useAuthStore((state) => state.user);
  const isManager = user?.role === "manager";
  const { data: holdings, isLoading, isError } = useQuery({
    queryKey: ["treasury", isManager ? "full" : "simple"],
    queryFn: () => isManager ? getTreasury<TreasuryHoldingFull>() : getTreasury<TreasuryHoldingSimple>(),
  });

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Portfolio</p>
      <h1 className="mt-1 font-serif text-3xl text-slate-950">Treasury</h1>
      <p className="mt-2 text-sm text-slate-500">Current positions are refreshed from the configured market-price source.</p>
      <Card className="mt-7 gap-0 rounded-md border border-slate-200 py-0 shadow-none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Asset</TableHead><TableHead>Browse</TableHead>{isManager && <><TableHead>Quantity</TableHead><TableHead>Cost basis</TableHead><TableHead>Current price</TableHead></>}<TableHead>Current value</TableHead><TableHead>Gain / loss</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={isManager ? 7 : 4} className="h-28 text-center text-slate-500">Loading treasury...</TableCell></TableRow>}
              {isError && <TableRow><TableCell colSpan={isManager ? 7 : 4} className="h-28 text-center text-rose-600">Treasury could not be loaded.</TableCell></TableRow>}
              {!isLoading && !isError && holdings?.length === 0 && <TableRow><TableCell colSpan={isManager ? 7 : 4} className="h-28 text-center text-slate-500">No treasury holdings recorded.</TableCell></TableRow>}
              {holdings?.map((holding) => {
                const full = holding as TreasuryHoldingFull;
                return <TableRow key={holding.assetName}><TableCell className="font-medium text-slate-900">{holding.assetName}</TableCell><TableCell><a href={`https://finance.yahoo.com/quote/${holding.assetName}`} target="_blank" rel="noreferrer" className="font-medium text-emerald-600 hover:text-emerald-700">View</a></TableCell>{isManager && <><TableCell>{full.quantity}</TableCell><TableCell>{formatCurrency(full.buyPrice)}</TableCell><TableCell>{formatCurrency(full.currentPrice)}</TableCell></>}<TableCell className="font-medium">{formatCurrency(holding.currentValue)}</TableCell><TableCell className={holding.gainLossPercent >= 0 ? "text-emerald-700" : "text-rose-700"}>{formatPercent(holding.gainLossPercent)}</TableCell></TableRow>;
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </main>
  );
}