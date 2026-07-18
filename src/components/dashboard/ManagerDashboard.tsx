"use client";

import { useState } from "react";
import { ClipboardList, Inbox } from "lucide-react";
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

function RequestsPanel() {
  const queryClient = useQueryClient();
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [lastCreatedEmail, setLastCreatedEmail] = useState<string | null>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ["access-requests", "pending"],
    queryFn: () => getAccessRequests({ status: "pending" }),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) => approveAccessRequest(id, password),
    onSuccess: (data) => {
      setLastCreatedEmail(data.request.email);
      queryClient.invalidateQueries({ queryKey: ["access-requests"] });
      setApprovingId(null);
      setPassword("");
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
      {lastCreatedEmail && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          Account created for {lastCreatedEmail} — share the password with them directly.
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
                    <Dialog
                      open={approvingId === r.id}
                      onOpenChange={(open) => {
                        setApprovingId(open ? r.id : null);
                        if (!open) setPassword("");
                      }}
                    >
                      <DialogTrigger render={<Button size="sm" />}>Approve</DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Set a password for {r.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          <Label>Password (min. 8 characters)</Label>
                          <Input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Choose a password to share with them"
                          />
                          <Button
                            onClick={() => approveMutation.mutate({ id: r.id, password })}
                            disabled={approveMutation.isPending || password.length < 8}
                          >
                            Create account
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
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