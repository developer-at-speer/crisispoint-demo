import type { ConsentStatus } from "../../types/intake";

interface SectionHeaderProps {
  title: string;
  tier: string;
  tierVariant?: "urgent" | "normal" | "muted";
  sharingStatus?: ConsentStatus;
  headerTintClass?: string;
}

const sharingStatusConfig = {
  granted: {
    message: "This information will be shared",
    className: "text-sm font-semibold text-green-700",
  },
  declined: {
    message: "This information won't be shared",
    className: "text-sm font-semibold text-red-700",
  },
};

export function SectionHeader({
  title,
  tier,
  tierVariant = "normal",
  sharingStatus,
  headerTintClass = "border-slate-200 bg-white",
}: SectionHeaderProps) {
  const tierStyles = {
    urgent: "bg-red-50 text-red-700 border-red-100",
    normal: "bg-slate-100 text-slate-600 border-slate-200",
    muted: "bg-slate-50 text-slate-400 border-slate-100",
  };

  return (
    <div
      className={`sticky z-10 -mx-6 mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-b px-6 pb-4 pt-5 ${headerTintClass}`}
      style={{ top: "var(--intake-sticky-offset, 8.5rem)" }}
    >
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <span
        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tierStyles[tierVariant]}`}
      >
        {tier}
      </span>
      {sharingStatus === "granted" || sharingStatus === "declined" ? (
        <span className={`ml-auto ${sharingStatusConfig[sharingStatus].className}`}>
          {sharingStatusConfig[sharingStatus].message}
        </span>
      ) : null}
    </div>
  );
}
