import type { Education } from "../types/Education";
import type { Page } from "../types/Page";
import type {EducationEvent} from "../types/EducationEvent.ts";

const API_BASE = "http://localhost:8080/api/educations";

function buildUrl(path: string, params: Record<string, string | number | undefined> = {}): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") search.set(k, String(v));
  });
  const qs = search.toString();
  return qs ? `${API_BASE}${path}?${qs}` : `${API_BASE}${path}`;
}

export type EducationsQuery =
  | { mode: "all"; page?: number; size?: number; sortBy?: string; sortDirection?: string }
  | { mode: "search"; keyword: string; page?: number; size?: number; sortBy?: string; sortDirection?: string }
  | { mode: "searchByTitle"; keyword: string; page?: number; size?: number }
  | { mode: "municipality"; code: string; page?: number; size?: number }
  | { mode: "vocational"; page?: number; size?: number }
  | { mode: "distance"; page?: number; size?: number }
  | { mode: "competency"; competency: string; page?: number; size?: number }
  | { mode: "occupation"; occupation: string; page?: number; size?: number }
  | { mode: "dateRange"; startDate: string; endDate: string; page?: number; size?: number };

export function buildEducationsUrl(query: EducationsQuery): string {
  const page = query.page ?? 0;
  const size = query.size ?? 20;
  switch (query.mode) {
    case "all":
      return buildUrl("", { page, size, sortBy: query.sortBy ?? "id", sortDirection: query.sortDirection ?? "DESC" });
    case "search":
      return buildUrl("/search", { keyword: query.keyword, page, size, sortBy: query.sortBy ?? "id", sortDirection: query.sortDirection ?? "DESC" });
    case "searchByTitle":
      return buildUrl("/search-sorted-by-title", { keyword: query.keyword, page, size });
    case "municipality":
      return buildUrl(`/municipality/${encodeURIComponent(query.code)}`, { page, size });
    case "vocational":
      return buildUrl("/vocational", { page, size });
    case "distance":
      return buildUrl("/distance", { page, size });
    case "competency":
      return buildUrl(`/competency/${encodeURIComponent(query.competency)}`, { page, size });
    case "occupation":
      return buildUrl(`/occupation/${encodeURIComponent(query.occupation)}`, { page, size });
    case "dateRange":
      return buildUrl("/date-range", { startDate: query.startDate, endDate: query.endDate, page, size });
    default:
      return buildUrl("", { page, size });
  }
}

async function fetchPage<T>(url: string): Promise<Page<T>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchOne<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const educationsApi = {
    getById(id: string) {
        return fetchOne<Education>(
            `${API_BASE}/id/${encodeURIComponent(id)}`
        );
    }
    ,

  getAll(params: { page?: number; size?: number; sortBy?: string; sortDirection?: string }) {
    return fetchPage<Education>(
      buildUrl("", {
        page: params.page ?? 0,
        size: params.size ?? 20,
        sortBy: params.sortBy ?? "id",
        sortDirection: params.sortDirection ?? "DESC",
      })
    );
  },

  search(params: {
    keyword: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
  }) {
    return fetchPage<Education>(
      buildUrl("/search", {
        keyword: params.keyword,
        page: params.page ?? 0,
        size: params.size ?? 20,
        sortBy: params.sortBy ?? "id",
        sortDirection: params.sortDirection ?? "DESC",
      })
    );
  },

  searchByTitle(params: { keyword: string; page?: number; size?: number }) {
    return fetchPage<Education>(
      buildUrl("/search-sorted-by-title", {
        keyword: params.keyword,
        page: params.page ?? 0,
        size: params.size ?? 20,
      })
    );
  },

  getByMunicipality(code: string, params: { page?: number; size?: number }) {
    return fetchPage<Education>(
      buildUrl(`/municipality/${encodeURIComponent(code)}`, {
        page: params.page ?? 0,
        size: params.size ?? 20,
      })
    );
  },

  getVocational(params: { page?: number; size?: number }) {
    return fetchPage<Education>(
      buildUrl("/vocational", {
        page: params.page ?? 0,
        size: params.size ?? 20,
      })
    );
  },

  getDistance(params: { page?: number; size?: number }) {
    return fetchPage<Education>(
      buildUrl("/distance", {
        page: params.page ?? 0,
        size: params.size ?? 20,
      })
    );
  },

  getByCompetency(competency: string, params: { page?: number; size?: number }) {
    return fetchPage<Education>(
      buildUrl(`/competency/${encodeURIComponent(competency)}`, {
        page: params.page ?? 0,
        size: params.size ?? 20,
      })
    );
  },

  getByOccupation(occupation: string, params: { page?: number; size?: number }) {
    return fetchPage<Education>(
      buildUrl(`/occupation/${encodeURIComponent(occupation)}`, {
        page: params.page ?? 0,
        size: params.size ?? 20,
      })
    );
  },

  getByDateRange(
    startDate: string,
    endDate: string,
    params: { page?: number; size?: number }
  ) {
    return fetchPage<Education>(
      buildUrl("/date-range", {
        startDate,
        endDate,
        page: params.page ?? 0,
        size: params.size ?? 20,
      })
    );
  },
    getEventByIdentifier(eventId: string) {
        const transformedId = eventId.startsWith("i")
            ? "e" + eventId.slice(1)
            : eventId;

        const url = `http://localhost:8080/api/education-events/${encodeURIComponent(transformedId)}`;
        return fetchOne<EducationEvent>(url);
    },
};
