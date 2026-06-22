import type { Availability } from "../../types/agency";

const styles: Record<
  Availability,
  { label: string; className: string }
> = {
  available: {
    label: "AVAILABLE",
    className: "bg-green-100 text-green-700",
  },
  waitlist: {
    label: "WAITLIST",
    className: "bg-purple-100 text-purple-700",
  },
  limited: {
    label: "LIMITED",
    className: "bg-orange-100 text-orange-700",
  },
};

interface AvailabilityBadgeProps {
  status: Availability;
  size?: "sm" | "md";
}

export function AvailabilityBadge({
  status,
  size = "sm",
}: AvailabilityBadgeProps) {
  const { label, className } = styles[status];
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex shrink-0 rounded font-bold uppercase tracking-wide ${sizeClass} ${className}`}
    >
      {label}
    </span>
  );
}
