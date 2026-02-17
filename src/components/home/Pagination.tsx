import type { Page } from "../../types/Page";

interface PaginationProps {
  data: Page<unknown>;
  onPageChange: (delta: number) => void;
}

export default function Pagination({ data, onPageChange }: PaginationProps) {
  if (data.totalPages <= 1) return null;

  return (
    <div className="mt-16 flex justify-center items-center gap-2">
      <button
        disabled={data.first}
        onClick={() => onPageChange(-1)}
        type="button"
        className="p-4 rounded-xl bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
      >
        ← <span className="hidden sm:inline ml-1 font-bold text-sm">Föregående</span>
      </button>

      <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-3">
        <span className="font-bold text-brand">{data.number + 1}</span>
        <span className="mx-2 text-slate-300">/</span>
        <span className="text-slate-600 font-medium">{data.totalPages}</span>
      </div>

      <button
        disabled={data.last}
        onClick={() => onPageChange(1)}
        type="button"
        className="p-4 rounded-xl bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
      >
        <span className="hidden sm:inline mr-1 font-bold text-sm">Nästa</span> →
      </button>
    </div>
  );
}
