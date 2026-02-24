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

/** Occupation match for a specific education id */
export interface EducationOccupationMatch {
  educationId: string;
  ssyk: string;
  occupationGroupLabel: string;
  groupMatchScore: number;
  fetchedAt: string;
  alternativeTitles: string[];
}

/** Yrkesbarometer response row for one SSYK + region/national level */
export interface YrkesbarometerEntry {
  id: number;
  ssyk: string;
  ssykText: string | null;
  ybYrke: string | null;
  lan: string;
  jobbmojligheter: string | null;
  prognos: string | null;
  rekryteringssituation: string | null;
  textJobbmojligheter: string | null;
  textRekryteringssituation: string | null;
  hogstaBedomningsniva: string | null;
  delvisHelt: string | null;
  omgang: string;
  importedAt: string;
}

export type { EducationProvider } from "./EducationProvider";
