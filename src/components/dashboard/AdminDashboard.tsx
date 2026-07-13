"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  const queryClient = useQueryClient();
  const [objectingId, setObjectingId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: entries, isLoading: entriesLoading } = useQuery({
    queryKey: ["entries", "all"],
    queryFn: () => getEntries(),
  });

  const { data: objections, isLoading: objectionsLoading } = useQuery({
    queryKey: ["objections"],
    queryFn: getObjections,
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
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Something went wrong");
    },
  });

  return (
    <div className="space-y-8">
      <Card className="rounded-2xl border-slate-200 p-6 shadow-none">
        <h2 className="font-serif text-xl text-slate-900">All entries</h2>
        <p className="mt-1 text-sm text-slate-500">Full visibility, read-only.</p>
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        <div className="mt-6">
          {entriesLoading ? (
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
                  <TableRow key={entry.id}>
                    <TableCell>{entry.submitter?.name ?? entry.submittedBy}</TableCell>
                    <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                    <TableCell className="text-slate-600">{entry.category}</TableCell>
                    <TableCell>{entry.amount}</TableCell>
                    <TableCell>
                      <StatusBadge status={entry.status} />
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
                        <DialogTrigger render={<Button size="sm" variant="outline" className="rounded-full" />}>
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
                              className="rounded-full"
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
      </Card>

      <Card className="rounded-2xl border-slate-200 p-6 shadow-none">
        <h2 className="font-serif text-xl text-slate-900">Objections</h2>
        <p className="mt-1 text-sm text-slate-500">Everything flagged so far.</p>
        <div className="mt-6">
          {objectionsLoading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : (
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
                {objections?.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="max-w-xs truncate">{o.entry?.description ?? o.entryId}</TableCell>
                    <TableCell>{o.raiser?.name ?? o.raisedBy}</TableCell>
                    <TableCell className="max-w-xs truncate">{o.note}</TableCell>
                    <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}