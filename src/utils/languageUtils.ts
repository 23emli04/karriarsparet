const LANGUAGE_LABELS: Record<string, string> = {
  swe: "Svenska",
  eng: "Engelska",
  sv: "Svenska",
  en: "Engelska",
};

export function formatLanguage(codes: string[] | string | undefined): string {
  if (!codes) return "";
  const arr = Array.isArray(codes) ? codes : [codes];
  const labels = arr.map((c) => LANGUAGE_LABELS[c?.toLowerCase()] ?? c).filter(Boolean);
  return labels.length ? labels.join(", ") : "";
}
