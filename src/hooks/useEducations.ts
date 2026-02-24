import { useEffect, useMemo, useState } from "react";
import useFetch from "./useFetch";
import {
  buildEducationsUrl,
  type EducationsQuery,
  API_BASE,
} from "../api/educations";
import type {
  PagedResponse,
  EducationJobEdResponse,
  EducationOccupationMatch,
  YrkesbarometerEntry,
} from "../types/api";
import type { Page } from "../types/Page";
import { normalizePage } from "../types/Page";

function parseYrkesbarometerResponse(
  payload: unknown
): YrkesbarometerEntry[] {
  if (Array.isArray(payload)) {
    return payload as YrkesbarometerEntry[];
  }
  if (
    payload &&
    typeof payload === "object" &&
    "content" in payload &&
    Array.isArray((payload as { content?: unknown }).content)
  ) {
    return (payload as { content: YrkesbarometerEntry[] }).content;
  }
  return [];
}

export function useEducations(query: EducationsQuery) {
  const url = buildEducationsUrl(query);
  const { data: rawData, loading, error } =
    useFetch<PagedResponse<EducationJobEdResponse>>(url);

  const data: Page<EducationJobEdResponse> | null = rawData
    ? normalizePage(rawData)
    : null;

  return { data, loading, error };
}

export function useEducationById(id: string | undefined) {
  const isStringId =
    typeof id === "string" && id !== "undefined" && id !== "[object Object]";

  const url = isStringId
    ? `${API_BASE}/educations/${encodeURIComponent(id)}`
    : null;

  return useFetch<EducationJobEdResponse>(url);
}

export function useEducationOccupationMatches(id: string | undefined) {
  const isStringId =
    typeof id === "string" && id !== "undefined" && id !== "[object Object]";

  const url = isStringId
    ? `${API_BASE}/educations/${encodeURIComponent(id)}/occupation-matches`
    : null;

  const { data, loading, error } = useFetch<EducationOccupationMatch[]>(url);

  return {
    occupationMatches: data ?? [],
    loading,
    error,
  };
}

export function useYrkesbarometer(ssyk: string | undefined) {
  const isValidSsyk = typeof ssyk === "string" && ssyk.trim().length > 0;
  const url = isValidSsyk
    ? `${API_BASE}/occupation-barometer/search?ssyk=${encodeURIComponent(ssyk)}&page=0&size=50`
    : null;

  const { data: rawData, loading, error } = useFetch<unknown>(url);
  const data = parseYrkesbarometerResponse(rawData);

  return {
    yrkesbarometer: data,
    loading,
    error,
  };
}

export function useBestYrkesbarometerForMatches(
  matches: EducationOccupationMatch[]
) {
  const [yrkesbarometer, setYrkesbarometer] = useState<YrkesbarometerEntry[]>(
    []
  );
  const [selectedSsyk, setSelectedSsyk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const orderedSsyk = useMemo(
    () =>
      Array.from(
        new Set(
          matches
            .map((m) => m.ssyk?.trim())
            .filter((s): s is string => Boolean(s))
        )
      ),
    [matches]
  );

  useEffect(() => {
    let alive = true;

    const load = async () => {
      if (!orderedSsyk.length) {
        setYrkesbarometer([]);
        setSelectedSsyk(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      let chosen:
        | { ssyk: string; data: YrkesbarometerEntry[] }
        | null = null;
      let lastError: Error | null = null;

      for (const ssyk of orderedSsyk) {
        try {
          const res = await fetch(
            `${API_BASE}/occupation-barometer/search?ssyk=${encodeURIComponent(ssyk)}&page=0&size=50`
          );
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }

          const payload = (await res.json()) as unknown;
          const data = parseYrkesbarometerResponse(payload);
          const hasRegionalDemand = data.some(
            (row) =>
              row.lan !== "00" &&
              typeof row.jobbmojligheter === "string" &&
              row.jobbmojligheter.trim().length > 0
          );

          if (hasRegionalDemand) {
            chosen = { ssyk, data };
            break;
          }
        } catch (e) {
          lastError = e instanceof Error ? e : new Error("Kunde inte hämta yrkesbarometer");
        }
      }

      if (!alive) return;

      if (chosen) {
        setSelectedSsyk(chosen.ssyk);
        setYrkesbarometer(chosen.data);
        setError(null);
      } else {
        setSelectedSsyk(null);
        setYrkesbarometer([]);
        setError(lastError);
      }
      setLoading(false);
    };

    load();

    return () => {
      alive = false;
    };
  }, [orderedSsyk]);

  return {
    yrkesbarometer,
    selectedSsyk,
    loading,
    error,
  };
}
