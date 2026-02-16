import { useParams, Link } from "react-router-dom";
import { useEducationById } from "../../hooks/useEducations";
import { DetailSection, DetailRow, TagList } from "../detail";
import { formatDateSwedish } from "../../utils/dateUtils";
import { getRegionNamesString } from "../../utils/regionCodes";
import { getMunicipalityNamesString } from "../../utils/municipalityCodes";
import { getDescriptionFromFullData, getEligibilityFromFullData } from "../../utils/fullDataUtils";
import type { EducationJobEdResponse } from "../../types/api";

const LEVEL_MAP: Record<string, string> = {
  grund: "Grundnivå",
  avancerad: "Avancerad nivå",
  grundavancerad: "Grund- och avancerad nivå",
  förutbildning: "Förutbildning",
};
const LANG_MAP: Record<string, string> = { swe: "Svenska", eng: "Engelska" };
const TIME_MAP: Record<string, string> = { dag: "Dagtid", kväll: "Kväll", distans: "Distans" };

function getDisplayValue(map: Record<string, string>, code: string): string {
  return map[code?.toLowerCase()] ?? code ?? "";
}

function formatIsoDate(s: string | undefined): string {
  if (!s) return "";
  try {
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toLocaleDateString("sv-SE", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return s;
  }
}

export default function EducationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useEducationById(id);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data) return null;

  return <EducationDetailContent data={data} />;
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-4 w-32 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
        <p className="text-amber-800 font-medium">{error.message}</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
        >
          ← Tillbaka till utbildningar
        </Link>
      </div>
    </div>
  );
}

interface EducationDetailContentProps {
  data: EducationJobEdResponse;
}

function EducationDetailContent({ data }: EducationDetailContentProps) {
  const fd = data.fullData as Record<string, unknown> | null | undefined;
  const education = fd?.education as Record<string, unknown> | undefined;
  const eventSummary = fd?.eventSummary as Record<string, unknown> | undefined;
  const enrichments = (fd?.text_enrichments_results as Record<string, unknown>)?.enriched_candidates as Record<string, unknown> | undefined;

  const providersText = data.providers?.length ? data.providers.join(", ") : null;
  const regionText = getRegionNamesString(data.regionCodes);
  const description = (data.description as string)?.trim() || getDescriptionFromFullData(fd);
  const eligibility = getEligibilityFromFullData(fd);

  const credits = (education?.credits as { credits?: number })?.credits;
  const levelCode = (education?.educationLevel as { code?: string })?.code;
  const formCode = (education?.form as { code?: string })?.code;
  const expires = education?.expires as string | undefined;
  const subjects = (education?.subject ?? education?.subjects) as Array<{ name?: string; nameEn?: string }> | undefined;

  const municipalityCodes = (eventSummary?.municipalityCode ?? eventSummary?.municipalityCodes) as string[] | undefined;
  const regionCodes = (eventSummary?.regionCode ?? eventSummary?.regionCodes) as string[] | undefined;
  const languages = (eventSummary?.languageOfInstruction ?? eventSummary?.languagesOfInstruction) as string[] | undefined;
  const pace = (eventSummary?.paceOfStudyPercentage ?? eventSummary?.paceOfStudyPercentages) as number[] | undefined;
  const timeOfStudy = (eventSummary?.timeOfStudy ?? eventSummary?.timeOfStudyCodes) as string[] | undefined;
  const executions = (eventSummary?.executions ?? eventSummary?.execution) as Array<{ start?: string; end?: string }> | undefined;
  const distance = Boolean(eventSummary?.distance);

  const municipalityNames = getMunicipalityNamesString(municipalityCodes);
  const eventRegionText = getRegionNamesString(regionCodes);
  const occ = (enrichments?.occupations as string[] | undefined) ?? [];
  const comp = (enrichments?.competencies as string[] | undefined) ?? [];
  const traits = (enrichments?.traits as string[] | undefined) ?? [];
  const geos = (enrichments?.geos as string[] | undefined) ?? [];
  const subjectNames = (subjects ?? []).map((s) => s.name ?? s.nameEn ?? "").filter(Boolean);
  const hasEnrichments = occ.length > 0 || comp.length > 0 || traits.length > 0 || geos.length > 0;

  const execDisplays = (executions ?? [])
    .filter((e) => e?.start || e?.end)
    .map((e) => {
      const a = formatIsoDate(e.start);
      const b = formatIsoDate(e.end);
      return a && b ? `${a} – ${b}` : a || b;
    });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium transition-colors"
        >
          <span aria-hidden>←</span> Tillbaka till utbildningar
        </Link>

        <article className="rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-lg border border-slate-200/80">
          <div className="p-6 sm:p-8 md:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {data.title || "Utbildning"}
            </h1>

            {providersText && (
              <p className="text-lg font-semibold text-slate-700 mb-6">
                {providersText}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-100">
              {regionText && <DetailRow label="Region" value={regionText} />}
              {levelCode && <DetailRow label="Nivå" value={getDisplayValue(LEVEL_MAP, levelCode)} />}
              {typeof credits === "number" && <DetailRow label="Högskolepoäng" value={`${credits} hp`} />}
              {formCode && <DetailRow label="Form" value={formCode} />}
              {expires && <DetailRow label="Giltig till" value={formatDateSwedish(expires)} />}
              {data.lastSynced && <DetailRow label="Uppdaterad" value={formatDateSwedish(data.lastSynced)} />}
            </div>

            {description && (
              <DetailSection title="Beskrivning">
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">{description}</div>
              </DetailSection>
            )}

            {eligibility && (
              <DetailSection title="Behörighet">
                <p className="text-slate-700 leading-relaxed">{eligibility}</p>
              </DetailSection>
            )}

            {(municipalityNames || eventRegionText || (languages?.length ?? 0) > 0 || (pace?.length ?? 0) > 0 || (timeOfStudy?.length ?? 0) > 0 || execDisplays.length > 0 || distance) && (
              <DetailSection title="Studieinfo">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {municipalityNames && <DetailRow label="Kommun" value={municipalityNames} />}
                  {eventRegionText && <DetailRow label="Region" value={eventRegionText} />}
                  {languages?.length ? <DetailRow label="Språk" value={languages.map((l) => getDisplayValue(LANG_MAP, l)).join(", ")} /> : null}
                  {pace?.length ? <DetailRow label="Studietakt" value={pace.map((p) => `${p}%`).join(", ")} /> : null}
                  {timeOfStudy?.length ? <DetailRow label="Studietid" value={timeOfStudy.map((t) => getDisplayValue(TIME_MAP, t)).join(", ")} /> : null}
                  {execDisplays.length ? <DetailRow label="Period" value={execDisplays.join(" · ")} /> : null}
                  {distance && <DetailRow label="Distans" value="Ja" />}
                </div>
              </DetailSection>
            )}

            {subjectNames.length > 0 && (
              <DetailSection title="Ämnen">
                <TagList items={subjectNames} />
              </DetailSection>
            )}

            {hasEnrichments && (
              <DetailSection title="Relaterat">
                <div className="space-y-4">
                  {occ.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Yrken</p>
                      <TagList items={occ} />
                    </div>
                  )}
                  {comp.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Kompetenser</p>
                      <TagList items={comp} />
                    </div>
                  )}
                  {traits.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Egenskaper</p>
                      <TagList items={traits} />
                    </div>
                  )}
                  {geos.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Platser</p>
                      <TagList items={geos} />
                    </div>
                  )}
                </div>
              </DetailSection>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
