import { Link } from "react-router-dom";
import { useEducationProviders } from "../../hooks/useEducationProviders";

export default function ProvidersListPage() {
  const { providers, loading, error } = useEducationProviders();

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error.message}</p>
          <Link to="/" className="mt-4 inline-block text-blue hover:underline">
            ← Tillbaka
          </Link>
        </div>
      </div>
    );
  }

  const sorted = [...(providers ?? [])].sort((a, b) =>
    a.nameSwe.localeCompare(b.nameSwe, "sv")
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium transition-colors"
        >
          <span aria-hidden>←</span> Tillbaka till utbildningar
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Anordnare
        </h1>
        <p className="text-slate-600 mb-8">
          Utforska universitet och högskolor som erbjuder utbildningar
        </p>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="h-14 bg-white rounded-xl animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2 list-none">
            {sorted.map((p) => (
              <li key={p.identifier}>
                <Link
                  to={`/provider/${encodeURIComponent(p.nameSwe)}`}
                  className="block p-4 rounded-xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all text-slate-900 font-medium"
                >
                  {p.nameSwe}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
