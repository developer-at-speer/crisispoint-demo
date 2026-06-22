interface TagProps {
  children: React.ReactNode;
  highlight?: boolean;
}

export function Tag({ children, highlight }: TagProps) {
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs ${
        highlight
          ? "bg-purple-100 font-medium text-purple-800"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {children}
    </span>
  );
}
