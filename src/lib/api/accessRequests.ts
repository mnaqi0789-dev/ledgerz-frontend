import { apiFetch } from "@/lib/api/client";

export type AccessRequestStatus = "pending" | "approved" | "denied";

export interface AccessRequest {
  id: number;
  name: string;
  email: string;
  requestedRole: "maker" | "manager" | "admin";
  note: string | null;
  status: AccessRequestStatus;
  reviewedBy: number | null;
  reviewer?: { id: number; name: string };
  createdAt: string;
  reviewedAt: string | null;
}

export function createAccessRequest(input: {
  name: string;
  email: string;
  requestedRole: "maker" | "manager" | "admin";
  note?: string;
}) {
  return apiFetch<AccessRequest>("/access-requests", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getAccessRequests(params?: { status?: AccessRequestStatus }) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  const queryString = query.toString();
  return apiFetch<AccessRequest[]>(
    `/access-requests${queryString ? `?${queryString}` : ""}`,
  );
}

export interface ReviewAccessRequestResponse {
  request: AccessRequest;
  tempPassword: string | null;
}

export function approveAccessRequest(id: number) {
  return apiFetch<ReviewAccessRequestResponse>(
    `/access-requests/${id}/approve`,
    {
      method: "PATCH",
    },
  );
}

export function denyAccessRequest(id: number) {
  return apiFetch<ReviewAccessRequestResponse>(`/access-requests/${id}/deny`, {
    method: "PATCH",
  });
}
