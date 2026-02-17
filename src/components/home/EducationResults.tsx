import EducationCard from "../ui/EducationCard";
import type { EducationJobEdResponse } from "../../types/api";

interface EducationResultsProps {
  isLoading: boolean;
  error: Error | null;
  educations: EducationJobEdResponse[];
  onClearFilters: () => void;
}

const SKELETON_COUNT = 6;

export default function EducationResults({
  isLoading,
  error,
  educations,
  onClearFilters,
}: EducationResultsProps) {
  if (isLoading) return <LoadingSkeleton count={SKELETON_COUNT} />;
  if (error) return <ErrorState error={error} />;
  if (educations.length === 0) return <EmptyState onClearFilters={onClearFilters} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {educations.map((edu) => (
        <EducationCard key={edu.id} education={edu} />
      ))}
    </div>
  );
}

function LoadingSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="h-72 bg-white rounded-xl animate-pulse border border-slate-100"
        />
      ))}
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="p-12 bg-red-50 rounded-xl border border-red-200 text-center">
      <p className="text-red-600 font-bold text-lg">Ett fel uppstod vid hämtning</p>
      <p className="text-red-500 mt-2">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
      >
        Försök igen
      </button>
    </div>
  );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
      <p className="text-slate-400 text-xl">
        Hittade inga utbildningar som matchar din sökning.
      </p>
      <button onClick={onClearFilters} className="mt-4 text-brand font-semibold hover:text-brand-hover transition-colors">
        Se alla utbildningar
      </button>
    </div>
  );
}
