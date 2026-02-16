import type { EducationsQuery } from "../api/educations";

/**
 * Builds EducationsQuery for the API.
 * Provider and region are mutually exclusive (either/or).
 * Multiple can be selected within each type.
 * - filter: GET /educations/search/filter?provider=A&provider=B (or regionCode=01&regionCode=12)
 * - search: GET /educations/search?query=...
 * - all: GET /educations
 */
export function buildEducationsQuery(
  searchQuery: string,
  selectedProviders: string[],
  selectedRegions: string[],
  page: number,
  size: number
): EducationsQuery {
  const trimmedSearch = searchQuery.trim();
  const providers = selectedProviders.map((p) => p.trim()).filter(Boolean);
  const regionCodes = selectedRegions.map((r) => r.trim()).filter(Boolean);

  // Search: use when user has search text
  if (trimmedSearch) {
    return {
      mode: "search",
      query: trimmedSearch,
      providerTitle: providers[0],
      page,
      size,
    };
  }

  // Filter: either providers OR regions (never both - UI enforces either/or)
  if (providers.length > 0) {
    return { mode: "filter", providers, regionCodes: undefined, page, size };
  }
  if (regionCodes.length > 0) {
    return { mode: "filter", providers: undefined, regionCodes, page, size };
  }

  return { mode: "all", page, size };
}
