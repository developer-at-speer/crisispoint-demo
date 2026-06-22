import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { ConsentStatus } from "../types/intake";

interface ConsentCardProps {
  consentStatus: ConsentStatus;
  onConsentChange: (status: "granted" | "declined") => void;
  pulse?: boolean;
  highlighted?: boolean;
}

const stateConfig = {
  unknown: {
    borderColor: "#f59e0b",
    backgroundColor: "#fff7ed",
    title: "Consent to share identifiable information with service(s)",
    body: "Does the survivor consent to share identifiable information with receiving service(s)?",
    showWarning: true,
  },
  granted: {
    borderColor: "#16a34a",
    backgroundColor: "#f0fdf4",
    title: "Consent granted",
    body: "Identifiable information can be shared with selected service(s).",
    showWarning: false,
  },
  declined: {
    borderColor: "#dc2626",
    backgroundColor: "#fef2f2",
    title: "Consent declined",
    body: "Referral will be anonymized. Identifiable fields will be masked before hand-off.",
    showWarning: false,
  },
};

export function ConsentCard({
  consentStatus,
  onConsentChange,
  pulse,
  highlighted,
}: ConsentCardProps) {
  const config = stateConfig[consentStatus];

  return (
    <motion.div
      id="consent"
      className={`rounded-xl border-2 p-5 shadow-sm${highlighted ? " field-highlight" : ""}`}
      animate={{
        borderColor: config.borderColor,
        backgroundColor: config.backgroundColor,
        boxShadow: pulse
          ? "0 0 0 3px rgba(245, 158, 11, 0.4)"
          : "0 0 0 0px rgba(245, 158, 11, 0)",
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-5 flex items-start gap-3">
        {config.showWarning && (
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-snug text-slate-900">
            {config.title}
          </h3>
          <motion.p
            key={consentStatus}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="mt-2 text-sm leading-relaxed text-slate-600"
          >
            {config.body}
          </motion.p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          aria-pressed={consentStatus === "granted"}
          onClick={() => onConsentChange("granted")}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
            consentStatus === "granted"
              ? "bg-green-600 text-white"
              : "border border-green-600 bg-white text-green-700 hover:bg-green-50"
          }`}
        >
          Granted
        </button>
        <button
          type="button"
          aria-pressed={consentStatus === "declined"}
          onClick={() => onConsentChange("declined")}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
            consentStatus === "declined"
              ? "bg-red-600 text-white"
              : "border border-red-400 bg-white text-red-600 hover:bg-red-50"
          }`}
        >
          Declined
        </button>
      </div>
    </motion.div>
  );
}
