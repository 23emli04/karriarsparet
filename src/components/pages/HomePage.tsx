import { useState, useCallback } from "react";
import Hero from "../ui/Hero";
import EducationCard from "../ui/EducationCard";
import useEducations from "../../hooks/useEducations";
import type { EducationsQuery } from "../../api/educations";

type FilterMode = "all" | "vocational" | "distance";
type AdvancedMode = "municipality" | "competency" | "occupation" | "dateRange" | null;

function buildQuery(
  filter: FilterMode,
  keyword: string,
  page: number,
  size: number,
  advanced: { mode: AdvancedMode; municipality?: string; competency?: string; occupation?: string; startDate?: string; endDate?: string }
): EducationsQuery {
  if (advanced.mode === "municipality" && advanced.municipality?.trim()) {
    return { mode: "municipality", code: advanced.municipality.trim(), page, size };
  }
  if (advanced.mode === "competency" && advanced.competency?.trim()) {
    return { mode: "competency", competency: advanced.competency.trim(), page, size };
  }
  if (advanced.mode === "occupation" && advanced.occupation?.trim()) {
    return { mode: "occupation", occupation: advanced.occupation.trim(), page, size };
  }
  if (advanced.mode === "dateRange" && advanced.startDate && advanced.endDate) {
    return { mode: "dateRange", startDate: advanced.startDate, endDate: advanced.endDate, page, size };
  }

  if (filter === "vocational") return { mode: "vocational", page, size };
  if (filter === "distance") return { mode: "distance", page, size };
  if (keyword.trim()) return { mode: "search", keyword: keyword.trim(), page, size };
  return { mode: "all", page, size };
}

export default function HomePage() {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [searchInput, setSearchInput] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advanced, setAdvanced] = useState<{
    mode: AdvancedMode;
    municipality: string;
    competency: string;
    occupation: string;
    startDate: string;
    endDate: string;
  }>({
    mode: null,
    municipality: "",
    competency: "",
    occupation: "",
    startDate: "",
    endDate: "",
  });

  const query = buildQuery(filter, keyword, page, 20, advanced);
  const { data, loading, error } = useEducations(query);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput);
    setAdvanced((a) => ({ ...a, mode: null }));
    setPage(0);
  }, [searchInput]);

  const handleFilter = useCallback((f: FilterMode) => {
    setFilter(f);
    setAdvanced((a) => ({ ...a, mode: null }));
    setPage(0);
  }, []);

  const applyAdvanced = useCallback(() => {
    setAdvanced((a) => {
      if (a.municipality.trim()) return { ...a, mode: "municipality" as const };
      if (a.competency.trim()) return { ...a, mode: "competency" as const };
      if (a.occupation.trim()) return { ...a, mode: "occupation" as const };
      if (a.startDate && a.endDate) return { ...a, mode: "dateRange" as const };
      return { ...a, mode: null };
    });
    setPage(0);
  }, []);

  const clearAdvanced = useCallback(() => {
    setAdvanced({
      mode: null,
      municipality: "",
      competency: "",
      occupation: "",
      startDate: "",
      endDate: "",
    });
    setPage(0);
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />

      <section
        id="programs"
        className="relative -mt-16 pt-6 pb-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto">
          {/* Search & filters */}
          <div className="mb-8 space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="search"
                placeholder="Sök utbildningar…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl main_blue text-slate-950 font-semibold hover:main_blue transition-colors"
              >
                Sök
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {(["all", "vocational", "distance"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => handleFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f && !advanced.mode
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f === "all" ? "Alla" : f === "vocational" ? "Yrkesutbildning" : "Distans"}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setAdvancedOpen((o) => !o)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {advancedOpen ? "Färre filter" : "Fler filter"} ↓
              </button>
            </div>

            {advancedOpen && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Kommunnummer</label>
                    <input
                      type="text"
                      placeholder="t.ex. 0180"
                      value={advanced.municipality}
                      onChange={(e) => setAdvanced((a) => ({ ...a, municipality: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Kompetens</label>
                    <input
                      type="text"
                      placeholder="t.ex. programmering"
                      value={advanced.competency}
                      onChange={(e) => setAdvanced((a) => ({ ...a, competency: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Yrke</label>
                    <input
                      type="text"
                      placeholder="t.ex. utvecklare"
                      value={advanced.occupation}
                      onChange={(e) => setAdvanced((a) => ({ ...a, occupation: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-1">
                    <label className="block text-xs font-medium text-slate-600">Datumintervall</label>
                    <div className="flex gap-1">
                      <input
                        type="date"
                        value={advanced.startDate}
                        onChange={(e) => setAdvanced((a) => ({ ...a, startDate: e.target.value }))}
                        className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                      <input
                        type="date"
                        value={advanced.endDate}
                        onChange={(e) => setAdvanced((a) => ({ ...a, endDate: e.target.value }))}
                        className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={applyAdvanced}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-700"
                  >
                    Verkställ
                  </button>
                  <button
                    type="button"
                    onClick={clearAdvanced}
                    className="px-4 py-2 rounded-lg text-slate-600 text-sm font-medium hover:bg-slate-200"
                  >
                    Rensa
                  </button>
                </div>
              </div>
            )}
          </div>

          <h2
            className="text-2xl sm:text-3xl font-normal text-slate-800 mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {advanced.mode === "municipality"
              ? `Kommun ${advanced.municipality}`
              : advanced.mode === "competency"
                ? `Kompetens: ${advanced.competency}`
                : advanced.mode === "occupation"
                  ? `Yrke: ${advanced.occupation}`
                  : advanced.mode === "dateRange"
                    ? `Utbildningar ${advanced.startDate} – ${advanced.endDate}`
                    : filter === "vocational"
                      ? "Yrkesutbildningar"
                      : filter === "distance"
                        ? "Distansutbildningar"
                        : keyword
                          ? `Sökresultat för "${keyword}"`
                          : "Masterprogram"}
          </h2>

          {loading && (
            <p className="animate-pulse text-slate-500 py-8">Laddar…</p>
          )}
          {error && (
            <p className="text-amber-800 bg-amber-50 p-4 rounded-xl border border-amber-200">
              {error.message}
            </p>
          )}

          {!loading && !error && data && data.content.length === 0 && (
            <p className="text-slate-500 py-8">Inga utbildningar hittades.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.content.map((edu) => (
              <EducationCard key={edu.id} education={edu} />
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <nav
              className="flex justify-between items-center mt-12 py-6"
              aria-label="Sidnavigering"
            >
              <button
                disabled={data.first}
                onClick={() => setPage((p) => p - 1)}
                className="btn-pagination"
              >
                Föregående
              </button>
              <span className="text-sm font-medium text-slate-600">
                Sida {data.number + 1} av {data.totalPages}
              </span>
              <button
                disabled={data.last}
                onClick={() => setPage((p) => p + 1)}
                className="btn-pagination"
              >
                Nästa
              </button>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}
