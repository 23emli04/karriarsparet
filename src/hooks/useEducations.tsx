// hooks/useEducations.ts
import useFetch from "./useFetch";
import { buildEducationsUrl, type EducationsQuery, API_BASE } from "../api/educations";
import type { Page } from "../types/Page";
import type { Education } from "../types/Education";
import type { EducationEnriched } from "../types/EducationEnriched";

export function useEducations(query: EducationsQuery) {
  const url = buildEducationsUrl(query);
  return useFetch<Page<Education>>(url);
}

export function useEducationEnrichedById(id: string | undefined) {
  if (id && typeof id !== 'string') {
    console.warn("BUG DETECTED: useEducationEnrichedById received an object instead of a string:", id);
  }

  const isStringId = typeof id === "string" && id !== "undefined" && id !== "[object Object]";

  const url = isStringId
      ? `${API_BASE}/Education-enriched/${encodeURIComponent(id)}`
      : null;

  return useFetch<EducationEnriched>(url);
}