import useFetch from "./useFetch";
import type { Page } from "../types/Page";
import type { Education } from "../types/Education";
import { buildEducationsUrl, type EducationsQuery } from "../api/educations";

export default function useEducations(query: EducationsQuery) {
  const url = buildEducationsUrl(query);
  const { data, loading, error } = useFetch<Page<Education>>(url);

  return { data, loading, error };
}
