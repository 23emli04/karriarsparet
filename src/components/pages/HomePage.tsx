import { useState, useCallback, useEffect } from "react";
import Hero from "../ui/Hero";
import EducationCard from "../ui/EducationCard";
import type { EducationsQuery } from "../../api/educations";
import { useEducations } from "../../hooks/useEducations.tsx";

type FilterMode = "all" | "vocational" | "distance";
type AdvancedMode = "municipality" | "competency" | "occupation" | "dateRange" | null;

/**
 * HELPER: Build the query object for the API
 */
function buildQuery(
    filter: FilterMode,
    keyword: string,
    page: number,
    size: number,
    advanced: { mode: AdvancedMode; municipality?: string; competency?: string; occupation?: string; startDate?: string; endDate?: string }
): EducationsQuery {
  // Base parameters required by the backend
  const base = { page, size, sortBy: "id", sortDirection: "ASC" as const };

  if (advanced.mode === "municipality" && advanced.municipality?.trim()) {
    return { ...base, mode: "municipality", code: advanced.municipality.trim() };
  }
  if (advanced.mode === "competency" && advanced.competency?.trim()) {
    return { ...base, mode: "competency", competency: advanced.competency.trim() };
  }
  if (advanced.mode === "occupation" && advanced.occupation?.trim()) {
    return { ...base, mode: "occupation", occupation: advanced.occupation.trim() };
  }
  if (advanced.mode === "dateRange" && advanced.startDate && advanced.endDate) {
    return { ...base, mode: "dateRange", startDate: advanced.startDate, endDate: advanced.endDate };
  }

  if (keyword.trim()) return { ...base, mode: "search", keyword: keyword.trim() };
  if (filter === "vocational") return { ...base, mode: "vocational" };
  if (filter === "distance") return { ...base, mode: "distance" };

  return { ...base, mode: "all" };
}

export default function HomePage() {
  // --- STATE ---
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [searchInput, setSearchInput] = useState("");
  const [advanced, setAdvanced] = useState({
    mode: null as AdvancedMode,
    municipality: "",
    competency: "",
    occupation: "",
    startDate: "",
    endDate: "",
  });

  // --- DATA FETCHING ---
  const query = buildQuery(filter, keyword, page, 20, advanced);
  const { data, loading, error } = useEducations(query);

  // --- EFFECTS ---
  // Scroll to results when user changes page
  useEffect(() => {
    if (page > 0) {
      document.getElementById("results-anchor")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [page]);

  // --- HANDLERS ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput);
    setFilter("all");
    setAdvanced(a => ({ ...a, mode: null }));
    setPage(0); // Reset to first page on new search
  };

  const quickSearch = (term: string) => {
    setSearchInput(term);
    setKeyword(term);
    setPage(0);
    setFilter("all");
    setAdvanced(a => ({ ...a, mode: null }));
  };

  const clearFilters = () => {
    setKeyword("");
    setSearchInput("");
    setFilter("all");
    setAdvanced({
      mode: null,
      municipality: "",
      competency: "",
      occupation: "",
      startDate: "",
      endDate: "",
    });
    setPage(0);
  };

  return (
      <div className="min-h-screen bg-slate-50/50">
        <Hero />

        <section id="programs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20">
          <div id="results-anchor" />

          {/* SEARCH BOX */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 mb-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input
                    type="search"
                    placeholder="Sök bland tusentals utbildningar..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg"
                />
              </div>
              <button
                  type="submit"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all transform hover:scale-[1.01] active:scale-95 shadow-lg shadow-blue-200"
              >
                Hitta utbildning
              </button>
            </form>

            {/* QUICK CHIPS */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-slate-400 font-medium">Populärt:</span>
              {["AI", "Programmering", "Sjuksköterska", "Ekonomi"].map(term => (
                  <button
                      key={term}
                      onClick={() => quickSearch(term)}
                      className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-transparent hover:border-blue-100"
                  >
                    {term}
                  </button>
              ))}
              {(keyword || filter !== "all" || advanced.mode) && (
                  <button
                      onClick={clearFilters}
                      className="ml-auto text-blue-600 font-semibold hover:text-blue-700 underline underline-offset-4"
                  >
                    Rensa filter
                  </button>
              )}
            </div>
          </div>

          {/* RESULTS HEADER */}
          <div className="flex items-end justify-between mb-8 px-2">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                {keyword ? `Resultat för "${keyword}"` : "Alla utbildningar"}
              </h2>
              <p className="text-slate-500 mt-1 font-medium">
                {data ? `${data.totalElements.toLocaleString()} träffar` : "Söker..."}
              </p>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-72 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
                ))}
              </div>
          )}

          {/* ERROR STATE */}
          {error && (
              <div className="p-12 bg-red-50 rounded-3xl border border-red-100 text-center">
                <p className="text-red-600 font-bold text-lg">Ett fel uppstod vid hämtning</p>
                <p className="text-red-500 mt-2">{error.message}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold">Försök igen</button>
              </div>
          )}

          {/* DATA GRID */}
          {!loading && !error && (
              <>
                {data?.content.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                      <p className="text-slate-400 text-xl">Hittade inga utbildningar som matchar din sökning.</p>
                      <button onClick={clearFilters} className="mt-4 text-blue-600 font-bold">Se alla utbildningar</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {data?.content.map((edu) => (
                          <EducationCard key={edu.id} education={edu} />
                      ))}
                    </div>
                )}
              </>
          )}

          {/* PAGINATION */}
          {data && data.totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                <button
                    disabled={data.first}
                    onClick={() => setPage(p => p - 1)}
                    className="p-4 rounded-2xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                >
                  ← <span className="hidden sm:inline ml-1 font-bold text-sm">Föregående</span>
                </button>

                <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                  <span className="font-bold text-blue-600">{data.number + 1}</span>
                  <span className="mx-2 text-slate-300">/</span>
                  <span className="text-slate-600 font-medium">{data.totalPages}</span>
                </div>

                <button
                    disabled={data.last}
                    onClick={() => setPage(p => p + 1)}
                    className="p-4 rounded-2xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
                >
                  <span className="hidden sm:inline mr-1 font-bold text-sm">Nästa</span> →
                </button>
              </div>
          )}
        </section>
      </div>
  );
}