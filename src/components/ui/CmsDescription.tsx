import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface CmsDescriptionProps {
  text: string;
  collapseAtChars?: number;
  maxCollapsedSections?: number;
}

function normalizeCmsText(raw: string): string {
  return raw
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/([^\n])\s*(#{2,6}\s)/g, "$1\n\n$2")
    .replace(/^(#{2,6}\s+[^\n]{3,120}?)(?<=[a-zåäö])(?=[A-ZÅÄÖ])/gmu, "$1\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getCollapsedMarkdown(
  markdown: string,
  collapseAtChars: number,
  maxCollapsedSections: number
): string {
  const sections = markdown.split(/(?=^##\s+)/m).filter(Boolean);
  if (sections.length > maxCollapsedSections) {
    return sections.slice(0, maxCollapsedSections).join("").trimEnd();
  }

  if (markdown.length <= collapseAtChars) return markdown;
  return `${markdown.slice(0, collapseAtChars).trimEnd()}\n\n...`;
}

export default function CmsDescription({
  text,
  collapseAtChars = 1600,
  maxCollapsedSections = 2,
}: CmsDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  const markdown = useMemo(() => normalizeCmsText(text), [text]);
  const collapsedMarkdown = useMemo(
    () => getCollapsedMarkdown(markdown, collapseAtChars, maxCollapsedSections),
    [markdown, collapseAtChars, maxCollapsedSections]
  );
  const canExpand = collapsedMarkdown !== markdown;

  if (!markdown) return null;

  return (
    <div>
      <div className="prose prose-slate max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => (
              <h3 className="mt-8 mb-3 text-base sm:text-lg font-semibold text-slate-900">
                {children}
              </h3>
            ),
            h3: ({ children }) => (
              <h4 className="mt-6 mb-2 text-sm sm:text-base font-semibold text-slate-800">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="text-slate-700 leading-relaxed my-3">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 my-3 space-y-1 text-slate-700">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 my-3 space-y-1 text-slate-700">{children}</ol>
            ),
            a: ({ href, children }) =>
              href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:text-brand-hover underline underline-offset-2"
                >
                  {children}
                </a>
              ) : (
                <span>{children}</span>
              ),
          }}
        >
          {expanded ? markdown : collapsedMarkdown}
        </ReactMarkdown>
      </div>

      {canExpand ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-sm font-medium text-brand hover:text-brand-hover transition-colors"
        >
          {expanded ? "Visa mindre" : "Visa mer"}
        </button>
      ) : null}
    </div>
  );
}
