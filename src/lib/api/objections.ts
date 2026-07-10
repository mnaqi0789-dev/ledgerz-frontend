import { apiFetch } from "@/lib/api/client";

export interface Objection {
  id: number;
  entryId: number;
  raisedBy: number;
  note: string;
  resolved: boolean;
  createdAt: string;
  entry?: { id: number; description: string; amount: string; status: string };
  raiser?: { id: number; name: string };
}

export function createObjection(input: { entryId: number; note: string }) {
  return apiFetch<Objection>("/objections", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getObjections() {
  return apiFetch<Objection[]>("/objections");
}
