import { Link, useNavigate } from "react-router-dom";

interface ProviderLinkProps {
  name: string;
  /** Use when inside another Link (e.g. EducationCard) to prevent navigation conflict */
  stopPropagation?: boolean;
  className?: string;
}

export default function ProviderLink({ name, stopPropagation, className = "" }: ProviderLinkProps) {
  const navigate = useNavigate();

  if (stopPropagation) {
    return (
      <span
        role="link"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          navigate(`/provider/${encodeURIComponent(name)}`);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/provider/${encodeURIComponent(name)}`);
          }
        }}
        className={`hover:underline cursor-pointer ${className}`}
      >
        {name}
      </span>
    );
  }

  return (
    <Link
      to={`/provider/${encodeURIComponent(name)}`}
      className={`hover:underline cursor-pointer ${className}`}
    >
      {name}
    </Link>
  );
}
