"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { login } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/authStore";

const DEMO_ACCOUNTS = [
  { role: "Maker 1", email: "maker1@ledgerz.com" },
  { role: "Maker 2", email: "maker2@ledgerz.com" },
  { role: "Manager", email: "manager@ledgerz.com" },
  { role: "Admin", email: "admin@ledgerz.com" },
];

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) { setError("Email and password are required"); return; }
    setSubmitting(true);
    try {
      const response = await login({ email, password });
      setUser(response.user, response.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setSubmitting(false); }
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-24">
      <div className="inline-flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">LedgerZ</span>
      </div>

      <h1 className="mt-4 font-serif text-3xl text-slate-900">Log in</h1>
      <p className="mt-2 text-sm text-slate-500">Enter your credentials to access your dashboard.</p>

      <div className="mt-6 rounded-2xl border border-blue-200/70 bg-blue-50/70 p-4 text-xs text-blue-800 backdrop-blur-xl">
        <p className="font-semibold">To demo the app, use these credentials:</p>
        <ul className="mt-2 space-y-1">
          {DEMO_ACCOUNTS.map((a) => (
            <li key={a.email}><span className="font-medium">{a.role}:</span> {a.email}</li>
          ))}
        </ul>
        <p className="mt-2">Password for all: password123</p>
      </div>

      <Card className="mt-6 rounded-2xl border-slate-200/70 bg-white/80 p-6 shadow-[0_8px_30px_-12px_rgba(37,99,235,0.15)] backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@ledgerz.com" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full rounded-full bg-blue-600 hover:bg-blue-700">
            {submitting ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </Card>
    </section>
  );
}
