import { Link } from "react-router-dom";
import type {Education} from "../../types/Education.ts";

export default function EducationCard({ education }: { education: Education }) {
  const title = education.titles.find(t => t.lang === 'swe')?.content || education.titles[0]?.content;
  const startYear = new Date(education.executions[0]?.start).getFullYear();

  return (
      <div className="group bg-white rounded-3xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wider">
          {education.form.code}
        </span>
          <span className="text-blue-600 font-bold text-sm">
          {education.paceOfStudyPercentages[0]}% Takt
        </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <div className="flex items-center text-slate-500 text-sm mb-4">

          <span>📅 Start: {startYear || "Se info"}</span>
        </div>


        <div className="mt-auto">
          <Link
              to={`/education/${education.id}`}
              className="w-full block text-center py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all"
          >
            Visa detaljer
          </Link>
        </div>
      </div>
  );
}