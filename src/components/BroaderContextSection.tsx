import { INTAKE_SECTION_IDS } from "../data/constants";
import type { IntakeState, TriState } from "../types/intake";
import { IntakeSection } from "./ui/IntakeSection";
import { TriStateRadio } from "./ui/TriStateRadio";

const triOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Unsure" },
];

interface BroaderContextSectionProps {
  broaderContext: IntakeState["broaderContext"];
  onChange: (context: IntakeState["broaderContext"]) => void;
  highlightedField: string | null;
}

export function BroaderContextSection({
  broaderContext,
  onChange,
  highlightedField,
}: BroaderContextSectionProps) {
  return (
    <IntakeSection
      id={INTAKE_SECTION_IDS.broaderContext}
      title="Broader context"
      tier="Tier 3 · only if appropriate"
      tierVariant="muted"
      sectionClassName="opacity-90"
    >
      <div className="form-question">
        <label
          htmlFor="children-accompanying"
          className="mb-2.5 block text-sm font-medium text-slate-600"
        >
          Children accompanying the survivor (number / ages)
        </label>
        <input
          id="children-accompanying"
          type="text"
          placeholder="Optional"
          value={broaderContext.childrenAccompanying}
          onChange={(e) =>
            onChange({
              ...broaderContext,
              childrenAccompanying: e.target.value,
            })
          }
          className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm"
        />
      </div>

      <div className="form-question">
        <label
          htmlFor="support-network"
          className="mb-2.5 block text-sm font-medium text-slate-600"
        >
          Existing support network for tonight
        </label>
        <input
          id="support-network"
          type="text"
          placeholder="e.g. a friend nearby — optional"
          value={broaderContext.supportNetwork}
          onChange={(e) =>
            onChange({ ...broaderContext, supportNetwork: e.target.value })
          }
          className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm"
        />
      </div>

      <TriStateRadio
        id="contactedBefore"
        className={highlightedField === "contactedBefore" ? "field-highlight" : undefined}
        name="contactedBefore"
        label="Has the survivor contacted the hotline before?"
        value={broaderContext.contactedBefore}
        options={triOptions}
        onChange={(v) =>
          onChange({
            ...broaderContext,
            contactedBefore: v as TriState,
          })
        }
      />
    </IntakeSection>
  );
}
