import { Phone } from "lucide-react";
import { formatCallDuration } from "../lib/callTimer";

interface ActiveCallTimerProps {
  seconds: number;
  className?: string;
}

export function ActiveCallTimer({ seconds, className = "" }: ActiveCallTimerProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full bg-green-500/15 px-3 py-1.5 text-xs font-semibold text-green-100 ring-1 ring-green-400/30 ${className}`.trim()}
      aria-live="polite"
      aria-label={`On call for ${formatCallDuration(seconds)}`}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
      </span>
      <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>On call</span>
      <span className="tabular-nums text-white">{formatCallDuration(seconds)}</span>
    </div>
  );
}
