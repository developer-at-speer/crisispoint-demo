import type { TriState } from "../../types/intake";
import { SquareControl } from "./SquareControl";

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
      className={`form-question space-y-3 ${className ?? ""}`.trim()}
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
        className="flex flex-wrap gap-x-5 gap-y-3"
      >
        {options.map((opt) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-2.5 text-sm transition-colors ${
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
              <SquareControl selected={selected} />
              {opt.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}
