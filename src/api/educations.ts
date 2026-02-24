/**
 * Education API - matches HiG Gävle Swagger spec.
 * @see http://localhost:8080/swagger-ui/index.html
 */
import type {
  EducationJobEdResponse,
  RegionDto,
  EducationProvider,
  PagedResponse,
} from "../types/api";
import { normalizePage } from "../types/Page";
import type { Page } from "../types/Page";

export const API_BASE =
  import.meta.env.VITE_API_BASE ?? "http://localhost:8080/api";

/** Query modes supported by the actual API */
export type EducationsQuery =
  | { mode: "all"; page?: number; size?: number }
  | {
      mode: "search";
      query: string;
      providerTitle?: string;
      page?: number;
      size?: number;
    }
  | { mode: "provider"; provider: string; page?: number; size?: number }
  | { mode: "region"; regionCode: string; page?: number; size?: number }
  | {
      mode: "filter";
      query?: string;
      providers?: string[];
      regionCodes?: string[];
      contents?: string[];
      educationLevels?: string[];
      formCodes?: string[];
      formTypes?: string[];
      creditsMin?: number;
      creditsMax?: number;
      startDateFrom?: string;
      startDateTo?: string;
      paceOfStudyMin?: number;
      paceOfStudyMax?: number;
      isDegree?: boolean;
      page?: number;
      size?: number;
    };

/**
 * Build URL for educations endpoints.
 */
export function buildEducationsUrl(query: EducationsQuery): string {
  const pageNum = query.page ?? 0;
  const sizeNum = query.size ?? 20;
  const params = new URLSearchParams({ page: String(pageNum), size: String(sizeNum) });

  switch (query.mode) {
    case "search":
      params.set("query", query.query);
      if (query.providerTitle) params.set("providerTitle", query.providerTitle);
      return `${API_BASE}/educations/search?${params.toString()}`;
    case "provider":
      return `${API_BASE}/educations/provider/${encodeURIComponent(query.provider)}?${params.toString()}`;
    case "region":
      return `${API_BASE}/educations/region/${encodeURIComponent(query.regionCode)}?${params.toString()}`;
    case "filter": {
      const filterParams = new URLSearchParams(params);
      if (query.query) filterParams.set("query", query.query);
      query.providers?.forEach((p) => filterParams.append("provider", p));
      query.regionCodes?.forEach((c) => filterParams.append("regionCode", c));
      query.contents?.forEach((content) => filterParams.append("content", content));
      query.educationLevels?.forEach((value) => filterParams.append("educationLevel", value));
      query.formCodes?.forEach((value) => filterParams.append("formCode", value));
      query.formTypes?.forEach((value) => filterParams.append("formType", value));
      if (typeof query.creditsMin === "number") filterParams.set("creditsMin", String(query.creditsMin));
      if (typeof query.creditsMax === "number") filterParams.set("creditsMax", String(query.creditsMax));
      if (query.startDateFrom) filterParams.set("startDateFrom", query.startDateFrom);
      if (query.startDateTo) filterParams.set("startDateTo", query.startDateTo);
      if (typeof query.paceOfStudyMin === "number") filterParams.set("paceOfStudyMin", String(query.paceOfStudyMin));
      if (typeof query.paceOfStudyMax === "number") filterParams.set("paceOfStudyMax", String(query.paceOfStudyMax));
      if (typeof query.isDegree === "boolean") filterParams.set("isDegree", String(query.isDegree));
      return `${API_BASE}/educations/search/filter?${filterParams.toString()}`;
    }
    default:
      return `${API_BASE}/educations?${params.toString()}`;
  }
}

/**
 * Fetch educations and return normalized Page.
 */
export async function fetchEducations(
  query: EducationsQuery
): Promise<Page<EducationJobEdResponse>> {
  const url = buildEducationsUrl(query);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const data: PagedResponse<EducationJobEdResponse> = await res.json();
  return normalizePage(data);
}

/**
 * Fetch single education by ID.
 */
export async function fetchEducationById(
  id: string
): Promise<EducationJobEdResponse> {
  const res = await fetch(`${API_BASE}/educations/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error("Kunde inte hämta utbildning");
  return res.json();
}

/** GET /api/educations/regions - List available regions for filter */
export async function fetchRegions(): Promise<RegionDto[]> {
  const res = await fetch(`${API_BASE}/educations/regions`);
  if (!res.ok) throw new Error("Kunde inte hämta regioner");
  return res.json();
}

/** GET /api/education-providers - List all universities/providers */
export async function fetchEducationProviders(
  page = 0,
  size = 500
): Promise<PagedResponse<EducationProvider>> {
  const res = await fetch(
    `${API_BASE}/education-providers?page=${page}&size=${size}`
  );
  if (!res.ok) throw new Error("Kunde inte hämta utbildningsanordnare");
  return res.json();
}
