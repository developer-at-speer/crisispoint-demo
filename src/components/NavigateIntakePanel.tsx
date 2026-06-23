import { CaseNotesCard } from "./CaseNotesCard";
import { ConsentCard } from "./ConsentCard";
import { IntakeProgressCard } from "./IntakeProgressCard";
import { HoverScrollArea } from "./ui/HoverScrollArea";
import type { ConsentStatus } from "../types/intake";

const PANEL_MAX_HEIGHT = "calc((100vh - 5rem) / 3 - 0.75rem)";

interface NavigateIntakePanelProps {
  caseId: string;
  emergencyMode: boolean;
  activeSectionId?: string;
  consentStatus: ConsentStatus;
  onNavigateToSection?: (sectionId: string) => void;
  onConsentChange: (status: "granted" | "declined") => void;
  consentPulse?: boolean;
  consentHighlighted?: boolean;
}

export function NavigateIntakePanel({
  caseId,
  emergencyMode,
  activeSectionId,
  consentStatus,
  onNavigateToSection,
  onConsentChange,
  consentPulse,
  consentHighlighted,
}: NavigateIntakePanelProps) {
  return (
    <>
      <HoverScrollArea label="Intake progress" maxHeight={PANEL_MAX_HEIGHT}>
        <IntakeProgressCard
          emergencyMode={emergencyMode}
          activeSectionId={activeSectionId}
          onNavigateToSection={onNavigateToSection}
        />
      </HoverScrollArea>

      <HoverScrollArea label="Case notes" maxHeight={PANEL_MAX_HEIGHT}>
        <CaseNotesCard caseId={caseId} />
      </HoverScrollArea>

      <HoverScrollArea label="Consent" maxHeight={PANEL_MAX_HEIGHT}>
        <ConsentCard
          consentStatus={consentStatus}
          onConsentChange={onConsentChange}
          pulse={consentPulse}
          highlighted={consentHighlighted}
        />
      </HoverScrollArea>
    </>
  );
}
