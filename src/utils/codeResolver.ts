/**
 * Creates resolver helpers from a lookup table and normalizer.
 * Used to avoid code duplication between MunicipalityCodes and RegionCodes.
 */
export function createResolverMethods(
  lookup: Record<string, string>,
  normalize: (code: string | undefined) => string
) {
  const getName = (code: string | undefined): string => {
    const key = normalize(code);
    return key ? (lookup[key] ?? code ?? "") : "";
  };

  const getNames = (codes: (string | undefined)[] | undefined): string[] => {
    if (!codes?.length) return [];
    return codes.map((c) => getName(c)).filter((name) => name.length > 0);
  };

  const getNamesString = (codes: (string | undefined)[] | undefined): string =>
    getNames(codes).join(", ") || "";

  return { getName, getNames, getNamesString };
}
