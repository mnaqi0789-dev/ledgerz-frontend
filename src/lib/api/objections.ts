import { apiFetch } from "@/lib/api/client";

export interface TreasuryHoldingFull {
  id: number;
  assetName: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  currentValue: number;
  gainLossPercent: number;
  lastPriceUpdate: string;
  updatedAt: string;
}

export interface TreasuryHoldingSimple {
  assetName: string;
  currentValue: number;
  gainLossPercent: number;
}

export function getTreasury<T = TreasuryHoldingFull | TreasuryHoldingSimple>() {
  return apiFetch<T[]>("/treasury");
}

export function buyTreasury(input: {
  assetName: string;
  quantity: number;
  price: number;
}) {
  return apiFetch("/treasury/buy", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function sellTreasury(input: {
  assetName: string;
  quantity: number;
  price: number;
}) {
  return apiFetch("/treasury/sell", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
