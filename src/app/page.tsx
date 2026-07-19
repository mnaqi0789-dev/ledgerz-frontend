import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
      <div className="inline-flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          LedgerZ &middot; Finance Department
        </span>
      </div>

      <h1 className="mt-6 font-serif text-5xl font-normal leading-[1.1] tracking-tight text-slate-900 sm:text-6xl">
        Every entry accounted for.
        <br />
        Every <span className="font-medium text-blue-600">decision</span> traced.
      </h1>

      <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-500">
        A single, auditable system for logging entries and keeping every
        financial decision visible to the people accountable for it.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-full bg-blue-600 px-7 text-sm font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          Log in
        </Link>

        <Link
          href="/request-access"
          className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 px-7 text-sm font-semibold tracking-wide text-slate-600 transition-colors hover:border-blue-600 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          Request access
        </Link>
      </div>

      <div className="mt-14 flex items-center gap-10 border-t border-slate-100 pt-7">
        <Stat value="3" label="Roles" />
        <span className="h-9 w-px bg-slate-200" />
        <Stat value="100%" label="Auditable" accent />
      </div>
    </section>
  );
}

function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`font-serif text-2xl font-light ${accent ? "text-blue-600" : "text-slate-900"}`}>
        {value}
      </span>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
    </div>
  );
}
