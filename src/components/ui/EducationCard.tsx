import { Link } from "react-router-dom";
import type { Education } from "../../types/Education";

interface EducationCardProps {
  education: Education;
}

export default function EducationCard({ education: edu }: EducationCardProps) {
  const title = edu.titles.find((t) => t.lang === "swe") || edu.titles[0];
  const desc = edu.descriptions.find((d) => d.lang === "swe") || edu.descriptions[0];
  const pace = edu.paceOfStudyPercentages ?? [];
  const langs = edu.languagesOfInstruction ?? [];

  return (
    <Link
      to={`/education/${edu.id}`}
      className="group flex flex-col rounded-2xl p-6 sm:p-7 bg-white shadow-sm border border-slate-200/80 hover:shadow-md hover:border-slate-300/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
    >
      <span className="inline-flex w-fit text-xs font-semibold uppercase tracking-wider  bg-blue-alt px-2.5 py-1 rounded-md mb-4">
        {edu.educationLevel.code}
      </span>

      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 leading-tight group-hover:text-slate-800">
        {title?.content}
      </h3>

      <p className="text-slate-600 text-sm line-clamp-3 mb-5 flex-grow">
        {desc?.content}
      </p>

      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
        <div>
          <span className="font-medium text-slate-500">Takt</span>
          <p className="text-slate-700 mt-0.5">
            {pace.length ? pace.join(", ") + "%" : "—"}
          </p>
        </div>
        <div>
          <span className="font-medium text-slate-500">Språk</span>
          <p className="text-slate-700 mt-0.5 uppercase">
            {langs.length ? langs.join(", ") : "—"}
          </p>
        </div>
        <div className="col-span-2">
          <span className="font-medium text-slate-500">Nästa start</span>
          <p className="text-slate-700 mt-0.5">
            {edu.executions[0]?.start || "Ej bestämd"}
          </p>
        </div>
      </div>
    </Link>
  );
}
