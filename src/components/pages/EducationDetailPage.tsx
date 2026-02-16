import { useParams, Link } from "react-router-dom";
import {useEducationEnrichedById} from "../../hooks/useEducations.tsx";

/**
 * HELPER COMPONENTS
 */
function formatDate(s: string) {
    try {
        const d = new Date(s);
        return isNaN(d.getTime())
            ? s
            : d.toLocaleDateString("sv-SE", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
    } catch {
        return s;
    }
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
    if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) return null;
    return (
        <div>
            <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</dt>
            <dd className="mt-1 text-slate-800 font-medium">{value}</dd>
        </div>
    );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mt-8">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">{title}</h2>
            <div className="space-y-3">{children}</div>
        </section>
    );
}

/**
 * MAIN PAGE COMPONENT
 */
export default function EducationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data, loading, error } = useEducationEnrichedById(id);

    if (loading) return <p className="p-8 animate-pulse text-slate-500">Laddar…</p>;

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <p className="text-amber-800 bg-amber-50 p-4 rounded-xl border border-amber-200">
                    {error.message}
                </p>
                <Link to="/" className="mt-4 inline-block text-amber-700 font-medium hover:underline">
                    ← Tillbaka till utbildningar
                </Link>
            </div>
        );
    }

    if (!data) return null;

    // educationEvent is now used below
    const { education, educationEvent, educationProvider } = data;

    const {
        titles = [],
        descriptions = [],
        subjects = [],
        paceOfStudyPercentages = [],
        languagesOfInstruction = [],
        lastEdited
    } = education;

    const title = titles.find((t) => t.lang === "swe") || titles[0];
    const desc = descriptions.find((d) => d.lang === "swe") || descriptions[0];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Link to="/" className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 mb-6 font-medium">
                    ← Tillbaka till utbildningar
                </Link>

                <article className="rounded-2xl p-6 sm:p-8 bg-white shadow-sm border border-slate-200/80">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-4">
                        {title?.content}
                    </h1>

                    {desc?.content && (
                        <div className="prose prose-slate max-w-none mb-8">
                            <p className="text-slate-600 whitespace-pre-wrap">{desc.content}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-100">
                        <DetailRow label="Studietakt" value={paceOfStudyPercentages.map(p => `${p}%`).join(", ")} />
                        <DetailRow label="Språk" value={languagesOfInstruction.join(", ")} />
                        {/* formatDate is now used here */}
                        <DetailRow label="Senast uppdaterad" value={lastEdited ? formatDate(lastEdited) : null} />
                    </div>

                    {/* educationEvent is now used here */}
                    {educationEvent && (
                        <DetailSection title="Ansökan & Start">
                            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                                <DetailRow
                                    label="Startdatum"
                                    value={educationEvent.executionStart ? formatDate(educationEvent.executionStart) : "Ej angivet"}
                                />
                                {educationEvent.urlSwe && (
                                    <div className="mt-3">
                                        <a
                                            href={educationEvent.urlSwe}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline text-sm font-medium"
                                        >
                                            Gå till ansökan →
                                        </a>
                                    </div>
                                )}
                            </div>
                        </DetailSection>
                    )}

                    {subjects.length > 0 && (
                        <DetailSection title="Ämnen">
                            <ul className="flex flex-wrap gap-2">
                                {subjects.map((s) => (
                                    <li key={s.code} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                                        {s.name}
                                    </li>
                                ))}
                            </ul>
                        </DetailSection>
                    )}

                    {educationProvider && (
                        <DetailSection title="Anordnare">
                            <p className="text-slate-800 font-medium">{educationProvider.nameSwe}</p>
                        </DetailSection>
                    )}
                </article>
            </div>
        </div>
    );
}