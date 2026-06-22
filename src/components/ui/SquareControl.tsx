interface SquareControlProps {
  selected: boolean;
  className?: string;
}

export function SquareControl({ selected, className = "" }: SquareControlProps) {
  return (
    <span
      className={`h-5 w-5 shrink-0 rounded-sm border transition-all duration-150 ${
        selected
          ? "border-brand-accent bg-brand-accent"
          : "border-slate-300 bg-white"
      } ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
