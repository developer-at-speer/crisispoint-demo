import type { IntakeState, SendState } from "./intake";

export interface SavedCaseSnapshot {
  caseId: string;
  intake: IntakeState;
  referralQueue: string[];
  sendState: SendState;
  savedAt: string;
}

export interface DashboardCaseListItem {
  id: string;
  label: string;
  survivor: string;
  status: string;
  updated: string;
  highlight: boolean;
}
