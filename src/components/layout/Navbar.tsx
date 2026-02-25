import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Utbildningar" },
  { to: "/providers", label: "Anordnare" },
  { to: "/about", label: "Om oss" },
] as const;

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-3 min-w-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label="Karriärspåret (startsida)"
        >
          <img
            src={`${(import.meta.env.BASE_URL || "/").replace(/\/$/, "")}/karriarsparet-logo.png`}
            alt=""
            aria-hidden
            className="h-8 w-auto shrink-0"
          />
          <span className="hidden sm:inline truncate text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
            Karriärspåret
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {navLinks.map(({ to, label }) => {
            const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "relative px-3 py-2 rounded-xl text-sm font-semibold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                  isActive
                    ? "text-slate-900 after:content-[''] after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
