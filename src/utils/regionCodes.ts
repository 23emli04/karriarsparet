/**
 * Maps Swedish region/län codes (2-digit, e.g. 01) to official names.
 * Codes are from SCB (Statistics Sweden). Sweden has 21 län.
 */
import { createResolverMethods } from "./codeResolver";

const REGION_CODE_TO_NAME: Record<string, string> = {
  "01": "Stockholms län",
  "03": "Uppsala län",
  "04": "Södermanlands län",
  "05": "Östergötlands län",
  "06": "Jönköpings län",
  "07": "Kronobergs län",
  "08": "Kalmar län",
  "09": "Gotlands län",
  "10": "Blekinge län",
  "12": "Skåne län",
  "13": "Hallands län",
  "14": "Västra Götalands län",
  "17": "Värmlands län",
  "18": "Örebro län",
  "19": "Västmanlands län",
  "20": "Dalarnas län",
  "21": "Gävleborgs län",
  "22": "Västernorrlands län",
  "23": "Jämtlands län",
  "24": "Västerbottens län",
  "25": "Norrbottens län",
};

function normalizeRegionCode(code: string | undefined): string {
  if (code == null || code === "") return "";
  const digits = code.replace(/\D/g, "");
  return digits.length <= 2 ? digits.padStart(2, "0") : digits.slice(0, 2);
}

const { getName, getNames, getNamesString } = createResolverMethods(
  REGION_CODE_TO_NAME,
  normalizeRegionCode
);

/** Get the region name for a single code. Returns the code if not found. */
export const getRegionName = getName;

/** Get region names for an array of codes. Skips empty/unknown. */
export function getRegionNames(codes: (string | undefined)[] | undefined): string[] {
  return getNames(codes);
}

/** Get region names as a single string (e.g. "Stockholms län, Skåne län"). */
export function getRegionNamesString(codes: (string | undefined)[] | undefined): string {
  return getNamesString(codes);
}

/**
 * All regions as { code, name } for dropdowns/lists. Sorted by name.
 */
export const REGION_OPTIONS: { code: string; name: string }[] = (
  Object.entries(REGION_CODE_TO_NAME) as [string, string][]
)
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name, "sv"));

/**
 * Class to resolve region (län) codes to names.
 */
export class RegionCodes {
  static getName(code: string | undefined): string {
    return getRegionName(code);
  }

  static getNames(codes: (string | undefined)[] | undefined): string[] {
    return getRegionNames(codes);
  }

  static getNamesString(codes: (string | undefined)[] | undefined): string {
    return getRegionNamesString(codes);
  }
}
