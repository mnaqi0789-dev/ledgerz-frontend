"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ENTRY_CATEGORIES, EntryCategory, EntryStatus } from "@/lib/api/entries";
import { useEntries } from "@/lib/hooks/useEntries";
import { useFilterStore } from "@/lib/stores/filterStore";
import { formatCurrency } from "@/lib/formatters";

const statuses: EntryStatus[] = ["submitted", "approved", "rejected"];

export default function TransactionsPage() {
  const category = useFilterStore((s) => s.category);
  const status = useFilterStore((s) => s.status);
  const startDate = useFilterStore((s) => s.startDate);
  const endDate = useFilterStore((s) => s.endDate);
  const setCategory = useFilterStore((s) => s.setCategory);
  const setStatus = useFilterStore((s) => s.setStatus);
  const setStartDate = useFilterStore((s) => s.setStartDate);
  const setEndDate = useFilterStore((s) => s.setEndDate);
  const resetFilters = useFilterStore((s) => s.resetFilters);

  const filters = {
    category: category === "all" ? undefined : category,
    status: status === "all" ? undefined : status,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  };
  const { data: entries, isLoading, isError } = useEntries("transactions", filters);

  const hasActiveFilters = category !== "all" || status !== "all" || startDate !== "" || endDate !== "";

  return (
    <main className="min-h-screen px-6 pb-16 pt-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-blue-600" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-700">Ledger</span>
            </div>
            <h1 className="mt-2 font-serif text-4xl tracking-tight text-slate-900 sm:text-5xl">Transactions</h1>
          </div>
          <p className="text-sm text-slate-500">{entries?.length ?? 0} records</p>
        </header>

        <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_8px_30px_-12px_rgba(37,99,235,0.10)] backdrop-blur-xl sm:p-8">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as EntryCategory | "all")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {ENTRY_CATEGORIES.map((item) => (
                    <SelectItem key={item} value={item}>{item.replaceAll("_", " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as EntryStatus | "all")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {statuses.map((item) => (<SelectItem key={item} value={item}>{item}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>From</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" onClick={resetFilters} className="rounded-full">Reset filters</Button>
            </div>
          )}

          <div className="mt-6 overflow-x-auto border-t border-slate-100 pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (<TableRow><TableCell colSpan={6} className="h-28 text-center text-slate-500">Loading transactions...</TableCell></TableRow>)}
                {isError && (<TableRow><TableCell colSpan={6} className="h-28 text-center text-rose-600">Transactions could not be loaded.</TableCell></TableRow>)}
                {!isLoading && !isError && entries?.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="h-28 text-center text-slate-500">No transactions match these filters.</TableCell></TableRow>
                )}
                {entries?.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap text-slate-500">{new Date(entry.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="min-w-52 max-w-sm whitespace-normal text-slate-900">{entry.description}</TableCell>
                    <TableCell className="capitalize text-slate-600">{entry.type.replaceAll("_", " ")}</TableCell>
                    <TableCell className="capitalize text-slate-600">{entry.category.replaceAll("_", " ")}</TableCell>
                    <TableCell className="whitespace-nowrap font-medium text-slate-900">{formatCurrency(entry.amount)}</TableCell>
                    <TableCell><StatusBadge status={entry.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  );
}
