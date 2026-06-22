export type ActivityEventType =
  | "case_created"
  | "call_incoming"
  | "call_answered"
  | "call_ended"
  | "intake_started"
  | "callback_scheduled"
  | "emergency_mode_enabled"
  | "emergency_mode_disabled"
  | "consent_changed"
  | "referral_added"
  | "referral_sent"
  | "agency_response"
  | "note_added"
  | "case_saved"
  | "case_closed";

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: ActivityEventType;
  title: string;
  description?: string;
  actor: string;
  highlight?: boolean;
}
