"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { register, RegisterInput } from "@/lib/api/auth";

const ROLES: RegisterInput["role"][] = ["maker", "manager", "admin"];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RegisterInput["role"] | "">("");
  const [error, setError] = useState<string | null>(null);
  const [demoDisabled, setDemoDisabled] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDemoDisabled(false);

    if (!name || !email || !password || !role) {
      setError("All fields are required");
      return;
    }

    setSubmitting(true);
    try {
      await register({ name, email, password, role });
      router.push("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      if (message.toLowerCase().includes("disabled")) {
        setDemoDisabled(true);
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-24">
      <div className="inline-flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          LedgerZ
        </span>
      </div>

      <h1 className="mt-4 font-serif text-3xl text-slate-900">Create an account</h1>
      <p className="mt-2 text-sm text-slate-500">Join your finance department workspace.</p>

      {demoDisabled ? (
        <Card className="mt-8 rounded-2xl border-slate-200 p-6 shadow-none">
          <p className="text-sm text-slate-600">
            Self-registration is turned off on this deployment. Please request access instead
            and a manager will set up your account.
          </p>
          <Link href="/request-access">
            <Button className="mt-4 w-full rounded-full bg-emerald-600 hover:bg-emerald-700">
              Request access
            </Button>
          </Link>
        </Card>
      ) : (
        <Card className="mt-8 rounded-2xl border-slate-200 p-6 shadow-none">
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
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as RegisterInput["role"])}>
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
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <Button type="submit" disabled={submitting} className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700">
              {submitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Card>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
          Log in
        </Link>
      </p>
    </section>
  );
}