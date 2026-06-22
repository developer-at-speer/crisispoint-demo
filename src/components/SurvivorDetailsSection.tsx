import { Check, X } from "lucide-react";
import { INTAKE_SECTION_IDS } from "../data/constants";
import { getConsentStatusLine, getSurvivorDetailsBorderClass } from "../lib/consentStyles";
import type { ConsentStatus, IntakeState } from "../types/intake";
import { LocationAutocomplete } from "./LocationAutocomplete";
import { SectionHeader } from "./ui/SectionHeader";
import { questionClasses } from "./ui/FormQuestion";

interface SurvivorDetailsSectionProps {
  survivorNeeds: IntakeState["survivorNeeds"];
  consentStatus: ConsentStatus;
  onChange: (needs: IntakeState["survivorNeeds"]) => void;
  highlightedField: string | null;
}

export function SurvivorDetailsSection({
  survivorNeeds,
  consentStatus,
  onChange,
  highlightedField,
}: SurvivorDetailsSectionProps) {
  const consentLine = getConsentStatusLine(consentStatus);
  const ConsentIcon = consentStatus === "granted" ? Check : X;

  return (
    <section
      id={INTAKE_SECTION_IDS.survivorDetails}
      className={`scroll-mt-40 overflow-visible rounded-xl border bg-white p-6 shadow-sm ${getSurvivorDetailsBorderClass(consentStatus)}`}
    >
      <SectionHeader
        title="Survivor details"
        tier="Tier 1 · fast path"
        tierVariant="fastPath"
      />

      {consentLine && (
        <div
          className={`mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide ${consentLine.className}`}
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${consentLine.iconClass}`}
          >
            <ConsentIcon className="h-3 w-3" strokeWidth={3} />
          </span>
          {consentLine.message}
        </div>
      )}

      <div className="space-y-6">
        <div
          id="preferredName"
          className={questionClasses(highlightedField === "preferredName")}
        >
          <label
            htmlFor="preferred-name"
            className="mb-2.5 block text-sm font-medium text-slate-700"
          >
            Name (first or preferred name is fine)
          </label>
          <input
            id="preferred-name"
            type="text"
            value={survivorNeeds.preferredName}
            onChange={(e) =>
              onChange({ ...survivorNeeds, preferredName: e.target.value })
            }
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
          />
        </div>

        <div
          id="location"
          className={questionClasses(highlightedField === "location")}
        >
          <label
            htmlFor="location-input"
            className="mb-2.5 block text-sm font-medium text-slate-700"
          >
            General location / area
          </label>
          <LocationAutocomplete
            id="location-input"
            value={survivorNeeds.location}
            onChange={(location) => onChange({ ...survivorNeeds, location })}
            placeholder="Address, neighbourhood or city"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="form-question">
            <label
              htmlFor="estimated-age"
              className="mb-2.5 block text-sm font-medium text-slate-700"
            >
              Age Estimated
            </label>
            <input
              id="estimated-age"
              type="text"
              placeholder="Years"
              value={survivorNeeds.estimatedAge}
              onChange={(e) =>
                onChange({ ...survivorNeeds, estimatedAge: e.target.value })
              }
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm"
            />
          </div>
          <div className="form-question">
            <label
              htmlFor="gender-identity"
              className="mb-2.5 block text-sm font-medium text-slate-700"
            >
              Gender Identity
            </label>
            <input
              id="gender-identity"
              type="text"
              placeholder="Man, woman, non-binary etc."
              value={survivorNeeds.genderIdentity}
              onChange={(e) =>
                onChange({ ...survivorNeeds, genderIdentity: e.target.value })
              }
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
