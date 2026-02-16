interface TagListProps {
  items: string[];
}

export default function TagList({ items }: TagListProps) {
  if (!items?.length) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <li
          key={`${item}-${i}`}
          className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
