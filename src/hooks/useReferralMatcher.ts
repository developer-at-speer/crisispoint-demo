import { useEffect, useMemo, useState } from "react";
import { agencies } from "../data/agencies";
import type { Agency, ScoredAgency } from "../types/agency";
import type { IntakeState } from "../types/intake";

function scoreAgency(agency: Agency, intake: IntakeState): number {
  let score = 0;

  for (const type of intake.survivorNeeds.serviceTypes) {
    if (agency.serviceTypes.includes(type)) score += 40;
  }

  if (
    intake.survivorNeeds.servicePreference === "women_only" &&
    agency.eligibility.includes("Women only")
  ) {
    score += 25;
  }

  if (
    intake.survivorNeeds.needs.includes("mobility") &&
    agency.accessibility.includes("Wheelchair access")
  ) {
    score += 15;
  }

  if (
    intake.survivorNeeds.needs.includes("interpreter") &&
    agency.languages.includes("FR")
  ) {
    score += 10;
  }

  if (agency.availability === "available") score += 20;
  if (agency.availability === "limited") score += 10;
  if (agency.availability === "waitlist") score -= 5;

  if (intake.survivorNeeds.location.trim()) {
    score -= agency.distanceKm;
  }

  return score;
}

function filterByLocation(agencyList: Agency[], location: string): Agency[] {
  const q = location.trim().toLowerCase();
  if (!q) return agencyList;

  const tokens = q.split(/[\s,.-]+/).filter((t) => t.length >= 2);

  const matched = agencyList.filter((agency) => {
    const haystack = [
      agency.address.toLowerCase(),
      agency.name.toLowerCase(),
      ...agency.serviceAreas.map((a) => a.toLowerCase()),
    ].join(" ");

    const tokenHit = tokens.some(
      (t) =>
        haystack.includes(t) ||
        agency.serviceAreas.some(
          (area) => area.toLowerCase().includes(t) || t.includes(area.toLowerCase()),
        ),
    );

    if (tokenHit) return true;

    if (q.includes("toronto") || q.includes("on")) {
      return agency.distanceKm <= 7;
    }

    return false;
  });

  let result = matched.length > 0 ? matched : agencyList.filter((a) => a.distanceKm <= 4);

  if (q.length >= 18 || /\d/.test(q)) {
    result = result.filter((a) => a.distanceKm <= 5);
  } else if (q.length >= 10) {
    result = result.filter((a) => a.distanceKm <= 7);
  } else if (q.includes("toronto")) {
    result = result.filter((a) => a.distanceKm <= 8);
  }

  return result;
}

export function useReferralMatcher(intake: IntakeState, searchQuery: string) {
  const [isUpdating, setIsUpdating] = useState(false);

  const matches = useMemo(() => {
    const locationFiltered = filterByLocation(
      agencies,
      intake.survivorNeeds.location,
    );

    const scored: ScoredAgency[] = locationFiltered
      .map((agency) => ({
        ...agency,
        score: scoreAgency(agency, intake),
      }))
      .sort((a, b) => b.score - a.score);

    if (!searchQuery.trim()) return scored;

    const q = searchQuery.toLowerCase();
    return scored.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.primaryService.toLowerCase().includes(q) ||
        a.address.toLowerCase().includes(q),
    );
  }, [intake, searchQuery]);

  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 300);
    return () => clearTimeout(timer);
  }, [
    intake.survivorNeeds.location,
    intake.survivorNeeds.serviceTypes,
    intake.survivorNeeds.servicePreference,
    intake.survivorNeeds.needs,
  ]);

  return { matches, isUpdating };
}
