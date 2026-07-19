import type { Metadata } from "next";

export const metadata: Metadata = { title: "Transactions · Ledgerz" };

export default function TransactionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}