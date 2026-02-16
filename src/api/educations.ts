
import type { EducationEnriched } from "../types/EducationEnriched";

export const API_BASE = "http://localhost:8080/api";

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

/**
 * Transforms a query object into a fully qualified URL
 */
export function buildEducationsUrl(query: EducationsQuery): string {
    const search = new URLSearchParams();
    const page = query.page ?? 0;
    const size = query.size ?? 20;

    search.set("page", String(page));
    search.set("size", String(size));

    let path = "/educations";

    switch (query.mode) {
        case "search":
            path += "/search";
            search.set("keyword", query.keyword);
            if (query.sortBy) search.set("sortBy", query.sortBy);
            if (query.sortDirection) search.set("sortDirection", query.sortDirection);
            break;
        case "searchByTitle":
            path += "/search-sorted-by-title";
            search.set("keyword", query.keyword);
            break;
        case "municipality":
            path += `/municipality/${encodeURIComponent(query.code)}`;
            break;
        case "dateRange":
            path += "/date-range";
            search.set("startDate", query.startDate);
            search.set("endDate", query.endDate);
            break;
        default:
            if ('sortBy' in query && query.sortBy) search.set("sortBy", query.sortBy);
    }

    return `${API_BASE}${path}?${search.toString()}`;
}
export const educationsApi = {
    getEnrichedById: async (id: string): Promise<EducationEnriched> => {
        const res = await fetch(`${API_BASE}/Education-enriched/${id}`);
        if (!res.ok) throw new Error("Kunde inte hämta utbildning");
        return res.json();
    }
};