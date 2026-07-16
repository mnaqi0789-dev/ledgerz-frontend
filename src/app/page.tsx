import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-1.5 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.15)] backdrop-blur-xl">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
          LedgerZ · Finance Department
        </span>
      </div>

      <h1 className="mt-8 font-serif text-5xl font-normal leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
        Every entry accounted for.
        <br />
        Every <span className="italic text-emerald-700">decision</span> traced.
      </h1>

      <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-500">
        A single, auditable system for logging entries, approving treasury actions,
        and keeping every financial decision visible to the people accountable for it.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-7 text-sm font-semibold tracking-wide text-white shadow-[0_10px_30px_-12px_rgba(5,150,105,0.45)] transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          Log in
        </Link>

        <Link
          href="/register"
          className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white/70 px-7 text-sm font-semibold tracking-wide text-slate-700 backdrop-blur-xl transition-colors hover:border-emerald-600 hover:text-emerald-700"
        >
          Create an account
        </Link>
      </div>

      <div className="mt-16 flex items-center gap-10 rounded-full border border-slate-200/70 bg-white/70 px-8 py-4 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.15)] backdrop-blur-xl">
        <Stat value="3" label="Roles" />
        <span className="h-8 w-px bg-slate-200" />
        <Stat value="100%" label="Auditable" />
        <span className="h-8 w-px bg-slate-200" />
        <Stat value="Real-time" label="Treasury" accent />
      </div>
    </section>
  );
}

function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`font-serif text-lg ${accent ? "text-emerald-700" : "text-slate-900"}`}>
        {value}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
    </div>
  );
}
