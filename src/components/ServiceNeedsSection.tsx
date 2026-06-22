import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import {
  INTAKE_SECTION_IDS,
  NEED_OPTIONS,
  SERVICE_TYPE_OPTIONS,
} from "../data/constants";
import type { IntakeState } from "../types/intake";
import { SectionHeader } from "./ui/SectionHeader";
import { SquareControl } from "./ui/SquareControl";
import { questionClasses } from "./ui/FormQuestion";

interface ServiceNeedsSectionProps {
  survivorNeeds: IntakeState["survivorNeeds"];
  onChange: (needs: IntakeState["survivorNeeds"]) => void;
  highlightedField: string | null;
}

export function ServiceNeedsSection({
  survivorNeeds,
  onChange,
  highlightedField,
}: ServiceNeedsSectionProps) {
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
      id={INTAKE_SECTION_IDS.serviceNeeds}
      className="scroll-mt-40 overflow-visible rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <SectionHeader title="Service needs" tier="Tier 1 · fast path" />

      <div className="space-y-6">
        <div
          role="group"
          aria-labelledby="service-preference-label"
          className="form-question space-y-3"
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
                  <SquareControl selected={selected} />
                  {opt.label}
                </label>
              );
            })}
          </div>
        </div>

        <div
          role="group"
          aria-labelledby="needs-apply-label"
          className="form-question space-y-3"
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
                  <SquareControl selected={selected} />
                  {opt.label}
                </label>
              );
            })}
          </div>
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
                  <span className="text-sm text-slate-400">
                    Select service types
                  </span>
                ) : (
                  survivorNeeds.serviceTypes.map((type) => (
                    <span
                      key={type}
                      className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium uppercase text-slate-700"
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
                        ? "bg-slate-100 font-medium text-slate-800"
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
      </div>
    </section>
  );
}
