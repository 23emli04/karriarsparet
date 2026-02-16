import { useMemo } from "react";
import type { RegionDto } from "../../types/api";

/** Swedish län codes in traditional order (01 Stockholm → 25 Norrbotten) */
const SWEDISH_REGION_ORDER = [
  "01", "03", "04", "05", "06", "07", "08", "09", "10",
  "12", "13", "14", "17", "18", "19", "20", "21", "22", "23", "24", "25",
];

const regionSortKey = (code: string) => {
  const normalized = code.replace(/\D/g, "").padStart(2, "0").slice(0, 2);
  const idx = SWEDISH_REGION_ORDER.indexOf(normalized);
  return idx >= 0 ? idx : SWEDISH_REGION_ORDER.length;
};

const sortedBySwedishOrder = (list: RegionDto[]) =>
  [...list].sort((a, b) => {
    const keyA = regionSortKey(a.code);
    const keyB = regionSortKey(b.code);
    return keyA - keyB || a.name.localeCompare(b.name, "sv");
  });

interface RegionFilterProps {
  regions: RegionDto[];
  selectedRegionCodes: string[];
  onToggleRegion: (code: string) => void;
  onClearRegions: () => void;
  isLoading: boolean;
}

export default function RegionFilter({
  regions,
  selectedRegionCodes,
  onToggleRegion,
  onClearRegions,
  isLoading,
}: RegionFilterProps) {
  const sortedRegions = useMemo(() => sortedBySwedishOrder(regions), [regions]);

  return (
    <div className="mt-6 pt-6 border-t border-slate-200">
      <p className="text-slate-500 text-sm font-medium mb-3">Filter på region</p>
      <ul className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1 list-none">
        <li>
          <FilterButton
            label="Alla regioner"
            isSelected={selectedRegionCodes.length === 0}
            onSelect={onClearRegions}
          />
        </li>
        {isLoading ? (
          <li className="text-slate-400 text-sm py-1">Laddar...</li>
        ) : (
          sortedRegions.map((r) => (
            <li key={r.code}>
              <FilterButton
                label={r.name}
                isSelected={selectedRegionCodes.includes(r.code)}
                onSelect={() => onToggleRegion(r.code)}
                className="text-left w-full"
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  className?: string;
}

function FilterButton({
  label,
  isSelected,
  onSelect,
  className = "",
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`block w-full px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-left ${
        isSelected ? "bg-blue text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      } ${className}`}
    >
      {label}
    </button>
  );
}
