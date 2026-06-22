import { CASE_NUMBER } from "./constants";
import type { PhoneCall, SystemStatusItem } from "../types/call";

export const initialPhoneCalls: PhoneCall[] = [
  {
    id: "call-001",
    lineName: "Hotline Line 1",
    status: "linked_to_intake",
    durationSeconds: 378,
    priority: "high",
    operatorName: "Julia",
    linkedCaseId: CASE_NUMBER,
  },
  {
    id: "call-002",
    lineName: "Hotline Line 2",
    status: "follow_up_required",
    durationSeconds: 180,
    priority: "standard",
  },
];

export const waitingCallTemplate: Omit<PhoneCall, "id" | "durationSeconds"> = {
  lineName: "Hotline Line 3",
  status: "waiting",
  priority: "standard",
};

export const systemStatusItems: SystemStatusItem[] = [
  { label: "Phone integration", status: "connected", detail: "Salesforce CTI" },
  { label: "Referral system", status: "online" },
  { label: "Agency directory", status: "updated", detail: "12 min ago" },
];
