import { useParams, Link } from "react-router-dom";
import { useEducationProviders } from "../../hooks/useEducationProviders";
import { useEducations } from "../../hooks/useEducations";
import { DetailSection, DetailRow } from "../detail";
import EducationCard from "../ui/EducationCard";
import { formatDateSwedish } from "../../utils/dateUtils";
import type { EducationProvider } from "../../types/api";

const PAGE_SIZE = 20;

export default function ProviderPage() {
  const { name } = useParams<{ name: string }>();
  const decodedName = name ? decodeURIComponent(name) : "";

  const { providers, loading: providersLoading, error: providersError } = useEducationProviders();
  const { data: educationsData, loading: educationsLoading, error: educationsError } = useEducations({
    mode: "provider",
    provider: decodedName,
    size: PAGE_SIZE,
  });

  const provider = providers.find(
    (p) => p.nameSwe === decodedName || p.nameEng === decodedName
  ) ?? null;

  if (!decodedName) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-600">Ingen anordnare angiven.</p>
          <Link to="/" className="mt-4 inline-block text-blue font-medium hover:underline">
            ← Tillbaka till utbildningar
          </Link>
        </div>
      </div>
    );
  }

  if (providersError) {
    return <ErrorState error={providersError} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium transition-colors"
        >
          <span aria-hidden>←</span> Tillbaka till utbildningar
        </Link>

        {providersLoading ? (
          <ProviderSkeleton />
        ) : (
          <ProviderHeader provider={provider} name={decodedName} />
        )}

        {provider && <ProviderDetails provider={provider} />}

        <section className="mt-12" id="utbildningar">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Utbildningar</h2>
          {educationsError ? (
            <p className="text-red-600">{educationsError.message}</p>
          ) : educationsLoading ? (
            <EducationsSkeleton />
          ) : educationsData && educationsData.content.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {educationsData.content.map((edu) => (
                <EducationCard key={edu.id} education={edu} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 py-12 text-center">
              Inga utbildningar hittades för denna anordnare.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function ProviderHeader({
  provider,
  name,
}: {
  provider: EducationProvider | null;
  name: string;
}) {
  return (
    <header className="rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-200/80 p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
        {provider?.nameSwe ?? name}
      </h1>
      {provider?.nameEng && provider.nameEng !== provider.nameSwe && (
        <p className="mt-1 text-slate-600">{provider.nameEng}</p>
      )}
    </header>
  );
}

function ProviderDetails({ provider }: { provider: EducationProvider }) {
  const hasContact =
    provider.email ||
    provider.phone ||
    provider.streetContact ||
    provider.townContact ||
    provider.postCodeContact;
  const hasVisit =
    provider.streetVisit || provider.townVisit || provider.postCodeVisit;

  return (
    <article className="mt-6 rounded-2xl overflow-hidden bg-white shadow border border-slate-200/80 p-6 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {provider.responsibleBody && (
          <DetailRow label="Ansvarshavande" value={provider.responsibleBody} />
        )}
        {provider.bodyType && (
          <DetailRow label="Typ" value={provider.bodyType} />
        )}
        {provider.url && (
          <div className="sm:col-span-2">
            <DetailRow
              label="Webbplats"
              value={
                <a
                  href={provider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue hover:underline"
                >
                  {provider.url}
                </a>
              }
            />
          </div>
        )}
        {provider.email && (
          <DetailRow
            label="E-post"
            value={
              <a href={`mailto:${provider.email}`} className="text-blue hover:underline">
                {provider.email}
              </a>
            }
          />
        )}
        {provider.phone && (
          <DetailRow
            label="Telefon"
            value={
              <a href={`tel:${provider.phone}`} className="text-blue hover:underline">
                {provider.phone}
              </a>
            }
          />
        )}
      </div>

      {hasContact && (
        <DetailSection title="Kontaktadress">
          <p className="text-slate-700">
            {[provider.streetContact, provider.postCodeContact, provider.townContact]
              .filter(Boolean)
              .join(", ")}
          </p>
        </DetailSection>
      )}

      {hasVisit && (
        <DetailSection title="Besöksadress">
          <p className="text-slate-700">
            {[provider.streetVisit, provider.postCodeVisit, provider.townVisit]
              .filter(Boolean)
              .join(", ")}
          </p>
        </DetailSection>
      )}

      {(provider.expires || provider.lastEdited) && (
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {provider.lastEdited && (
            <DetailRow label="Senast uppdaterad" value={formatDateSwedish(provider.lastEdited)} />
          )}
          {provider.expires && (
            <DetailRow label="Giltig till" value={formatDateSwedish(provider.expires)} />
          )}
        </div>
      )}
    </article>
  );
}

function ProviderSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow border border-slate-200/80 p-6 sm:p-8 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded-lg" />
      <div className="mt-2 h-4 w-48 bg-slate-100 rounded" />
    </div>
  );
}

function EducationsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-72 bg-white rounded-3xl animate-pulse border border-slate-100" />
      ))}
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
        <p className="text-amber-800 font-medium">{error.message}</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
        >
          ← Tillbaka till utbildningar
        </Link>
      </div>
    </div>
  );
}
