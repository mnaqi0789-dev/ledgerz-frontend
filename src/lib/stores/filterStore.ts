import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EntryCategory, EntryStatus } from "@/lib/api/entries";

interface FilterState {
  category: EntryCategory | "all";
  status: EntryStatus | "all";
  startDate: string;
  endDate: string;
  hasHydrated: boolean;
  setCategory: (category: EntryCategory | "all") => void;
  setStatus: (status: EntryStatus | "all") => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  resetFilters: () => void;
  setHasHydrated: (value: boolean) => void;
}

const defaultFilters = {
  category: "all" as const,
  status: "all" as const,
  startDate: "",
  endDate: "",
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...defaultFilters,
      hasHydrated: false,
      setCategory: (category) => set({ category }),
      setStatus: (status) => set({ status }),
      setStartDate: (startDate) => set({ startDate }),
      setEndDate: (endDate) => set({ endDate }),
      resetFilters: () => set({ ...defaultFilters }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "ledgerz-filters",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
