interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
