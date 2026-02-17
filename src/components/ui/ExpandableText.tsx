import { useState } from "react";

interface ExpandableTextProps {
  text: string;
  className?: string;
  /** Character limit before showing "Visa mer" (default 500) */
  collapseAt?: number;
}

export default function ExpandableText({
  text,
  className = "",
  collapseAt = 500,
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text.length > collapseAt;
  const slice = text.slice(0, collapseAt);
  const cutAt = slice.lastIndexOf(" ");
  const preview = cutAt > 100 ? slice.slice(0, cutAt) : slice;
  const displayText = isLong && !isExpanded ? `${preview.trimEnd()}...` : text;

  if (!text.trim()) return null;

  return (
    <div>
      <div className={`whitespace-pre-wrap leading-relaxed ${className}`}>
        {displayText}
      </div>
      {isLong && (
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="mt-2 text-sm font-medium text-brand hover:text-brand-hover transition-colors"
        >
          {isExpanded ? "Visa mindre" : "Visa mer"}
        </button>
      )}
    </div>
  );
}
