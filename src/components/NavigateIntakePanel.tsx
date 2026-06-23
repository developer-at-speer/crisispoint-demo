import { ConsentCard } from "./ConsentCard";
import { IntakeProgressCard } from "./IntakeProgressCard";
import type { ConsentStatus } from "../types/intake";
import type { ReactNode } from "react";

interface NavigateIntakePanelProps {
  emergencyMode: boolean;
  activeSectionId?: string;
  consentStatus: ConsentStatus;
  onNavigateToSection?: (sectionId: string) => void;
  onConsentChange: (status: "granted" | "declined") => void;
  consentPulse?: boolean;
  consentHighlighted?: boolean;
  caseNotes?: ReactNode;
}

export function NavigateIntakePanel({
  emergencyMode,
  activeSectionId,
  consentStatus,
  onNavigateToSection,
  onConsentChange,
  consentPulse,
  consentHighlighted,
  caseNotes,
}: NavigateIntakePanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <IntakeProgressCard
        emergencyMode={emergencyMode}
        activeSectionId={activeSectionId}
        onNavigateToSection={onNavigateToSection}
      />

      {caseNotes}

      <ConsentCard
        consentStatus={consentStatus}
        onConsentChange={onConsentChange}
        pulse={consentPulse}
        highlighted={consentHighlighted}
      />
    </div>
  );
}
