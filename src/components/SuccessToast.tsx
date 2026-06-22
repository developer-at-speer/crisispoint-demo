import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { agencies, trackingIds } from "../data/agencies";
import { CASE_NUMBER } from "../data/constants";
import type { ConsentStatus } from "../types/intake";

interface SuccessToastProps {
  consentStatus: ConsentStatus;
  referralQueue: string[];
}

export function SuccessToast({
  consentStatus,
  referralQueue,
}: SuccessToastProps) {
  const queuedAgencies = referralQueue
    .map((id) => agencies.find((a) => a.id === id))
    .filter(Boolean);

  const isAnonymized = consentStatus === "declined";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4"
    >
      <div className="mb-4 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <h3 className="text-sm font-semibold text-slate-900">
          {isAnonymized ? "Anonymized referral sent" : "Referral sent"}
        </h3>
      </div>

      {isAnonymized ? (
        <div className="space-y-3 text-sm text-slate-600">
          <div>
            <p className="font-medium text-slate-800">
              Identifying fields masked:
            </p>
            <ul className="mt-1 list-inside list-disc text-slate-600">
              <li>Name</li>
              <li>Callback number</li>
              <li>Exact location</li>
            </ul>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Status logged anonymously.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs text-slate-500"
          >
            External Tracking ID: ANON-48291
          </motion.p>
        </div>
      ) : (
        <ul className="space-y-3">
          {queuedAgencies.map((agency, index) => (
            <motion.li
              key={agency!.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"
            >
              <p className="font-medium text-slate-900">{agency!.name}</p>
              <p className="text-slate-600">
                Status:{" "}
                {agency!.availability === "waitlist"
                  ? "Waitlist request sent"
                  : "Sent"}
              </p>
              <p className="font-mono text-xs text-slate-500">
                External Tracking ID: {trackingIds[agency!.id]}
              </p>
            </motion.li>
          ))}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: queuedAgencies.length * 0.1 + 0.1 }}
            className="text-sm text-slate-600"
          >
            Case status updated for Case #{CASE_NUMBER}.
          </motion.p>
        </ul>
      )}
    </motion.div>
  );
}
