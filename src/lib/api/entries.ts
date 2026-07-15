import { apiFetch } from "@/lib/api/client";

export type EntryType = "in" | "out" | "treasury_transfer";

export type EntryCategory =
  | "rent"
  | "utilities"
  | "salaries"
  | "client_payment"
  | "vendor_payment"
  | "office_supplies"
  | "travel"
  | "marketing"
  | "software_subscriptions"
  | "insurance"
  | "taxes"
  | "treasury"
  | "professional_fees"
  | "equipment"
  | "misc";

export type EntryStatus = "submitted" | "approved" | "rejected";

export interface Entry {
  id: number;
  amount: string;
  type: EntryType;
  category: EntryCategory;
  description: string;
  status: EntryStatus;
  submittedBy: number;
  decidedBy: number | null;
  rejectionReason: string | null;
  createdAt: string;
  decidedAt: string | null;
  deletedAt: string | null;
  submitter?: { id: number; name: string };
  _count?: { objections: number };
}

export interface CreateEntryInput {
  amount: number;
  type: EntryType;
  category: EntryCategory;
  description: string;
}

export function createEntry(input: CreateEntryInput) {
  return apiFetch<Entry>("/entries", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getEntries(params?: {
  status?: EntryStatus;
  category?: EntryCategory;
  startDate?: string;
  endDate?: string;
  includeDeleted?: boolean;
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.category) query.set("category", params.category);
  if (params?.startDate) query.set("startDate", params.startDate);
  if (params?.endDate) query.set("endDate", params.endDate);
  if (params?.includeDeleted) query.set("includeDeleted", "true");
  const queryString = query.toString();
  return apiFetch<Entry[]>(`/entries${queryString ? `?${queryString}` : ""}`);
}

export function approveEntry(id: number) {
  return apiFetch<Entry>(`/entries/${id}/approve`, { method: "PATCH" });
}

export function rejectEntry(id: number, rejectionReason: string) {
  return apiFetch<Entry>(`/entries/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ rejectionReason }),
  });
}

export function updateEntry(id: number, input: Partial<CreateEntryInput>) {
  return apiFetch<Entry>(`/entries/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteEntry(id: number) {
  return apiFetch<Entry>(`/entries/${id}`, { method: "DELETE" });
}

export function resubmitEntry(id: number, input: CreateEntryInput) {
  return apiFetch<Entry>(`/entries/${id}/resubmit`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export const ENTRY_CATEGORIES: EntryCategory[] = [
  "rent",
  "utilities",
  "salaries",
  "client_payment",
  "vendor_payment",
  "office_supplies",
  "travel",
  "marketing",
  "software_subscriptions",
  "insurance",
  "taxes",
  "treasury",
  "professional_fees",
  "equipment",
  "misc",
];
