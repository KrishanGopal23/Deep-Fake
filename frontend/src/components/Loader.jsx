function Loader() {
  return (
    <div
      className="rounded-[2rem] border border-sky-100 bg-white/85 p-6 shadow-panel backdrop-blur-2xl sm:p-8"
      aria-live="polite"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300 shadow-glow">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-900/20 border-t-slate-900" />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
            Processing
          </p>
          <h2 className="mt-2 font-display text-2xl text-slate-900">
            Checking your image
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        Please wait a moment.
      </p>

      <div className="mt-6 space-y-3">
        <div className="h-4 w-full animate-pulse rounded-full bg-sky-100" />
        <div className="h-4 w-3/5 animate-pulse rounded-full bg-sky-100" />
        <div className="h-24 animate-pulse rounded-[1.5rem] bg-gradient-to-r from-sky-50 to-emerald-50" />
      </div>
    </div>
  );
}

export default Loader;
