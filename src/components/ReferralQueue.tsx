import { motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { agencies } from "../data/agencies";
import { getReferralCta } from "../data/constants";
import type { ConsentStatus, SendState } from "../types/intake";
import { AvailabilityBadge } from "./ui/AvailabilityBadge";
import { SuccessToast } from "./SuccessToast";

interface ReferralQueueProps {
  referralQueue: string[];
  consentStatus: ConsentStatus;
  sendState: SendState;
  consentHighlight: boolean;
  consentWarning: boolean;
  onRemove: (agencyId: string) => void;
  onSend: () => void;
}

export function ReferralQueue({
  referralQueue,
  consentStatus,
  sendState,
  consentHighlight,
  consentWarning,
  onRemove,
  onSend,
}: ReferralQueueProps) {
  const ctaLabel = getReferralCta(consentStatus, referralQueue.length);
  const isDisabled =
    referralQueue.length === 0 || sendState === "loading" || sendState === "success";

  const queuedAgencies = referralQueue
    .map((id) => agencies.find((a) => a.id === id))
    .filter(Boolean);

  if (sendState === "success") {
    return (
      <div className="fixed bottom-0 right-0 z-50 w-[360px] border-t border-slate-200 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <SuccessToast
          consentStatus={consentStatus}
          referralQueue={referralQueue}
        />
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 w-[360px] border-t border-slate-200 bg-white p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">
          Referral Queue{" "}
          {referralQueue.length > 0 && (
            <span className="font-normal text-slate-500">
              {referralQueue.length} referral{referralQueue.length !== 1 ? "s" : ""}
            </span>
          )}
        </h3>
      </div>

      {referralQueue.length === 0 ? (
        <p className="mb-4 text-sm text-slate-500">
          No referrals selected yet.
          <br />
          Add services from the live matcher.
        </p>
      ) : (
        <>
          <p className="mb-3 text-xs text-slate-500">
            Services selected from the live matcher.
          </p>
          <ul className="mb-4 max-h-36 space-y-2 overflow-y-auto">
            {queuedAgencies.map((agency) => (
              <motion.li
                key={agency!.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {agency!.name}
                  </p>
                  <p className="text-xs text-slate-500">{agency!.primaryService}</p>
                </div>
                <div className="flex items-center gap-2">
                  <AvailabilityBadge status={agency!.availability} />
                  <button
                    type="button"
                    onClick={() => onRemove(agency!.id)}
                    aria-label={`Remove ${agency!.name}`}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        </>
      )}

      {consentWarning && (
        <p className="mb-3 text-xs font-medium text-amber-700">
          Confirm consent before sending identifiable information.
        </p>
      )}

      <motion.button
        type="button"
        animate={{
          boxShadow: consentHighlight
            ? "0 0 0 3px rgba(138, 0, 111, 0.3)"
            : "0 0 0 0px rgba(138, 0, 111, 0)",
        }}
        transition={{ duration: 0.2 }}
        onClick={onSend}
        disabled={isDisabled && consentStatus !== "unknown"}
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors ${
          referralQueue.length === 0
            ? "cursor-not-allowed bg-slate-200 text-slate-500"
            : "bg-brand text-white hover:bg-brand-light"
        }`}
      >
        {sendState === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          ctaLabel
        )}
      </motion.button>
    </div>
  );
}
