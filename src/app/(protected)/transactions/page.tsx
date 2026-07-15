"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ENTRY_CATEGORIES, EntryCategory, EntryStatus, getEntries } from "@/lib/api/entries";
import { formatCurrency } from "@/lib/formatters";

const statuses: EntryStatus[] = ["submitted", "approved", "rejected"];

export default function TransactionsPage() {
  const [category, setCategory] = useState<EntryCategory | "all">("all");
  const [status, setStatus] = useState<EntryStatus | "all">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const filters = {
    category: category === "all" ? undefined : category,
    status: status === "all" ? undefined : status,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  };
  const { data: entries, isLoading, isError } = useQuery({
    queryKey: ["entries", "transactions", filters],
    queryFn: () => getEntries(filters),
  });

  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Ledger</p>
          <h1 className="mt-1 font-serif text-3xl text-slate-950">Transactions</h1>
        </div>
        <p className="text-sm text-slate-500">{entries?.length ?? 0} records</p>
      </div>

      <Card className="mt-7 gap-0 rounded-md border border-slate-200 p-5 shadow-none">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2"><Label>Category</Label><Select value={category} onValueChange={(value) => setCategory(value as EntryCategory | "all")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All categories</SelectItem>{ENTRY_CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item.replaceAll("_", " ")}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Status</Label><Select value={status} onValueChange={(value) => setStatus(value as EntryStatus | "all")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{statuses.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>From</Label><Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></div>
          <div className="space-y-2"><Label>To</Label><Input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></div>
        </div>
      </Card>

      <Card className="mt-5 gap-0 rounded-md border border-slate-200 py-0 shadow-none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Type</TableHead><TableHead>Category</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={6} className="h-28 text-center text-slate-500">Loading transactions...</TableCell></TableRow>}
              {isError && <TableRow><TableCell colSpan={6} className="h-28 text-center text-rose-600">Transactions could not be loaded.</TableCell></TableRow>}
              {!isLoading && !isError && entries?.length === 0 && <TableRow><TableCell colSpan={6} className="h-28 text-center text-slate-500">No transactions match these filters.</TableCell></TableRow>}
              {entries?.map((entry) => <TableRow key={entry.id}><TableCell className="whitespace-nowrap text-slate-500">{new Date(entry.createdAt).toLocaleDateString()}</TableCell><TableCell className="min-w-52 max-w-sm whitespace-normal text-slate-900">{entry.description}</TableCell><TableCell className="capitalize text-slate-600">{entry.type.replaceAll("_", " ")}</TableCell><TableCell className="capitalize text-slate-600">{entry.category.replaceAll("_", " ")}</TableCell><TableCell className="whitespace-nowrap font-medium text-slate-900">{formatCurrency(entry.amount)}</TableCell><TableCell><StatusBadge status={entry.status} /></TableCell></TableRow>)}
            </TableBody>
          </Table>
        </div>
      </Card>
    </main>
  );
}
