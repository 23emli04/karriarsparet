export default function Hero() {
  return (
    <section className="relative bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20 text-center">
        <img
          src="/karriarsparet-hero.png"
          alt="Karriärspåret – Hitta din väg"
          className="mx-auto max-w-full h-auto max-h-[280px] sm:max-h-[320px] object-contain"
        /> 
        <p className="mt-6 text-slate-600 text-sm font-semibold">
        Skapad av Emil Moffatt :)
      </p>
        <p className="mt-6 text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
          Utforska alla program för att hitta din karriär
        </p>
        <a
          href="#programs"
          className="inline-flex items-center gap-2 mt-6 px-6 py-3.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-hover transition-colors"
        >
          Bläddra bland utbildningar
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"
        aria-hidden
      />
    </section>
  );
}
