interface ResultsHeaderProps {
  searchQuery: string;
  selectedProviders: string[];
  selectedRegions: string[];
  regionNames: string[];
  totalElements: number | null | undefined;
  isLoading: boolean;
}

export default function ResultsHeader({
  searchQuery,
  selectedProviders,
  selectedRegions,
  regionNames,
  totalElements,
  isLoading,
}: ResultsHeaderProps) {
  const title = getResultsTitle(searchQuery, selectedProviders, selectedRegions, regionNames);
  const subtitle = getResultsSubtitle(totalElements, isLoading);

  return (
    <div className="flex items-end justify-between mb-8 px-2">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-slate-500 mt-1 font-medium">{subtitle}</p>
      </div>
    </div>
  );
}

function getResultsTitle(
  searchQuery: string,
  selectedProviders: string[],
  selectedRegions: string[],
  regionNames: string[]
): string {
  const parts: string[] = [];
  if (searchQuery) parts.push(`Resultat för "${searchQuery}"`);
  if (selectedProviders.length > 0) {
    parts.push(`hos ${selectedProviders.length === 1 ? selectedProviders[0] : `${selectedProviders.length} anordnare`}`);
  }
  if (selectedRegions.length > 0 && regionNames.length > 0) {
    parts.push(`i ${regionNames.length === 1 ? regionNames[0] : regionNames.join(", ")}`);
  }
  if (parts.length > 0) return parts.join(" ");
  return "Alla utbildningar";
}

function getResultsSubtitle(totalElements: number | null | undefined, isLoading: boolean): string {
  if (isLoading) return "Söker...";
  if (totalElements == null || typeof totalElements !== "number") return "—";
  return `${totalElements.toLocaleString("sv-SE")} träffar`;
}
