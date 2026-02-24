import { useEffect, useMemo, useRef, useState } from "react";
import { GeoJSON as GeoJSONLayer, MapContainer, useMap } from "react-leaflet";
import type { Feature, FeatureCollection, GeoJsonObject } from "geojson";
import L from "leaflet";
import { getRegionName } from "../../utils/regionCodes";

type FeatureProps = {
  name?: string;
  l_id?: number | string;
};

type RegionDemandInfo = {
  jobbmojligheter?: string | null;
  prognos?: string | null;
};

const SWEDEN_REGIONS_GEOJSON_URL =
  "https://raw.githubusercontent.com/okfse/sweden-geojson/master/swedish_regions.geojson";

function normalizeRegionCode(code: string): string {
  const digits = code.replace(/\D/g, "");
  if (!digits) return "";
  return digits.length <= 2 ? digits.padStart(2, "0") : digits.slice(0, 2);
}

function getFeatureCode(feature: Feature): string | null {
  const props = (feature.properties ?? {}) as FeatureProps;
  const raw = props.l_id;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return String(raw).padStart(2, "0");
  }
  if (typeof raw === "string" && raw.trim()) {
    return normalizeRegionCode(raw);
  }
  return null;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function FitBounds({ geojson }: { geojson: FeatureCollection }) {
  const map = useMap();

  useEffect(() => {
    const layer = L.geoJSON(geojson as GeoJsonObject);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [6, 6] });
    }
  }, [geojson, map]);

  return null;
}

export default function SwedenRegionsMap({
  selectedRegionCodes,
  demandByRegionCode,
  className = "",
  title = "Karta (län)",
  showMeta = true,
}: {
  selectedRegionCodes: (string | undefined)[] | undefined;
  demandByRegionCode?: Record<string, RegionDemandInfo | undefined>;
  className?: string;
  title?: string;
  showMeta?: boolean;
}) {
  const isTouchInput = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches,
    []
  );

  const selected = useMemo(() => {
    const set = new Set<string>();
    (selectedRegionCodes ?? [])
      .filter((c): c is string => typeof c === "string")
      .map((c) => normalizeRegionCode(c))
      .filter(Boolean)
      .forEach((c) => set.add(c));
    return set;
  }, [selectedRegionCodes]);

  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [focusedCode, setFocusedCode] = useState<string | null>(null);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const activeCode = hoveredCode ?? (isTouchInput ? null : focusedCode);
  const activeLabel = activeCode ? `${getRegionName(activeCode)} (${activeCode})` : null;

  useEffect(() => {
    let alive = true;
    setLoadError(null);

    fetch(SWEDEN_REGIONS_GEOJSON_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!alive) return;
        setGeojson(data as FeatureCollection);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setLoadError(e instanceof Error ? e.message : "Kunde inte ladda kartdata");
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.touchZoom.disable();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tap = (map as any).tap as { disable?: () => void } | undefined;
    tap?.disable?.();
  }, []);

  const getDemandFill = (demand: string | null | undefined): string => {
 
    if (!demand || !demand.trim()) return "#cbd5e1"; 

    const normalized = demand.toLowerCase();
    if (normalized.includes("mycket stora")) return "#4d7c0f"; 
    if (normalized.includes("medelstora")) return "#facc15"; 
    if (normalized.includes("stora")) return "#86efac"; 
    if (normalized.includes("sm")) return "#ef4444"; 
    return "#cbd5e1"; 
  };

  const getStyle = (code: string, isActive: boolean): L.PathOptions => {
    const demand = demandByRegionCode?.[code]?.jobbmojligheter;
    const demandFill = getDemandFill(demand);

    return {
      color: "#94a3b8", // slate-400
      weight: isActive ? 2.5 : 1.5,
      opacity: 1,
      fillColor: isActive ? "#ccfbf1" : demandFill, // hover : demand/no-data
      fillOpacity: isActive ? 0.65 : 0.9,
    };
  };

  if (selected.size === 0) return null;

  return (
    <section className={className} aria-label={title}>
      {showMeta ? (
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
            {title}
          </h3>
          <div className="text-sm text-slate-500 min-h-5">
            {activeLabel ?? "Hovra/klicka på ett län"}
          </div>
        </div>
      ) : null}

      <div className="bg-transparent overflow-hidden">
        <div className="h-[420px] w-full">
          <MapContainer
            ref={(m) => {
              mapRef.current = m;
            }}
            center={[62.0, 15.0]}
            zoom={4}
            zoomControl={false}
            attributionControl={false}
            dragging={false}
            doubleClickZoom={false}
            scrollWheelZoom={false}
            touchZoom={false}
            boxZoom={false}
            keyboard={false}
            className="sweden-map h-full w-full bg-transparent"
            style={{ background: "transparent" }}
          >
            {geojson ? <FitBounds geojson={geojson} /> : null}

            {geojson ? (
              <GeoJSONLayer
                key={[...selected].sort().join(",") + "|" + (activeCode ?? "")}
                data={geojson as unknown as GeoJsonObject}
                style={(feature) => {
                  const code = feature ? getFeatureCode(feature as Feature) : null;
                  return code ? getStyle(code, code === activeCode) : { color: "#cbd5e1", weight: 1 };
                }}
                onEachFeature={(feature, layer) => {
                  const code = getFeatureCode(feature as Feature);
                  if (!code) return;

                  const label = getRegionName(code) || ((feature.properties as FeatureProps | null)?.name ?? code);
                  const demand = demandByRegionCode?.[code];
                  const tooltipLines = [label];
                  if (demand?.jobbmojligheter) {
                    tooltipLines.push(`Jobbmöjligheter:  ${demand.jobbmojligheter}`);
                  }
                  if (demand?.prognos) {
                    tooltipLines.push(`Prognos: ${demand.prognos}`);
                  }

                  const tooltipHtml = [
                    `<strong>${escapeHtml(label)}</strong>`,
                    ...tooltipLines.slice(1).map((line) => escapeHtml(line)),
                  ].join("<br/>");

                  layer.bindTooltip(tooltipHtml, {
                    sticky: !isTouchInput,
                    className: "sweden-map-tooltip",
                    direction: "top",
                  });

                  layer.on({
                    mouseover: () => setHoveredCode(code),
                    mouseout: () => setHoveredCode(null),
                    click: () => {
                      if (isTouchInput) {
                        setFocusedCode(null);
                        layer.openTooltip();
                        window.setTimeout(() => {
                          layer.closeTooltip();
                        }, 1400);
                        return;
                      }
                      setFocusedCode((prev) => (prev === code ? null : code));
                    },
                  });
                }}
              />
            ) : null}
          </MapContainer>
        </div>

        {showMeta ? (
          <div className="pt-3 text-xs text-slate-500">
            {loadError ? (
              <span className="text-amber-700 font-medium">
                Kartan kunde inte laddas ({loadError}).
              </span>
            ) : (
              <span>
                Färgskalan visar jobbmöjligheter för toppyrket.{" "}
                <span className="text-slate-400">
                  Kartdata: okfse/sweden-geojson.
                </span>
              </span>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
