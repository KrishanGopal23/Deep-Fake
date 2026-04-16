function ResultCard({ result }) {
  const isReal = result.prediction.toLowerCase() === 'real';
  const toneClasses = isReal
    ? {
        panel:
          'border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-sky-50',
        badge: 'bg-emerald-500 text-white',
        accent: 'text-emerald-500',
      }
    : {
        panel:
          'border-rose-200 bg-gradient-to-br from-rose-50 via-white to-orange-50',
        badge: 'bg-rose-500 text-white',
        accent: 'text-rose-500',
      };

  const confidenceText =
    typeof result.confidence === 'number'
      ? `${result.confidence.toFixed(2)}%`
      : 'Unavailable';

  return (
    <div
      className={`rounded-[2rem] border p-6 shadow-panel backdrop-blur-2xl sm:p-8 ${toneClasses.panel}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">
            Result
          </p>
          <h2 className="mt-2 font-display text-2xl text-slate-900">
            Prediction ready
          </h2>
        </div>
        <div
          className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${toneClasses.badge}`}
        >
          {result.prediction}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[1.75rem] bg-white/80 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Prediction
          </p>
          <h3 className={`mt-3 font-display text-4xl font-semibold ${toneClasses.accent}`}>
            {result.prediction}
          </h3>
        </div>
        <div className="rounded-[1.75rem] bg-white/80 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Confidence
          </p>
          <p className="mt-3 font-display text-4xl font-semibold text-slate-900">
            {confidenceText}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
