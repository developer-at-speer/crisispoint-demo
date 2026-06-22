import type { TriState } from "../../types/intake";

interface TriStateRadioProps {
  id?: string;
  name: string;
  label: string;
  value: TriState | "yes" | "no" | null;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  allowUnsure?: boolean;
  className?: string;
}

export function TriStateRadio({
  id,
  name,
  label,
  value,
  options,
  onChange,
  className,
}: TriStateRadioProps) {
  const labelId = `${id ?? name}-label`;

  return (
    <div
      id={id}
      role="group"
      aria-labelledby={labelId}
      className={`form-question space-y-2 ${className ?? ""}`.trim()}
    >
      <div
        id={labelId}
        className="form-question-label text-sm font-medium text-slate-700"
      >
        {label}
      </div>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex flex-wrap gap-x-4 gap-y-2"
      >
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-2 text-sm transition-colors ${
                selected ? "font-medium text-slate-900" : "text-slate-600"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span
                className={`flex h-5 w-5 items-center justify-center rounded border transition-all duration-[120ms] ${
                  selected
                    ? "border-brand-accent bg-brand-accent"
                    : "border-slate-300 bg-white"
                }`}
                aria-hidden="true"
              >
                {selected && (
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
              {opt.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}
