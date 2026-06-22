import { ConsentCard } from "./ConsentCard";
import { IntakeProgressCard } from "./IntakeProgressCard";
import type { ConsentStatus } from "../types/intake";

interface NavigateIntakePanelProps {
  emergencyMode: boolean;
  consentStatus: ConsentStatus;
  onNavigateToSection?: (sectionId: string) => void;
  onConsentChange: (status: "granted" | "declined") => void;
  consentPulse?: boolean;
  consentHighlighted?: boolean;
}

export function NavigateIntakePanel({
  emergencyMode,
  consentStatus,
  onNavigateToSection,
  onConsentChange,
  consentPulse,
  consentHighlighted,
}: NavigateIntakePanelProps) {
  return (
    <div className="flex h-full flex-col gap-5">
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Navigate intake
        </h2>
        <IntakeProgressCard
          emergencyMode={emergencyMode}
          onNavigateToSection={onNavigateToSection}
        />
      </div>

      <ConsentCard
        consentStatus={consentStatus}
        onConsentChange={onConsentChange}
        pulse={consentPulse}
        highlighted={consentHighlighted}
      />
    </div>
  );
}
