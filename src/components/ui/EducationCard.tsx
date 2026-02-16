import { Link } from "react-router-dom";
import type { EducationJobEdResponse } from "../../types/api";
import { RegionCodes } from "../../utils/regionCodes";
import { getEligibilityText } from "../../utils/educationUtils";
import { getDescriptionFromFullData, getEligibilityFromFullData } from "../../utils/fullDataUtils";

interface EducationCardProps {
  education: EducationJobEdResponse;
}

export default function EducationCard({ education }: EducationCardProps) {
  const providersText = education.providers?.length
    ? education.providers.join(", ")
    : null;
  const regionNames = education.regionCodes?.length
    ? RegionCodes.getNamesString(education.regionCodes)
    : null;
  const desc =
    education.description?.trim() ||
    getDescriptionFromFullData(education.fullData);
  const eligibilityText =
    (education.eligibilityDescription ? getEligibilityText(education.eligibilityDescription) : "") ||
    getEligibilityFromFullData(education.fullData);

  return (
    <Link
      to={`/education/${education.id}`}
      className="group block h-full rounded-3xl p-6 bg-white border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer"
    >
      <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {education.title || "Utbildning"}
      </h3>

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

      {providersText ? (
        <p className="text-slate-500 text-sm mb-2 line-clamp-1" title={providersText}>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Anordnare:{" "}
          </span>
          {providersText}
        </p>
      ) : null}

      {regionNames ? (
        <p className="text-slate-500 text-sm mb-2 line-clamp-1" title={regionNames}>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Region:{" "}
          </span>
          {regionNames}
        </p>
      ) : null}

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
