import { AnimatePresence, motion } from "framer-motion";
import { INTAKE_SECTION_IDS, transitions } from "../data/constants";

interface ProgressItemProps {
  title: string;
  meta: string;
  dotColor?: string;
  hideDot?: boolean;
  muted?: boolean;
  active?: boolean;
  isLast?: boolean;
  sectionId?: string;
  onNavigate?: (sectionId: string) => void;
}

function ProgressItem({
  title,
  meta,
  dotColor,
  hideDot,
  muted,
  active,
  isLast,
  sectionId,
  onNavigate,
}: ProgressItemProps) {
  const clickable = !muted && sectionId && onNavigate;

  const rowClass = `w-full px-4 py-3.5 text-left transition-colors ${
    active ? "bg-purple-50" : clickable ? "hover:bg-slate-50" : ""
  } ${!isLast ? "border-b border-slate-100" : ""} ${muted ? "opacity-50" : ""}`;

  const inner = (
    <div className="flex items-start gap-3">
      {!hideDot && dotColor ? (
        <span
          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotColor}`}
          aria-hidden="true"
        />
      ) : (
        <span className="mt-1.5 w-2.5 shrink-0" aria-hidden="true" />
      )}
      <div>
        <p
          className={`text-sm font-semibold ${muted ? "text-slate-400" : "text-slate-900"}`}
        >
          {title}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">{meta}</p>
      </div>
    </div>
  );

  if (!clickable) {
    return <div className={rowClass}>{inner}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onNavigate(sectionId)}
      className={`${rowClass} focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand`}
    >
      {inner}
    </button>
  );
}

interface IntakeProgressCardProps {
  emergencyMode: boolean;
  activeSectionId?: string;
  onNavigateToSection?: (sectionId: string) => void;
}

export function IntakeProgressCard({
  emergencyMode,
  activeSectionId,
  onNavigateToSection,
}: IntakeProgressCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3.5">
        <h2 className="text-sm font-semibold text-slate-900">Navigate intake</h2>
      </div>

      <div>
        <ProgressItem
          title="Safety"
          meta="Tier 0 · always asked"
          dotColor="bg-red-500"
          active={activeSectionId === INTAKE_SECTION_IDS.safety}
          sectionId={INTAKE_SECTION_IDS.safety}
          onNavigate={onNavigateToSection}
        />
        <ProgressItem
          title="Survivor details & service needs"
          meta="Tier 1 · fast path"
          dotColor="bg-green-500"
          active={activeSectionId === INTAKE_SECTION_IDS.survivorDetails}
          sectionId={INTAKE_SECTION_IDS.survivorDetails}
          onNavigate={onNavigateToSection}
        />
        <ProgressItem
          title="Service needs"
          meta="Tier 1 · fast path"
          dotColor="bg-green-500"
          active={activeSectionId === INTAKE_SECTION_IDS.serviceNeeds}
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
              className="overflow-hidden"
            >
              <ProgressItem
                title="Incident details"
                meta="Tier 2 · if time allows"
                dotColor="bg-slate-400"
                active={activeSectionId === INTAKE_SECTION_IDS.incidentDetails}
                sectionId={INTAKE_SECTION_IDS.incidentDetails}
                onNavigate={onNavigateToSection}
              />
              <ProgressItem
                title="Broader context"
                meta="Tier 3 · only if appropriate"
                dotColor="bg-slate-400"
                active={activeSectionId === INTAKE_SECTION_IDS.broaderContext}
                isLast
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
                isLast
                muted
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
