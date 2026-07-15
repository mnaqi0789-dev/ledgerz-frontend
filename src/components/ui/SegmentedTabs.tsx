"use client";

import { ReactNode } from "react";

export interface SegmentedTabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface SegmentedTabsProps {
  items: SegmentedTabItem[];
  active: string;
  onChange: (value: string) => void;
}

export function SegmentedTabs({ items, active, onChange }: SegmentedTabsProps) {
  return (
    <div className="mb-6 inline-flex flex-wrap gap-1 rounded-full border border-slate-200 bg-white p-1">
      {items.map((item) => {
        const isActive = active === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-emerald-600"
            }`}
          >
            {item.icon}
            {item.label}
            {item.count !== undefined && (
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}