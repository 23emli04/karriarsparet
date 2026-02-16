import { useEffect, useState } from "react";
import { fetchEducationProviders } from "../api/educations";
import type { EducationProvider } from "../types/api";

export function useEducationProviders() {
  const [providers, setProviders] = useState<EducationProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchEducationProviders()
      .then((res) => setProviders(res.content ?? []))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { providers, loading, error };
}
