import { useCallback, useMemo, useState } from "react";
import { HoverScrollArea } from "../components/ui/HoverScrollArea";
import { CaseNotesCard } from "../components/CaseNotesCard";
import { ConsentCard } from "../components/ConsentCard";
import { FieldJumpCommand } from "../components/FieldJumpCommand";
import { IntakeForm } from "../components/IntakeForm";
import { IntakeProgressCard } from "../components/IntakeProgressCard";
import { IntakeShell } from "../components/IntakeShell";
import { ReferralMatcher } from "../components/ReferralMatcher";
import { ReferralQueue } from "../components/ReferralQueue";
import { ServiceInfoModal } from "../components/ServiceInfoModal";
import { useCase } from "../context/CaseContext";
import { agencies } from "../data/agencies";
import { useAutosave } from "../hooks/useAutosave";
import { useEmergencyMode } from "../hooks/useEmergencyMode";
import { scrollToIntakeElement } from "../lib/scroll";

function serializeIntake(intake: object): string {
  return JSON.stringify(intake);
}

export function IntakePage() {
  const {
    intake,
    setIntake,
    referralQueue,
    addToQueue,
    removeFromQueue,
    sendState,
    setSendState,
    highlightedField,
    setHighlightedField,
    consentPulse,
    setConsentPulse,
    consentWarning,
    setConsentWarning,
    consentHighlight,
    setConsentHighlight,
    addActivityEvent,
  } = useCase();

  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const { toggleEmergencyMode } = useEmergencyMode(intake, setIntake);
  const changeKey = useMemo(() => serializeIntake(intake), [intake]);
  const saveLabel = useAutosave(changeKey);

  const handleToggleEmergency = useCallback(() => {
    const next = !intake.emergencyMode;
    toggleEmergencyMode();
    addActivityEvent({
      timestamp: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
      type: next ? "emergency_mode_enabled" : "emergency_mode_disabled",
      title: next ? "Emergency mode enabled" : "Emergency mode disabled",
      description: next
        ? "Tier 2 and Tier 3 fields hidden"
        : "All intake tiers visible",
      actor: "Operator",
    });
  }, [intake.emergencyMode, toggleEmergencyMode, addActivityEvent]);

  const handleConsentChange = useCallback(
    (status: "granted" | "declined") => {
      setIntake((prev) => ({ ...prev, consentStatus: status }));
      setConsentWarning(false);
      setConsentHighlight(true);
      setTimeout(() => setConsentHighlight(false), 600);
      addActivityEvent({
        timestamp: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
        type: "consent_changed",
        title: status === "granted" ? "Consent granted" : "Consent declined",
        description:
          status === "granted"
            ? "Identifiable information sharing approved"
            : "Anonymized referral path selected",
        actor: "Operator",
      });
    },
    [setIntake, setConsentWarning, setConsentHighlight, addActivityEvent],
  );

  const handleSend = useCallback(() => {
    if (referralQueue.length === 0) return;

    if (intake.consentStatus === "unknown") {
      setConsentPulse(true);
      setConsentWarning(true);
      scrollToIntakeElement("consent");
      setTimeout(() => setConsentPulse(false), 800);
      return;
    }

    setSendState("loading");
    setTimeout(() => {
      setSendState("success");
      const time = new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      referralQueue.forEach((id) => {
        const agency = agencies.find((a) => a.id === id);
        if (agency) {
          addActivityEvent({
            timestamp: time,
            type: "referral_sent",
            title: `Referral sent to ${agency.name}`,
            description:
              intake.consentStatus === "declined"
                ? "Anonymized referral"
                : `External Tracking ID received`,
            actor: "Operator",
          });
        }
      });
    }, 700);
  }, [
    referralQueue,
    intake.consentStatus,
    setConsentPulse,
    setConsentWarning,
    setSendState,
    addActivityEvent,
  ]);

  const scrollToElement = useCallback((elementId: string) => {
    scrollToIntakeElement(elementId);
  }, []);

  const handleSectionNavigate = useCallback(
    (sectionId: string) => {
      scrollToElement(sectionId);
    },
    [scrollToElement],
  );

  const handleFieldJump = useCallback(
    (fieldId: string) => {
      if (fieldId === "consent") {
        scrollToElement("consent");
        setHighlightedField("consent");
        setTimeout(() => setHighlightedField(null), 1200);
        return;
      }

      scrollToElement(fieldId);
      const el = document.getElementById(fieldId);

      const input = el?.querySelector<HTMLElement>("input, button, [tabindex]");
      input?.focus();

      setHighlightedField(fieldId);
      setTimeout(() => setHighlightedField(null), 1200);
    },
    [scrollToElement, setHighlightedField],
  );

  return (
    <>
      <IntakeShell
        contextPanel={
          <>
            <HoverScrollArea label="Intake progress" maxHeight="calc((100vh - 5rem) / 3 - 0.75rem)">
              <IntakeProgressCard
                emergencyMode={intake.emergencyMode}
                onNavigateToSection={handleSectionNavigate}
              />
            </HoverScrollArea>
            <HoverScrollArea label="Case notes" maxHeight="calc((100vh - 5rem) / 3 - 0.75rem)">
              <CaseNotesCard saveLabel={saveLabel} />
            </HoverScrollArea>
            <HoverScrollArea label="Consent" maxHeight="calc((100vh - 5rem) / 3 - 0.75rem)">
              <ConsentCard
                consentStatus={intake.consentStatus}
                onConsentChange={handleConsentChange}
                pulse={consentPulse}
                highlighted={highlightedField === "consent"}
              />
            </HoverScrollArea>
          </>
        }
        mainContent={
          <IntakeForm
            intake={intake}
            onIntakeChange={setIntake}
            onToggleEmergency={handleToggleEmergency}
            highlightedField={highlightedField}
          />
        }
        rightPanel={
          <div className="flex h-full min-h-0 flex-col">
            <ReferralMatcher
              intake={intake}
              referralQueue={referralQueue}
              onAdd={addToQueue}
              onInfo={setSelectedAgencyId}
            />
            <ReferralQueue
              referralQueue={referralQueue}
              consentStatus={intake.consentStatus}
              sendState={sendState}
              consentHighlight={consentHighlight}
              consentWarning={consentWarning}
              onRemove={removeFromQueue}
              onSend={handleSend}
            />
          </div>
        }
      />

      <ServiceInfoModal
        agencyId={selectedAgencyId}
        isInQueue={
          selectedAgencyId ? referralQueue.includes(selectedAgencyId) : false
        }
        onClose={() => setSelectedAgencyId(null)}
        onAdd={addToQueue}
      />

      <FieldJumpCommand onJump={handleFieldJump} />
    </>
  );
}
