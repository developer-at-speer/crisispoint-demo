import { ConsentCard } from "./ConsentCard";
import { IntakeProgressCard } from "./IntakeProgressCard";
import type { ConsentStatus } from "../types/intake";

interface NavigateIntakePanelProps {
  emergencyMode: boolean;
  activeSectionId?: string;
  consentStatus: ConsentStatus;
  onNavigateToSection?: (sectionId: string) => void;
  onConsentChange: (status: "granted" | "declined") => void;
  consentPulse?: boolean;
  consentHighlighted?: boolean;
}

export function NavigateIntakePanel({
  emergencyMode,
  activeSectionId,
  consentStatus,
  onNavigateToSection,
  onConsentChange,
  consentPulse,
  consentHighlighted,
}: NavigateIntakePanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <IntakeProgressCard
        emergencyMode={emergencyMode}
        activeSectionId={activeSectionId}
        onNavigateToSection={onNavigateToSection}
      />

      <ConsentCard
        consentStatus={consentStatus}
        onConsentChange={onConsentChange}
        pulse={consentPulse}
        highlighted={consentHighlighted}
      />
    </div>
  );
}
