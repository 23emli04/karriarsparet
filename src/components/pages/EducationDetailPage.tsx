import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useEducationById,
  useEducationOccupationMatches,
  useBestYrkesbarometerForMatches,
} from "../../hooks/useEducations";
import { DetailSection, DetailRow, TagList } from "../detail";
import { MarketPrognosisSection, OccupationMatchesSection } from "./EducationDetailSections";
import CmsDescription from "../ui/CmsDescription";
import ProviderLink from "../ui/ProviderLink";
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
  const [applicationUrl, setApplicationUrl] = useState("");
  const [applicationLast, setApplicationLast] = useState("");

  useEffect(() => {
    const isStringId =
      typeof id === "string" && id !== "undefined" && id !== "[object Object]";
    if (!isStringId) return;

    const controller = new AbortController();

    const fetchAndLogEducationInfo = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/education-events/e${encodeURIComponent(id).substring(1)}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const payload = await res.json();
        console.log("education-info response:", payload);
        setApplicationUrl(typeof payload?.urlSwe === "string" ? payload.urlSwe : "");
        setApplicationLast(typeof payload?.applicationLast === "string" ? payload.applicationLast : "");
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch education-info:", err);
      }
    };

    void fetchAndLogEducationInfo();

    return () => {
      controller.abort();
    };
  }, [id]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data) return null;

  return (
    <EducationDetailContent
      data={data}
      applicationUrl={applicationUrl}
      applicationLast={applicationLast}
    />
  );
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
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
        <p className="text-amber-800 font-medium">{error.message}</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors cursor-pointer"
        >
          ← Tillbaka till utbildningar
        </Link>
      </div>
    </div>
  );
}

interface EducationDetailContentProps {
  data: EducationJobEdResponse;
  applicationUrl?: string;
  applicationLast?: string;
}

function EducationDetailContent({
  data,
  applicationUrl,
  applicationLast,
}: EducationDetailContentProps) {
  const {
    occupationMatches,
    loading: occupationLoading,
    error: occupationError,
  } = useEducationOccupationMatches(data.id);

  const fd = data.fullData as Record<string, unknown> | null | undefined;
  const education = fd?.education as Record<string, unknown> | undefined;
  const eventSummary = fd?.eventSummary as Record<string, unknown> | undefined;
  const enrichments = (fd?.text_enrichments_results as Record<string, unknown>)?.enriched_candidates as Record<string, unknown> | undefined;

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
  const executionStart = eventSummary?.executionStart as string | undefined;
  const executionEnd = eventSummary?.executionEnd as string | undefined;
  const distance = Boolean(eventSummary?.distance);

  const municipalityNames = getMunicipalityNamesString(municipalityCodes);
  const eventRegionText = getRegionNamesString(regionCodes);
  const regionCodesForMap = (regionCodes?.length ? regionCodes : data.regionCodes) ?? undefined;
  const occ = (enrichments?.occupations as string[] | undefined) ?? [];
  const comp = (enrichments?.competencies as string[] | undefined) ?? [];
  const traits = (enrichments?.traits as string[] | undefined) ?? [];
  const geos = (enrichments?.geos as string[] | undefined) ?? [];
  const subjectNames = (subjects ?? []).map((s) => s.name ?? s.nameEn ?? "").filter(Boolean);
  const hasEnrichments = occ.length > 0 || comp.length > 0 || traits.length > 0 || geos.length > 0;
  const topOccupationMatches = useMemo(
    () =>
      [...occupationMatches]
        .sort((a, b) => b.groupMatchScore - a.groupMatchScore)
        .slice(0, 8),
    [occupationMatches]
  );
  const {
    yrkesbarometer,
    selectedSsyk,
    loading: yrkesbarometerLoading,
    error: yrkesbarometerError,
  } = useBestYrkesbarometerForMatches(topOccupationMatches);
  const selectedOccupationMatch = topOccupationMatches.find(
    (m) => m.ssyk === selectedSsyk
  );
  const regionalYrkesbarometer = yrkesbarometer.filter((row) => row.lan !== "00");
  const nationalYrkesbarometer = yrkesbarometer.find((row) => row.lan === "00") ?? null;
  const demandByRegionCode = regionalYrkesbarometer.reduce<
    Record<string, { jobbmojligheter?: string | null; prognos?: string | null }>
  >((acc, row) => {
    const current = acc[row.lan];
    const incomingHasDemand =
      typeof row.jobbmojligheter === "string" && row.jobbmojligheter.trim().length > 0;
    const currentHasDemand =
      typeof current?.jobbmojligheter === "string" &&
      current.jobbmojligheter.trim().length > 0;

    // Prefer rows that actually contain demand values.
    if (!current || incomingHasDemand || !currentHasDemand) {
      acc[row.lan] = {
        jobbmojligheter: row.jobbmojligheter,
        prognos: row.prognos,
      };
    }

    return acc;
  }, {});

  const execDisplays = (executions ?? [])
    .filter((e) => e?.start || e?.end)
    .map((e) => {
      const a = formatIsoDate(e.start);
      const b = formatIsoDate(e.end);
      return a && b ? `${a} – ${b}` : a || b;
    });
  const fallbackExecutionDisplay = (() => {
    const a = formatIsoDate(executionStart);
    const b = formatIsoDate(executionEnd);
    if (!a && !b) return null;
    return a && b ? `${a} – ${b}` : a || b;
  })();
  const periodDisplay = execDisplays.length > 0 ? execDisplays.join(" · ") : fallbackExecutionDisplay;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium transition-colors cursor-pointer"
        >
          <span aria-hidden>←</span> Tillbaka till utbildningar
        </Link>

        <article className="rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200">
          <div className="p-6 sm:p-8 md:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              {data.title || "Utbildning"}
            </h1>

            {data.providers && data.providers.length > 0 && (
              <p className="text-lg font-semibold text-slate-700 mb-6">
                {data.providers.map((p, i) => (
                  <span key={p}>
                    {i > 0 && ", "}
                    <ProviderLink name={p} className="text-inherit hover:text-brand" />
                  </span>
                ))}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-100">
              {regionText && <DetailRow label="Region" value={regionText} />}
              {levelCode && <DetailRow label="Nivå" value={getDisplayValue(LEVEL_MAP, levelCode)} />}
              {typeof credits === "number" && <DetailRow label="Högskolepoäng" value={`${credits} hp`} />}
              {formCode && <DetailRow label="Form" value={formCode} />}
              {expires && <DetailRow label="Giltig till" value={formatDateSwedish(expires)} />}
              {data.lastSynced && <DetailRow label="Uppdaterad" value={formatDateSwedish(data.lastSynced)} />}
              {applicationLast && (
                <DetailRow
                  label="Sista ansökningsdag"
                  value={formatDateSwedish(applicationLast)}
                />
              )}
              {applicationUrl && (
                <DetailRow
                  label="Ansökan"
                  value={
                    <a
                      href={applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      Mer om programmet
                    </a>
                  }
                />
              )}
            </div>

            <MarketPrognosisSection
              regionCodesForMap={regionCodesForMap}
              demandByRegionCode={demandByRegionCode}
              bestOccupationLabel={selectedOccupationMatch?.occupationGroupLabel}
              yrkesbarometerLoading={yrkesbarometerLoading}
              yrkesbarometerError={yrkesbarometerError}
              nationalYrkesbarometer={nationalYrkesbarometer}
            />

            {description && (
              <DetailSection title="Beskrivning">
                <CmsDescription text={description} />
              </DetailSection>
            )}

            {eligibility && (
              <DetailSection title="Behörighet">
                <p className="text-slate-700 leading-relaxed">{eligibility}</p>
              </DetailSection>
            )}

            {(municipalityNames || eventRegionText || (languages?.length ?? 0) > 0 || (pace?.length ?? 0) > 0 || (timeOfStudy?.length ?? 0) > 0 || periodDisplay || distance) && (
              <DetailSection title="Studieinfo">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {municipalityNames && <DetailRow label="Kommun" value={municipalityNames} />}
                  {eventRegionText && <DetailRow label="Region" value={eventRegionText} />}
                  {languages?.length ? <DetailRow label="Språk" value={languages.map((l) => getDisplayValue(LANG_MAP, l)).join(", ")} /> : null}
                  {pace?.length ? <DetailRow label="Studietakt" value={pace.map((p) => `${p}%`).join(", ")} /> : null}
                  {timeOfStudy?.length ? <DetailRow label="Studietid" value={timeOfStudy.map((t) => getDisplayValue(TIME_MAP, t)).join(", ")} /> : null}
                  {periodDisplay ? <DetailRow label="Period" value={periodDisplay} /> : null}
                  {distance && <DetailRow label="Distans" value="Ja" />}
                </div>
              </DetailSection>
            )}

            <DetailSection title="Matchande yrken">
              <OccupationMatchesSection
                occupationLoading={occupationLoading}
                occupationError={occupationError}
                topOccupationMatches={topOccupationMatches}
              />
            </DetailSection>

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
