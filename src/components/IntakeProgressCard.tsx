import { AnimatePresence, motion } from "framer-motion";
import { INTAKE_SECTION_IDS, transitions } from "../data/constants";

interface ProgressItemProps {
  title: string;
  meta: string;
  dotColor?: string;
  hideDot?: boolean;
  muted?: boolean;
  sectionId?: string;
  onNavigate?: (sectionId: string) => void;
}

function ProgressItem({
  title,
  meta,
  dotColor,
  hideDot,
  muted,
  sectionId,
  onNavigate,
}: ProgressItemProps) {
  const clickable = !muted && sectionId && onNavigate;

  const inner = (
    <div className="flex items-start gap-3">
      {!hideDot && dotColor ? (
        <span
          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${dotColor}`}
          aria-hidden="true"
        />
      ) : (
        <span className="mt-1 w-2.5 shrink-0" aria-hidden="true" />
      )}
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

  if (!clickable) {
    return (
      <div
        className={`rounded-lg border border-slate-200 bg-white px-3 py-3 ${
          muted ? "opacity-50" : ""
        }`}
      >
        {inner}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onNavigate(sectionId)}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-left transition-colors hover:border-brand-accent/40 hover:bg-purple-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {inner}
    </button>
  );
}

interface IntakeProgressCardProps {
  emergencyMode: boolean;
  onNavigateToSection?: (sectionId: string) => void;
}

export function IntakeProgressCard({
  emergencyMode,
  onNavigateToSection,
}: IntakeProgressCardProps) {
  return (
    <div className="space-y-2">
      <ProgressItem
        title="Safety"
        meta="Tier 0 · always asked"
        dotColor="bg-red-500"
        sectionId={INTAKE_SECTION_IDS.safety}
        onNavigate={onNavigateToSection}
      />
      <ProgressItem
        title="Survivor details"
        meta="Tier 1 · fast path"
        dotColor="bg-green-500"
        sectionId={INTAKE_SECTION_IDS.survivorDetails}
        onNavigate={onNavigateToSection}
      />
      <ProgressItem
        title="Service needs"
        meta="Tier 1 · fast path"
        dotColor="bg-green-500"
        sectionId={INTAKE_SECTION_IDS.serviceNeeds}
        onNavigate={onNavigateToSection}
      />

      <AnimatePresence initial={false}>
        {!emergencyMode ? (
          <motion.div
            key="full-tiers"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={transitions.standard}
            className="space-y-2 overflow-hidden"
          >
            <ProgressItem
              title="Incident details"
              meta="Tier 2 · if time allows"
              dotColor="bg-slate-400"
              sectionId={INTAKE_SECTION_IDS.incidentDetails}
              onNavigate={onNavigateToSection}
            />
            <ProgressItem
              title="Broader context"
              meta="Tier 3 · only if appropriate"
              dotColor="bg-slate-300"
              sectionId={INTAKE_SECTION_IDS.broaderContext}
              onNavigate={onNavigateToSection}
            />
          </motion.div>
        ) : (
          <motion.div
            key="hidden-tiers"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={transitions.standard}
            className="space-y-2 overflow-hidden"
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
