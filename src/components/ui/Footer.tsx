import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mx-auto w-full max-w-7xl px-4 pb-6 pt-16 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-3 rounded-full border border-slate-200/70 bg-white/70 px-6 py-3 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.15)] backdrop-blur-xl sm:flex-row">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 font-serif text-xs font-semibold text-white">L</span>
          <span className="text-[13px] font-semibold tracking-[0.18em] text-emerald-800">LEDGERZ</span>
        </Link>
        <p className="text-xs text-slate-500">© {year} LedgerZ. All rights reserved.</p>
      </div>
    </footer>
  );
}
