import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  buyTreasury,
  getTreasury,
  sellTreasury,
  TreasuryHoldingFull,
  TreasuryHoldingSimple,
} from "@/lib/api/treasury";

export function useTreasury<T = TreasuryHoldingFull | TreasuryHoldingSimple>(
  scopeKey: "full" | "simple",
) {
  return useQuery({
    queryKey: ["treasury", scopeKey],
    queryFn: () => getTreasury<T>(),
  });
}

export function useBuyTreasury() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      assetName: string;
      quantity: number;
      price: number;
    }) => buyTreasury(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treasury"] });
    },
  });
}

export function useSellTreasury() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      assetName: string;
      quantity: number;
      price: number;
    }) => sellTreasury(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treasury"] });
    },
  });
}
