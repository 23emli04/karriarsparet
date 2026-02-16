interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

export default function DetailRow({ label, value }: DetailRowProps) {
  if (
    value == null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return null;
  }

  return (
    <div>
      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        {label}
      </dt>
      <dd className="mt-1 text-slate-800 font-medium">{value}</dd>
    </div>
  );
}
