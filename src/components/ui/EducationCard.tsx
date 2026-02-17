import { Link } from "react-router-dom";
import type { EducationJobEdResponse } from "../../types/api";
import { getRegionNamesString } from "../../utils/regionCodes";
import { getEligibilityText } from "../../utils/educationUtils";
import { getDescriptionFromFullData, getEligibilityFromFullData } from "../../utils/fullDataUtils";
import { formatLanguage } from "../../utils/languageUtils";
import ProviderLink from "./ProviderLink";
import LocationIcon from "./LocationIcon";
import UniversityIcon from "./UniversityIcon";

interface EducationCardProps {
  education: EducationJobEdResponse;
}

export default function EducationCard({ education }: EducationCardProps) {
  if (!education) return null;

  const fd = education.fullData as Record<string, unknown> | null | undefined;
  const providers = education.providers ?? [];
  const regionNames = getRegionNamesString(education.regionCodes);
  const desc = (education.description as string)?.trim() || getDescriptionFromFullData(fd);
  const eligibilityText =
    (education.eligibilityDescription ? getEligibilityText(education.eligibilityDescription) : "") ||
    getEligibilityFromFullData(fd);

  const creditsData = fd?.education as { credits?: { credits?: number; system?: { code?: string } } } | undefined;
  const credits = creditsData?.credits?.credits;
  const creditsUnit = creditsData?.credits?.system?.code ?? "hp";

  const eventSummary = fd?.eventSummary as {
    languageOfInstruction?: string | string[];
    distance?: boolean;
  } | undefined;
  const languageLabel = formatLanguage(eventSummary?.languageOfInstruction);
  const isDistance = eventSummary?.distance === true;

  const title = education.title || "Utbildning";

  return (
    <Link
      to={`/education/${education.id}`}
      className="group block h-full rounded-xl p-5 bg-white border border-slate-200 hover:border-brand/40 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200 flex flex-col"
    >
      <div className="flex flex-wrap items-start gap-2 mb-2">
        <h3
          className="text-lg font-bold text-slate-900 line-clamp-3 group-hover:text-brand transition-colors flex-1 min-w-0"
          title={title}
        >
          {title}
        </h3>
        {credits != null && (
          <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-brand-muted text-slate-700">
            {credits} {creditsUnit}
          </span>
        )}
      </div>

      {providers.length > 0 && (
        <p className="text-slate-600 font-medium text-sm mb-2 line-clamp-1 flex items-center gap-1.5" title={providers.join(", ")}>
          <UniversityIcon />
          {providers.map((p: string, i: number) => (
            <span key={`${p}-${i}`}>
              {i > 0 && ", "}
              <ProviderLink name={p} stopPropagation className="text-inherit hover:text-brand" />
            </span>
          ))}
        </p>
      )}

      {desc ? (
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-3 flex-grow min-h-0">
          {desc}
        </p>
      ) : (
        <div className="flex-grow min-h-8" />
      )}

      <div className="space-y-2 text-sm">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">Behörighet</p>
          <p className="text-slate-600 line-clamp-2" title={eligibilityText}>
            {eligibilityText || "Ej angivet"}
          </p>
        </div>

        {(regionNames || languageLabel || isDistance !== undefined) && (
          <div className="flex flex-wrap gap-2">
            {regionNames && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600"
                title={regionNames}
              >
                <LocationIcon />
                {regionNames}
              </span>
            )}
            {languageLabel && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
                {languageLabel}
              </span>
            )}
            {isDistance !== undefined && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
                {isDistance ? "Distans" : "På plats"}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
