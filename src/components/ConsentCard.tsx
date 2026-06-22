import { motion } from "framer-motion";
import { AlertTriangle, Check, X } from "lucide-react";
import { consentCardConfig } from "../lib/consentStyles";
import type { ConsentStatus } from "../types/intake";

interface ConsentCardProps {
  consentStatus: ConsentStatus;
  onConsentChange: (status: "granted" | "declined") => void;
  pulse?: boolean;
  highlighted?: boolean;
}

const copyConfig = {
  unknown: {
    title: "Consent to share identifiable information with service(s)",
    body: "Does the survivor consent to share identifiable information with receiving service(s)?",
    icon: AlertTriangle,
    iconClass: "bg-orange-500 text-white",
    titleClass: "text-slate-900",
    bodyClass: "text-slate-600",
  },
  granted: {
    title: "Consent granted",
    body: "Identifiable information can be shared with selected service(s).",
    icon: Check,
    iconClass: "bg-green-600 text-white",
    titleClass: "text-slate-900",
    bodyClass: "text-slate-600",
  },
  declined: {
    title: "Consent declined",
    body: "Referral will be anonymized. Identifiable fields will be masked before hand-off.",
    icon: X,
    iconClass: "bg-red-600 text-white",
    titleClass: "text-slate-900",
    bodyClass: "text-slate-600",
  },
};

export function ConsentCard({
  consentStatus,
  onConsentChange,
  pulse,
  highlighted,
}: ConsentCardProps) {
  const surface = consentCardConfig[consentStatus];
  const copy = copyConfig[consentStatus];
  const StatusIcon = copy.icon;

  return (
    <motion.div
      id="consent"
      className={`rounded-xl border p-4 transition-colors${highlighted ? " field-highlight" : ""}`}
      animate={{
        borderColor: surface.borderColor,
        backgroundColor: surface.backgroundColor,
        boxShadow: pulse
          ? "0 0 0 3px rgba(245, 158, 11, 0.35)"
          : surface.boxShadow,
      }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <div className="mb-4 flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${copy.iconClass}`}
        >
          <StatusIcon className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={`text-sm font-semibold leading-snug ${copy.titleClass}`}>
            {copy.title}
          </h3>
          <p className={`mt-2 text-sm leading-relaxed ${copy.bodyClass}`}>
            {copy.body}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          aria-pressed={consentStatus === "granted"}
          onClick={() => onConsentChange("granted")}
          className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
            consentStatus === "granted"
              ? "bg-green-600 text-white"
              : consentStatus === "unknown"
                ? "border border-green-500 bg-green-50 text-green-700 hover:bg-green-100"
                : "border border-green-500 bg-white text-green-700 hover:bg-green-50"
          }`}
        >
          Granted
        </button>
        <button
          type="button"
          aria-pressed={consentStatus === "declined"}
          onClick={() => onConsentChange("declined")}
          className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
            consentStatus === "declined"
              ? "bg-red-600 text-white"
              : consentStatus === "unknown"
                ? "border border-red-500 bg-red-50 text-red-700 hover:bg-red-100"
                : "border border-red-500 bg-white text-red-700 hover:bg-red-50"
          }`}
        >
          Declined
        </button>
      </div>
    </motion.div>
  );
}
