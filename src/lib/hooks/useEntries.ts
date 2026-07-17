import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveEntry,
  createEntry,
  CreateEntryInput,
  deleteEntry,
  EntryCategory,
  EntryStatus,
  getEntries,
  rejectEntry,
  resubmitEntry,
  updateEntry,
} from "@/lib/api/entries";

export type EntriesScope = "mine" | "all" | "transactions";

export interface EntriesFilters {
  status?: EntryStatus;
  category?: EntryCategory;
  startDate?: string;
  endDate?: string;
  includeDeleted?: boolean;
}

export function useEntries(scope: EntriesScope, filters?: EntriesFilters) {
  return useQuery({
    queryKey: ["entries", scope, filters ?? {}],
    queryFn: () => getEntries(filters),
  });
}

export function useCreateEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEntryInput) => createEntry(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });
}

export function useApproveEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => approveEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });
}

export function useRejectEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      rejectEntry(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });
}

export function useUpdateEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: Partial<CreateEntryInput>;
    }) => updateEntry(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });
}

export function useDeleteEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });
}

export function useResubmitEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: CreateEntryInput }) =>
      resubmitEntry(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });
}
