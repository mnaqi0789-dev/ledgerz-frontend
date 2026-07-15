"use client";

import { useState } from "react";
import { Files, MessageSquareWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
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
import { getEntries, Entry } from "@/lib/api/entries";
import { createObjection, getObjections } from "@/lib/api/objections";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function AdminDashboard() {
  const [tab, setTab] = useState("entries");
  const { data: objections } = useQuery({
    queryKey: ["objections"],
    queryFn: getObjections,
  });

  return (
    <div>
      <SegmentedTabs
        active={tab}
        onChange={setTab}
        items={[
          { value: "entries", label: "All entries", icon: <Files className="h-4 w-4" /> },
          {
            value: "objections",
            label: "Objections",
            icon: <MessageSquareWarning className="h-4 w-4" />,
            count: objections?.length ?? 0,
          },
        ]}
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        {tab === "entries" && <EntriesPanel />}
        {tab === "objections" && <ObjectionsPanel />}
      </div>
    </div>
  );
}

function EntriesPanel() {
  const queryClient = useQueryClient();
  const [objectingId, setObjectingId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);

  const { data: entries, isLoading } = useQuery({
    queryKey: ["entries", "all", showDeleted],
    queryFn: () => getEntries({ includeDeleted: showDeleted }),
  });

  const objectionMutation = useMutation({
    mutationFn: ({ entryId, note }: { entryId: number; note: string }) =>
      createObjection({ entryId, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["objections"] });
      queryClient.invalidateQueries({ queryKey: ["entries", "all"] });
      setObjectingId(null);
      setNote("");
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Something went wrong"),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-slate-900">All entries</h2>
          <p className="mt-1 text-sm text-slate-500">Full visibility, read-only.</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(e) => setShowDeleted(e.target.checked)}
          />
          Show deleted
        </label>
      </div>
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
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
                <TableHead>Objections</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries?.map((entry: Entry) => (
                <TableRow
                  key={entry.id}
                  className={entry.deletedAt ? "opacity-50" : undefined}
                >
                  <TableCell>{entry.submitter?.name ?? entry.submittedBy}</TableCell>
                  <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                  <TableCell className="text-slate-600">{entry.category}</TableCell>
                  <TableCell>{entry.amount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={entry.status} />
                      {entry.deletedAt && (
                        <Badge variant="outline" className="border-slate-300 bg-slate-100 text-slate-500">
                          Deleted
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {entry._count && entry._count.objections > 0 ? (
                      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                        {entry._count.objections}
                      </Badge>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog
                      open={objectingId === entry.id}
                      onOpenChange={(open) => setObjectingId(open ? entry.id : null)}
                    >
                      <DialogTrigger render={<Button size="sm" variant="outline" disabled={!!entry.deletedAt} />}>
                        Raise objection
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Raise objection</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          <Label>Note</Label>
                          <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
                          <Button
                            onClick={() => objectionMutation.mutate({ entryId: entry.id, note })}
                            disabled={objectionMutation.isPending || note.trim().length === 0}
                          >
                            Submit objection
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
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

function ObjectionsPanel() {
  const { data: objections, isLoading } = useQuery({ queryKey: ["objections"], queryFn: getObjections });

  return (
    <div>
      <h2 className="font-serif text-xl text-slate-900">Objections</h2>
      <p className="mt-1 text-sm text-slate-500">Everything flagged so far.</p>
      <div className="mt-6">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : objections && objections.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entry</TableHead>
                <TableHead>Raised by</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Raised on</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {objections.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="max-w-xs truncate">{o.entry?.description ?? o.entryId}</TableCell>
                  <TableCell>{o.raiser?.name ?? o.raisedBy}</TableCell>
                  <TableCell className="max-w-xs truncate">{o.note}</TableCell>
                  <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-slate-500">No objections raised.</p>
        )}
      </div>
    </div>
  );
}