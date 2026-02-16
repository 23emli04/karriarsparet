export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-amber-50"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Find your path
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Explore master's programs tailored for your career ambitions. Browse,
          compare, and take the next step.
        </p>
        <a
          href="#programs"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 rounded-full bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 transition-colors duration-200"
        >
          Browse programs
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </a>
      </div>
      {/* Bottom fade into page */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"
        aria-hidden
      />
    </section>
  );
}
