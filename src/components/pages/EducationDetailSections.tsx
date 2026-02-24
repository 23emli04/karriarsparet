import SwedenRegionsMap from "../ui/SwedenRegionsMap";
import type {
  EducationOccupationMatch,
  YrkesbarometerEntry,
} from "../../types/api";

interface MarketPrognosisSectionProps {
  regionCodesForMap: string[] | undefined;
  demandByRegionCode: Record<
    string,
    { jobbmojligheter?: string | null; prognos?: string | null } | undefined
  >;
  bestOccupationLabel?: string;
  yrkesbarometerLoading: boolean;
  yrkesbarometerError: Error | null;
  nationalYrkesbarometer: YrkesbarometerEntry | null;
}

export function MarketPrognosisSection({
  regionCodesForMap,
  demandByRegionCode,
  bestOccupationLabel,
  yrkesbarometerLoading,
  yrkesbarometerError,
  nationalYrkesbarometer,
}: MarketPrognosisSectionProps) {
  if (!regionCodesForMap?.length) return null;

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 items-start">
        <SwedenRegionsMap
          selectedRegionCodes={regionCodesForMap}
          demandByRegionCode={demandByRegionCode}
          showMeta={false}
          className="min-w-0"
        />

        <aside className="rounded-xl bg-slate-50 border border-slate-100 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
            Marknadsprognos nationellt
          </h3>
          {bestOccupationLabel ? (
            <p className="text-sm text-slate-700">
              Toppyrke: <span className="font-semibold">{bestOccupationLabel}</span>
            </p>
          ) : null}

          {yrkesbarometerLoading ? (
            <div className="mt-3 space-y-2">
              <div className="h-4 rounded bg-slate-200/70 animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-slate-200/70 animate-pulse" />
            </div>
          ) : yrkesbarometerError ? (
            <p className="mt-3 text-sm text-amber-700 font-medium">
              Kunde inte hämta yrkesbarometer just nu.
            </p>
          ) : nationalYrkesbarometer ? (
            <div className="mt-3 space-y-2">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Nationell bedömning:
              </p>
              {nationalYrkesbarometer.textJobbmojligheter ? (
                <p className="text-sm text-slate-700 leading-relaxed">
                  {nationalYrkesbarometer.textJobbmojligheter}
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Ingen nationell text för jobbmöjligheter tillgänglig.
                </p>
              )}
               <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Rekryteringssituation:
              </p>
              {nationalYrkesbarometer.textRekryteringssituation ? (
                <p className="text-sm text-slate-700 leading-relaxed">
                  {nationalYrkesbarometer.textRekryteringssituation}
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Ingen nationell text för rekryteringssituation tillgänglig.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Ingen nationell prognos tillgänglig.
            </p>
          )}

          <p className="mt-4 text-xs text-slate-500 leading-relaxed">
            Kartfärgerna visar regionala jobbmöjligheter enligt yrkesbarometer för
            toppyrket.
          </p>
        </aside>
      </div>
    </section>
  );
}

interface OccupationMatchesSectionProps {
  occupationLoading: boolean;
  occupationError: Error | null;
  topOccupationMatches: EducationOccupationMatch[];
}

export function OccupationMatchesSection({
  occupationLoading,
  occupationError,
  topOccupationMatches,
}: OccupationMatchesSectionProps) {
  if (occupationLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className="h-10 rounded-lg bg-slate-200/70 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (occupationError) {
    return (
      <p className="text-sm text-amber-700 font-medium">
        Kunde inte hämta matchande yrken just nu.
      </p>
    );
  }

  if (topOccupationMatches.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Inga yrkesmatchningar tillgängliga för denna utbildning.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {topOccupationMatches.map((match) => (
        <li
          key={`${match.ssyk}-${match.occupationGroupLabel}`}
          className="rounded-lg bg-white border border-slate-200 p-3"
        >
          <p className="text-sm font-semibold text-slate-800 leading-tight">
            {match.occupationGroupLabel}
          </p>
          {match.alternativeTitles?.length ? (
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              {match.alternativeTitles.slice(0, 2).join(" • ")}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
