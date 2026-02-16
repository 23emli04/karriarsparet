/**
 * API response types for the education backend.
 * @see docs/API_REFERENCE.md
 */

/** Single education item from educations/list/detail endpoints */
export interface EducationJobEdResponse {
  id: string;
  title: string;
  providers: string[];
  regionCodes?: string[];
  fullData?: Record<string, unknown>;
  description?: string;
  eligibilityDescription?: string;
  lastSynced?: string;
}

/** Region from GET /api/educations/regions */
export interface RegionDto {
  code: string;
  name: string;
}

/** Page info in paginated responses */
export interface PageInfo {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

/** Paginated API response */
export interface PagedResponse<T> {
  content: T[];
  page?: PageInfo;
}

export type { EducationProvider } from "./EducationProvider";
