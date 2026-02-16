import { Link } from "react-router-dom";
import type { EducationJobEdResponse } from "../../types/api";
import { getRegionNamesString } from "../../utils/regionCodes";
import { getEligibilityText } from "../../utils/educationUtils";
import { getDescriptionFromFullData, getEligibilityFromFullData } from "../../utils/fullDataUtils";
import ProviderLink from "./ProviderLink";

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

  return (
    <Link
      to={`/education/${education.id}`}
      className="group block h-full rounded-3xl p-6 bg-white border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer"
    >
      <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
        {education.title || "Utbildning"}
      </h3>

      {providers.length > 0 && (
        <p className="text-slate-600 font-medium text-sm mb-3 line-clamp-1" title={providers.join(", ")}>
          {providers.map((p: string, i: number) => (
            <span key={`${p}-${i}`}>
              {i > 0 && ", "}
              <ProviderLink name={p} stopPropagation className="text-inherit hover:text-blue" />
            </span>
          ))}
        </p>
      )}

      {desc ? (
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-3">
          {desc}
        </p>
      ) : null}

      <div className="mb-3 flex-grow min-h-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">
          Behörighet
        </p>
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
          {eligibilityText || "Ej angivet"}
        </p>
      </div>

      {regionNames && (
        <p className="text-slate-500 text-sm mb-2 line-clamp-1" title={regionNames}>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Region:{" "}
          </span>
          {regionNames}
        </p>
      )}

      <div className="flex items-center gap-3 text-slate-500 text-sm mt-auto">
        {education.lastSynced && (
          <span className="text-xs">
            Uppdaterad: {new Date(education.lastSynced).toLocaleDateString("sv-SE")}
          </span>
        )}
      </div>
    </Link>
  );
}
