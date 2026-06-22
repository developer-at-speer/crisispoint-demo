interface SectionHeaderProps {
  title: string;
  tier: string;
  tierVariant?: "urgent" | "normal" | "muted";
}

export function SectionHeader({
  title,
  tier,
  tierVariant = "normal",
}: SectionHeaderProps) {
  const tierStyles = {
    urgent: "bg-red-50 text-red-700 border-red-100",
    normal: "bg-slate-100 text-slate-600 border-slate-200",
    muted: "bg-slate-50 text-slate-400 border-slate-100",
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-slate-200 pb-3">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <span
        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tierStyles[tierVariant]}`}
      >
        {tier}
      </span>
    </div>
  );
}
