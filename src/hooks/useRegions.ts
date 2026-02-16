import { useEffect, useState } from "react";
import { fetchRegions } from "../api/educations";
import type { RegionDto } from "../types/api";

export function useRegions() {
  const [regions, setRegions] = useState<RegionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchRegions()
      .then(setRegions)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { regions, loading, error };
}
