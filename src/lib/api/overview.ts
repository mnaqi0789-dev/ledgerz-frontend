import { apiFetch } from "@/lib/api/client";

export interface Overview {
  periodStart: string;
  periodEnd: string;
  cashIn: number;
  cashOut: number;
  netCashFlow: number;
  pendingEntries: number;
  approvedEntryCount: number;
  treasuryValue: number;
  treasuryCost: number;
  unrealizedGainLoss: number;
  categoryTotals: Record<string, number>;
}

export function getOverview() {
  return apiFetch<Overview>("/overview");
}
