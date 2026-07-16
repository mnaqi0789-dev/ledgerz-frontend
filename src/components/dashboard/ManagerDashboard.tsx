"use client";

import { useState } from "react";
import { ClipboardList, Landmark, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import {
  getEntries,
  approveEntry,
  rejectEntry,
  updateEntry,
  deleteEntry,
  Entry,
  EntryType,
  EntryCategory,
  ENTRY_CATEGORIES,
} from "@/lib/api/entries";
import { buyTreasury, sellTreasury } from "@/lib/api/treasury";
import {
  getAccessRequests,
  approveAccessRequest,
  denyAccessRequest,
} from "@/lib/api/accessRequests";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ENTRY_TYPES: EntryType[] = ["in", "out", "treasury_transfer"];

export function ManagerDashboard() {
  const [tab, setTab] = useState("entries");
  const { data: requests } = useQuery({
    queryKey: ["access-requests", "pending"],
    queryFn: () => getAccessRequests({ status: "pending" }),
  });

  return (
    <div>
      <SegmentedTabs
        active={tab}
        onChange={setTab}
        items={[
          { value: "entries", label: "Entries", icon: <ClipboardList className="h-4 w-4" /> },
          { value: "treasury", label: "Treasury", icon: <Landmark className="h-4 w-4" /> },
          {
            value: "requests",
            label: "Requests",
            icon: <Inbox className="h-4 w-4" />,
            count: requests?.length ?? 0,
          },
        ]}
      />
      <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.10)] backdrop-blur-xl sm:p-8">
        {tab === "entries" && <EntriesPanel />}
        {tab === "treasury" && <TreasuryPanel />}
        {tab === "requests" && <RequestsPanel />}
      </div>
    </div>
  );
}

function EntriesPanel() {
  const queryClient = useQueryClient();
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState<EntryType | "">("");
  const [editCategory, setEditCategory] = useState<EntryCategory | "">("");
  const [editDescription, setEditDescription] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: entries, isLoading } = useQuery({
    queryKey: ["entries", "all"],
    queryFn: () => getEntries(),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["entries"] });
  }

  const approveMutation = useMutation({
    mutationFn: (id: number) => approveEntry(id),
    onSuccess: invalidate,
    onError: (err) => setActionError(err instanceof Error ? err.message : "Something went wrong"),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => rejectEntry(id, reason),
    onSuccess: () => {
      invalidate();
      setRejectingId(null);
      setRejectionReason("");
    },
    onError: (err) => setActionError(err instanceof Error ? err.message : "Something went wrong"),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateEntry(editingEntry!.id, {
        amount: Number(editAmount),
        type: editType as EntryType,
        category: editCategory as EntryCategory,
        description: editDescription,
      }),
    onSuccess: () => {
      invalidate();
      setEditingEntry(null);
    },
    onError: (err) => setActionError(err instanceof Error ? err.message : "Something went wrong"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteEntry(id),
    onSuccess: invalidate,
    onError: (err) => setActionError(err instanceof Error ? err.message : "Something went wrong"),
  });

  function openEdit(entry: Entry) {
    setEditingEntry(entry);
    setEditAmount(entry.amount);
    setEditType(entry.type);
    setEditCategory(entry.category);
    setEditDescription(entry.description);
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-slate-900">All entries</h2>
      <p className="mt-1 text-sm text-slate-500">Review, edit, or remove any entry.</p>
      {actionError && <p className="mt-3 text-sm text-rose-600">{actionError}</p>}
      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submitted by</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries?.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.submitter?.name ?? entry.submittedBy}</TableCell>
                  <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                  <TableCell className="text-slate-600">{entry.category}</TableCell>
                  <TableCell>{entry.amount}</TableCell>
                  <TableCell className="capitalize text-slate-600">{entry.status}</TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    {entry.status === "submitted" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(entry.id)}
                          disabled={approveMutation.isPending}
                        >
                          Approve
                        </Button>
                        <Dialog
                          open={rejectingId === entry.id}
                          onOpenChange={(open) => setRejectingId(open ? entry.id : null)}
                        >
                          <DialogTrigger render={<Button size="sm" variant="outline" />}>
                            Reject
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject entry</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                              <Label>Reason</Label>
                              <Textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                              />
                              <Button
                                onClick={() => rejectMutation.mutate({ id: entry.id, reason: rejectionReason })}
                                disabled={rejectMutation.isPending || rejectionReason.trim().length === 0}
                              >
                                Confirm rejection
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                    <Dialog
                      open={editingEntry?.id === entry.id}
                      onOpenChange={(open) => !open && setEditingEntry(null)}
                    >
                      <DialogTrigger render={<Button size="sm" variant="outline" onClick={() => openEdit(entry)} />}>
                        Edit
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit entry</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          <Label>Amount</Label>
                          <Input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
                          <Label>Type</Label>
                          <Select value={editType} onValueChange={(v) => setEditType(v as EntryType)}>
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
                          <Select value={editCategory} onValueChange={(v) => setEditCategory(v as EntryCategory)}>
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
                          <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                          <Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
                            Save changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-rose-200 text-rose-600 hover:bg-rose-50"
                      onClick={() => {
                        if (confirm("Delete this entry? This cannot be undone from the UI.")) {
                          deleteMutation.mutate(entry.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
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

function TreasuryPanel() {
  const queryClient = useQueryClient();
  const [assetName, setAssetName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [treasuryError, setTreasuryError] = useState<string | null>(null);
  const [treasuryBusy, setTreasuryBusy] = useState(false);

  async function handleTreasurySubmit(action: "buy" | "sell") {
    setTreasuryError(null);

    if (!assetName || !quantity || !price) {
      setTreasuryError("All fields are required");
      return;
    }

    setTreasuryBusy(true);
    try {
      const input = { assetName: assetName.toUpperCase(), quantity: Number(quantity), price: Number(price) };
      if (action === "buy") {
        await buyTreasury(input);
      } else {
        await sellTreasury(input);
      }
      setAssetName("");
      setQuantity("");
      setPrice("");
      queryClient.invalidateQueries({ queryKey: ["treasury"] });
    } catch (err) {
      setTreasuryError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setTreasuryBusy(false);
    }
  }

  return (
<>
    <div>
      <h2 className="font-serif text-2xl text-slate-900">Treasury actions</h2>
      <p className="mt-1 text-sm text-slate-500">
        Look up a real ticker on{" "}
        
       <a   href="https://finance.yahoo.com"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-emerald-700 hover:text-emerald-800"
        >
          Yahoo Finance
        </a>{" "}
        to confirm a symbol, then record the trade below.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Ticker symbol</Label>
          <Input value={assetName} onChange={(e) => setAssetName(e.target.value)} placeholder="AAPL" />
        </div>
        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Price</Label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
      </div>
      {treasuryError && <p className="mt-3 text-sm text-rose-600">{treasuryError}</p>}
      <div className="mt-5 flex gap-2">
        <Button onClick={() => handleTreasurySubmit("buy")} disabled={treasuryBusy}>
          Buy
        </Button>
        <Button variant="outline" onClick={() => handleTreasurySubmit("sell")} disabled={treasuryBusy}>
          Sell
        </Button>
      </div>
    </div></>
  );
}

function RequestsPanel() {
  const queryClient = useQueryClient();
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ["access-requests", "pending"],
    queryFn: () => getAccessRequests({ status: "pending" }),
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => approveAccessRequest(id),
    onSuccess: (data) => {
      setTempPassword(data.tempPassword);
      queryClient.invalidateQueries({ queryKey: ["access-requests"] });
    },
    onError: (err) => setActionError(err instanceof Error ? err.message : "Something went wrong"),
  });

  const denyMutation = useMutation({
    mutationFn: (id: number) => denyAccessRequest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["access-requests"] }),
    onError: (err) => setActionError(err instanceof Error ? err.message : "Something went wrong"),
  });

  return (
    <div>
      <h2 className="font-serif text-2xl text-slate-900">Access requests</h2>
      <p className="mt-1 text-sm text-slate-500">Approve to create the account, or deny it.</p>
      {actionError && <p className="mt-3 text-sm text-rose-600">{actionError}</p>}
      {tempPassword && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          Account created. Temporary password: <span className="font-mono font-semibold">{tempPassword}</span>{" "}
          — share this with the user directly.
        </div>
      )}
      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : requests && requests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {r.requestedRole}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-slate-500">{r.note ?? "—"}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" onClick={() => approveMutation.mutate(r.id)} disabled={approveMutation.isPending}>
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => denyMutation.mutate(r.id)}
                      disabled={denyMutation.isPending}
                    >
                      Deny
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-slate-500">No pending requests.</p>
        )}
      </div>
    </div>
  );
}