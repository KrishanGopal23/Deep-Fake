function Navbar() {
  return (
    <header className="relative z-10">
      <div className="mx-auto flex max-w-5xl items-center justify-center px-4 pt-6 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-3 rounded-full border border-sky-200/70 bg-white/80 px-4 py-3 shadow-panel backdrop-blur-xl">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-cyan-300 to-emerald-300 shadow-glow">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 text-slate-950"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                d="M12 3 18 6.2V11c0 4.02-2.63 7.56-6 8.7-3.37-1.14-6-4.68-6-8.7V6.2L12 3Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9.1" r="2.2" />
              <path
                d="M8.85 15.1c.9-1.48 1.96-2.22 3.18-2.22 1.22 0 2.27.74 3.12 2.22"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="text-left">
            <p className="font-display text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              Deepfake Detector AI
            </p>
            <p className="text-xs text-slate-500 sm:text-sm">
              Upload and detect
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
