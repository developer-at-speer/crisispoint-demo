import {
  INCIDENT_TYPES,
  INTAKE_SECTION_IDS,
  RELATIONSHIP_OPTIONS,
} from "../data/constants";
import type { IntakeState, TriState } from "../types/intake";
import { IntakeSection } from "./ui/IntakeSection";
import { TriStateRadio } from "./ui/TriStateRadio";

const triOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Unsure" },
];

interface IncidentDetailsSectionProps {
  incidentDetails: IntakeState["incidentDetails"];
  onChange: (details: IntakeState["incidentDetails"]) => void;
}

export function IncidentDetailsSection({
  incidentDetails,
  onChange,
}: IncidentDetailsSectionProps) {
  const toggleIncidentType = (type: string) => {
    const types = incidentDetails.incidentTypes.includes(type)
      ? incidentDetails.incidentTypes.filter((t) => t !== type)
      : [...incidentDetails.incidentTypes, type];
    onChange({ ...incidentDetails, incidentTypes: types });
  };

  return (
    <IntakeSection
      id={INTAKE_SECTION_IDS.incidentDetails}
      title="Incident details"
      tier="Tier 2 · if time allows"
    >
      <div className="form-question">
        <label className="mb-2.5 block text-sm font-medium text-slate-700">
          Select Incident Type(s)
        </label>
        <div className="flex flex-wrap gap-2">
          {INCIDENT_TYPES.map((type) => {
            const selected = incidentDetails.incidentTypes.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleIncidentType(type)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  selected
                    ? "border-brand-accent bg-purple-50 font-medium text-brand"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="form-question">
          <label
            htmlFor="incident-date"
            className="mb-2.5 block text-sm font-medium text-slate-700"
          >
            Date and Time of Incident (approximate is fine)
          </label>
          <input
            id="incident-date"
            type="text"
            placeholder="MM/DD/YYYY"
            value={incidentDetails.incidentDate}
            onChange={(e) =>
              onChange({ ...incidentDetails, incidentDate: e.target.value })
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm"
          />
        </div>
        <div className="form-question">
          <label
            htmlFor="recency"
            className="mb-2.5 block text-sm font-medium text-slate-700"
          >
            Recency
          </label>
          <input
            id="recency"
            type="text"
            value={incidentDetails.recency}
            onChange={(e) =>
              onChange({ ...incidentDetails, recency: e.target.value })
            }
            className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="form-question">
        <label className="mb-2.5 block text-sm font-medium text-slate-700">
          Relationship to person responsible
        </label>
        <div className="flex flex-wrap gap-2">
          {RELATIONSHIP_OPTIONS.map((rel) => {
            const selected = incidentDetails.relationship === rel;
            return (
              <button
                key={rel}
                type="button"
                onClick={() =>
                  onChange({ ...incidentDetails, relationship: rel })
                }
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  selected
                    ? "border-brand-accent bg-purple-50 font-medium text-brand"
                    : "border-slate-300 bg-white text-slate-600"
                }`}
              >
                {rel}
              </button>
            );
          })}
        </div>
      </div>

      <TriStateRadio
        name="accessToLocation"
        label="Does the person responsible have access to the survivor's current location or devices?"
        value={incidentDetails.accessToLocationOrDevices}
        options={triOptions}
        onChange={(v) =>
          onChange({
            ...incidentDetails,
            accessToLocationOrDevices: v as TriState,
          })
        }
      />

      <TriStateRadio
        name="weapons"
        label="Are weapons involved or threatened?"
        value={incidentDetails.weaponsInvolvedOrThreatened}
        options={triOptions}
        onChange={(v) =>
          onChange({
            ...incidentDetails,
            weaponsInvolvedOrThreatened: v as TriState,
          })
        }
      />

      <TriStateRadio
        name="protectionOrder"
        label="Is there an existing protection order?"
        value={incidentDetails.protectionOrder}
        options={triOptions}
        onChange={(v) =>
          onChange({
            ...incidentDetails,
            protectionOrder: v as TriState,
          })
        }
      />
    </IntakeSection>
  );
}
