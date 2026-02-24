import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium transition-colors"
        >
          <span aria-hidden>←</span> Tillbaka till utbildningar
        </Link>

        <article className="rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200 p-6 sm:p-8 md:p-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Om oss
          </h1>

          <p className="mt-4 text-slate-700 leading-relaxed">
            Karriärspåret hjälper dig att utforska utbildningar, hitta relevanta
            anordnare och få bättre underlag inför dina studie- och karriärval.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <section className="rounded-lg bg-slate-50 border border-slate-100 p-4">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Mitt mål
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Att göra utbildningsinformation tydlig, sökbar och enkel att
                jämföra för alla.
              </p>
            </section>

            <section className="rounded-lg bg-slate-50 border border-slate-100 p-4">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Vad som visas
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Utbildningar, anordnare och matchningar mot yrken samt
                arbetsmarknadsprognoser där data finns tillgänglig. Data kommer arbetsförmedlingen, SUSA-Navet och SCB.
              </p>
            </section>
          </div>

          <p className="mt-8 text-sm text-slate-500">
            Har du feedback eller idéer? Jag förbättrar tjänsten löpande. Kontakta mig på <a href="mailto:info@karriarspatret.se" className="text-brand hover:text-brand-hover transition-colors">info@karriarspatret.se</a>.
          </p>
        </article>
      </div>
    </div>
  );
}
