import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "../lib/providers/QueryProvider";

export const metadata: Metadata = {
  title: "LedgerZ",
  description: "Finance Department Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}