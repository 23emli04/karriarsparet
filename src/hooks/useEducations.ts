import useFetch from "./useFetch";
import {
  buildEducationsUrl,
  type EducationsQuery,
  API_BASE,
} from "../api/educations";
import type {
  PagedResponse,
  EducationJobEdResponse,
} from "../types/api";
import type { Page } from "../types/Page";
import { normalizePage } from "../types/Page";

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
