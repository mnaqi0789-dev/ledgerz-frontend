"use client";

import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  createEntry,
  getEntries,
  Entry,
  EntryType,
  EntryCategory,
} from "@/lib/api/entries";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ENTRY_TYPES: EntryType[] = ["in", "out", "treasury_transfer"];
const ENTRY_CATEGORIES: EntryCategory[] = [
  "rent",
  "salaries",
  "client_payment",
  "treasury",
  "misc",
];

export function MakerDashboard() {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<EntryType | "">("");
  const [category, setCategory] = useState<EntryCategory | "">("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: entries, isLoading } = useQuery({
    queryKey: ["entries", "mine"],
    queryFn: () => getEntries(),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!amount || !type || !category || !description) {
      setError("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      await createEntry({
        amount: Number(amount),
        type,
        category,
        description,
      });
      setAmount("");
      setType("");
      setCategory("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["entries", "mine"] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card className="p-6 border-slate-200">
        <h2 className="font-serif text-xl text-slate-900 mb-4">
          Submit an entry
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as EntryType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {ENTRY_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as EntryCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {ENTRY_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this entry for?"
            />
          </div>
          {error && (
            <p className="text-sm text-rose-600 sm:col-span-2">{error}</p>
          )}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit entry"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6 border-slate-200">
        <h2 className="font-serif text-xl text-slate-900 mb-4">Your entries</h2>
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading entries...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries?.map((entry: Entry) => (
                <Fragment key={entry.id}>
                  <TableRow>
                    <TableCell className="max-w-xs truncate">
                      {entry.description}
                    </TableCell>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell>{entry.amount}</TableCell>
                    <TableCell>
                      <StatusBadge status={entry.status} />
                    </TableCell>
                  </TableRow>
                  {entry.status === "rejected" && entry.rejectionReason && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-sm text-rose-600 bg-rose-50/50"
                      >
                        Rejection reason: {entry.rejectionReason}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
