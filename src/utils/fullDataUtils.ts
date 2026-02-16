import { getLocalizedDescription, getEligibilityText } from "./educationUtils";

const DESC_KEYS = [
  "description",
  "descriptionSwedish",
  "descriptionSwe",
  "description_sv",
  "beskrivning",
  "content",
];
const ELIG_KEYS = [
  "eligibilityDescription",
  "eligibility_description",
  "eligibilitydescription",
  "behorighet",
  "behorighetskrav",
  "entryrequirements",
  "entryRequirements",
  "qualification",
  "antagning",
  "krav",
  "eligibility",
];

/** Recursively find first string value under common description keys */
function deepFindDesc(obj: unknown, depth = 0): string {
  if (depth > 5 || !obj || typeof obj !== "object") return "";
  const o = obj as Record<string, unknown>;

  for (const key of Object.keys(o)) {
    const keyLower = key.toLowerCase();
    if (DESC_KEYS.some((d) => keyLower.includes(d.replace(/_/g, "")))) {
      const v = o[key];
      if (typeof v === "string" && v.trim().length > 20) return v.trim();
      if (Array.isArray(v) && v.length > 0) {
        const first = v[0];
        if (first && typeof first === "object" && "content" in first) {
          const c = (first as { content?: string }).content;
          if (typeof c === "string") return getLocalizedDescription(v as Array<{ lang: string; content: string }>);
        }
      }
    }
  }
  for (const key of ["education", "educationInfo", "info", "data", "educationInfo"]) {
    const nested = o[key];
    if (nested) {
      const found = deepFindDesc(nested, depth + 1);
      if (found) return found;
    }
  }
  return "";
}

/** Recursively find first string value under common eligibility keys */
function deepFindElig(obj: unknown, depth = 0): string {
  if (depth > 6 || !obj || typeof obj !== "object") return "";
  const o = obj as Record<string, unknown>;

  // eligibility.eligibilityDescription (and variants)
  const elig = o.eligibility ?? o.eligibilityInfo ?? o.eligibilityRequirements;
  if (elig && typeof elig === "object") {
    const e = elig as Record<string, unknown>;
    const d = (e.eligibilityDescription ?? e.description ?? e.content ?? e.text) as string | undefined;
    if (typeof d === "string" && d.trim()) return getEligibilityText(d);
  }

  // Direct string keys
  for (const key of Object.keys(o)) {
    const keyLower = key.toLowerCase().replace(/_/g, "").replace(/\s/g, "");
    if (ELIG_KEYS.some((e) => keyLower.includes(e.replace(/_/g, "")))) {
      const v = o[key];
      if (typeof v === "string" && v.trim()) return getEligibilityText(v);
      if (Array.isArray(v) && v.length > 0 && typeof v[0] === "string") {
        return getEligibilityText((v as string[]).join(" "));
      }
    }
  }

  // Recurse into nested objects (same places description might be)
  for (const key of Object.keys(o)) {
    const nested = o[key];
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      const found = deepFindElig(nested, depth + 1);
      if (found) return found;
    }
  }
  return "";
}

/** Extract description from fullData - handles various API shapes */
export function getDescriptionFromFullData(
  fullData: Record<string, unknown> | null | undefined
): string {
  if (!fullData) return "";

  // Direct paths
  const descs = fullData.descriptions as Array<{ lang: string; content: string }> | undefined;
  if (descs?.length) return getLocalizedDescription(descs);
  const d = fullData.description as string | undefined;
  if (typeof d === "string" && d.trim()) return d.trim();
  const dSwe = (fullData.descriptionSwedish ?? fullData.descriptionSwe) as string | undefined;
  if (typeof dSwe === "string" && dSwe.trim()) return dSwe.trim();

  return deepFindDesc(fullData);
}

/** Extract eligibility from fullData - handles UOH/API structure */
export function getEligibilityFromFullData(
  fullData: Record<string, unknown> | null | undefined
): string {
  if (!fullData) return "";

  // fullData.education.eligibility.eligibilityDescription = [[{lang, content}, ...]]
  const education = fullData.education as Record<string, unknown> | undefined;
  const eligibility = education?.eligibility as Record<string, unknown> | undefined;
  const eligDesc = eligibility?.eligibilityDescription;

  if (Array.isArray(eligDesc) && eligDesc.length > 0) {
    const firstGroup = eligDesc[0];
    if (Array.isArray(firstGroup) && firstGroup.length > 0) {
      const items = firstGroup as Array<{ lang: string; content: string | null }>;
      const preferred = items.find((x) => x.lang === "swe") ?? items[0];
      const content = preferred?.content;
      if (typeof content === "string" && content.trim()) {
        return getEligibilityText(content);
      }
    }
  }

  // Fallbacks
  const elig = fullData.eligibility as { eligibilityDescription?: unknown } | undefined;
  if (elig?.eligibilityDescription) {
    const d = elig.eligibilityDescription;
    if (typeof d === "string") return getEligibilityText(d);
  }
  const e = fullData.eligibilityDescription as string | undefined;
  if (typeof e === "string" && e.trim()) return getEligibilityText(e);

  return deepFindElig(fullData);
}
