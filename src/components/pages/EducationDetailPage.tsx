import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { educationsApi } from "../../api/educations";
import type { Education } from "../../types/Education";

function formatDate(s: string) {
  try {
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return s;
  }
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div>
      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</dt>
      <dd className="mt-1 text-slate-800">{value}</dd>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function EducationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [education, setEducation] = useState<Education | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    educationsApi
      .getById(id)
      .then(setEducation)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-8 animate-pulse text-slate-500">Laddar…</p>;
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-amber-800 bg-amber-50 p-4 rounded-xl border border-amber-200">{error.message}</p>
        <Link to="/" className="mt-4 inline-block text-amber-700 font-medium hover:underline">← Tillbaka till utbildningar</Link>
      </div>
    );
  }
  if (!education) return null;

  const title = education.titles.find((t) => t.lang === "swe") || education.titles[0];
  const desc = education.descriptions.find((d) => d.lang === "swe") || education.descriptions[0];
  const pace = education.paceOfStudyPercentages ?? [];
  const langs = education.languagesOfInstruction ?? [];
  const timeOfStudy = education.timeOfStudy ?? [];
  const subjects = education.subjects ?? [];
  const executions = education.executions ?? [];
  const eligibility = education.eligibility;
  const eligibilityTags = education.eligibilityTags ?? [];
  const enrichedCompetencies = education.enrichedCompetencies ?? [];
  const enrichedGeos = education.enrichedGeos ?? [];
  const enrichedOccupations = education.enrichedOccupations ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 mb-6 font-medium">
          ← Tillbaka till utbildningar
        </Link>

        <article className="rounded-2xl p-6 sm:p-8 bg-white shadow-sm border border-slate-200/80">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
              {education.educationLevel.code}
            </span>
            {education.distance && (
              <span className="inline-flex text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                Distans
              </span>
            )}
            {education.resultIsDegree && (
              <span className="inline-flex text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                Examen
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-1" style={{ fontFamily: "var(--font-display)" }}>
            {title?.content}
          </h1>
          {education.code && (
            <p className="text-sm text-slate-500 mb-6">Kod: {education.code}</p>
          )}

          {desc?.content && (
            <div className="prose prose-slate max-w-none mb-8">
              <p className="text-slate-600 whitespace-pre-wrap">{desc.content}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 pb-8 border-b border-slate-100">
            <DetailRow
              label="Studietakt"
              value={pace.length ? pace.map((p) => `${p}%`).join(", ") : null}
            />
            <DetailRow
              label="Språk"
              value={langs.length ? langs.join(", ") : null}
            />
            <DetailRow
              label="Form"
              value={education.form?.type ?? null}
            />
            <DetailRow
              label="Högskolepoäng"
              value={education.credits != null ? String(education.credits) : null}
            />
            <DetailRow
              label="Studietid"
              value={timeOfStudy.length ? timeOfStudy.join(", ") : null}
            />
            <DetailRow
              label="Upphör"
              value={education.expires ? formatDate(education.expires) : null}
            />
          </div>

          {executions.length > 0 && (
            <DetailSection title="Löpande period">
              <ul className="space-y-2">
                {executions.map((ex, i) => (
                  <li key={i} className="text-slate-800">
                    {formatDate(ex.start)} – {formatDate(ex.end)}
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          {(eligibility?.eligibilityDescription || eligibilityTags.length > 0) && (
            <div className="mt-8">
              <DetailSection title="Behörighet">
                {eligibility?.eligibilityDescription && (
                  <p className="text-slate-800">{eligibility.eligibilityDescription}</p>
                )}
                {eligibilityTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {eligibilityTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </DetailSection>
            </div>
          )}

          {subjects.length > 0 && (
            <div className="mt-8">
              <DetailSection title="Ämnen">
                <ul className="space-y-1">
                  {subjects.map((s) => (
                    <li key={s.code} className="text-slate-800">
                      {s.name}
                      {s.code && <span className="text-slate-500 text-sm ml-1">({s.code})</span>}
                    </li>
                  ))}
                </ul>
              </DetailSection>
            </div>
          )}

          {(enrichedCompetencies.length > 0 || enrichedGeos.length > 0 || enrichedOccupations.length > 0) && (
            <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
              {enrichedCompetencies.length > 0 && (
                <DetailSection title="Kompetenser">
                  <div className="flex flex-wrap gap-2">
                    {enrichedCompetencies.map((c) => (
                      <span
                        key={c}
                        className="inline-flex text-sm text-slate-700 bg-amber-50/80 text-amber-800 px-2.5 py-1 rounded-md"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </DetailSection>
              )}
              {enrichedGeos.length > 0 && (
                <DetailSection title="Platser">
                  <div className="flex flex-wrap gap-2">
                    {enrichedGeos.map((g) => (
                      <span key={g} className="inline-flex text-sm text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                        {g}
                      </span>
                    ))}
                  </div>
                </DetailSection>
              )}
              {enrichedOccupations.length > 0 && (
                <DetailSection title="Yrken">
                  <div className="flex flex-wrap gap-2">
                    {enrichedOccupations.map((o) => (
                      <span key={o} className="inline-flex text-sm text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                        {o}
                      </span>
                    ))}
                  </div>
                </DetailSection>
              )}
            </div>
          )}

          {education.lastEdited && (
            <p className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400">
              Senast uppdaterad: {formatDate(education.lastEdited)}
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
