"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { login } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/authStore";

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
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setSubmitting(true);
    try {
      const response = await login({ email, password });
      setUser(response.user, response.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-24">
      <Link href="/" className="inline-flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          LedgerZ
        </span>
      </Link>

      <h1 className="mt-6 font-serif text-4xl tracking-tight text-slate-900">
        Welcome back.
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Enter your credentials to access your dashboard.
      </p>

      <Card className="mt-8 rounded-2xl border-slate-200/70 bg-white/80 p-6 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.15)] backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700"
          >
            {submitting ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-emerald-700 hover:text-emerald-800">
          Create one
        </Link>
      </p>
    </section>
  );
}
