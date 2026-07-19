"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfirmStore } from "@/lib/stores/confirmStore";

export function ConfirmDialogHost() {
  const { open, title, description, resolve } = useConfirmStore();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-serif text-xl text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={() => resolve(false)}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-4" />
          </button>
        </div>
        {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => resolve(false)}>
            Cancel
          </Button>
          <Button className="bg-rose-600 text-white hover:bg-rose-700" onClick={() => resolve(true)}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}