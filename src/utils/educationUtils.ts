import type { Title, Description } from "../types/Education";
import { toPlainText } from "./htmlUtils";

const PREFERRED_LANG = "swe";

/**
 * Extract localized content from an array of lang/content items.
 * Prefers Swedish, falls back to first available.
 */
export function getLocalizedContent<T extends { lang: string; content: string }>(
  items: T[] | null | undefined,
  fallback = ""
): string {
  if (!items?.length) return fallback;
  const preferred = items.find((t) => t.lang === PREFERRED_LANG);
  return (preferred ?? items[0])?.content ?? fallback;
}

/**
 * Get localized title from education titles array.
 */
export function getLocalizedTitle(titles: Title[] | null | undefined): string {
  return getLocalizedContent(titles, "Utbildning");
}

/**
 * Get localized description as plain text (strips HTML).
 */
export function getLocalizedDescription(
  descriptions: Description[] | null | undefined
): string {
  const raw = getLocalizedContent(descriptions, "");
  return raw ? toPlainText(raw) : "";
}

/**
 * Get eligibility description as plain text (strips HTML).
 */
export function getEligibilityText(
  eligibilityDescription: string | null | undefined
): string {
  if (!eligibilityDescription?.trim()) return "";
  return toPlainText(eligibilityDescription);
}
