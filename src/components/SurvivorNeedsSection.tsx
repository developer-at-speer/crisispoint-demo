import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import {
  INTAKE_SECTION_IDS,
  NEED_OPTIONS,
  SERVICE_TYPE_OPTIONS,
} from "../data/constants";
import type { IntakeState, ConsentStatus } from "../types/intake";
import { LocationAutocomplete } from "./LocationAutocomplete";
import { SectionHeader } from "./ui/SectionHeader";
import { questionClasses } from "./ui/FormQuestion";

interface SurvivorNeedsSectionProps {
  survivorNeeds: IntakeState["survivorNeeds"];
  consentStatus: ConsentStatus;
  onChange: (needs: IntakeState["survivorNeeds"]) => void;
  highlightedField: string | null;
}

export function SurvivorNeedsSection({
  survivorNeeds,
  consentStatus,
  onChange,
  highlightedField,
}: SurvivorNeedsSectionProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleServiceType = (type: string) => {
    const types = survivorNeeds.serviceTypes.includes(type)
      ? survivorNeeds.serviceTypes.filter((t) => t !== type)
      : [...survivorNeeds.serviceTypes, type];
    onChange({ ...survivorNeeds, serviceTypes: types });
  };

  const toggleNeed = (needId: string) => {
    const needs = survivorNeeds.needs.includes(needId)
      ? survivorNeeds.needs.filter((n) => n !== needId)
      : [...survivorNeeds.needs, needId];
    onChange({ ...survivorNeeds, needs });
  };

  const preferenceOptions = [
    { value: "women_only", label: "Women only" },
    { value: "mixed_family", label: "Open to mixed/family service" },
    { value: "no_preference", label: "No preference" },
  ] as const;

  return (
    <section
      id={INTAKE_SECTION_IDS.survivorNeeds}
      className="scroll-mt-40 overflow-visible rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <SectionHeader
        title="Survivor details & service needs"
        tier="Tier 1 · fast path"
        sharingStatus={
          consentStatus === "unknown" ? undefined : consentStatus
        }
      />

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
            className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
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
            onChange={(location) =>
              onChange({ ...survivorNeeds, location })
            }
            placeholder="Address, neighbourhood or city"
          />
        </div>

        <div
          id="serviceTypes"
          className={questionClasses(highlightedField === "serviceTypes")}
        >
          <label className="mb-2.5 block text-sm font-medium text-slate-700">
            Service type(s)
          </label>
          <div className="relative z-10">
            <div className="flex min-h-[44px] w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2.5">
              <div className="flex flex-1 flex-wrap gap-1.5">
                {survivorNeeds.serviceTypes.length === 0 ? (
                  <span className="text-sm text-slate-400">Select service types</span>
                ) : (
                  survivorNeeds.serviceTypes.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium uppercase text-slate-700"
                    >
                      {type}
                      <button
                        type="button"
                        onClick={() => toggleServiceType(type)}
                        aria-label={`Remove ${type}`}
                        className="text-slate-500 hover:text-slate-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Open service type menu"
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-slate-50"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            {dropdownOpen && (
              <div className="absolute z-30 mt-2 w-full rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                {SERVICE_TYPE_OPTIONS.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleServiceType(type)}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                      survivorNeeds.serviceTypes.includes(type)
                        ? "bg-purple-50 font-medium text-brand"
                        : ""
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          role="group"
          aria-labelledby="service-preference-label"
          className="form-question space-y-2"
        >
          <div
            id="service-preference-label"
            className="form-question-label text-sm font-medium text-slate-700"
          >
            Service preference
          </div>
          <div role="radiogroup" className="flex flex-wrap gap-4">
            {preferenceOptions.map((opt) => {
              const selected = survivorNeeds.servicePreference === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center gap-2 text-sm ${
                    selected ? "font-medium text-slate-900" : "text-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="servicePreference"
                    checked={selected}
                    onChange={() =>
                      onChange({
                        ...survivorNeeds,
                        servicePreference: opt.value,
                      })
                    }
                    className="sr-only"
                  />
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded border ${
                      selected
                        ? "border-brand-accent bg-brand-accent"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {selected && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  {opt.label}
                </label>
              );
            })}
          </div>
        </div>

        <div
          role="group"
          aria-labelledby="needs-apply-label"
          className="form-question space-y-2"
        >
          <div
            id="needs-apply-label"
            className="form-question-label text-sm font-medium text-slate-700"
          >
            Any of these apply?
          </div>
          <div className="flex flex-wrap gap-4">
            {NEED_OPTIONS.map((opt) => {
              const selected = survivorNeeds.needs.includes(opt.id);
              return (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-center gap-2 text-sm ${
                    selected ? "font-medium text-slate-900" : "text-slate-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleNeed(opt.id)}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded border ${
                      selected
                        ? "border-brand-accent bg-brand-accent"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {selected && (
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  {opt.label}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
