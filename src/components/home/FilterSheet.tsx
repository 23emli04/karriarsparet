import { useEffect } from "react";

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function FilterSheet({
  isOpen,
  onClose,
  children,
}: FilterSheetProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="fixed inset-x-0 bottom-0 top-1/3 z-50 lg:hidden flex flex-col bg-white rounded-t-3xl shadow-2xl animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-label="Filter"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
          <h2 className="text-lg font-semibold text-slate-800">Filter</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Stäng"
            className="p-2 -m-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
}

export function FilterSheetTrigger({
  onClick,
  filterCount,
}: {
  onClick: () => void;
  filterCount: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      aria-label={`Filter${filterCount > 0 ? ` (${filterCount} valda)` : ""}`}
    >
      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
      Filter
      {filterCount > 0 && (
        <span className="min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-blue text-slate-900 text-xs font-bold">
          {filterCount}
        </span>
      )}
    </button>
  );
}
