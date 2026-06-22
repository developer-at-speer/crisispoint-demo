import { motion } from "framer-motion";
import { StandardPageLayout } from "../layouts/StandardPageLayout";
import { useCase } from "../context/CaseContext";

export function ActivityHistoryPage() {
  const { activityEvents } = useCase();

  return (
    <StandardPageLayout
      title="Activity History"
      subtitle="Case timeline for accountability and handoff"
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
                  : "border-slate-200 bg-white"
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
