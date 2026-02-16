import type { EducationsQuery } from "../api/educations";

export interface SearchFilters {
  searchQuery: string;
  searchInput: string;
  providerFilter: string | null;
  page: number;
}

export type QueryBuilderFn = (
  searchQuery: string,
  providerFilter: string | null,
  page: number,
  size: number
) => EducationsQuery;
