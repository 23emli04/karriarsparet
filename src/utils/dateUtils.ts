const SWEDISH_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

/**
 * Format an ISO date string to Swedish locale (e.g. "15 februari 2025").
 * Falls back to original string if parsing fails.
 */
export function formatDateSwedish(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString("sv-SE", SWEDISH_DATE_OPTIONS);
  } catch {
    return dateString;
  }
}

/**
 * Extract the year from an ISO date string, or null if invalid.
 */
export function getYearFromDate(dateString: string | null | undefined): number | null {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date.getFullYear();
  } catch {
    return null;
  }
}
