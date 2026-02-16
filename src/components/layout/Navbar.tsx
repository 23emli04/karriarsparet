import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 font-semibold text-slate-900 hover:text-blue transition-colors"
        >
          <span className="text-xl tracking-tight">Karriärspåret</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
          >
            Utbildningar
          </Link>
          <Link
            to="/providers"
            className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
          >
            Anordnare
          </Link>
        </div>
      </nav>
    </header>
  );
}
