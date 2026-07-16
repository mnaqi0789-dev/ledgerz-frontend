"use client";

import { useState } from "react";
import { PlusCircle, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  resubmitEntry,
  Entry,
  EntryType,
  EntryCategory,
  ENTRY_CATEGORIES,
} from "@/lib/api/entries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ENTRY_TYPES: EntryType[] = ["in", "out", "treasury_transfer"];

export function MakerDashboard() {
  const [tab, setTab] = useState("submit");

  return (
    <div>
      <SegmentedTabs
        active={tab}
        onChange={setTab}
        items={[
          { value: "submit", label: "Submit entry", icon: <PlusCircle className="h-4 w-4" /> },
          { value: "mine", label: "Your entries", icon: <ListChecks className="h-4 w-4" /> },
        ]}
      />
      <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.10)] backdrop-blur-xl sm:p-8">
        {tab === "submit" && <SubmitEntryPanel />}
        {tab === "mine" && <YourEntriesPanel />}
      </div>
    </div>
  );
}

function SubmitEntryPanel() {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<EntryType | "">("");
  const [category, setCategory] = useState<EntryCategory | "">("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!amount || !type || !category || !description) {
      setError("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      await createEntry({ amount: Number(amount), type, category, description });
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
    <div>
      <h2 className="font-serif text-2xl text-slate-900">Submit an entry</h2>
      <p className="mt-1 text-sm text-slate-500">Log a new transaction for review.</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
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
          <Select value={category} onValueChange={(v) => setCategory(v as EntryCategory)}>
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
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        {error && <p className="text-sm text-rose-600 sm:col-span-2">{error}</p>}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit entry"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function YourEntriesPanel() {
  const queryClient = useQueryClient();
  const [resubmittingId, setResubmittingId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<EntryType | "">("");
  const [category, setCategory] = useState<EntryCategory | "">("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: entries, isLoading } = useQuery({
    queryKey: ["entries", "mine"],
    queryFn: () => getEntries(),
  });

  const resubmitMutation = useMutation({
    mutationFn: () =>
      resubmitEntry(resubmittingId!, {
        amount: Number(amount),
        type: type as EntryType,
        category: category as EntryCategory,
        description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", "mine"] });
      setResubmittingId(null);
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Something went wrong"),
  });

  function openResubmit(entry: Entry) {
    setResubmittingId(entry.id);
    setAmount(entry.amount);
    setType(entry.type);
    setCategory(entry.category);
    setDescription(entry.description);
    setError(null);
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-slate-900">Your entries</h2>
      <p className="mt-1 text-sm text-slate-500">Everything you have submitted so far.</p>
      <div className="mt-6">
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
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries?.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="max-w-xs truncate">
                    {entry.description}
                    {entry.status === "rejected" && entry.rejectionReason && (
                      <p className="mt-1 text-xs text-rose-600">Reason: {entry.rejectionReason}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-600">{entry.category}</TableCell>
                  <TableCell>{entry.amount}</TableCell>
                  <TableCell>
                    <StatusBadge status={entry.status} />
                  </TableCell>
                  <TableCell>
                    {entry.status === "rejected" && (
                      <Dialog
                        open={resubmittingId === entry.id}
                        onOpenChange={(open) => !open && setResubmittingId(null)}
                      >
                        <DialogTrigger render={<Button size="sm" variant="outline" onClick={() => openResubmit(entry)} />}>
                          Edit & resubmit
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit and resubmit</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            <Label>Amount</Label>
                            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                            <Label>Type</Label>
                            <Select value={type} onValueChange={(v) => setType(v as EntryType)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ENTRY_TYPES.map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {t}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Label>Category</Label>
                            <Select value={category} onValueChange={(v) => setCategory(v as EntryCategory)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ENTRY_CATEGORIES.map((c) => (
                                  <SelectItem key={c} value={c}>
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Label>Description</Label>
                            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                            {error && <p className="text-sm text-rose-600">{error}</p>}
                            <Button onClick={() => resubmitMutation.mutate()} disabled={resubmitMutation.isPending}>
                              Resubmit
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}