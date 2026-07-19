import { create } from "zustand";

interface ConfirmState {
  open: boolean;
  title: string;
  description: string;
  resolver: ((value: boolean) => void) | null;
  ask: (title: string, description?: string) => Promise<boolean>;
  resolve: (value: boolean) => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  open: false,
  title: "",
  description: "",
  resolver: null,
  ask: (title, description = "") =>
    new Promise<boolean>((resolve) => {
      set({ open: true, title, description, resolver: resolve });
    }),
  resolve: (value) => {
    const resolver = get().resolver;
    set({ open: false, resolver: null });
    if (resolver) resolver(value);
  },
}));
