import { AnimatePresence, motion } from "framer-motion";
import type { IntakeState } from "../types/intake";
import { transitions } from "../data/constants";
import { useIntakeStickyOffset } from "../hooks/useIntakeStickyOffset";
import { BroaderContextSection } from "./BroaderContextSection";
import { EmergencyModeBanner } from "./EmergencyModeBanner";
import { IncidentDetailsSection } from "./IncidentDetailsSection";
import { SafetySection } from "./SafetySection";
import { SurvivorNeedsSection } from "./SurvivorNeedsSection";

interface IntakeFormProps {
  intake: IntakeState;
  onIntakeChange: (intake: IntakeState) => void;
  onToggleEmergency: () => void;
  highlightedField: string | null;
}

export function IntakeForm({
  intake,
  onIntakeChange,
  onToggleEmergency,
  highlightedField,
}: IntakeFormProps) {
  useIntakeStickyOffset();

  const update = (partial: Partial<IntakeState>) => {
    onIntakeChange({ ...intake, ...partial });
  };

  return (
    <div className="flex flex-col">
      <div
        id="intake-sticky-header"
        className="sticky top-0 z-20 bg-page px-5 pb-4 pt-5 shadow-sm"
      >
        <EmergencyModeBanner
          emergencyMode={intake.emergencyMode}
          onToggle={onToggleEmergency}
        />
      </div>

      <div className="flex flex-col gap-5 px-5 pb-16">
        <SafetySection
          safety={intake.safety}
          onChange={(safety) => update({ safety })}
          highlightedField={highlightedField}
        />

        <SurvivorNeedsSection
          survivorNeeds={intake.survivorNeeds}
          consentStatus={intake.consentStatus}
          onChange={(survivorNeeds) => update({ survivorNeeds })}
          highlightedField={highlightedField}
        />

        <AnimatePresence initial={false}>
          {!intake.emergencyMode && (
            <motion.div
              key="lower-tiers"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={transitions.slow}
              className="space-y-5"
            >
              <IncidentDetailsSection
                incidentDetails={intake.incidentDetails}
                onChange={(incidentDetails) => update({ incidentDetails })}
              />
              <BroaderContextSection
                broaderContext={intake.broaderContext}
                onChange={(broaderContext) => update({ broaderContext })}
                highlightedField={highlightedField}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
