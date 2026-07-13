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
import {
  createObjection,
  getObjections,
  Objection,
} from "@/lib/api/objections";
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
      <Card className="p-6 border-slate-200">
        <h2 className="font-serif text-xl text-slate-900 mb-4">All entries</h2>
        {error && <p className="text-sm text-rose-600 mb-3">{error}</p>}
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
                  <TableCell>
                    {entry.submitter?.name ?? entry.submittedBy}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {entry.description}
                  </TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>{entry.amount}</TableCell>
                  <TableCell>
                    <StatusBadge status={entry.status} />
                  </TableCell>
                  <TableCell>
                    {entry._count && entry._count.objections > 0 ? (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200"
                      >
                        {entry._count.objections}
                      </Badge>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog
                      open={objectingId === entry.id}
                      onOpenChange={(open) =>
                        setObjectingId(open ? entry.id : null)
                      }
                    >
                      <DialogTrigger
                        render={<Button size="sm" variant="outline" />}
                      >
                        Raise objection
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Raise objection</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          <Label>Note</Label>
                          <Textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                          />
                          <Button
                            onClick={() =>
                              objectionMutation.mutate({
                                entryId: entry.id,
                                note,
                              })
                            }
                            disabled={
                              objectionMutation.isPending ||
                              note.trim().length === 0
                            }
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
      </Card>

      <Card className="p-6 border-slate-200">
        <h2 className="font-serif text-xl text-slate-900 mb-4">Objections</h2>
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
              {objections?.map((o: Objection) => (
                <TableRow key={o.id}>
                  <TableCell className="max-w-xs truncate">
                    {o.entry?.description ?? o.entryId}
                  </TableCell>
                  <TableCell>{o.raiser?.name ?? o.raisedBy}</TableCell>
                  <TableCell className="max-w-xs truncate">{o.note}</TableCell>
                  <TableCell>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
