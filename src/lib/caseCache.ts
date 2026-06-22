import { seedDashboardCases } from "../data/dashboard";
import type { DashboardCaseListItem, SavedCaseSnapshot } from "../types/savedCase";
import type { SendState } from "../types/intake";

const STORAGE_KEY = "crisispoint-demo-saved-cases";

export function readSavedCases(): Record<string, SavedCaseSnapshot> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, SavedCaseSnapshot>;
  } catch {
    return {};
  }
}

export function writeSavedCases(cases: Record<string, SavedCaseSnapshot>) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export function persistCaseSnapshot(snapshot: SavedCaseSnapshot) {
  const cases = readSavedCases();
  cases[snapshot.caseId] = snapshot;
  writeSavedCases(cases);
}

export function getCaseSnapshot(caseId: string): SavedCaseSnapshot | null {
  return readSavedCases()[caseId] ?? null;
}

function formatRelative(iso: string): string {
  const saved = new Date(iso).getTime();
  const diffMs = Date.now() - saved;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins === 1) return "1 min ago";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs === 1) return "1 hr ago";
  return `${hrs} hr ago`;
}

function deriveStatus(
  sendState: SendState,
  referralQueue: string[],
  consentStatus: SavedCaseSnapshot["intake"]["consentStatus"],
): string {
  if (sendState === "success") {
    return consentStatus === "declined"
      ? "Anonymized referral sent"
      : "Referral sent";
  }
  if (referralQueue.length > 0) return "Pending referral";
  if (consentStatus === "declined") return "Saved — anonymized path";
  return "Saved — intake in progress";
}

export function snapshotToDashboardItem(
  snapshot: SavedCaseSnapshot,
  highlight: boolean,
): DashboardCaseListItem {
  const survivor =
    snapshot.intake.survivorNeeds.preferredName.trim() ||
    "Preferred name withheld";

  return {
    id: snapshot.caseId,
    label: `Case #${snapshot.caseId}`,
    survivor,
    status: deriveStatus(
      snapshot.sendState,
      snapshot.referralQueue,
      snapshot.intake.consentStatus,
    ),
    updated: formatRelative(snapshot.savedAt),
    highlight,
  };
}

export function buildDashboardCaseList(
  lastSavedCaseId: string | null,
): DashboardCaseListItem[] {
  const saved = Object.values(readSavedCases()).sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
  );

  const savedIds = new Set(saved.map((s) => s.caseId));
  const hasSaved = saved.length > 0;
  const savedItems = saved.map((snapshot) =>
    snapshotToDashboardItem(snapshot, snapshot.caseId === lastSavedCaseId),
  );

  const seedItems = seedDashboardCases
    .filter((item) => !savedIds.has(item.id))
    .map((item) => ({
      ...item,
      highlight: !hasSaved && !lastSavedCaseId ? item.highlight : false,
    }));

  return [...savedItems, ...seedItems];
}
