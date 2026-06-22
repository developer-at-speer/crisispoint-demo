import { useState } from "react";
import { motion } from "framer-motion";
import { StandardPageLayout } from "../layouts/StandardPageLayout";
import { useCase } from "../context/CaseContext";

export function MessagesPage() {
  const { messages, addMessage } = useCase();
  const [tab, setTab] = useState<"internal" | "agency">("internal");
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = messages.filter((m) => m.channel === tab);

  const handleSend = () => {
    if (!draft.trim()) return;
    setSaving(true);
    addMessage(draft.trim(), tab);
    setDraft("");
    setTimeout(() => setSaving(false), 700);
  };

  return (
    <StandardPageLayout
      title="Notes & Messages"
      subtitle="Structured case communication for AWHL staff and agencies"
    >
      <div className="mb-6 flex gap-2">
        {(
          [
            { id: "internal" as const, label: "Internal Notes" },
            { id: "agency" as const, label: "Agency Messages" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-purple-100 text-purple-800"
                : "bg-white text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-xs text-slate-500">
            {tab === "internal"
              ? "Visible to AWHL staff only"
              : "Shared with receiving agencies when appropriate"}
          </p>
        </div>

        <ul className="max-h-96 space-y-4 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <li className="text-sm text-slate-500">No messages yet.</li>
          ) : (
            filtered.map((msg, index) => (
              <motion.li
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-lg bg-slate-50 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900">
                    {msg.senderName}
                  </p>
                  <p className="text-xs text-slate-400">{msg.timestamp}</p>
                </div>
                <p className="mt-2 text-sm text-slate-700">{msg.body}</p>
              </motion.li>
            ))
          )}
        </ul>

        <div className="border-t border-slate-100 p-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              tab === "internal"
                ? "Add an internal case note..."
                : "Message to agency..."
            }
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              {saving ? "Saving…" : "Saved locally for demo"}
            </p>
            <button
              type="button"
              onClick={handleSend}
              disabled={!draft.trim() || saving}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-light disabled:bg-slate-300"
            >
              Send note
            </button>
          </div>
        </div>
      </div>

      {tab === "agency" && filtered.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">
          Example: Safe Harbor Women&apos;s Shelter — Referral received. Intake
          coordinator reviewing.
        </p>
      )}
    </StandardPageLayout>
  );
}
