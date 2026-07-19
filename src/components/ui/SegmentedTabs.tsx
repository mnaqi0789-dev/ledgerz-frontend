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
    <div className="mb-6 inline-flex flex-wrap gap-1 rounded-full border border-slate-200/70 bg-white/70 p-1 shadow-[0_8px_30px_-12px_rgba(37,99,235,0.10)] backdrop-blur-xl">
      {items.map((item) => {
        const isActive = active === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
            }`}
          >
            {item.icon}
            {item.label}
            {item.count !== undefined && (
              <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-white/20 text-white" : "bg-blue-50 text-blue-700"}`}>
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
