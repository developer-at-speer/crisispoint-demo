import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import type { IntakeState } from "../types/intake";
import { useReferralMatcher } from "../hooks/useReferralMatcher";
import { ReferralCard } from "./ReferralCard";
import { HoverScrollArea } from "./ui/HoverScrollArea";

interface ReferralMatcherProps {
  intake: IntakeState;
  referralQueue: string[];
  onAdd: (agencyId: string) => void;
  onInfo: (agencyId: string) => void;
}

export function ReferralMatcher({
  intake,
  referralQueue,
  onAdd,
  onInfo,
}: ReferralMatcherProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { matches, isUpdating } = useReferralMatcher(intake, searchQuery);

  const highlightWomenOnly =
    intake.survivorNeeds.servicePreference === "women_only";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Live Referral Matcher
        </h2>
        <p className="text-xs text-slate-500">
          Matches updated in real-time based on form data
        </p>
        {isUpdating && (
          <p className="mt-1 text-xs text-brand-accent">Updating matches…</p>
        )}
        {intake.survivorNeeds.location.trim() && (
          <p className="mt-1 text-xs text-slate-500">
            Filtered by location · {matches.length} service
            {matches.length !== 1 ? "s" : ""} nearby
          </p>
        )}

        <div className="relative mt-3">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="search"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
          />
        </div>
      </div>

      <HoverScrollArea
        label="Referral matches"
        maxHeight="100%"
        className="mx-0 min-h-0 flex-1"
      >
        <div className="space-y-3 p-4">
          {matches.length === 0 && intake.survivorNeeds.location.trim() && (
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              No services match this address. Try a broader area or neighbourhood.
            </p>
          )}
          <AnimatePresence mode="popLayout">
            {matches.map((agency, index) => (
              <ReferralCard
                key={agency.id}
                agency={agency}
                isAdded={referralQueue.includes(agency.id)}
                isTopMatch={index === 0}
                onAdd={onAdd}
                onInfo={onInfo}
                highlightWomenOnly={highlightWomenOnly}
              />
            ))}
          </AnimatePresence>
        </div>
      </HoverScrollArea>
    </div>
  );
}
