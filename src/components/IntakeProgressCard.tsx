import { AnimatePresence, motion } from "framer-motion";
import { transitions } from "../data/constants";

interface ProgressItemProps {
  title: string;
  meta: string;
  dotColor: string;
  muted?: boolean;
}

function ProgressItem({ title, meta, dotColor, muted }: ProgressItemProps) {
  return (
    <div
      className={`flex items-start gap-3 py-2 ${muted ? "opacity-50" : ""}`}
    >
      <span
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColor}`}
        aria-hidden="true"
      />
      <div>
        <p
          className={`text-sm font-medium ${muted ? "text-slate-400" : "text-slate-800"}`}
        >
          {title}
        </p>
        <p className="text-xs text-slate-500">{meta}</p>
      </div>
    </div>
  );
}

interface IntakeProgressCardProps {
  emergencyMode: boolean;
}

export function IntakeProgressCard({ emergencyMode }: IntakeProgressCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Intake progress
      </h3>

      <ProgressItem
        title="Safety"
        meta="Tier 0 · always asked"
        dotColor="bg-red-500"
      />
      <ProgressItem
        title="Survivor details & service needs"
        meta="Tier 1 · fast path"
        dotColor="bg-green-500"
      />

      <AnimatePresence initial={false}>
        {!emergencyMode ? (
          <motion.div
            key="full-tiers"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={transitions.standard}
            className="overflow-hidden"
          >
            <ProgressItem
              title="Incident details"
              meta="Tier 2 · if time allows"
              dotColor="bg-slate-400"
            />
            <ProgressItem
              title="Broader context"
              meta="Tier 3 · only if appropriate"
              dotColor="bg-slate-300"
            />
          </motion.div>
        ) : (
          <motion.div
            key="hidden-tiers"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={transitions.standard}
            className="overflow-hidden"
          >
            <ProgressItem
              title="Incident details"
              meta="Hidden in emergency mode"
              dotColor="bg-slate-300"
              muted
            />
            <ProgressItem
              title="Broader context"
              meta="Hidden in emergency mode"
              dotColor="bg-slate-300"
              muted
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
