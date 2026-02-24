import { Link } from "react-router-dom";

const links = [
  { to: "/", label: "Utbildningar" },
  { to: "/providers", label: "Anordnare" },
  { to: "/about", label: "Om oss" },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link
            to="/"
            className="font-display text-lg text-slate-900 hover:text-brand transition-colors"
          >
            Karriärspåret
          </Link>
          <div className="flex gap-6">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-slate-600 hover:text-brand transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-4 text-center sm:text-left text-sm text-slate-500">
          © {new Date().getFullYear()} Karriärspåret. Hitta din väg.
        </p>
      </div>
    </footer>
  );
}
