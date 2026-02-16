import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/" className="font-semibold text-slate-900 hover:text-blue transition-colors">
            Karriärspåret
          </Link>
          <div className="flex gap-6 text-sm text-slate-600">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              Utbildningar
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center sm:text-left text-sm text-slate-500">
          © {new Date().getFullYear()} Karriärspåret. Hitta din väg.
        </p>
      </div>
    </footer>
  );
}
