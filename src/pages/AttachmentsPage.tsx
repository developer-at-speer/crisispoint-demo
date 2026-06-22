import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { StandardPageLayout } from "../layouts/StandardPageLayout";
import { useCase } from "../context/CaseContext";

export function AttachmentsPage() {
  const { attachments, generateReferralSummary, intake } = useCase();
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      generateReferralSummary();
      setGenerating(false);
    }, 900);
  };

  return (
    <StandardPageLayout
      title="Attachments & Documents"
      subtitle="Case documents respect consent and sharing mode"
    >
      <button
        type="button"
        onClick={handleGenerate}
        disabled={generating}
        className="mb-6 flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-light disabled:opacity-70"
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating…
          </>
        ) : (
          "Generate Referral Summary"
        )}
      </button>

      {attachments.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No documents yet. Generate a referral summary from the current case
          state.
          {intake.consentStatus === "declined" && (
            <span className="mt-2 block text-slate-600">
              Consent is declined — generated documents will be anonymized.
            </span>
          )}
        </p>
      ) : (
        <ul className="space-y-3">
          {attachments.map((doc, index) => (
            <motion.li
              key={doc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">{doc.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Generated {doc.createdAt} · {doc.createdBy}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Sharing mode:{" "}
                    <span className="capitalize">{doc.sharingMode}</span>
                  </p>
                  {doc.sharingMode === "anonymized" && (
                    <span className="mt-2 inline-block rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                      Masked fields applied
                    </span>
                  )}
                </div>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium capitalize text-green-700">
                  {doc.status}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </StandardPageLayout>
  );
}
