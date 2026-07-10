"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
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
import { getEntries, approveEntry, rejectEntry, Entry } from "@/lib/api/entries";
import { buyTreasury, sellTreasury } from "@/lib/api/treasury";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function ManagerDashboard() {
  const queryClient = useQueryClient();
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const [assetName, setAssetName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [treasuryError, setTreasuryError] = useState<string | null>(null);
  const [treasuryBusy, setTreasuryBusy] = useState(false);

  const { data: pendingEntries, isLoading } = useQuery({
    queryKey: ["entries", "pending"],
    queryFn: () => getEntries({ status: "submitted" }),
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => approveEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", "pending"] });
    },
    onError: (err) => {
      setActionError(err instanceof Error ? err.message : "Something went wrong");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => rejectEntry(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", "pending"] });
      setRejectingId(null);
      setRejectionReason("");
    },
    onError: (err) => {
      setActionError(err instanceof Error ? err.message : "Something went wrong");
    },
  });

  async function handleTreasurySubmit(action: "buy" | "sell") {
    setTreasuryError(null);

    if (!assetName || !quantity || !price) {
      setTreasuryError("All fields are required");
      return;
    }

    setTreasuryBusy(true);
    try {
      const input = { assetName, quantity: Number(quantity), price: Number(price) };
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
    <div className="space-y-8">
      <Card className="p-6 border-slate-200">
        <h2 className="font-serif text-xl text-slate-900 mb-4">Pending entries</h2>
        {actionError && <p className="text-sm text-rose-600 mb-3">{actionError}</p>}
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingEntries?.map((entry: Entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.submitter?.name ?? entry.submittedBy}</TableCell>
                  <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>{entry.amount}</TableCell>
                  <TableCell className="flex gap-2">
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
                            placeholder="Why is this being rejected?"
                          />
                          <Button
                            onClick={() =>
                              rejectMutation.mutate({ id: entry.id, reason: rejectionReason })
                            }
                            disabled={rejectMutation.isPending || rejectionReason.trim().length === 0}
                          >
                            Confirm rejection
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
        <h2 className="font-serif text-xl text-slate-900 mb-4">Treasury actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Asset name</Label>
            <Input value={assetName} onChange={(e) => setAssetName(e.target.value)} />
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
        {treasuryError && <p className="text-sm text-rose-600 mt-3">{treasuryError}</p>}
        <div className="flex gap-2 mt-4">
          <Button onClick={() => handleTreasurySubmit("buy")} disabled={treasuryBusy}>
            Buy
          </Button>
          <Button
            variant="outline"
            onClick={() => handleTreasurySubmit("sell")}
            disabled={treasuryBusy}
          >
            Sell
          </Button>
        </div>
      </Card>
    </div>
  );
}