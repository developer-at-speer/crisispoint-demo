export type CallStatus =
  | "waiting"
  | "active"
  | "linked_to_intake"
  | "missed"
  | "follow_up_required"
  | "completed";

export interface PhoneCall {
  id: string;
  lineName: string;
  status: CallStatus;
  durationSeconds: number;
  priority: "standard" | "high";
  operatorName?: string;
  linkedCaseId?: string;
  referralSent?: boolean;
  trackingId?: string;
}

export interface SystemStatusItem {
  label: string;
  status: "connected" | "online" | "updated" | "degraded";
  detail?: string;
}

/** @deprecated Use PhoneCall — kept for gradual migration */
export type LiveCall = PhoneCall & {
  line?: string;
  lineLabel?: string;
  intakeLabel?: string;
};
