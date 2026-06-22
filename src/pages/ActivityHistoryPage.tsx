import { motion } from "framer-motion";
import { StandardPageLayout } from "../layouts/StandardPageLayout";
import { useCase } from "../context/CaseContext";
import type { ActivityEventType } from "../types/activity";

const eventAccent: Partial<Record<ActivityEventType, string>> = {
  call_incoming: "border-amber-200",
  call_answered: "border-green-200",
  call_ended: "border-slate-300",
  intake_started: "border-purple-200",
  callback_scheduled: "border-blue-200",
  consent_changed: "border-green-200",
  referral_sent: "border-brand/30",
  emergency_mode_enabled: "border-red-200",
};

export function ActivityHistoryPage() {
  const { activityEvents } = useCase();

  return (
    <StandardPageLayout
      title="Activity History"
      subtitle="Live case timeline for accountability and handoff"
    >
      <div className="relative pl-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-0 left-[7px] top-0 w-px bg-slate-200"
        />

        <ul className="space-y-6">
          {activityEvents.map((event, index) => (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative rounded-lg border p-4 transition-colors ${
                event.highlight
                  ? "border-purple-200 bg-purple-50"
                  : `${eventAccent[event.type] ?? "border-slate-200"} bg-white`
              }`}
            >
              <span className="absolute -left-6 top-5 h-3 w-3 rounded-full border-2 border-white bg-brand shadow-sm" />
              <p className="text-xs font-medium text-slate-500">
                {event.timestamp}
              </p>
              <p className="mt-1 font-semibold text-slate-900">{event.title}</p>
              {event.description && (
                <p className="mt-1 text-sm text-slate-600">{event.description}</p>
              )}
              <p className="mt-2 text-xs text-slate-400">{event.actor}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </StandardPageLayout>
  );
}
