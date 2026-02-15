import { useState } from "react";
import Hero from "../ui/Hero";
import useAllEducationsPaged from "../../hooks/useAllEducationsPaged.tsx";

export default function HomePage() {
    const [page, setPage] = useState(0);
    const { data, loading, error } = useAllEducationsPaged({ page });

    return (
        <div className="container mx-auto max-w-7xl px-4 py-6">
            <Hero />

            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-6 italic border-l-4 border-blue-600 pl-4">
                    Explore Our Master's Programs
                </h2>

                {loading && <p className="animate-pulse text-gray-500">Fetching latest programs...</p>}
                {error && <p className="text-red-500 bg-red-50 p-3 rounded">Error: {error.message}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data?.content.map((edu) => {
                        // Priority: English -> First Available
                        const title = edu.titles.find(t => t.lang === "eng") || edu.titles[0];
                        const desc = edu.descriptions.find(d => d.lang === "eng") || edu.descriptions[0];

                        return (
                            <div key={edu.id} className="flex flex-col border rounded-xl p-6 shadow-sm hover:shadow-lg transition-all bg-white">
                                <div className="mb-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        {edu.educationLevel.code}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {title?.content}
                                </h3>

                                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                    {desc?.content}
                                </p>

                                <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-y-2 text-xs text-gray-500">
                                    <div>
                                        <p className="font-semibold text-gray-700">Pace</p>
                                        <p>{edu.paceOfStudyPercentages.join(", ")}%</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-700">Language</p>
                                        <p className="uppercase">{edu.languagesOfInstruction.join(", ")}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="font-semibold text-gray-700">Next Start</p>
                                        <p>{edu.executions[0]?.start || "TBD"}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination (Same as previous, ensures user stays within bounds) */}
                {data && (
                    <div className="flex justify-between items-center mt-12 py-4">
                        <button
                            disabled={data.first}
                            onClick={() => setPage(p => p - 1)}
                            className="btn-pagination"
                        >
                            Previous
                        </button>
                        <span className="text-sm font-medium">
                            Page {data.number + 1} of {data.totalPages}
                        </span>
                        <button
                            disabled={data.last}
                            onClick={() => setPage(p => p + 1)}
                            className="btn-pagination"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}