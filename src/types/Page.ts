import type { PagedResponse } from "./api";

/** Normalized page for app consumption (flattened from API response) */
export interface Page<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/**
 * Normalize API PagedResponse to our Page shape.
 * Handles both nested { content, page } and flat Spring-style responses.
 */
export function normalizePage<T>(response: PagedResponse<T>): Page<T> {
  const content = response.content ?? [];
  const page = response.page;
  const flat = response as unknown as Record<string, unknown>;

  return {
    content,
    empty: content.length === 0,
    first: page?.first ?? (flat.first as boolean) ?? true,
    last: page?.last ?? (flat.last as boolean) ?? true,
    number: page?.number ?? (flat.number as number) ?? 0,
    numberOfElements: content.length,
    size: page?.size ?? (flat.size as number) ?? content.length,
    totalElements: page?.totalElements ?? (flat.totalElements as number) ?? 0,
    totalPages: page?.totalPages ?? (flat.totalPages as number) ?? 0,
  };
}
