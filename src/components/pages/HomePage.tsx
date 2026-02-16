import { useState } from "react";
import Hero from "../ui/Hero";
import useAllEducationsPaged from "../../hooks/useAllEducationsPaged.tsx";

export default function HomePage() {
    const [page, setPage] = useState(0);
    const { data, loading, error } = useAllEducationsPaged({ page });

    return (
        <div className="min-h-screen">
            <Hero />

            <section
                id="programs"
                className="relative -mt-16 pt-6 pb-20 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-6xl mx-auto">
                    <h2
                        className="text-2xl sm:text-3xl font-normal text-slate-800 mb-8"
                        style={{ fontFamily: "var(--font-display)" }}
                    >
                        Master's Programs
                    </h2>

                    {loading && (
                        <p className="animate-pulse text-slate-500 py-8">
                            Loading programs…
                        </p>
                    )}
                    {error && (
                        <p className="text-amber-800 bg-amber-50 p-4 rounded-xl border border-amber-200">
                            {error.message}
                        </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data?.content.map((edu) => {
                            const title =
                                edu.titles.find((t) => t.lang === "eng") ||
                                edu.titles[0];
                            const desc =
                                edu.descriptions.find(
                                    (d) => d.lang === "eng"
                                ) || edu.descriptions[0];

                            return (
                                <article
                                    key={edu.id}
                                    className="group flex flex-col rounded-2xl p-6 sm:p-7 bg-white shadow-sm border border-slate-200/80 hover:shadow-md hover:border-slate-300/80 transition-all duration-200"
                                >
                                    <span className="inline-flex w-fit text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mb-4">
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
                                            <span className="font-medium text-slate-500">Pace</span>
                                            <p className="text-slate-700 mt-0.5">
                                                {edu.paceOfStudyPercentages.join(", ")}%
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-slate-500">Language</span>
                                            <p className="text-slate-700 mt-0.5 uppercase">
                                                {edu.languagesOfInstruction.join(", ")}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="font-medium text-slate-500">Next start</span>
                                            <p className="text-slate-700 mt-0.5">
                                                {edu.executions[0]?.start || "TBD"}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {data && data.totalPages > 1 && (
                        <nav
                            className="flex justify-between items-center mt-12 py-6"
                            aria-label="Pagination"
                        >
                            <button
                                disabled={data.first}
                                onClick={() => setPage((p) => p - 1)}
                                className="btn-pagination"
                            >
                                Previous
                            </button>
                            <span className="text-sm font-medium text-slate-600">
                                Page {data.number + 1} of {data.totalPages}
                            </span>
                            <button
                                disabled={data.last}
                                onClick={() => setPage((p) => p + 1)}
                                className="btn-pagination"
                            >
                                Next
                            </button>
                        </nav>
                    )}
                </div>
            </section>
        </div>
    );
}