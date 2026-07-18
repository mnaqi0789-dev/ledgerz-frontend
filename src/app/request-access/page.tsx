"use client";

import { useState } from "react";
import Link from "next/link";
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
import { createAccessRequest } from "@/lib/api/accessRequests";

const ROLES: ("maker" | "manager" | "admin")[] = ["maker", "manager", "admin"];

export default function RequestAccessPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requestedRole, setRequestedRole] = useState<"maker" | "manager" | "admin" | "">("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !requestedRole) {
      setError("Name, email, and role are required");
      return;
    }

    setSubmitting(true);
    try {
      await createAccessRequest({ name, email, requestedRole, note: note || undefined });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            LedgerZ
          </span>
        </div>
        <h1 className="mt-4 font-serif text-2xl text-slate-900">Request sent</h1>
        <p className="mt-2 text-sm text-slate-500">
          A manager will review your request. You&apos;ll receive your login details once approved.
        </p>
        <Link href="/login" className="mt-6 text-sm font-medium text-emerald-700 hover:text-emerald-800">
          Back to login
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-24">
      <div className="inline-flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          LedgerZ
        </span>
      </div>

      <h1 className="mt-4 font-serif text-3xl text-slate-900">Request access</h1>
      <p className="mt-2 text-sm text-slate-500">
        A manager will review and create your account.
      </p>

      <Card className="mt-8 rounded-2xl border-slate-200/70 bg-white/80 p-6 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.15)] backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@ledgerz.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={requestedRole} onValueChange={(v) => setRequestedRole(v as typeof requestedRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            // ..
          </div>
          <div className="space-y-2">
            <Label>Note (optional)</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why do you need access?" />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-700">
            {submitting ? "Sending..." : "Send request"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-emerald-700 hover:text-emerald-800">
          Log in
        </Link>
      </p>
    </section>
  );
}