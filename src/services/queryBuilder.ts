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
  selectedEducationLevels: string[],
  selectedFormCodes: string[],
  page: number,
  size: number
): EducationsQuery {
  const trimmedSearch = searchQuery.trim();
  const providers = selectedProviders.map((p) => p.trim()).filter(Boolean);
  const regionCodes = selectedRegions.map((r) => r.trim()).filter(Boolean);
  const educationLevels = selectedEducationLevels.map((v) => v.trim()).filter(Boolean);
  const formCodes = selectedFormCodes.map((v) => v.trim()).filter(Boolean);

  // Filter mode can include query + filter values together.
  if (
    trimmedSearch.length > 0 ||
    providers.length > 0 ||
    regionCodes.length > 0 ||
    educationLevels.length > 0 ||
    formCodes.length > 0
  ) {
    return {
      mode: "filter",
      query: trimmedSearch || undefined,
      providers: providers.length > 0 ? providers : undefined,
      regionCodes: regionCodes.length > 0 ? regionCodes : undefined,
      educationLevels: educationLevels.length > 0 ? educationLevels : undefined,
      formCodes: formCodes.length > 0 ? formCodes : undefined,
      page,
      size,
    };
  }

  return { mode: "all", page, size };
}
