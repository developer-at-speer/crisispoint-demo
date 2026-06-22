import { motion } from "framer-motion";
import { StandardPageLayout } from "../layouts/StandardPageLayout";
import { useCase } from "../context/CaseContext";
import { agencies, trackingIds } from "../data/agencies";

export function PrivacyPage() {
  const { intake, referralQueue, sendState } = useCase();
  const { consentStatus } = intake;

  const sharingMode =
    consentStatus === "granted"
      ? "identifiable"
      : consentStatus === "declined"
        ? "anonymized"
        : "unconfirmed";

  const maskedFields =
    consentStatus === "declined"
      ? ["Full name", "Callback number", "Exact address", "Personal notes"]
      : [];

  const borderColor =
    consentStatus === "granted"
      ? "#16a34a"
      : consentStatus === "declined"
        ? "#2563eb"
        : "#f59e0b";

  const bgColor =
    consentStatus === "granted"
      ? "#f0fdf4"
      : consentStatus === "declined"
        ? "#eff6ff"
        : "#fff7ed";

  return (
    <StandardPageLayout
      title="Privacy, Consent & Safety Controls"
      subtitle="Audit how consent affects data sharing for this case"
    >
      <motion.div
        animate={{ borderColor, backgroundColor: bgColor }}
        transition={{ duration: 0.2 }}
        className="mb-6 rounded-xl border-2 p-6"
      >
        <h2 className="text-lg font-semibold text-slate-900">Consent status</h2>
        <p className="mt-2 capitalize text-slate-700">
          {consentStatus === "unknown"
            ? "Consent has not been confirmed"
            : `Consent ${consentStatus}`}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Sharing mode:{" "}
          <span className="font-medium capitalize">{sharingMode}</span>
        </p>
      </motion.div>

      {maskedFields.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6 rounded-xl border border-slate-200 bg-white p-6"
        >
          <h3 className="font-semibold text-slate-900">Masked fields</h3>
          <ul className="mt-3 space-y-1 text-sm text-slate-600">
            {maskedFields.map((f) => (
              <li key={f}>· {f}</li>
            ))}
          </ul>
        </motion.div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="font-semibold text-slate-900">Agency sharing</h3>
        {referralQueue.length === 0 && sendState !== "success" ? (
          <p className="mt-3 text-sm text-slate-500">
            No referrals sent yet for this case.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {(sendState === "success" ? referralQueue : referralQueue).map(
              (id) => {
                const agency = agencies.find((a) => a.id === id);
                if (!agency) return null;
                const anonymized = consentStatus === "declined";
                return (
                  <li
                    key={id}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm"
                  >
                    <p className="font-medium text-slate-900">{agency.name}</p>
                    <p className="text-slate-600">
                      {anonymized
                        ? "Anonymized referral sent"
                        : "Identifiable referral sent"}
                    </p>
                    {sendState === "success" && (
                      <p className="mt-1 font-mono text-xs text-slate-500">
                        Tracking ID:{" "}
                        {anonymized
                          ? "ANON-48291"
                          : trackingIds[id]}
                      </p>
                    )}
                  </li>
                );
              },
            )}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="font-semibold text-slate-900">Audit log</h3>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="text-slate-600">
            <span className="font-medium text-slate-800">Operator</span> — Consent
            state reviewed · just now
          </li>
          {consentStatus !== "unknown" && (
            <motion.li
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-600"
            >
              <span className="font-medium text-slate-800">Operator</span> —
              Consent set to {consentStatus}
            </motion.li>
          )}
        </ul>
      </section>
    </StandardPageLayout>
  );
}
