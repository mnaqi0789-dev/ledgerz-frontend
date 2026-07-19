import type { Metadata } from "next";

export const metadata: Metadata = { title: "Overview · Ledgerz" };

export default function OverviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}