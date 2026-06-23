import { INTAKE_SECTION_IDS } from "../data/constants";
import type { IntakeState } from "../types/intake";
import { TriStateRadio } from "./ui/TriStateRadio";
import { IntakeSection } from "./ui/IntakeSection";
import { questionClasses } from "./ui/FormQuestion";

const triOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Unsure" },
];

const yesNoOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

interface SafetySectionProps {
  safety: IntakeState["safety"];
  onChange: (safety: IntakeState["safety"]) => void;
  highlightedField: string | null;
}

export function SafetySection({
  safety,
  onChange,
  highlightedField,
}: SafetySectionProps) {
  const callbackDisabled = safety.safeToCallBack === "no";

  return (
    <IntakeSection
      id={INTAKE_SECTION_IDS.safety}
      title="Safety"
      tier="Tier 0 · always asked"
      tierVariant="urgent"
    >
      <TriStateRadio
        id="safeToTalk"
        className={highlightedField === "safeToTalk" ? "field-highlight" : undefined}
        name="safeToTalk"
        label="Is it safe to talk right now?"
        value={safety.safeToTalk}
        options={triOptions}
        onChange={(v) =>
          onChange({ ...safety, safeToTalk: v as IntakeState["safety"]["safeToTalk"] })
        }
      />

      <div className="space-y-5">
        <TriStateRadio
          id="safeToCallBack"
          className={highlightedField === "safeToCallBack" ? "field-highlight" : undefined}
          name="safeToCallBack"
          label="Safe to disclose?"
          value={safety.safeToCallBack}
          options={yesNoOptions}
          onChange={(v) =>
            onChange({
              ...safety,
              safeToCallBack: v as IntakeState["safety"]["safeToCallBack"],
            })
          }
        />

        <div
          className={`grid gap-5 sm:grid-cols-2 transition-opacity ${
            callbackDisabled ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <div
            id="callbackNumber"
            className={questionClasses(highlightedField === "callbackNumber")}
          >
            <label
              htmlFor="callback-number"
              className="mb-2.5 block text-sm font-medium text-slate-700"
            >
              Callback Number
            </label>
            <input
              id="callback-number"
              type="tel"
              value={safety.callbackNumber}
              onChange={(e) =>
                onChange({ ...safety, callbackNumber: e.target.value })
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </div>
          <div
            id="callbackTime"
            className={questionClasses(highlightedField === "callbackTime")}
          >
            <label
              htmlFor="callback-time"
              className="mb-2.5 block text-sm font-medium text-slate-700"
            >
              Callback Time
            </label>
            <input
              id="callback-time"
              type="text"
              placeholder="HH:MM AM/PM"
              value={safety.callbackTime}
              onChange={(e) =>
                onChange({ ...safety, callbackTime: e.target.value })
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
            />
          </div>
        </div>
      </div>

      <TriStateRadio
        name="dependentsPresent"
        label="Are there children / dependents accompanying the survivor?"
        value={safety.dependentsPresent}
        options={triOptions}
        onChange={(v) =>
          onChange({
            ...safety,
            dependentsPresent: v as IntakeState["safety"]["dependentsPresent"],
          })
        }
      />

      <TriStateRadio
        name="medicalAttentionRequired"
        label="Is immediate medical attention required?"
        value={safety.medicalAttentionRequired}
        options={triOptions}
        onChange={(v) =>
          onChange({
            ...safety,
            medicalAttentionRequired:
              v as IntakeState["safety"]["medicalAttentionRequired"],
          })
        }
      />
    </IntakeSection>
  );
}
