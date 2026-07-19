import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { ConfirmDialogHost } from "@/components/ui/ConfirmDialogHost";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "LedgerZ — Finance, accounted for.",
  description:
    "A single, auditable system for logging entries, approving them, and keeping every financial decision visible.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased">
        <QueryProvider>{children}</QueryProvider>
        <ConfirmDialogHost />
      </body>
    </html>
  );
}